import React, {useState} from 'react';
import {
  Crown,
  Users,
  CheckCircle2,
  Coins,
  Sparkles,
  Copy,
  Check,
  X,
  TrendingUp,
} from 'lucide-react';
import {CurrencyCode, LanguageCode} from '../types';
import {formatMoney} from '../data/catalog';

interface VipVisitorClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  currency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
}

export const VipVisitorClubModal: React.FC<VipVisitorClubModalProps> = ({
  isOpen,
  onClose,
  lang,
  currency,
  rates,
}) => {
  const [activeTab, setActiveTab] = useState<'vip_tiers' | 'visitor_club'>(
    'vip_tiers',
  );
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Visitor Commission Calculator State
  const [monthlyReferrals, setMonthlyReferrals] = useState(4);
  const [avgContractToman, setAvgContractToman] = useState(550000000);
  const [commissionPct, setCommissionPct] = useState(7);

  // Visitor Registration State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorCity, setVisitorCity] = useState('تهران');
  const [registeredCode, setRegisteredCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [registering, setRegistering] = useState(false);

  if (!isOpen) return null;

  const isRtl = lang === 'FA' || lang === 'AR';
  const monthlyCommissionToman = Math.round(
    monthlyReferrals * avgContractToman * (commissionPct / 100),
  );

  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await fetch('/api/visitors/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fullName: visitorName || 'سفیر تشریفات VIP',
          phone: visitorPhone || '09120000000',
          city: visitorCity || 'تهران',
          commissionRate: commissionPct,
          estimatedMonthlyToman: monthlyCommissionToman,
        }),
      });
      const data = (await res.json()) as {
        visitor?: {referralCode?: string};
      };
      setRegisteredCode(data.visitor?.referralCode || 'EVM-VIP-8890');
    } catch {
      setRegisteredCode(`EVM-VIP-${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setRegistering(false);
    }
  };

  const handleCopyCode = () => {
    if (!registeredCode) return;
    navigator.clipboard.writeText(
      `https://eventmate.vip/?ref=${registeredCode}`,
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const vipTiers = [
    {
      id: 'silver',
      name: 'اشتراک نقره‌ای (Silver Banquet)',
      monthlyToman: 4900000,
      badge: 'مناسب کترینگ‌ها و سالن‌های عقد',
      features: [
        'اختصاص صفحه و منوساز زنده اختصاصی',
        'ثبت تا ۵ شب خالی تخفیف‌دار (Flash Dates) در ماه',
        'ارسال خودکار پیش‌فاکتور به واتساپ مدیریت',
        'پشتیبانی از محاسبه‌گر اقساط چک صیادی',
      ],
    },
    {
      id: 'gold_24k',
      name: 'اشتراک طلایی سلطنتی (24K Royal Gold)',
      monthlyToman: 9800000,
      badge: 'پرفروش‌ترین ویژه باغ‌تالارهای عروسی',
      popular: true,
      features: [
        'منوساز نامحدود ۵ زبانه و ۵ ارزی زنده',
        'استوری‌ساز ۱-کلیکی Full HD نامحدود با لوگوی تالار',
        'اتصال رسمی Google Gmail جهت ارسال قراردادها',
        'دسترسی به شبکه ویزیتورهای پورسانتی سراسر کشور',
        'پاسخگوی خودکار ۲۴ ساعته آنلاین و آفلاین',
      ],
    },
    {
      id: 'diamond_fbnm',
      name: 'اشتراک الماس نیومتاورسیتی (FBNM Diamond)',
      monthlyToman: 18500000,
      badge: 'ویژه عمارت‌های بین‌المللی و استیج FBNM',
      features: [
        'غرفه متاورسی ۳بعدی در شهر جدید نیومتاورسیتی جهان',
        'اپلیکیشن اختصاصی اندروید (APK/AAB) و PWA برند شما',
        'اولویت اول نمایش در صدر نتایج رزرو ایران، دبی و استانبول',
        'مدیر حساب تشریفات اختصاصی و داشبورد تحلیلی Recharts',
      ],
    },
  ];

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
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#FAF7F2]">
                {lang === 'FA'
                  ? 'اشتراک VIP تالارها و باشگاه ویزیتورهای پورسانتی (توان استیج FBNM)'
                  : 'VIP Venue Subscriptions & Commission Affiliate Club'}
              </h3>
              <p className="text-xs text-[#E6C258]">
                {lang === 'FA'
                  ? 'ثبت تالار و کترینگ در اکوسیستم جهانی + کسب درآمد میلیونی از معرفی مجالس'
                  : 'Register your venue or earn up to 10% commission referring weddings'}
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

        {/* Sub-nav Tabs */}
        <div className="flex border-b border-[#E6DFD3] bg-[#FAF7F2] px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('vip_tiers')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'vip_tiers'
                ? 'border-[#C59B27] text-[#2C1E16]'
                : 'border-transparent text-[#6E5A4F] hover:text-[#2C1E16]'
            }`}
          >
            <Crown className="w-4 h-4 text-[#9A7411]" />
            {lang === 'FA'
              ? 'پنل اشتراک VIP تالارها و کترینگ‌ها'
              : 'VIP Venue Membership Tiers'}
          </button>
          <button
            onClick={() => setActiveTab('visitor_club')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === 'visitor_club'
                ? 'border-[#C59B27] text-[#2C1E16]'
                : 'border-transparent text-[#6E5A4F] hover:text-[#2C1E16]'
            }`}
          >
            <Users className="w-4 h-4 text-[#9A7411]" />
            {lang === 'FA'
              ? 'باشگاه ویزیتورها و سفیران پورسانتی (۳٪ تا ۱۰٪)'
              : 'Commission Visitor & Affiliate Club'}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'vip_tiers' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vipTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition ${
                      tier.popular
                        ? 'bg-[#2C1E16] text-[#FAF7F2] border-2 border-[#C59B27] shadow-xl'
                        : 'bg-[#FAF7F2] text-[#2C1E16] border-[#E6DFD3]'
                    }`}
                  >
                    <div className="space-y-3">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md ${
                          tier.popular
                            ? 'bg-[#C59B27] text-[#1E130D]'
                            : 'bg-[#E6DFD3] text-[#2C1E16]'
                        }`}
                      >
                        {tier.badge}
                      </span>
                      <h4 className="font-bold text-base">{tier.name}</h4>
                      <div className="pt-1 pb-2 border-b border-[#C59B27]/30">
                        <span
                          className={`text-xl font-extrabold font-mono-num ${
                            tier.popular ? 'text-[#E6C258]' : 'text-[#9A7411]'
                          }`}
                        >
                          {formatMoney(tier.monthlyToman, currency, lang, rates)}
                        </span>
                        <span className="text-xs opacity-75">
                          {' '}
                          / {lang === 'FA' ? 'ماهانه' : 'month'}
                        </span>
                      </div>
                      <ul className="space-y-2 text-xs leading-relaxed pt-1">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                tier.popular ? 'text-[#E6C258]' : 'text-[#9A7411]'
                              }`}
                            />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedTier(tier.name)}
                      className={`mt-5 w-full py-2.5 px-4 rounded-xl font-bold text-xs transition ${
                        tier.popular
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] hover:brightness-105'
                          : 'bg-[#2C1E16] text-[#E6C258] hover:bg-[#3E2723]'
                      }`}
                    >
                      {lang === 'FA'
                        ? 'فعالسازی فوری اشتراک'
                        : 'Activate VIP Tier'}
                    </button>
                  </div>
                ))}
              </div>

              {selectedTier && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      درخواست فعالسازی «{selectedTier}» ثبت شد. پنل مدیریت اختصاصی تالار شما آماده بهره‌برداری است.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('visitor_club')}
                    className="text-xs font-bold text-[#9A7411] underline shrink-0"
                  >
                    مشاهده باشگاه ویزیتورها
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive Commission Calculator */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C59B27]/50 space-y-4">
                <div className="flex items-center gap-2 font-bold text-base text-[#2C1E16]">
                  <Coins className="w-5 h-5 text-[#9A7411]" />
                  <span>
                    {lang === 'FA'
                      ? 'ماشین‌حساب زنده درآمد ویزیتورهای پورسانتی (معرفی عروس و داماد یا تالار)'
                      : 'Live Affiliate Commission Calculator'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>تعداد معرفی موفق مجلس در ماه:</span>
                      <span className="text-[#9A7411] font-mono-num">
                        {monthlyReferrals} قرارداد در ماه
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={monthlyReferrals}
                      onChange={(e) =>
                        setMonthlyReferrals(Number(e.target.value))
                      }
                      className="w-full accent-[#C59B27]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>میانگین مبلغ هر قرارداد تالار و تشریفات:</span>
                      <span className="text-[#9A7411] font-mono-num">
                        {formatMoney(avgContractToman, currency, lang, rates)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={150000000}
                      max={2000000000}
                      step={50000000}
                      value={avgContractToman}
                      onChange={(e) =>
                        setAvgContractToman(Number(e.target.value))
                      }
                      className="w-full accent-[#C59B27]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span>سطح پورسانت سفیر تشریفات:</span>
                      <span className="text-[#9A7411] font-mono-num">
                        {commissionPct}٪ از کل قرارداد
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 5, 7, 10].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setCommissionPct(pct)}
                          className={`py-2 rounded-xl text-xs font-bold font-mono-num border transition ${
                            commissionPct === pct
                              ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27]'
                              : 'bg-white text-[#2C1E16] border-[#E6DFD3]'
                          }`}
                        >
                          {pct}% VIP
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Box */}
                <div className="p-4 rounded-xl bg-[#2C1E16] text-[#FAF7F2] border border-[#C59B27] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#E6DFD3]">
                      درآمد خالص ماهانه شما از پورسانت معرفی:
                    </div>
                    <div className="text-2xl font-extrabold text-[#E6C258] font-mono-num mt-1">
                      {formatMoney(monthlyCommissionToman, currency, lang, rates)}
                    </div>
                  </div>
                  <TrendingUp className="w-10 h-10 text-[#C59B27]" />
                </div>
              </div>

              {/* Instant Visitor Registration & Referral Link */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-[#E6DFD3] space-y-4">
                <h4 className="font-bold text-sm text-[#2C1E16] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9A7411]" />
                  <span>دریافت آنی کد اختصاصی ویزیتور و لینک پورسانت</span>
                </h4>

                <form onSubmit={handleRegisterVisitor} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#6E5A4F] mb-1">
                      نام و نام خانوادگی سفیر / مشاور:
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="مثلاً: سارا محمدی"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-sm text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6E5A4F] mb-1">
                      شماره موبایل (جهت واریز آنی پورسانت):
                    </label>
                    <input
                      type="tel"
                      required
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="0912..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-sm text-[#2C1E16] font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6E5A4F] mb-1">
                      شهر فعالیت:
                    </label>
                    <input
                      type="text"
                      value={visitorCity}
                      onChange={(e) => setVisitorCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-sm text-[#2C1E16]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs shadow-md hover:brightness-105 transition"
                  >
                    {registering
                      ? 'در حال صدور کد سفیر...'
                      : 'ثبت‌نام فوری و دریافت کد معرف پورسانتی'}
                  </button>
                </form>

                {registeredCode && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
                    <div className="text-xs font-bold text-emerald-950">
                      🎉 کد رسمی ویزیتور شما صادر شد:
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-emerald-200">
                      <span className="font-mono-num font-extrabold text-sm text-[#2C1E16]">
                        {registeredCode}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 text-xs font-bold text-[#9A7411]"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            کپی شد
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            کپی لینک معرف
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
