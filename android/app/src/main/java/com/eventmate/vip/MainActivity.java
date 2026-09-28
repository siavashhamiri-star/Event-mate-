package com.eventmate.vip;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

/**
 * EventMate VIP | ایونت‌مِیت
 * اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM
 * Package: com.eventmate.vip
 *
 * SECURITY ARCHITECTURE:
 * Zero private API keys are stored in the Android binary.
 * All endpoints are automatically injected via Gradle BuildConfig from environment variables
 * and communicate strictly through the isolated server proxy (`server.ts`).
 */
public class MainActivity extends Activity {

    private WebView webView;
    private static final String APP_URL = BuildConfig.API_BASE_URL;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#FAF7F2"));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.addJavascriptInterface(new EventMateBridge(), "EventMateAndroid");
        webView.setWebChromeClient(new WebChromeClient());

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String url = uri.toString();
                if (url.startsWith("whatsapp://") || url.contains("wa.me") || url.startsWith("mailto:") || url.startsWith("tel:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        startActivity(intent);
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "اپلیکیشن مقصد یافت نشد", Toast.LENGTH_SHORT).show();
                    }
                    return true;
                }
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    loadOfflineLuxuryFallback(view);
                }
            }
        });

        webView.loadUrl(APP_URL);
    }

    private void loadOfflineLuxuryFallback(WebView view) {
        String offlineHtml = "<!DOCTYPE html><html dir='rtl' lang='fa'><head><meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width,initial-scale=1.0'>" +
                "<style>body{background:#FAF7F2;color:#2C1E16;font-family:sans-serif;text-align:center;padding:32px;}" +
                ".card{background:#FFFDF9;border:2px solid #C59B27;border-radius:20px;padding:28px;max-width:460px;margin:40px auto;box-shadow:0 16px 40px rgba(44,30,22,0.08);}" +
                "h1{color:#2C1E16;font-size:22px;margin-bottom:8px;}p{color:#6E5A4F;line-height:1.8;font-size:14px;}" +
                ".btn{display:inline-block;margin-top:18px;padding:12px 24px;background:linear-gradient(135deg,#D4AF37,#AA8215);color:#1E130D;font-weight:bold;border-radius:12px;text-decoration:none;}</style></head>" +
                "<body><div class='card'><h1>EventMate VIP | ایونت‌مِیت</h1>" +
                "<p>اکوسیستم آفرینش | شهر جدید نیومتاورسیتی جهان | توان استیج FBNM</p>" +
                "<p>در حال حاضر اتصال اینترنت برقرار نیست. لطفاً اتصال شبکه خود را بررسی کرده و مجدداً تلاش نمایید.</p>" +
                "<a class='btn' href='" + APP_URL + "'>تلاش مجدد و بارگذاری سامانه</a></div></body></html>";
        view.loadDataWithBaseURL(null, offlineHtml, "text/html", "UTF-8", null);
    }

    public class EventMateBridge {
        @JavascriptInterface
        public void showToast(String message) {
            Toast.makeText(MainActivity.this, message, Toast.LENGTH_LONG).show();
        }

        @JavascriptInterface
        public String getPackageName() {
            return "com.eventmate.vip";
        }

        @JavascriptInterface
        public String getServerProxyConciergeUrl() {
            return BuildConfig.SERVER_PROXY_CONCIERGE;
        }

        @JavascriptInterface
        public String getServerProxyRatesUrl() {
            return BuildConfig.SERVER_PROXY_RATES;
        }

        @JavascriptInterface
        public String getServerProxyOAuthConfigUrl() {
            return BuildConfig.SERVER_PROXY_OAUTH_CONFIG;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
