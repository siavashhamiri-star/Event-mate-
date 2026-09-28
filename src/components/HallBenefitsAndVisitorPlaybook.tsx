import React, {useState} from 'react';
import {
  Award,
  BadgeCheck,
  Briefcase,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Compass,
  Copy,
  Crown,
  Flame,
  Gift,
  Handshake,
  Landmark,
  Layers,
  Lightbulb,
  Lock,
  MessageSquareQuote,
  Play,
  QrCode,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import {CurrencyCode, LanguageCode} from '../types';
import {formatMoney, formatNumberLocale} from '../utils/formatters';

interface HallBenefitsAndVisitorPlaybookProps {
  lang: LanguageCode;
  currency: CurrencyCode;
  hallName: string;
  onQuickApplyDemoHall?: (hallName: string, managerName: string, city: string, phone: string) => void;
}

interface DeliverableItem {
  id: string;
  badge: string;
  title: string;
  whatHallGets: string;
  financialImpact: string;
  marketValueToman: number;
  targetAnchor: string;
}

interface PlaybookPhase {
  stepNumber: number;
  timeRange: string;
  phaseTitle: string;
  audience: string;
  goldenRule: string;
  featuresToIntroduce: {
    priority: string;
    featureName: string;
    whatToDoLive: string;
    exactScriptToSay: string;
    jumpAnchor: string;
  }[];
}

const HALL_DELIVERABLES: DeliverableItem[] = [
  {
    id: 'deliv-1',
    badge: 'تحویلی ۱ • مالکیت انحصاری برند',
    title: 'سامانه اختصاصی وایت‌لیبل و ۱۰۰٪ ایزوله با نام و لوگوی تالار (?hall=نام-تالار)',
    whatHallGets:
      'تمامی صفحات، سربرگ‌ها، فاکتورهای واتساپ و ایمیل و استوری‌ها فقط و فقط با نام، شعار و شماره تماس تالار شما باز می‌شوند و هیچ نامی از تالارهای رقیب در آن وجود ندارد.',
    financialImpact:
      'صرفه‌جویی ۳۰۰ میلیون تومانی نسبت به سفارش برنامه‌نویسی اختصاصی + پرستیژ برندینگ تالار ۵ ستاره.',
    marketValueToman: 120000000,
    targetAnchor: '#white-label-customizer',
  },
  {
    id: 'deliv-2',
    badge: 'تحویلی ۲ • موتور فروش سر میز مدیریت',
    title: 'تبلت منوساز زنده با ۴۰+ آیتم غذایی و تشریفاتی + محاسبه در ۰.۱ ثانیه',
    whatHallGets:
      'حذف کامل کاغذ، خودکار و ماشین‌حساب سنتی! مدیر تالار جلوی عروس و داماد هر غذا (گردن، ماهیچه، شیرینی، گل‌آرایی) را کم یا زیاد کند، قیمت هر نفر و کل قرارداد در لحظه محاسبه می‌شود.',
    financialImpact:
      'افزایش ۲.۵ برابری نرخ تبدیل جلسات حضوری به قرارداد قطعی و پایان فرار مشتری با جمله «می‌رویم فکرهایمان را بکنیم».',
    marketValueToman: 65000000,
    targetAnchor: '#builder',
  },
  {
    id: 'deliv-3',
    badge: 'تحویلی ۳ • امنیت مالی و بانکی تالار',
    title: 'موتور تقسیط چک صیادی بنفش (۳ تا ۱۲ ماهه) + استعلام رنگ چک + تقسیم هزینه دو خانواده',
    whatHallGets:
      'محاسبه خودکار پیش‌پرداخت نقدی و مبلغ دقیق هر برگ چک صیادی به همراه تاریخ سررسید شمسی، استعلام وضعیت سفید/زرد/قرمز صیادی و مشخص کردن سهم دقیق خانواده عروس و خانواده داماد.',
    financialImpact:
      'جلوگیری ۱۰۰٪ از دریافت چک برگشتی + حذف جر و بحث خانواده‌ها سر میز قرارداد تالار.',
    marketValueToman: 70000000,
    targetAnchor: '#value-drivers',
  },
  {
    id: 'deliv-4',
    badge: 'تحویلی ۴ • اتوماسیون پیش‌فاکتور فوری',
    title: 'صدور ۱-کلیکی پیش‌فاکتور رسمی طلاکوب در واتساپ، جیمیل و PDF چاپی',
    whatHallGets:
      'در پایان جلسه مشاوره، با یک کلیک پیش‌فاکتور کامل شامل ریز منو، اقساط چک صیادی، سهم هر خانواده و ضمانت قیمت با نام مدیر تالار به واتساپ عروس و داماد و والدینشان ارسال می‌شود.',
    financialImpact:
      'پیگیری خودکار مشتری و ماندگاری نام تالار در گوشی خانواده‌ها تا لحظه واریز بیعانه.',
    marketValueToman: 35000000,
    targetAnchor: '#builder',
  },
  {
    id: 'deliv-5',
    badge: 'تحویلی ۵ • شکار شب‌های سوخته',
    title: 'تقویم حراج شب‌های خالی وسط هفته (Flash Dates) + مناقصه معکوس ۶۰ دقیقه‌ای',
    whatHallGets:
      'نمایش تاریخ‌های خالی دوشنبه و سه‌شنبه یا ایام کم‌تقاضا با تخفیف هدفمند و شمارنده معکوس برای جذب زوج‌هایی که به دنبال تاریخ اقتصادی هستند.',
    financialImpact:
      'پر شدن حتی ۱ شب خالی در سال، بین ۱۵۰ تا ۳۵۰ میلیون تومان سود خالص به جیب تالاردار وارد می‌کند (۳ تا ۷ برابر کل قیمت خرید برنامه!).',
    marketValueToman: 80000000,
    targetAnchor: '#flash-dates',
  },
  {
    id: 'deliv-6',
    badge: 'تحویلی ۶ • فین‌تک شب عروسی',
    title: 'درگاه «شاباش و کادوی QR سر میز مهمانان» + دیوار زنده تبریک روی تلویزیون سالن (LED Wall)',
    whatHallGets:
      'بارکد اختصاصی روی هر میز که مهمانان با اسکن آن کادوی عروسی را آنلاین پرداخت می‌کنند؛ نام مهمان با افکت طلایی روی تلویزیون سالن نقش می‌بندد و مبلغ جمع‌شده مستقیم اولین چک تالار را تسویه می‌کند.',
    financialImpact:
      'تسویه نقدی ۳۰٪ تا ۵۰٪ بدهی چک‌های عروس و داماد به تالار در همان شب برگزاری مراسم!',
    marketValueToman: 60000000,
    targetAnchor: '#value-drivers',
  },
  {
    id: 'deliv-7',
    badge: 'تحویلی ۷ • قفل قرارداد فوری',
    title: 'گواهی قفل قیمت ضدتورم مواد اولیه (Inflation-Shield) + بیمه هواشناسی باغ‌تالار',
    whatHallGets:
      'ابزار ترغیب مشتری به پرداخت فوری پیش‌پرداخت در ازای تضمین کتبی ثبات نرخ گوشت، برنج و زعفران تا شب مراسم + تضمین سالن مسقف پشتیبان در روزهای بارانی.',
    financialImpact:
      'افزایش نقدینگی روزانه تالار از محل دریافت سریع‌تر پیش‌پرداخت‌های ۳۰٪.',
    marketValueToman: 40000000,
    targetAnchor: '#value-drivers',
  },
  {
    id: 'deliv-8',
    badge: 'تحویلی ۸ • مهندسی سالن و پرستیژ',
    title: 'چیدمان هوشمند میزها با دسی‌بل صوتی + رزرو شب تست غذای VIP + استوری‌ساز اینستاگرام + اپ اندروید',
    whatHallGets:
      'تفکیک میز سالمندان از باندهای ارکستر، سیستم رزرو شب تست غذای سرآشپز، خروجی استوری HD اینستاگرام، گواهی خیریه «برکت جشن»، ۷ زبان زنده و نسخه نصبی PWA/APK.',
    financialImpact:
      'تبدیل شدن به مدرن‌ترین تالار شهر و جذب رایگان ده‌ها عروس و داماد جدید از طریق استوری‌های اینستاگرامی مهمانان.',
    marketValueToman: 55000000,
    targetAnchor: '#analytics',
  },
];

const VISITOR_PLAYBOOK_PHASES: PlaybookPhase[] = [
  {
    stepNumber: 1,
    timeRange: 'گام اول • ۲ دقیقه اول ورود به دفتر تالار (شکار توجه و شکستن گارد ذهنی)',
    phaseTitle: 'ابتدا فقط این ۳ قابلیت را نشان دهید تا مدیر تالار در ۱۲۰ ثانیه اول میخکوب شود!',
    audience: 'مخاطب: مالک یا مدیر ارشد تالار (حتی اگر سنتی یا کم‌حوصله باشد)',
    goldenRule:
      '⚠️ قانون طلایی ویزیتور: هرگز در ۲ دقیقه اول درباره همه ۲۰ قابلیت برنامه صحبت نکنید! مدیر تالار سنتی اگر شلوغی ببیند گیج می‌شود. قبل از ورود به اتاق، نام تالار خودش را در بخش وایت‌لیبل وارد کنید و فقط این ۳ مورد را نشان دهید:',
    featuresToIntroduce: [
      {
        priority: 'قابلیت اول (ثانیه ۱ تا ۳۰)',
        featureName: '۱. نمایش سامانه با نام و برند اختصاصی خودِ تالار (?hall=...)',
        whatToDoLive:
          'تبلت یا موبایل خود را جلوی مدیر تالار بگذارید تا در همان نگاه اول، نام تالار، نام خودش و شهرش را بالای برنامه با تاج طلایی ببیند.',
        exactScriptToSay:
          '«حاج‌آقا / جناب مهندس، خسته نباشید. ما یک سایت تبلیغاتی عمومی که اسم تالارهای رقیب شما داخلش باشد نیاورده‌ایم؛ این سامانه اختصاصی و ایزوله به نام خودِ تالار شماست که روی تبلت میز مدیریت شما نصب می‌شود.»',
        jumpAnchor: '#white-label-customizer',
      },
      {
        priority: 'قابلیت دوم (ثانیه ۳۰ تا ۹۰)',
        featureName: '۲. منوساز زنده ۴۰ آیتمی و حذف ماشین‌حساب سر میز قرارداد',
        whatToDoLive:
          'اسلایدر مهمانان را روی ۳۵۰ نفر بگذارید، باقالی‌پلو با گردن یا شیرینی VIP را تیک بزنید و بردارید تا ببیند قیمت هر نفر و مبلغ هر برگ چک صیادی در ۰.۱ ثانیه بدون ماشین‌حساب عوض می‌شود.',
        exactScriptToSay:
          '«وقتی عروس و داماد سر میز شما می‌نشینند و می‌گویند هزینه زیاد شد، به جای اینکه ۱۰ دقیقه با ماشین‌حساب ضرب و تقسیم کنید و مشتری بگوید "می‌رویم فکر کنیم"، همین‌جا با یک لمس منو را با بودجه‌شان تنظیم می‌کنید و همان لحظه قرارداد را می‌بندید.»',
        jumpAnchor: '#builder',
      },
      {
        priority: 'قابلیت سوم (ثانیه ۹۰ تا ۱۲۰ — ضربه کاری اول)',
        featureName: '۳. ارسال ۱-کلیکی پیش‌فاکتور طلاکوب به واتساپِ گوشی خودِ مدیر تالار!',
        whatToDoLive:
          'شماره موبایل خودِ مدیر تالار را وارد کنید و دکمه سبز «ارسال پیش‌فاکتور رسمی به واتساپ» را بزنید تا صدای پیامک واتساپ گوشی خودش بلند شود.',
        exactScriptToSay:
          '«الان به گوشی خودتان نگاه کنید! این پیش‌فاکتور رسمی با نام و سربرگ تالار شما، ریز منو و اقساط چک صیادی است که در ۱ ثانیه برای پدر عروس و داماد ارسال می‌شود. کدام تالار در شهر شما چنین پرستیژی دارد؟»',
        jumpAnchor: '#builder',
      },
    ],
  },
  {
    stepNumber: 2,
    timeRange: 'گام دوم • دقیقه ۳ تا ۶ جلسه (اثبات بازگشت سرمایه ۱۰ برابری و امنیت مالی)',
    phaseTitle: 'حالا که مدیر تالار علاقه‌مند شد، این ۳ قابلیتِ پول‌ساز و ضدریسک را معرفی کنید:',
    audience: 'مخاطب: مالک تالار و مدیر مالی مجموعه',
    goldenRule:
      '💡 نکته کلیدی: در این مرحله مدیر تالار از خودش می‌پرسد «آیا این برنامه واقعاً به من سود مالی می‌رساند و جلوی ضرر چک را می‌گیرد؟». با این ۳ قابلیت به او پاسخ قطعی بدهید:',
    featuresToIntroduce: [
      {
        priority: 'قابلیت چهارم (دقیقه ۳ تا ۴)',
        featureName: '۴. استعلام رنگ چک صیادی (سفید/زرد/قرمز) + تقسیم هزینه بین دو خانواده',
        whatToDoLive:
          'بخش استعلام صیادی و اسلایدر تقسیم هزینه خانواده (مثلاً ۵۰٪ زوج، ۳۰٪ خانواده داماد، ۲۰٪ خانواده عروس) را تکان دهید.',
        exactScriptToSay:
          '«نیمی از جلسات تالار به خاطر بحث خانواده عروس و داماد سر سهم چک‌ها بهم می‌خورد. این سیستم سر میز شما سهم هر خانواده از هر برگ چک را جدا می‌کند و وضعیت سفید صیادی را در فاکتور ثبت می‌کند تا هرگز چک برگشتی نگیرید.»',
        jumpAnchor: '#value-drivers',
      },
      {
        priority: 'قابلیت پنجم (دقیقه ۴ تا ۵)',
        featureName: '۵. تقویم حراج شب‌های خالی وسط هفته (Flash Dates) و مناقصه معکوس',
        whatToDoLive:
          'روی یکی از کارت‌های شب‌های خالی وسط هفته کلیک کنید تا ۱۵٪ تخفیف روی فاکتور اعمال شود و پنل مناقصه معکوس را نشان دهید.',
        exactScriptToSay:
          '«هر شب دوشنبه یا سه‌شنبه که تالار شما خالی می‌ماند، حداقل ۱۵۰ میلیون تومان سود از دست رفته است. این ماژول شب‌های خالی شما را به زوج‌های اقتصادی می‌فروشد. فقط ۱ شب خالی شما در سال پر شود، ۴ برابر کل پول این نرم‌افزار در جیب شماست!»',
        jumpAnchor: '#flash-dates',
      },
      {
        priority: 'قابلیت ششم (دقیقه ۵ تا ۶)',
        featureName: '۶. شاباش و کادوی QR سر میز مهمانان + قفل ضمانت قیمت ضدتورم',
        whatToDoLive:
          'تب «شاباش و کادوی QR سر میز» و دکمه «قفل قیمت ضدتورم گوشت و برنج» را روشن کنید.',
        exactScriptToSay:
          '«با بارکد QR سر میز، مهمانان کادوی عروسی را آنلاین واریز می‌کنند، اسمشان روی تلویزیون سالن شما طلاکوب می‌شود و با همان پول، اولین برگ چک صیادی شما همان شب عروسی نقداً تسویه می‌شود!»',
        jumpAnchor: '#value-drivers',
      },
    ],
  },
  {
    stepNumber: 3,
    timeRange: 'گام سوم • دقیقه ۷ تا ۱۰ (معرفی امکانات تکمیلی به مدیر داخلی + بستن قرارداد و دریافت شبا)',
    phaseTitle: 'معرفی امکانات فانتزی به مدیر داخلی جوان و بستن قرارداد با فرمول بدون ریسک',
    audience: 'مخاطب: مدیر داخلی، ادمین اینستاگرام تالار و جمع‌بندی نهایی با مالک',
    goldenRule:
      '🏆 فرمول طلایی بستن قرارداد: اگر مدیر تالار آماده خرید نقدی ۴۸ میلیون تومان بود، بلافاصله در بخش شبا ثبت کنید و ۱۲ میلیون تومان (۲۵٪) پورسانت نقدی خود را بگیرید. اگر تردید داشت، فرمول اقساطی زیر را پیشنهاد دهید:',
    featuresToIntroduce: [
      {
        priority: 'قابلیت هفتم (دقیقه ۷ تا ۸ — ویژه مدیر داخلی و ادمین)',
        featureName: '۷. چیدمان هوشمند میزها با دسی‌بل صوتی + استوری‌ساز اینستاگرام + شب تست غذا',
        whatToDoLive:
          'نقشه چیدمان میزها (تفکیک سالمندان از باند ارکستر)، خروجی استوری HD اینستاگرام و فرم رزرو شب تست غذای سرآشپز را به مدیر داخلی نشان دهید.',
        exactScriptToSay:
          '«این بخش هم دستیار هوشمند مدیر داخلی و ادمین پیج شماست: هم استوری آماده با لوگوی تالار می‌سازد، هم جای میز بزرگترهای فامیل را دور از صدای باندها می‌چیند تا همه از مدیریت تالار شما تعریف کنند.»',
        jumpAnchor: '#value-drivers',
      },
      {
        priority: 'قابلیت هشتم (دقیقه ۸ تا ۱۰ — بستن قطعی فروش)',
        featureName: '۸. پیشنهاد مالی رد نشدنی (نقد یا فرمول ۱۲ میلیون پیش + ۲ چک صیادی)',
        whatToDoLive:
          'بخش «دعوت‌نامه رسمی و ثبت لایسنس» را باز کنید، شماره شبا خود را وارد کنید و پیشنهاد نهایی را ارائه دهید.',
        exactScriptToSay:
          '«کل لایسنس یک‌ساله این سامانه ۴۸ میلیون تومان است؛ یعنی کمتر از یک‌سومِ سودِ فقط یک شب مراسم شما! اگر هم بخواهید، همین الان فقط ۱۲ میلیون تومان پیش‌پرداخت بدهید تا سامانه اختصاصی تالارتان فعال شود و الباقی را ۲ فقره چک ۱۸ میلیونی برای ماه‌های بعد بدهید؛ با تضمین اینکه اگر در ماه اول حتی ۱ قرارداد بیشتر نبستید، چک‌هایتان را برمی‌گردانیم!»',
        jumpAnchor: '#invitation-letter',
      },
    ],
  },
];

const OBJECTION_HANDLERS = [
  {
    id: 'obj-1',
    objection: '۱. تالاردار می‌گوید: «۴۸ میلیون تومان برای یک برنامه زیاد است!»',
    bestAnswer:
      '«حاج‌آقا، سود خالص تالار شما از فقط یک مراسم ۳۵۰ نفره حداقل ۱۵۰ تا ۲۵۰ میلیون تومان است. یعنی قیمت یک سال کامل این سامانه حتی از سودِ یک‌سومِ یک شب مراسم شما هم کمتر است! کافی است این تبلت در کل سال فقط ۱ عروس و دامادِ مردد را سر میز شما به قرارداد تبدیل کند تا ۳ برابر پولش در همان شب اول برگردد.»',
  },
  {
    id: 'obj-2',
    objection: '۲. تالاردار می‌گوید: «مشتریان ما سنتی هستند و با دفتر و دستک راحت‌تریـم!»',
    bestAnswer:
      '«اتفاقاً عروس و دامادهای نسل جدید (متولدین دهه ۷۰ و ۸۰) وقتی می‌بینند مدیر تالار با کاغذ و ماشین‌حساب قیمت می‌دهد، احساس می‌کنند قیمت‌ها شفاف نیست و می‌گویند "می‌رویم فکر کنیم". اما وقتی روی تبلت با لوگوی تالار شما، ریز منو و سهم چک هر خانواده را می‌بینند و همان لحظه پیش‌فاکتور طلاکوب در واتساپشان می‌آید، به تالار شما اعتماد ۱۰۰٪ می‌کنند.»',
  },
  {
    id: 'obj-3',
    objection: '۳. تالاردار می‌گوید: «من خودم وقت کار با کامپیوتر و نرم‌افزار را ندارم!»',
    bestAnswer:
      '«اصلاً نیازی به تایپ یا دانش کامپیوتری نیست! ما امروز تمام قیمت‌های منوی تالار شما را در ۵ دقیقه داخل سیستم تنظیم می‌کنیم. از فردا، شما یا مدیر داخلی‌تان فقط با نوک انگشت روی تبلت، تعداد مهمان و نوع غذا را لمس می‌کنید و سیستم خودش همه چک‌ها و فاکتور واتساپ را آماده می‌کند.»',
  },
  {
    id: 'obj-4',
    objection: '۴. تالاردار می‌گوید: «بگذارید با شرکا مشورت کنم، هفته بعد بیایید!»',
    bestAnswer:
      '«حق با شماست؛ برای اینکه شرکای محترمتان هم در عمل معجزه سیستم را ببینند، همین الان لینک اختصاصی تالار خودتان (?hall=...) و دعوت‌نامه رسمی را به واتساپ شما و شرکایتان می‌فرستم. ضمناً چون سهمیه لایسنس انحصاری هر منطقه محدود است، اگر امروز با ۱۲ میلیون پیش‌پرداخت رزرو کنید، تا ۶ ماه به تالار همسایه شما لایسنس نمی‌دهیم.»',
  },
  {
    id: 'obj-5',
    objection: '۵. تالاردار می‌گوید: «نمی‌خواهم قیمت‌های تالار من را بقیه تالارها ببینند!»',
    bestAnswer:
      '«دقیقاً به همین خاطر معماری این برنامه ۱۰۰٪ ایزوله (Isolated White-Label) طراحی شده است. لینک شما اختصاصیِ تالار خودتان است، قیمت‌ها و مشتریان شما کاملاً محرمانه و قفل‌شده است و هیچ نامی از تالارهای دیگر در برنامه شما دیده نمی‌شود.»',
  },
];

export const HallBenefitsAndVisitorPlaybook: React.FC<HallBenefitsAndVisitorPlaybookProps> = ({
  lang,
  currency,
  hallName,
  onQuickApplyDemoHall,
}) => {
  // Interactive Hall Owner ROI Calculator State
  const [avgGuestsPerWedding, setAvgGuestsPerWedding] = useState<number>(350);
  const [netProfitPerGuestToman, setNetProfitPerGuestToman] = useState<number>(480000);
  const [extraBookingsPerMonth, setExtraBookingsPerMonth] = useState<number>(2);
  const [licenseCostToman, setLicenseCostToman] = useState<number>(48000000);

  // Interactive Visitor 10-Second Tablet Demo Builder State
  const [demoHallInput, setDemoHallInput] = useState<string>('باغ‌عمارت قصر طلایی');
  const [demoManagerInput, setDemoManagerInput] = useState<string>('حاج‌آقا محمدی');
  const [demoCityInput, setDemoCityInput] = useState<string>('تهران • گرمدره');
  const [demoPhoneInput, setDemoPhoneInput] = useState<string>('09121234567');
  const [demoVisitorRef, setDemoVisitorRef] = useState<string>('EVM-VIP-2500');
  const [demoAppliedSuccess, setDemoAppliedSuccess] = useState<boolean>(false);

  // Interactive Visitor Playbook State
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    chk1: true,
    chk2: true,
    chk3: false,
    chk4: false,
  });

  const buildInstantTabletDemoUrl = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('hall', demoHallInput);
    params.set('manager', demoManagerInput);
    params.set('city', demoCityInput);
    params.set('phone', demoPhoneInput);
    params.set('ref', demoVisitorRef);
    return `${base}?${params.toString()}`;
  };

  const handleApplyTabletDemoNow = () => {
    if (onQuickApplyDemoHall) {
      onQuickApplyDemoHall(demoHallInput, demoManagerInput, demoCityInput, demoPhoneInput);
    }
    setDemoAppliedSuccess(true);
    setTimeout(() => setDemoAppliedSuccess(false), 4000);
  };

  // ROI Calculations
  const netProfitSingleNightToman = avgGuestsPerWedding * netProfitPerGuestToman;
  const extraMonthlyProfitToman = netProfitSingleNightToman * extraBookingsPerMonth;
  const extraYearlyProfitToman = extraMonthlyProfitToman * 12;
  const roiMultiplierFirstMonth = Math.max(
    1,
    Math.round((extraMonthlyProfitToman / licenseCostToman) * 10) / 10,
  );
  const totalDeliverablesMarketValueToman = HALL_DELIVERABLES.reduce(
    (sum, item) => sum + item.marketValueToman,
    0,
  );

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleChecklist = (key: string) => {
    setChecklistState((prev) => ({...prev, [key]: !prev[key]}));
  };

  return (
    <div className="space-y-10 my-10 adhd-dimmable">
      {/* =====================================================================
          PART 1: WHAT HALL OWNERS GET UPON PURCHASING (دستاوردها و مزایای خرید برای تالارداران)
          ===================================================================== */}
      <section
        id="hall-deliverables"
        className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FFF8EB] to-[#FFF0F3] border-2 border-[#D4AF37] shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b-2 border-[#E6DFD3]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C1E16] text-[#E6C258] text-xs font-extrabold shadow">
              <Crown className="w-4 h-4 text-[#E11D48]" />
              <span>ویژه مالکان و مدیران تالارهای پذیرایی، باغ‌عمارت‌ها و بنگاه‌های تشریفات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1E16] leading-tight">
              تالاردارها در صورت خرید این برنامه دقیقاً چه چیزی به دست خواهند آورد؟
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5A4F] max-w-4xl leading-relaxed">
              وقتی مدیریت محترم <b>«{hallName}»</b> لایسنس اختصاصی EventMate VIP را تهیه می‌کند، فقط یک نرم‌افزار نمی‌خرد؛ بلکه یک <b>سیستم کامل فروش، اعتبارسنجی چک صیادی، پر کردن شب‌های خالی و برندینگ اختصاصی به ارزش واقعی بیش از ۵۲۵ میلیون تومان</b> را یک‌جا تحویل می‌گیرد.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="#visitor-playbook"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-extrabold text-xs shadow-lg hover:brightness-105 transition flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>پرش به راهنمای گام‌به‌گام ویزیتورها</span>
            </a>
            <a
              href="#invitation-letter"
              className="px-4 py-2.5 rounded-2xl bg-[#2C1E16] text-[#E6C258] border border-[#D4AF37] font-extrabold text-xs shadow hover:bg-[#3E2723] transition flex items-center gap-1.5"
            >
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>ثبت لایسنس و تسویه ۲۵٪ شبا</span>
            </a>
          </div>
        </div>

        {/* Interactive 1-Night ROI Calculator for Hall Owners */}
        <div className="mt-6 rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#2C1E16] via-[#3E2723] to-[#2C1E16] text-[#FAF7F2] border-2 border-[#C59B27] shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#E6C258]" />
              <h3 className="text-base sm:text-lg font-black text-[#E6C258]">
                ماشین‌حساب زنده بازگشت سرمایه تالاردار (چرا پول برنامه در «اولین شب مراسم» برمی‌گردد؟)
              </h3>
            </div>
            <span className="text-xs font-mono-num text-emerald-300 font-bold">
              ارزش کل ماژول‌های تحویلی: {formatMoney(totalDeliverablesMarketValueToman, currency, lang)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-[#C59B27]/30">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#E6DFD3] font-bold">میانگین تعداد مهمان هر مراسم:</span>
                  <span className="font-mono-num font-black text-[#E6C258]">
                    {formatNumberLocale(avgGuestsPerWedding, lang)} نفر
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1000}
                  step={50}
                  value={avgGuestsPerWedding}
                  onChange={(e) => setAvgGuestsPerWedding(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#E6DFD3] font-bold">سود خالص تالار از هر نفر:</span>
                  <span className="font-mono-num font-black text-emerald-400">
                    {formatMoney(netProfitPerGuestToman, currency, lang)}
                  </span>
                </div>
                <input
                  type="range"
                  min={200000}
                  max={1200000}
                  step={50000}
                  value={netProfitPerGuestToman}
                  onChange={(e) => setNetProfitPerGuestToman(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#E6DFD3] font-bold">قرارداد بیشتر در ماه با این برنامه:</span>
                  <span className="font-mono-num font-black text-rose-400">
                    +{formatNumberLocale(extraBookingsPerMonth, lang)} مراسم در ماه
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={extraBookingsPerMonth}
                  onChange={(e) => setExtraBookingsPerMonth(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#E6DFD3] font-bold">نوع لایسنس انتخابی تالار:</span>
                  <span className="font-mono-num font-black text-[#E6C258]">
                    {formatMoney(licenseCostToman, currency, lang)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setLicenseCostToman(48000000)}
                    className={`py-1.5 px-2 rounded-xl font-bold text-[11px] cursor-pointer transition ${
                      licenseCostToman === 48000000
                        ? 'bg-[#E6C258] text-[#1E130D]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    لایسنس پایه (۴۸ م)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLicenseCostToman(96000000)}
                    className={`py-1.5 px-2 rounded-xl font-bold text-[11px] cursor-pointer transition ${
                      licenseCostToman === 96000000
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    لایسنس VIP (۹۶ م)
                  </button>
                </div>
              </div>
            </div>

            {/* Live Financial Output */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-[#E6C258]/40">
                <div className="text-[11px] text-[#E6DFD3]">سود خالص تالار از فقط ۱ شب مراسم:</div>
                <div className="text-base sm:text-lg font-mono-num font-black text-[#E6C258] mt-1">
                  {formatMoney(netProfitSingleNightToman, currency, lang)}
                </div>
                <div className="text-[10px] text-emerald-300 mt-0.5 font-bold">
                  بیش از {Math.max(1, Math.round(netProfitSingleNightToman / licenseCostToman))} برابر کل قیمت لایسنس!
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-400/50">
                <div className="text-[11px] text-emerald-200">سود اضافه تالار در ماه اول:</div>
                <div className="text-base sm:text-lg font-mono-num font-black text-emerald-400 mt-1">
                  {formatMoney(extraMonthlyProfitToman, currency, lang)}
                </div>
                <div className="text-[10px] text-white mt-0.5 font-bold">
                  بازگشت سرمایه: {roiMultiplierFirstMonth} برابر در ماه اول
                </div>
              </div>

              <div className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48]/30 to-[#D4AF37]/30 border border-[#E6C258] flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-white">
                    سود خالص اضافه‌شده به تالار در طول ۱ سال:
                  </div>
                  <div className="text-[11px] text-[#E6DFD3]">
                    فقط با بستن {formatNumberLocale(extraBookingsPerMonth, lang)} قرارداد بیشتر در ماه به کمک تبلت منوساز و شب‌های خالی
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-mono-num font-black text-[#E6C258]">
                  {formatMoney(extraYearlyProfitToman, currency, lang)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Concrete Deliverables Grid */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-black text-[#2C1E16] flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#E11D48]" />
              <span>۸ دستاورد و دارایی ملموس که تالاردار بلافاصله پس از خرید تحویل می‌گیرد:</span>
            </h3>
            <span className="text-xs text-[#6E5A4F] hidden sm:inline">
              روی هر کارت می‌توانید کلیک کنید تا همان ماژول را زنده ببینید
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HALL_DELIVERABLES.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-4 bg-white border-2 border-[#E6DFD3] hover:border-[#C59B27] shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#9A7411] font-extrabold">
                    <span>{item.badge}</span>
                    <span className="font-mono-num text-[#6E5A4F]">
                      ارزش: {formatMoney(item.marketValueToman, currency, lang)}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#2C1E16] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#6E5A4F] leading-relaxed">
                    {item.whatHallGets}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6DFD3] space-y-2">
                  <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                    💰 <b>سود مستقیم تالار:</b> {item.financialImpact}
                  </div>
                  <a
                    href={item.targetAnchor}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#2C1E16] text-[#2C1E16] hover:text-[#E6C258] font-extrabold text-xs transition flex items-center justify-between"
                  >
                    <span>مشاهده زنده این قابلیت در برنامه</span>
                    <ChevronLeft className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs After Comparison Table for Hall Owners */}
        <div className="mt-7 rounded-2xl overflow-hidden border-2 border-[#E6DFD3] bg-white">
          <div className="bg-[#2C1E16] text-[#E6C258] px-5 py-3 text-xs sm:text-sm font-black flex items-center justify-between">
            <span>مقایسه واقعی: تالار سنتی (کاغذ و ماشین‌حساب) در برابر تالار مجهز به EventMate VIP</span>
            <span className="text-[11px] text-rose-300 font-bold">چرا تالارهای رقیب عقب می‌مانند؟</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#E6DFD3] text-xs">
            <div className="p-5 bg-rose-50/40 space-y-2.5">
              <div className="font-black text-sm text-rose-900 flex items-center gap-1.5">
                <span>❌ روش سنتی (بدون برنامه EventMate VIP):</span>
              </div>
              <ul className="space-y-2 text-[#6E5A4F] leading-relaxed">
                <li>• ۱۰ دقیقه حساب‌وکتاب دستی با ماشین‌حساب سر میز و شک کردن خانواده به قیمت‌ها.</li>
                <li>• خروج ۷۰٪ عروس و دامادها از دفتر تالار با جمله «می‌رویم فکرهایمان را بکنیم و خبر می‌دهیم».</li>
                <li>• دعوای خانواده عروس و داماد سر سهم پیش‌پرداخت و مبلغ هر برگ چک صیادی.</li>
                <li>• خالی ماندن شب‌های دوشنبه و سه‌شنبه و سوخت شدن صدها میلیون تومان ظرفیت تالار.</li>
                <li>• ریسک دریافت چک صیادی وضعیت زرد یا قرمز و دردسر نقد کردن چک‌ها بعد از مراسم.</li>
              </ul>
            </div>

            <div className="p-5 bg-emerald-50/40 space-y-2.5">
              <div className="font-black text-sm text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>✅ تالار مجهز به سامانه اختصاصی EventMate VIP:</span>
              </div>
              <ul className="space-y-2 text-[#2C1E16] font-medium leading-relaxed">
                <li>• <b>محاسبه آنی روی تبلت اختصاصی تالار:</b> تغییر هر غذا در ۰.۱ ثانیه مبلغ هر نفر و هر چک را نشان می‌دهد.</li>
                <li>• <b>ارسال فوری پیش‌فاکتور طلاکوب واتساپ:</b> قفل شدن ذهن مشتری روی برند تالار شما در همان جلسه اول.</li>
                <li>• <b>تفکیک شفاف سهم خانواده‌ها + استعلام صیاد:</b> رضایت کامل پدر عروس و پدر داماد سر میز قرارداد.</li>
                <li>• <b>پر کردن شب‌های خالی وسط هفته:</b> تبدیل شب‌های سوخته به قراردادهای نقدی با حراج هوشمند.</li>
                <li>• <b>تسویه اولین چک تالار در همان شب عروسی:</b> از محل بارکد QR شاباش و کادوی دیجیتال سر میز مهمانان!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PART 2: VISITOR & MARKETER PLAYBOOK (راهکار و راهنمای ویزیتورها و بازاریابان: ابتدا کدام قابلیت‌ها را معرفی نمایند؟)
          ===================================================================== */}
      <section
        id="visitor-playbook"
        className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1E130D] via-[#2C1E16] to-[#3E2723] text-[#FAF7F2] border-2 border-[#C59B27] shadow-2xl"
      >
        {/* Playbook Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#C59B27]/40">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white text-xs font-extrabold shadow">
              <Compass className="w-4 h-4" />
              <span>راهنمای جامع ویزیتورها و بازاریابان حضوری (پورسانت ۲۵٪ نقدی = ۱۲ تا ۲۴ میلیون تومان در هر فروش)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#E6C258] leading-tight">
              راهکار طلایی ویزیتورها: در جلسه با تالاردار، ابتدا کدام قابلیت‌های برنامه را معرفی کنیم؟
            </h2>
            <p className="text-xs sm:text-sm text-[#E6DFD3] max-w-4xl leading-relaxed">
              راز فروش موفق به مدیران تالارها این است که <b>قابلیت‌ها را به ترتیبِ «اولویت روانی و مالی»</b> معرفی کنید. اگر در همان دقیقه اول هر ۲۰ ماژول را یک‌جا نشان دهید، مدیر تالار خسته یا سردرگم می‌شود؛ اما با این <b>فرمول ۳ مرحله‌ای (۱۰ دقیقه‌ای)</b>، بیش از ۸۰٪ جلسات حضوری به فروش قطعی تبدیل می‌شوند.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-[#E6C258]/50 shrink-0 text-xs space-y-1">
            <div className="text-[#E6C258] font-extrabold">پورسانت نقدی شما در هر فروش:</div>
            <div className="text-lg font-mono-num font-black text-emerald-400">
              ۱۲,۰۰۰,۰۰۰ تا ۲۴,۰۰۰,۰۰۰ تومان
            </div>
            <div className="text-[11px] text-[#E6DFD3]">
              + ۲۵٪ از هر بسته تبلیغاتی تالار (تسویه آنی شبا)
            </div>
          </div>
        </div>

        {/* =================================================================
            THE 3-STEP GOLDEN FORMULA TRAINING BOX (آموزش کامل فرمول طلایی فروش قطعی)
            ================================================================= */}
        <div
          id="golden-formula"
          className="mt-6 rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#4A1525] via-[#2C1E16] to-[#3E2723] border-2 border-[#E6C258] shadow-xl space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6C258]/30 pb-3.5">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-[#E6C258]" />
              <h3 className="text-base sm:text-xl font-black text-[#E6C258]">
                آموزش «فرمول طلایی ۳گانه» برای شروع فروش قطعی از همین هفته (تضمین ۹۰٪ موفقیت ویزیتور)
              </h3>
            </div>
            <span className="text-xs text-rose-200 font-bold">
              این ۳ تکنیک روانشناسی فروش را مو‌به‌مو در هر تالار اجرا کنید
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Golden Rule 1 */}
            <div className="rounded-2xl p-4 bg-black/35 border border-[#E6C258]/50 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-[#E6C258] flex items-center justify-between">
                  <span>🔑 اصل اول فرمول طلایی (قبل از ورود)</span>
                  <span className="font-mono-num text-emerald-300">گاردشکن ۱۰۰٪</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  ۱. هرگز با نام پیش‌فرض وارد تالار نشوید! (شخصی‌سازی پشت درِ تالار)
                </h4>
                <p className="text-xs text-[#E6DFD3] leading-relaxed">
                  قبل از اینکه وارد دفتر مدیریت تالار شوید، در پارکینگ یا پشت در، وارد بخش <b>«شخصی‌سازی برند تالار (White-Label)»</b> در بالای همین برنامه شوید و <b>نام همان تالار، نام مدیر و شماره واتساپش</b> را وارد کنید.
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-[11px] text-emerald-200 leading-relaxed">
                  <b>چرا معجزه می‌کند؟</b> وقتی تالاردار در ثانیه اول اسم و برند تالار خودش را بالای تبلت شما می‌بیند، حس می‌کند این برنامه از قبل اختصاصی برای عمارت او ساخته شده و گارد ذهنی‌اش بلافاصله باز می‌شود!
                </div>
              </div>
              <a
                href="#white-label-customizer"
                className="w-full py-2 px-3 rounded-xl bg-[#E6C258] text-[#1E130D] font-extrabold text-xs text-center hover:brightness-105 transition"
              >
                رفتن به بخش تغییر نام تالار (وایت‌لیبل)
              </a>
            </div>

            {/* Golden Rule 2 */}
            <div className="rounded-2xl p-4 bg-black/35 border border-[#E6C258]/50 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-[#E6C258] flex items-center justify-between">
                  <span>🔑 اصل دوم فرمول طلایی (دقیقه ۲ جلسه)</span>
                  <span className="font-mono-num text-rose-300">لحظه تصمیم خرید</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  ۲. روی گوشی خودِ مدیر تالار یک پیش‌فاکتور واتساپی شلیک کنید!
                </h4>
                <p className="text-xs text-[#E6DFD3] leading-relaxed">
                  در همان ۲ دقیقه اول جلسه، به جای توضیح تئوری، یک منوی ۳۵۰ نفره بسازید، شماره موبایل خودِ مدیر تالار را بزنید و دکمه <b>«ارسال پیش‌فاکتور رسمی به واتساپ»</b> را لمس کنید تا پیام طلاکوب روی گوشی خودش بیاید.
                </p>
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-400/40 text-[11px] text-rose-200 leading-relaxed">
                  <b>چرا معجزه می‌کند؟</b> وقتی مدیر تالار گوشی خودش را باز می‌کند و پیش‌فاکتور رسمی با نام خودش، ریز اقساط چک صیادی، استعلام سفید و سهم خانواده‌ها را می‌بیند، همان لحظه عاشق پرستیژ برنامه می‌شود.
                </div>
              </div>
              <a
                href="#builder"
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-extrabold text-xs text-center hover:brightness-105 transition"
              >
                تست زنده ارسال پیش‌فاکتور واتساپ
              </a>
            </div>

            {/* Golden Rule 3 */}
            <div className="rounded-2xl p-4 bg-black/35 border border-emerald-400/70 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-emerald-300 flex items-center justify-between">
                  <span>🔑 اصل سوم فرمول طلایی (دقیقه ۸ جلسه)</span>
                  <span className="font-mono-num text-[#E6C258]">دریافت درجا ۱۲ میلیون!</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  ۳. فرمول جادویی فروش اقساطی (۱۲ میلیون نقد + ۲ چک ۱۸ میلیونی با ضمانت بازگشت)
                </h4>
                <p className="text-xs text-[#E6DFD3] leading-relaxed">
                  اگر تالارداری برای پرداخت نقدی ۴۸ میلیون تومان تردید داشت، بلافاصله این پیشنهادِ رد نشدنی را بدهید:
                  <br />
                  <b>«فقط ۱۲ میلیون تومان پیش‌پرداخت بدهید (که همان لحظه کل پورسانت ۲۵٪ شما تسویه می‌شود!) + ۲ فقره چک صیادی ۱۸ میلیون تومانی برای ماه آینده و دو ماه دیگر.»</b>
                </p>
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-[11px] text-amber-100 leading-relaxed">
                  <b>ضمانت ۷ روزه بدون ریسک:</b> به تالاردار بگویید: «اگر در ماه اول حتی ۱ قرارداد بیشتر با این تبلت نبستید، هر دو چک ۱۸ میلیونی شما را برمی‌گردانیم!» با این جمله، هیچ تالارداری نه نمی‌گوید.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    'golden-close-script',
                    'حاج‌آقا، نیازی نیست کل ۴۸ میلیون تومان را امروز نقد بدهید! همین الان فقط ۱۲ میلیون تومان پیش‌پرداخت بدهید تا سامانه اختصاصی تالار شما فعال شود و الباقی را ۲ فقره چک صیادی ۱۸ میلیون تومانی برای ماه آینده و دو ماه دیگر بدهید. در قرارداد هم قید می‌کنیم اگر در ماه اول حتی ۱ قرارداد بیشتر با این تبلت نبستید، چک‌هایتان را برمی‌گردانیم!',
                  )
                }
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs text-center transition cursor-pointer"
              >
                {copiedId === 'golden-close-script'
                  ? 'فرمول اقساطی کپی شد ✓'
                  : 'کپی متن پیشنهاد ۱۲ میلیون نقد + ۲ چک صیادی'}
              </button>
            </div>
          </div>

          {/* =================================================================
              VISITOR 10-SECOND TABLET LINK GENERATOR & SECURITY EXPLANATION
              ================================================================= */}
          <div className="mt-5 rounded-2xl p-5 bg-black/45 border-2 border-emerald-400/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm sm:text-base font-black text-emerald-300">
                  ابزار ۱۰ ثانیه‌ای ویزیتور روی تبلت + پاسخ به سؤال مهم: «چگونه ویزیتور بدون دسترسی به سورس‌کد، لینک تالار را می‌سازد و چرا تالاردار نمی‌تواند رایگان از آن استفاده کند؟»
                </h4>
              </div>
              <span className="text-[11px] font-mono-num text-[#E6C258] font-bold">
                معماری دوگانه: حالت دمو (Demo) در برابر لایسنس تجاری (Commercial)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left: Live 10-Second Tablet Demo Builder for Visitor */}
              <div className="lg:col-span-6 p-4 rounded-2xl bg-white/5 border border-[#C59B27]/40 space-y-3">
                <div className="text-xs font-extrabold text-[#E6C258]">
                  📱 همین الان روی تبلت/گوشی خود امتحان کنید (ساخت آنی پیش‌نمایش تالار در ۱۰ ثانیه):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] text-[#E6DFD3] mb-1">نام تالار هدف (پشت درِ تالار):</label>
                    <input
                      type="text"
                      value={demoHallInput}
                      onChange={(e) => setDemoHallInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-[#C59B27]/60 text-white font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#E6DFD3] mb-1">نام مدیر تالار:</label>
                    <input
                      type="text"
                      value={demoManagerInput}
                      onChange={(e) => setDemoManagerInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-[#C59B27]/60 text-white font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#E6DFD3] mb-1">شهر / منطقه تالار:</label>
                    <input
                      type="text"
                      value={demoCityInput}
                      onChange={(e) => setDemoCityInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-[#C59B27]/60 text-white font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#E6DFD3] mb-1">شماره واتساپ مدیر تالار:</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={demoPhoneInput}
                      onChange={(e) => setDemoPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-[#C59B27]/60 text-white font-mono-num font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono-num text-emerald-300 break-all">
                  {buildInstantTabletDemoUrl()}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyTabletDemoNow}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white font-extrabold text-xs shadow hover:brightness-105 transition cursor-pointer"
                  >
                    اعمال فوری نام «{demoHallInput}» روی کل این صفحه (جهت نمایش روی تبلت)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyText('demo-tablet-url', buildInstantTabletDemoUrl())}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#E6C258] font-extrabold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === 'demo-tablet-url' ? 'لینک کپی شد ✓' : 'کپی لینک دمو'}</span>
                  </button>
                </div>

                {demoAppliedSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-400 text-white text-xs font-bold">
                    ✅ کل برنامه، سربرگ و فاکتور واتساپ هم‌اکنون به نام «{demoHallInput}» ({demoManagerInput}) تغییر یافت! بالای صفحه را ببینید.
                  </div>
                )}
              </div>

              {/* Right: 4 Security Locks Explanation */}
              <div className="lg:col-span-6 space-y-2.5 text-xs leading-relaxed">
                <div className="font-extrabold text-[#E6C258]">
                  🔒 چرا ویزیتور بدون دسترسی برنامه‌نویسی می‌تواند این کار را بکند، اما تالاردار نمی‌تواند بدون پرداخت پول از آن استفاده کند؟ (۴ قفل امنیتی):
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-[#E6DFD3]">
                  <p>
                    <b className="text-emerald-300">۱. پارامتر هوشمند آدرس (URL Query Parameter):</b> برنامه طوری مهندسی شده که ویزیتور بدون دست زدن به کدهای اصلی سرور، فقط با تایپ نام تالار در کادر بالا، یک <b>«پوسته پیش‌نمایش موقت (Demo Skin)»</b> روی تبلت خودش یا لینک ارسالی می‌سازد.
                  </p>
                  <p>
                    <b className="text-rose-300">۲. قفل واترمارک فروش و پنل ویزیتوری در نسخه دمو:</b> تا وقتی تالاردار لایسنس ۴۸ میلیونی را نخرد، در پایین صفحه بخش‌های «قیمت لایسنس، راهنمای ویزیتورها و تبلیغات تالارهای رقیب» فعال است؛ بنابراین تالاردار هرگز نمی‌تواند لینک دموی خام را جلوی عروس و داماد بگذارد!
                  </p>
                  <p>
                    <b className="text-[#E6C258]">۳. قفل کد سفیر (?ref=EVM-VIP-2500):</b> داخل لینکی که ویزیتور می‌سازد، کد اختصاصی خودِ ویزیتور حک شده است؛ یعنی اگر مدیر تالار حتی ۲ روز بعد هم روی لینک کلیک کند و خرید را انجام دهد، ۲۵٪ پورسانت (۱۲ میلیون تومان) مستقیماً به شبا همان ویزیتور واریز می‌شود.
                  </p>
                  <p>
                    <b className="text-emerald-300">۴. فعال‌سازی لایسنس تجاری در سرور پس از پرداخت:</b> فقط پس از ثبت فیش واریزی یا چک در سرور، نسخه خالصِ بدون تبلیغات به همراه نرخ‌های واقعی آشپزخانه آن تالار در دیتابیس سرور قفل و دائمی می‌گردد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Meeting 60-Second Checklist for Visitors */}
        <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-[#C59B27]/40">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-base font-black text-[#E6C258] flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              <span>چک‌لیست ۶۰ ثانیه‌ای ویزیتور (پشت درِ تالار، قبل از ورود به اتاق مدیریت انجام دهید):</span>
            </h3>
            <span className="text-[11px] text-emerald-300 font-bold">
              برای تیک زدن هر مرحله روی آن کلیک کنید
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              {
                key: 'chk1',
                title: '۱. ست کردن نام تالار در وایت‌لیبل',
                desc: 'نام تالار، نام مدیر و شماره واتساپ تالار را در نوار بالای صفحه وارد کنید تا کل برنامه به نام خودش قفل شود.',
              },
              {
                key: 'chk2',
                title: '۲. باز کردن برنامه روی تبلت یا گوشی',
                desc: 'روشنایی صفحه را روی ۱۰۰٪ بگذارید و اسلایدر مهمان را روی ظرفیت رایج آن تالار (مثلاً ۳۵۰ نفر) تنظیم کنید.',
              },
              {
                key: 'chk3',
                title: '۳. آماده‌سازی کد سفیر و شماره شبا',
                desc: 'کد بازاریابی خود (?ref=EVM-VIP-2500) و شماره شبا بانکی‌تان را در بخش ثبت لایسنس آماده بگذارید.',
              },
              {
                key: 'chk4',
                title: '۴. رعایت قانون ۳ قابلیت در ۲ دقیقه اول',
                desc: 'به خودتان قول بدهید در ۲ دقیقه اول فقط ۱) برند تالار، ۲) منوساز زنده و ۳) ارسال واتساپ به گوشی مدیر را نشان دهید!',
              },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleChecklist(item.key)}
                className={`p-3.5 rounded-xl text-start transition cursor-pointer border ${
                  checklistState[item.key]
                    ? 'bg-emerald-950/70 border-emerald-400 text-white'
                    : 'bg-white/5 border-white/15 text-[#E6DFD3] hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between font-extrabold mb-1">
                  <span className={checklistState[item.key] ? 'text-emerald-300' : 'text-[#E6C258]'}>
                    {item.title}
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      checklistState[item.key] ? 'text-emerald-400' : 'text-white/30'
                    }`}
                  />
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 3-Stage Feature Priority Tabs */}
        <div className="mt-7">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {VISITOR_PLAYBOOK_PHASES.map((phase, idx) => (
              <button
                key={phase.stepNumber}
                type="button"
                onClick={() => setActivePhaseIndex(idx)}
                className={`px-4 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 ${
                  activePhaseIndex === idx
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white shadow-lg scale-[1.01]'
                    : 'bg-white/10 text-[#E6DFD3] hover:bg-white/20 border border-[#C59B27]/30'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center font-mono-num text-xs">
                  {phase.stepNumber}
                </span>
                <span>{phase.timeRange.split('•')[0]}</span>
                <span className="hidden sm:inline opacity-90">
                  ({phase.timeRange.split('•')[1]?.trim()})
                </span>
              </button>
            ))}
          </div>

          {/* Active Phase Content */}
          {(() => {
            const currentPhase = VISITOR_PLAYBOOK_PHASES[activePhaseIndex];
            return (
              <div className="rounded-3xl p-5 sm:p-6 bg-white/10 border-2 border-[#E6C258]/60 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-white/15">
                  <div>
                    <div className="text-xs font-extrabold text-rose-300">
                      {currentPhase.timeRange}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#E6C258] mt-0.5">
                      {currentPhase.phaseTitle}
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-300 font-bold">
                    👤 {currentPhase.audience}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/50 text-xs sm:text-sm text-amber-100 leading-relaxed font-bold">
                  {currentPhase.goldenRule}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {currentPhase.featuresToIntroduce.map((feat, fIdx) => {
                    const copyKey = `phase-${currentPhase.stepNumber}-feat-${fIdx}`;
                    return (
                      <div
                        key={copyKey}
                        className="rounded-2xl p-4 bg-[#1E130D]/90 border border-[#C59B27]/50 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-extrabold text-[#E6C258]">
                            <span>🎯 {feat.priority}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                            {feat.featureName}
                          </h4>

                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#E6DFD3] leading-relaxed">
                            <b className="text-emerald-300">🎬 کاری که زنده انجام می‌دهید:</b>{' '}
                            {feat.whatToDoLive}
                          </div>

                          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-400/40 text-xs text-rose-100 leading-relaxed">
                            <div className="font-extrabold text-rose-300 mb-1">
                              🗣️ جمله‌ای که دقیقاً به مدیر تالار می‌گویید:
                            </div>
                            <p className="italic">{feat.exactScriptToSay}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleCopyText(copyKey, feat.exactScriptToSay)}
                            className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#E6C258]" />
                            <span>
                              {copiedId === copyKey ? 'کپی شد ✓' : 'کپی متن صحبت ویزیتور'}
                            </span>
                          </button>
                          <a
                            href={feat.jumpAnchor}
                            className="py-2 px-3 rounded-xl bg-[#E6C258] text-[#1E130D] font-extrabold text-xs hover:brightness-105 transition flex items-center gap-1"
                          >
                            <span>نمایش زنده</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Objection Handling Bank for Visitors */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-black text-[#E6C258] flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-rose-400" />
              <span>پاسخ‌های آماده و قاطع به ۵ بهانه رایج تالارداران (تقلب‌نامه طلایی ویزیتور سر جلسه):</span>
            </h3>
            <span className="text-xs text-[#E6DFD3]">
              هر بهانه‌ای که مدیر تالار آورد، دقیقاً پاسخ روبه‌روی آن را بگویید
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OBJECTION_HANDLERS.map((obj) => (
              <div
                key={obj.id}
                className="p-4 rounded-2xl bg-white/5 border border-[#C59B27]/40 hover:border-[#E6C258] transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm font-black text-rose-300">
                    ❓ {obj.objection}
                  </div>
                  <p className="text-xs text-[#FFFDF9] leading-relaxed bg-black/30 p-3 rounded-xl border border-white/10">
                    💡 <b className="text-emerald-300">پاسخ برنده ویزیتور:</b> {obj.bestAnswer}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopyText(obj.id, obj.bestAnswer)}
                    className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#E6C258] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId === obj.id ? 'پاسخ کپی شد ✓' : 'کپی پاسخ آماده'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Iran Wedding Halls Market Statistics (تعداد تالارها در تهران و شهرستان‌ها و پتانسیل فروش) */}
        <div className="mt-8 p-5 rounded-3xl bg-black/40 border-2 border-[#C59B27]/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-black text-[#E6C258]">
                آمار بازار هدف ایران: در تهران و شهرستان‌ها چند تالار و باغ‌عمارت فعال وجود دارد؟
              </h3>
            </div>
            <span className="text-xs font-mono-num text-emerald-300 font-bold">
              مجموع کل کشور: بیش از ۱۲,۵۰۰ تالار، باغ‌عمارت و موسسه تشریفات مجالس
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[#E6C258] font-extrabold">۱. تهران و حومه طلایی باغ‌تالارها</div>
              <div className="text-base font-mono-num font-black text-white">
                ~۲,۱۰۰ تالار و باغ‌عمارت
              </div>
              <p className="text-[11px] text-[#E6DFD3] leading-relaxed">
                شامل ~۸۵۰ تالار داخل شهر تهران + بیش از ۱,۲۵۰ باغ‌عمارت لوکس در گرمدره، احمدآباد مستوفی، شهریار، کرج، لواسان، دماوند و ورامین.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[#E6C258] font-extrabold">۲. کلان‌شهرهای درجه یک</div>
              <div className="text-base font-mono-num font-black text-white">
                ~۳,۸۰۰ تالار و باغ‌تالار
              </div>
              <p className="text-[11px] text-[#E6DFD3] leading-relaxed">
                مشهد و طرقبه/شاندیز (~۹۰۰ واحد)، اصفهان (~۷۵۰ واحد)، شیراز و صدرا (~۶۵۰ واحد)، تبریز (~۶۰۰ واحد)، اهواز و کرج (~۹۰۰ واحد).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[#E6C258] font-extrabold">۳. استان‌های شمالی، غربی و جنوبی</div>
              <div className="text-base font-mono-num font-black text-white">
                ~۶,۶۰۰ تالار در سایر شهرستان‌ها
              </div>
              <p className="text-[11px] text-[#E6DFD3] leading-relaxed">
                مازندران و گیلان (~۱,۴۰۰ تالار پرتقاضا)، آذربایجان غربی، کردستان، کرمانشاه، فارس، خوزستان، کرمان، یزد و سایر شهرستان‌های کشور.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-400/50 space-y-1">
              <div className="text-emerald-300 font-extrabold">۴. پتانسیل فروش فقط ۲٪ بازار کشور</div>
              <div className="text-base font-mono-num font-black text-[#E6C258]">
                ۲۵۰ تالار = ۱۲ میلیارد تومان!
              </div>
              <p className="text-[11px] text-white leading-relaxed">
                فروش لایسنس ۴۸ میلیونی به <b>فقط ۲٪ از تالارهای کشور (۲۵۰ تالار)</b> معادل <b>۱۲ میلیارد تومان فروش مستقیم</b> (شامل ۳ میلیارد تومان پورسانت نقدی ویزیتورها) است!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
