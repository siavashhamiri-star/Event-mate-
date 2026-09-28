import React from 'react';
import {
  Accessibility,
  AlignJustify,
  Eye,
  Hand,
  RotateCcw,
  ScanLine,
  Sparkles,
  Type,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {AccessibilitySettings, CurrencyCode, LanguageCode} from '../types';
import {formatMoney, formatNumberLocale} from '../utils/formatters';

export interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (next: AccessibilitySettings) => void;
  lang: LanguageCode;
  currency: CurrencyCode;
  guestCount: number;
  perGuestToman: number;
  totalToman: number;
  downPaymentToman: number;
  installmentMonths: number;
  eachCheckToman: number;
  selectedNames: string[];
  isSpeaking: boolean;
  onSpeakInvoice: () => void;
  onStopSpeaking: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  lang,
  currency,
  guestCount,
  perGuestToman,
  totalToman,
  downPaymentToman,
  installmentMonths,
  eachCheckToman,
  selectedNames,
  isSpeaking,
  onSpeakInvoice,
  onStopSpeaking,
}) => {
  if (!isOpen) return null;
  const isRTL = lang === 'FA' || lang === 'AR' || lang === 'KU';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E130D]/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Accessibility and ADHD Focus Panel"
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="luxury-card w-full max-w-3xl rounded-3xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between bg-[#2C1E16] text-[#FAF7F2] px-6 py-4 border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59B27] text-[#1E130D] flex items-center justify-center font-bold">
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAF7F2]">
                {lang === 'FA'
                  ? 'پنل جامع دسترس‌پذیری معلولان (نابینایان، کم‌بینایان، حرکتی) و تمرکز ADHD'
                  : lang === 'KU'
                    ? 'پانێڵی گشتگیری دەستڕاگەیشتنی خاوەن پێداویستی تایبەت و تەرکیزی ADHD'
                    : lang === 'HY'
                      ? 'Հասանելիության Համակարգ (Տեսողական, Շարժողական) և ADHD Կենտրոնացում'
                      : lang === 'AR'
                        ? 'لوحة إمكانية الوصول الذكية (لذوي الاحتياجات الخاصة وتركيز ADHD)'
                        : 'Full Accessibility (Blind, Low-Vision, Motor) & ADHD Focus Suite'}
              </h2>
              <p className="text-xs text-[#E6C258]">
                {lang === 'FA'
                  ? 'استاندارد جهانی WCAG AAA • خوانش صوتی زنده پیش‌فاکتور • خط‌کش تمرکز ADHD • دکمه‌های بزرگ ویژه معلولیت حرکتی'
                  : 'WCAG AAA • Live Voice Reader • ADHD Reading Guide Ruler • Motor Tremor Assist'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#3E2723] text-[#FAF7F2] hover:bg-[#C59B27] hover:text-[#1E130D] transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* 1. Blind & Visually Impaired Voice Reader */}
          <div className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#C59B27]/50 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#9A7411]" />
                <h3 className="font-bold text-[#2C1E16]">
                  {lang === 'FA'
                    ? '۱. خوانش صوتی گویا (ویژه نابینایان و کم‌بینایان)'
                    : lang === 'KU'
                      ? '١. خوێندنەوەی دەنگی زیرەک (بۆ نابینایان و کەمبینایان)'
                      : lang === 'HY'
                        ? '1. Ձայնային Ընթերցիչ (Տեսողության Խնդիրներ Ունեցողների Համար)'
                        : '1. Smart Voice Reader for Banquet Proforma Invoice'}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6E5A4F]">
                  {lang === 'FA' ? 'سرعت گفتار:' : 'Speed:'}
                </span>
                {[0.85, 1.0, 1.15].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onUpdateSettings({...settings, voiceRate: rate})}
                    className={`px-2.5 py-1 rounded-lg font-mono-num text-xs font-semibold transition cursor-pointer ${
                      settings.voiceRate === rate
                        ? 'bg-[#2C1E16] text-[#E6C258]'
                        : 'bg-[#FFFDF9] text-[#2C1E16] border border-[#C59B27]/40'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              {lang === 'FA'
                ? `متن آماده خوانش صوتی: پیش‌فاکتور برای ${formatNumberLocale(guestCount, lang)} نفر مهمان، هزینه هر نفر ${formatMoney(perGuestToman, currency, lang)}، جمع کل قرارداد ${formatMoney(totalToman, currency, lang)}، پیش‌پرداخت ${formatMoney(downPaymentToman, currency, lang)} و ${formatNumberLocale(installmentMonths, lang)} فقره چک صیادی هر یک به مبلغ ${formatMoney(eachCheckToman, currency, lang)}. (${selectedNames.length} آیتم انتخابی)`
                : `Ready to read aloud: ${guestCount} guests, ${formatMoney(perGuestToman, currency, lang)} per guest, total contract ${formatMoney(totalToman, currency, lang)}, and ${installmentMonths} Sayyadi checks of ${formatMoney(eachCheckToman, currency, lang)}.`}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={onSpeakInvoice}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold shadow hover:brightness-105 transition cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>
                  {isSpeaking
                    ? lang === 'FA'
                      ? 'در حال خوانش صوتی فاکتور... (پخش مجدد)'
                      : 'Speaking Invoice... (Restart)'
                    : lang === 'FA'
                      ? 'پخش صوتی کامل پیش‌فاکتور و اقساط چک صیادی'
                      : 'Speak Full Invoice & Check Schedule Aloud'}
                </span>
              </button>
              {isSpeaking && (
                <button
                  onClick={onStopSpeaking}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#9E2A2B] text-white font-bold hover:opacity-90 transition cursor-pointer"
                >
                  <VolumeX className="w-5 h-5" />
                  <span>{lang === 'FA' ? 'توقف صدا' : 'Stop'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Grid of 6 Specialized Disability & ADHD Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ADHD Deep Focus Mode */}
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  adhdFocusMode: !settings.adhdFocusMode,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 cursor-pointer ${
                settings.adhdFocusMode
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Sparkles className="w-6 h-6 text-[#C59B27] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? '۲. حالت تمرکز عمیق ADHD (حذف شلوغی ذهنی + گام‌به‌گام ۱-۲-۳)'
                    : '2. ADHD Deep Focus & Step-by-Step Guide'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.adhdFocusMode ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'توقف انیمیشن‌ها، کم‌نور کردن حاشیه‌ها و فعال‌سازی نوار خلاصه ۳ مرحله‌ای برای جلوگیری از حواس‌پرتی در محاسبه چک‌ها'
                    : 'Stops animations, dims inactive cards, and activates a calm 3-step summary bar'}
                </p>
              </div>
            </button>

            {/* ADHD Visual Reading Guide Bar */}
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  adhdReadingGuide: !settings.adhdReadingGuide,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 cursor-pointer ${
                settings.adhdReadingGuide
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <ScanLine className="w-6 h-6 text-[#E11D48] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? '۳. خط‌کش نوری تمرکز مطالعه (ویژه ADHD و اختلال کم‌توجهی)'
                    : '3. ADHD Visual Reading Focus Ruler'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.adhdReadingGuide ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'ایجاد نوار راهنمای طلایی که با حرکت ماوس یا لمس، خطِ در حال مطالعه از منو و اقساط را مشخص نگه می‌دارد'
                    : 'Displays a horizontal focus guide bar that follows your cursor or touch across the page'}
                </p>
              </div>
            </button>

            {/* Motor Disability / Hand Tremor Large Targets */}
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  motorLargeTargets: !settings.motorLargeTargets,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 cursor-pointer ${
                settings.motorLargeTargets
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Hand className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? '۴. حالت معلولیت حرکتی و لرزش دست (دکمه‌های بزرگ ۴۸ پیکسل)'
                    : '4. Motor Disability & Tremor Assist (Large Buttons)'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.motorLargeTargets ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'افزایش ابعاد تمام دکمه‌ها، اسلایدرها و کادرهای لمسی برای جلوگیری از کلیک اشتباه توسط معلولان جسمی-حرکتی'
                    : 'Enlarges all buttons, sliders, and touch areas for effortless error-free clicking'}
                </p>
              </div>
            </button>

            {/* High Contrast Mode for Low Vision */}
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  highContrast: !settings.highContrast,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 cursor-pointer ${
                settings.highContrast
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Eye className="w-6 h-6 text-[#C59B27] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? '۵. کنتراست فوق‌العاده بالا (ویژه کم‌بینایان و سالمندان)'
                    : '5. Maximum Contrast Mode (Low Vision WCAG AAA)'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.highContrast ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'تبدیل پس‌زمینه به سفید خالص و خطوط مشکی ضخیم جهت خوانایی حداکثری اعداد و مبالغ چک'
                    : 'Sharp black-on-white borders and ultra-crisp text legibility'}
                </p>
              </div>
            </button>

            {/* Dyslexia & Eye Fatigue Spacing */}
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  readableSpacing: !settings.readableSpacing,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 cursor-pointer ${
                settings.readableSpacing
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <AlignJustify className="w-6 h-6 text-[#C59B27] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? '۶. فاصله‌گذاری خوانا (ویژه دیسلکسیا و خستگی چشم)'
                    : '6. Dyslexia-Friendly Line & Word Spacing'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.readableSpacing ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'افزایش فاصله خطوط و کلمات برای جلوگیری از پرش چشم هنگام بررسی منو و جدول اقساط'
                    : 'Expands letter and line spacing for effortless scanning'}
                </p>
              </div>
            </button>

            {/* Font & Number Magnification */}
            <div className="p-4 rounded-2xl border-2 border-[#E6DFD3] bg-[#FFFDF9] flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-[#9A7411]" />
                <span className="font-bold text-sm text-[#2C1E16]">
                  {lang === 'FA'
                    ? '۷. بزرگ‌نمایی متون و اعداد فاکتور (تا ۱۳۰٪):'
                    : '7. Font & Number Magnification:'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[100, 110, 120, 130].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => onUpdateSettings({...settings, fontScale: scale})}
                    className={`py-2 rounded-xl font-mono-num text-xs font-bold transition cursor-pointer ${
                      settings.fontScale === scale
                        ? 'bg-[#2C1E16] text-[#E6C258] border border-[#C59B27]'
                        : 'bg-[#F4EFE6] text-[#2C1E16] hover:bg-[#E6DFD3]'
                    }`}
                  >
                    {scale}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E6DFD3]">
            <button
              onClick={() =>
                onUpdateSettings({
                  fontScale: 100,
                  highContrast: false,
                  adhdFocusMode: false,
                  adhdReadingGuide: false,
                  motorLargeTargets: false,
                  readableSpacing: false,
                  voiceRate: 1.0,
                })
              }
              className="flex items-center gap-1.5 text-xs font-semibold text-[#6E5A4F] hover:text-[#2C1E16] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {lang === 'FA' ? 'بازگشت به تنظیمات پیش‌فرض' : 'Reset to Defaults'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#2C1E16] text-[#E6C258] text-xs font-bold hover:opacity-90 transition cursor-pointer"
            >
              {lang === 'FA' ? 'ذخیره و بازگشت به برنامه' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
