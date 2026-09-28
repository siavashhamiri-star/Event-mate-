import React, {useState} from 'react';
import {
  Award,
  BadgePercent,
  Building2,
  CheckCircle2,
  Copy,
  Crown,
  FileText,
  Flame,
  Handshake,
  Link2,
  Palette,
  PartyPopper,
  Printer,
  Send,
  Sparkles,
  TrendingUp,
  UserCheck,
  Wand2,
} from 'lucide-react';
import {CurrencyCode, LanguageCode} from '../types';
import {HALL_BRAND_PRESETS, WHY_HALL_OWNERS_BUY_ITEMS} from '../data';
import {formatMoney, formatNumberLocale} from '../utils/formatters';

export interface CustomHallBrand {
  hallName: string;
  agencyType: string;
  managerName: string;
  city: string;
  whatsapp: string;
  slogan: string;
  priceMultiplier: number;
}

interface WhiteLabelAndVisitorSuiteProps {
  lang: LanguageCode;
  currency: CurrencyCode;
  customBrand: CustomHallBrand;
  onUpdateBrand: (brand: CustomHallBrand) => void;
  mode: 'top-customizer' | 'full-pitch-and-invitation';
}

export const WhiteLabelAndVisitorSuite: React.FC<WhiteLabelAndVisitorSuiteProps> = ({
  lang,
  currency,
  customBrand,
  onUpdateBrand,
  mode,
}) => {
  const [studioExpanded, setStudioExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Invitation Letter & 25% Profit-Share Visitor Pitch State
  const [visitorName, setVisitorName] = useState('مهندس کامران رضایی (سفیر رسمی فروش)');
  const [visitorPhone, setVisitorPhone] = useState('09121112233');
  const [visitorCode, setVisitorCode] = useState('EVM-VIP-2500');
  const [selectedLicensePriceToman, setSelectedLicensePriceToman] = useState<number>(48000000);
  const [monthlySalesTarget, setMonthlySalesTarget] = useState<number>(5);

  // 25% Profit Share Math
  const visitorProfitSharePercent = 25;
  const profitPerSaleToman = Math.round(
    (selectedLicensePriceToman * visitorProfitSharePercent) / 100,
  );
  const totalMonthlyVisitorProfitToman = profitPerSaleToman * monthlySalesTarget;

  const handleSelectPreset = (preset: (typeof HALL_BRAND_PRESETS)[number]) => {
    onUpdateBrand({
      hallName: preset.hallName,
      agencyType: preset.agencyType,
      managerName: preset.managerName,
      city: preset.city,
      whatsapp: preset.whatsapp,
      slogan: preset.slogan,
      priceMultiplier: preset.priceMultiplier,
    });
  };

  const buildPersonalizedDemoUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('hall', customBrand.hallName);
    params.set('manager', customBrand.managerName);
    params.set('city', customBrand.city);
    params.set('phone', customBrand.whatsapp);
    params.set('ref', visitorCode);
    return `${baseUrl}?${params.toString()}`;
  };

  const handleCopyDemoLink = () => {
    const url = buildPersonalizedDemoUrl();
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3500);
  };

  const invitationLetterText = `👑 دعوت‌نامه رسمی تجهیز به سامانه هوشمند منوساز، رزرواسیون و محاسبه‌گر اقساط چک صیادی
🌸 ویژه مجموعه فاخر: «${customBrand.hallName}» (${customBrand.city})
محضر مبارک مدیریت محترم، ${customBrand.managerName}
با سلام و تحیات شایسته؛

احتراماً، با توجه به جایگاه ممتاز و خوش‌نامی مجموعه «${customBrand.hallName}» در صنعت تشریفات و میزبانی مجالس، بدین‌وسیله از جنابعالی دعوت می‌شود نسخه شخصی‌سازی‌شده سامانه هوشمند «EventMate VIP | ایونت‌مِیت» را که به صورت اختصاصی با نام و برند مجموعه شما آماده شده است بررسی فرمایید.

✨ چرا تجهیز «${customBrand.hallName}» به این برنامه اختصاصی، سودآوری شما را متحول می‌کند؟
۱. تبدیل شب‌های خالی وسط هفته به قرارداد نقدی (تقویم هوشمند Flash Dates): پر کردن شب‌های کم‌تقاضا با تخفیف هدفمند و افزایش ۱.۵ تا ۳ میلیارد تومانی درآمد سالانه تالار.
۲. حذف جلسات فرسایشی ۳ ساعته قیمت‌گیری حضوری: عروس و داماد پیش از ورود به دفتر تالار، تعداد مهمان و منوی دلخواه خود را در سامانه اختصاصی تالار شما انتخاب کرده و قیمت دقیق هر نفر را مشاهده می‌کنند (افزایش ۳ برابری نرخ تبدیل بازدیدکننده به قرارداد).
۳. محاسبه آنی و بدون خطای اقساط چک صیادی بنفش: محاسبه خودکار مبلغ پیش‌پرداخت نقدی و صدور جدول سررسید ماهانه چک‌های صیادی بدون یک ریال خطای حسابداری.
۴. صدور پیش‌فاکتور رسمی طلاکوب در واتساپ و جیمیل با سربرگ «${customBrand.hallName}»: ارتقای چشمگیر پرستیژ برند تالار در نگاه خانواده‌های عروس و داماد.
۵. استوری‌ساز ۱-کلیکی اینستاگرام (۱۰۸۰×۱۹۲۰ HD): تولید پوسترهای تبلیغاتی شب‌های خالی با نام و شماره تالار در ۵ ثانیه، بدون نیاز به گرافیست.
۶. پاسخگوی خودکار ۲۴ ساعته تشریفات: پاسخگویی هوشمند به استعلام قیمت مشتریان در ساعات تعطیلی دفتر تالار (۱۰ شب تا صبح) به ۵ زبان زنده و ۵ ارز.

🎁 هدیه ویژه جلسه دمو:
نسخه آزمایشی سامانه هم‌اکنون با نام «${customBrand.hallName}» شخصی‌سازی شده و آماده نمایش زنده روی تلفن همراه جنابعالی است.

🔗 لینک دموی اختصاصی مجموعه شما:
${buildPersonalizedDemoUrl()}

با احترام و آرزوی توفیق روزافزون؛
👤 نام مشاور و سفیر رسمی استقرار سامانه: ${visitorName}
🔑 کد رسمی نمایندگی فروش: ${visitorCode}
📞 شماره تماس مستقیم جهت هماهنگی دمو: ${visitorPhone}
🏛️ اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM`;

  const handleCopyInvitationLetter = () => {
    navigator.clipboard?.writeText(invitationLetterText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 3500);
  };

  const handleSendInvitationWhatsApp = () => {
    const cleanPhone = customBrand.whatsapp.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(invitationLetterText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // RENDER MODE 1: TOP-OF-APP INSTANT WHITE-LABEL CUSTOMIZATION BAR & STUDIO
  if (mode === 'top-customizer') {
    return (
      <section className="my-4 rounded-3xl bg-gradient-to-r from-[#FFF0F3] via-[#FFFDF9] to-[#FEF9E7] border-2 border-[#D4AF37] shadow-lg overflow-hidden transition-all">
        <div className="p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#D4AF37] text-white flex items-center justify-center shadow shrink-0">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#2C1E16] text-[#E6C258]">
                  شخصی‌سازی آنی برند تالار و بنگاه تشریفات (White-Label)
                </span>
                <span className="text-sm sm:text-base font-black text-[#E11D48]">
                  {customBrand.hallName}
                </span>
              </div>
              <p className="text-xs text-[#6E5A4F] mt-0.5">
                مدیریت: <b>{customBrand.managerName}</b> • {customBrand.city} • ضریب نرخ منو:{' '}
                <span className="font-mono-num font-bold text-[#9A7411]">
                  {customBrand.priceMultiplier}x
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStudioExpanded(!studioExpanded)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white font-extrabold text-xs shadow hover:brightness-105 transition cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              <span>
                {studioExpanded
                  ? 'بستن پنل شخصی‌سازی تالار'
                  : 'تغییر نام تالار / بنگاه تشریفات (ویژه دمو به تالاردار)'}
              </span>
            </button>

            <a
              href="#invitation-letter"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2C1E16] text-[#E6C258] border border-[#C59B27] font-extrabold text-xs hover:bg-[#3E2723] transition"
            >
              <FileText className="w-4 h-4 text-[#E11D48]" />
              <span>دعوت‌نامه تالاردار + ۲۵٪ سود ویزیتور</span>
            </a>
          </div>
        </div>

        {studioExpanded && (
          <div className="p-5 sm:p-6 bg-white/95 border-t border-[#E6DFD3] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#2C1E16]">
                ⚡ انتخاب سریع یکی از قالب‌های آماده تالارها و بنگاه‌های تشریفات (یا تایپ نام دلخواه در پایین):
              </div>
              <div className="flex flex-wrap gap-2">
                {HALL_BRAND_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                      customBrand.hallName === preset.hallName
                        ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#2C1E16] border-[#D4AF37]/50 hover:border-[#E11D48]'
                    }`}
                  >
                    {preset.hallName}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  ۱. نام اختصاصی تالار، باغ‌عمارت یا بنگاه تشریفات:
                </label>
                <input
                  type="text"
                  value={customBrand.hallName}
                  onChange={(e) =>
                    onUpdateBrand({...customBrand, hallName: e.target.value})
                  }
                  placeholder="مثلاً: باغ‌تالار سلطنتی قصر طلایی"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] text-xs font-bold text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  ۲. نام مدیر محترم تالار / صاحب امتیاز:
                </label>
                <input
                  type="text"
                  value={customBrand.managerName}
                  onChange={(e) =>
                    onUpdateBrand({...customBrand, managerName: e.target.value})
                  }
                  placeholder="مثلاً: جناب آقای حاج محمد کریمی"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] text-xs font-bold text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  ۳. شهر، منطقه یا آدرس تالار:
                </label>
                <input
                  type="text"
                  value={customBrand.city}
                  onChange={(e) => onUpdateBrand({...customBrand, city: e.target.value})}
                  placeholder="مثلاً: تهران — احمدآباد مستوفی"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] text-xs font-bold text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  ۴. شماره واتساپ مدیر تالار (جهت دریافت آنی پیش‌فاکتورها):
                </label>
                <input
                  type="tel"
                  value={customBrand.whatsapp}
                  onChange={(e) =>
                    onUpdateBrand({...customBrand, whatsapp: e.target.value})
                  }
                  placeholder="98912..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] text-xs font-mono-num font-bold text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  ۵. شعار اختصاصی تالار در سربرگ فاکتور و استوری:
                </label>
                <input
                  type="text"
                  value={customBrand.slogan}
                  onChange={(e) => onUpdateBrand({...customBrand, slogan: e.target.value})}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] text-xs text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  ۶. ضریب سطح قیمت منوهای این تالار ({customBrand.priceMultiplier} برابر):
                </label>
                <input
                  type="range"
                  min={0.75}
                  max={1.5}
                  step={0.05}
                  value={customBrand.priceMultiplier}
                  onChange={(e) =>
                    onUpdateBrand({
                      ...customBrand,
                      priceMultiplier: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#E11D48] cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E6DFD3]">
              <div className="text-xs text-[#6E5A4F]">
                💡 <b>راهنمای ویزیتورها:</b> نام تالار مشتری را در کادر بالا بنویسید؛ کل برنامه، پیش‌فاکتور واتساپ، ایمیل و استوری‌ساز فوراً به نام همان تالار تغییر می‌کند!
              </div>
              <button
                type="button"
                onClick={handleCopyDemoLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-extrabold text-xs shadow hover:bg-emerald-800 transition cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
                <span>
                  {copiedLink
                    ? '✅ لینک اختصاصی این تالار کپی شد!'
                    : 'کپی لینک دموی اختصاصی با نام همین تالار'}
                </span>
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  // RENDER MODE 2: WHY HALL OWNERS MUST BUY + 25% VISITOR PROFIT MECHANISM + INVITATION LETTER
  return (
    <div className="space-y-10 py-6">
      {/* SECTION A: WHY EVERY HALL OWNER & WEDDING AGENCY MUST BUY THIS APP */}
      <section
        id="why-buy"
        className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FFF0F3] to-[#FEF9E7] border-2 border-[#D4AF37] shadow-xl adhd-dimmable"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E11D48] text-white text-xs font-extrabold shadow-sm">
              <Crown className="w-4 h-4" />
              <span>ویژه مدیران تالارها، باغ‌عمارت‌ها و بنگاه‌های تشریفات</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1E16] mt-2">
              چرا هر تالاردار هوشمند باید همین امروز «EventMate VIP» را برای مجموعه خود بخرد؟
            </h2>
            <p className="text-sm text-[#6E5A4F] mt-1">
              ۶ تحول مستقیم در افزایش فروش شب‌های خالی، حذف چانه‌زنی‌های فرسایشی و اتوماسیون ۱۰۰٪ محاسبات چک صیادی برای مجموعه «{customBrand.hallName}»
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#2C1E16] text-[#FAF7F2] border border-[#C59B27] shrink-0 text-center">
            <div className="text-[11px] text-[#E6C258] font-bold">بازگشت سرمایه تالاردار (ROI):</div>
            <div className="font-mono-num text-lg font-black text-emerald-400 mt-0.5">
              با رزرو فقط ۱ شب خالی!
            </div>
            <div className="text-[10px] text-[#E6DFD3]">
              کل هزینه سالانه برنامه در اولین قرارداد جبران می‌شود
            </div>
          </div>
        </div>

        {/* 6 Concrete Value Pillars for Hall Owners */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {WHY_HALL_OWNERS_BUY_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl p-5 bg-white border-2 border-[#E6DFD3] hover:border-[#E11D48] transition shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-[#E11D48] border border-rose-200 text-[11px] font-extrabold">
                    {item.badge}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-[#2C1E16] text-[#E6C258] font-mono-num text-xs font-black flex items-center justify-center">
                    {formatNumberLocale(index + 1, lang)}
                  </span>
                </div>

                <h3 className="font-black text-base text-[#2C1E16] leading-snug">
                  {item.title}
                </h3>

                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-950 leading-relaxed">
                  <b>❌ مشکل سنتی تالاردار:</b> {item.problem}
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                  <b>✅ راه‌حل خودکار برنامه:</b> {item.solution}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E6DFD3] flex items-center gap-1.5 text-xs font-extrabold text-[#9A7411]">
                <TrendingUp className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span>سود مالی تالار: {item.financialImpact}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Before vs After Table for Hall Managers */}
        <div className="mt-8 rounded-2xl overflow-hidden border-2 border-[#C59B27] bg-white">
          <div className="bg-[#2C1E16] text-[#E6C258] px-5 py-3 font-extrabold text-sm flex items-center justify-between">
            <span>📊 جدول مقایسه عملکرد تالار قبل و بعد از استقرار سامانه اختصاصی EventMate VIP</span>
            <span className="text-xs text-rose-300">گزارش تحلیلی ویژه مدیران تالار</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#E6DFD3] text-xs">
            <div className="p-4 space-y-2">
              <div className="font-black text-sm text-rose-700">۱. زمان اعلام قیمت و صدور پیش‌فاکتور</div>
              <p className="text-[#6E5A4F]">
                <b>روش سنتی:</b> ۴۵ دقیقه حساب‌وکتاب دستی روی کاغذ و ماشین‌حساب با احتمال بالای خطا.
              </p>
              <p className="text-emerald-800 font-bold">
                <b>با EventMate VIP:</b> کمتر از ۱۰ ثانیه به صورت زنده با سربرگ اختصاصی تالار در واتساپ و جیمیل مشتری!
              </p>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-black text-sm text-rose-700">۲. وضعیت شب‌های خالی وسط هفته</div>
              <p className="text-[#6E5A4F]">
                <b>روش سنتی:</b> سوخت شدن کامل شب‌های دوشنبه و سه‌شنبه به دلیل عدم اطلاع عروس و دامادها از آفرهای تالار.
              </p>
              <p className="text-emerald-800 font-bold">
                <b>با EventMate VIP:</b> نمایش شمارش معکوس «Flash Dates» و پر شدن تا ۸۵٪ شب‌های خالی سال!
              </p>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-black text-sm text-rose-700">۳. مدیریت اقساط و چک‌های صیادی</div>
              <p className="text-[#6E5A4F]">
                <b>روش سنتی:</b> سردرگمی در محاسبه سررسیدها، درصد پیش‌پرداخت و اختلاف حساب با خانواده عروس و داماد.
              </p>
              <p className="text-emerald-800 font-bold">
                <b>با EventMate VIP:</b> تولید خودکار جدول ۳ تا ۱۲ فقره چک صیادی با تاریخ و مبلغ دقیق هر برگ چک!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: 25% PROFIT-SHARE VISITOR MECHANISM & OFFICIAL HALL OWNER INVITATION LETTER */}
      <section
        id="invitation-letter"
        className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border-2 border-[#E11D48] shadow-2xl adhd-dimmable"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white text-xs font-extrabold shadow-sm">
              <BadgePercent className="w-4 h-4" />
              <span>طرح طلایی کسب درآمد بازاریابان و ویزیتورها (۲۵٪ سود خالص فروش برنامه)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1E16] mt-2">
              سازوکار ۲۵٪ سهم سود ویزیتورها + دعوت‌نامه رسمی آماده ارائه به تالاردارها
            </h2>
            <p className="text-sm text-[#6E5A4F] mt-1">
              این برنامه را با نام هر تالار شخصی‌سازی کنید، دعوت‌نامه رسمی زیر را به مدیر تالار ارائه دهید و <b>۲۵٪ کل مبلغ فروش برنامه</b> را نقداً دریافت نمایید!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FFF0F3] px-5 py-3 rounded-2xl border-2 border-[#E11D48]">
            <Award className="w-9 h-9 text-[#E11D48]" />
            <div>
              <div className="text-xs font-bold text-[#6E5A4F]">سهم تضمین‌شده ویزیتور از هر فروش:</div>
              <div className="font-mono-num text-xl font-black text-[#E11D48]">
                ۲۵٪ سود خالص نقدی
              </div>
              <div className="text-[11px] font-bold text-emerald-800">
                معادل ۱۲ تا ۲۴ میلیون تومان در هر قرارداد!
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Operational Mechanism for Visitors to Sell to Halls & Collect 25% */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37] space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#2C1E16] text-[#E6C258] text-xs font-extrabold">
              گام ۱: شخصی‌سازی ۱۰ ثانیه‌ای
            </span>
            <h4 className="font-black text-sm text-[#2C1E16]">
              تغییر نام برنامه به نام تالار هدف
            </h4>
            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              قبل از ورود به تالار، نام آن تالار و شماره مدیرش را در کادر ниже وارد کنید تا کل برنامه با برند همان تالار آماده نمایش شود.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37] space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#2C1E16] text-[#E6C258] text-xs font-extrabold">
              گام ۲: ارائه دعوت‌نامه رسمی
            </span>
            <h4 className="font-black text-sm text-[#2C1E16]">
              ارسال واتساپی یا تحویل چاپی دعوت‌نامه
            </h4>
            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              دعوت‌نامه طلاکوب زیر را که به نام مدیر تالار صادر شده است با ۱ کلیک به واتساپ ایشان بفرستید یا پرینت بگیرید و حضوری تحویل دهید.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37] space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#2C1E16] text-[#E6C258] text-xs font-extrabold">
              گام ۳: دموی زنده ۲ دقیقه‌ای
            </span>
            <h4 className="font-black text-sm text-[#2C1E16]">
              تست منوساز و چک صیادی توسط تالاردار
            </h4>
            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              وقتی مدیر تالار ببیند پیش‌فاکتور واتساپی و استوری اینستاگرام در ۵ ثانیه با نام تالار خودش صادر می‌شود، بلافاصله تصمیم به خرید می‌گیرد.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF0F3] border-2 border-[#E11D48] space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#E11D48] text-white text-xs font-extrabold">
              گام ۴: دریافت آنی ۲۵٪ سود فروش
            </span>
            <h4 className="font-black text-sm text-[#E11D48]">
              واریز ۱۲ تا ۲۴ میلیون تومان به حساب شما
            </h4>
            <p className="text-xs text-[#2C1E16] leading-relaxed">
              با ثبت کد سفیر شما در هنگام خرید تالاردار، <b>۲۵٪ کل مبلغ فروش برنامه</b> به صورت خودکار و آنی به شبای شما تسویه می‌شود.
            </p>
          </div>
        </div>

        {/* Interactive Visitor 25% Profit Customizer + Official Invitation Letter Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Left Column: Visitor & Target Hall Inputs + 25% Profit Simulator */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37] space-y-4">
            <div className="flex items-center gap-2 text-[#2C1E16] font-black text-base">
              <UserCheck className="w-5 h-5 text-[#E11D48]" />
              <span>تنظیم مشخصات دعوت‌نامه و محاسبه ۲۵٪ سود ویزیتور</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#2C1E16] mb-1">
                  نام تالار / باغ‌تالار یا بنگاه تشریفات مقصد:
                </label>
                <input
                  type="text"
                  value={customBrand.hallName}
                  onChange={(e) =>
                    onUpdateBrand({...customBrand, hallName: e.target.value})
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37] font-bold text-[#2C1E16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#2C1E16] mb-1">
                    نام مدیر محترم تالار:
                  </label>
                  <input
                    type="text"
                    value={customBrand.managerName}
                    onChange={(e) =>
                      onUpdateBrand({...customBrand, managerName: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37] font-bold text-[#2C1E16]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2C1E16] mb-1">
                    واتساپ مدیر تالار:
                  </label>
                  <input
                    type="tel"
                    value={customBrand.whatsapp}
                    onChange={(e) =>
                      onUpdateBrand({...customBrand, whatsapp: e.target.value})
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37] font-mono-num font-bold text-[#2C1E16]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-[#2C1E16] mb-1">
                    نام شما (ویزیتور / بازاریاب):
                  </label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37] text-[#2C1E16]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2C1E16] mb-1">
                    موبایل ویزیتور:
                  </label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37] font-mono-num text-[#2C1E16]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2C1E16] mb-1">
                  پکیج نرم‌افزاری پیشنهادی برای فروش به تالار:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLicensePriceToman(48000000)}
                    className={`p-2.5 rounded-xl border text-start transition cursor-pointer ${
                      selectedLicensePriceToman === 48000000
                        ? 'bg-[#FFF0F3] border-[#E11D48] text-[#2C1E16] font-extrabold'
                        : 'bg-white border-[#E6DFD3] text-[#6E5A4F]'
                    }`}
                  >
                    <div>لایسنس اختصاصی تالار</div>
                    <div className="font-mono-num text-xs text-[#E11D48] mt-0.5">
                      ۴۸ میلیون تومان (سود ۲۵٪ شما: ۱۲ میلیون)
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLicensePriceToman(96000000)}
                    className={`p-2.5 rounded-xl border text-start transition cursor-pointer ${
                      selectedLicensePriceToman === 96000000
                        ? 'bg-[#FEF9E7] border-[#D4AF37] text-[#2C1E16] font-extrabold'
                        : 'bg-white border-[#E6DFD3] text-[#6E5A4F]'
                    }`}
                  >
                    <div>لایسنس VIP هتل و مجموعه</div>
                    <div className="font-mono-num text-xs text-[#9A7411] mt-0.5">
                      ۹۶ میلیون تومان (سود ۲۵٪ شما: ۲۴ میلیون)
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[#2C1E16] mb-1">
                  <span>تعداد فروش ماهانه شما به تالارها:</span>
                  <span className="font-mono-num text-[#E11D48]">
                    {formatNumberLocale(monthlySalesTarget, lang)} تالار در ماه
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={monthlySalesTarget}
                  onChange={(e) => setMonthlySalesTarget(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2C1E16] to-[#3E2723] text-[#FAF7F2] border border-[#C59B27] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E6DFD3]">سود ۲۵٪ شما از هر ۱ فروش:</span>
                  <span className="font-mono-num font-black text-[#E6C258]">
                    {formatMoney(profitPerSaleToman, currency, lang)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/15">
                  <span className="text-[#E6DFD3]">درآمد ماهانه شما ({monthlySalesTarget} تالار):</span>
                  <span className="font-mono-num text-lg font-black text-emerald-400">
                    {formatMoney(totalMonthlyVisitorProfitToman, currency, lang)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Official Gold-Bordered Invitation Letter Ready to Present to Hall Owners */}
          <div className="lg:col-span-7 rounded-3xl p-6 bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] border-4 border-double border-[#C59B27] shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#D4AF37]/40 pb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-[#E11D48]" />
                  <div>
                    <h3 className="font-black text-base text-[#2C1E16]">
                      دعوت‌نامه رسمی تجهیز تالار به سامانه هوشمند منوساز و چک صیادی
                    </h3>
                    <p className="text-[11px] text-[#9A7411] font-bold">
                      اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono-num text-xs font-extrabold border border-emerald-300">
                  کد سفیر: {visitorCode}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E6DFD3] text-xs text-[#2C1E16] leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto font-medium">
                {invitationLetterText}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendInvitationWhatsApp}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-extrabold text-xs shadow hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ارسال دعوت‌نامه به واتساپ تالاردار</span>
              </button>

              <button
                type="button"
                onClick={handleCopyInvitationLetter}
                className="py-3 px-4 rounded-xl bg-[#2C1E16] text-[#E6C258] border border-[#C59B27] font-extrabold text-xs hover:bg-[#3E2723] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>
                  {copiedLetter ? '✅ متن دعوت‌نامه کپی شد!' : 'کپی متن کامل دعوت‌نامه'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="py-3 px-4 rounded-xl bg-[#FFF0F3] text-[#E11D48] border border-rose-300 font-extrabold text-xs hover:bg-rose-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ / PDF دعوت‌نامه رسمی</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
