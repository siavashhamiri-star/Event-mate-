import {CurrencyCode, LanguageCode, SayyadiCheckItem} from '../types';
import {CURRENCIES} from '../data';

export function formatMoney(
  amountToman: number,
  currency: CurrencyCode,
  lang: LanguageCode,
  customRates?: Record<CurrencyCode, number>,
): string {
  const currencyMeta = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
  const rate = customRates?.[currency] ?? currencyMeta.rateFromToman;
  const converted = amountToman * rate;

  const locale =
    lang === 'FA'
      ? 'fa-IR'
      : lang === 'AR'
        ? 'ar-EG'
        : lang === 'TR'
          ? 'tr-TR'
          : lang === 'RU'
            ? 'ru-RU'
            : 'en-US';

  if (currency === 'IRT') {
    const rounded = Math.round(converted);
    const formatted = rounded.toLocaleString(locale);
    const unit = lang === 'FA' ? 'تومان' : lang === 'AR' ? 'تومان' : 'IRT';
    return `${formatted} ${unit}`;
  }

  const decimals = converted >= 100 ? 0 : 2;
  const formatted = converted.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency === 'USD') return `$${formatted}`;
  if (currency === 'AED') return `${formatted} AED`;
  if (currency === 'TRY') return `₺${formatted}`;
  if (currency === 'RUB') return `${formatted} ₽`;
  return `${formatted} ${currencyMeta.symbol}`;
}

export function formatNumberLocale(value: number, lang: LanguageCode): string {
  const locale =
    lang === 'FA'
      ? 'fa-IR'
      : lang === 'AR'
        ? 'ar-EG'
        : lang === 'TR'
          ? 'tr-TR'
          : lang === 'RU'
            ? 'ru-RU'
            : 'en-US';
  return Math.round(value).toLocaleString(locale);
}

const PERSIAN_MONTHS = [
  'مهر ۱۴۰۵',
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
];

export function generateSayyadiSchedule(
  remainingToman: number,
  months: number,
): SayyadiCheckItem[] {
  if (months <= 0 || remainingToman <= 0) return [];
  const perCheck = Math.round(remainingToman / months);
  const items: SayyadiCheckItem[] = [];
  const baseDate = new Date('2026-10-25T10:00:00Z');

  for (let i = 0; i < months; i++) {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + i + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    const sayyadiSuffix = String(40591820 + i * 1379).padStart(8, '0');
    items.push({
      checkNumber: i + 1,
      sayyadiId: `14058890${sayyadiSuffix}`,
      dueDatePersian: `۲۵ ${PERSIAN_MONTHS[i % PERSIAN_MONTHS.length]}`,
      dueDateGregorian: `${yyyy}-${mm}-${dd}`,
      amountToman: i === months - 1 ? remainingToman - perCheck * (months - 1) : perCheck,
    });
  }
  return items;
}
