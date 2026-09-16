# OKUL ZİLİ — MODÜLER MİMARİ ANAYASASI V1.1

**Durum:** Mimari denetim sonrası güncellenmiş sürüm  
**Temel:** Anayasa V1.0 + 101/101 forensic envanter + Claude mimari stres testi + ürün sahibi kararı  
**Amaç:** Okul Zili V3 migrasyonunda mimari sınırları, geçiş kurallarını ve bitmiş sayılma kriterlerini sabitlemek.

---

## 1. ANA İLKE

Okul Zili V3, çalışan V2 davranışını koruyarak modüler hale getirilecektir.

Migrasyonun amacı ilk aşamada:
- yeni özellik eklemek,
- mevcut davranışı değiştirmek,
- performans optimizasyonu yapmak,
- event sistemini yeniden kurmak,
- arayüzü temizlemek,
- kod stilini topluca değiştirmek

değildir.

İlk hedef: **çalışanı bozmadan sorumlulukları doğru sınırlara ayırmak.**

---

## 2. STRANGLER FIG KURALI

Migrasyon tek seferlik yeniden yazım olmayacaktır.

Eski ve yeni yapı geçici olarak yan yana yaşayabilir.

Her adımda:
1. tek bir sorumluluk taşınır,
2. mevcut davranış korunur,
3. V2/V3 karşılaştırması yapılır,
4. test geçmeden sonraki adıma geçilmez.

Aynı anda birden fazla mimari/refactor değişikliği yapılmaz.

---

## 3. CORE / MODULE / REGISTRY AYRIMI

Sistem üç ana sorumluluk alanına ayrılır:

### Core
Sistemin genel işleyişini bilir.

### Module
Belirli ders veya soru tipine ait davranışı bilir.

### Registry
Core ile modüller arasındaki kayıt ve yönlendirme sözleşmesidir.

Core hiçbir zaman belirli bir soru tipinin nasıl çalıştığını öğrenmemelidir.

---

## 4. CORE NEYİ BİLİR?

Core şunları bilir:
- state yönetimi
- registry
- belge/öğe listesi
- undo/redo
- A4/sayfa yapısı
- layout
- ortak DOM akışı
- ortak dosya/görsel altyapısı
- genel menü ve belge operasyonları

---

## 5. CORE NEYİ BİLMEZ?

Core şunları bilmemelidir:
- Harf Yazımı nasıl çizilir?
- Sudoku nasıl oluşturulur?
- Anagram nasıl çalışır?
- 5N1K nasıl render edilir?
- toplama/çıkarma sorusu nasıl üretilir?
- belirli bir dersin özel veri şekli nedir?
- belirli bir soru tipinin editöründe hangi özel DOM alanları vardır?

Yeni soru tipi eklemek için Core'a yeni bir:

```js
if (soruTipi === "...")
```

eklenmesi yasaktır.

---

## 6. STABİL SİSTEM KİMLİĞİ

Görünen kullanıcı metinleri sistem kimliği olarak kullanılmaz.

Yanlış:
```text
"Harf Yazımı"
"Mini Sudoku (4x4)"
```

Doğru:
```text
ilkokuma.harf_yazimi
bulmaca.sudoku_4x4
matematik.gorselli_toplama
```

Görünen isim değişebilir; sistem kimliği değişmemelidir.

---

## 7. BELGE MODELİ: DOCUMENT ITEM

### V1.1 DEĞİŞİKLİĞİ

`kagitIcerigi` yalnızca soru taşıyan bir dizi olarak düşünülmeyecektir.

Doğru kavramsal model:

```text
kagitIcerigi = DocumentItem[]
```

Bir belge öğesi iki ana aileden biri olabilir:

```text
DocumentItem
├── QuestionItem
└── ContentItem
```

---

## 8. QUESTION ITEM MODELİ

```js
{
  id: "q_8f31a",
  kind: "question",
  type: "ilkokuma.harf_yazimi",
  version: 1,
  context: {
    sinif: "1. SINIF",
    ders: "ilkokuma",
    unite: "Sesler ve Harfler",
    konu: "A Harfi"
  },
  data: {
    // soru tipine özel veri
  },
  layout: {
    // konum, ölçek ve genel yerleşim
  }
}
```

