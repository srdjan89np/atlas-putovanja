#!/usr/bin/env node
// Capacitor hook (package.json "capacitor:copy:after"): upisuje AdMob ID aplikacije
// u android/app/src/main/AndroidManifest.xml. Bez njega Google Mobile Ads ruši
// aplikaciju pri pokretanju. ID dolazi iz ADMOB_APP_ID, a bez njega ide Google-ov probni ID.
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "android", "app", "src", "main", "AndroidManifest.xml");
if (!fs.existsSync(file)) process.exit(0);

const id = process.env.ADMOB_APP_ID || "ca-app-pub-3940256099942544~3347511713";
let xml = fs.readFileSync(file, "utf8");
const tag = `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${id}"/>`;
const re = /<meta-data\s+android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"[^>]*\/>/;

if (re.test(xml)) xml = xml.replace(re, tag);
else xml = xml.replace("</application>", `    ${tag}\n    </application>`);
fs.writeFileSync(file, xml);
console.log("AdMob APPLICATION_ID:", id.startsWith("ca-app-pub-3940256099942544") ? "probni (Google test)" : "pravi");
