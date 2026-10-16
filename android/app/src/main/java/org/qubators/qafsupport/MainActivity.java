package org.qubators.qafsupport;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.browser.customtabs.CustomTabsClient;
import androidx.browser.customtabs.CustomTabsIntent;

/**
 * Launcher router: fullscreen TWA when a verified browser exists,
 * Chrome Custom Tab otherwise, in-app WebView as the last resort.
 * The app always opens — no browser dependency.
 */
public class MainActivity extends Activity {
    static final String START_URL = "https://warranties-hansen-opponents-ham.trycloudflare.com/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Uri data = getIntent() != null ? getIntent().getData() : null;
        String url = (data != null && "https".equals(data.getScheme())) ? data.toString() : START_URL;

        // 1) Fullscreen Trusted Web Activity via the browser-helper launcher.
        try {
            String provider = CustomTabsClient.getPackageName(this, null);
            if (provider == null) throw new ActivityNotFoundException("no custom-tabs provider");
            Intent twa = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            twa.setClassName(this, "com.google.androidbrowserhelper.trusted.LauncherActivity");
            startActivity(twa);
            finish();
            return;
        } catch (Exception ignored) {
            // fall through
        }

        // 2) Chrome Custom Tab (same web app, with URL bar).
        try {
            CustomTabsIntent intent = new CustomTabsIntent.Builder().build();
            intent.launchUrl(this, Uri.parse(url));
            finish();
            return;
        } catch (Exception ignored) {
            // fall through
        }

        // 3) In-app WebView — works on any phone, no browser needed.
        Intent wv = new Intent(this, WebViewFallbackActivity.class);
        wv.setData(Uri.parse(url));
        wv.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(wv);
        finish();
    }
}