---

## 9. CONTENT ITEM MODELİ

### V1.1 YENİ KARAR

Soru olmayan ama çalışma kağıdına eklenebilen içerikler `ContentItem` olarak değerlendirilir.

```js
{
  id: "c_42af1",
  kind: "content",
  type: "rich_text",
  version: 1,
  data: {
    // metin ve biçim bilgileri
  },
  layout: {
    // konum/ebat/yerleşim
  }
}
```

---

## 10. ZENGİN METİN KARARI

### V1.1 KESİN KARAR

**Zengin Metin bir soru tipi değildir.**

Zengin Metin:
- öğretmenin çalışma kağıdına serbest içerik ekleyebilmesi için kullanılan genel bir araçtır,
- herhangi bir ders veya soru tipine bağlı değildir,
- her ders bağlamında erişilebilir olmalıdır,
- öğretmenin başka yerde hazırladığı metni çalışma kağıdına doğrudan ekleyebilmesini sağlar.

Bu nedenle:

```text
ilkokuma.zengin_metin
turkce.zengin_metin
```

gibi soru tipi kimlikleri oluşturulmayacaktır.

Zengin Metin bir:

```text
ContentItem / genel belge aracı
```

olarak ele alınacaktır.

---

## 11. REGISTRY SÖZLEŞMESİ

V1.0 Registry sözleşmesi V1.1'de genişletilmiştir.

```js
registerQuestionType({
  id,
  name,
  createDefault,
  buildEditor,
  collectData,
  renderPreview,
  renderA4,
  validate
});
```

Her alanın her soru tipi tarafından zorunlu olarak uygulanması gerekmez; gerekli olmayan alanlar opsiyonel olabilir.

---

## 12. `collectData` — V1.1'İN KRİTİK EKLEMESİ

V1.0'da eksik olan sorumluluk:

> Editörde kullanıcı tarafından girilmiş/verilmiş veriyi kim toplayacak?

Bu görev Core'a bırakılamaz.

Örneğin Core şunları bilmemelidir:

```text
islem-turu
min-sayi
max-sayi
labirent-satir
labirent-sutun
grid-col-input
grid-row-input
zengin-*
harfBaslangic
```

Bu nedenle soru tipine özgü veri toplama işi:

```js
collectData(...)
```

ile ilgili modüle bırakılır.

```text
buildEditor → editörü kurar
collectData → editördeki soru-tipine özgü veriyi toplar
```

Yeni soru tipi eklenirken `listeyeEkle` içine yeni özel DOM okuma kodu eklenmesi yasaktır.

---

## 13. RENDERER VE LAYOUT AYRIMI

```text
Document Item
      ↓
Validate
      ↓
Item Renderer
      ↓
Render Result
      ↓
Layout Engine
      ↓
A4 Page Renderer
```

Renderer öğenin ne çizdiğini bilir.  
Layout öğenin sayfada nereye ve nasıl yerleşeceğini bilir.

---

## 14. STATE AYRIMI

State kavramsal olarak üç gruba ayrılır:

### App State
Uygulamanın genel çalışma durumu.

### Document State
Belgedeki kalıcı öğeler.

### UI / Editor State
Henüz belgeye eklenmemiş geçici editör verileri.

Örnek:
```text
aktifGridMetinleri
aktifGridResimleri
aktifBaslangicResimleri
aktifBitisResimleri
```

---

## 15. GEÇİCİ GLOBAL STATE KURALI

İlk migrasyon sırasında tüm global state'i bir anda ortadan kaldırmak zorunlu değildir.

Geçici editor/draft state'leri ilk aşamada mevcut biçimde kalabilir.

Bunların temizlenmesi ayrı migration adımıdır.

---

## 16. BİLİNEN COUPLING: KÜTÜPHANE ↔ EDITOR DRAFT STATE

### V1.1 FORENSIC NOTU

