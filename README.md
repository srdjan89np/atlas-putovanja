# Atlas putovanja

Aplikacija za praćenje putovanja: 195 država sveta koje označavaš kao **obiđene** (✓) ili kao one koje **želiš da posetiš** (★).

**Promo stranica:** https://srdjan89np.github.io/atlas-putovanja/

## Šta je u repozitorijumu

| Folder | Sadržaj |
| --- | --- |
| `app/` | Aplikacija: jedna datoteka `index.html`, bez build koraka. Ovo je izvor za mobilnu aplikaciju. |
| `docs/` | Promo stranica koju objavljuje GitHub Pages (*Settings → Pages → `main` / `docs`*). |

Web verzija aplikacije više nije javno objavljena. Na GitHub Pages stoji samo promo stranica.

## Mogućnosti

- **Lista 195 država** sa pretragom (srpski i engleski nazivi, ISO kod) i filterima *Sve / Obišao / Želim*.
- **Mapa i globus**: države se boje prema oznaci, male države su tačke, prikaz se bira dugmetom *Mapa / Globus*. Kosovo je prikazano kao deo Srbije.
- **Podaci o državi**: glavni grad, stanovništvo, površina, gustina, valuta, jezik, pozivni broj, strana vožnje i najbolje vreme za posetu.
- **Dnevnik**: više putovanja po državi (godina, gradovi, beleška, jedna fotografija), vremenska linija po godinama, poznati gradovi kao tačke na mapi.
- **Plan**: prioritet na listi želja i predlozi država blizu onih koje si obišao.
- **Kviz**: zastave i glavni gradovi, deset pitanja.
- **Dostignuća**: deset pečata i napredak po kontinentima, sa porukom kad se dostignuće otključa.
- **Podeli mapu**: slika 1080×1350 sa mapom ili globusom i statistikom.
- **Rezervna kopija**: izvoz i uvoz oznaka i beleški (JSON). Fotografije nisu deo rezervne kopije.
- Srpski i engleski jezik, svetla i tamna tema, uvodni ekrani.
- Rezervisano mesto za AdMob baner 320×50 na dnu ekrana (`#admob-banner`).

## Čuvanje podataka

Sve se čuva na uređaju:

| Mesto | Sadržaj |
| --- | --- |
| `localStorage` `atlas-putovanja-v1` | oznake država |
| `localStorage` `atlas-putovanja-v1-notes` | putovanja (`{"IT":{"trips":[{"year":"2019","cities":"Rim","note":"…","photo":"l:…"}]}}`) |
| `localStorage` `atlas-putovanja-v1-prio` | prioriteti liste želja |
| `localStorage` `atlas-lang`, `atlas-view`, `atlas-onboarded`, `atlas-quiz-best` | podešavanja |
| IndexedDB `atlas-photos` | fotografije putovanja, smanjene na najviše 1280 px |

Kada se stranica otvori kao Claude artifact, oznake i beleške se dodatno čuvaju na Claude nalogu, a fotografije u skladištu artifacta.

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

## Mobilna aplikacija i AdMob

AdMob radi samo u nativnoj aplikaciji. Sledeći korak je pakovanje `app/index.html` pomoću [Capacitor](https://capacitorjs.com/)-a i prikaz banera na mestu `#admob-banner` (dodatak `@capacitor-community/admob`, pozicija `BOTTOM_CENTER`).
