export type LanguageCode = 'FA' | 'EN' | 'AR' | 'TR' | 'KU' | 'HY' | 'RU';
export type CurrencyCode = 'IRT' | 'USD' | 'AED' | 'TRY' | 'RUB';
export type ServingStyleId = 'single_plate' | 'platter_vip' | 'imperial_buffet';
export type MenuCategory = 'main' | 'appetizer' | 'fruit_pastry' | 'ceremonial';

export interface LocalizedText {
  FA: string;
  EN: string;
  AR: string;
  TR: string;
  RU: string;
  KU?: string;
  HY?: string;
}

export interface ServingStyleOption {
  id: ServingStyleId;
  title: LocalizedText;
  subtitle: LocalizedText;
  multiplier: number; // e.g. 1.0, 0.92, 1.18
  serviceFeePerGuestToman: number;
  badge: LocalizedText;
}

export interface MenuItemOption {
  id: string;
  category: MenuCategory;
  name: LocalizedText;
  description: LocalizedText;
  priceToman: number; // Per guest for food/fruit, or fixed total for ceremonial services
  pricingType: 'per_guest' | 'fixed_event';
  image: string;
  popular?: boolean;
  caloriesOrSpec?: string;
}

export interface VenuePackage {
  id: string;
  code: string;
  title: LocalizedText;
  location: LocalizedText;
  categoryBadge: LocalizedText;
  capacityRange: string;
  baseGuestCount: number;
  servingStyle: ServingStyleId;
  pricePerGuestToman: number;
  rating: number;
  image: string;
  includedItemIds: string[];
  highlights: LocalizedText;
  sayyadiMonths: number;
}

export interface FlashDateOffer {
  id: string;
  persianDate: string;
  gregorianDate: string;
  dayName: LocalizedText;
  venueName: LocalizedText;
  discountPercent: number;
  reasonBadge: LocalizedText;
  capacityLeft: number;
  giftBonus: LocalizedText;
  packageId: string;
}

export interface AccessibilitySettings {
  fontScale: number; // 100, 110, 120, 130
  highContrast: boolean;
  adhdFocusMode: boolean;
  adhdReadingGuide?: boolean;
  motorLargeTargets?: boolean;
  readableSpacing: boolean;
  voiceRate: number; // 0.8 to 1.2
}

export interface SayyadiCheckItem {
  checkNumber: number;
  sayyadiId: string;
  dueDatePersian: string;
  dueDateGregorian: string;
  amountToman: number;
}