`seciliGorseliKullan` gibi ortak kütüphane fonksiyonları şu anda editor state'lerine doğrudan yazabilmektedir:

```text
aktifBaslangicResimleri
aktifBaslangicResmiTek
aktifBitisResimleri
aktifBitisResmiTek
aktifGridResimleri
```

Bu bağlantı **bilinen ve geçici olarak kabul edilmiş coupling** olarak kayda alınmıştır.

İlk migrasyonda sırf mimari saflık uğruna zorla çözülmeyecektir.

---

## 17. DEV ORKESTRATÖRLERİN KURALI

Şu fonksiyonlar tek parça halinde bir hedef dosyaya taşınamaz:

```text
kagidiCiz
canliOnizlemeyiCiz
nesneYuklemeAlaniniGuncelle
listeyeEkle
evrenselKontrolDegisti
```

İçlerindeki sorumluluklar ayrılır.

---

## 18. `kagidiCiz`

```text
kagidiCiz
├── genel A4 orkestrasyonu   → Core
├── sayfa hazırlığı          → Core
├── sütun/yerleşim           → Layout
├── item/type çözümleme      → Registry
└── tipe özel çizim          → ilgili Module / Content renderer
```

`kagidiCiz` silinmez; küçük bir orkestratöre dönüşür.

---

## 19. TAM YENİDEN ÇİZİM DAVRANIŞI KORUNACAK

### V1.1 YENİ GÜVENLİK KURALI

Mevcut V2 davranışında birçok ayar değişikliği doğrudan:

```js
kagidiCiz();
```

çağırır ve tüm sayfa yeniden çizilir.

Migrasyon sırasında:
- sadece değişen soruyu render etme,
- incremental render,
- diff render,
- performans optimizasyonu

yapılmayacaktır.

Önce mevcut full-render davranışı korunur.

---

## 20. `canliOnizlemeyiCiz`

```text
canliOnizlemeyiCiz
├── preview shell / container → Core
├── item/type çözümleme       → Registry
└── tipe özel preview         → Module
```

---

## 21. PREVIEW ↔ A4 DAVRANIŞ FARKLARI

### V1.1 FORENSIC NOTU

Forensic denetimde `akilliRotalariCiz` davranışının A4 zincirinde bulunduğu, canlı preview zincirinde aynı biçimde bulunmadığı görülmüştür.

Bu nedenle Harf Yazımı gibi alanlarda mevcut:

```text
Preview ≠ A4
```

davranışı migration sırasında otomatik olarak "bug fix" sayılıp sessizce düzeltilmeyecektir.

Önce V2 davranışı korunur. Düzeltme kararı ayrı ürün geliştirmesidir.

---

## 22. `nesneYuklemeAlaniniGuncelle`

```text
nesneYuklemeAlaniniGuncelle
├── ortak editor alanı / dispatcher → Core
└── tipe özel editor                → Module.buildEditor
```

---

## 23. `listeyeEkle`

Hedef ayrım:

```text
generic item/list işlemleri → Core/List Manager
default data                → Module.createDefault
editor data toplama         → Module.collectData
```

---

## 24. LIST MANAGER MIGRATION SINIRI

### V1.1 YENİ KURAL

List Manager ilk çıkarılırken yalnızca gerçekten jenerik sorumluluklar taşınır.

Örnek generic alanlar:

```text
id
kind
type
sinif
ders
unite
konu
mufredatSirasi
kagitIcerigi'ne ekleme
durumuKaydet
```

Soru-tipine özel DOM okuma kodları, ilgili modül migrate edilmeden List Manager içine taşınmayacaktır.

Örnek:

```text
islem-turu
min-sayi
max-sayi
labirent-*
grid-*
harfBaslangic
```

---

## 25. `evrenselKontrolDegisti`

Genel X/Y, ölçek ve layout Core/Layout'ta olabilir.

Ancak:

```text
harfX
harfY
fontBoyutu
o1X
o1Y
o2X
...
```

gibi soru-tipine özgü mapping'ler Core'un kalıcı bilgisi olamaz.

