import React, {useEffect, useRef, useState} from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {BarChart3, Camera, Download, Sparkles, Flame, Crown} from 'lucide-react';
import {CurrencyCode, LanguageCode} from '../types';
import {MONTHLY_BOOKING_CHART_DATA, POPULAR_MENU_SHARE_DATA} from '../data';
import {formatMoney, formatNumberLocale} from '../utils/formatters';

interface StoryMakerAnalyticsProps {
  lang: LanguageCode;
  currency: CurrencyCode;
  guestCount: number;
  perGuestToman: number;
  totalToman: number;
  downPaymentToman: number;
  installmentMonths: number;
  eachCheckToman: number;
  selectedNames: string[];
}

export const StoryMakerAnalytics: React.FC<StoryMakerAnalyticsProps> = ({
  lang,
  currency,
  guestCount,
  perGuestToman,
  totalToman,
  downPaymentToman,
  installmentMonths,
  eachCheckToman,
  selectedNames,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [storyVenueName, setStoryVenueName] = useState(
    'کاخ‌تالار و باغ‌عمارت رویال فرشته — EventMate VIP',
  );
  const [storyOfferBadge, setStoryOfferBadge] = useState(
    '🎉 جشنواره عروسی رویایی | ۲۲٪ تخفیف شب‌های خالی + چک صیادی بدون کارمزد',
  );
  const [storyPhone, setStoryPhone] = useState('0912-345-6789 | رزرواسیون VIP');
  const [storyTheme, setStoryTheme] = useState<'blossom' | 'royalGold' | 'emerald'>('blossom');

  const drawStoryCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    if (storyTheme === 'blossom') {
      bgGrad.addColorStop(0, '#FFF5F7');
      bgGrad.addColorStop(0.45, '#FFF0F5');
      bgGrad.addColorStop(1, '#FDF2E9');
    } else if (storyTheme === 'royalGold') {
      bgGrad.addColorStop(0, '#FFFDF7');
      bgGrad.addColorStop(0.5, '#FAF3E0');
      bgGrad.addColorStop(1, '#F5E6C8');
    } else {
      bgGrad.addColorStop(0, '#F0FDF4');
      bgGrad.addColorStop(0.5, '#FFFDF9');
      bgGrad.addColorStop(1, '#FEF3C7');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const bokehColors = [
      'rgba(225, 29, 72, 0.10)',
      'rgba(212, 175, 55, 0.18)',
      'rgba(244, 63, 94, 0.12)',
      'rgba(234, 179, 8, 0.15)',
    ];
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      const x = ((i * 197) % 980) + 50;
      const y = ((i * 263) % 1780) + 70;
      const r = 45 + (i % 4) * 35;
      ctx.fillStyle = bokehColors[i % bokehColors.length];
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#C59B27';
    ctx.lineWidth = 10;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 4;
    ctx.strokeRect(68, 68, W - 136, H - 136);

    ctx.fillStyle = '#2C1E16';
    ctx.beginPath();
    ctx.roundRect(140, 120, W - 280, 130, 36);
    ctx.fill();

    ctx.fillStyle = '#E6C258';
    ctx.font = 'bold 40px Vazirmatn, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👑 EventMate VIP | ایونت‌مِیت', W / 2, 180);

    ctx.fillStyle = '#FFF1F2';
    ctx.font = '26px Vazirmatn, sans-serif';
    ctx.fillText('اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM', W / 2, 225);

    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 50px Vazirmatn, sans-serif';
    ctx.fillText(storyVenueName, W / 2, 345);

    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.roundRect(90, 400, W - 180, 100, 28);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Vazirmatn, sans-serif';
    ctx.fillText(storyOfferBadge, W / 2, 462);

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(90, 545, W - 180, 620, 40);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#2C1E16';
    ctx.font = 'bold 38px Vazirmatn, sans-serif';
    ctx.fillText(
      `✨ پکیج ویژه عروسی برای ${formatNumberLocale(guestCount, lang)} نفر مهمان`,
      W / 2,
      625,
    );

    ctx.fillStyle = '#9A7411';
    ctx.font = 'bold 46px Vazirmatn, sans-serif';
    ctx.fillText(
      `هر نفر: ${formatMoney(perGuestToman, currency, lang)}`,
      W / 2,
      715,
    );

    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 52px Vazirmatn, sans-serif';
    ctx.fillText(
      `جمع کل قرارداد: ${formatMoney(totalToman, currency, lang)}`,
      W / 2,
      815,
    );

    ctx.fillStyle = '#FFF1F2';
    ctx.beginPath();
    ctx.roundRect(130, 875, W - 260, 240, 28);
    ctx.fill();

    ctx.fillStyle = '#2C1E16';
    ctx.font = 'bold 34px Vazirmatn, sans-serif';
    ctx.fillText(
      `💳 پیش‌پرداخت نقدی: ${formatMoney(downPaymentToman, currency, lang)}`,
      W / 2,
      945,
    );
    ctx.fillStyle = '#be123c';
    ctx.font = 'bold 38px Vazirmatn, sans-serif';
    ctx.fillText(
      `🌸 اقساط ${formatNumberLocale(installmentMonths, lang)} ماهه با چک صیادی بنفش:`,
      W / 2,
      1015,
    );
    ctx.fillStyle = '#2C1E16';
    ctx.font = 'bold 42px Vazirmatn, sans-serif';
    ctx.fillText(
      `هر برگ چک: ${formatMoney(eachCheckToman, currency, lang)}`,
      W / 2,
      1080,
    );

    ctx.fillStyle = '#2C1E16';
    ctx.font = 'bold 36px Vazirmatn, sans-serif';
    ctx.fillText('🍽️ گزیده منوی اشرافی و تشریفات این پکیج:', W / 2, 1245);

    const topItems = selectedNames.slice(0, 5);
    topItems.forEach((item, idx) => {
      ctx.fillStyle = '#3E2723';
      ctx.font = '32px Vazirmatn, sans-serif';
      ctx.fillText(`✦ ${item.slice(0, 52)}`, W / 2, 1320 + idx * 65);
    });

    ctx.fillStyle = '#2C1E16';
    ctx.beginPath();
    ctx.roundRect(90, 1670, W - 180, 150, 36);
    ctx.fill();

    ctx.fillStyle = '#E6C258';
    ctx.font = 'bold 38px Vazirmatn, sans-serif';
    ctx.fillText(`📞 رزرو مستقیم و مشاوره رایگان: ${storyPhone}`, W / 2, 1735);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px Vazirmatn, sans-serif';
    ctx.fillText('طراحی شده با منوساز هوشمند EventMate VIP | توان استیج FBNM', W / 2, 1790);
  };

  useEffect(() => {
    drawStoryCanvas();
  }, [
    storyVenueName,
    storyOfferBadge,
    storyPhone,
    storyTheme,
    guestCount,
    perGuestToman,
    totalToman,
    downPaymentToman,
    installmentMonths,
    eachCheckToman,
    selectedNames,
    currency,
    lang,
  ]);

  const handleDownloadStory = () => {
    drawStoryCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `EventMate-VIP-Wedding-Story-${Date.now()}.png`;
    a.click();
  };

  return (
    <section id="analytics" className="py-10 space-y-8 adhd-dimmable">
      <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#FFF5F7] via-[#FFFDF9] to-[#FEF9E7] border-2 border-[#D4AF37]/50 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-[#E11D48] text-xs font-extrabold border border-rose-200">
              <Flame className="w-4 h-4" />
              <span>هوش تجاری تالارها + استوری‌ساز ۱-کلیکی جشن عروسی (HD 1080×1920)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E16] mt-2">
              داشبورد نموداری محبوب‌ترین منوهای عروسی و استوری‌ساز اینستاگرام
            </h2>
            <p className="text-sm text-[#6E5A4F] mt-1">
              تحلیل زنده پرتقاضاترین ماه‌های رزرو تالار و غذاهای محبوب عروسی با Recharts + خروجی تصویر استوری آماده انتشار
            </p>
          </div>
          <button
            onClick={handleDownloadStory}
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#D4AF37] text-white font-extrabold text-sm shadow-lg hover:brightness-105 transition cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>دانلود ۱-کلیکی استوری HD عروسی (PNG)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="p-5 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#E11D48]" />
                <h3 className="font-bold text-sm text-[#2C1E16]">
                  نمودار ترافیک رزرو شب‌های عروسی، همایش‌ها و شب‌های تخفیف‌دار (Flash)
                </h3>
              </div>
              <span className="text-xs font-mono-num text-[#9A7411] font-bold">سال ۱۴۰۵ / 2026</span>
            </div>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_BOOKING_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorWeddings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E11D48" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#E11D48" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C59B27" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#C59B27" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3EDE2" />
                  <XAxis dataKey="month" tick={{fontSize: 11, fill: '#6E5A4F'}} />
                  <YAxis tick={{fontSize: 11, fill: '#6E5A4F'}} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      borderColor: '#C59B27',
                      borderRadius: '14px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weddings"
                    name="جشن عروسی (Weddings)"
                    stroke="#E11D48"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWeddings)"
                  />
                  <Area
                    type="monotone"
                    dataKey="corporate"
                    name="همایش و نامزدی (Gala)"
                    stroke="#C59B27"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorGold)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#C59B27]" />
                <h3 className="font-bold text-sm text-[#2C1E16]">
                  سهم محبوب‌ترین غذاهای اصلی در قراردادهای عروسی (٪ انتخاب عروس و دامادها)
                </h3>
              </div>
              <span className="text-xs font-bold text-[#E11D48]">آمار زنده تالارها</span>
            </div>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={POPULAR_MENU_SHARE_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3EDE2" />
                  <XAxis type="number" unit="%" tick={{fontSize: 11, fill: '#6E5A4F'}} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{fontSize: 11, fill: '#2C1E16'}}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      borderColor: '#E11D48',
                      borderRadius: '14px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="share" name="درصد محبوبیت (%)" radius={[0, 10, 10, 0]}>
                    {POPULAR_MENU_SHARE_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#E11D48' : entry.fill}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#E6DFD3] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-[#E11D48]" />
              <h3 className="text-xl font-extrabold text-[#2C1E16]">
                استودیو استوری‌ساز ۱-کلیکی تالار، باغ‌تالار و کترینگ (Canvas HD)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#6E5A4F] leading-relaxed">
              پکیج محاسبه‌شده فعلی شما به صورت خودکار روی پوستر استوری عروسی درج شده است. نام تالار یا پیام تخفیف خود را ویرایش کنید و فایل باکیفیت ۱۰۸۰×۱۹۲۰ را برای استوری اینستاگرام و وضعیت واتساپ دانلود نمایید:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  نام تالار، باغ‌عمارت یا کترینگ روی استوری:
                </label>
                <input
                  type="text"
                  value={storyVenueName}
                  onChange={(e) => setStoryVenueName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                  شماره تماس و رزرواسیون انتهای استوری:
                </label>
                <input
                  type="text"
                  value={storyPhone}
                  onChange={(e) => setStoryPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/60 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1E16] mb-1">
                تگ جشنواره و پیشنهاد ویژه عروسی:
              </label>
              <input
                type="text"
                value={storyOfferBadge}
                onChange={(e) => setStoryOfferBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-bold text-[#2C1E16]">تم رنگی استوری جشن:</span>
              {[
                {id: 'blossom', label: '🌸 شکوفه رز و طلایی عروسی'},
                {id: 'royalGold', label: '👑 عاجی و طلایی ۲۴ عیار سلطنتی'},
                {id: 'emerald', label: '💎 زمردی و شامپاینی لوکس'},
              ].map((tItem) => (
                <button
                  key={tItem.id}
                  onClick={() => setStoryTheme(tItem.id as 'blossom' | 'royalGold' | 'emerald')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    storyTheme === tItem.id
                      ? 'bg-[#E11D48] text-white border-[#E11D48] shadow'
                      : 'bg-white text-[#2C1E16] border-[#D4AF37]/40 hover:bg-[#FFF0F3]'
                  }`}
                >
                  {tItem.label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleDownloadStory}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#2C1E16] via-[#3E2723] to-[#2C1E16] text-[#E6C258] border border-[#C59B27] font-extrabold text-sm shadow-lg hover:brightness-110 transition cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#E11D48]" />
                <span>ذخیره تصویر استوری عروسی با کیفیت HD (1080×1920)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="p-3 rounded-3xl bg-gradient-to-b from-[#E11D48]/20 via-[#D4AF37]/30 to-[#E11D48]/20 border-2 border-[#D4AF37] shadow-xl">
              <canvas
                ref={canvasRef}
                className="w-64 sm:w-72 h-auto rounded-2xl shadow-inner bg-white"
              />
            </div>
            <span className="text-[11px] text-[#6E5A4F] mt-2 font-semibold">
              پیش‌نمایش زنده استوری اینستاگرام و واتساپ (۱۰۸۰×۱۹۲۰ پیکسل)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
