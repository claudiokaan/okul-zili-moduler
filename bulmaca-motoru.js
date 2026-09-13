// ============================================================================
// OTOMATİK ÇENGEL BULMACA (CROSSWORD) MOTORU
// Geliştirici: Okul Zili Otomasyon Sistemi / Modüler Zeka
// ============================================================================

const BulmacaMotoru = {
    // İlkokul seviyesine uygun, birbirinden farklı canlı semboller (SVG)
    semboller: [
        `<polygon points="50,10 90,90 10,90" fill="#e74c3c"/>`, // Kırmızı Üçgen
        `<rect x="15" y="15" width="70" height="70" fill="#9b59b6"/>`, // Mor Kare
        `<polygon points="50,5 90,35 75,85 25,85 10,35" fill="#f39c12"/>`, // Turuncu Beşgen
        `<circle cx="50" cy="50" r="35" fill="#3498db"/>`, // Mavi Daire
        `<polygon points="50,10 61,39 92,39 67,58 76,88 50,70 24,88 33,58 8,39 39,39" fill="#2ecc71"/>`, // Yeşil Yıldız
        `<rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" fill="#1abc9c"/>`, // Turkuaz Elmas
        `<circle cx="50" cy="50" r="35" fill="#e67e22"/>`, // Turuncu Daire
        `<polygon points="50,10 90,50 50,90 10,50" fill="#e84393"/>`, // Pembe Baklava
        `<rect x="20" y="35" width="60" height="30" fill="#34495e"/>`, // Lacivert Dikdörtgen
        `<polygon points="30,10 70,10 90,50 70,90 30,90 10,50" fill="#f1c40f"/>` // Sarı Altıgen
    ],

    // Ana Üretici Fonksiyon (Girdi: Kelime Dizisi, Çıktı: Koordinatlı Bulmaca Objesi)
    uret: function(kelimeler) {
        if (!kelimeler || kelimeler.length === 0) return null;
        
        // Kelimeleri temizle, büyük harfe çevir ve en uzundan kısaya sırala
        let temizKelimeler = kelimeler.map(k => k.trim().toLocaleUpperCase('tr-TR')).filter(k => k.length > 0);
        temizKelimeler.sort((a, b) => b.length - a.length);

        let enIyiGrid = null;
        let enIyiSkor = -1;

        // Rastgelelik katıp en sıkı (kompakt) bulmacayı bulmak için 50 kez dener
        for (let deneme = 0; deneme < 50; deneme++) {
            let karisikKelimeler = [...temizKelimeler];
            if (deneme > 0) this.diziyiKaristir(karisikKelimeler); // İlk deneme uzunluk sırasıyla, sonrakiler rastgele

            let grid = this.bosGridOlustur();
            let yerlesenler = [];

            // İlk kelimeyi (en uzunu) merkeze yatay koy
            this.kelimeYerlestir(grid, karisikKelimeler[0], 0, 0, true);
            yerlesenler.push({ kelime: karisikKelimeler[0], x: 0, y: 0, yatay: true });

            let basariSayisi = 1;

            // Diğer kelimeleri kesişim arayarak yerleştir
            for (let i = 1; i < karisikKelimeler.length; i++) {
                let kelime = karisikKelimeler[i];
                let enIyiKesisim = this.enIyiKesisimiBul(grid, kelime);

                if (enIyiKesisim) {
                    this.kelimeYerlestir(grid, kelime, enIyiKesisim.x, enIyiKesisim.y, enIyiKesisim.yatay);
                    yerlesenler.push({ kelime: kelime, x: enIyiKesisim.x, y: enIyiKesisim.y, yatay: enIyiKesisim.yatay });
                    basariSayisi++;
                }
            }

            // Puanlama: Ne kadar çok kelime yerleştiyse ve ne kadar darsa o kadar iyi
            let sinirlar = this.sinirlariHesapla(yerlesenler);
            let alan = (sinirlar.maxX - sinirlar.minX + 1) * (sinirlar.maxY - sinirlar.minY + 1);
            let skor = (basariSayisi * 1000) - alan; 

            if (skor > enIyiSkor) {
                enIyiSkor = skor;
                enIyiGrid = { yerlesenler: yerlesenler, sinirlar: sinirlar };
            }
        }

        return this.sonuclariBicimlendir(enIyiGrid);
    },

    bosGridOlustur: function() {
        return {}; // x,y koordinatlarını key olarak tutan obje matrisi
    },

    harfOku: function(grid, x, y) {
        return grid[`${x},${y}`] || null;
    },

    harfYaz: function(grid, x, y, harf) {
        grid[`${x},${y}`] = harf;
    },

    kelimeYerlestir: function(grid, kelime, basX, basY, yatay) {
        for (let i = 0; i < kelime.length; i++) {
            let x = yatay ? basX + i : basX;
            let y = yatay ? basY : basY + i;
            this.harfYaz(grid, x, y, kelime[i]);
        }
    },

    enIyiKesisimiBul: function(grid, kelime) {
        let olasiKesisimler = [];

        for (let i = 0; i < kelime.length; i++) {
            let harf = kelime[i];
            
            for (let key in grid) {
                if (grid[key] === harf) {
                    let [gx, gy] = key.split(',').map(Number);
                    
                    // Yatay deneme
                    if (this.cakismaKontrolu(grid, kelime, gx - i, gy, true)) {
                        olasiKesisimler.push({ x: gx - i, y: gy, yatay: true, kesisimSayisi: this.kesisimSay(grid, kelime, gx - i, gy, true) });
                    }
                    // Dikey deneme
                    if (this.cakismaKontrolu(grid, kelime, gx, gy - i, false)) {
                        olasiKesisimler.push({ x: gx, y: gy - i, yatay: false, kesisimSayisi: this.kesisimSay(grid, kelime, gx, gy - i, false) });
                    }
                }
            }
        }

        if (olasiKesisimler.length === 0) return null;
        
        // En çok kesişen (en iç içe geçen) seçeneği bul
        olasiKesisimler.sort((a, b) => b.kesisimSayisi - a.kesisimSayisi);
        return olasiKesisimler[0];
    },

    cakismaKontrolu: function(grid, kelime, basX, basY, yatay) {
        for (let i = 0; i < kelime.length; i++) {
            let x = yatay ? basX + i : basX;
            let y = yatay ? basY : basY + i;
            let mevcutHarf = this.harfOku(grid, x, y);

            // Zaten aynı harf varsa sorun yok, kesisimdir. Farklıysa çarpışmadır!
            if (mevcutHarf && mevcutHarf !== kelime[i]) return false;

            // Yan yana paralel yapışmayı engelleme (Padding kontrolü)
            if (!mevcutHarf) {
                if (yatay) {
                    if (this.harfOku(grid, x, y - 1) || this.harfOku(grid, x, y + 1)) return false;
                } else {
                    if (this.harfOku(grid, x - 1, y) || this.harfOku(grid, x + 1, y)) return false;
                }
            }
            
            // Kelimenin en başı ve en sonu bitişik olamaz
            if (i === 0) {
                if (yatay && this.harfOku(grid, x - 1, y)) return false;
                if (!yatay && this.harfOku(grid, x, y - 1)) return false;
            }
            if (i === kelime.length - 1) {
                if (yatay && this.harfOku(grid, x + 1, y)) return false;
                if (!yatay && this.harfOku(grid, x, y + 1)) return false;
            }
        }
        return true;
    },

    kesisimSay: function(grid, kelime, basX, basY, yatay) {
        let say = 0;
        for (let i = 0; i < kelime.length; i++) {
            let x = yatay ? basX + i : basX;
            let y = yatay ? basY : basY + i;
            if (this.harfOku(grid, x, y) === kelime[i]) say++;
        }
        return say;
    },

    sinirlariHesapla: function(yerlesenler) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        yerlesenler.forEach(y => {
            minX = Math.min(minX, y.x);
            minY = Math.min(minY, y.y);
            maxX = Math.max(maxX, y.yatay ? y.x + y.kelime.length - 1 : y.x);
            maxY = Math.max(maxY, !y.yatay ? y.y + y.kelime.length - 1 : y.y);
        });
        return { minX, minY, maxX, maxY };
    },

    diziyiKaristir: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    sonuclariBicimlendir: function(gridVerisi) {
        if (!gridVerisi) return null;
        let s = gridVerisi.sinirlar;
        let w = s.maxX - s.minX + 1;
        let h = s.maxY - s.minY + 1;

        // Sembolleri atama (Her kelimeye benzersiz)
        let islemliYerlesenler = gridVerisi.yerlesenler.map((y, index) => {
            return {
                kelime: y.kelime,
                x: y.x - s.minX, // Koordinatları 0'dan başlatacak şekilde sıfırla
                y: y.y - s.minY,
                yatay: y.yatay,
                sembol: this.semboller[index % this.semboller.length] // Sıragelen sembolü ver
            };
        });

        return { genislik: w, yukseklik: h, kelimeler: islemliYerlesenler };
    }
};

