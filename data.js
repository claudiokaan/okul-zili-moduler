// --- 0. EVRENSEL HARF SORU TİPLERİ VE ÖZELLİKLERİ ---
const harfSoruTipleri = {
    "Harf Yazımı": ["Sadece Küçük Harf", "Sadece Büyük Harf", "Büyük ve Küçük Harf Birlikte", "İlk Harf Kılavuz (Gerisi Kesikli)", "İlk Harf Devasa", "Normal Font", "Kesikli Font", "İçi Boş Font", "Hayalet Font", "Kılavuz Çizgi Ekle", "Hayalet Çizgi"],    
    "Sesi Barındıranı İşaretleme": ["Varlıkların Altını Çiz", "Kutucuğu İşaretle"],
    "Sesi Barındıranı Boyama": ["Görseli Boya", "Çerçeveyi Boya"],
    "Sesin Konumunu Bulma": [],
    "Dış Hat Boyama": ["Büyük Harf", "Küçük Harf"],
    "Parmakla Takip Etme": ["Büyük Puntolu Kılavuz Harf"],
    "Gizli Harf Bulma": ["Sadece Küçük Harf", "Sadece Büyük Harf", "Henüz Öğrenilmemiş Harfler Eklensin"],
    "Ses Sayısı Kadar Yazma": ["Kutu Çiz", "Noktalı Çizgi Çiz", "Eşittir (=) Koy"],
    "Okuduğunu Boyama/Tamamlama": ["Görsel Üstte (Varsayılan)", "Görsel Altta", "Görsel Solda", "Görsel Sağda"],
    "Mantıksal İşaretleme": ["Görsel Üstte (Varsayılan)", "Görsel Altta", "Görsel Solda", "Görsel Sağda"]
};

