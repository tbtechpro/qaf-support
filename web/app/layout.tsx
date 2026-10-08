import "./globals.css";

export const metadata = { title: "QAF Support", description: "AI support for Qubators AI Foundry — answers, 24h/3h/1h reminders, WhatsApp handoff." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#10d9a3" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <script dangerouslySetInnerHTML={{ __html: `if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})})}` }} />
      </head>
      <body>
        <nav className="nav">
          <div className="nav-in">
            <a className="brand" href="/"><span className="logo">Q</span>QAF Support</a>
            <div className="nav-links">
              <a href="/ask">Ask</a><a href="/plan">Plan</a><a href="/reminders">Reminders</a><a href="/organizer">Organizer</a>
            </div>
          </div>
        </nav>
        <div className="shell">{children}
          <p className="foot">QAF Support pilot · one programme · one cohort · <span className="kbd">WAT</span> · in-app always, WhatsApp/email only if opted-in</p>
        </div>
      </body>
    </html>
  );
}