---

## 26. MENU MANAGER VE ÖZEL PANEL COUPLING

### V1.1 AÇIK FORENSIC NOTU

`konuDegisti` / `soruTipiDegisti` içinde:

```text
labirent-ayarlari
matematik-ayarlari
```

gibi özel paneller yönetilmektedir.

Bu panellerin `index.html` içindeki gerçek yaşam döngüsü çapraz taramayla kesinleştirilecektir.

Şu aşamada Registry'ye `extraPanel` benzeri yeni bir alan eklenmeyecektir.

---

## 27. QUESTION TYPE / KONU AYRIMI

Mevcut sistemde:

```text
konu
soruTipi
konu + soruTipi
```

üç farklı biçimde soru kimliği oluşabilmektedir.

Yeni mimaride Registry için tek güvenilir anahtar:

```text
stable type id
```

olmalıdır.

---

## 28. BULMACA MOTORLARI

Mevcut motorların iç algoritmaları sırf modülerleşme uğruna yeniden yazılmayacaktır.

Registry/modül katmanına bağlanmaları yeterlidir.

---

## 29. SHARED UTILITIES

Gerçekten genel yardımcılar `shared/` altında toplanabilir.

Örnek:

```text
text-utils.js
svg-utils.js
dom-utils.js
random-utils.js
```

Bir fonksiyonun küçük olması tek başına `shared` olması için yeterli değildir.

---

## 30. `turkceTemizle` DUPLICATE

Forensic envanter:

```text
turkceTemizle → 2 tanım
```

Migration sırasında uygun shared utility çıkarımında tek uygulamaya indirilebilir.

V2 kaynak dosyasında önceden temizlik amacıyla değiştirilmez.

---

## 31. ES MODULES KURALI

Mevcut `file://` kullanımına zarar vermemek için ES Modules ilk migrasyonda zorunlu değildir.

İlk aşamada klasik `<script>` yükleme düzeni ve kontrollü global namespace kullanılabilir.

---

## 32. EVENT SİSTEMİ KURALI

Inline `onclick`, `onchange`, `oninput`, drag/drop event'leri ilk modülerleşme sırasında topluca kaldırılmayacaktır.

Event refactor ayrı iştir.

---

## 33. HTML / CSS TEMİZLİĞİ

İlk migrasyonda:
- inline style temizliği,
- `innerHTML` sistemini topluca değiştirme,
- isimlendirme dilini standardize etme,
- CSS mimarisini değiştirme,
- UI tasarımını yenileme

yapılmayacaktır.

---

## 34. OVERENGINEERING YASAĞI

Gereksiz Factory/Service/Repository/Controller zincirleri kurulmayacaktır.

Amaç mimari gösteri değil, sürdürülebilirliktir.

---

## 35. KLASÖR YAPISI

```text
/js
├── core/
│   ├── state.js
│   ├── registry.js
│   ├── orchestration.js
│   ├── layout-engine.js
│   ├── list-manager.js
│   ├── menu-manager.js
│   └── library-manager.js
├── shared/
│   ├── text-utils.js
│   ├── svg-utils.js
│   ├── dom-utils.js
│   └── random-utils.js
├── data/
│   └── curriculum.js
└── modules/
    ├── ilkokuma/
    ├── bulmaca/
    ├── matematik/
    ├── turkce/
    ├── hayat-bilgisi/
    ├── fen/
    └── sosyal-bilgiler/
```

Kullanılmayan bütün ders klasörleri baştan oluşturulmak zorunda değildir.

---

## 36. CONTENT TOOL KONUMU

`rich_text` gibi genel belge araçları bir ders modülüne bağlanmaz.

```text
rich_text ≠ question type
rich_text ≠ ders modülü
rich_text = genel belge/content aracı
```

Kesin fiziksel dosya konumu Migration Runbook sırasında seçilebilir.

---

## 37. İLK MİGRASYON HEDEFİ: İOVY

```text
V2 İOVY
   ↓
V3 migrate edilmiş İOVY
   ↓
davranış/görsel karşılaştırması
   ↓
aynı mı?
```