// --- 0.6 SVG ÇİZGİ KÜTÜPHANESİ ---
const cizgiKutuphanesi = {
    "Dalgalı Çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 0,50 Q 30,-10 60,50 T 120,50 T 180,50 T 240,50 T 300,50 T 360,50 T 420,50 T 480,50 T 540,50 T 600,50" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Köşeli-Zigzag Çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 0,75 L 30,-5 L 60,75 L 90,-5 L 120,75 L 150,-5 L 180,75 L 210,-5 L 240,75 L 270,-5 L 300,75 L 330,-5 L 360,75 L 390,-5 L 420,75 L 450,-5 L 480,75 L 510,-5 L 540,75 L 570,-5 L 600,75" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Bir nesneden başlayıp başka bir nesneye doğru rastgele (ama üst üste binmeyen) çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <circle cx="30" cy="40" r="8" fill="none" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 5"/>
            <path d="M 40,40 C 100,-20 150,100 250,40 S 400,0 500,50 S 550,20 570,40" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
            <rect x="575" y="32" width="16" height="16" fill="none" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 5"/>
        </svg>`,

    "Kesikli çizgili-konturlu nesnenin dış hat çigilerinin üzerinden giderek varlığı oluşturma sonra da onu boyama çalışmaları": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 280,45 L 280,70 L 320,70 L 320,45 M 270,45 L 300,15 L 330,45 Z M 150,70 L 150,40 M 130,40 C 130,10 170,10 170,40 Z M 450,40 A 20,20 0 1,1 450,39.9" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0, 6" />
        </svg>`,

    "Labirent Çalışmaları": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 200,10 L 400,10 L 400,70 L 200,70 Z M 240,10 L 240,50 L 360,50 M 280,70 L 280,30 L 320,30" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Dikey Çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 50,10 L 50,70 M 150,10 L 150,70 M 250,10 L 250,70 M 350,10 L 350,70 M 450,10 L 450,70 M 550,10 L 550,70" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Yatay Çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="600" y2="40" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
        </svg>`,

    // data.js içerisindeki cizgiKutuphanesi kısmını şu şekilde düzelt:
"Kavisli/Dalga Çizgiler": `
    <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
        <path d="M 0,50 Q 30,-10 60,50 T 120,50 T 180,50 T 240,50 T 300,50 T 360,50 T 420,50 T 480,50 T 540,50 T 600,50" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
    </svg>`,

    "Satıra aralığında yatay, dikey, çapraz (sağa yatık ve sola yatık - / \\ ) çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 30,10 L 30,70 M 80,40 L 140,40 M 180,70 L 220,10 M 280,10 L 320,70 M 370,10 L 370,70 M 420,40 L 480,40 M 520,70 L 560,10" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Satır aralığında dağ şekilli çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 10,70 L 30,20 L 50,20 L 70,70 L 90,70 L 110,20 L 130,20 L 150,70 L 170,70 L 190,20 L 210,20 L 230,70 L 250,70 L 270,20 L 290,20 L 310,70 L 330,70 L 350,20 L 370,20 L 390,70 L 410,70 L 430,20 L 450,20 L 470,70 L 490,70 L 510,20 L 530,20 L 550,70" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Satır aralığında sola/sağa bakan ok ucu şekilli çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 20,20 L 50,45 L 20,70 M 80,20 L 110,45 L 80,70 M 140,20 L 170,45 L 140,70 M 250,20 L 220,45 L 250,70 M 310,20 L 280,45 L 310,70 M 370,20 L 340,45 L 370,70 M 450,20 L 480,45 L 450,70 M 550,20 L 520,45 L 550,70" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Satır aralığında büyük O, büyük C and büyük ters C şekilli çizgiler": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 60,45 A 25,25 0 1,1 60,44.9 M 150,20 A 25,25 0 0,0 150,70 M 230,70 A 25,25 0 0,0 230,20 M 330,45 A 25,25 0 1,1 330,44.9 M 420,20 A 25,25 0 0,0 420,70 M 500,70 A 25,25 0 0,0 500,20" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Satır aralığında büyük U, büyük ters U, büyük S, büyük J çalışmaları": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 40,20 L 40,55 A 15,15 0 0,0 70,55 L 70,20 M 130,70 L 130,35 A 15,15 0 0,1 160,35 L 160,70 M 230,25 C 200,25 200,45 230,45 C 260,45 260,70 230,70 M 310,20 L 340,20 M 325,20 L 325,60 A 10,10 0 0,1 305,60 M 410,20 L 410,55 A 15,15 0 0,0 440,55 L 440,20 M 500,25 C 470,25 470,45 500,45 C 530,45 530,70 500,70" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
        </svg>`,

    "Birbiriyle grift olarak hazırlanmış çalışmalar": `
        <svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none">
            <path d="M 20,40 C 40,-20 80,100 100,40 C 120,-20 160,100 180,40 C 200,-20 240,100 260,40 C 280,-20 320,100 340,40 C 360,-20 400,100 420,40 C 440,-20 480,100 500,40 C 520,-20 560,100 580,40" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" />
        </svg>`
};

