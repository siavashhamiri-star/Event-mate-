import React, {useEffect, useState} from 'react';
import {Download, Share, PlusSquare, Smartphone, X, CheckCircle2, Sparkles} from 'lucide-react';
import {LanguageCode} from '../types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  lang: LanguageCode;
  forceOpenModal: boolean;
  onCloseModal: () => void;
  onOpenAndroidStudioModal: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  lang,
  forceOpenModal,
  onCloseModal,
  onOpenAndroidStudioModal,
}) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as {standalone?: boolean}).standalone === true;
    setIsStandalone(isStandaloneMode);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const {outcome} = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setInstalledSuccess(true);
      }
    }
  };

  const isRtl = lang === 'FA' || lang === 'AR';

  // Floating bottom quick banner if native prompt available and not dismissed
  const showQuickBanner =
    !isStandalone && !dismissedBanner && (deferredPrompt !== null || isIOS);

  return (
    <>
      {showQuickBanner && !forceOpenModal && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[420px] bg-[#2C1E16] text-[#FAF7F2] p-4 rounded-2xl shadow-2xl border-2 border-[#C59B27] z-40 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#C59B27]/20 rounded-xl text-[#E6C258]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#FAF7F2]">
                  {lang === 'FA'
                    ? 'نصب ۱-کلیکی اپلیکیشن EventMate VIP'
                    : '1-Click Install EventMate VIP App'}
                </h4>
                <p className="text-xs text-[#E6DFD3]/80 mt-0.5">
                  {lang === 'FA'
                    ? 'اجرای تمام‌صفحه روی آیفون و اندروید + کارکرد آفلاین'
                    : 'Full-screen iOS & Android experience + Offline access'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissedBanner(true)}
              className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] p-1"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition"
            >
              <Download className="w-4 h-4" />
              {lang === 'FA'
                ? 'نصب مستقیم روی صفحه اصلی گوشی'
                : 'Install Now on Home Screen'}
            </button>
          ) : (
            <div className="text-xs bg-white/10 p-2.5 rounded-xl text-[#FAF7F2] flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Share className="w-4 h-4 text-[#E6C258]" />
                {lang === 'FA'
                  ? 'در آیفون: دکمه Share و سپس Add to Home Screen را بزنید'
                  : 'On iPhone: Tap Share then Add to Home Screen'}
              </span>
              <PlusSquare className="w-4 h-4 text-[#E6C258] shrink-0" />
            </div>
          )}
        </div>
      )}

      {/* Full Interactive 1-Click PWA + Android APK Modal */}
      {forceOpenModal && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E130D]/65 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] border-2 border-[#C59B27] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#2C1E16] text-[#FAF7F2] px-6 py-4 border-b border-[#C59B27]/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E6C258]">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#FAF7F2]">
                    {lang === 'FA'
                      ? 'نصب ۱-کلیکی EventMate VIP (آیفون، اندروید و دسکتاپ)'
                      : '1-Click PWA & Android APK Installation'}
                  </h3>
                  <p className="text-xs text-[#E6C258]">
                    {lang === 'FA'
                      ? 'نسخه وب‌اپلیکیشن پیش‌رونده (PWA) + پکیج اندروید com.eventmate.vip'
                      : 'Progressive Web App (PWA) + Native Android Package'}
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseModal}
                className="p-1.5 rounded-lg text-[#FAF7F2]/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {installedSuccess || isStandalone ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="text-sm font-medium">
                    {lang === 'FA'
                      ? 'اپلیکیشن EventMate VIP روی دستگاه شما نصب و فعال است!'
                      : 'EventMate VIP is installed and active on your device!'}
                  </div>
                </div>
              ) : null}

              {/* Option 1: Direct 1-Click Browser PWA Install */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C59B27]/50 space-y-3">
                <div className="font-bold text-sm text-[#2C1E16] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9A7411]" />
                  <span>
                    {lang === 'FA'
                      ? '۱. نصب فوری روی اندروید و کروم (۱-کلیکی)'
                      : '1. Instant 1-Click Install (Android / Chrome / Edge)'}
                  </span>
                </div>
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition"
                  >
                    <Download className="w-5 h-5" />
                    {lang === 'FA'
                      ? 'نصب آنی EventMate VIP روی صفحه اصلی'
                      : 'Click to Install EventMate VIP Now'}
                  </button>
                ) : (
                  <p className="text-xs text-[#6E5A4F] leading-relaxed">
                    {lang === 'FA'
                      ? 'در مرورگر کروم اندروید یا دسکتاپ، از منوی بالای مرورگر گزینه «Install App» یا «Add to Home screen» را بزنید تا آیکون طلایی EventMate VIP به صفحه اصلی اضافه شود.'
                      : 'In Chrome/Edge menu, tap "Install App" or "Add to Home Screen" to place the golden EventMate VIP icon on your device.'}
                  </p>
                )}
              </div>

              {/* Option 2: iPhone / iPad iOS Guide */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DFD3] space-y-2.5">
                <div className="font-bold text-sm text-[#2C1E16] flex items-center gap-2">
                  <Share className="w-4 h-4 text-[#9A7411]" />
                  <span>
                    {lang === 'FA'
                      ? '۲. راهنمای نصب روی آیفون و آیپد (iOS Safari)'
                      : '2. Install on iPhone & iPad (Safari)'}
                  </span>
                </div>
                <ol className="text-xs text-[#6E5A4F] space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>
                    {lang === 'FA'
                      ? 'در نوار پایین مرورگر Safari روی دکمه Share (مربع با فلش رو به بالا) بزنید.'
                      : 'Tap the Share icon at the bottom of Safari.'}
                  </li>
                  <li>
                    {lang === 'FA'
                      ? 'گزینه «Add to Home Screen» را انتخاب کرده و در بالا دکمه «Add» را لمس کنید.'
                      : 'Select "Add to Home Screen" and tap "Add".'}
                  </li>
                </ol>
              </div>

              {/* Option 3: Native Android APK & AAB Builder */}
              <div className="p-4 rounded-xl bg-[#2C1E16] text-[#FAF7F2] border border-[#C59B27] flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-[#E6C258]">
                    {lang === 'FA'
                      ? '۳. خروجی مستقیم APK و AAB اندروید (com.eventmate.vip)'
                      : '3. Native Android APK & AAB Release Studio'}
                  </div>
                  <p className="text-xs text-[#E6DFD3]/80 mt-1">
                    {lang === 'FA'
                      ? 'مشاهده سورس کامل /android و پوش ۱-کلیکی به گیت‌هاب جهت دریافت فایل نصبی APK'
                      : 'Inspect /android project & trigger automated GitHub Actions APK/AAB build'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onCloseModal();
                    onOpenAndroidStudioModal();
                  }}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8215] text-[#1E130D] font-bold text-xs hover:brightness-105 transition"
                >
                  {lang === 'FA' ? 'پنل ساخت APK' : 'Open APK Studio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
