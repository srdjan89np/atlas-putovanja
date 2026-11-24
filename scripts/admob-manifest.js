#!/usr/bin/env node
// Capacitor hook (package.json "capacitor:copy:after"): upisuje AdMob ID aplikacije
// u android/app/src/main/AndroidManifest.xml. Bez njega Google Mobile Ads ruši
// aplikaciju pri pokretanju. ID dolazi iz ADMOB_APP_ID, a bez njega ide Google-ov probni ID.
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "android", "app", "src", "main", "AndroidManifest.xml");
if (!fs.existsSync(file)) process.exit(0);

let cfg = {};
try { cfg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "admob.config.json"), "utf8")); } catch (e) {}
const id = process.env.ADMOB_APP_ID || cfg.appId || "ca-app-pub-3940256099942544~3347511713";
let xml = fs.readFileSync(file, "utf8");
const tag = `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${id}"/>`;
const re = /<meta-data\s+android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"[^>]*\/>/;

if (re.test(xml)) xml = xml.replace(re, tag);
else xml = xml.replace("</application>", `    ${tag}\n    </application>`);
// Rezervna kopija u Documents: Android 9 i stariji traže WRITE_EXTERNAL_STORAGE, Android 10 legacy pristup.
const perm = `<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28"/>`;
if (!xml.includes("android.permission.WRITE_EXTERNAL_STORAGE")) xml = xml.replace(/(<application\b)/, `${perm}\n    $1`);
if (!/requestLegacyExternalStorage/.test(xml)) xml = xml.replace(/<application\b/, `<application android:requestLegacyExternalStorage="true"`);
// Automatska rezervna kopija (Android Auto Backup na Google nalogu): podaci aplikacije, uklj. Preferences
if (!/android:allowBackup=/.test(xml)) xml = xml.replace(/<application\b/, `<application android:allowBackup="true"`);
else xml = xml.replace(/android:allowBackup="false"/, 'android:allowBackup="true"');
// Link prijatelja za poređenje: atlasputovanja://c/<kod> otvara aplikaciju
if (!xml.includes('android:scheme="atlasputovanja"')) {
  const filter = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="atlasputovanja" />
            </intent-filter>`;
  xml = xml.replace(/(<activity\b[^>]*MainActivity[\s\S]*?<\/intent-filter>)/, `$1${filter}`);
}
fs.writeFileSync(file, xml);
// Mala ikonica za obaveštenja (bela silueta globusa)
const draw = path.join(__dirname, "..", "android", "app", "src", "main", "res", "drawable");
fs.mkdirSync(draw, { recursive: true });
fs.writeFileSync(path.join(draw, "ic_stat_atlas.xml"), `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24">
  <path android:fillColor="#FFFFFFFF" android:pathData="M12,2A10,10 0,1 0,22 12,10 10,0 0,0 12,2ZM19.9,11H16.95A15.7,15.7 0,0 0,15.4 4.8,8 8,0 0,1 19.9,11ZM12,4.04C12.83,5.24 13.95,7.6 14.15,11H9.85C10.05,7.6 11.17,5.24 12,4.04ZM8.6,4.8A15.7,15.7 0,0 0,7.05 11H4.1A8,8 0,0 1,8.6 4.8ZM4.1,13H7.05A15.7,15.7 0,0 0,8.6 19.2,8 8,0 0,1 4.1,13ZM12,19.96C11.17,18.76 10.05,16.4 9.85,13H14.15C13.95,16.4 12.83,18.76 12,19.96ZM15.4,19.2A15.7,15.7 0,0 0,16.95 13H19.9A8,8 0,0 1,15.4 19.2Z"/>
</vector>
`);
console.log("AdMob APPLICATION_ID:", id.startsWith("ca-app-pub-3940256099942544") ? "probni (Google test)" : "pravi");
