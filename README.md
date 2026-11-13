# Atlas putovanja

Aplikacija za praćenje putovanja: 195 država sveta koje označavaš kao **obiđene** (✓) ili kao one koje **želiš da posetiš** (★).

**Promo stranica:** https://srdjan89np.github.io/atlas-putovanja/

## Šta je u repozitorijumu

| Folder | Sadržaj |
| --- | --- |
| `app/` | Aplikacija: jedna datoteka `index.html`, bez build koraka. Ovo je izvor za mobilnu aplikaciju. |
| `scripts/`, `package.json`, `capacitor.config.json` | Pakovanje za Android (Capacitor): `scripts/build.js` pravi `www/` sa mapom i d3 u paketu, most ka AdMob-u, sistemskom „Deli“ i dugmetu Nazad. |
| `assets/` | Ikonica i splash ekran (izvor za `capacitor-assets`). |
| `.github/workflows/android.yml` | GitHub pravi APK pri svakoj izmeni aplikacije. |
| `docs/` | Promo stranica koju objavljuje GitHub Pages (*Settings → Pages → `main` / `docs`*). |

Web verzija aplikacije više nije javno objavljena. Na GitHub Pages stoji samo promo stranica.

## Mogućnosti

- **Lista 195 država** sa pretragom (srpski i engleski nazivi, ISO kod) i filterima *Sve / Obišao / Želim*.
- **Mapa i globus**: države se boje prema oznaci, male države su tačke, prikaz se bira dugmetom *Mapa / Globus*. Kosovo je prikazano kao deo Srbije.
- **Podaci o državi**: glavni grad, stanovništvo, površina, gustina, valuta, jezik, pozivni broj, strana vožnje i najbolje vreme za posetu.
- **Dnevnik**: više putovanja po državi (godina, gradovi, beleška), vremenska linija po godinama, poznati gradovi kao tačke na mapi.
- **Plan**: prioritet na listi želja i predlozi država blizu onih koje si obišao.
- **Kviz**: zastave i glavni gradovi, deset pitanja, 15 sekundi po pitanju. Poeni se računaju iz tačnosti i brzine (najviše 2.000).
- **Dostignuća**: deset pečata i napredak po kontinentima, sa porukom kad se dostignuće otključa.
- **Podeli mapu**: slika 1080×1350 sa mapom ili globusom i statistikom.
- **Rezervna kopija**: izvoz i uvoz oznaka i beleški (JSON).
- Tri stranice sa donjom navigacijom: **Početna** (mapa, države, dnevnik, plan), **Kviz** i **Dostignuća** (sa rezervnom kopijom).
- Srpski i engleski jezik, svetla i tamna tema, uvodni ekrani.
- Rezervisano mesto za AdMob baner 320×50 na dnu ekrana (`#admob-banner`).

## Čuvanje podataka

Sve se čuva na uređaju:

| Mesto | Sadržaj |
| --- | --- |
| `localStorage` `atlas-putovanja-v1` | oznake država |
| `localStorage` `atlas-putovanja-v1-notes` | putovanja (`{"IT":{"trips":[{"year":"2019","cities":"Rim","note":"…"}]}}`) |
| `localStorage` `atlas-putovanja-v1-prio` | prioriteti liste želja |
| `localStorage` `atlas-lang`, `atlas-view`, `atlas-onboarded`, `atlas-quiz-best` | podešavanja |

Kada se stranica otvori kao Claude artifact, oznake i beleške se dodatno čuvaju na Claude nalogu.

## Podaci o državama

Provereno u novembru 2026:

- glavni gradovi, površine, valute i pozivni brojevi upoređeni su sa skupom [mledoze/countries](https://github.com/mledoze/countries);
- broj stanovnika je iz podataka Svetske banke ([datasets/population](https://github.com/datasets/population)), godina 2025.

Nisu provereni prema izvoru: službeni jezici, strana vožnje, najbolje vreme za posetu i koordinate gradova. Koordinate gradova su prošle samo grubu proveru da grad pada u svoju državu na mapi.

## Spoljni resursi

- Mapa: `jsvectormap@1.5.3` (`dist/maps/world.js`) sa jsDelivr-a, samo datoteka sa podacima mape.
- Globus: `d3@7.8.5` sa cdnjs, učitava se kad se globus uključi.
- Fontovi: Bricolage Grotesque, Atkinson Hyperlegible i JetBrains Mono sa Google Fonts.

Za mobilnu aplikaciju ove datoteke treba upakovati lokalno, da aplikacija radi bez interneta.

## Android aplikacija (APK)

APK pravi GitHub, ništa se ne instalira na računar.

- **Gde je APK:** [Releases](https://github.com/srdjan89np/atlas-putovanja/releases/latest) → `atlas-putovanja.apk`.
- **Kada se pravi:** posle svake izmene u `app/`, `scripts/`, `assets/` ili ručno: *Actions → Android APK → Run workflow*.
- **Potpis:** bez tajnih podataka pravi se debug APK, pa nova verzija traži deinstalaciju stare. Za stalni potpis (i `.aab` za Google Play) upiši u *Settings → Secrets and variables → Actions*: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
- **Oglasi:** baner je na dnu ekrana. AdMob ID aplikacije i banera su u `admob.config.json` (Secrets `ADMOB_APP_ID` i `ADMOB_BANNER_ID` imaju prednost ako postoje). Za probne oglase: `ADMOB_TEST=1`.
- **Paket:** `rs.atlasputovanja.app`. Mapa i globus rade bez interneta; fontovi se učitavaju sa interneta, a bez njega se koriste sistemski.

Lokalno: `npm install`, `npm run android:init` (jednom), `npm run android:sync`, `npm run android:open`.
