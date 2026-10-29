# personal-trackers

Osobni dnevnici kao samostalne HTML stranice (PWA, rade offline, podaci samo u `localStorage`). Bez build koraka: sav CSS i JS je unutar same HTML datoteke, a Chart.js i fontovi su lokalno u `vendor/`. Sučelje i komentari su na hrvatskom.

## Aplikacije

| Aplikacija | Datoteka | Manifest | localStorage ključ |
|---|---|---|---|
| Prehrana & težina | `dnevnik-prehrane-i-tezine.html` | `manifest.json` | `wt_diary_v1` |
| Šah & engleski | `dnevnik-sah-i-engleski.html` | `manifest-sah-engleski.json` | `chess_english_v1` |

`index.html` je samo početna stranica s poveznicama na aplikacije. `sw.js` je zajednički service worker za sve aplikacije. `dnevnik.html` je stari, nepovezani prototip.

## Verzioniranje (obavezno)

Svaka izmjena aplikacije mora povećati njezinu verziju, u istoj izmjeni (istom commitu) kao i sama promjena:

1. **`APP_VERSION`** na vrhu `<script>` bloka izmijenjene HTML datoteke (prikazuje se na dnu taba Izvoz). Semver:
   - **patch** (`1.0.0` → `1.0.1`): ispravak greške, sitna promjena izgleda ili teksta
   - **minor** (`1.0.1` → `1.1.0`): nova mogućnost ili vidljiva promjena ponašanja
   - **major** (`1.1.0` → `2.0.0`): promjena formata podataka koja traži migraciju ili ruši kompatibilnost backupa
2. **`CACHE` u `sw.js`** (`dnevnik-vN` → `dnevnik-vN+1`) kad god se promijeni bilo koja datoteka s popisa `ASSETS`. Bez toga instalirana PWA na mobitelu i dalje vrti staru verziju iz cachea.
3. Nova datoteka koju aplikacija koristi mora se dodati u `ASSETS` u `sw.js` (i opet povećati `CACHE`).

Svaka aplikacija ima svoju verziju; mijenja se samo verzija aplikacije koja je stvarno izmijenjena. U poruci commita navedi novu verziju (npr. `Šah & engleski 1.1.0: ...`).

## Podaci

- Ne mijenjaj `localStorage` ključ ni oblik postojećih zapisa bez migracije u `loadData()`/`normalize()`; korisnik ima stvarne podatke samo u pregledniku.
- JSON uvoz mora i dalje prihvaćati backupove starijih verzija.
- Datume računaj u lokalnom vremenu (`isoDate()` u aplikaciji Šah & engleski), ne preko `toISOString()`, jer to između ponoći i 2 h vraća jučerašnji datum.

## Mobitel

Aplikacije se najviše koriste na iPhoneu kao PWA. Na užim ekranima (`max-width:720px`) tabovi su donja traka, polja imaju barem 16px font (bez iOS auto-zooma) i barem 44–46px visine za dodir. Svaku promjenu izgleda provjeri i na uskom ekranu.
