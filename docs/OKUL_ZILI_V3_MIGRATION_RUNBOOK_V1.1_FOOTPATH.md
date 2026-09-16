# OKUL ZİLİ V3 — MIGRATION RUNBOOK V1.1
## Uygulama Footpath Sürümü

**Kaynak:** Modüler Mimari Anayasası V1.1  
**Referans:** V2 Golden Master  
**Çalışma alanı:** V3 + Git  
**Ana koordinasyon:** GPT  
**Uygulama:** Gemini  
**Dış mimari denetim:** Claude (yalnızca kritik checkpoint'lerde)

---

# 0. ÇALIŞMA PROTOKOLÜ

Her mikro-adım için sıra değişmez:
1. Önce mevcut durum commit edilir.
2. Yalnızca tek mikro-adım uygulanır.
3. Syntax testi yapılır.
4. Uygulama açılır.
5. İlgili davranış test edilir.
6. Console kontrol edilir.
7. V2/V3 farkı kontrol edilir.
8. PASS ise commit alınır.
9. FAIL ise sonraki adıma geçilmez.

Gemini aynı prompt içinde bir sonraki adıma kendiliğinden geçemez.

---

# FOOTPATH A — BAŞLANGIÇ KİLİDİ

## A0.1 — Baseline commit
Amaç: V3'ün ameliyat öncesi halini mühürlemek.

Yap:
- Git status kontrol et.
- Mevcut V3'ü commit et.
- Commit: `baseline: pre-modularization v3 snapshot`

Yapma:
- Kod düzeltme.
- Dosya taşıma.
- İsim değiştirme.

PASS:
- Working tree temiz.
- Uygulama açılıyor.
- İOVY çalışıyor.

## A0.2 — Referans belgelerini proje içine koy
`/docs/` altında forensic, Anayasa V1.1 ve Runbook tutulur.

PASS: Kod davranışı değişmedi.

---

# FOOTPATH B — BOŞ İSKELET

## B1.1 — Ana klasörler
`/js/core/`, `/js/shared/`, `/js/data/`, `/js/modules/ilkokuma/`, `/js/modules/bulmaca/`

Yapma:
- boş gelecekteki ders klasörleri açma
- script.js'den kod taşıma

## B1.2 — Core placeholder dosyaları
`registry.js`, `state.js`, `orchestration.js`, `layout-engine.js`, `list-manager.js`, `menu-manager.js`, `library-manager.js`

## B1.3 — Shared/module placeholder dosyaları
`text-utils.js`, `svg-utils.js`, `dom-utils.js`, `random-utils.js`, `curriculum.js`, `modules/ilkokuma/index.js`, `modules/bulmaca/index.js`

Her adım sonrası uygulama aynen açılmalı.

---

# FOOTPATH C — REGISTRY

## C2.1 — Registry deposu
Minimum yetenek: register, get, has, list.

Yapma: DOM, kagitIcerigi, render, soru-tipi özel kod.

## C2.2 — Registry sözleşmesi
Kabul edilen alanlar:
`id, name, createDefault, buildEditor, collectData, renderPreview, renderA4, validate`

Hepsi zorunlu değil.

## C2.3 — Legacy script zincirine ekle
Klasik `<script src>` kullan. ES Module yok.

PASS: file:// altında açılıyor, Registry erişilebilir, console temiz.

---

# FOOTPATH D — DOCUMENT ITEM UYUMLULUĞU

## D3.1 — Legacy kind resolver
`item.kind` varsa onu kullan; `item.tip === "zengin-metin"` ise `content`, aksi halde `question`.

Eski item'ları topluca yeniden yazma.

## D3.2 — Yeni item'larda kind
Soru: `kind:"question"`; rich text: `kind:"content"`.

PASS: eski+yeni item birlikte çalışıyor.

---

# FOOTPATH E — İLK SAF TAŞIMA

## E4.1 — `turkceTemizle` iki tanımı doğrula
Davranış farkı var mı kontrol et. Henüz silme.

## E4.2 — Canonical `turkceTemizle`
`shared/text-utils.js` içine al; global erişimi koru.

## E4.3 — Duplicate tanımı kaldır
PASS: tek tanım, aynı davranış.

---

# FOOTPATH F — STATE ÇEKİRDEĞİ

## F5.1 — Document state
Taşı: `kagitIcerigi`, `kagitGecmisi`, `kagitGelecegi`.

## F5.2 — Undo/redo
Taşı: `durumuKaydet`, `geriAl`, `ileriAl`.

Test: ekle→undo→redo→sil→undo.

## F5.3 — Draft state CHECKPOINT
`aktifGridMetinleri`, `aktifGridResimleri`, `aktifBaslangicResimleri`, `aktifBitisResimleri` vb. bu aşamada yerinde kalmalı.

---

# FOOTPATH G — MENU SHELL

## G6.1 `sinifDegisti`
## G6.2 `dersDegisti`
## G6.3 `uniteDegisti`
Generic kısımlar `menu-manager.js` içine.

## G6.4 `konuDegisti` için DUR
Tam taşıma yok; `labirent-ayarlari`, `matematik-ayarlari` coupling'i önce doğrulanacak.

---

# FOOTPATH H — LIBRARY SHELL

## H7.1 modal aç/kapat
## H7.2 arama/vitrin
## H7.3 `seciliGorseliKullan`
Taşınabilir ama mevcut draft-global coupling korunacak. Draft state yeniden tasarlanmayacak.

---

# FOOTPATH I — LIST MANAGER SHELL

## I8.1 `soruyuSil`
## I8.2 `soruyuCogalt`
## I8.3 drag/drop fonksiyonları
## I8.4 `listeyeEkle` generic shell

KRİTİK YASAK: `islem-turu`, `labirent-*`, `grid-*`, harf özel alanları gibi DOM okumalarını List Manager'a taşıma.

---

# FOOTPATH J — İOVY REGISTRY BOOTSTRAP

## J9.1 Stable type mapping
Mevcut konu/soruTipi kombinasyonlarını stable ID'lere eşle.

## J9.2 İlk kayıt
`ilkokuma.harf_yazimi` sadece id+name ile kayıt olsun; davranış henüz legacy'den gelsin.

---

# FOOTPATH K — PİLOT: HARF YAZIMI

## K10.1 createDefault
Sadece default data modüle.

## K10.2 buildEditor
Sadece Harf Yazımı editor branch'i modüle.

## K10.3 collectData
Harf Yazımı özel DOM/draft okumaları modüle.

## K10.4 renderPreview
Sadece pilot preview branch'i modüle. V2'de yoksa `akilliRotalariCiz` ekleme.

## K10.5 renderA4
Sadece pilot A4 branch'i modüle. Full `kagidiCiz()` davranışı korunur.

## K10.6 Pilot kapı testi
- createDefault modülde
- buildEditor modülde
- collectData modülde
- renderPreview modülde
- renderA4 modülde
- Core'a yeni özel if yok
- listeyeEkle Harf Yazımı DOM ID bilmiyor
- undo/redo, drag/drop, print, preview, A4 PASS

PASS değilse ikinci tipe geçme.

---

# FOOTPATH L — İOVY SERİ MİGRASYONU

Her tip: registry → createDefault → buildEditor → collectData → renderPreview → renderA4 → golden test → commit.

Önerilen sıra:
1. Parmakla Takip
2. Dış Hat Boyama
3. Kılavuz Çizgiye Serbest Yazı
4. Ses Barındıranı İşaretleme
5. Ses Barındıranı Boyama
6. Sesin Konumunu Bulma
7. Hece/Kelime
8. Okuma-anlama
9. diğer İOVY dalları

Her tip ayrı commit.

---

# FOOTPATH M — DEV ORKESTRATÖRLERİ KÜÇÜLT

## M12.1 `nesneYuklemeAlaniniGuncelle`
Migrate edilmiş tiplerde Registry `buildEditor` çağrısı.

## M12.2 `canliOnizlemeyiCiz`
Migrate edilmiş tiplerde `renderPreview`.

## M12.3 `kagidiCiz`
Migrate edilmiş tiplerde `renderA4`; full-page orchestration korunur.

---

# FOOTPATH N — LAYOUT ENGINE

Genel A4 ölçüleri, sütun yerleşimi, item spacing/yükseklik hesapları taşınır.
Soru-tipine özgü renderer taşınmaz.

---

# FOOTPATH O — CONTENT ITEM / RICH TEXT

`kind:"content"`, `type:"rich_text"`.
Question Registry'ye zorla kaydetme.
Editor/render aynı davranışla ayrı content aracı olur.

PASS: her ders bağlamında erişilir, soru tipine bağlı değil, edit/render/print aynı.

---

# FOOTPATH P — İOVY TAM KABUL

Golden suite: Harf Yazımı, Parmakla Takip, Dış Hat Boyama, Ses tipleri, Serbest Yazı, Hece/Kelime, Okuma-anlama, gridler, kütüphane, rich text, undo/redo, drag/drop, çoğalt, sil, print.

PASS olmadan Bulmaca yok.

---

# FOOTPATH Q — BULMACA

Motorları yeniden yazma.
Her tip aynı registry/editor/collectData/preview/A4/test döngüsüyle taşınır.

Sıra: Çengel, Kelime Avı, Kriptogram, Harf Karıştırma, Labirent Kelime, Kelime Zinciri, Mini Sudoku.

---

# FOOTPATH R — MATEMATİK: MİMARİ SINAV

İlk yeni matematik tipi eklenirken Core/orchestration/list-manager ve legacy özel branch'lerin değişmesi gerekmemeli.
Gerekiyorsa DUR: mimari sınır yanlış.

---

# FOOTPATH S — LEGACY TEMİZLİK

Yalnızca Registry karşılığı doğrulanmış eski branch'leri kaldır. Her temizlik sonrası golden test.

---

# FOOTPATH T — SONRAKİ TEKNİK BORÇLAR

Temel migrasyondan SONRA:
1. özel panel coupling
2. draft state cleanup
3. event refactor
4. partial render/performance
5. CSS/HTML cleanup
6. ES Modules değerlendirmesi

---

# CHECKPOINT'LER

CHECKPOINT 1: Registry çalışıyor.  
CHECKPOINT 2: State ayrıldı, undo/redo sağlam.  
CHECKPOINT 3: Harf Yazımı tam modülde. **Claude için ideal ilk dış denetim.**  
CHECKPOINT 4: İOVY tamamen migrate. **Claude için ikinci dış denetim.**  
CHECKPOINT 5: Matematik Core'a dokunmadan eklendi.

---

# İLK UYGULAMA EMRİ

İlk Gemini turu yalnızca:
`A0.1 + A0.2 + B1.1`

İkinci tur:
`B1.2 + B1.3`

Üçüncü tur:
`C2.1`

Sonra mikro-adım mikro-adım devam.

---

# ALTIN KURAL

Bir mikro-adım PASS olmadan sıradakine geçme.  
Bir soru tipi tamamen migrate olmadan ikincisine başlama.  
Core'a soru-tipine özel bilgi sızıyorsa DUR.  
V2 davranışı değişiyorsa DUR.

**OKUL ZİLİ V3 — MIGRATION RUNBOOK V1.1 / FOOTPATH**