İOVY, yeni mimarinin ilk gerçek kanıtıdır.

---

## 38. GOLDEN MASTER

V2 stabil referanstır.

V3 üzerindeki her kritik migration adımı V2 ile karşılaştırılır.

Özellikle:
- A4 görünümü
- soru sırası
- drag/drop
- undo/redo
- canlı preview
- Harf Yazımı
- kılavuz çizgiler
- gridler
- görsel kütüphanesi
- bulmacalar
- zengin metin
- sayfa şablonu

kontrol edilir.

---

## 39. PREVIEW/A4 ÖZEL GOLDEN TESTİ

Harf Yazımı için ayrıca:

```text
V2 preview'da ok rotası var mı/yok mu?
V2 A4'te ok rotası var mı/yok mu?
V3 aynı davranışı koruyor mu?
```

kontrol edilir.

---

## 40. MIGRATION SIRASI

### Faz 0
Forensic envanter ve doğrulama.  
**Durum: tamamlandı.**

### Faz 1
Mimari sözleşmeleri kilitle:
- DocumentItem
- QuestionItem
- ContentItem
- Registry
- Renderer
- Layout
- State
- `collectData`

### Faz 2
Fiziksel klasör/dosya iskeleti.

### Faz 3
Registry + temel Core altyapısı.

### Faz 4
Gerçek shared utility'leri çıkar.

### Faz 5
Document State / generic list altyapısı.

### Faz 6
İOVY question type'larını tek tek migrate et.

### Faz 7
İOVY preview dispatcher.

### Faz 8
İOVY A4 dispatcher.

### Faz 9
Layout engine.

### Faz 10
Genel content araçları (`rich_text` dahil).

### Faz 11
Bulmaca modülü.

### Faz 12
Matematik — ilk gerçek yeni ders/mimari testi.

---

## 41. MIGRATION SIRASINDA DAVRANIŞ DEĞİŞTİRME YASAĞI

Migration sırasında fark edilen mevcut kusurlar ayrı backlog maddesi olur.

"Fırsat bulmuşken bunu da düzeltelim" yaklaşımı kabul edilmez.

---

## 42. V2 / V3 AYRIMI

V2:
- stabil üretim sürümüdür,
- Hüseyin ve Ünal tarafından kullanılabilir,
- ihtiyaç halinde yeni soru tipi/özellik eklemeleri yapılabilir,
- bu eklemelerin seceresi tutulur.

V3:
- V2'den fiziksel olarak ayrıdır,
- Git/version-control altında geliştirilir,
- modularization/migration burada yapılır,
- V2'ye sonradan eklenen özellikler temel migration sonrası parity backlog üzerinden V3'e alınır.

---

## 43. YENİ SORU TİPİ TESTİ

Yeni soru tipi eklemek için:

```text
Core'a yeni if eklenmemeli.
kagidiCiz'e yeni özel branch eklenmemeli.
nesneYuklemeAlaniniGuncelle'ye yeni özel branch eklenmemeli.
listeyeEkle'ye özel DOM okuma eklenmemeli.
```

İdeal işlem:

```text
module/question file
+
registerQuestionType(...)
```

---

## 44. YENİ DERS TESTİ

Yeni ders eklemek:

```text
modules/yeni-ders/
```

açmakla mümkün olmalıdır.

Core'a:

```js
if (ders === "yeni-ders")
```

eklemek gerekirse mimari hedef başarısız sayılır.

---

## 45. MODÜL SİLME / DEVRE DIŞI BIRAKMA TESTİ

Bir soru tipi Registry'den kaldırıldığında Core çalışmaya devam etmelidir.

---

## 46. BİTTİ SAYILMA KRİTERLERİ

### TEST 1 — Yeni soru tipi
Core değişmeden eklenebiliyor mu?

### TEST 2 — Yeni ders
Core'a ders özel `if` eklemeden eklenebiliyor mu?

### TEST 3 — Modül izolasyonu
Bir soru tipi devre dışı bırakıldığında Core çalışıyor mu?