// ============================================================================
// KELİME AVI (SÖZCÜK BULMACA) MOTORU
// ============================================================================
const KelimeAviMotoru = {
    harfler: "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",

    uret: function(kelimeler) {
        if (!kelimeler || kelimeler.length === 0) return null;
        
        // YENİ ZEKÂ: Kelimelere çift kimlik veriyoruz! (orjinal ve saf)
        let temizKelimeler = kelimeler.map(k => {
            let orj = k.trim().toLocaleUpperCase('tr-TR');
            let saf = orj.replace(/\s+/g, ''); // Bütün boşlukları acımasızca siler
            return { orjinal: orj, saf: saf };
        }).filter(k => k.saf.length > 1);

        if (temizKelimeler.length === 0) return null;

        // Izgara boyutunu "saf" (boşluksuz) uzunluğa göre hesapla
        let maxLen = Math.max(...temizKelimeler.map(k => k.saf.length));
        let boyut = Math.max(8, maxLen + 1, Math.ceil(Math.sqrt(temizKelimeler.length * 12)));
        if (boyut > 15) boyut = 15; // Çok abartmasın, A4'e sığsın

        let grid = Array(boyut).fill(null).map(() => Array(boyut).fill(''));
        
        // 1. Sınıf seviyesi için sadece Sağ (Yatay) ve Aşağı (Dikey) yönler
        let yonler = [[0, 1], [1, 0]]; 

        temizKelimeler.forEach(kelimeObj => {
            let yerlesimiBulundu = false;
            let denemeSayisi = 0;
            let islenecekKelime = kelimeObj.saf; // Matrise SADECE boşluksuz hali girer!

            while (!yerlesimiBulundu && denemeSayisi < 200) {
                let yon = yonler[Math.floor(Math.random() * yonler.length)];
                let basR = Math.floor(Math.random() * boyut);
                let basC = Math.floor(Math.random() * boyut);

                if (this.yerlesebilirMi(grid, islenecekKelime, basR, basC, yon, boyut)) {
                    this.yerlestir(grid, islenecekKelime, basR, basC, yon);
                    yerlesimiBulundu = true;
                }
                denemeSayisi++;
            }
        });

        // Kalan boşlukları rastgele Türk harfleriyle doldur
        for (let r = 0; r < boyut; r++) {
            for (let c = 0; c < boyut; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = this.harfler.charAt(Math.floor(Math.random() * this.harfler.length));
                }
            }
        }

        // FİX: Dışarıya kelimeleri orijinal (boşluklu) haliyle geri veriyoruz ki ipuçlarında "ALİ RIZA" yazsın!
        return { matris: grid, boyut: boyut, kelimeler: temizKelimeler.map(k => k.orjinal) };
    },

    yerlesebilirMi: function(grid, kelime, r, c, yon, boyut) {
        for (let i = 0; i < kelime.length; i++) {
            let nr = r + yon[0] * i;
            let nc = c + yon[1] * i;
            // Dışarı taşıyor mu?
            if (nr < 0 || nr >= boyut || nc < 0 || nc >= boyut) return false;
            // Çarpışma var mı? (Kesişen harf aynıysa sorun yok)
            if (grid[nr][nc] !== '' && grid[nr][nc] !== kelime[i]) return false;
        }
        return true;
    },

    yerlestir: function(grid, kelime, r, c, yon) {
        for (let i = 0; i < kelime.length; i++) {
            grid[r + yon[0] * i][c + yon[1] * i] = kelime[i];
        }
    }
};

