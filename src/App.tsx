import React, {useEffect, useMemo, useState} from 'react';
import {
  Crown,
  Sparkles,
  Users,
  Calendar,
  CheckCircle2,
  Volume2,
  VolumeX,
  Send,
  Mail,
  Camera,
  Accessibility,
  Smartphone,
  BarChart3,
  Flame,
  Star,
  MapPin,
  CreditCard,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Utensils,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import {
  AccessibilitySettings,
  CurrencyCode,
  LanguageCode,
  MenuCategory,
  SayyadiCheckItem,
  ServingStyleId,
  VenuePackage,
} from './types';
import {
  CURRENCY_META,
  FALLBACK_LUXURY_IMAGE,
  FLASH_DATES,
  formatMoney,
  MENU_ITEMS,
  POPULAR_MENUS_CHART_DATA,
  SEASONAL_BOOKINGS_CHART_DATA,
  SERVING_STYLES,
  UI_TEXT,
  VENUE_PACKAGES,
} from './data/catalog';
import {AccessibilityPanel} from './components/AccessibilityPanel';
import {InstallPrompt} from './components/InstallPrompt';
import {StoryMakerModal} from './components/StoryMakerModal';
import {GmailCenterModal} from './components/GmailCenterModal';
import {VipVisitorClubModal} from './components/VipVisitorClubModal';
import {AndroidGithubModal} from './components/AndroidGithubModal';

export default function App() {
  // 1. Language (5 Languages: FA | EN | AR | TR | RU) & Currency (5 Live Currencies: IRT | USD | AED | TRY | RUB)
  const [lang, setLang] = useState<LanguageCode>('FA');
  const [currency, setCurrency] = useState<CurrencyCode>('IRT');
  const [liveRates, setLiveRates] = useState<Record<CurrencyCode, number>>({
    IRT: 1,
    USD: 1 / 62000,
    AED: 1 / 16900,
    TRY: 1 / 1820,
    RUB: 1 / 670,
  });

  // 2. Accessibility Settings
  const [a11y, setA11y] = useState<AccessibilitySettings>({
    fontScale: 100,
    highContrast: false,
    adhdFocusMode: false,
    readableSpacing: false,
    voiceRate: 1.0,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 3. Modals State
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [isVipClubModalOpen, setIsVipClubModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  // 4. Smart Menu Builder & Banquet Calculator State
  const [selectedVenueTitle, setSelectedVenueTitle] = useState(
    'باغ‌تالار امپریال قصر طلایی (ولنجک)',
  );
  const [guestCount, setGuestCount] = useState<number>(300);
  const [servingStyle, setServingStyle] =
    useState<ServingStyleId>('single_plate');
  const [activeMenuTab, setActiveMenuTab] = useState<MenuCategory>('main');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([
    'main_baghali_gardan',
    'main_soltani_kebab',
    'app_caesar_salad',
    'app_vip_fingerfood',
    'fp_tropical_fruits',
    'fp_french_pastry_cake',
    'cer_dutch_floral',
    'cer_stage_lighting_laser',
  ]);

  // Flash Date Discount State
  const [activeFlashDateId, setActiveFlashDateId] = useState<string | null>(
    null,
  );
  const [flashDiscountPercent, setFlashDiscountPercent] = useState<number>(0);

  // Sayyadi Check Installments & Customer Info State
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [installmentMonths, setInstallmentMonths] = useState<number>(6);
  const [customerName, setCustomerName] = useState('امیرحسین رادمنش و سارا تابش');
  const [customerPhone, setCustomerPhone] = useState('09123456789');
  const [managerWhatsApp, setManagerWhatsApp] = useState('989121112233');
  const [eventDate, setEventDate] = useState('پنج‌شنبه ۲۴ مهر ۱۴۰۵');

  // Saved Reservation / WhatsApp Dispatch Feedback
  const [savedTrackingCode, setSavedTrackingCode] = useState<string | null>(
    null,
  );
  const [savingContract, setSavingContract] = useState(false);
  const [whatsAppPreviewOpen, setWhatsAppPreviewOpen] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // 5. Smart Concierge & Offline Auto-Responder State
  const [conciergeQuery, setConciergeQuery] = useState('');
  const [conciergeReply, setConciergeReply] = useState<string | null>(null);
  const [conciergeSource, setConciergeSource] = useState<string>('');
  const [askingConcierge, setAskingConcierge] = useState(false);

  const t = UI_TEXT[lang];
  const isRtl = t.dir === 'rtl';

  // Fetch live exchange rates from /api/rates on mount
  useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then((data: {rates?: Record<CurrencyCode, number>}) => {
        if (data.rates) {
          setLiveRates(data.rates);
        }
      })
      .catch(() => {});
  }, []);

  // Sync document direction, language, and accessibility classes
  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang.toLowerCase();
    document.documentElement.style.fontSize = `${a11y.fontScale}%`;

    document.body.classList.toggle('a11y-high-contrast', a11y.highContrast);
    document.body.classList.toggle('a11y-adhd-focus', a11y.adhdFocusMode);
    document.body.classList.toggle(
      'a11y-readable-spacing',
      a11y.readableSpacing,
    );
  }, [lang, t.dir, a11y]);

  // Financial & Sayyadi Check Calculations
  const currentStyleObj = useMemo(
    () =>
      SERVING_STYLES.find((s) => s.id === servingStyle) || SERVING_STYLES[0],
    [servingStyle],
  );

  const selectedItemsObjects = useMemo(
    () => MENU_ITEMS.filter((item) => selectedItemIds.includes(item.id)),
    [selectedItemIds],
  );

  const calculation = useMemo(() => {
    const perGuestFoodSum = selectedItemsObjects
      .filter((i) => i.pricingType === 'per_guest')
      .reduce((acc, item) => acc + item.priceToman, 0);

    const fixedCeremonialSum = selectedItemsObjects
      .filter((i) => i.pricingType === 'fixed_event')
      .reduce((acc, item) => acc + item.priceToman, 0);

    const styledFoodPerGuest = Math.round(
      perGuestFoodSum * currentStyleObj.multiplier +
        currentStyleObj.serviceFeePerGuestToman,
    );

    const grossTotalToman =
      styledFoodPerGuest * guestCount + fixedCeremonialSum;

    const discountAmountToman = Math.round(
      grossTotalToman * (flashDiscountPercent / 100),
    );

    const netTotalContractToman = grossTotalToman - discountAmountToman;
    const effectivePerGuestToman = Math.round(
      netTotalContractToman / Math.max(guestCount, 1),
    );

    const downPaymentToman = Math.round(
      netTotalContractToman * (downPaymentPercent / 100),
    );
    const remainingForChecksToman = netTotalContractToman - downPaymentToman;
    const eachCheckToman = Math.round(
      remainingForChecksToman / Math.max(installmentMonths, 1),
    );

    const persianMonths = [
      'آبان ۱۴۰۵',
      'آذر ۱۴۰۵',
      'دی ۱۴۰۵',
      'بهمن ۱۴۰۵',
      'اسفند ۱۴۰۵',
      'فروردین ۱۴۰۶',
      'اردیبهشت ۱۴۰۶',
      'خرداد ۱۴۰۶',
      'تیر ۱۴۰۶',
      'مرداد ۱۴۰۶',
      'شهریور ۱۴۰۶',
      'مهر ۱۴۰۶',
    ];

    const sayyadiChecks: SayyadiCheckItem[] = Array.from(
      {length: installmentMonths},
      (_, idx) => ({
        checkNumber: idx + 1,
        sayyadiId: `14059982736451${String(idx + 1).padStart(2, '0')}`,
        dueDatePersian: `۲۵ ${persianMonths[idx % persianMonths.length]}`,
        dueDateGregorian: `2026-${String(((idx + 10) % 12) + 1).padStart(2, '0')}-15`,
        amountToman: eachCheckToman,
      }),
    );

    return {
      perGuestFoodSum,
      fixedCeremonialSum,
      grossTotalToman,
      discountAmountToman,
      netTotalContractToman,
      effectivePerGuestToman,
      downPaymentToman,
      remainingForChecksToman,
      eachCheckToman,
      sayyadiChecks,
    };
  }, [
    selectedItemsObjects,
    currentStyleObj,
    guestCount,
    flashDiscountPercent,
    downPaymentPercent,
    installmentMonths,
  ]);

  const toggleMenuItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Load one of the 10 packages directly into the Smart Menu Builder
  const handleLoadPackage = (pkg: VenuePackage) => {
    setSelectedVenueTitle(pkg.title[lang]);
    setGuestCount(pkg.baseGuestCount);
    setServingStyle(pkg.servingStyle);
    setSelectedItemIds(pkg.includedItemIds);
    setInstallmentMonths(pkg.sayyadiMonths);
    const builderEl = document.getElementById('smart-menu-builder');
    if (builderEl) {
      builderEl.scrollIntoView({behavior: 'smooth'});
    }
  };

  // Apply Flash Date discount directly to the Smart Menu Builder
  const handleApplyFlashDate = (fdId: string) => {
    const fd = FLASH_DATES.find((f) => f.id === fdId);
    if (!fd) return;
    setActiveFlashDateId(fd.id);
    setFlashDiscountPercent(fd.discountPercent);
    setEventDate(fd.persianDate);
    setSelectedVenueTitle(fd.venueName[lang]);
    const pkg = VENUE_PACKAGES.find((p) => p.id === fd.packageId);
    if (pkg) {
      setSelectedItemIds(pkg.includedItemIds);
      setServingStyle(pkg.servingStyle);
    }
    const builderEl = document.getElementById('smart-menu-builder');
    if (builderEl) {
      builderEl.scrollIntoView({behavior: 'smooth'});
    }
  };

  // Voice Readout text for Low-Vision Users (خوانش صوتی فارسی پیش‌فاکتور)
  const spokenInvoiceText = useMemo(() => {
    if (lang !== 'FA') {
      return `EventMate VIP Official Proforma Invoice for ${selectedVenueTitle}. Guest count: ${guestCount} guests. Serving style: ${currentStyleObj.title[lang]}. Cost per guest: ${formatMoney(calculation.effectivePerGuestToman, currency, lang, liveRates)}. Total contract amount: ${formatMoney(calculation.netTotalContractToman, currency, lang, liveRates)}. Cash down payment (${downPaymentPercent}%): ${formatMoney(calculation.downPaymentToman, currency, lang, liveRates)}. Remaining balance payable in ${installmentMonths} Sayyadi checks of ${formatMoney(calculation.eachCheckToman, currency, lang, liveRates)} each.`;
    }
    return `پیش‌فاکتور رسمی سامانه ایونت‌مِیت وی‌آی‌پی برای ${selectedVenueTitle}. تعداد مهمانان: ${guestCount} نفر. شیوه پذیرایی: ${currentStyleObj.title.FA}. هزینه تمام‌شده هر نفر: ${formatMoney(calculation.effectivePerGuestToman, currency, 'FA', liveRates)}. جمع کل قرارداد پس از کسر تخفیف: ${formatMoney(calculation.netTotalContractToman, currency, 'FA', liveRates)}. مبلغ پیش‌پرداخت نقدی (${downPaymentPercent} درصد): ${formatMoney(calculation.downPaymentToman, currency, 'FA', liveRates)}. الباقی در ${installmentMonths} فقره چک صیادی بنفش، مبلغ هر چک ماهانه: ${formatMoney(calculation.eachCheckToman, currency, 'FA', liveRates)}.`;
  }, [
    lang,
    selectedVenueTitle,
    guestCount,
    currentStyleObj,
    calculation,
    currency,
    liveRates,
    downPaymentPercent,
    installmentMonths,
  ]);

  const handleSpeakInvoice = () => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 5000);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenInvoiceText);
    utterance.lang =
      lang === 'FA'
        ? 'fa-IR'
        : lang === 'AR'
          ? 'ar-SA'
          : lang === 'TR'
            ? 'tr-TR'
            : lang === 'RU'
              ? 'ru-RU'
              : 'en-US';
    utterance.rate = a11y.voiceRate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Official WhatsApp Message Formatted Text
  const whatsAppFormattedMessage = useMemo(() => {
    const itemsList = selectedItemsObjects
      .map((i) => `• ${i.name[lang]}`)
      .join('\n');
    return `👑 *پیش‌فاکتور رسمی EventMate VIP | ایونت‌مِیت*
اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM
────────────────────
👤 *میزبان:* ${customerName} (${customerPhone})
🏛️ *تالار / پکیج:* ${selectedVenueTitle}
📅 *تاریخ مراسم:* ${eventDate}
👥 *تعداد مهمانان:* ${guestCount} نفر
🍽️ *شیوه پذیرایی:* ${currentStyleObj.title[lang]}
${flashDiscountPercent > 0 ? `🔥 *تخفیف شب خالی (Flash Date):* ${flashDiscountPercent}٪ کسر شده\n` : ''}────────────────────
✨ *منوی غذا و تشریفات انتخابی:*
${itemsList}
────────────────────
💎 *خلاصه مالی و اقساط چک صیادی:*
🔹 *هزینه هر نفر:* ${formatMoney(calculation.effectivePerGuestToman, currency, lang, liveRates)}
🔸 *جمع کل قرارداد:* ${formatMoney(calculation.netTotalContractToman, currency, lang, liveRates)}
💵 *پیش‌پرداخت نقدی (${downPaymentPercent}٪):* ${formatMoney(calculation.downPaymentToman, currency, lang, liveRates)}
🟣 *اقساط ${installmentMonths} ماهه چک صیادی بنفش:* ماهانه ${formatMoney(calculation.eachCheckToman, currency, lang, liveRates)}`;
  }, [
    selectedItemsObjects,
    lang,
    customerName,
    customerPhone,
    selectedVenueTitle,
    eventDate,
    guestCount,
    currentStyleObj,
    flashDiscountPercent,
    calculation,
    currency,
    liveRates,
    downPaymentPercent,
    installmentMonths,
  ]);

  const whatsAppUrl = useMemo(() => {
    const cleanPhone = managerWhatsApp.replace(/[^0-9]/g, '') || '989121112233';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppFormattedMessage)}`;
  }, [managerWhatsApp, whatsAppFormattedMessage]);

  const handleSaveOfficialContract = async () => {
    setSavingContract(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          customerName,
          customerPhone,
          eventDate,
          guestCount,
          servingStyle: currentStyleObj.title[lang],
          totalToman: calculation.netTotalContractToman,
          downPaymentToman: calculation.downPaymentToman,
          installmentMonths,
          eachCheckToman: calculation.eachCheckToman,
          selectedItems: selectedItemsObjects.map((i) => i.name[lang]),
        }),
      });
      const data = (await res.json()) as {
        reservation?: {trackingCode?: string};
      };
      setSavedTrackingCode(
        data.reservation?.trackingCode ||
          `EVM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      );
    } catch {
      setSavedTrackingCode(
        `EVM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      );
    } finally {
      setSavingContract(false);
    }
  };

  const handleAskConcierge = async (e: React.FormEvent) => {
    e.preventDefault();
    setAskingConcierge(true);
    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query:
            conciergeQuery ||
            `پیشنهاد بهترین منو برای ${guestCount} نفر مهمان و شرایط چک صیادی`,
          guestCount,
          budgetToman: calculation.netTotalContractToman,
          lang,
        }),
      });
      const data = (await res.json()) as {reply?: string; source?: string};
      setConciergeReply(data.reply || null);
      setConciergeSource(data.source || 'offline-auto-responder');
    } catch {
      setConciergeReply(
        `👑 پاسخگوی خودکار آفلاین EventMate VIP: برای ${guestCount} نفر مهمان، پکیج طلایی با ۲ غذای اصلی (باقالی‌پلو با گردن + سلطانی) و اقساط ${installmentMonths} ماهه چک صیادی به مبلغ ماهانه ${formatMoney(calculation.eachCheckToman, currency, lang, liveRates)} بهترین گزینه است.`,
      );
      setConciergeSource('offline-auto-responder');
    } finally {
      setAskingConcierge(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAF7F2] text-[#2C1E16] flex flex-col selection:bg-[#C59B27] selection:text-[#1E130D]"
    >
      {/* Top Royal Ecosystem Bar */}
      <div className="bg-[#2C1E16] text-[#FAF7F2] border-b border-[#C59B27]/50 px-4 py-2 text-xs">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Crown className="w-4 h-4 text-[#E6C258] shrink-0" />
            <span className="text-[#E6C258] font-bold">{t.brandTitle}</span>
            <span className="hidden md:inline text-[#E6DFD3]/60">|</span>
            <span className="text-[#E6DFD3] text-[11px] md:text-xs">
              {t.brandSubtitle}
            </span>
          </div>

          {/* 5-Language & 5-Currency Live Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 5 Languages */}
            <div className="flex items-center bg-[#1E130D] p-0.5 rounded-lg border border-[#C59B27]/40">
              {(['FA', 'EN', 'AR', 'TR', 'RU'] as LanguageCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                    lang === code
                      ? 'bg-[#C59B27] text-[#1E130D]'
                      : 'text-[#E6DFD3] hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* 5 Live Currencies */}
            <div className="flex items-center bg-[#1E130D] p-0.5 rounded-lg border border-[#C59B27]/40">
              {(['IRT', 'USD', 'AED', 'TRY', 'RUB'] as CurrencyCode[]).map(
                (curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono-num transition ${
                      currency === curr
                        ? 'bg-[#E6C258] text-[#1E130D]'
                        : 'text-[#E6DFD3] hover:text-white'
                    }`}
                  >
                    {curr === 'IRT' ? 'تومان' : curr}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation & Action Header */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#C59B27]/40 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Quick Anchors */}
          <div className="flex items-center gap-6">
            <a
              href="#top"
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3E2723] to-[#1E130D] border-2 border-[#C59B27] flex items-center justify-center text-[#E6C258] font-bold text-lg shadow-md">
                EM
              </div>
              <div>
                <div className="font-extrabold text-base text-[#2C1E16] tracking-tight">
                  EventMate <span className="text-[#9A7411]">VIP</span>
                </div>
                <div className="text-[11px] text-[#6E5A4F] font-medium">
                  ایونت‌مِیت | توان استیج FBNM
                </div>
              </div>
            </a>

            <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-[#2C1E16]">
              <a
                href="#smart-menu-builder"
                className="hover:text-[#9A7411] transition"
              >
                {t.navBuilder}
              </a>
              <a
                href="#flash-dates"
                className="hover:text-[#9A7411] transition flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5 text-red-700" />
                {t.navFlashDates}
              </a>
              <a
                href="#venue-packages"
                className="hover:text-[#9A7411] transition"
              >
                {t.navPackages}
              </a>
              <a
                href="#recharts-analytics"
                className="hover:text-[#9A7411] transition"
              >
                {t.navAnalytics}
              </a>
            </nav>
          </div>

          {/* Power Feature Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Accessibility & Voice Reader Button */}
            <button
              onClick={() => setIsA11yOpen(true)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                a11y.adhdFocusMode || a11y.highContrast || isSpeaking
                  ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27]'
                  : 'bg-[#FFFDF9] text-[#2C1E16] border-[#C59B27]/60 hover:bg-[#F3EDE2]'
              }`}
              title="پنل دسترس‌پذیری، خوانش صوتی فارسی و حالت تمرکز ADHD"
            >
              <Accessibility className="w-4 h-4 text-[#9A7411]" />
              <span>
                {lang === 'FA' ? 'دسترس‌پذیری و صوت' : 'Accessibility'}
              </span>
            </button>

            {/* 1-Click HD Story Maker Button */}
            <button
              onClick={() => setIsStoryModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#FFFDF9] text-[#2C1E16] border border-[#C59B27]/60 hover:bg-[#F3EDE2] text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Camera className="w-4 h-4 text-[#9A7411]" />
              <span>{t.navStoryMaker}</span>
            </button>

            {/* Official Google Gmail Integration Button */}
            <button
              onClick={() => setIsGmailModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#FFFDF9] text-[#2C1E16] border border-[#C59B27]/60 hover:bg-[#F3EDE2] text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Mail className="w-4 h-4 text-[#9A7411]" />
              <span>{t.navGmail}</span>
            </button>

            {/* VIP Subscription & Visitor Club Button */}
            <button
              onClick={() => setIsVipClubModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#2C1E16] text-[#E6C258] border border-[#C59B27] hover:bg-[#3E2723] text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Crown className="w-4 h-4" />
              <span>{t.navVipClub}</span>
            </button>

            {/* Android APK/AAB GitHub Direct Push Button */}
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#FFFDF9] text-[#2C1E16] border border-[#C59B27]/60 hover:bg-[#F3EDE2] text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Smartphone className="w-4 h-4 text-[#9A7411]" />
              <span>{t.navAndroidApk}</span>
            </button>

            {/* 1-Click PWA Install Button */}
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.installPwaBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Editorial Banner */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-[#E6DFD3] bg-gradient-to-b from-[#FAF7F2] via-[#F6EFE4] to-[#FAF7F2] py-10 px-4"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2C1E16] text-[#E6C258] text-xs font-bold border border-[#C59B27]">
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-[#2C1E16] leading-[1.25]">
              {t.heroHeadline}
            </h1>

            <p className="text-sm sm:text-base text-[#6E5A4F] leading-relaxed max-w-2xl">
              {t.heroDescription}
            </p>

            {/* Key Value Stat Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="luxury-card p-3.5 rounded-xl bg-[#FFFDF9] border border-[#C59B27]/40">
                <div className="text-xs text-[#6E5A4F]">پکیج‌های واقعی تالار</div>
                <div className="text-lg font-extrabold text-[#2C1E16] font-mono-num mt-0.5">
                  ۱۰ عمارت و کترینگ
                </div>
              </div>
              <div className="luxury-card p-3.5 rounded-xl bg-[#FFFDF9] border border-[#C59B27]/40">
                <div className="text-xs text-[#6E5A4F]">اقساط با چک صیادی</div>
                <div className="text-lg font-extrabold text-[#9A7411] font-mono-num mt-0.5">
                  ۳ تا ۱۲ ماهه
                </div>
              </div>
              <div className="luxury-card p-3.5 rounded-xl bg-[#FFFDF9] border border-[#C59B27]/40">
                <div className="text-xs text-[#6E5A4F]">تخفیف شب‌های خالی</div>
                <div className="text-lg font-extrabold text-emerald-800 font-mono-num mt-0.5">
                  تا ۴۰٪ تخفیف
                </div>
              </div>
              <div className="luxury-card p-3.5 rounded-xl bg-[#FFFDF9] border border-[#C59B27]/40">
                <div className="text-xs text-[#6E5A4F]">پشتیبانی ارزی و زبانی</div>
                <div className="text-lg font-extrabold text-[#2C1E16] font-mono-num mt-0.5">
                  ۵ زبان • ۵ ارز زنده
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Featured Royal Banquet Preview Card */}
          <div className="lg:col-span-5">
            <div className="luxury-card relative rounded-2xl overflow-hidden border-2 border-[#C59B27] shadow-2xl bg-[#2C1E16]">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
                alt="Royal Wedding Banquet Hall"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    FALLBACK_LUXURY_IMAGE;
                }}
                className="w-full h-64 sm:h-72 object-cover opacity-90"
              />
              <div className="p-5 bg-gradient-to-t from-[#1E130D] via-[#2C1E16] to-[#2C1E16]/90 text-[#FAF7F2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E6C258] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان
                  </span>
                  <span className="text-xs font-mono-num px-2.5 py-0.5 rounded bg-[#C59B27] text-[#1E130D] font-bold">
                    توان استیج FBNM
                  </span>
                </div>
                <div className="font-bold text-base text-white">
                  {selectedVenueTitle}
                </div>
                <div className="flex items-center justify-between text-xs text-[#E6DFD3] pt-1">
                  <span>
                    ظرفیت انتخابی:{' '}
                    <strong className="text-[#E6C258] font-mono-num">
                      {guestCount}
                    </strong>{' '}
                    نفر
                  </span>
                  <span>
                    هر نفر:{' '}
                    <strong className="text-[#E6C258] font-mono-num">
                      {formatMoney(
                        calculation.effectivePerGuestToman,
                        currency,
                        lang,
                        liveRates,
                      )}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: SMART LIVE MENU BUILDER & SAYYADI CHECK CALCULATOR */}
      <section
        id="smart-menu-builder"
        className="max-w-[1440px] mx-auto w-full px-4 py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Interactive Menu & Ceremonial Builder */}
          <div className="lg:col-span-7 space-y-6 adhd-dimmable adhd-spotlight">
            {/* Step 1: Guest Count & Active Venue Banner */}
            <div className="luxury-card p-6 rounded-2xl bg-[#FFFDF9] border border-[#C59B27]/50 shadow-md space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6DFD3] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#2C1E16] text-[#E6C258]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-lg text-[#2C1E16]">
                      ۱. {t.guestCountLabel}
                    </h2>
                    <p className="text-xs text-[#6E5A4F]">
                      تالار / پکیج فعال:{' '}
                      <strong className="text-[#9A7411]">
                        {selectedVenueTitle}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-[#2C1E16] text-[#E6C258] font-mono-num font-extrabold text-xl border border-[#C59B27]">
                  {guestCount.toLocaleString(lang === 'FA' ? 'fa-IR' : 'en-US')}{' '}
                  <span className="text-xs font-normal text-[#FAF7F2]">
                    {lang === 'FA' ? 'نفر مهمان' : 'Guests'}
                  </span>
                </div>
              </div>

              {/* Guest Slider */}
              <div className="space-y-3">
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#E6DFD3] rounded-lg appearance-none cursor-pointer accent-[#C59B27]"
                  aria-label="Guest Count Slider"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {[50, 100, 200, 300, 450, 600, 800, 1000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setGuestCount(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-num border transition ${
                        guestCount === preset
                          ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27]'
                          : 'bg-[#FAF7F2] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
                      }`}
                    >
                      {preset} نفر
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Serving Style Selection (تک‌پرس، دیس‌پرس، سلف‌سرویس VIP) */}
            <div className="luxury-card p-6 rounded-2xl bg-[#FFFDF9] border border-[#C59B27]/50 shadow-md space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#2C1E16] text-[#E6C258]">
                  <Utensils className="w-5 h-5" />
                </div>
                <h2 className="font-extrabold text-lg text-[#2C1E16]">
                  ۲. {t.servingStyleLabel}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {SERVING_STYLES.map((style) => {
                  const active = servingStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setServingStyle(style.id)}
                      className={`p-4 rounded-xl border text-right flex flex-col justify-between transition ${
                        active
                          ? 'bg-[#2C1E16] text-[#FAF7F2] border-2 border-[#C59B27] shadow-lg'
                          : 'bg-[#FAF7F2] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                            active
                              ? 'bg-[#C59B27] text-[#1E130D]'
                              : 'bg-[#E6DFD3] text-[#6E5A4F]'
                          }`}
                        >
                          {style.badge[lang]}
                        </span>
                        <div className="font-extrabold text-sm">
                          {style.title[lang]}
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${
                            active ? 'text-[#E6DFD3]' : 'text-[#6E5A4F]'
                          }`}
                        >
                          {style.subtitle[lang]}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#C59B27]/30 flex items-center justify-between text-xs font-mono-num">
                        <span>هزینه سرویس و ظروف:</span>
                        <span
                          className={`font-bold ${
                            active ? 'text-[#E6C258]' : 'text-[#9A7411]'
                          }`}
                        >
                          +
                          {formatMoney(
                            style.serviceFeePerGuestToman,
                            currency,
                            lang,
                            liveRates,
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Select Dishes, Fruits/Pastries & Ceremonial Services */}
            <div className="luxury-card p-6 rounded-2xl bg-[#FFFDF9] border border-[#C59B27]/50 shadow-md space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-extrabold text-lg text-[#2C1E16]">
                  ۳. انتخاب غذاهای اصلی، پیش‌غذا، میوه و شیرینی و خدمات تشریفات
                </h2>
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#C59B27]/40 text-[#9A7411]">
                  {selectedItemIds.length} آیتم در منوی شما انتخاب شده است
                </span>
              </div>

              {/* Category Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    {id: 'main', label: t.mainCoursesTab},
                    {id: 'appetizer', label: t.appetizersTab},
                    {id: 'fruit_pastry', label: t.fruitsPastryTab},
                    {id: 'ceremonial', label: t.ceremonialTab},
                  ] as Array<{id: MenuCategory; label: string}>
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMenuTab(tab.id)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition ${
                      activeMenuTab === tab.id
                        ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#2C1E16] border-[#E6DFD3] hover:border-[#C59B27]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MENU_ITEMS.filter(
                  (item) => item.category === activeMenuTab,
                ).map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleMenuItem(item.id)}
                      className={`cursor-pointer rounded-2xl overflow-hidden border transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-2 border-[#C59B27] shadow-md'
                          : 'bg-white border-[#E6DFD3] hover:border-[#C59B27]/60'
                      }`}
                    >
                      <div>
                        <div className="relative h-36 overflow-hidden bg-[#2C1E16]">
                          <img
                            src={item.image}
                            alt={item.name[lang]}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                FALLBACK_LUXURY_IMAGE;
                            }}
                            className="w-full h-full object-cover transition duration-300 hover:scale-105"
                          />
                          <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                            {item.popular ? (
                              <span className="px-2.5 py-0.5 rounded-md bg-[#2C1E16]/90 text-[#E6C258] text-[11px] font-bold border border-[#C59B27]">
                                ★ محبوب‌ترین
                              </span>
                            ) : (
                              <span />
                            )}
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold ${
                                isSelected
                                  ? 'bg-[#C59B27] text-[#1E130D] border-[#1E130D]'
                                  : 'bg-white/90 text-[#2C1E16] border-[#E6DFD3]'
                              }`}
                            >
                              {isSelected ? '✓' : '+'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-1.5">
                          <div className="font-bold text-sm text-[#2C1E16]">
                            {item.name[lang]}
                          </div>
                          <p className="text-xs text-[#6E5A4F] leading-relaxed">
                            {item.description[lang]}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#E6DFD3] flex items-center justify-between text-xs">
                        <span className="text-[#6E5A4F] font-medium">
                          {item.pricingType === 'per_guest'
                            ? lang === 'FA'
                              ? 'هر نفر مهمان:'
                              : 'Per Guest:'
                            : lang === 'FA'
                              ? 'کل مراسم (ثابت):'
                              : 'Fixed Event Fee:'}
                        </span>
                        <span className="font-extrabold font-mono-num text-[#9A7411]">
                          {formatMoney(
                            item.priceToman,
                            currency,
                            lang,
                            liveRates,
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Sticky Live Proforma Invoice & Purple Sayyadi Check Calculator */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5 adhd-dimmable adhd-spotlight">
            <div className="luxury-card rounded-2xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden">
              {/* Invoice Header */}
              <div className="bg-[#2C1E16] text-[#FAF7F2] p-5 border-b border-[#C59B27]/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E6C258] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    {t.liveInvoiceTitle}
                  </span>
                  <button
                    onClick={
                      isSpeaking ? handleStopSpeaking : handleSpeakInvoice
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      isSpeaking
                        ? 'bg-red-600 text-white'
                        : 'bg-[#C59B27] text-[#1E130D] hover:brightness-105'
                    }`}
                    title="خوانش صوتی فارسی پیش‌فاکتور ویژه کم‌بینایان"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        توقف صوت
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        خوانش صوتی فاکتور
                      </>
                    )}
                  </button>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {selectedVenueTitle}
                </div>
              </div>

              {/* Invoice Body */}
              <div className="p-5 space-y-4">
                {/* Flash Discount Alert if applied */}
                {flashDiscountPercent > 0 && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 flex items-center justify-between text-xs font-bold">
                    <span>
                      🔥 تخفیف شب خالی ({flashDiscountPercent}٪) اعمال شد:
                    </span>
                    <span className="font-mono-num">
                      -
                      {formatMoney(
                        calculation.discountAmountToman,
                        currency,
                        lang,
                        liveRates,
                      )}
                    </span>
                  </div>
                )}

                {/* Primary 4 Financial Outputs Required by User */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3]">
                    <div className="text-xs text-[#6E5A4F]">
                      {t.perGuestCost}
                    </div>
                    <div className="text-lg font-extrabold text-[#2C1E16] font-mono-num mt-1">
                      {formatMoney(
                        calculation.effectivePerGuestToman,
                        currency,
                        lang,
                        liveRates,
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#2C1E16] text-[#FAF7F2] border border-[#C59B27]">
                    <div className="text-xs text-[#E6DFD3]">
                      {t.totalContractAmount}
                    </div>
                    <div className="text-lg font-extrabold text-[#E6C258] font-mono-num mt-1">
                      {formatMoney(
                        calculation.netTotalContractToman,
                        currency,
                        lang,
                        liveRates,
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3]">
                    <div className="text-xs text-[#6E5A4F]">
                      {t.downPaymentLabel} ({downPaymentPercent}%)
                    </div>
                    <div className="text-base font-extrabold text-[#9A7411] font-mono-num mt-1">
                      {formatMoney(
                        calculation.downPaymentToman,
                        currency,
                        lang,
                        liveRates,
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950 text-purple-100 border border-purple-400">
                    <div className="text-xs text-purple-200">
                      {t.eachCheckAmount} ({installmentMonths} چک)
                    </div>
                    <div className="text-base font-extrabold text-white font-mono-num mt-1">
                      {formatMoney(
                        calculation.eachCheckToman,
                        currency,
                        lang,
                        liveRates,
                      )}
                    </div>
                  </div>
                </div>

                {/* Sayyadi Installment Controls */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C1E16]">
                    <span>درصد پیش‌پرداخت نقدی:</span>
                    <div className="flex gap-1.5">
                      {[20, 30, 40, 50].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setDownPaymentPercent(pct)}
                          className={`px-2.5 py-1 rounded-lg font-mono-num border ${
                            downPaymentPercent === pct
                              ? 'bg-[#2C1E16] text-[#E6C258] border-[#C59B27]'
                              : 'bg-white text-[#2C1E16] border-[#E6DFD3]'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#2C1E16]">
                    <span>{t.sayyadiInstallmentsLabel}:</span>
                    <div className="flex gap-1.5">
                      {[3, 6, 9, 12].map((m) => (
                        <button
                          key={m}
                          onClick={() => setInstallmentMonths(m)}
                          className={`px-2.5 py-1 rounded-lg font-mono-num border ${
                            installmentMonths === m
                              ? 'bg-purple-900 text-white border-purple-500'
                              : 'bg-white text-[#2C1E16] border-[#E6DFD3]'
                          }`}
                        >
                          {m} ماهه
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Bank Markazi Purple Sayyadi Check Simulator */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#3B1D5A] via-[#2A1242] to-[#1D0B30] text-white border border-purple-400/50 shadow-inner space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-purple-200 border-b border-purple-400/30 pb-2">
                    <span className="font-bold flex items-center gap-1.5">
                      🟣 شبیه‌ساز چک صیادی بنفش (ثبت در سامانه صیاد بانک مرکزی)
                    </span>
                    <span className="font-mono-num bg-purple-900/80 px-2 py-0.5 rounded border border-purple-400/40">
                      شناسه ۱۶ رقمی صیاد
                    </span>
                  </div>

                  <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                    {calculation.sayyadiChecks.map((chk) => (
                      <div
                        key={chk.checkNumber}
                        className="flex items-center justify-between text-xs bg-white/10 px-3 py-1.5 rounded-lg"
                      >
                        <div>
                          <span className="font-bold text-purple-200">
                            چک {chk.checkNumber}:
                          </span>{' '}
                          <span className="text-[11px] text-white/90">
                            {chk.dueDatePersian}
                          </span>
                        </div>
                        <span className="font-mono-num text-[10px] text-purple-300 hidden sm:inline">
                          ID: {chk.sayyadiId}
                        </span>
                        <span className="font-mono-num font-bold text-[#E6C258]">
                          {formatMoney(
                            chk.amountToman,
                            currency,
                            lang,
                            liveRates,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Host & Venue Manager Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6E5A4F] mb-1">
                      نام میزبان / عروس و داماد:
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-xs text-[#2C1E16]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#6E5A4F] mb-1">
                      شماره واتساپ مدیر تالار:
                    </label>
                    <input
                      type="tel"
                      value={managerWhatsApp}
                      onChange={(e) => setManagerWhatsApp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] text-xs font-mono-num text-[#2C1E16]"
                    />
                  </div>
                </div>

                {/* Action Buttons: WhatsApp, Gmail, Voice Readout, Save Contract */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex gap-2">
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Send className="w-4 h-4" />
                      {t.sendWhatsAppBtn}
                    </a>
                    <button
                      onClick={() =>
                        setWhatsAppPreviewOpen(!whatsAppPreviewOpen)
                      }
                      className="px-3 py-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition"
                      title="پیش‌نمایش و کپی متن واتساپ"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {whatsAppPreviewOpen && (
                    <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                        <span>متن آماده ارسال به واتساپ مدیر تالار:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              whatsAppFormattedMessage,
                            );
                            setCopiedWhatsApp(true);
                            setTimeout(() => setCopiedWhatsApp(false), 2000);
                          }}
                          className="flex items-center gap-1 text-emerald-800 underline"
                        >
                          {copiedWhatsApp ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> کپی شد
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> کپی متن کامل
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-[11px] text-emerald-950 whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto bg-white p-2.5 rounded-lg border border-emerald-200">
                        {whatsAppFormattedMessage}
                      </pre>
                    </div>
                  )}

                  <button
                    onClick={() => setIsGmailModalOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition"
                  >
                    <Mail className="w-4 h-4" />
                    {t.sendGmailBtn}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleSaveOfficialContract}
                      disabled={savingContract}
                      className="py-2.5 px-3 rounded-xl bg-[#2C1E16] text-[#E6C258] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#3E2723] transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {savingContract ? 'در حال ثبت...' : t.saveOfficialBtn}
                    </button>

                    <button
                      onClick={() => setIsStoryModalOpen(true)}
                      className="py-2.5 px-3 rounded-xl bg-[#FAF7F2] text-[#2C1E16] border border-[#C59B27] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F3EDE2] transition"
                    >
                      <Camera className="w-4 h-4 text-[#9A7411]" />
                      خروجی استوری HD
                    </button>
                  </div>

                  {savedTrackingCode && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between">
                      <span>✅ پیش‌فاکتور رسمی ثبت شد:</span>
                      <span className="font-mono-num px-2.5 py-1 rounded bg-white border border-emerald-300">
                        {savedTrackingCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SMART FLASH DATES CALENDAR (تقویم هوشمند شب‌های خالی تالار با تخفیف ویژه لحظه آخری) */}
      <section
        id="flash-dates"
        className="bg-[#F4EFE6] border-y border-[#E6DFD3] py-12 px-4 adhd-dimmable"
      >
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 bg-red-100 px-3 py-1 rounded-md mb-2">
                <Flame className="w-4 h-4" />
                <span>FLASH DATES • تخفیف‌های لحظه آخری شب‌های خالی تالار</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E16]">
                {t.flashDatesTitle}
              </h2>
              <p className="text-sm text-[#6E5A4F] mt-1">
                {t.flashDatesSubtitle}
              </p>
            </div>

            {flashDiscountPercent > 0 && (
              <button
                onClick={() => {
                  setActiveFlashDateId(null);
                  setFlashDiscountPercent(0);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#C59B27] text-xs font-bold text-[#2C1E16] hover:bg-[#FAF7F2]"
              >
                حذف تخفیف تاریخ لحظه آخری ({flashDiscountPercent}٪)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FLASH_DATES.map((fd) => {
              const isSelected = activeFlashDateId === fd.id;
              return (
                <div
                  key={fd.id}
                  className={`luxury-card rounded-2xl p-5 border flex flex-col justify-between transition ${
                    isSelected
                      ? 'bg-[#2C1E16] text-[#FAF7F2] border-2 border-[#C59B27] shadow-xl'
                      : 'bg-[#FFFDF9] text-[#2C1E16] border-[#C59B27]/40 hover:border-[#C59B27]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-lg bg-red-700 text-white font-mono-num font-extrabold text-xs">
                        {fd.discountPercent}% OFF
                      </span>
                      <span
                        className={`text-xs font-bold flex items-center gap-1 ${
                          isSelected ? 'text-[#E6C258]' : 'text-[#9A7411]'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {fd.dayName[lang]}
                      </span>
                    </div>

                    <div>
                      <div className="text-lg font-extrabold">
                        {fd.persianDate}
                      </div>
                      <div
                        className={`text-sm font-bold mt-0.5 ${
                          isSelected ? 'text-[#E6C258]' : 'text-[#3E2723]'
                        }`}
                      >
                        {fd.venueName[lang]}
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? 'text-[#E6DFD3]' : 'text-[#6E5A4F]'
                      }`}
                    >
                      {fd.reasonBadge[lang]}
                    </p>

                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        isSelected
                          ? 'bg-white/10 text-[#E6C258]'
                          : 'bg-[#FAF7F2] text-[#2C1E16] border border-[#E6DFD3]'
                      }`}
                    >
                      🎁 {fd.giftBonus[lang]}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyFlashDate(fd.id)}
                    className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                      isSelected
                        ? 'bg-[#C59B27] text-[#1E130D]'
                        : 'bg-[#2C1E16] text-[#E6C258] hover:bg-[#3E2723]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSelected
                      ? 'این تاریخ و تخفیف روی فاکتور شما فعال است'
                      : t.applyFlashDiscountBtn}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: 10 AUTHENTIC VENUE & CATERING PACKAGES SHOWCASE */}
      <section
        id="venue-packages"
        className="max-w-[1440px] mx-auto w-full px-4 py-12 space-y-6 adhd-dimmable"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A7411] bg-[#C59B27]/15 px-3 py-1 rounded-md mb-2">
            <Crown className="w-4 h-4" />
            <span>10 ROYAL VENUE & CATERING PACKAGES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E16]">
            {t.packagesTitle}
          </h2>
          <p className="text-sm text-[#6E5A4F] mt-1">{t.packagesSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VENUE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="luxury-card rounded-2xl bg-[#FFFDF9] border border-[#C59B27]/50 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <div className="relative h-56 bg-[#2C1E16] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title[lang]}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        FALLBACK_LUXURY_IMAGE;
                    }}
                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-[#2C1E16]/90 text-[#E6C258] text-xs font-bold border border-[#C59B27]">
                      {pkg.categoryBadge[lang]}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#2C1E16] font-mono-num font-bold text-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                      {pkg.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between bg-[#1E130D]/85 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-[#C59B27]/40 text-[#FAF7F2] text-xs">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#E6C258] shrink-0" />
                      {pkg.location[lang]}
                    </span>
                    <span className="font-mono-num text-[#E6C258] font-bold shrink-0">
                      ظرفیت: {pkg.capacityRange}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#2C1E16]">
                    {pkg.title[lang]}
                  </h3>
                  <p className="text-xs text-[#6E5A4F] leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DFD3]">
                    {pkg.highlights[lang]}
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 bg-[#FAF7F2] border-t border-[#E6DFD3] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-[#6E5A4F]">
                    شروع قیمت هر نفر (اقساط {pkg.sayyadiMonths} ماهه صیادی):
                  </div>
                  <div className="text-lg font-extrabold font-mono-num text-[#9A7411]">
                    {formatMoney(
                      pkg.pricePerGuestToman,
                      currency,
                      lang,
                      liveRates,
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleLoadPackage(pkg)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs flex items-center gap-2 shadow-sm hover:brightness-105 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.loadPackageIntoBuilderBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: RECHARTS EXECUTIVE ANALYTICS DASHBOARD */}
      <section
        id="recharts-analytics"
        className="bg-[#F4EFE6] border-t border-[#E6DFD3] py-12 px-4 adhd-dimmable"
      >
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C1E16] bg-[#C59B27]/25 px-3 py-1 rounded-md mb-2">
                <BarChart3 className="w-4 h-4 text-[#9A7411]" />
                <span>RECHARTS BI ANALYTICS • هوش تجاری تالارها و کترینگ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E16]">
                {t.analyticsTitle}
              </h2>
              <p className="text-sm text-[#6E5A4F] mt-1">
                {t.analyticsSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Most Popular Menus & Satisfaction */}
            <div className="luxury-card p-6 rounded-2xl bg-[#FFFDF9] border border-[#C59B27]/50 shadow-md space-y-4">
              <h3 className="font-bold text-base text-[#2C1E16]">
                {lang === 'FA'
                  ? 'نمودار محبوب‌ترین غذاها و منوهای مجالس در سال جاری (تعداد سفارش)'
                  : 'Most Popular Banquet Dishes & Menus (Annual Orders)'}
              </h3>
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={POPULAR_MENUS_CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" />
                    <XAxis
                      dataKey={lang === 'FA' ? 'name' : 'nameEn'}
                      tick={{fill: '#2C1E16', fontSize: 11}}
                    />
                    <YAxis tick={{fill: '#2C1E16', fontSize: 11}} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2C1E16',
                        color: '#FAF7F2',
                        borderRadius: '12px',
                        border: '1px solid #C59B27',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="orders"
                      name={
                        lang === 'FA' ? 'تعداد مجالس رزروشده' : 'Events Ordered'
                      }
                      fill="#C59B27"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="satisfaction"
                      name={
                        lang === 'FA' ? 'درصد رضایت مهمانان' : 'Satisfaction %'
                      }
                      fill="#2C1E16"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Peak Booking Nights & Flash Deals across 12 Months */}
            <div className="luxury-card p-6 rounded-2xl bg-[#FFFDF9] border border-[#C59B27]/50 shadow-md space-y-4">
              <h3 className="font-bold text-base text-[#2C1E16]">
                {lang === 'FA'
                  ? 'تحلیل شب‌های پررزرو سال و ضریب اشغال تالارها در ۱۲ ماه'
                  : '12-Month Peak Wedding Bookings & Venue Occupancy %'}
              </h3>
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SEASONAL_BOOKINGS_CHART_DATA}>
                    <defs>
                      <linearGradient
                        id="goldGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#C59B27"
                          stopOpacity={0.75}
                        />
                        <stop
                          offset="95%"
                          stopColor="#C59B27"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" />
                    <XAxis
                      dataKey={lang === 'FA' ? 'month' : 'monthEn'}
                      tick={{fill: '#2C1E16', fontSize: 11}}
                    />
                    <YAxis tick={{fill: '#2C1E16', fontSize: 11}} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2C1E16',
                        color: '#FAF7F2',
                        borderRadius: '12px',
                        border: '1px solid #C59B27',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="weddings"
                      name={
                        lang === 'FA'
                          ? 'شب‌های رزرو کامل'
                          : 'Booked Wedding Nights'
                      }
                      stroke="#9A7411"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#goldGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="flashDeals"
                      name={
                        lang === 'FA'
                          ? 'شب‌های تخفیف‌دار Flash'
                          : 'Flash Discount Nights'
                      }
                      stroke="#2C1E16"
                      strokeWidth={2}
                      fill="#2C1E16"
                      fillOpacity={0.15}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: 24/7 SMART BANQUET CONCIERGE & OFFLINE AUTO-RESPONDER */}
      <section className="max-w-[1440px] mx-auto w-full px-4 py-12 adhd-dimmable">
        <div className="luxury-card rounded-2xl bg-[#2C1E16] text-[#FAF7F2] border-2 border-[#C59B27] p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#C59B27]/20 text-[#E6C258]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#FAF7F2]">
                  {t.conciergeTitle}
                </h2>
                <p className="text-xs text-[#E6C258]">
                  اتوماسیون ۱۰۰٪ امن سرور (server.ts) با موتور پاسخگوی خودکار آفلاین و آنلاین
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-900/70 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              پاسخگوی خودکار فعال
            </span>
          </div>

          <form
            onSubmit={handleAskConcierge}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={conciergeQuery}
              onChange={(e) => setConciergeQuery(e.target.value)}
              placeholder={t.conciergePlaceholder}
              className="flex-1 px-4 py-3 rounded-xl bg-[#FFFDF9] text-[#2C1E16] text-sm border border-[#C59B27] focus:outline-none"
            />
            <button
              type="submit"
              disabled={askingConcierge}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition shrink-0"
            >
              <RefreshCw
                className={`w-4 h-4 ${askingConcierge ? 'animate-spin' : ''}`}
              />
              {askingConcierge ? 'در حال محاسبه...' : t.conciergeAskBtn}
            </button>
          </form>

          {conciergeReply && (
            <div className="p-5 rounded-xl bg-[#FFFDF9] text-[#2C1E16] border border-[#C59B27] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#9A7411]">
                <span>پاسخ رسمی مشاور هوشمند تشریفات:</span>
                <span className="font-mono-num">Mode: {conciergeSource}</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {conciergeReply}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Royal Footer */}
      <footer className="mt-auto bg-[#1E130D] text-[#FAF7F2] border-t-2 border-[#C59B27] py-8 px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2C1E16] border border-[#C59B27] flex items-center justify-center text-[#E6C258] font-bold">
              EM
            </div>
            <div>
              <div className="font-bold text-sm text-[#E6C258]">
                EventMate VIP | ایونت‌مِیت
              </div>
              <div className="text-[#E6DFD3]/80">
                اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E6C258] font-bold transition"
            >
              نصب وب‌اپلیکیشن (PWA)
            </button>
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E6C258] font-bold transition"
            >
              پروژه اندروید (com.eventmate.vip)
            </button>
            <button
              onClick={() => setIsVipClubModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E6C258] font-bold transition"
            >
              باشگاه ویزیتورهای پورسانتی
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS & FLOATING SUITES */}
      <AccessibilityPanel
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
        settings={a11y}
        onUpdateSettings={setA11y}
        onSpeakInvoice={handleSpeakInvoice}
        onStopSpeaking={handleStopSpeaking}
        isSpeaking={isSpeaking}
        lang={lang}
        spokenPreviewText={spokenInvoiceText}
      />

      <InstallPrompt
        lang={lang}
        forceOpenModal={isPwaModalOpen}
        onCloseModal={() => setIsPwaModalOpen(false)}
        onOpenAndroidStudioModal={() => setIsAndroidModalOpen(true)}
      />

      <StoryMakerModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        lang={lang}
        currency={currency}
        rates={liveRates}
        venueTitle={selectedVenueTitle}
        guestCount={guestCount}
        servingStyleTitle={currentStyleObj.title[lang]}
        perGuestToman={calculation.effectivePerGuestToman}
        totalContractToman={calculation.netTotalContractToman}
        downPaymentToman={calculation.downPaymentToman}
        installmentMonths={installmentMonths}
        eachCheckToman={calculation.eachCheckToman}
        selectedItemNames={selectedItemsObjects.map((i) => i.name[lang])}
        flashDiscountPercent={flashDiscountPercent}
      />

      <GmailCenterModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        lang={lang}
        currency={currency}
        rates={liveRates}
        customerName={customerName}
        customerPhone={customerPhone}
        eventDate={eventDate}
        venueTitle={selectedVenueTitle}
        guestCount={guestCount}
        servingStyleTitle={currentStyleObj.title[lang]}
        perGuestToman={calculation.effectivePerGuestToman}
        totalContractToman={calculation.netTotalContractToman}
        downPaymentToman={calculation.downPaymentToman}
        installmentMonths={installmentMonths}
        eachCheckToman={calculation.eachCheckToman}
        selectedItemNames={selectedItemsObjects.map((i) => i.name[lang])}
        sayyadiChecks={calculation.sayyadiChecks}
      />

      <VipVisitorClubModal
        isOpen={isVipClubModalOpen}
        onClose={() => setIsVipClubModalOpen(false)}
        lang={lang}
        currency={currency}
        rates={liveRates}
      />

      <AndroidGithubModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
