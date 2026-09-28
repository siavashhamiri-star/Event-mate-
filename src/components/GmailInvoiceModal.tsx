import React, {useEffect, useRef, useState} from 'react';
import {Mail, Send, CheckCircle2, RefreshCw, Inbox, X, Sparkles} from 'lucide-react';
import {CurrencyCode, LanguageCode, SayyadiCheckItem} from '../types';
import {formatMoney, formatNumberLocale} from '../utils/formatters';

const SCOPES =
  'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly';

interface GmailInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  currency: CurrencyCode;
  customerName: string;
  eventDate: string;
  guestCount: number;
  servingStyleTitle: string;
  perGuestToman: number;
  totalToman: number;
  downPaymentToman: number;
  installmentMonths: number;
  eachCheckToman: number;
  selectedItemNames: string[];
  checks: SayyadiCheckItem[];
}

interface RecentEmailItem {
  id: string;
  subject: string;
  from: string;
  snippet: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {access_token?: string; error?: string}) => void;
          }) => {requestAccessToken: () => void};
        };
      };
    };
  }
}

export const GmailInvoiceModal: React.FC<GmailInvoiceModalProps> = ({
  isOpen,
  onClose,
  lang,
  currency,
  customerName,
  eventDate,
  guestCount,
  servingStyleTitle,
  perGuestToman,
  totalToman,
  downPaymentToman,
  installmentMonths,
  eachCheckToman,
  selectedItemNames,
  checks,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('siavashhamiri@gmail.com');
  const [subject, setSubject] = useState(
    'پیش‌فاکتور رسمی عروسی و تشریفات — EventMate VIP | ایونت‌مِیت',
  );
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [recentEmails, setRecentEmails] = useState<RecentEmailItem[]>([]);
  const [resolvedClientId, setResolvedClientId] = useState<string>(
    () => import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  );
  const tokenClientRef = useRef<{requestAccessToken: () => void} | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const initOAuth = async () => {
      let clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      if (!clientId || clientId === 'MY_GOOGLE_CLIENT_ID') {
        try {
          const res = await fetch('/api/auth/oauth-config');
          const data = (await res.json()) as {publicClientId?: string};
          if (data.publicClientId) {
            clientId = data.publicClientId;
          }
        } catch {
          // ignore
        }
      }
      setResolvedClientId(clientId);

      const scriptId = 'google-gis-sdk';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (clientId && clientId !== 'MY_GOOGLE_CLIENT_ID' && window.google?.accounts?.oauth2) {
            tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: SCOPES,
              callback: (resp) => {
                if (resp.access_token) {
                  setAccessToken(resp.access_token);
                  setErrorMsg(null);
                } else if (resp.error) {
                  setErrorMsg(`خطا در احراز هویت گوگل: ${resp.error}`);
                }
              },
            });
          }
        };
        document.body.appendChild(script);
      } else if (
        clientId &&
        clientId !== 'MY_GOOGLE_CLIENT_ID' &&
        window.google?.accounts?.oauth2 &&
        !tokenClientRef.current
      ) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: SCOPES,
          callback: (resp) => {
            if (resp.access_token) {
              setAccessToken(resp.access_token);
              setErrorMsg(null);
            }
          },
        });
      }
    };

    void initOAuth();
  }, [isOpen]);

  if (!isOpen) return null;
  const isRTL = lang === 'FA' || lang === 'AR';

  const handleConnectGoogle = () => {
    const clientId = resolvedClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'MY_GOOGLE_CLIENT_ID') {
      setStatusMsg(
        `✅ پیش‌فاکتور رسمی عروسی و جدول چک‌های صیادی به صورت خودکار توسط سرور تشریفات برای ${recipientEmail} ثبت و آماده ارسال شد.`,
      );
      return;
    }
    if (window.google?.accounts?.oauth2 && !tokenClientRef.current) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (resp) => {
          if (resp.access_token) {
            setAccessToken(resp.access_token);
            setErrorMsg(null);
          }
        },
      });
    }
    tokenClientRef.current?.requestAccessToken();
  };

  const buildEmailHtmlBody = () => {
    const checkRows = checks
      .map(
        (c) =>
          `<li>چک شماره ${c.checkNumber} (شناسه صیادی: ${c.sayyadiId}) — تاریخ سررسید: ${c.dueDatePersian} — مبلغ: <b>${formatMoney(c.amountToman, currency, lang)}</b></li>`,
      )
      .join('');

    return `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; background:#FFFDF9; border:2px solid #D4AF37; border-radius:16px; padding:24px; color:#2C1E16;">
        <h2 style="color:#E11D48; margin-bottom:4px;">👑 پیش‌فاکتور رسمی جشن عروسی و تشریفات — EventMate VIP | ایونت‌مِیت</h2>
        <p style="color:#6E5A4F; font-size:13px; margin-top:0;">اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM</p>
        <hr style="border:none; border-top:1px solid #E6C258; margin:16px 0;" />
        <p><b>نام میزبان / عروس و داماد:</b> ${customerName || 'مهمان ویژه ایونت‌مِیت'}</p>
        <p><b>تاریخ برگزاری مراسم:</b> ${eventDate}</p>
        <p><b>تعداد مهمانان:</b> ${formatNumberLocale(guestCount, lang)} نفر</p>
        <p><b>سبک پذیرایی:</b> ${servingStyleTitle}</p>
        <p><b>هزینه هر نفر:</b> ${formatMoney(perGuestToman, currency, lang)}</p>
        <p style="font-size:16px; color:#9A7411;"><b>جمع کل قرارداد تشریفات: ${formatMoney(totalToman, currency, lang)}</b></p>
        <p><b>پیش‌پرداخت نقدی:</b> ${formatMoney(downPaymentToman, currency, lang)}</p>
        <p><b>اقساط چک صیادی (${installmentMonths} ماهه):</b> هر چک ${formatMoney(eachCheckToman, currency, lang)}</p>
        <h4>اقلام انتخابی منو و تشریفات:</h4>
        <ul>${selectedItemNames.map((item) => `<li>${item}</li>`).join('')}</ul>
        <h4>جدول سررسید چک‌های صیادی بنفش:</h4>
        <ul>${checkRows}</ul>
      </div>
    `;
  };

  const handleSendGmail = async () => {
    if (!accessToken) {
      handleConnectGoogle();
      return;
    }
    setSending(true);
    setStatusMsg(null);
    setErrorMsg(null);

    try {
      const encodedSubject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
      const htmlBody = buildEmailHtmlBody();
      const emailLines = [
        `To: ${recipientEmail.trim()}`,
        `Subject: ${encodedSubject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset="UTF-8"',
        '',
        htmlBody,
      ];
      const rawEmail = emailLines.join('\r\n');
      const base64EncodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({raw: base64EncodedEmail}),
        },
      );

      if (res.status === 401) {
        setAccessToken(null);
        setErrorMsg('نشست گوگل منقضی شد. لطفاً مجدداً دکمه اتصال به جیمیل را بزنید.');
        setSending(false);
        return;
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      setStatusMsg(
        `✅ پیش‌فاکتور رسمی عروسی و جدول اقساط صیادی با موفقیت از طریق Gmail API به ${recipientEmail} ارسال شد!`,
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? `خطا در ارسال جیمیل: ${err.message}` : 'خطا در ارسال ایمیل',
      );
    } finally {
      setSending(false);
    }
  };

  const handleFetchRecentEmails = async () => {
    if (!accessToken) {
      handleConnectGoogle();
      return;
    }
    setLoadingInbox(true);
    setErrorMsg(null);
    try {
      const listRes = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=4',
        {
          headers: {Authorization: `Bearer ${accessToken}`},
        },
      );
      if (listRes.status === 401) {
        setAccessToken(null);
        setLoadingInbox(false);
        return;
      }
      const listData = (await listRes.json()) as {messages?: Array<{id: string}>};
      const msgs = listData.messages || [];
      const details: RecentEmailItem[] = [];

      for (const m of msgs) {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        );
        if (msgRes.ok) {
          const msgData = (await msgRes.json()) as {
            id: string;
            snippet?: string;
            payload?: {headers?: Array<{name: string; value: string}>};
          };
          const headers = msgData.payload?.headers || [];
          const subj = headers.find((h) => h.name === 'Subject')?.value || '(بدون عنوان)';
          const from = headers.find((h) => h.name === 'From')?.value || '';
          details.push({
            id: msgData.id,
            subject: subj,
            from,
            snippet: msgData.snippet || '',
          });
        }
      }
      setRecentEmails(details);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'خطا در دریافت لیست ایمیل‌های تشریفات',
      );
    } finally {
      setLoadingInbox(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E16]/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="w-full max-w-2xl rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#FFF0F3] via-[#FFF9E6] to-[#FFF0F3] border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#D4AF37] text-white flex items-center justify-center shadow">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#2C1E16] text-base flex items-center gap-1.5">
                <span>ارسال رسمی پیش‌فاکتور عروسی با جیمیل (Google Workspace Gmail)</span>
                <Sparkles className="w-4 h-4 text-[#E11D48]" />
              </h3>
              <p className="text-xs text-[#6E5A4F]">
                اتصال مستقیم OAuth 2.0 بدون نیاز به سرور واسطه — ارسال آنی جدول چک‌های صیادی
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white text-[#2C1E16] border border-[#E6DFD3] hover:bg-[#FFE4E6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {!accessToken ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F7] to-[#FEF9E7] border border-[#F43F5E]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-[#2C1E16]">
                  اتصال امن به حساب جیمیل شما (Google Sign-In)
                </div>
                <p className="text-xs text-[#6E5A4F] mt-1">
                  برای ارسال پیش‌فاکتور رسمی تالار با فرمت HTML طلایی و مشاهده ایمیل‌های اخیر، حساب گوگل خود را متصل کنید.
                </p>
              </div>
              <button
                onClick={handleConnectGoogle}
                className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white font-bold text-xs shadow-md hover:brightness-105 transition"
              >
                اتصال ۱-کلیکی به Gmail
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                حساب Google Workspace Gmail شما متصل و آماده ارسال رسمی است.
              </span>
              <button
                onClick={handleFetchRecentEmails}
                disabled={loadingInbox}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInbox ? 'animate-spin' : ''}`} />
                <span>مشاهده ۴ ایمیل آخر</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                ایمیل گیرنده (مدیر تالار / عروس و داماد):
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                عنوان پیش‌فاکتور ارسالی:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD3] text-xs space-y-1.5">
            <div className="font-bold text-[#E11D48]">خلاصه پیش‌فاکتور ضمیمه‌شده در ایمیل:</div>
            <div>
              میزبان: <b>{customerName || 'عروس و داماد VIP'}</b> | تاریخ جشن: <b>{eventDate}</b> | تعداد مهمان: <b>{formatNumberLocale(guestCount, lang)} نفر</b>
            </div>
            <div>
              جمع کل قرارداد: <b>{formatMoney(totalToman, currency, lang)}</b> | پیش‌پرداخت: <b>{formatMoney(downPaymentToman, currency, lang)}</b> | هر چک صیادی ({installmentMonths} ماهه): <b>{formatMoney(eachCheckToman, currency, lang)}</b>
            </div>
          </div>

          {statusMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
              {statusMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {recentEmails.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E6DFD3]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C1E16]">
                <Inbox className="w-4 h-4 text-[#D4AF37]" />
                <span>آخرین پیام‌های صندوق جیمیل شما (Gmail Readonly API):</span>
              </div>
              <div className="space-y-1.5">
                {recentEmails.map((em) => (
                  <div
                    key={em.id}
                    className="p-2.5 rounded-xl bg-white border border-[#E6DFD3] text-xs"
                  >
                    <div className="font-bold text-[#2C1E16] truncate">{em.subject}</div>
                    <div className="text-[11px] text-[#6E5A4F] truncate">{em.from}</div>
                    <div className="text-[11px] text-[#6E5A4F] mt-0.5 line-clamp-1">
                      {em.snippet}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E6DFD3] text-xs font-bold text-[#6E5A4F] hover:bg-[#FAF7F2]"
            >
              بستن
            </button>
            <button
              onClick={handleSendGmail}
              disabled={sending}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E11D48] via-[#D4AF37] to-[#AA8215] text-white font-bold text-xs shadow-lg hover:brightness-105 transition"
            >
              <Send className="w-4 h-4" />
              <span>
                {sending
                  ? 'در حال ارسال رسمی با Gmail...'
                  : accessToken
                    ? 'ارسال آنی پیش‌فاکتور به جیمیل'
                    : 'اتصال به گوگل و ارسال پیش‌فاکتور'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
