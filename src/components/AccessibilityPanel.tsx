import React from 'react';
import {
  Accessibility,
  Eye,
  Focus,
  Volume2,
  VolumeX,
  Type,
  RotateCcw,
  X,
  Sparkles,
} from 'lucide-react';
import {AccessibilitySettings, LanguageCode} from '../types';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (next: AccessibilitySettings) => void;
  onSpeakInvoice: () => void;
  onStopSpeaking: () => void;
  isSpeaking: boolean;
  lang: LanguageCode;
  spokenPreviewText: string;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSpeakInvoice,
  onStopSpeaking,
  isSpeaking,
  lang,
  spokenPreviewText,
}) => {
  if (!isOpen) return null;

  const isRtl = lang === 'FA' || lang === 'AR';

  const resetAll = () => {
    onUpdateSettings({
      fontScale: 100,
      highContrast: false,
      adhdFocusMode: false,
      readableSpacing: false,
      voiceRate: 1.0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E130D]/60 backdrop-blur-sm p-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="luxury-card w-full max-w-xl rounded-2xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between bg-[#2C1E16] text-[#FAF7F2] px-6 py-4 border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E6C258]">
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FAF7F2]">
                {lang === 'FA'
                  ? 'پنل هوشمند دسترس‌پذیری (ویژه توان‌یابان، کم‌بینایان و ADHD)'
                  : 'VIP Accessibility Suite (Low-Vision, Voice Invoice & ADHD Focus)'}
              </h3>
              <p className="text-xs text-[#E6C258]">
                {lang === 'FA'
                  ? 'خوانش صوتی فارسی فاکتور + حالت تمرکز ADHD + کنتراست بالا'
                  : 'Persian/Multilingual Voice Readout • ADHD Spotlight • High Contrast'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#FAF7F2]/70 hover:text-[#FAF7F2] hover:bg-white/10 transition"
            aria-label="Close Accessibility Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C59B27]/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-[#9A7411]" />
                <span className="font-bold text-[#2C1E16]">
                  {lang === 'FA'
                    ? 'خوانش صوتی هوشمند پیش‌فاکتور و اقساط صیادی (ویژه کم‌بینایان)'
                    : 'Voice Invoice Reader (For Low-Vision Users)'}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#C59B27]/20 text-[#2C1E16]">
                {isSpeaking
                  ? lang === 'FA'
                    ? '🔊 در حال خوانش صوتی...'
                    : '🔊 Speaking...'
                  : lang === 'FA'
                    ? 'آماده خوانش'
                    : 'Ready'}
              </span>
            </div>

            <p className="text-xs text-[#6E5A4F] leading-relaxed bg-white/80 p-3 rounded-lg border border-[#E6DFD3]">
              {spokenPreviewText}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={isSpeaking ? onStopSpeaking : onSpeakInvoice}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition shadow-sm ${
                  isSpeaking
                    ? 'bg-red-700 text-white hover:bg-red-800'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] hover:brightness-105'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    {lang === 'FA' ? 'توقف خوانش صوتی فاکتور' : 'Stop Voice Readout'}
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    {lang === 'FA'
                      ? 'پخش صوتی کامل پیش‌فاکتور و چک‌های صیادی'
                      : 'Speak Full Invoice & Check Schedule'}
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-[#2C1E16]">
                <span>{lang === 'FA' ? 'سرعت خوانش:' : 'Speed:'}</span>
                {[0.85, 1.0, 1.15].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onUpdateSettings({...settings, voiceRate: rate})}
                    className={`px-2.5 py-1.5 rounded-lg border font-mono-num ${
                      settings.voiceRate === rate
                        ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27]'
                        : 'bg-white text-[#2C1E16] border-[#E6DFD3]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  adhdFocusMode: !settings.adhdFocusMode,
                })
              }
              className={`flex items-start gap-3 p-4 rounded-xl border text-right transition ${
                settings.adhdFocusMode
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27] shadow-md'
                  : 'bg-[#FAF7F2] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Focus
                className={`w-6 h-6 shrink-0 mt-0.5 ${
                  settings.adhdFocusMode ? 'text-[#E6C258]' : 'text-[#9A7411]'
                }`}
              />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? 'حالت تمرکز عمیق (ویژه ADHD)'
                    : 'ADHD Deep Focus Spotlight'}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    settings.adhdFocusMode ? 'text-[#E6DFD3]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'حذف انیمیشن‌های اضافی و برجسته‌سازی کادر فعال برای جلوگیری از حواس‌پرتی'
                    : 'Freezes motion & spotlights the active section under your cursor'}
                </div>
              </div>
            </button>

            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  highContrast: !settings.highContrast,
                })
              }
              className={`flex items-start gap-3 p-4 rounded-xl border text-right transition ${
                settings.highContrast
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27] shadow-md'
                  : 'bg-[#FAF7F2] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Eye
                className={`w-6 h-6 shrink-0 mt-0.5 ${
                  settings.highContrast ? 'text-[#E6C258]' : 'text-[#9A7411]'
                }`}
              />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? 'کنتراست حداکثری (ویژه کم‌بینایان)'
                    : 'High Contrast Mode (AAA)'}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    settings.highContrast ? 'text-[#E6DFD3]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'تضاد نوری حداکثری، ضخیم‌سازی خطوط کادرها و خوانایی فوق‌العاده اعداد'
                    : 'Maximizes text contrast & sharpens card borders for low vision'}
                </div>
              </div>
            </button>

            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  readableSpacing: !settings.readableSpacing,
                })
              }
              className={`flex items-start gap-3 p-4 rounded-xl border text-right transition ${
                settings.readableSpacing
                  ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#C59B27] shadow-md'
                  : 'bg-[#FAF7F2] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
              }`}
            >
              <Sparkles
                className={`w-6 h-6 shrink-0 mt-0.5 ${
                  settings.readableSpacing ? 'text-[#E6C258]' : 'text-[#9A7411]'
                }`}
              />
              <div>
                <div className="font-bold text-sm">
                  {lang === 'FA'
                    ? 'فاصله‌گذاری خوانا (ضد خستگی چشم)'
                    : 'Dyslexia & Readable Spacing'}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    settings.readableSpacing ? 'text-[#E6DFD3]' : 'text-[#6E5A4F]'
                  }`}
                >
                  {lang === 'FA'
                    ? 'افزایش فاصله بین کلمات و خطوط برای مطالعه راحت‌تر قراردادها'
                    : 'Expands line-height and word-spacing for effortless reading'}
                </div>
              </div>
            </button>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] flex flex-col justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[#2C1E16]">
                <Type className="w-5 h-5 text-[#9A7411]" />
                <span>
                  {lang === 'FA'
                    ? 'بزرگ‌نمایی متون و اعداد فاکتور:'
                    : 'Text & Number Zoom Scale:'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[100, 110, 120, 130].map((scale) => (
                  <button
                    key={scale}
                    onClick={() =>
                      onUpdateSettings({...settings, fontScale: scale})
                    }
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono-num border transition ${
                      settings.fontScale === scale
                        ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27]'
                        : 'bg-white text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
                    }`}
                  >
                    {scale}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E6DFD3]">
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#6E5A4F] hover:text-[#2C1E16] transition"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'FA'
                ? 'بازگشت به تنظیمات پیش‌فرض'
                : 'Reset to Default Settings'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#2C1E16] text-[#E6C258] font-bold text-sm hover:bg-[#3E2723] transition"
            >
              {lang === 'FA' ? 'تأیید و بستن' : 'Apply & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
