#!/usr/bin/env node
// Pravi www/ za Android (Capacitor) iz app/index.html:
//  - mapa sveta i d3 (globus) idu u paket, pa aplikacija radi bez interneta
//  - dodaje Capacitor i most ka dodacima: AdMob baner, sistemski „Deli“, dugme Nazad
// Pokretanje: node scripts/build.js   (posle "npm install")
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WWW = path.join(ROOT, "www");
const nm = (rel) => path.join(ROOT, "node_modules", rel);

function need(file, what) {
  if (!fs.existsSync(file)) throw new Error(`Nema ${what} (${path.relative(ROOT, file)}) — pokreni "npm install".`);
  return file;
}
function swap(html, from, to) {
  if (!html.includes(from)) throw new Error(`app/index.html: ne nalazim "${from}"`);
  return html.split(from).join(to);
}
function inline(rel, required) {
  const f = nm(rel);
  if (!fs.existsSync(f)) {
    if (required) throw new Error(`Nema ${rel} — pokreni "npm install".`);
    console.warn(`upozorenje: nema ${rel}, preskačem`);
    return "";
  }
  return `<script>\n${fs.readFileSync(f, "utf8").replace(/<\/script/gi, "<\\/script")}\n</script>\n`;
}

// Redosled: ADMOB_TEST=1 (probni oglasi) > ADMOB_BANNER_ID iz okruzenja > admob.config.json > Google probni ID.
let ADCFG = {};
try { ADCFG = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "admob.config.json"), "utf8")); } catch (e) {}
const TEST_BANNER = "ca-app-pub-3940256099942544/6300978111";
const REAL_BANNER = process.env.ADMOB_BANNER_ID || ADCFG.bannerId || "";
const TESTING = process.env.ADMOB_TEST === "1" || !REAL_BANNER;
const BANNER = TESTING ? TEST_BANNER : REAL_BANNER;
// Reklama sa nagradom za „Podrška autoru“: ADMOB_REWARD_ID > admob.config.json > Google probni ID.
const TEST_REWARD = "ca-app-pub-3940256099942544/5224354917";
const REAL_REWARD = process.env.ADMOB_REWARD_ID || ADCFG.rewardId || "";
const REWARD = TESTING || !REAL_REWARD ? TEST_REWARD : REAL_REWARD;

