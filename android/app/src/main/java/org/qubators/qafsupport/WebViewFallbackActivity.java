package org.qubators.qafsupport;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Last-resort in-app browser: full site, JS + storage on, external apps for tel/WhatsApp links. */
public class WebViewFallbackActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handle(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handle(Uri.parse(url));
            }

            private boolean handle(Uri u) {
                if (u == null) return false;
                String scheme = u.getScheme() == null ? "" : u.getScheme();
                String host = u.getHost() == null ? "" : u.getHost();
                if (scheme.equals("tel") || scheme.equals("mailto")
                        || host.equals("wa.me") || host.endsWith(".wa.me")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, u));
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }
                return false;
            }
        });
        Uri data = getIntent() != null ? getIntent().getData() : null;
        web.loadUrl(data != null ? data.toString() : MainActivity.START_URL);
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) {
            web.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
