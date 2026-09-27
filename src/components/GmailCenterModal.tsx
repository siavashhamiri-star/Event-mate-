import React, {useEffect, useState} from 'react';
import {
  Mail,
  Send,
  Inbox,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import {CurrencyCode, LanguageCode, SayyadiCheckItem} from '../types';
import {formatMoney} from '../data/catalog';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {access_token?: string; error?: string}) => void;
          }) => {
            requestAccessToken: (options?: {prompt?: string}) => void;
          };
          revoke: (token: string, done: () => void) => void;
        };
      };
    };
  }
}

const GMAIL_SCOPES =
  'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly';

interface GmailMessageSummary {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

interface GmailCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  currency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  venueTitle: string;
  guestCount: number;
  servingStyleTitle: string;
  perGuestToman: number;
  totalContractToman: number;
  downPaymentToman: number;
  installmentMonths: number;
  eachCheckToman: number;
  selectedItemNames: string[];
  sayyadiChecks: SayyadiCheckItem[];
}

// Helper to encode UTF-8 strings into Base64URL for Gmail API RFC 2822 raw messages
function toBase64UrlUtf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeMimeSubjectUtf8(subject: string): string {
  const bytes = new TextEncoder().encode(subject);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `=?UTF-8?B?${btoa(binary)}?=`;
}

