import React, {useEffect, useRef, useState} from 'react';
import {Camera, Download, Sparkles, X, RefreshCw} from 'lucide-react';
import {CurrencyCode, LanguageCode} from '../types';
import {formatMoney} from '../data/catalog';

interface StoryMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  currency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  venueTitle: string;
  guestCount: number;
  servingStyleTitle: string;
  perGuestToman: number;
  totalContractToman: number;
  downPaymentToman: number;
  installmentMonths: number;
  eachCheckToman: number;
  selectedItemNames: string[];
  flashDiscountPercent: number;
}

type StoryThemeId = 'royal_ivory' | 'imperial_walnut' | 'emerald_gold';

export const StoryMakerModal: React.FC<StoryMakerModalProps> = ({
  isOpen,
  onClose,
  lang,
  currency,
  rates,
  venueTitle,
  guestCount,
  servingStyleTitle,
  perGuestToman,
  totalContractToman,
  downPaymentToman,
  installmentMonths,
  eachCheckToman,
  selectedItemNames,
  flashDiscountPercent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [themeId, setThemeId] = useState<StoryThemeId>('royal_ivory');
  const [customHeadline, setCustomHeadline] = useState(
    'پیشنهاد ویژه رزرو تالار و تشریفات اشرافی',
  );
  const [customContact, setCustomContact] = useState(
    'رزرو و مشاوره: ۰۹۱۲۰۰۰۰۰۰۰ | EventMate VIP',
  );

  const renderCanvasStory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // 1. Background Gradient based on selected theme
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    if (themeId === 'royal_ivory') {
      bgGrad.addColorStop(0, '#FAF7F2');
      bgGrad.addColorStop(0.5, '#F5EFE4');
      bgGrad.addColorStop(1, '#EAE0CF');
    } else if (themeId === 'imperial_walnut') {
      bgGrad.addColorStop(0, '#2C1E16');
      bgGrad.addColorStop(0.5, '#1E130D');
      bgGrad.addColorStop(1, '#3A261B');
    } else {
      bgGrad.addColorStop(0, '#0F291E');
      bgGrad.addColorStop(0.5, '#091A13');
      bgGrad.addColorStop(1, '#163829');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const isLight = themeId === 'royal_ivory';
    const primaryText = isLight ? '#2C1E16' : '#FAF7F2';
    const secondaryText = isLight ? '#5C493E' : '#E6DFD3';
    const goldColor = '#C59B27';
    const goldBright = '#E6C258';

    // 2. Royal Double 24K Gold Frame
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    ctx.strokeStyle = isLight ? '#9A7411' : goldBright;
    ctx.lineWidth = 2;
    ctx.strokeRect(68, 68, W - 136, H - 136);

    // Corner Ornaments
    const corners = [
      [68, 68],
      [W - 68, 68],
      [68, H - 68],
      [W - 68, H - 68],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = goldColor;
      ctx.fill();
    });

    ctx.textAlign = 'center';

    // 3. Top Crest & Brand Header
    ctx.fillStyle = goldColor;
    ctx.font = 'bold 34px Georgia, serif';
    ctx.fillText('👑 EVENTMATE VIP | ایونت‌مِیت 👑', W / 2, 155);

    ctx.fillStyle = secondaryText;
    ctx.font = '600 24px Vazirmatn, sans-serif';
    ctx.fillText(
      'اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM',
      W / 2,
      205,
    );

    // Divider line
    ctx.beginPath();
    ctx.moveTo(180, 235);
    ctx.lineTo(W - 180, 235);
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. Flash Discount Pill if active
    if (flashDiscountPercent > 0) {
      ctx.fillStyle = '#9A1B1B';
      ctx.beginPath();
      ctx.roundRect(W / 2 - 270, 260, 540, 68, 34);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px Vazirmatn, sans-serif';
      ctx.fillText(
        `🔥 ${flashDiscountPercent}٪ تخفیف ویژه شب خالی (Flash Date) 🔥`,
        W / 2,
        304,
      );
    }

    // 5. Custom Story Headline & Venue Name
    ctx.fillStyle = primaryText;
    ctx.font = 'bold 46px Vazirmatn, sans-serif';
    ctx.fillText(customHeadline, W / 2, 395);

    ctx.fillStyle = isLight ? '#9A7411' : goldBright;
    ctx.font = 'bold 34px Vazirmatn, sans-serif';
    ctx.fillText(venueTitle.slice(0, 48), W / 2, 455);

    // 6. Guest & Service Spec Box
    ctx.fillStyle = isLight ? '#2C1E16' : 'rgba(255,253,249,0.08)';
    ctx.beginPath();
    ctx.roundRect(100, 495, W - 200, 145, 24);
    ctx.fill();
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#E6C258';
    ctx.font = 'bold 34px Vazirmatn, sans-serif';
    ctx.fillText(
      `ظرفیت محاسبه‌شده: ${guestCount.toLocaleString('fa-IR')} نفر مهمان`,
      W / 2,
      555,
    );
    ctx.fillStyle = '#FAF7F2';
    ctx.font = '500 26px Vazirmatn, sans-serif';
    ctx.fillText(`شیوه پذیرایی: ${servingStyleTitle}`, W / 2, 608);

    // 7. Selected Menu Items Showcase Card
    ctx.fillStyle = isLight ? '#FFFDF9' : 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(100, 670, W - 200, 520, 28);
    ctx.fill();
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isLight ? '#9A7411' : goldBright;
    ctx.font = 'bold 32px Vazirmatn, sans-serif';
    ctx.fillText('✨ منوی غذا و خدمات تشریفات انتخابی ✨', W / 2, 730);

    const itemsToShow = selectedItemNames.slice(0, 7);
    ctx.fillStyle = primaryText;
    ctx.font = '600 26px Vazirmatn, sans-serif';
    itemsToShow.forEach((item, idx) => {
      const yPos = 795 + idx * 54;
      ctx.fillText(`✦ ${item.slice(0, 52)}`, W / 2, yPos);
    });

    // 8. Financial & Sayyadi Installment Box
    ctx.fillStyle = '#2C1E16';
    ctx.beginPath();
    ctx.roundRect(100, 1225, W - 200, 440, 30);
    ctx.fill();
    ctx.strokeStyle = goldBright;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = goldBright;
    ctx.font = 'bold 30px Vazirmatn, sans-serif';
    ctx.fillText('💎 خلاصه مالی و شرایط اقساط چک صیادی 💎', W / 2, 1288);

    ctx.fillStyle = '#FAF7F2';
    ctx.font = 'bold 36px Vazirmatn, sans-serif';
    ctx.fillText(
      `هزینه هر نفر: ${formatMoney(perGuestToman, currency, lang, rates)}`,
      W / 2,
      1360,
    );

    ctx.fillStyle = '#E6C258';
    ctx.font = 'bold 42px Vazirmatn, sans-serif';
    ctx.fillText(
      `جمع کل قرارداد: ${formatMoney(totalContractToman, currency, lang, rates)}`,
      W / 2,
      1435,
    );

    ctx.fillStyle = '#E6DFD3';
    ctx.font = '600 28px Vazirmatn, sans-serif';
    ctx.fillText(
      `پیش‌پرداخت نقدی: ${formatMoney(downPaymentToman, currency, lang, rates)}`,
      W / 2,
      1508,
    );

    ctx.fillStyle = '#A7F3D0';
    ctx.font = 'bold 30px Vazirmatn, sans-serif';
    ctx.fillText(
      `اقساط ${installmentMonths} ماهه چک صیادی: ماهانه ${formatMoney(eachCheckToman, currency, lang, rates)}`,
      W / 2,
      1575,
    );

    ctx.fillStyle = '#FAF7F2';
    ctx.font = '500 22px Vazirmatn, sans-serif';
    ctx.fillText(
      'امکان تسویه به ۵ ارز زنده: تومان | USD | AED | TRY | RUB',
      W / 2,
      1632,
    );

    // 9. Footer Contact Callout
    ctx.fillStyle = goldColor;
    ctx.beginPath();
    ctx.roundRect(140, 1710, W - 280, 95, 48);
    ctx.fill();

    ctx.fillStyle = '#1E130D';
    ctx.font = 'bold 30px Vazirmatn, sans-serif';
    ctx.fillText(customContact, W / 2, 1768);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(renderCanvasStory, 60);
      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    themeId,
    customHeadline,
    customContact,
    venueTitle,
    guestCount,
    perGuestToman,
    totalContractToman,
    currency,
  ]);

  if (!isOpen) return null;

  const handleDownloadPng = () => {
    renderCanvasStory();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `EventMate-VIP-Story-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const isRtl = lang === 'FA' || lang === 'AR';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E130D]/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-4xl rounded-2xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#2C1E16] text-[#FAF7F2] px-6 py-4 border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E6C258]">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#FAF7F2]">
                {lang === 'FA'
                  ? 'استوری‌ساز ۱-کلیکی تالار، باغ‌تالار و کترینگ (Full HD 1080×1920)'
                  : '1-Click HD Story Maker (1080×1920 Canvas Generator)'}
              </h3>
              <p className="text-xs text-[#E6C258]">
                {lang === 'FA'
                  ? 'تولید آنی پوستر عمودی اینستاگرام و واتساپ از منو و شرایط اقساط صیادی شما'
                  : 'Instant Instagram/WhatsApp Story from your live menu & Sayyadi installments'}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-3">
              <label className="block text-xs font-bold text-[#2C1E16]">
                {lang === 'FA'
                  ? 'انتخاب تم رنگی استوری:'
                  : 'Select Story Luxury Palette:'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {id: 'royal_ivory', label: 'عاجی و طلایی سلطنتی'},
                  {id: 'imperial_walnut', label: 'چوب گردو و طلای ۲۴ عیار'},
                  {id: 'emerald_gold', label: 'زمردی درباری و طلا'},
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id as StoryThemeId)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                      themeId === t.id
                        ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27] shadow-sm'
                        : 'bg-white text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1.5">
                  {lang === 'FA'
                    ? 'تیتر اصلی استوری (قابل ویرایش):'
                    : 'Story Headline:'}
                </label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6DFD3] text-sm text-[#2C1E16] focus:outline-none focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1.5">
                  {lang === 'FA'
                    ? 'اطلاعات تماس و رزرو پایین استوری:'
                    : 'Footer Contact Info:'}
                </label>
                <input
                  type="text"
                  value={customContact}
                  onChange={(e) => setCustomContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6DFD3] text-sm text-[#2C1E16] focus:outline-none focus:border-[#C59B27]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2C1E16] text-[#FAF7F2] border border-[#C59B27] space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#E6C258]">
                <Sparkles className="w-4 h-4" />
                <span>
                  {lang === 'FA'
                    ? 'آماده انتشار در استوری اینستاگرام و وضعیت واتساپ'
                    : 'Ready for Instagram Story & WhatsApp Status'}
                </span>
              </div>
              <p className="text-xs text-[#E6DFD3]/85 leading-relaxed">
                {lang === 'FA'
                  ? 'این تصویر با ابعاد استاندارد 1080×1920 پیکسل بدون افت کیفیت شامل جزئیات منو، هزینه هر نفر و اقساط چک صیادی شما رندر شده است.'
                  : 'Rendered natively at 1080×1920 Full HD resolution with your live menu items and Sayyadi check schedule.'}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleDownloadPng}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition"
                >
                  <Download className="w-5 h-5" />
                  {lang === 'FA'
                    ? 'دانلود ۱-کلیکی استوری (PNG Full HD)'
                    : 'Download HD Story (1080p PNG)'}
                </button>
                <button
                  onClick={renderCanvasStory}
                  className="p-3 rounded-xl bg-white/10 text-[#E6C258] hover:bg-white/20 transition"
                  title="Refresh Canvas"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Live Canvas Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DFD3]">
            <div className="text-xs font-bold text-[#6E5A4F] mb-2">
              {lang === 'FA'
                ? 'پیش‌نمایش زنده بوم گرافیکی (Canvas 1080×1920):'
                : 'Live 1080×1920 Canvas Preview:'}
            </div>
            <canvas
              ref={canvasRef}
              className="w-full max-w-[270px] h-auto rounded-xl shadow-xl border-2 border-[#C59B27]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