// --- 0.6.1 SVG NOKTALI NESNE KÜTÜPHANESİ ---
const nesneSVGleri = {
    "Şemsiye": `<path d="M 10,50 C 10,10 90,10 90,50 Z M 50,50 L 50,85 A 5,5 0 0,0 60,80 M 30,50 C 30,30 70,30 70,50" />`,
    "Elma": `<path d="M 50,25 C 10,10 5,60 50,90 C 95,60 90,10 50,25 Z M 50,25 Q 60,5 70,10 M 60,15 A 10,10 0 0,1 75,20" />`,
    "Ev": `<path d="M 20,50 L 50,15 L 80,50 L 80,90 L 20,90 Z M 40,90 L 40,60 L 60,60 L 60,90 M 25,45 L 25,20 L 35,20 L 35,35 M 65,40 L 75,40 L 75,50 L 65,50 Z" />`,
    "Bulut": `<path d="M 30,65 A 20,20 0 0,1 30,25 A 25,25 0 0,1 70,25 A 20,20 0 0,1 70,65 Z" />`,
    "Yıldız": `<path d="M 50,10 L 62,35 L 90,39 L 70,58 L 75,85 L 50,72 L 25,85 L 30,58 L 10,39 L 38,35 Z" />`,
    "Balık": `<path d="M 20,50 L 10,30 L 10,70 Z M 20,50 Q 50,10 80,50 Q 50,90 20,50 M 65,45 A 2,2 0 1,1 65,44.9 M 40,50 Q 50,60 60,50" />`,
    "Kalp": `<path d="M 50,30 C 50,10 20,10 20,40 C 20,60 50,85 50,90 C 50,85 80,60 80,40 C 80,10 50,10 50,30 Z" />`,
    "Ağaç": `<path d="M 40,90 L 40,60 M 60,90 L 60,60 M 30,60 C 10,60 10,30 30,20 C 30,5 70,5 70,20 C 90,30 90,60 70,60 Z" />`,
    "Çiçek": `<path d="M 50,40 A 10,10 0 1,1 49.9,40 M 50,50 L 50,90 M 40,70 L 50,80 L 60,70 M 50,30 C 30,10 10,30 40,40 M 60,40 C 90,30 70,10 50,30 M 60,50 C 90,70 70,90 50,60 M 40,50 C 10,70 30,90 50,60" />`,
    "Güneş": `<path d="M 50,25 A 25,25 0 1,1 49.9,25 M 50,15 L 50,5 M 50,85 L 50,95 M 85,50 L 95,50 M 15,50 L 5,50 M 25,25 L 15,15 M 75,75 L 85,85 M 75,25 L 85,15 M 25,75 L 15,85" />`,
    "Kelebek": `<path d="M 50,20 L 50,80 M 50,30 C 20,10 10,40 50,50 C 10,60 20,90 50,70 M 50,30 C 80,10 90,40 50,50 C 90,60 80,90 50,70 M 45,15 L 50,20 L 55,15" />`,
    "Araba": `<path d="M 20,60 L 20,40 L 35,40 L 45,25 L 75,25 L 85,40 L 90,40 L 90,60 Z M 35,60 A 10,10 0 1,1 34.9,60 M 75,60 A 10,10 0 1,1 74.9,60 M 40,40 L 45,25 L 60,25 L 60,40 Z M 60,40 L 60,25 L 75,25 L 80,40 Z" />`,
    "Uçurtma": `<path d="M 50,10 L 75,40 L 50,70 L 25,40 Z M 50,10 L 50,70 M 25,40 L 75,40 M 50,70 C 60,80 40,90 50,95" />`
};

// --- 0.6.2 MEB STANDARTLARINDA GERÇEK SPAGETTİ (KÖRDÜĞÜM) KÜTÜPHANESİ ---
const spagettiYollar = {
    "3 Yollu Kördüğüm": [
        { y1: 50, y2: 250, d: "M 0,50 L 30,50 C 200,50 100,250 300,250 C 500,250 400,250 570,250 L 600,250" },
        { y1: 150, y2: 50, d: "M 0,150 L 30,150 C 150,150 250,300 400,150 C 450,50 450,50 570,50 L 600,50" },
        { y1: 250, y2: 150, d: "M 0,250 L 30,250 C 100,250 200,50 350,50 C 450,50 450,150 570,150 L 600,150" }
    ],
    "4 Yollu Kördüğüm": [
        { y1: 40, y2: 180, d: "M 0,40 L 30,40 C 150,40 100,250 250,250 C 400,250 300,180 570,180 L 600,180" },
        { y1: 110, y2: 250, d: "M 0,110 L 30,110 C 200,110 200,40 350,40 C 450,40 450,250 570,250 L 600,250" },
        { y1: 180, y2: 40, d: "M 0,180 L 30,180 C 150,180 250,250 350,250 C 500,250 450,40 570,40 L 600,40" },
        { y1: 250, y2: 110, d: "M 0,250 L 30,250 C 100,250 150,110 300,110 C 450,110 400,110 570,110 L 600,110" }
    ],
    "5 Yollu Kördüğüm": [
        { y1: 30, y2: 210, d: "M 0,30 L 30,30 C 100,30 150,270 250,270 C 350,270 400,210 570,210 L 600,210" },
        { y1: 90, y2: 270, d: "M 0,90 L 30,90 C 200,90 100,30 300,30 C 450,30 450,270 570,270 L 600,270" },
        { y1: 150, y2: 30, d: "M 0,150 L 30,150 C 100,150 200,210 300,210 C 400,210 400,30 570,30 L 600,30" },
        { y1: 210, y2: 90, d: "M 0,210 L 30,210 C 150,210 250,270 350,270 C 500,270 450,90 570,90 L 600,90" },
        { y1: 270, y2: 150, d: "M 0,270 L 30,270 C 100,270 200,90 350,90 C 450,90 450,150 570,150 L 600,150" }
    ]
};

