import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class RootErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean; errorMsg: string}
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false, errorMsg: ''};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, errorMsg: error?.message || 'Unexpected render error'};
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-[#FAF7F2] text-[#2C1E16] flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full p-6 rounded-3xl bg-white border-2 border-[#D4AF37] shadow-xl text-center space-y-4">
            <h1 className="text-xl font-black text-[#E11D48]">
              👑 EventMate VIP | ایونت‌مِیت
            </h1>
            <p className="text-xs text-[#6E5A4F]">
              در حال بازنشانی خودکار حافظه مرورگر و بارگذاری مجدد سامانه...
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#D4AF37] text-white font-extrabold text-xs cursor-pointer"
            >
              بارگذاری مجدد صفحه
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