const bridge = `<script>
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  document.documentElement.classList.add("native");
  var setH = function (h) { document.documentElement.style.setProperty("--ad-h", (h || 0) + "px"); };
  setH(0);
  var P = C.Plugins || {};
  var reg = (window.capacitorExports && window.capacitorExports.registerPlugin) || C.registerPlugin;
  var APP = (window.capacitorApp && window.capacitorApp.App) || P.App || (reg ? reg("App") : null);
  var AD = P.AdMob || (reg ? reg("AdMob") : null);
  var FS = P.Filesystem || (reg ? reg("Filesystem") : null);
  var SH = P.Share || (reg ? reg("Share") : null);

  // Rezervna kopija i slika mape: datoteka se upiše u keš aplikacije i otvori se Android „Deli“.
  if (FS && SH) {
    window.__nativeExport = function (name, text) {
      return FS.writeFile({ path: name, data: text, directory: "CACHE", encoding: "utf8" }).then(function (r) {
        return SH.share({ title: name, files: [r.uri], dialogTitle: name });
      });
    };
    // Rezervna kopija ide pravo u telefon: Documents/Atlas putovanja/<datoteka>.json
    // (Android 9 i stariji traže dozvolu za pisanje; Android 10+ ne traži ništa za sopstvene datoteke).
    window.__nativeSaveFile = function (name, text) {
      var ask = FS.requestPermissions ? FS.requestPermissions().catch(function () { return null; }) : Promise.resolve(null);
      return ask.then(function () {
        return FS.writeFile({ path: "Atlas putovanja/" + name, data: text, directory: "DOCUMENTS", encoding: "utf8", recursive: true });
      }).then(function () { return "Documents › Atlas putovanja › " + name; });
    };
    // Tekst (kod za poređenje sa prijateljem) ide kroz Android „Deli“.
    window.__nativeShareText = function (text, title) {
      return SH.share({ title: title, text: text, dialogTitle: title });
    };
    window.__nativeShareImage = function (name, b64, title) {
      return FS.writeFile({ path: name, data: b64, directory: "CACHE" }).then(function (r) {
        return SH.share({ title: title, files: [r.uri], dialogTitle: title });
      });
    };
  }

  // Google AdMob baner na dnu ekrana. ID dolazi iz ADMOB_BANNER_ID (GitHub Secrets),
  // a bez njega se koristi Google-ov probni baner („Test Ad“).
  var BANNER = ${JSON.stringify(BANNER)};
  var TESTING = ${JSON.stringify(TESTING)};
  var REWARD = ${JSON.stringify(REWARD)};
  var REWARD_ON = ${JSON.stringify(TESTING || !!REAL_REWARD)};
  if (AD) {
    AD.addListener("bannerAdSizeChanged", function (s) { setH(s && s.height); });
    AD.addListener("bannerAdFailedToLoad", function () { setH(0); });
    AD.initialize({ initializeForTesting: TESTING })
      .then(function () { return AD.requestConsentInfo ? AD.requestConsentInfo().catch(function () { return null; }) : null; })
      .then(function (c) {
        if (c && c.isConsentFormAvailable && c.status === "REQUIRED") {
          return AD.showConsentForm().catch(function () {}).then(function () {
            return AD.requestConsentInfo().catch(function () { return c; });
          });
        }
        return c;
      })
      .then(function (c) {
        // Korisnik iz EU mora moći da promeni saglasnost: dugme „Privatnost oglasa“ na stranici Dostignuća.
        if (c && c.privacyOptionsRequirementStatus === "REQUIRED" && AD.showPrivacyOptionsForm) {
          window.__adPrivacy = function () { return AD.showPrivacyOptionsForm().catch(function () {}); };
          window.dispatchEvent(new Event("adprivacy"));
        }
        // „Podrška autoru“: reklama sa nagradom, samo kad je korisnik sam zatraži. Vraća true ako je odgledana do kraja.
        // Bez pravog ID-ja reklame sa nagradom (a nije probna verzija), link „Podrška autoru“ se ne prikazuje.
        if (REWARD_ON) window.__nativeReward = function () {
          return new Promise(function (resolve, reject) {
            var got = false, end = false, hs = [];
            var finish = function (fn, v) { if (end) return; end = true; hs.forEach(function (h) { Promise.resolve(h).then(function (x) { if (x && x.remove) x.remove(); }); }); fn(v); };
            hs.push(AD.addListener("onRewardedVideoAdReward", function () { got = true; }));
            hs.push(AD.addListener("onRewardedVideoAdDismissed", function () { setTimeout(function () { finish(resolve, got); }, 400); }));
            hs.push(AD.addListener("onRewardedVideoAdFailedToShow", function (e) { finish(reject, e); }));
            AD.prepareRewardVideoAd({ adId: REWARD, isTesting: TESTING || REWARD === ${JSON.stringify(TEST_REWARD)} })
              .then(function () { return AD.showRewardVideoAd(); })
              .then(function (r) { if (r && (r.amount || r.type)) got = true; }, function (e) { finish(reject, e); });
          });
        };
        if (REWARD_ON) window.dispatchEvent(new Event("adreward"));
        return AD.showBanner({ adId: BANNER, adSize: "ADAPTIVE_BANNER", position: "BOTTOM_CENTER", margin: 0, isTesting: TESTING });
      })
      .catch(function () { setH(0); });
  }

  // Dugme Nazad: prvo zatvara ono što je otvoreno u aplikaciji, pa tek onda izlazi.
  if (APP) APP.addListener("backButton", function () {
    if (window.__atlasBack && window.__atlasBack()) return;
    if (window.scrollY > 300) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    APP.exitApp();
  });
})();
</script>
`;

let html = fs.readFileSync(path.join(ROOT, "app", "index.html"), "utf8");
html = swap(html, "https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/maps/world.js", "world.js");
html = swap(html, "https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js", "d3.min.js");
// Android (Capacitor 8, SystemBars "native"): bez viewport-fit=cover sadržaj ne ulazi pod sistemske trake.
html = html.replace(",viewport-fit=cover", "").replace(", viewport-fit=cover", "");
const scripts = inline("@capacitor/core/dist/capacitor.js", true) + inline("@capacitor/app/dist/plugin.js", false) + bridge;
if (!html.includes("</head>")) throw new Error("app/index.html: nema </head>");
html = html.replace("</head>", scripts + "</head>");

fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });
fs.writeFileSync(path.join(WWW, "index.html"), html);
fs.copyFileSync(need(nm("jsvectormap/dist/maps/world.js"), "mape sveta"), path.join(WWW, "world.js"));
fs.copyFileSync(need(nm("d3/dist/d3.min.js"), "d3"), path.join(WWW, "d3.min.js"));
console.log(`www/ spreman: index.html ${(html.length / 1024).toFixed(0)} KB, AdMob baner: ${TESTING ? "probni (Google test)" : "pravi"}, nagrada: ${REAL_REWARD && !TESTING ? "prava" : TESTING ? "probna" : "isključena (nema rewardId)"}`);
