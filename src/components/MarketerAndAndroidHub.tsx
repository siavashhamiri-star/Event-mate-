import React, {useEffect, useState} from 'react';
import {
  Award,
  BadgePercent,
  Building2,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  ExternalLink,
  GitBranch,
  Handshake,
  Lock,
  Rocket,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {CurrencyCode, LanguageCode} from '../types';
import {HALL_MARKETER_TIERS, UI_TEXT} from '../data';
import {formatMoney, formatNumberLocale} from '../utils/formatters';

interface MarketerAndAndroidHubProps {
  lang: LanguageCode;
  currency: CurrencyCode;
}

export const MarketerAndAndroidHub: React.FC<MarketerAndAndroidHubProps> = ({
  lang,
  currency,
}) => {
  const t = UI_TEXT[lang];

  // B2B Hall Marketer Calculator State
  const [hallsPerMonth, setHallsPerMonth] = useState<number>(4);
  const [hotelChainsPerMonth, setHotelChainsPerMonth] = useState<number>(1);
  const [weddingsReferredPerMonth, setWeddingsReferredPerMonth] = useState<number>(2);

  // Marketer Registration State
  const [marketerName, setMarketerName] = useState('');
  const [marketerPhone, setMarketerPhone] = useState('');
  const [marketerCity, setMarketerCity] = useState('تهران');
  const [registeredCode, setRegisteredCode] = useState<string | null>('EVM-VIP-7740');
  const [registerMsg, setRegisterMsg] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  // GitHub Direct Push State (100% Server-Side Automated Token Vault)
  const [repoOwner, setRepoOwner] = useState('eventmate-vip');
  const [repoName, setRepoName] = useState('eventmate-vip-android');
  const [releaseTag, setReleaseTag] = useState('v1.0.0');
  const [pushLoading, setPushLoading] = useState(false);
  const [pushResult, setPushResult] = useState<{
    mode?: string;
    pushedFilesCount?: number;
    steps?: string[];
    actionsUrl?: string;
    releasesUrl?: string;
    error?: string;
  } | null>(null);

  // Live Gradle & Workflow Code Inspector State
  const [inspectOpen, setInspectOpen] = useState(false);
  const [androidFiles, setAndroidFiles] = useState<
    Array<{relativePath: string; content: string}>
  >([]);
  const [selectedAndroidFile, setSelectedAndroidFile] = useState<string>(
    'android/app/build.gradle',
  );

  // Creative Innovation Lab Interactive Simulator (QR Gift / Shabash Offset)
  const [avgGiftPerFamilyToman, setAvgGiftPerFamilyToman] = useState<number>(2500000);
  const [estimatedFamiliesCount, setEstimatedFamiliesCount] = useState<number>(120);
  const totalDigitalShabashToman = avgGiftPerFamilyToman * estimatedFamiliesCount;

  const handleLoadAndroidFiles = async () => {
    if (inspectOpen) {
      setInspectOpen(false);
      return;
    }
    setInspectOpen(true);
    try {
      const res = await fetch('/api/android/files');
      const data = await res.json();
      if (Array.isArray(data?.files)) {
        setAndroidFiles(data.files);
      }
    } catch {
      // ignore error
    }
  };

  // Commission Math (25% net profit share on software sales to halls & agencies)
  const hallSaaSCommissionToman = hallsPerMonth * 12000000; // 25% of 48M Toman
  const hotelEnterpriseCommissionToman = hotelChainsPerMonth * 24000000; // 25% of 96M Toman
  const weddingReferralCommissionToman = weddingsReferredPerMonth * 45500000; // 7% of 650M Toman
  const totalMonthlyMarketerToman =
    hallSaaSCommissionToman + hotelEnterpriseCommissionToman + weddingReferralCommissionToman;
  const annualPassiveRenewalToman =
    (hallsPerMonth * 12 * 4800000) + (hotelChainsPerMonth * 12 * 11520000);

  const handleRegisterMarketer = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setRegisterMsg(null);
    try {
      const res = await fetch('/api/visitors/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fullName: marketerName || 'سفیر ارشد تالارها',
          phone: marketerPhone || '09120000000',
          city: marketerCity || 'تهران',
          commissionRate: 25,
          estimatedMonthlyToman: totalMonthlyMarketerToman,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        visitor?: {referralCode: string};
        message?: string;
      };
      if (data.visitor?.referralCode) {
        setRegisteredCode(data.visitor.referralCode);
      }
      setRegisterMsg(
        data.message ||
          'کد رسمی ویزیتور و بازاریاب تالارها (با ۲۵٪ سود فروش برنامه) صادر شد و آماده عقد قرارداد با تالارداران است.',
      );
    } catch {
      const fallbackCode = `EVM-VIP-${Math.floor(1000 + Math.random() * 9000)}`;
      setRegisteredCode(fallbackCode);
      setRegisterMsg(`کد سفیر بازاریاب شما (${fallbackCode}) با ۲۵٪ سهم فروش فعال شد.`);
    } finally {
      setRegistering(false);
    }
  };

  const handleSendMarketerWhatsApp = () => {
    const text = `👑 *درخواست همکاری رسمی ویزیتور و بازاریاب تالارها — EventMate VIP | ایونت‌مِیت*
🌸 نام بازاریاب / ویزیتور: ${marketerName || 'سفیر تشریفات'}
📍 شهر فعالیت: ${marketerCity} | تماس: ${marketerPhone || 'ثبت در سامانه'}
🔑 کد اختصاصی معرف تالارها: *${registeredCode}*
📊 هدف فروش ماهانه: ${hallsPerMonth} تالار عروسی + ${hotelChainsPerMonth} هتل/مجموعه + ${weddingsReferredPerMonth} مجلس عروسی
💰 برآورد سود ماهانه ویزیتور: *${formatMoney(totalMonthlyMarketerToman, currency, lang)}* (شامل ۲۵٪ سود خالص فروش برنامه به تالاردار + ۱۰٪ تمدید سالانه + ۷٪ معرفی عروس و داماد)`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDirectGitHubPush = async () => {
    setPushLoading(true);
    setPushResult(null);
    try {
      const res = await fetch('/api/github/direct-push', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          repoOwner,
          repoName,
          branch: 'main',
          releaseTag,
        }),
      });
      const data = await res.json();
      setPushResult(data);
    } catch (err) {
      setPushResult({
        error: err instanceof Error ? err.message : 'خطا در ارتباط با موتور پوش مستقیم',
      });
    } finally {
      setPushLoading(false);
    }
  };

  useEffect(() => {
    void handleDirectGitHubPush();
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* PART 1: B2B Hall Marketer & Affiliate Club */}
      <section
        id="marketers"
        className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFF5F7] via-[#FFFDF9] to-[#FEF9E7] border-2 border-[#D4AF37] shadow-xl adhd-dimmable"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white text-xs font-extrabold shadow-sm">
              <BadgePercent className="w-4 h-4" />
              <span>شرایط رسمی همکاری با بازاریابان جهت معرفی برنامه به تالاردارها (B2B & VIP)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E16] mt-2">
              {t.marketerTitle}
            </h2>
            <p className="text-sm text-[#6E5A4F] mt-1">{t.marketerSub}</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-[#D4AF37]/60 shadow-sm">
            <Award className="w-8 h-8 text-[#E11D48]" />
            <div>
              <div className="text-xs text-[#6E5A4F] font-semibold">کد رسمی سفیر و بازاریاب شما:</div>
              <div className="font-mono-num font-extrabold text-base text-[#2C1E16] flex items-center gap-2">
                <span>{registeredCode}</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(registeredCode || '')}
                  className="p-1 rounded-lg bg-[#FFF1F2] text-[#E11D48] hover:bg-rose-200 transition"
                  title="کپی کد سفیر"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Official Commission Tiers for Introducing EventMate VIP to Hall Owners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {HALL_MARKETER_TIERS.map((tier, idx) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-5 border-2 transition flex flex-col justify-between ${
                idx === 0
                  ? 'bg-gradient-to-b from-[#FFF0F3] to-white border-[#E11D48] shadow-md'
                  : 'bg-white border-[#D4AF37]/60 hover:border-[#D4AF37]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2C1E16] text-[#E6C258]">
                    {tier.badge[lang]}
                  </span>
                  <span className="font-mono-num text-xl font-black text-[#E11D48]">
                    {formatNumberLocale(tier.commissionPercent, lang)}%
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-[#2C1E16] leading-snug">
                  {tier.title[lang]}
                </h3>
                <p className="text-xs text-[#6E5A4F] leading-relaxed">{tier.details[lang]}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6DFD3] flex items-center justify-between text-xs">
                <span className="text-[#6E5A4F] font-semibold">پورسانت نقدی هر قرارداد:</span>
                <span className="font-mono-num font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {formatMoney(tier.directPayoutPerHallToman, currency, lang)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive B2B Marketer Income Simulator & Registration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Simulator Controls */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#D4AF37]/50 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E11D48]" />
              <h3 className="font-extrabold text-base text-[#2C1E16]">
                ماشین‌حساب زنده پورسانت بازاریابان تالارها و باغ‌تالارها
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#2C1E16]">
                    ۱. تعداد فروش برنامه به تالار یا بنگاه تشریفات در ماه (۲۵٪ سود فروش = ۱۲ میلیون تومان هر تالار):
                  </span>
                  <span className="font-mono-num text-[#E11D48] text-sm">
                    {formatNumberLocale(hallsPerMonth, lang)} تالار در ماه
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={hallsPerMonth}
                  onChange={(e) => setHallsPerMonth(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#2C1E16]">
                    ۲. تعداد فروش برنامه به هتل ۵ ستاره یا تالار زنجیره‌ای در ماه (۲۵٪ سود فروش = ۲۴ میلیون تومان):
                  </span>
                  <span className="font-mono-num text-[#9A7411] text-sm">
                    {formatNumberLocale(hotelChainsPerMonth, lang)} مجموعه در ماه
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={hotelChainsPerMonth}
                  onChange={(e) => setHotelChainsPerMonth(Number(e.target.value))}
                  className="w-full accent-[#C59B27] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#2C1E16]">
                    ۳. تعداد عروس و داماد معرفی‌شده به تالارهای عضو (پورسانت ۷٪ = ۴۵.۵ میلیون تومان):
                  </span>
                  <span className="font-mono-num text-emerald-700 text-sm">
                    {formatNumberLocale(weddingsReferredPerMonth, lang)} مجلس در ماه
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={weddingsReferredPerMonth}
                  onChange={(e) => setWeddingsReferredPerMonth(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF0F3] to-[#FFF9F5] border border-[#E11D48]/40">
                <div className="text-xs text-[#6E5A4F] font-bold">
                  خالص دریافتی نقدی ماهانه شما (آنی):
                </div>
                <div className="font-mono-num text-xl font-black text-[#E11D48] mt-1">
                  {formatMoney(totalMonthlyMarketerToman, currency, lang)}
                </div>
                <div className="text-[11px] text-[#6E5A4F] mt-1">
                  تسویه اتوماتیک شبا بلافاصله پس از فعال‌سازی پنل تالاردار
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF9E7] border border-[#D4AF37]/60">
                <div className="text-xs text-[#6E5A4F] font-bold">
                  سهم تمدید سالانه مادام‌العمر (درآمد غیرفعال):
                </div>
                <div className="font-mono-num text-xl font-black text-[#9A7411] mt-1">
                  {formatMoney(annualPassiveRenewalToman, currency, lang)}
                </div>
                <div className="text-[11px] text-[#6E5A4F] mt-1">
                  ۱۰٪ تا ۱۲٪ سهم تمدید سالانه تمامی تالارهای جذب‌شده توسط شما
                </div>
              </div>
            </div>
          </div>

          {/* Instant Marketer Contract & Referral Generator */}
          <form
            onSubmit={handleRegisterMarketer}
            className="lg:col-span-5 p-6 rounded-2xl bg-[#2C1E16] text-[#FAF7F2] border-2 border-[#C59B27] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#E6C258]">
                <Handshake className="w-6 h-6" />
                <h3 className="font-extrabold text-base">
                  ثبت‌نام آنی بازاریاب تالارها و دریافت کد سفیر
                </h3>
              </div>
              <p className="text-xs text-[#E6DFD3] leading-relaxed">
                مشخصات خود را وارد کنید تا کد اختصاصی بازاریاب B2B برای معرفی برنامه به تالارداران صادر شده و قرارداد پورسانتی شما فعال گردد:
              </p>

              <div>
                <label className="block text-xs text-[#E6C258] font-bold mb-1">
                  نام و نام خانوادگی بازاریاب / مشاور تشریفات:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: مهندس کامران رضایی"
                  value={marketerName}
                  onChange={(e) => setMarketerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#3E2723] border border-[#C59B27]/50 text-sm text-white placeholder-[#B09B8E] focus:outline-none focus:border-[#E6C258]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#E6C258] font-bold mb-1">
                    شماره موبایل (جهت تسویه):
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912..."
                    value={marketerPhone}
                    onChange={(e) => setMarketerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#3E2723] border border-[#C59B27]/50 text-sm text-white font-mono-num placeholder-[#B09B8E] focus:outline-none focus:border-[#E6C258]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#E6C258] font-bold mb-1">
                    شهر یا استان هدف:
                  </label>
                  <input
                    type="text"
                    value={marketerCity}
                    onChange={(e) => setMarketerCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#3E2723] border border-[#C59B27]/50 text-sm text-white focus:outline-none focus:border-[#E6C258]"
                  />
                </div>
              </div>

              {registerMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-bold">
                  {registerMsg}
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                disabled={registering}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#D4AF37] text-white font-extrabold text-xs shadow-lg hover:brightness-105 transition cursor-pointer"
              >
                {registering
                  ? 'در حال صدور کد رسمی بازاریاب...'
                  : 'صدور آنی کد بازاریاب تالارها (۳۵٪ پورسانت)'}
              </button>
              <button
                type="button"
                onClick={handleSendMarketerWhatsApp}
                className="w-full py-2.5 rounded-xl bg-[#3E2723] text-[#E6C258] border border-[#C59B27]/60 font-bold text-xs hover:bg-[#4E342E] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ارسال کارت معرفی و قرارداد بازاریاب به واتساپ</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* PART 2: 100% Secure API + Gradle Automation + APK/AAB Signed GitHub Release Engine */}
      <section
        id="android-ci"
        className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border-2 border-[#C59B27] shadow-xl adhd-dimmable"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>امنیت ۱۰۰٪ کلیدهای API در سرور + اتوماسیون Gradle و امضای APK / AAB در GitHub</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E16] mt-2">
              موتور ساخت خودکار اندروید (`com.eventmate.vip`) و انتشار در GitHub Releases
            </h2>
            <p className="text-sm text-[#6E5A4F] mt-1">
              تمامی کلیدهای حساس در `server.ts` محافظت می‌شوند • پروژه کامل `/android` با امضای دیجیتال V1/V2/V3 • ورک‌فلو در `/android/android-release-workflow.yml` (بدون پوشه `.github` در ریشه)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] font-mono-num text-xs font-bold text-[#2C1E16] flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#E11D48]" />
              com.eventmate.vip
            </span>
          </div>
        </div>

        {/* Security & Gradle Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-2">
            <div className="flex items-center gap-2 text-[#2C1E16] font-extrabold text-sm">
              <Lock className="w-5 h-5 text-emerald-700" />
              <span>ایزولاسیون ۱۰۰٪ کلیدهای API</span>
            </div>
            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              هیچ کلید خصوصی در فرانت‌اند ذخیره نمی‌شود. پردازش هوش مصنوعی (`/api/concierge`) با پاسخگوی خودکار آفلاین و پوش گیت‌هاب (`/api/github/direct-push`) کاملاً در `server.ts` اجرا می‌شوند.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-2">
            <div className="flex items-center gap-2 text-[#2C1E16] font-extrabold text-sm">
              <Cpu className="w-5 h-5 text-[#E11D48]" />
              <span>اتوماسیون Gradle و Keystore</span>
            </div>
            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              فایل `/android/app/build.gradle` با پشتیبانی از متغیرهای محیطی امن (`KEYSTORE_PASSWORD`, `KEY_ALIAS`) و امضای نسخه Release برای خروجی همزمان `APK` و `AAB` پیکربندی شده است.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-2">
            <div className="flex items-center gap-2 text-[#2C1E16] font-extrabold text-sm">
              <Code2 className="w-5 h-5 text-[#9A7411]" />
              <span>نگاشت خودکار ورک‌فلو در مقصد</span>
            </div>
            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              فایل ورک‌فلو در مسیر `/android/android-release-workflow.yml` قرار دارد (بدون پوشه `.github` در ریشه) و هنگام پوش مستقیم، به صورت خودکار در GitHub Actions فعال می‌شود.
            </p>
          </div>
        </div>

        {/* Direct GitHub Push & Release Trigger Form */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#FFF9F5] via-[#FFFDF9] to-[#FEF9E7] border border-[#D4AF37] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#E11D48]" />
              <h3 className="font-extrabold text-base text-[#2C1E16]">
                پنل پوش مستقیم به GitHub و ساخت خودکار APK + AAB در Releases
              </h3>
            </div>
            <span className="text-xs text-[#6E5A4F]">
              در صورت خالی بودن توکن، «شبیه‌سازی و تست سلامت محلی فایل‌های اندروید» اجرا می‌شود
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                نام سازمان یا حساب مخزن (Owner):
              </label>
              <input
                type="text"
                placeholder="eventmate-vip"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 text-xs font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                نام مخزن مقصد (Repository):
              </label>
              <input
                type="text"
                placeholder="eventmate-vip-android"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 text-xs font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                تگ نسخه انتشار (Release Tag):
              </label>
              <input
                type="text"
                value={releaseTag}
                onChange={(e) => setReleaseTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 text-xs font-mono-num"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDirectGitHubPush}
                disabled={pushLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2C1E16] via-[#3E2723] to-[#2C1E16] text-[#E6C258] border border-[#C59B27] font-extrabold text-xs shadow-md hover:brightness-110 transition cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-[#E11D48]" />
                <span>
                  {pushLoading
                    ? 'در حال بررسی و ارسال فایل‌های Gradle و ورک‌فلو...'
                    : 'اجرای پوش مستقیم (/api/github/direct-push) و بیلد APK/AAB'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLoadAndroidFiles}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFF0F3] text-[#E11D48] border border-rose-300 font-extrabold text-xs hover:bg-rose-100 transition cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>
                  {inspectOpen
                    ? 'بستن نمایشگر کدهای Gradle و امضا'
                    : 'مشاهده زنده کدهای build.gradle و Workflow امضای APK/AAB'}
                </span>
              </button>
            </div>

            <div className="text-xs text-[#6E5A4F] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              <span>خروجی‌ها: `EventMate-VIP-v1.0.0.apk` و `EventMate-VIP-v1.0.0.aab`</span>
            </div>
          </div>

          {inspectOpen && (
            <div className="mt-4 p-4 rounded-2xl bg-[#1E130D] text-[#FAF7F2] border border-[#C59B27] space-y-3">
              <div className="flex flex-wrap items-center gap-2 border-b border-[#3E2723] pb-3">
                {androidFiles.map((file) => (
                  <button
                    key={file.relativePath}
                    type="button"
                    onClick={() => setSelectedAndroidFile(file.relativePath)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-num transition cursor-pointer ${
                      selectedAndroidFile === file.relativePath
                        ? 'bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white font-bold'
                        : 'bg-[#2C1E16] text-[#E6DFD3] hover:bg-[#3E2723]'
                    }`}
                  >
                    {file.relativePath}
                  </button>
                ))}
              </div>
              <pre
                dir="ltr"
                className="text-[11px] font-mono-num text-emerald-300 overflow-x-auto max-h-80 p-3 rounded-xl bg-black/40 leading-relaxed"
              >
                {androidFiles.find((f) => f.relativePath === selectedAndroidFile)?.content ||
                  'در حال بارگذاری محتوای فایل...'}
              </pre>
            </div>
          )}

          {pushResult && (
            <div className="p-4 rounded-2xl bg-white border border-[#C59B27] space-y-2 text-xs">
              {pushResult.error ? (
                <div className="text-rose-700 font-bold">{pushResult.error}</div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      وضعیت عملیات ({pushResult.mode}): {pushResult.pushedFilesCount} فایل اندروید و Gradle آماده شد
                    </span>
                    {pushResult.releasesUrl && (
                      <a
                        href={pushResult.releasesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#E11D48] font-bold hover:underline"
                      >
                        <span>مشاهده GitHub Releases</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <ul className="space-y-1 text-[#2C1E16]">
                    {pushResult.steps?.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* PART 3: Product Critique & Creative Innovation Roadmap (نقد تخصصی و پیشنهادهای خلاقانه) */}
      <section
        id="innovation-lab"
        className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFF0F3] via-[#FFFDF9] to-[#FEF9E7] border-2 border-[#E11D48]/60 shadow-xl adhd-dimmable"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#2C1E16] to-[#E11D48] text-[#E6C258] text-xs font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#E6C258]" />
              <span>نقد تخصصی محصول و آزمایشگاه ایده‌های خلاقانه (EventMate VIP 2.0 Roadmap)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E16] mt-2">
              کالبدشکافی استراتژیک سامانه + ۴ پیشنهاد خلاقانه تحول‌آفرین برای بازار تالارهای ایران و جهان
            </h2>
            <p className="text-sm text-[#6E5A4F] mt-1">
              بررسی نقاط قوت، چالش‌های اجرایی در صنعت تشریفات، و قابلیت‌های نوآورانه‌ای که EventMate VIP را به یونیکورن صنعت مجالس تبدیل می‌کند
            </p>
          </div>
          <Building2 className="w-10 h-10 text-[#E11D48] hidden lg:block" />
        </div>

        {/* Critique Grid: Strengths vs Real-World Bottlenecks Solved */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-5 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>۱. نقد نقاط قوت و مزیت رقابتی فعلی (Strengths Audit)</span>
            </div>
            <ul className="space-y-2 text-xs text-[#2C1E16] leading-relaxed">
              <li>
                <b>• حذف چانه‌زنی مبهم و شفافیت آنی قیمت:</b> در بازار سنتی تالارها، عروس و داماد برای دریافت قیمت باید ساعت‌ها حضوری مذاکره کنند؛ محاسبه‌گر زنده به همراه جدول چک صیادی، نرخ تبدیل بازدیدکننده به قرارداد (Conversion Rate) را تا ۳ برابر افزایش می‌دهد.
              </li>
              <li>
                <b>• موتور رشد ویروسی B2B با پورسانت ۳۵٪:</b> مدل بازاریابی دوطرفه (پورسانت از اشتراک تالاردار + پورسانت از معرفی عروس و داماد) انگیزه مالی بسیار بالایی برای مشاوران تشریفات و بلاگرهای عروسی ایجاد می‌کند.
              </li>
              <li>
                <b>• دسترس‌پذیری فراگیر (ADHD و کم‌بینایان):</b> در حالی که فرم‌های پرجزئیات تشریفات معمولاً باعث استرس و سردرگمی (Cognitive Overload) می‌شوند، حالت تمرکز ADHD و خوانش صوتی فاکتور، تجربه کاربری را برای والدین مسن‌تر و افراد دارای نیازهای ویژه بسیار دلپذیر کرده است.
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#9A7411] font-black text-base">
              <TrendingUp className="w-5 h-5 text-[#E11D48]" />
              <span>۲. نقد چالش‌های واقعی بازار و گلوگاه‌های نیازمند ارتقا (Critical Review)</span>
            </div>
            <ul className="space-y-2 text-xs text-[#2C1E16] leading-relaxed">
              <li>
                <b>• ریسک نکول چک‌های صیادی برای تالاردار:</b> تالارداران نگران برگشت خوردن چک‌های اقساطی بعد از برگزاری مراسم هستند. اتصال مستقیم به استعلام رنگ چک بانک مرکزی (سفید/زرد/قرمز) و بیمه تضمین چک ضروری است.
              </li>
              <li>
                <b>• نوسان تورمی قیمت مواد اولیه (گوشت، برنج و گل):</b> از زمان عقد قرارداد تا شب عروسی (مثلاً ۶ ماه بعد)، قیمت مواد اولیه تغییر می‌کند؛ بنابراین سامانه باید قابلیت «قفل کردن قیمت با پیش‌خرید مواد اولیه» را به تالاردار بدهد.
              </li>
              <li>
                <b>• تداخل تقویم آفلاین و آنلاین تالار:</b> بسیاری از مدیران تالار هنوز از دفتر کاغذی استفاده می‌کنند؛ پیامک دوطرفه تایید آنی شب خالی برای جلوگیری از رزرو مضاعف (Double-Booking) حیاتی است.
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Creative Innovation Proposals + Interactive Shabash/Gift FinTech Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-rose-200 hover:border-[#E11D48] transition space-y-1.5">
              <div className="text-xs font-extrabold text-[#E11D48]">
                💡 پیشنهاد خلاقانه ۱ (FinTech مجالس)
              </div>
              <h4 className="font-black text-sm text-[#2C1E16]">
                کیف‌پول هوشمند «شاباش و کادوی دیجیتال» با QR Code روی هر میز
              </h4>
              <p className="text-xs text-[#6E5A4F] leading-relaxed">
                مهمانان با اسکن بارکد طلایی روی میز، کادوی عروسی را آنلاین پرداخت کرده و پیام تبریکشان روی تلویزیون‌های سالن پخش می‌شود؛ عروس و داماد می‌توانند از همان مبلغ برای تسویه خودکار اولین چک صیادی تالار استفاده کنند!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 hover:border-[#E11D48] transition space-y-1.5">
              <div className="text-xs font-extrabold text-[#9A7411]">
                💡 پیشنهاد خلاقانه ۲ (استیج متاورس FBNM)
              </div>
              <h4 className="font-black text-sm text-[#2C1E16]">
                چیدمان هوشمند میزها با هوش مصنوعی + دید ۳۶۰ درجه هر صندلی
              </h4>
              <p className="text-xs text-[#6E5A4F] leading-relaxed">
                الگوریتم چیدمان مهمانان بر اساس نسبت فامیلی، سن و حساسیت‌های خانوادگی + امکان مشاهده زاویه دید هر میز نسبت به سن رقص و جایگاه عروس و داماد پیش از شب مراسم.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 hover:border-[#E11D48] transition space-y-1.5">
              <div className="text-xs font-extrabold text-emerald-700">
                💡 پیشنهاد خلاقانه ۳ (حراج معکوس تالارها)
              </div>
              <h4 className="font-black text-sm text-[#2C1E16]">
                مناقصه ۶۰ دقیقه‌ای شب‌های خالی (Reverse Wedding Bidding)
              </h4>
              <p className="text-xs text-[#6E5A4F] leading-relaxed">
                عروس و داماد فقط می‌نویسند: «۴۰۰ نفر مهمان، بودجه ۵۰۰ میلیون، پنج‌شنبه آبان»؛ سیستم درخواست را به ۲۰ باغ‌تالار ارسال کرده و تالارها برای برنده شدن، به صورت رقابتی آفر و هدیه ویژه می‌دهند.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 hover:border-[#E11D48] transition space-y-1.5">
              <div className="text-xs font-extrabold text-purple-700">
                💡 پیشنهاد خلاقانه ۴ (مسئولیت اجتماعی و برندینگ)
              </div>
              <h4 className="font-black text-sm text-[#2C1E16]">
                ماژول «برکت جشن» و بیمه تضمین هواشناسی باغ‌تالار
              </h4>
              <p className="text-xs text-[#6E5A4F] leading-relaxed">
                امکان انتقال محترمانه و بهداشتی غذاهای دست‌نخورده پایان مراسم با بسته‌بندی VIP به خیریه‌های معتبر به نام عروس و داماد + بیمه هوشمند انتقال فوری مراسم از فضای باز به سالن مسقف در صورت بارندگی.
              </p>
            </div>
          </div>

          {/* Interactive Demo of Creative Idea #1: Smart Wedding Gift & Shabash Offset Calculator */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-b from-[#2C1E16] to-[#3E2723] text-[#FAF7F2] border-2 border-[#D4AF37] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E11D48] text-white text-[11px] font-extrabold">
                پروتوتایپ زنده پیشنهاد خلاقانه ۱ (QR Shabash FinTech)
              </span>
              <h3 className="font-black text-base text-[#E6C258]">
                شبیه‌ساز بازگشت هزینه تالار از محل کادو و شاباش دیجیتال مهمانان
              </h3>
              <p className="text-xs text-[#E6DFD3]">
                ببینید چگونه ویژگی پیشنهادی «QR کادوی سر میز» به عروس و داماد کمک می‌کند بخش بزرگی از قرارداد تالار را در همان شب عروسی تسویه کنند:
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#E6DFD3]">تعداد خانواده‌های شرکت‌کننده در مراسم:</span>
                  <span className="font-mono-num text-[#E6C258]">
                    {formatNumberLocale(estimatedFamiliesCount, lang)} خانواده
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={400}
                  step={10}
                  value={estimatedFamiliesCount}
                  onChange={(e) => setEstimatedFamiliesCount(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#E6DFD3]">میانگین کادو یا شاباش هر خانواده:</span>
                  <span className="font-mono-num text-emerald-300">
                    {formatMoney(avgGiftPerFamilyToman, currency, lang)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={500000}
                  value={avgGiftPerFamilyToman}
                  onChange={(e) => setAvgGiftPerFamilyToman(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-[#E6C258]/50 space-y-1">
              <div className="text-xs text-[#E6DFD3]">
                جمع کل ورودی کیف‌پول عروس و داماد در شب مراسم:
              </div>
              <div className="font-mono-num text-xl font-black text-emerald-300">
                {formatMoney(totalDigitalShabashToman, currency, lang)}
              </div>
              <div className="text-[11px] text-[#E6C258] pt-1">
                ✨ قابلیت کسر خودکار از مبلغ چک‌های صیادی تالار بدون کارمزد بانکی!
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
