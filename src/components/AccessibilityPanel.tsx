import React from 'react';
import {
  Accessibility,
  Eye,
  Volume2,
  VolumeX,
  Sparkles,
  Type,
  AlignJustify,
  RotateCcw,
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
  const isRTL = lang === 'FA' || lang === 'AR';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E130D]/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Accessibility and ADHD Focus Panel"
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="luxury-card w-full max-w-2xl rounded-3xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between bg-[#2C1E16] text-[#FAF7F2] px-6 py-4 border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59B27] text-[#1E130D] flex items-center justify-center font-bold">
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAF7F2]">
                {lang === 'FA'
                  ? 'پنل هوشمند دسترسی‌پذیری (معلولان، کم‌بینایان و تمرکز ADHD)'
                  : lang === 'AR'
                    ? 'لوحة إمكانية الوصول الذكية (لضعاف البصر وتركيز ADHD)'
                    : 'Accessibility, Voice Invoice Reader & ADHD Focus Suite'}
              </h2>
              <p className="text-xs text-[#E6C258]">
                {lang === 'FA'
                  ? 'استاندارد WCAG AAA + خوانش صوتی زنده پیش‌فاکتور تالار و چک صیادی'
                  : 'WCAG AAA • Live Banquet Invoice Voice Reader • ADHD Focus'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#3E2723] text-[#FAF7F2] hover:bg-[#C59B27] hover:text-[#1E130D] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#C59B27]/50 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#9A7411]" />
                <h3 className="font-bold text-[#2C1E16]">
                  {lang === 'FA'
                    ? 'خوانش صوتی گویا (ویژه نابینایان و کم‌بینایان)'
                    : lang === 'AR'
                      ? 'القارئ الصوتي الذكي للفاتورة والأقساط'
                      : 'Smart Voice Reader for Banquet Proforma Invoice'}
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
                    className={`px-2.5 py-1 rounded-lg font-mono-num text-xs font-semibold transition ${
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
                ? `متن آماده خوانش: پیش‌فاکتور برای ${formatNumberLocale(guestCount, lang)} نفر مهمان، هزینه هر نفر ${formatMoney(perGuestToman, currency, lang)}، جمع کل قرارداد ${formatMoney(totalToman, currency, lang)}، پیش‌پرداخت ${formatMoney(downPaymentToman, currency, lang)} و ${formatNumberLocale(installmentMonths, lang)} فقره چک صیادی هر یک به مبلغ ${formatMoney(eachCheckToman, currency, lang)}. (${selectedNames.length} آیتم انتخابی)`
                : `Ready to read aloud: ${guestCount} guests, ${formatMoney(perGuestToman, currency, lang)} per guest, total contract ${formatMoney(totalToman, currency, lang)}, and ${installmentMonths} Sayyadi checks of ${formatMoney(eachCheckToman, currency, lang)}.`}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={onSpeakInvoice}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold shadow hover:brightness-105 transition"
              >
                <Volume2 className="w-5 h-5" />
                <span>
                  {isSpeaking
                    ? lang === 'FA'
                      ? 'در حال خوانش صوتی فاکتور... (پخش مجدد)'
                      : 'Speaking Invoice... (Restart)'
                    : lang === 'FA'
                      ? 'پخش صوتی کامل پیش‌فاکتور و اقساط صیادی'
                      : lang === 'AR'
                        ? 'تشغيل القراءة الصوتية للفاتورة والشيكات'
                        : 'Speak Full Invoice & Check Schedule Aloud'}
                </span>
              </button>
              {isSpeaking && (
                <button
                  onClick={onStopSpeaking}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#9E2A2B] text-white font-bold hover:opacity-90 transition"
                >
                  <VolumeX className="w-5 h-5" />
                  <span>{lang === 'FA' ? 'توقف صدا' : 'Stop'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  adhdFocusMode: !settings.adhdFocusMode,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 ${
                settings.adhdFocusMode
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Sparkles className="w-6 h-6 text-[#C59B27] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? 'حالت تمرکز عمیق ADHD (ADHD Focus)'
                    : lang === 'AR'
                      ? 'وضع التركيز العميق لـ ADHD'
                      : 'ADHD Deep Focus & Anti-Distraction'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.adhdFocusMode ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'حذف انیمیشن‌های اضافی و کم‌نور کردن بخش‌های غیرفعال برای تمرکز ۱۰۰٪ روی محاسبه فاکتور'
                    : 'Dims inactive cards and stops animations to spotlight the active task'}
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  highContrast: !settings.highContrast,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 ${
                settings.highContrast
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Eye className="w-6 h-6 text-[#C59B27] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? 'کنتراست فوق‌العاده بالا (ویژه کم‌بینایان)'
                    : lang === 'AR'
                      ? 'تباين عالي الوضوح لضعاف البصر'
                      : 'Maximum Contrast Mode (Low Vision)'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.highContrast ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'تبدیل پس‌زمینه به سفید خالص و خطوط مشکی ضخیم جهت خوانایی حداکثری'
                    : 'Sharp black-on-white borders and ultra-crisp text legibility'}
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  readableSpacing: !settings.readableSpacing,
                })
              }
              className={`p-4 rounded-2xl border-2 text-start transition flex items-start gap-3 ${
                settings.readableSpacing
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <AlignJustify className="w-6 h-6 text-[#C59B27] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? 'فاصله‌گذاری خوانا (Dyslexia & Motor Friendly)'
                    : lang === 'AR'
                      ? 'تباعد الأسطر والكلمات المريح للقراءة'
                      : 'Dyslexia-Friendly Line & Word Spacing'}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    settings.readableSpacing ? 'text-[#E6C258]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'افزایش فاصله خطوط و کلمات برای جلوگیری از خستگی چشم هنگام بررسی منو'
                    : 'Expands letter and line spacing for effortless scanning'}
                </p>
              </div>
            </button>

            <div className="p-4 rounded-2xl border-2 border-[#E6DFD3] bg-[#FFFDF9] flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-[#9A7411]" />
                <span className="font-bold text-sm text-[#2C1E16]">
                  {lang === 'FA'
                    ? 'بزرگ‌نمایی متون و اعداد فاکتور:'
                    : lang === 'AR'
                      ? 'تكبير حجم الخط والأرقام:'
                      : 'Font & Number Magnification:'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[100, 110, 120, 130].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => onUpdateSettings({...settings, fontScale: scale})}
                    className={`py-2 rounded-xl font-mono-num text-xs font-bold transition ${
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
                  readableSpacing: false,
                  voiceRate: 1.0,
                })
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6E5A4F] hover:text-[#2C1E16] hover:bg-[#F4EFE6] transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {lang === 'FA' ? 'بازنشانی به حالت پیش‌فرض اشرافی' : 'Reset Settings'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#2C1E16] text-[#E6C258] font-bold text-sm hover:bg-[#3E2723] transition"
            >
              {lang === 'FA' ? 'تأیید و بازگشت' : 'Apply & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