### TEST 4 — V2 eşdeğerliği
Migrate edilmiş İOVY davranışı V2 referansıyla eşleşiyor mu?

### TEST 5 — Registry
Core, soru tipinin implementasyonunu bilmiyor mu?

### TEST 6 — Editor data
Yeni soru tipi için `listeyeEkle` veya generic Core fonksiyonlarına özel DOM ID eklemek gerekmiyor mu?

### TEST 7 — Document Item
`rich_text` gibi soru olmayan içerikler sahte soru tipi yapılmadan belgeye eklenebiliyor mu?

---

## 47. GEMINI UYGULAMA KURALI

Gemini mimariyi yeniden tasarlayan taraf değildir.

Mimari kilitlendikten sonra:
- verilen adımı uygular,
- yalnızca istenen dosyalara dokunur,
- ek refactor yapmaz,
- mevcut davranışı korur,
- test sonucunu bildirir.

---

## 48. AI ROLLERİ

### GPT — Denetçi / Koordinatör
Forensic doğrulama, runbook ve regression kontrolü.

### Claude — Mimari denetçi
Anayasa'yı gerçek kodla stres test eder.

### Gemini — Usta / Uygulayıcı
Kilitli plana göre kod değişikliklerini gerçekleştirir.

---

## 49. FORENSIC REFERANS

```text
script.js
Fonksiyon tanımı: 101
Benzersiz fonksiyon adı: 100
Duplicate: turkceTemizle × 2
Syntax: geçerli
```

Kaynak değişmedikçe bu forensic veri yeniden ürettirilmez.

---

## 50. AÇIK KARARLAR / BİLİNEN BEKLEYEN KONULAR

V1.1'i kilitlemeye engel olmayan ancak Runbook sırasında doğrulanacak konular:

1. `labirent-ayarlari` ve `matematik-ayarlari` HTML panellerinin tam yaşam döngüsü.
2. Library → editor draft state coupling'inin ileride hangi aşamada temizleneceği.
3. Preview/A4 davranış farklarının migration sonrası ürün kararıyla birleştirilip birleştirilmeyeceği.
4. Kısmi render/performance optimizasyonunun ayrı teknik faz olarak ele alınıp alınmayacağı.
5. `rich_text` için kesin fiziksel dosya/dispatch konumunun Runbook sırasında belirlenmesi.

---

# V1.1 DEĞİŞİKLİK KAYDI

1. `kagitIcerigi` → `DocumentItem[]` olarak netleştirildi.
2. `QuestionItem` / `ContentItem` ayrımı eklendi.
3. Zengin Metin'in soru tipi olmadığı kesinleştirildi.
4. Registry'ye `collectData` eklendi.
5. `listeyeEkle` soru-tipine özel DOM okuma sorumluluğunun modüllere taşınacağı netleştirildi.
6. List Manager'ın ilk migrasyon kapsamı generic alanlarla sınırlandı.
7. Full-page render davranışının migration boyunca korunacağı kilitlendi.
8. Preview/A4 farklarının sessizce düzeltilmeyeceği eklendi.
9. Library ↔ editor draft-state coupling'i bilinen coupling olarak kayda alındı.
10. `labirent-ayarlari` / `matematik-ayarlari` panel coupling'i açık doğrulama maddesi yapıldı.
11. V2 stabil üretim / V3 migration ayrımı belgeye işlendi.
12. V2'ye sonradan eklenen özelliklerin parity backlog/seceresi ile V3'e taşınması kuralı eklendi.
13. Definition of Done'a `collectData` ve ContentItem testleri eklendi.

---

# NİHAİ KURAL

> **Yeni bir ders, yeni bir soru tipi veya yeni bir belge içeriği eklemek için Core'un o şeyin ne olduğunu öğrenmesi gerekmiyorsa; V2 davranışı migration boyunca korunuyorsa; sistem doğru yönde modülerleşmiş demektir.**

---

**OKUL ZİLİ — MODÜLER MİMARİ ANAYASASI V1.1**