// --- 0.7 EVRENSEL ZITLIK SÖZLÜĞÜ ---
const evrenselZitliklar = [
    ["Sadece Küçük Harf", "Sadece Büyük Harf", "Büyük ve Küçük Harf Birlikte"],
    ["İlk Harf Kılavuz (Gerisi Kesikli)", "İlk Harf Devasa"],
    ["Normal Font", "Kesikli Font", "İçi Boş Font", "Hayalet Font"],
    ["Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi"],
    ["Büyük Boyut", "Küçük Boyut"], 
    ["Yatay Yönde", "Dikey Yönde"],
    ["Sağa Bakan (>)", "Sola Bakan (<)"],
    ["Varlıkların Altını Çiz", "Kutucuğu İşaretle"],
    ["Kutu Çiz", "Noktalı Çizgi Çiz"],
    ["Görsel Üstte (Varsayılan)", "Görsel Altta", "Görsel Solda", "Görsel Sağda"]
];


// --- 1. MÜFREDAT VERİTABANI ---
const mufredat = {
    "1. SINIF": {
        "ilkokuma": {
           "Çizgi Çalışmaları": {
                "Dalgalı Çizgiler": { ozellikler: [], bilgi: "Kavisli, yumuşak hatlı temel el esnetme çalışmaları." },
                "Köşeli-Zigzag Çizgiler": { ozellikler: ["Yatay Yönde", "Dikey Yönde"], bilgi: "Testere dişi gibi keskin uçlu iniş çıkış çizgileri." },
                "Bir nesneden başlayıp başka bir nesneye doğru rastgele (ama üst üste binmeyen) çizgiler": { kisaAd: "Rastgele Çizgiler", ozellikler: [], bilgi: "Arılardan kovana doğru giden serbest çizgiler." },
                "Kesikli çizgili-konturlu nesnenin dış hat çigilerinin üzerinden giderek varlığı oluşturma sonra da onu boyama çalışmaları": { kisaAd: "Kesikli Nesneyle Boyama", ozellikler: ["Şemsiye", "Elma", "Ev", "Bulut", "Yıldız", "Balık", "Kalp", "Ağaç", "Çiçek", "Güneş", "Kelebek", "Araba", "Uçurtma"], bilgi: "Dış hatları kesikli nesneleri tamamlama ve boyama." },
                "Labirent Çalışmaları": { ozellikler: [], bilgi: "Çıkış yolunu bulmayı hedefleyen dikkat ve kalem kontrolü egzersizi." },
                "Karmaşık Yol/Eşleştirme Çalışmaları (Spagetti Labirent)": { 
                    kisaAd: "Spagetti Labirent", 
                    ozellikler: ["3 Yollu Kördüğüm", "4 Yollu Kördüğüm", "5 Yollu Kördüğüm"], 
                    bilgi: "Kıvrımlı, birbiriyle kesişen yolları takip ederek görsel eşleştirme yapma egzersizi." 
                },
               "Dikey Çizgiler": { ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi"], bilgi: "Yukarıdan aşağıya doğru dik inen temel düz çizgiler." },
                
                // mufredat içerisindeki ilgili satır:
                "Kavisli/Dalga Çizgiler": { 
                    kisaAd: "Dalga Çizgileri", 
                    ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi", "Normal Dalga", "Ters Dalga"], 
                    bilgi: "El hareketini yumuşatan okyanus dalgası kavis çalışmaları." 
                },                
                "Dikey, çapraz (sağa yatık ve sola yatık - / \\ ) çizgiler": { kisaAd: "Satır Aralığında Çizgiler", ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi", "Dikey", "Sağa Yatık ( / )", "Sola Yatık ( \\ )"], bilgi: "Defter satır aralıklarına oturan düz ve çapraz çizgiler." },
                
                "Dağ şekilli çizgiler": { kisaAd: "Satır Aralığında Dağ Şekilli Çizgiler", ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi"], bilgi: "Bitişik üçgen dizileri." },
                
                "Sola/sağa bakan ok ucu şekilli çizgiler": { kisaAd: "Satır Aralığında Ok Ucu Şekilli Çizgiler", ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi", "Sağa Bakan (>)", "Sola Bakan (<)"], bilgi: "Keskin kırılma çalışmaları." },
                
                "Büyük O, büyük C ve büyük ters C şekilli çizgiler": { kisaAd: "O, C ve Ters C Çizgileri", ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi", "Büyük Boyut", "Küçük Boyut", "O Şekli", "C Şekli", "Ters C Şekli"], bilgi: "Yuvarlak hatlı harflerin altyapısı." },
                
                "Büyük U, büyük ters U, büyük S, büyük J çalışmaları": { kisaAd: "Satır Aralığında Büyük Harf Çalışmaları", ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi", "Büyük U", "Büyük Ters U", "Büyük S", "Büyük Ters S", "Büyük J", "Omuz Omuza U"], bilgi: "Özel satır arası çalışmalar." },
                
                "Sürekli Yuvarlama ve Helezon Çizgileri": { 
                    kisaAd: "Yuvarlama ve Helezon", 
                    ozellikler: ["Kılavuz Çizgi Ekle", "Normal Çizgi", "Kesikli Çizgi", "Noktalı Çizgi", "Hayalet Çizgi", "Küçük Tepe", "Büyük Tepe", "Küçük Helezon (e)", "Büyük Helezon (l)", "Yatık Helezon", "Kurdele Döngü"], 
                    bilgi: "Kalemi hiç kaldırmadan çizilen sürekli yuvarlama, yay ve tepe çalışmaları." 
                },

                "Birbiriyle grift olarak hazırlanmış çalışmalar": { kisaAd: "Grift Çalışmalar", ozellikler: [], bilgi: "İleri düzey çizgiler." }
            },
            "1. Grup (ANETİL)": {
                "A Harfi": { ozellikler: ["Küçük harf yazım", "Büyük harf yazım", "İçinde sesi barındıran varlıkları işaretleme", "İçinde sesi barındıran varlıkları boyama", "Ses başta/ortada/sonda mı sorma", "Dış hatları kesikli harf boyama (Küçük/Büyük ayrı)", "Parmakla sürtüp takip için büyük puntolu harf", "Sadece dış hattı bulunan içi boş harf", "Resim içine gömülü minik boyama (Çadır vb.)", "Ses sayısı kadar harf yazma (Araba -> a-a-a)"], bilgi: "A sesi öğretimi." },
                "N Harfi": { ozellikler: ["Küçük harf yazım", "Büyük harf yazım", "İçinde sesi barındıran varlıkları işaretleme", "İçinde sesi barındıran varlıkları boyama", "Ses başta/ortada/sonda mı sorma", "Dış hatları kesikli harf boyama", "Parmakla sürtüp takip için büyük puntolu harf", "Sadece dış hattı bulunan içi boş harf", "Resim içine gömülü minik boyama", "Ses sayısı kadar harf yazma"], bilgi: "N sesi öğretimi." },
                "E Harfi": { ozellikler: ["Küçük harf yazım", "Büyük harf yazım", "İçinde sesi barındıran varlıkları işaretleme", "İçinde sesi barındıran varlıkları boyama", "Ses başta/ortada/sonda mı sorma", "Dış hatları kesikli harf boyama", "Parmakla sürtüp takip için büyük puntolu harf", "Sadece dış hattı bulunan içi boş harf", "Resim içine gömülü minik boyama", "Ses sayısı kadar harf yazma"], bilgi: "E sesi öğretimi." },
                "T Harfi": { ozellikler: ["Küçük harf yazım", "Büyük harf yazım", "İçinde sesi barındıran varlıkları işaretleme", "İçinde sesi barındıran varlıkları boyama", "Ses başta/ortada/sonda mı sorma", "Dış hatları kesikli harf boyama", "Parmakla sürtüp takip için büyük puntolu harf", "Sadece dış hattı bulunan içi boş harf", "Resim içine gömülü minik boyama", "Ses sayısı kadar harf yazma"], bilgi: "T sesi öğretimi." },
                "İ Harfi": { ozellikler: ["Küçük harf yazım", "Büyük harf yazım", "İçinde sesi barındıran varlıkları işaretleme", "İçinde sesi barındıran varlıkları boyama", "Ses başta/ortada/sonda mı sorma", "Dış hatları kesikli harf boyama", "Parmakla sürtüp takip için büyük puntolu harf", "Sadece dış hattı bulunan içi boş harf", "Resim içine gömülü minik boyama", "Ses sayısı kadar harf yazma"], bilgi: "İ sesi öğretimi." },
                "L Harfi": { ozellikler: ["Küçük harf yazım", "Büyük harf yazım", "İçinde sesi barındıran varlıkları işaretleme", "İçinde sesi barındıran varlıkları boyama", "Ses başta/ortada/sonda mı sorma", "Dış hatları kesikli harf boyama", "Parmakla sürtüp takip için büyük puntolu harf", "Sadece dış hattı bulunan içi boş harf", "Resim içine gömülü minik boyama", "Ses sayısı kadar harf yazma"], bilgi: "L sesi öğretimi." }
            }, 
            "2. Grup (OKURIM)": {
                "O Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "O sesi öğretimi." }, "K Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "K sesi öğretimi." }, "U Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "U sesi öğretimi." },
                "R Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "R sesi öğretimi." }, "I Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "I sesi öğretimi." }, "M Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "M sesi öğretimi." }
            },
            "3. Grup (ÜSÖYDZ)": {
                "Ü Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "Ü sesi öğretimi." }, "S Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "S sesi öğretimi." }, "Ö Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "Ö sesi öğretimi." },
                "Y Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "Y sesi öğretimi." }, "D Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "D sesi öğretimi." }, "Z Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "Z sesi öğretimi." }
            },
            "4. Grup (ÇBGCŞ)": {
                "Ç Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "Ç sesi öğretimi." }, "B Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "B sesi öğretimi." }, "G Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "G sesi öğretimi." },
                "C Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "C sesi öğretimi." }, "Ş Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "Ş sesi öğretimi." }
            },
            "5. Grup (PHVĞFJ)": {
                "P Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "P sesi öğretimi." }, "H Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "H sesi öğretimi." }, "V Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "V sesi öğretimi." },
                "Ğ Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "Ğ sesi öğretimi." }, "F Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "F sesi öğretimi." }, "J Harfi": { ozellikler: ["Harf Yazımı"], bilgi: "J sesi öğretimi." }
            },
           "Hece / Kelime / Cümle": {
                "Hece Birleştirme": { ozellikler: [], bilgi: "Öğrenilen seslerle hece sentezi." },
                "Heceye Ayırma": { ozellikler: [], bilgi: "Kelimeyi hecelerine parçalama." },
                "Kelime Birleştirme": { ozellikler: [], bilgi: "Hecelerden kelime türetme." },
                "Kelimeye Ayırma": { ozellikler: [], bilgi: "Cümleyi kelimelerine parçalama." },
                "Cümle Oluşturma": { ozellikler: [], bilgi: "Kelimelerden anlamlı cümle kurma." },
                "Kılavuz Çizgiye Serbest Yazı": { ozellikler: ["Normal Font", "Kesikli Font", "İçi Boş Font", "Hayalet Font", "İlk Metin Normal (Gerisi Kesikli)", "İlk Metin Normal (Gerisi Hayalet)"], bilgi: "Satır aralığına serbest hece, kelime veya cümle yazdırma çalışması." },
                "Otomatik Çengel Bulmaca": { ozellikler: [], bilgi: "Girilen kelimelerden otomatik olarak kesişimli çengel bulmaca üretir." },
                "Kelime Avı (Sözcük Bulmaca)": { ozellikler: [], bilgi: "Girilen kelimeleri harf matrisi içine gizler." },
                "Şifreli Mesaj (Gizli Cümle)": { ozellikler: [], bilgi: "Girilen kelime veya cümleyi şifreleyerek bulmaca oluşturur." },
                "Harf Karıştırmaca": { ozellikler: [], bilgi: "Girilen kelimelerin harflerini karıştırarak bulmaca oluşturur." },
                "Labirentten Kelime Toplama": { ozellikler: [], bilgi: "Çocuk labirenti çözerken doğru yoldaki harfleri toplayıp gizli kelimeyi bulur." },
                "Kelime Zinciri (Yılan Bulmaca)": { ozellikler: [], bilgi: "Kelimelerin son harfi ile başlayan yeni kelimelerle birbirine bağlanan yılan zinciri oluşturur." },
                "Mini Sudoku (4x4)": { ozellikler: [], bilgi: "Analitik düşünmeyi geliştiren 4x4 basit görsel veya harfli Sudoku." }
            },
            "Okuma ve Anlama": {
                "Cümle-Görsel İlişkisi": { ozellikler: [], bilgi: "Cümleler ile görselleri eşleştirme ve anlamlandırma çalışmaları." },
                "Yönerge Takibi (Okuduğunu Uygulama)": { ozellikler: [], bilgi: "Okunan metne veya cümleye göre istenen eylemi/çizimi gerçekleştirme." },
                "Hikaye Kurgusu ve Analiz": { ozellikler: [], bilgi: "Olayları sıralama ve hikaye bütünlüğü kurma." },
                "Metin İçi Mantık": { ozellikler: [], bilgi: "Metindeki doğru/yanlış veya 5N1K ilişkilerini çözme." },
                "Okuma ve Yazma Pratiği": { ozellikler: [], bilgi: "Okuma metinleri ve kılavuz çizgiye bakarak yazma çalışmaları." }
            }
        },
        "turkce": {
            "Okuma Anlama": { "Metin Çalışmaları": { ozellikler: ["5N1K Soruları"], bilgi: "Görsel okuma ve kısa metin anlama çalışmaları." } }
        },
        "matematik": {
            "Uzamsal İlişkiler": { ozellikler: ["Altında-Üstünde", "Sağında-Solunda", "İçinde-Dışında"], bilgi: "Konum bildiren kavramlar." },
            "Sayılar": { ozellikler: ["20'ye Kadar Sayma", "Ritmik Sayma", "Sayı Nesne Eşleştirme"], bilgi: "Rakamları tanıma ve sayma." },
            "Toplama İşlemi": { ozellikler: ["Görselli Toplama", "Yan Yana", "Alt Alta", "Eldesiz"], bilgi: "Temel toplama mantığı." },
            "Çıkarma İşlemi": { ozellikler: ["Görselli Çıkarma", "Geriye Sayma", "Temel İşlemler"], bilgi: "Temel çıkarma mantığı." },
            "Geometri": { ozellikler: ["Şekilleri Tanıma", "Geometrik Cisimler"], bilgi: "Üçgen, kare, dikdörtgen, çember." }
        },
        "hayat": {
            "Okulumuzda Hayat": { ozellikler: ["Okul Kuralları", "Tanışma", "Bayrak Töreni"], bilgi: "Okula uyum süreci." },
            "Evimizde Hayat": { ozellikler: ["Aile Bireyleri", "Adres Bilgisi", "Günlük Plan"], bilgi: "Aile içi iletişim." }
        }
    },
    "2. SINIF": {
        "turkce": {
            "Sözcük Bilgisi": { ozellikler: ["Eş Anlamlılar", "Zıt Anlamlılar", "Heceleme"], bilgi: "Kelime dağarcığı." },
            "Cümle Bilgisi": { ozellikler: ["5N1K Soruları", "Kurallı Cümle"], bilgi: "Okuduğunu anlama." }
        },
        "matematik": {
            "Sayılar": { ozellikler: ["Basamak Değeri", "Onluğa Yuvarlama", "Sıralama"], bilgi: "100'e kadar sayılar." },
            "İşlemler": { ozellikler: ["Eldeli Toplama", "Onluk Bozarak Çıkarma", "Çarpım Tablosu"], bilgi: "Dört işleme hazırlık." }
        },
        "hayat": {
            "Ülkemizde Hayat": { ozellikler: ["Kültürel Miras", "Milli Bayramlar"], bilgi: "Toplumsal değerler." }
        }
    },
    "3. SINIF": {
        "turkce": {
            "Dil Bilgisi": { ozellikler: ["İsimler", "Sıfatlar", "Zamirler", "Noktalama"], bilgi: "Temel gramer." }
        },
        "matematik": {
            "Sayılar": { ozellikler: ["3 Basamaklı Sayılar", "Romen Rakamları"], bilgi: "Sayı bilgisi geliştirme." },
            "İşlemler": { ozellikler: ["Kısa Yoldan Çarpma", "Kalanlı Bölme"], bilgi: "İleri düzey işlemler." }
        },
        "fen": {
            "Dünya ve Evren": { ozellikler: ["Dünya'nın Şekli", "Kara ve Su Katmanları"], bilgi: "Gezegenimizi tanıyalım." },
            "Beş Duyumuz": { ozellikler: ["Duyu Organları Görevleri"], bilgi: "Vücudumuzun yapısı." }
        }
    },
    "4. SINIF": {
        "turkce": {
            "Anlam Bilgisi": { ozellikler: ["Mecaz Anlam", "Atasözleri ve Deyimler"], bilgi: "İleri düzey Türkçe." }
        },
        "matematik": {
            "Sayılar": { ozellikler: ["Milyonlar", "Bölükler", "Kesir Çeşitleri"], bilgi: "Büyük sayılar ve kesirler." },
            "Ölçme": { ozellikler: ["Çevre Hesaplama", "Alan Ölçme"], bilgi: "Geometrik hesaplamalar." }
        },
        "sosyal": {
            "Birey ve Toplum": { ozellikler: ["TC Kimlik Kartı", "Kronoloji"], bilgi: "Vatandaşlık ve tarih." },
            "Milli Mücadele": { ozellikler: ["Kurtuluş Savaşı", "Kahramanlar"], bilgi: "Tarihimizi öğrenelim." }
        },
        "fen": {
            "Madde": { ozellikler: ["Maddenin Halleri", "Saf Madde/Karışım"], bilgi: "Maddeyi tanıyalım." },
            "Kuvvet": { ozellikler: ["Mıknatıslar", "Çekme-İtme"], bilgi: "Fiziksel etkiler." }
        }
    }
};

