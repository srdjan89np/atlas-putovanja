# Atlas putovanja

Aplikacija za praćenje putovanja. Sadrži svih 195 država sveta, a svaku možeš da označiš kao **obiđenu** (✓) ili kao državu koju **želiš da posetiš** (★).

**Otvori aplikaciju:** https://srdjan89np.github.io/atlas-putovanja/

Cela aplikacija je jedna HTML datoteka (`index.html`), bez build koraka i bez servera.

## Mogućnosti

- **Lista svih 195 država** sa zastavom, kontinentom i glavnim gradom, pretragom (srpski i engleski nazivi, ISO kod) i filterima *Sve / Obišao / Želim*.
- **Interaktivna mapa sveta**: države se boje prema oznaci. Mapa se uvećava, pomera i reaguje na dodir. Male države (Vatikan, Monako, Malta, ostrvske države…) prikazane su kao tačke. Kosovo je prikazano kao deo Srbije.
- **Osnovne informacije o državi**: glavni grad, broj stanovnika, površina, gustina naseljenosti, valuta, jezik, pozivni broj i strana puta kojom se vozi.
- **Beleške o putovanju** za obiđene države: godina, gradovi i slobodan tekst.
- **Napredak po kontinentima** i **10 dostignuća**: Prvi pečat, Putnik, Svetski putnik, Istraživač, Klub 100, Legenda, Svi kontinenti, Ceo kontinent, Oko Mediterana i Ostrvljanin.
- **Podeli mapu**: pravi uspravnu sliku 1080×1350 za društvene mreže, sa mapom, statistikom i dostignućima. Na telefonu se otvara sistemski meni za deljenje, a na računaru se slika preuzima.
- **Dva jezika**: srpski (latinica) i engleski. Izbor se pamti.
- **Uvodni ekrani** pri prvom otvaranju. Kasnije se otvaraju linkom „Kako radi“.
- **Svetla i tamna tema**: prati podešavanje sistema.
- **Mesto za reklamu** (AdMob baner 320×50) usidreno na dnu ekrana.

## Pokretanje

Otvori `index.html` u pregledaču. Za objavu na internetu možeš da koristiš GitHub Pages:
*Settings → Pages → Deploy from a branch → `main` / root*.

GitHub Pages je besplatan samo za javne repozitorijume. Za privatni je potreban plaćeni GitHub plan.

## Čuvanje podataka

Oznake, beleške, izabrani jezik i podatak o tome da su uvodni ekrani viđeni čuvaju se u `localStorage` pregledača:

| Ključ | Sadržaj |
| --- | --- |
| `atlas-putovanja-v1` | oznake država (`{"RS":"been","JP":"want"}`) |
| `atlas-putovanja-v1-notes` | beleške (`{"IT":{"year":"2019","cities":"Rim, Firenca","note":"…"}}`) |
| `atlas-lang` | `sr` ili `en` |
| `atlas-onboarded` | `1` posle uvodnih ekrana |

Kada se stranica otvori kao Claude artifact, podaci se dodatno čuvaju i na Claude nalogu, pa se vide na svim uređajima.

## Spoljni resursi

- Mapa: `jsvectormap@1.5.3` (`dist/maps/world.js`) sa jsDelivr CDN-a. Učitava se samo datoteka sa podacima mape, ne i sama biblioteka.
- Fontovi: Bricolage Grotesque, Atkinson Hyperlegible i JetBrains Mono sa Google Fonts.

Ako mapa ne može da se učita, lista i sve ostale funkcije rade normalno.

## Podaci o državama

Podaci o državama (glavni grad, stanovništvo, površina, valuta, jezik, pozivni broj) uneti su ručno. Broj stanovnika je zaokružena procena. Podatke vredi proveriti pre objavljivanja i povremeno ih osvežiti.

## AdMob

AdMob radi samo u nativnim Android/iOS aplikacijama, ne na običnoj veb stranici. Na dnu stranice je rezervisan element `#admob-banner` (320×50).

Da bi reklame radile:

1. Upakuj aplikaciju kao mobilnu, na primer pomoću [Capacitor](https://capacitorjs.com/)-a: `index.html` se ubacuje u `www/` folder.
2. Dodaj AdMob dodatak (npr. `@capacitor-community/admob`) i prikaži baner na dnu ekrana (`BannerAdPosition.BOTTOM_CENTER`, veličina `BANNER`).
3. U atributu `data-ad-unit` zameni `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX` svojim Ad Unit ID-jem. Tokom testiranja koristi Google-ove test ID-jeve.