// ============================================================================
// ŞİFRELİ MESAJ (KRİPTOGRAM) MOTORU
// ============================================================================
const KriptogramMotoru = {
    // Yazıcıda ve PDF'te %100 sorunsuz çıkacak, emojisiz standart semboller
    semboller: ["★","♥","♣","♠","♦","●","■","▲","▼","✿","♫","☀","☁","☂","❄","✦","✺","✂","✏","✉","✔","✖","✚","✪","❂","✵","✣","✤","✦"],

    uret: function(metin, tur) {
        if (!metin || metin.trim() === "") return null;
        
        let orjinalMetin = metin.toLocaleUpperCase('tr-TR');
        let kelimeler = orjinalMetin.split(/\s+/); 
        
        let sadeceHarfler = orjinalMetin.replace(/[^A-ZÇĞIİÖŞÜ]/g, '').split('');
        let benzersizHarfler = [...new Set(sadeceHarfler)];
        
        let anahtar = {};
        
        if (tur === "Sembol Şifreli") {
            let karisikSemboller = [...this.semboller].sort(() => Math.random() - 0.5);
            benzersizHarfler.forEach((h, i) => {
                anahtar[h] = karisikSemboller[i % karisikSemboller.length];
            });
        } else if (tur === "Sayı Şifreli") {
            let sayilar = Array.from({length: 29}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
            benzersizHarfler.forEach((h, i) => {
                anahtar[h] = sayilar[i % sayilar.length].toString();
            });
        } else {
            benzersizHarfler.forEach(h => {
                anahtar[h] = h; 
            });
        }
        
        // FİX: Anahtar kutularını çizerken sırayı ele vermesin diye harfleri kendi içinde karıştırıyoruz!
        let gosterimSirasi = [...benzersizHarfler].sort(() => Math.random() - 0.5);

        return { kelimeler: kelimeler, anahtar: anahtar, benzersizHarfler: benzersizHarfler, gosterimSirasi: gosterimSirasi };
    }
};

// ============================================================================
// HARF KARIŞTIRMACA (ANAGRAM / ÇORBA KELİMELER) MOTORU
// ============================================================================
const HarfKaristirmaMotoru = {
    uret: function(metin) {
        if (!metin || metin.trim() === "") return null;
        
        let kelimeler = metin.split(',').map(k => k.trim().toLocaleUpperCase('tr-TR')).filter(k => k.length > 1);
        if (kelimeler.length === 0) return null;

        let sonucListesi = kelimeler.map(kelime => {
            let harfler = kelime.split('');
            let karisik;
            
            // Çocuk kelimenin aynısıyla karşılaşmasın diye karıştırılan halinin orijinalinden farklı olmasını sağlıyoruz
            let guvenlik = 0;
            do {
                karisik = [...harfler].sort(() => Math.random() - 0.5);
                guvenlik++;
            } while (karisik.join('') === kelime && harfler.length > 1 && guvenlik < 10);

            return { orijinal: kelime, karisik: karisik };
        });

        return { kelimeler: sonucListesi };
    }
};

// ============================================================================
// LABİRENTTEN KELİME TOPLAMA MOTORU (DFS MAZE GENERATOR)
// ============================================================================
const LabirentKelimeMotoru = {
    harfler: "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ",
    
    uret: function(metin) {
        if (!metin || metin.trim() === "") return null;
        let kelime = metin.trim().toLocaleUpperCase('tr-TR').replace(/\s+/g, '');
        if (kelime.length < 2) return null;

        // İlkokul seviyesi için kelimenin uzunluğuna göre 6x6 ile 10x10 arası ideal bir labirent oluştur
        let boyut = Math.min(10, Math.max(6, kelime.length + 2));
        
        // 1. Hücreleri ve Duvarları Hazırla (Kusursuz Grid Matrisi)
        let grid = Array.from({length: boyut}, () => Array.from({length: boyut}, () => ({
            N: true, S: true, E: true, W: true, visited: false, char: '', isSolution: false, parent: null
        })));

        // 2. DFS (Depth-First Search) Algoritması ile Rastgele Labirent Kazma
        let stack = [];
        grid[0][0].visited = true;
        stack.push({r: 0, c: 0});

        let komsulariGetir = (r, c) => {
            let k = [];
            if (r > 0 && !grid[r-1][c].visited) k.push({r: r-1, c: c, dir: 'N'});
            if (r < boyut-1 && !grid[r+1][c].visited) k.push({r: r+1, c: c, dir: 'S'});
            if (c > 0 && !grid[r][c-1].visited) k.push({r: r, c: c-1, dir: 'W'});
            if (c < boyut-1 && !grid[r][c+1].visited) k.push({r: r, c: c+1, dir: 'E'});
            return k;
        };

        while(stack.length > 0) {
            let current = stack[stack.length - 1];
            let neighbors = komsulariGetir(current.r, current.c);
            
            if (neighbors.length > 0) {
                let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Duvarları Yık (Yol aç)
                if(next.dir === 'N') { grid[current.r][current.c].N = false; grid[next.r][next.c].S = false; }
                if(next.dir === 'S') { grid[current.r][current.c].S = false; grid[next.r][next.c].N = false; }
                if(next.dir === 'W') { grid[current.r][current.c].W = false; grid[next.r][next.c].E = false; }
                if(next.dir === 'E') { grid[current.r][current.c].E = false; grid[next.r][next.c].W = false; }
                
                grid[next.r][next.c].visited = true;
                grid[next.r][next.c].parent = {r: current.r, c: current.c}; // Eve dönüş yolunu (çözümü) hafızaya al
                stack.push(next);
            } else {
                stack.pop(); // Çıkmaz sokak, geri dön
            }
        }

        // 3. Girişten (0,0) Çıkışa (boyut-1, boyut-1) Giden Gizli Çözüm Yolunu Çıkar
        let path = [];
        let curr = {r: boyut-1, c: boyut-1};
        while(curr) {
            path.unshift(curr);
            if (curr.r === 0 && curr.c === 0) break;
            curr = grid[curr.r][curr.c].parent;
        }

        // 4. Kelimenin Harflerini Doğru Yolun Üzerine Eşit Aralıklarla Gizle
        let step = Math.max(1, Math.floor(path.length / kelime.length));
        let charIndex = 0;
        
        path.forEach((p, idx) => {
            grid[p.r][p.c].isSolution = true;
            // Eşit aralıklarla harfi yerleştir (Son harf çıkışa yakın olsun diye idx ayarı)
            if (idx === Math.min(path.length - 1, charIndex * step) && charIndex < kelime.length) {
                grid[p.r][p.c].char = kelime[charIndex];
                charIndex++;
            }
        });

        // 5. Çıkmaz Sokaklara Şaşırtmaca (Decoy) Harfler Serp
        for(let r=0; r<boyut; r++) {
            for(let c=0; c<boyut; c++) {
                if (!grid[r][c].isSolution && Math.random() > 0.3) {
                    grid[r][c].char = this.harfler.charAt(Math.floor(Math.random() * this.harfler.length));
                }
            }
        }

        return { grid: grid, boyut: boyut, kelime: kelime };
    }
};

// ============================================================================
// KELİME ZİNCİRİ (YILAN BULMACA) MOTORU
// ============================================================================
const KelimeZinciriMotoru = {
    uret: function(metin) {
        if (!metin || metin.trim() === "") return null;
        let kelimeler = metin.split(',').map(k => k.trim().toLocaleUpperCase('tr-TR')).filter(k => k.length > 1);
        if (kelimeler.length < 2) return { hata: "En az 2 kelime girmelisiniz!" };

        // 1. ZEKÂ: Karışık girilen kelimelerden kusursuz bir baş-kıç zinciri bul (DFS)
        let zincir = this.zincirBul(kelimeler);
        if (!zincir) return { hata: "Kelimeler zincir oluşturmuyor! (Birinin son harfi, diğerinin ilk harfi olmalı)" };

        // 2. Grid üzerine yılan gibi kıvrılarak yerleştir
        let yerlesim = this.grideYerlestir(zincir);
        if (!yerlesim) return { hata: "Yılan kendi kuyruğuna dolandı! Farklı kelimeler deneyin." };

        return { kelimeler: zincir, grid: yerlesim.grid, sinirlar: yerlesim.sinirlar };
    },

    zincirBul: function(kelimeler) {
        let sonuc = null;
        let visited = new Array(kelimeler.length).fill(false);

        let dfs = (currentChain, currentIndex) => {
            if (currentChain.length === kelimeler.length) {
                sonuc = [...currentChain];
                return true;
            }
            let sonKelime = currentChain[currentChain.length - 1];
            let sonHarf = sonKelime.charAt(sonKelime.length - 1);

            for (let i = 0; i < kelimeler.length; i++) {
                if (!visited[i] && kelimeler[i].charAt(0) === sonHarf) {
                    visited[i] = true;
                    currentChain.push(kelimeler[i]);
                    if (dfs(currentChain, i)) return true;
                    currentChain.pop();
                    visited[i] = false;
                }
            }
            return false;
        };

        for (let i = 0; i < kelimeler.length; i++) {
            visited[i] = true;
            if (dfs([kelimeler[i]], i)) return sonuc;
            visited[i] = false;
        }
        return null; 
    },

    grideYerlestir: function(zincir) {
        let grid = {}; 
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        let dirs = [[1,0], [0,1], [-1,0], [0,-1]]; // Sağ, Aşağı, Sol, Yukarı
        let cx = 0, cy = 0;
        let currentDir = 0; 
        
        let cakismaKontrol = (kelime, basX, basY, yonIdx) => {
            let dx = dirs[yonIdx][0]; let dy = dirs[yonIdx][1];
            for (let i = 1; i < kelime.length; i++) {
                let nx = basX + dx * i; let ny = basY + dy * i;
                if (grid[`${nx},${ny}`]) return false; 
                // Yılanın yan yana yapışmaması için etrafını da kontrol et
                for (let d = 0; d < 4; d++) {
                    if (d === (yonIdx + 2) % 4) continue; // Geldiği yöne bakma
                    let komsuX = nx + dirs[d][0]; let komsuY = ny + dirs[d][1];
                    if (i < kelime.length - 1 && grid[`${komsuX},${komsuY}`]) return false;
                }
            }
            return true;
        };

        let yaz = (kelime, basX, basY, yonIdx, kelimeIndex) => {
            let dx = dirs[yonIdx][0]; let dy = dirs[yonIdx][1];
            for (let i = 0; i < kelime.length; i++) {
                if (kelimeIndex > 0 && i === 0) continue; // Düğüm zaten yazıldı
                let nx = basX + dx * i; let ny = basY + dy * i;
                
                grid[`${nx},${ny}`] = { char: kelime[i], isNode: false, isStart: (kelimeIndex === 0 && i === 0) };
                if (i === kelime.length - 1 && kelimeIndex < zincir.length - 1) grid[`${nx},${ny}`].isNode = true;
                
                minX = Math.min(minX, nx); maxX = Math.max(maxX, nx);
                minY = Math.min(minY, ny); maxY = Math.max(maxY, ny);
                cx = nx; cy = ny;
            }
        };

        yaz(zincir[0], 0, 0, currentDir, 0);

        for (let k = 1; k < zincir.length; k++) {
            let kelime = zincir[k];
            let yerlesti = false;
            
            // Yılan rastgele kıvrılsın diye yönleri karıştır (Zar atıldığında yılanın şekli değişir!)
            let denemeYonleri = [(currentDir + 1) % 4, (currentDir + 3) % 4, currentDir];
            if (Math.random() > 0.5) denemeYonleri = [(currentDir + 3) % 4, (currentDir + 1) % 4, currentDir];
            
            for (let y = 0; y < denemeYonleri.length; y++) {
                let testYon = denemeYonleri[y];
                if (cakismaKontrol(kelime, cx, cy, testYon)) {
                    currentDir = testYon;
                    yaz(kelime, cx, cy, currentDir, k);
                    yerlesti = true;
                    break;
                }
            }
            if (!yerlesti) return null; 
        }
        return { grid: grid, sinirlar: { minX, maxX, minY, maxY } };
    }
};

// ============================================================================
// MİNİ SUDOKU (4x4) MOTORU
// ============================================================================
const MiniSudokuMotoru = {
    uret: function(metin) {
        if (!metin || metin.trim() === "") return null;
        let ogeler = metin.split(',').map(k => k.trim().toLocaleUpperCase('tr-TR')).filter(k => k.length > 0);
        
        // ZEKÂ: Tam olarak 4 benzersiz ögeye ihtiyacımız var!
        ogeler = [...new Set(ogeler)]; 
        if (ogeler.length !== 4) return { hata: "Lütfen virgülle ayrılarak tam 4 farklı öge (harf/sayı/kelime) girin!" };

        // 1. Kusursuz bir 4x4 temel matris oluştur
        let grid = [
            [0, 1, 2, 3],
            [2, 3, 0, 1],
            [1, 0, 3, 2],
            [3, 2, 1, 0]
        ];

        // 2. Rastgelelik Katalım (Karıştırma Algoritmaları)
        // A. Rakamları (İndeksleri) Kendi İçinde Karıştır
        let indeksler = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        for(let r=0; r<4; r++) {
            for(let c=0; c<4; c++) {
                grid[r][c] = indeksler[grid[r][c]];
            }
        }

        // B. Blok İçi Satırları Karıştır (0 ile 1'i veya 2 ile 3'ü yer değiştir)
        if (Math.random() > 0.5) { let temp = grid[0]; grid[0] = grid[1]; grid[1] = temp; }
        if (Math.random() > 0.5) { let temp = grid[2]; grid[2] = grid[3]; grid[3] = temp; }

        // C. Blok İçi Sütunları Karıştır
        if (Math.random() > 0.5) { for(let r=0; r<4; r++) { let temp = grid[r][0]; grid[r][0] = grid[r][1]; grid[r][1] = temp; } }
        if (Math.random() > 0.5) { for(let r=0; r<4; r++) { let temp = grid[r][2]; grid[r][2] = grid[r][3]; grid[r][3] = temp; } }

        // 3. Bulmacayı Hazırla (Çocuklar için bazı kutuları boşalt - 1. sınıf için ~8-10 kutu dolu kalmalı)
        let bulmacaGrid = JSON.parse(JSON.stringify(grid));
        let silinecekKutuSayisi = 8 + Math.floor(Math.random() * 3); // 8 ile 10 arası kutu silinecek

        let silinenler = 0;
        let deneme = 0;
        while(silinenler < silinecekKutuSayisi && deneme < 100) {
            let r = Math.floor(Math.random() * 4);
            let c = Math.floor(Math.random() * 4);
            if (bulmacaGrid[r][c] !== null) {
                bulmacaGrid[r][c] = null;
                silinenler++;
            }
            deneme++;
        }

        return { orjinalGrid: grid, bulmacaGrid: bulmacaGrid, ogeler: ogeler };
    }
};

