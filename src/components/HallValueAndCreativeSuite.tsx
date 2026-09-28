import React, {useState} from 'react';
import {
  Award,
  CheckCircle2,
  CloudRain,
  Compass,
  Crown,
  Flame,
  Gift,
  Gavel,
  HeartHandshake,
  Lock,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react';
import {CurrencyCode, LanguageCode} from '../types';
import {formatMoney, formatNumberLocale} from '../utils/formatters';

export interface SayyadiInquiryState {
  sayyadiId: string;
  nationalId: string;
  statusColor: 'WHITE' | 'YELLOW' | 'RED';
  statusLabel: string;
  creditScore: number;
  bouncedCount: number;
  hallRecommendation: string;
}

export interface FamilySplitState {
  couplePercent: number;
  groomFamilyPercent: number;
  brideFamilyPercent: number;
}

interface HallValueAndCreativeSuiteProps {
  lang: LanguageCode;
  currency: CurrencyCode;
  hallName: string;
  guestCount: number;
  finalTotalToman: number;
  downPaymentToman: number;
  remainingForChecksToman: number;
  installmentMonths: number;
  eachCheckToman: number;
  inflationShieldEnabled: boolean;
  onToggleInflationShield: (enabled: boolean) => void;
  sayyadiInquiry: SayyadiInquiryState;
  onUpdateSayyadiInquiry: (next: SayyadiInquiryState) => void;
  familySplit: FamilySplitState;
  onUpdateFamilySplit: (next: FamilySplitState) => void;
  weatherInsuranceEnabled: boolean;
  onToggleWeatherInsurance: (enabled: boolean) => void;
  barakatCharityEnabled: boolean;
  onToggleBarakatCharity: (enabled: boolean) => void;
}

export const HallValueAndCreativeSuite: React.FC<HallValueAndCreativeSuiteProps> = ({
  lang,
  currency,
  hallName,
  guestCount,
  finalTotalToman,
  downPaymentToman,
  remainingForChecksToman,
  installmentMonths,
  eachCheckToman,
  inflationShieldEnabled,
  onToggleInflationShield,
  sayyadiInquiry,
  onUpdateSayyadiInquiry,
  familySplit,
  onUpdateFamilySplit,
  weatherInsuranceEnabled,
  onToggleWeatherInsurance,
  barakatCharityEnabled,
  onToggleBarakatCharity,
}) => {
  // 1. Sayyadi Inquiry Simulator State
  const [sayyadiInput, setSayyadiInput] = useState(sayyadiInquiry.sayyadiId);
  const [nationalIdInput, setNationalIdInput] = useState(sayyadiInquiry.nationalId);
  const [inquiring, setInquiring] = useState(false);

  // 2. Creative Module: QR Digital Shabash & Gift FinTech State
  const [familiesCount, setFamiliesCount] = useState<number>(Math.max(40, Math.round(guestCount / 2.5)));
  const [avgGiftToman, setAvgGiftToman] = useState<number>(2500000);
  const [sampleGuestName, setSampleGuestName] = useState('خانواده دکتر سعادت');
  const [sampleGiftMessage, setSampleGiftMessage] = useState(
    'پیوندتان مبارک؛ با آرزوی خوشبختی ابدی در کنار هم 🌹',
  );
  const [liveWallMessages, setLiveWallMessages] = useState([
    {
      id: 'msg-1',
      sender: 'خانواده محترم رادمنش (میز VIP ۱)',
      amountToman: 10000000,
      text: 'عزیزانم پیوندتان پر از نور و برکت باد 👑✨',
    },
    {
      id: 'msg-2',
      sender: 'مهندس سهند کاظمی و همسر (میز ۴)',
      amountToman: 5000000,
      text: 'بهترین شب زندگی‌تان مبارک! همیشه شاد باشید 🎉',
    },
  ]);

  // 3. Creative Module: Reverse 60-Min Wedding Bidding State
  const [biddingTriggered, setBiddingTriggered] = useState(true);
  const [acceptedBidId, setAcceptedBidId] = useState<string | null>('bid-1');

  // 4. Creative Module: AI Seating & 360 Stage View State
  const [selectedZone, setSelectedZone] = useState<'vip_parents' | 'youth_dance' | 'seniors_calm'>(
    'vip_parents',
  );

  // 5. Creative Module: VIP Chef Tasting Night Reservation State
  const [tastingDate, setTastingDate] = useState('پنج‌شنبه این هفته — ساعت ۲۰:۰۰');
  const [tastingBookedCode, setTastingBookedCode] = useState<string | null>(null);

  const handleRunSayyadiInquiry = async (presetDigit?: string) => {
    setInquiring(true);
    const targetId = presetDigit
      ? `140588904059182${presetDigit}`
      : sayyadiInput.trim() || '1405889040591820';
    setSayyadiInput(targetId);

    try {
      const res = await fetch('/api/sayyadi/inquiry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          sayyadiId: targetId,
          nationalId: nationalIdInput,
        }),
      });
      const data = (await res.json()) as SayyadiInquiryState;
      if (data?.statusColor) {
        onUpdateSayyadiInquiry(data);
      }
    } catch {
      const last = targetId.slice(-1);
      if (last === '9') {
        onUpdateSayyadiInquiry({
          sayyadiId: targetId,
          nationalId: nationalIdInput,
          statusColor: 'RED',
          statusLabel: 'وضعیت قرمز / نارنجی (دارای سوءاثر چک برگشتی)',
          creditScore: 410,
          bouncedCount: 3,
          hallRecommendation: 'عدم پذیرش چک اقساطی — فقط تسویه نقدی یا تعویض صادرکننده چک.',
        });
      } else if (last === '5') {
        onUpdateSayyadiInquiry({
          sayyadiId: targetId,
          nationalId: nationalIdInput,
          statusColor: 'YELLOW',
          statusLabel: 'وضعیت زرد (۱ فقره تعهد در جریان)',
          creditScore: 675,
          bouncedCount: 1,
          hallRecommendation: 'قابل پذیرش مشروط به امضای ضامن دوم معتبر و ۴۰٪ پیش‌پرداخت.',
        });
      } else {
        onUpdateSayyadiInquiry({
          sayyadiId: targetId,
          nationalId: nationalIdInput,
          statusColor: 'WHITE',
          statusLabel: 'وضعیت سفید (خوش‌حساب ممتاز — فاقد هرگونه چک برگشتی)',
          creditScore: 895,
          bouncedCount: 0,
          hallRecommendation: 'مورد تایید ۱۰۰٪ تالار — مجاز به تقسیط کامل با چک صیادی بنفش.',
        });
      }
    } finally {
      setInquiring(false);
    }
  };

  // Family Splitter Math
  const applyFamilyPreset = (couple: number, groomFam: number, brideFam: number) => {
    onUpdateFamilySplit({
      couplePercent: couple,
      groomFamilyPercent: groomFam,
      brideFamilyPercent: brideFam,
    });
  };

  const coupleDownToman = Math.round((downPaymentToman * familySplit.couplePercent) / 100);
  const groomFamDownToman = Math.round((downPaymentToman * familySplit.groomFamilyPercent) / 100);
  const brideFamDownToman = Math.max(0, downPaymentToman - coupleDownToman - groomFamDownToman);

  const coupleCheckToman = Math.round((eachCheckToman * familySplit.couplePercent) / 100);
  const groomFamCheckToman = Math.round((eachCheckToman * familySplit.groomFamilyPercent) / 100);
  const brideFamCheckToman = Math.max(0, eachCheckToman - coupleCheckToman - groomFamCheckToman);

  // Digital Shabash Math
  const totalDigitalShabashToman = familiesCount * avgGiftToman;
  const remainingChecksAfterShabashToman = Math.max(
    0,
    remainingForChecksToman - totalDigitalShabashToman,
  );
  const checksCoveredCount =
    eachCheckToman > 0
      ? Math.min(installmentMonths, Math.floor(totalDigitalShabashToman / eachCheckToman))
      : 0;

  const handleAddWallGift = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: `msg-${Date.now()}`,
      sender: sampleGuestName || 'مهمان ویژه تالار',
      amountToman: avgGiftToman,
      text: sampleGiftMessage || 'پیوندتان مبارک 🌹',
    };
    setLiveWallMessages((prev) => [entry, ...prev.slice(0, 4)]);
    setSampleGuestName('');
  };

  // AI Seating Math
  const totalTables8Seat = Math.ceil(guestCount / 8);
  const vipTables = Math.max(2, Math.round(totalTables8Seat * 0.25));
  const youthTables = Math.max(2, Math.round(totalTables8Seat * 0.45));
  const seniorTables = Math.max(1, totalTables8Seat - vipTables - youthTables);

  const SEATING_ZONES = {
    vip_parents: {
      title: 'زون ۱: میزهای VIP والدین و اقوام درجه یک (ردیف اول جایگاه)',
      tablesCount: vipTables,
      distanceToStage: '۴.۵ متر تا جایگاه عروس و داماد',
      soundLevelDb: '۶۸ دسی‌بل (ملایم و شفاف)',
      viewAngle: 'زاویه دید مستقیم ۱۸۰ درجه پانوراما به سن رقص و سفره عقد',
      lightingMood: 'نور گرم طلایی ۲۴ عیار مخصوص عکاسی پرتره',
    },
    youth_dance: {
      title: 'زون ۲: میزهای جوانان و دوستان (مجاور پیست رقص استارلایت)',
      tablesCount: youthTables,
      distanceToStage: '۲.۵ متر تا پیست رقص و استیج موزیک',
      soundLevelDb: '۸۴ دسی‌بل (انرژی کنسرتی FBNM)',
      viewAngle: 'زاویه دید ۳۶۰ درجه در قلب پیست رقص و آتش‌بازی سرد',
      lightingMood: 'نورپردازی داینامیک بیم‌لایت و مه سنگین',
    },
    seniors_calm: {
      title: 'زون ۳: میزهای آرامش سالمندان و کودکان (فاصله استاندارد از باندها)',
      tablesCount: seniorTables,
      distanceToStage: '۱۲ متر از بلندگوهای Line-Array (آکوستیک آرام)',
      soundLevelDb: '۵۸ دسی‌بل (کاملاً راحت برای گفتگو)',
      viewAngle: 'دید کامل از تراس شیشه‌ای + نمایش همزمان روی تلویزیون شهری P2',
      lightingMood: 'نور یکنواخت عاجی بدون فلش‌های خیره‌کننده (مناسب کم‌بینایان و ADHD)',
    },
  };

  return (
    <section id="value-drivers" className="py-8 space-y-10">
      {/* HEADER BANNER */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#2C1E16] via-[#4A1525] to-[#2C1E16] text-[#FAF7F2] border-2 border-[#C59B27] shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E11D48] text-white text-xs font-extrabold shadow">
              <Sparkles className="w-4 h-4 text-[#E6C258]" />
              <span>ماژول‌های ارزش‌آفرین تالارداران + ۶ یادگاری خلاقانه تحول‌آفرین (فعال و تعاملی)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#E6C258]">
              ابزارهای انحصاری آرامش خاطر مدیر تالار «{hallName}» و خانواده‌های عروس و داماد
            </h2>
            <p className="text-xs sm:text-sm text-[#E6DFD3] leading-relaxed">
              استعلام زنده رنگ چک صیادی، تقسیم هوشمند هزینه بین خانواده‌ها، قفل قیمت ضدتورم منو، کیف‌پول شاباش QR سر میز، مناقصه معکوس شب‌های خالی و چیدمان هوشمند میزها با هوش مصنوعی
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href="#sayyadi-simulator"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#C59B27] text-xs font-extrabold text-[#E6C258] transition"
            >
              🏦 استعلام چک صیادی
            </a>
            <a
              href="#family-splitter"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#C59B27] text-xs font-extrabold text-[#E6C258] transition"
            >
              👨‍👩‍👧‍👦 تقسیم هزینه خانواده‌ها
            </a>
            <a
              href="#creative-memorial"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white text-xs font-extrabold shadow transition"
            >
              🎁 یادگاری‌های خلاقانه ما
            </a>
          </div>
        </div>
      </div>

      {/* ROW 1: THREE BLUEPRINT VALUE DRIVERS (Sayyadi Inquiry + Family Expense Splitter + Inflation-Shield) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. SAYYADI CHECK CREDIT & COLOR INQUIRY SIMULATOR */}
        <div
          id="sayyadi-simulator"
          className="lg:col-span-5 luxury-card rounded-3xl p-6 bg-white border-2 border-[#D4AF37] shadow-xl flex flex-col justify-between space-y-4 adhd-dimmable"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>ماژول ۱: امنیت مالی تالاردار</span>
              </span>
              <span className="font-mono-num text-xs font-bold text-[#9A7411]">
                امتیاز خوش‌حسابی: {sayyadiInquiry.creditScore} / 1000
              </span>
            </div>

            <h3 className="text-lg font-black text-[#2C1E16]">
              شبیه‌ساز استعلام رنگ چک صیادی بانک مرکزی
            </h3>
            <p className="text-xs text-[#6E5A4F] leading-relaxed">
              پیش از پذیرش اقساط، شناسه ۱۶ رقمی صیادی را استعلام کنید تا رنگ اعتبار چک (سفید/زرد/قرمز) در پیش‌فاکتور تالار درج شود:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block font-bold text-[#2C1E16] mb-1">
                  شناسه ۱۶ رقمی چک صیادی:
                </label>
                <input
                  type="text"
                  value={sayyadiInput}
                  onChange={(e) => setSayyadiInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] font-mono-num font-bold text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2C1E16] mb-1">
                  کد ملی صاحب دسته چک:
                </label>
                <input
                  type="text"
                  value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D4AF37] font-mono-num font-bold text-[#2C1E16]"
                />
              </div>
            </div>

            {/* Quick Test Color Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#6E5A4F]">
                تست سریع وضعیت‌های رنگی بانک مرکزی:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRunSayyadiInquiry('0')}
                  className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-[11px] transition cursor-pointer"
                >
                  ⚪ تست وضعیت سفید
                </button>
                <button
                  type="button"
                  onClick={() => handleRunSayyadiInquiry('5')}
                  className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[11px] transition cursor-pointer"
                >
                  🟡 تست وضعیت زرد
                </button>
                <button
                  type="button"
                  onClick={() => handleRunSayyadiInquiry('9')}
                  className="py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 font-extrabold text-[11px] transition cursor-pointer"
                >
                  🔴 تست وضعیت قرمز
                </button>
              </div>
            </div>

            {/* Live Status Result Card */}
            <div
              className={`p-4 rounded-2xl border-2 space-y-1.5 ${
                sayyadiInquiry.statusColor === 'WHITE'
                  ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950'
                  : sayyadiInquiry.statusColor === 'YELLOW'
                    ? 'bg-amber-50/90 border-amber-500 text-amber-950'
                    : 'bg-rose-50/90 border-rose-500 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between font-black text-xs">
                <span>{sayyadiInquiry.statusLabel}</span>
                <span className="font-mono-num">
                  چک برگشتی: {formatNumberLocale(sayyadiInquiry.bouncedCount, lang)} فقره
                </span>
              </div>
              <p className="text-xs leading-relaxed">{sayyadiInquiry.hallRecommendation}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleRunSayyadiInquiry()}
            disabled={inquiring}
            className="w-full py-3 rounded-xl bg-[#2C1E16] text-[#E6C258] border border-[#C59B27] font-extrabold text-xs hover:bg-[#3E2723] transition cursor-pointer"
          >
            {inquiring ? 'در حال استعلام آنلاین صیادی...' : 'استعلام مجدد و درج گواهی خوش‌حسابی در پیش‌فاکتور'}
          </button>
        </div>

        {/* 2. FAMILY EXPENSE SPLITTER (تقسیم هوشمند هزینه و چک‌ها بین داماد و خانواده‌ها) */}
        <div
          id="family-splitter"
          className="lg:col-span-7 luxury-card rounded-3xl p-6 bg-white border-2 border-[#E11D48]/70 shadow-xl flex flex-col justify-between space-y-4 adhd-dimmable"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#E11D48] text-xs font-extrabold border border-rose-200">
                <Users className="w-4 h-4" />
                <span>ماژول ۲: محاسبه‌گر تقسیم هزینه خانواده (Family Expense Splitter)</span>
              </span>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyFamilyPreset(50, 30, 20)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#D4AF37] text-[11px] font-bold text-[#2C1E16] hover:bg-amber-50 cursor-pointer"
                >
                  ۵۰٪ زوج / ۳۰٪ داماد / ۲۰٪ عروس
                </button>
                <button
                  type="button"
                  onClick={() => applyFamilyPreset(0, 50, 50)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#D4AF37] text-[11px] font-bold text-[#2C1E16] hover:bg-amber-50 cursor-pointer"
                >
                  نصف‌نصف خانواده‌ها (۵۰٪ - ۵۰٪)
                </button>
                <button
                  type="button"
                  onClick={() => applyFamilyPreset(100, 0, 0)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#D4AF37] text-[11px] font-bold text-[#2C1E16] hover:bg-amber-50 cursor-pointer"
                >
                  ۱۰۰٪ مستقل عروس و داماد
                </button>
              </div>
            </div>

            <h3 className="text-lg font-black text-[#2C1E16]">
              تسهیم شفاف پیش‌پرداخت نقدی و چک‌های صیادی بین داماد، خانواده داماد و خانواده عروس
            </h3>
            <p className="text-xs text-[#6E5A4F]">
              برای جلوگیری از هرگونه ابهام بین خانواده‌ها، درصد سهم هر طرف را مشخص کنید تا مبلغ پیش‌پرداخت و مبلغ هر برگ چک هر خانواده جداگانه محاسبه شود:
            </p>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-[#FFF0F3] border border-rose-200 space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-[#2C1E16]">
                  <span>🤵👰 سهم عروس و داماد:</span>
                  <span className="font-mono-num text-[#E11D48]">{familySplit.couplePercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={familySplit.couplePercent}
                  onChange={(e) => {
                    const couple = Number(e.target.value);
                    const rem = Math.max(0, 100 - couple);
                    const groomF = Math.round(rem / 2);
                    const brideF = rem - groomF;
                    onUpdateFamilySplit({
                      couplePercent: couple,
                      groomFamilyPercent: groomF,
                      brideFamilyPercent: brideF,
                    });
                  }}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
                <div className="text-[11px] text-[#6E5A4F]">
                  پیش‌پرداخت:{' '}
                  <b className="font-mono-num text-[#2C1E16]">
                    {formatMoney(coupleDownToman, currency, lang)}
                  </b>
                </div>
                <div className="text-[11px] text-[#E11D48] font-bold">
                  سهم از هر چک:{' '}
                  <span className="font-mono-num">
                    {formatMoney(coupleCheckToman, currency, lang)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FEF9E7] border border-[#D4AF37]/60 space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-[#2C1E16]">
                  <span>👨‍👩‍👦 خانواده محترم داماد:</span>
                  <span className="font-mono-num text-[#9A7411]">
                    {familySplit.groomFamilyPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100 - familySplit.couplePercent}
                  step={5}
                  value={familySplit.groomFamilyPercent}
                  onChange={(e) => {
                    const groomF = Number(e.target.value);
                    const brideF = Math.max(0, 100 - familySplit.couplePercent - groomF);
                    onUpdateFamilySplit({
                      ...familySplit,
                      groomFamilyPercent: groomF,
                      brideFamilyPercent: brideF,
                    });
                  }}
                  className="w-full accent-[#C59B27] cursor-pointer"
                />
                <div className="text-[11px] text-[#6E5A4F]">
                  پیش‌پرداخت:{' '}
                  <b className="font-mono-num text-[#2C1E16]">
                    {formatMoney(groomFamDownToman, currency, lang)}
                  </b>
                </div>
                <div className="text-[11px] text-[#9A7411] font-bold">
                  سهم از هر چک:{' '}
                  <span className="font-mono-num">
                    {formatMoney(groomFamCheckToman, currency, lang)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-[#2C1E16]">
                  <span>👨‍👩‍👧 خانواده محترم عروس:</span>
                  <span className="font-mono-num text-emerald-700">
                    {familySplit.brideFamilyPercent}%
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 font-medium pt-1">
                  تنظیم خودکار بر اساس مابقی درصد ({familySplit.brideFamilyPercent}%)
                </div>
                <div className="text-[11px] text-[#6E5A4F]">
                  پیش‌پرداخت:{' '}
                  <b className="font-mono-num text-[#2C1E16]">
                    {formatMoney(brideFamDownToman, currency, lang)}
                  </b>
                </div>
                <div className="text-[11px] text-emerald-800 font-bold">
                  سهم از هر چک:{' '}
                  <span className="font-mono-num">
                    {formatMoney(brideFamCheckToman, currency, lang)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. INFLATION-SHIELD CONTRACT GUARANTEE BAR */}
          <div
            className={`p-4 rounded-2xl border-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              inflationShieldEnabled
                ? 'bg-gradient-to-r from-[#2C1E16] via-[#3E2723] to-[#2C1E16] text-[#FAF7F2] border-[#C59B27] shadow-lg'
                : 'bg-[#FAF7F2] text-[#2C1E16] border-[#D4AF37]/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-black text-sm">
                <Lock className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span>
                  ماژول ۳: ضمانت قیمت ضدتورم منو (Inflation-Shield Contract Guarantee)
                </span>
                {inflationShieldEnabled && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold">
                    قفل ضدتورم فعال شد ✓
                  </span>
                )}
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  inflationShieldEnabled ? 'text-[#E6DFD3]' : 'text-[#6E5A4F]'
                }`}
              >
                با فعال‌سازی این گزینه، نرخ گوشت، برنج، زعفران و گل‌آرایی از لحظه پرداخت پیش‌پرداخت تا شب مراسم (حتی تا ۱۲ ماه آینده) <b>۱۰۰٪ قفل و بدون یک ریال افزایش قیمت</b> در قرارداد تضمین می‌شود.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleInflationShield(!inflationShieldEnabled)}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs shrink-0 transition cursor-pointer ${
                inflationShieldEnabled
                  ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600'
                  : 'bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white shadow hover:brightness-105'
              }`}
            >
              {inflationShieldEnabled
                ? '✅ ضمانت قیمت ضدتورم روی فاکتور قفل شد'
                : '🔒 فعال‌سازی ضمانت قیمت ضدتورم منو'}
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: OUR IMPLEMENTED CREATIVE MEMORIAL MODULES (یادگاری‌های خلاقانه اجرایی در برنامه) */}
      <div id="creative-memorial" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CREATIVE MODULE 1: SMART QR SHABASH & GIFT FINTECH + LIVE HALL TV WALL */}
        <div className="lg:col-span-6 luxury-card rounded-3xl p-6 bg-gradient-to-b from-[#FFF0F3] via-[#FFFDF9] to-[#FEF9E7] border-2 border-[#E11D48] shadow-xl space-y-4 adhd-dimmable">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48] text-white text-xs font-extrabold">
              <QrCode className="w-4 h-4" />
              <span>یادگاری خلاقانه ۱: فین‌تک «شاباش و کادوی QR سر میز» + تهاتر با چک تالار</span>
            </span>
            <span className="font-mono-num text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
              پوشش خودکار {formatNumberLocale(checksCoveredCount, lang)} برگ چک صیادی!
            </span>
          </div>

          <h3 className="text-lg font-black text-[#2C1E16]">
            پرداخت آنلاین کادوی مهمانان با بارکد طلایی سر میز + نمایش تبریک روی تلویزیون سالن
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white border border-[#D4AF37] space-y-2">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>تعداد خانواده‌های هدیه‌دهنده:</span>
                  <span className="font-mono-num text-[#E11D48]">
                    {formatNumberLocale(familiesCount, lang)} خانواده
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={350}
                  step={10}
                  value={familiesCount}
                  onChange={(e) => setFamiliesCount(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>میانگین کادوی هر خانواده:</span>
                  <span className="font-mono-num text-[#9A7411]">
                    {formatMoney(avgGiftToman, currency, lang)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={500000}
                  value={avgGiftToman}
                  onChange={(e) => setAvgGiftToman(Number(e.target.value))}
                  className="w-full accent-[#C59B27] cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="text-[11px] text-emerald-900 font-bold">
                  جمع شاباش و کادوی جمع‌آوری‌شده در شب جشن:
                </div>
                <div className="font-mono-num text-base font-black text-emerald-700">
                  {formatMoney(totalDigitalShabashToman, currency, lang)}
                </div>
                <div className="text-[11px] text-[#2C1E16]">
                  مانده چک‌های تالار پس از کسر کادوها:{' '}
                  <b className="font-mono-num text-[#E11D48]">
                    {formatMoney(remainingChecksAfterShabashToman, currency, lang)}
                  </b>
                </div>
              </div>
            </div>

            {/* Live LED Wall Simulator for Guest Gift Messages */}
            <div className="p-3 rounded-2xl bg-[#2C1E16] text-[#FAF7F2] border border-[#C59B27] flex flex-col justify-between space-y-2">
              <div className="text-xs font-extrabold text-[#E6C258] flex items-center justify-between">
                <span>📺 دیوار زنده تلویزیون سالن (LED Wall):</span>
                <span className="px-2 py-0.5 rounded bg-[#E11D48] text-white text-[10px]">LIVE</span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {liveWallMessages.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded-xl bg-white/10 border border-[#C59B27]/40 text-[11px]"
                  >
                    <div className="flex justify-between font-bold text-[#E6C258]">
                      <span>{m.sender}</span>
                      <span className="font-mono-num text-emerald-300">
                        +{formatMoney(m.amountToman, currency, lang)}
                      </span>
                    </div>
                    <div className="text-white mt-0.5">{m.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddWallGift} className="space-y-1.5 pt-1 border-t border-white/15">
                <input
                  type="text"
                  value={sampleGuestName}
                  onChange={(e) => setSampleGuestName(e.target.value)}
                  placeholder="نام مهمان هدیه‌دهنده..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#3E2723] border border-[#C59B27]/50 text-[11px] text-white"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white font-extrabold text-[11px] cursor-pointer"
                >
                  + تست ثبت کادوی QR و پخش روی تلویزیون تالار
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* CREATIVE MODULE 2: 60-MINUTE REVERSE WEDDING BIDDING + AI SEATING & TASTING */}
        <div className="lg:col-span-6 luxury-card rounded-3xl p-6 bg-white border-2 border-[#C59B27] shadow-xl space-y-4 adhd-dimmable">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C1E16] text-[#E6C258] text-xs font-extrabold">
              <Gavel className="w-4 h-4 text-[#E11D48]" />
              <span>یادگاری خلاقانه ۲ و ۳: مناقصه معکوس تالارها + چیدمان هوشمند AI</span>
            </span>
            <button
              type="button"
              onClick={() => setBiddingTriggered(!biddingTriggered)}
              className="text-xs font-extrabold text-[#E11D48] underline cursor-pointer"
            >
              بروزرسانی آفرهای رقابتی تالارها
            </button>
          </div>

          {/* Reverse Wedding Bidding Live Offers */}
          <div className="space-y-2">
            <h4 className="font-black text-sm text-[#2C1E16]">
              🔥 مناقصه معکوس زنده برای {formatNumberLocale(guestCount, lang)} مهمان شما (تالارها برای جذب شما رقابت می‌کنند):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                {
                  id: 'bid-1',
                  hall: hallName,
                  discount: '۲۲٪ تخفیف ویژه',
                  bonus: 'آتش‌بازی سرد + کیک ۵ طبقه رایگان',
                  netToman: Math.round(finalTotalToman * 0.94),
                },
                {
                  id: 'bid-2',
                  hall: 'باغ‌عمارت کریستال نیاوران',
                  discount: '۱۹٪ تخفیف نقد و چک',
                  bonus: 'ورودی باغ رایگان + ۱۰ چک صیادی',
                  netToman: Math.round(finalTotalToman * 0.97),
                },
                {
                  id: 'bid-3',
                  hall: 'کاخ‌تالار امپریال فرشته',
                  discount: '۲۵٪ تخفیف نیمه‌هفته',
                  bonus: 'گل‌آرایی هلندی + هلی‌شات 4K رایگان',
                  netToman: Math.round(finalTotalToman * 0.92),
                },
              ].map((b) => (
                <div
                  key={b.id}
                  onClick={() => setAcceptedBidId(b.id)}
                  className={`p-3 rounded-2xl border-2 transition cursor-pointer ${
                    acceptedBidId === b.id
                      ? 'bg-[#FFF0F3] border-[#E11D48] shadow-sm'
                      : 'bg-[#FAF7F2] border-[#E6DFD3] hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="font-extrabold text-[#2C1E16] line-clamp-1">{b.hall}</div>
                  <div className="text-[11px] font-bold text-[#E11D48] mt-0.5">{b.discount}</div>
                  <div className="text-[10px] text-[#6E5A4F] mt-0.5">{b.bonus}</div>
                  <div className="font-mono-num font-black text-emerald-700 text-xs mt-1">
                    {formatMoney(b.netToman, currency, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Smart Seating & 360 Stage View */}
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37] space-y-2.5 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-black text-[#2C1E16] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#E11D48]" />
                <span>چیدمان هوشمند {formatNumberLocale(totalTables8Seat, lang)} میز ۸ نفره با هوش مصنوعی (بر اساس سن و حساسیت صوتی):</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedZone('vip_parents')}
                className={`py-2 px-2 rounded-xl font-extrabold text-[11px] border transition cursor-pointer ${
                  selectedZone === 'vip_parents'
                    ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27]'
                    : 'bg-white text-[#2C1E16] border-[#E6DFD3]'
                }`}
              >
                👑 والدین ({vipTables} میز)
              </button>
              <button
                type="button"
                onClick={() => setSelectedZone('youth_dance')}
                className={`py-2 px-2 rounded-xl font-extrabold text-[11px] border transition cursor-pointer ${
                  selectedZone === 'youth_dance'
                    ? 'bg-[#E11D48] text-white border-[#E11D48]'
                    : 'bg-white text-[#2C1E16] border-[#E6DFD3]'
                }`}
              >
                💃 جوانان ({youthTables} میز)
              </button>
              <button
                type="button"
                onClick={() => setSelectedZone('seniors_calm')}
                className={`py-2 px-2 rounded-xl font-extrabold text-[11px] border transition cursor-pointer ${
                  selectedZone === 'seniors_calm'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-[#2C1E16] border-[#E6DFD3]'
                }`}
              >
                🌿 سالمندان ({seniorTables} میز)
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6DFD3] space-y-1">
              <div className="font-extrabold text-[#2C1E16]">
                {SEATING_ZONES[selectedZone].title}
              </div>
              <div className="text-[11px] text-[#6E5A4F]">
                • <b>فاصله و آکوستیک:</b> {SEATING_ZONES[selectedZone].distanceToStage} ({SEATING_ZONES[selectedZone].soundLevelDb})
              </div>
              <div className="text-[11px] text-emerald-800 font-bold">
                • <b>زاویه دید ۳۶۰ درجه:</b> {SEATING_ZONES[selectedZone].viewAngle}
              </div>
            </div>
          </div>

          {/* VIP Food Tasting + Weather Insurance + Barakat Charity Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() =>
                setTastingBookedCode(`TASTE-VIP-${Math.floor(100 + Math.random() * 900)}`)
              }
              className="p-2.5 rounded-xl bg-[#FFF0F3] hover:bg-rose-100 border border-rose-300 text-start transition cursor-pointer"
            >
              <div className="font-extrabold text-[#E11D48] flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" />
                <span>رزرو شب تست غذای VIP</span>
              </div>
              <div className="text-[10px] text-[#2C1E16] mt-0.5">
                {tastingBookedCode
                  ? `✅ کد رزرو میز تست: ${tastingBookedCode}`
                  : `${tastingDate} (میز ۲ نفره رایگان)`}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onToggleWeatherInsurance(!weatherInsuranceEnabled)}
              className={`p-2.5 rounded-xl border text-start transition cursor-pointer ${
                weatherInsuranceEnabled
                  ? 'bg-sky-900 text-white border-sky-400'
                  : 'bg-[#FAF7F2] text-[#2C1E16] border-[#D4AF37]/50'
              }`}
            >
              <div className="font-extrabold flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                <span>بیمه هواشناسی باغ‌تالار</span>
              </div>
              <div className="text-[10px] mt-0.5 opacity-90">
                {weatherInsuranceEnabled
                  ? '✅ سالن مسقف پشتیبان رزرو شد'
                  : 'رزرو خودکار سالن مسقف در صورت باران'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onToggleBarakatCharity(!barakatCharityEnabled)}
              className={`p-2.5 rounded-xl border text-start transition cursor-pointer ${
                barakatCharityEnabled
                  ? 'bg-emerald-800 text-white border-emerald-400'
                  : 'bg-[#FAF7F2] text-[#2C1E16] border-[#D4AF37]/50'
              }`}
            >
              <div className="font-extrabold flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                <span>گواهی «برکت جشن»</span>
              </div>
              <div className="text-[10px] mt-0.5 opacity-90">
                {barakatCharityEnabled
                  ? '✅ اهدای VIP به خیریه فعال شد'
                  : 'بسته‌بندی بهداشتی غذای اضافه برای خیریه'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