const dersIsimleri = { "ilkokuma": "İlk Okuma ve Yazma", "turkce": "Türkçe", "matematik": "Matematik", "hayat": "Hayat Bilgisi", "fen": "Fen Bilimleri", "sosyal": "Sosyal Bilgiler" };

// YENİ: Akıllı Motor İçin Dinamik Soru Tipleri
const heceSoruTipleri = {
    "Hece Birleştirme": ["2 Harfli Hece", "3 Harfli Hece", "4 Harfli Hece"],
    "Kelime Birleştirme": ["Sadece Birleştirme"],
    "Cümle Oluşturma": ["Cümle Kurma"],
    "Heceye Ayırma": ["Heceleme (Analiz)"],
    "Kelimeye Ayırma": ["Kelimelere Bölme (Analiz)"],
    "Kılavuz Çizgiye Serbest Yazı": ["Sadece Yazı", "Yanına Resimli Yazı"],
    "Otomatik Çengel Bulmaca": ["Sembollü Bulmaca", "Nesneli Bulmaca"],
    "Kelime Avı (Sözcük Bulmaca)": ["Klasik Kelime Avı"],
    "Şifreli Mesaj (Gizli Cümle)": ["Sayı Şifreli", "Sembol Şifreli", "Nesne Şifreli"],
    "Harf Karıştırmaca": ["Karışık Harfler (İpuculu)"],
    "Labirentten Kelime Toplama": ["Klasik Labirent"],
    "Kelime Zinciri (Yılan Bulmaca)": ["Kesişimler Dolu (Klasik)"],
    "Mini Sudoku (4x4)": ["Harfli veya Sayısal", "Nesneli (Görsel)"],
    "Cümle-Görsel İlişkisi": ["Okuduğunu Eşleştirme", "Okuduğunu Çizme"],
    "Yönerge Takibi (Okuduğunu Uygulama)": ["Okuduğunu Boyama/Tamamlama", "Mantıksal İşaretleme"],
    "Hikaye Kurgusu ve Analiz": ["Olay Sıralama", "Kelime Avcısı (Boşluk Doldurma)"],
    "Metin İçi Mantık": ["Doğru mu, Yanlış mı?", "5N1K ve Çoktan Seçmeli"],
    "Okuma ve Yazma Pratiği": ["Okuyalım Yazalım"]
};