export const GmailCenterModal: React.FC<GmailCenterModalProps> = ({
  isOpen,
  onClose,
  lang,
  currency,
  rates,
  customerName,
  customerPhone,
  eventDate,
  venueTitle,
  guestCount,
  servingStyleTitle,
  perGuestToman,
  totalContractToman,
  downPaymentToman,
  installmentMonths,
  eachCheckToman,
  selectedItemNames,
  sayyadiChecks,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    sessionStorage.getItem('eventmate_gmail_token'),
  );
  const [gsiReady, setGsiReady] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('siavashhamiri@gmail.com');
  const [emailSubject, setEmailSubject] = useState(
    `پیش‌فاکتور رسمی EventMate VIP | ${venueTitle} (${guestCount} نفر)`,
  );
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);

  // Load Google Identity Services script dynamically
  useEffect(() => {
    if (window.google?.accounts?.oauth2) {
      setGsiReady(true);
      return;
    }
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      existing.addEventListener('load', () => setGsiReady(true));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    setEmailSubject(
      `پیش‌فاکتور رسمی EventMate VIP | ${venueTitle} (${guestCount} نفر)`,
    );
  }, [venueTitle, guestCount]);

  const handleConnectGmail = () => {
    setSendResult(null);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.oauth2) {
      setSendResult({
        type: 'error',
        text: 'سرویس احراز هویت گوگل هنوز بارگذاری نشده است؛ لطفاً چند ثانیه دیگر تلاش کنید.',
      });
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GMAIL_SCOPES,
      callback: (response) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
          sessionStorage.setItem('eventmate_gmail_token', response.access_token);
          fetchRecentBanquetEmails(response.access_token);
        } else if (response.error) {
          setSendResult({
            type: 'error',
            text: `خطا در اتصال به جیمیل: ${response.error}`,
          });
        }
      },
    });

    tokenClient.requestAccessToken({prompt: 'consent'});
  };

  const handleDisconnectGmail = () => {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }
    sessionStorage.removeItem('eventmate_gmail_token');
    setAccessToken(null);
    setMessages([]);
  };

  const fetchRecentBanquetEmails = async (tokenToUse?: string) => {
    const token = tokenToUse || accessToken;
    if (!token) return;
    setLoadingInbox(true);
    try {
      const listRes = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (listRes.status === 401) {
        handleDisconnectGmail();
        return;
      }
      if (!listRes.ok) return;
      const listData = (await listRes.json()) as {
        messages?: Array<{id: string}>;
      };
      if (!listData.messages?.length) {
        setMessages([]);
        return;
      }

      const details: GmailMessageSummary[] = [];
      for (const m of listData.messages.slice(0, 5)) {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        if (msgRes.ok) {
          const msgData = (await msgRes.json()) as {
            id: string;
            snippet?: string;
            payload?: {headers?: Array<{name: string; value: string}>};
          };
          const headers = msgData.payload?.headers || [];
          const getH = (n: string) =>
            headers.find((h) => h.name.toLowerCase() === n.toLowerCase())
              ?.value || '';
          details.push({
            id: msgData.id,
            subject: getH('Subject') || '(بدون عنوان)',
            from: getH('From'),
            date: getH('Date'),
            snippet: msgData.snippet || '',
          });
        }
      }
      setMessages(details);
    } catch {
      // Ignore network errors silently
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchRecentBanquetEmails(accessToken);
    }
  }, [isOpen]);

  const buildEmailHtmlBody = () => {
    const checksRows = sayyadiChecks
      .map(
        (chk) =>
          `<tr>
            <td style="padding:8px;border:1px solid #C59B27;">چک شماره ${chk.checkNumber}</td>
            <td style="padding:8px;border:1px solid #C59B27;font-family:monospace;">${chk.sayyadiId}</td>
            <td style="padding:8px;border:1px solid #C59B27;">${chk.dueDatePersian}</td>
            <td style="padding:8px;border:1px solid #C59B27;font-weight:bold;">${formatMoney(chk.amountToman, currency, lang, rates)}</td>
          </tr>`,
      )
      .join('');

    return `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#FAF7F2;color:#2C1E16;padding:24px;border:3px solid #C59B27;border-radius:16px;max-width:680px;margin:0 auto;">
      <div style="background:#2C1E16;color:#E6C258;padding:18px;border-radius:12px;text-align:center;">
        <h2 style="margin:0;font-size:20px;">👑 EventMate VIP | ایونت‌مِیت</h2>
        <p style="margin:6px 0 0;color:#FAF7F2;font-size:12px;">اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM</p>
      </div>
      <h3 style="color:#2C1E16;border-bottom:2px solid #C59B27;padding-bottom:8px;margin-top:20px;">پیش‌فاکتور رسمی رزرو تالار و کترینگ تشریفات</h3>
      <p><strong>نام میزبان / عروس و داماد:</strong> ${customerName || 'مهمان ویژه'} | <strong>تلفن:</strong> ${customerPhone || '-'}</p>
      <p><strong>تالار / پکیج انتخابی:</strong> ${venueTitle}</p>
      <p><strong>تاریخ پیشنهادی مراسم:</strong> ${eventDate} | <strong>تعداد مهمانان:</strong> ${guestCount} نفر | <strong>شیوه پذیرایی:</strong> ${servingStyleTitle}</p>
      <div style="background:#FFFDF9;padding:14px;border:1px solid #E6DFD3;border-radius:10px;margin:14px 0;">
        <strong>آیتم‌های منو و تشریفات انتخاب‌شده:</strong>
        <ul>${selectedItemNames.map((n) => `<li>${n}</li>`).join('')}</ul>
      </div>
      <div style="background:#2C1E16;color:#FAF7F2;padding:16px;border-radius:12px;margin:16px 0;">
        <p style="margin:4px 0;">هزینه هر نفر مهمان: <strong>${formatMoney(perGuestToman, currency, lang, rates)}</strong></p>
        <p style="margin:4px 0;color:#E6C258;font-size:16px;">جمع کل قرارداد: <strong>${formatMoney(totalContractToman, currency, lang, rates)}</strong></p>
        <p style="margin:4px 0;">پیش‌پرداخت نقدی: <strong>${formatMoney(downPaymentToman, currency, lang, rates)}</strong></p>
        <p style="margin:4px 0;color:#A7F3D0;">اقساط ${installmentMonths} ماهه چک صیادی بنفش: ماهانه <strong>${formatMoney(eachCheckToman, currency, lang, rates)}</strong></p>
      </div>
      <h4>جدول سررسید اقساط چک‌های صیادی بنفش:</h4>
      <table style="width:100%;border-collapse:collapse;font-size:13px;background:#FFFDF9;">
        <thead>
          <tr style="background:#E6DFD3;">
            <th style="padding:8px;border:1px solid #C59B27;">ردیف</th>
            <th style="padding:8px;border:1px solid #C59B27;">شناسه ۱۶ رقمی صیادی</th>
            <th style="padding:8px;border:1px solid #C59B27;">سررسید</th>
            <th style="padding:8px;border:1px solid #C59B27;">مبلغ چک</th>
          </tr>
        </thead>
        <tbody>${checksRows}</tbody>
      </table>
    </div>`;
  };

  const handleSendOfficialGmail = async () => {
    if (!accessToken) {
      handleConnectGmail();
      return;
    }
    if (!recipientEmail.trim()) return;

    setSending(true);
    setSendResult(null);
    try {
      const htmlBody = buildEmailHtmlBody();
      const mimeMessage = [
        `To: ${recipientEmail.trim()}`,
        `Subject: ${encodeMimeSubjectUtf8(emailSubject)}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        '',
        htmlBody,
      ].join('\r\n');

      const raw = toBase64UrlUtf8(mimeMessage);
      const res = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({raw}),
        },
      );

      if (res.status === 401) {
        handleDisconnectGmail();
        setSendResult({
          type: 'error',
          text: 'نشست جیمیل منقضی شده است. لطفاً دوباره روی دکمه اتصال به جیمیل کلیک کنید.',
        });
        return;
      }

      if (!res.ok) {
        const errText = await res.text();
        setSendResult({
          type: 'error',
          text: `خطا در ارسال ایمیل (${res.status}): ${errText}`,
        });
        return;
      }

      setSendResult({
        type: 'success',
        text: `✅ پیش‌فاکتور رسمی و جدول اقساط چک صیادی با موفقیت از طریق جیمیل شما به ${recipientEmail} ارسال شد!`,
      });
      fetchRecentBanquetEmails(accessToken);
    } catch (error) {
      setSendResult({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'خطا در برقراری ارتباط با Gmail API',
      });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const isRtl = lang === 'FA' || lang === 'AR';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E130D]/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#2C1E16] text-[#FAF7F2] px-6 py-4 border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E6C258]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#FAF7F2]">
                {lang === 'FA'
                  ? 'مرکز رسمی جیمیل (Google Workspace Gmail Integration)'
                  : 'Official Google Gmail Invoice & Contract Dispatch Center'}
              </h3>
              <p className="text-xs text-[#E6C258]">
                {lang === 'FA'
                  ? 'ارسال مستقیم پیش‌فاکتور تالار و جدول چک‌های صیادی با حساب جیمیل + مشاهده صندوق ایمیل'
                  : 'Send HTML Proforma Invoices via Gmail API + View Recent Emails'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#FAF7F2]/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* OAuth Status Banner */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C59B27]/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#9A7411]" />
              <div>
                <div className="font-bold text-sm text-[#2C1E16]">
                  {accessToken
                    ? lang === 'FA'
                      ? 'متصل به حساب رسمی Google Gmail شما'
                      : 'Connected to Your Google Gmail Account'
                    : lang === 'FA'
                      ? 'اتصال امن ۱-کلیکی به Google Gmail (OAuth 2.0)'
                      : '1-Click Secure Google Gmail Connection'}
                </div>
                <div className="text-xs text-[#6E5A4F]">
                  {accessToken
                    ? 'مجوز ارسال پیش‌فاکتور (gmail.send) و مشاهده ایمیل‌ها (gmail.readonly) فعال است.'
                    : 'برای ارسال رسمی پیش‌فاکتور با فرمت طلایی HTML، حساب جیمیل خود را متصل کنید.'}
                </div>
              </div>
            </div>

            {accessToken ? (
              <button
                onClick={handleDisconnectGmail}
                className="px-3.5 py-2 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                {lang === 'FA' ? 'قطع اتصال جیمیل' : 'Disconnect Gmail'}
              </button>
            ) : (
              <button
                onClick={handleConnectGmail}
                disabled={!gsiReady}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs flex items-center gap-2 shadow-sm hover:brightness-105 transition"
              >
                <Mail className="w-4 h-4" />
                {lang === 'FA'
                  ? 'اتصال حساب جیمیل (Sign in with Google)'
                  : 'Connect Google Gmail'}
              </button>
            )}
          </div>

          {sendResult && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-medium ${
                sendResult.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              {sendResult.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{sendResult.text}</span>
            </div>
          )}

          {/* Send Official Proforma Form */}
          <div className="p-5 rounded-2xl bg-white border border-[#E6DFD3] space-y-4">
            <h4 className="font-bold text-sm text-[#2C1E16] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#9A7411]" />
              <span>
                {lang === 'FA'
                  ? 'ارسال پیش‌فاکتور رسمی و جدول چک‌های صیادی به ایمیل مشتری یا مدیر تالار'
                  : 'Send Official Banquet Proforma & Sayyadi Schedule via Gmail'}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#6E5A4F] mb-1">
                  {lang === 'FA'
                    ? 'آدرس ایمیل گیرنده (مشتری / مدیر تالار):'
                    : 'Recipient Email Address:'}
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-sm text-[#2C1E16] font-mono-num focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6E5A4F] mb-1">
                  {lang === 'FA' ? 'موضوع ایمیل رسمی:' : 'Email Subject:'}
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-sm text-[#2C1E16] focus:outline-none focus:border-[#C59B27]"
                />
              </div>
            </div>

            {/* Invoice Summary Preview */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-xs space-y-1.5 text-[#2C1E16]">
              <div className="flex justify-between font-bold">
                <span>{venueTitle}</span>
                <span>{guestCount} نفر مهمان</span>
              </div>
              <div className="flex justify-between text-[#6E5A4F]">
                <span>
                  جمع کل قرارداد:{' '}
                  <strong className="text-[#2C1E16]">
                    {formatMoney(totalContractToman, currency, lang, rates)}
                  </strong>
                </span>
                <span>
                  اقساط {installmentMonths} ماهه صیادی: ماهانه{' '}
                  <strong className="text-[#9A7411]">
                    {formatMoney(eachCheckToman, currency, lang, rates)}
                  </strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleSendOfficialGmail}
              disabled={sending}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending
                ? lang === 'FA'
                  ? 'در حال ارسال رسمی از طریق Gmail API...'
                  : 'Sending via Gmail API...'
                : accessToken
                  ? lang === 'FA'
                    ? 'ارسال فوری پیش‌فاکتور رسمی با Gmail'
                    : 'Send Official Proforma Now'
                  : lang === 'FA'
                    ? 'اتصال به جیمیل و ارسال پیش‌فاکتور رسمی'
                    : 'Connect Gmail & Send Proforma'}
            </button>
          </div>

          {/* Recent Gmail Messages Inbox Preview */}
          {accessToken && (
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#2C1E16] flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-[#9A7411]" />
                  <span>
                    {lang === 'FA'
                      ? 'آخرین ایمیل‌های حساب جیمیل شما (صندوق ورودی و ارسالی)'
                      : 'Recent Emails from Your Gmail Inbox'}
                  </span>
                </h4>
                <button
                  onClick={() => fetchRecentBanquetEmails(accessToken)}
                  disabled={loadingInbox}
                  className="text-xs font-bold text-[#9A7411] flex items-center gap-1 hover:underline"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${loadingInbox ? 'animate-spin' : ''}`}
                  />
                  {lang === 'FA' ? 'بروزرسانی' : 'Refresh'}
                </button>
              </div>

              {messages.length === 0 ? (
                <p className="text-xs text-[#6E5A4F]">
                  {loadingInbox
                    ? 'در حال دریافت لیست ایمیل‌ها از Gmail API...'
                    : 'ایمیلی یافت نشد.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-white border border-[#E6DFD3] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2 font-bold text-[#2C1E16]">
                        <span className="truncate">{m.subject}</span>
                        <span className="text-[11px] text-[#6E5A4F] font-mono-num shrink-0">
                          {m.date.slice(0, 16)}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#9A7411] truncate">
                        {m.from}
                      </div>
                      <p className="text-[#6E5A4F] line-clamp-1">{m.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
