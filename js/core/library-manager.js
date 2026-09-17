// Okul Zili V3 - Generic Library Manager
// Görsel kütüphanesi ve modal yönetimini sağlar.

(function(global) {

    let kutuphaneHedefIndex = null;
    let kutuphaneHedefTur = null; 
    let seciliKutuphaneKelime = null;


    function kutuphaneModaliAc(hedefIndex, tur) {
        kutuphaneHedefIndex = hedefIndex;
        kutuphaneHedefTur = tur; // 'grid' gibi neresi için çağrıldığını aklında tutar
        document.getElementById('kutuphane-modali').style.display = "flex";
        document.getElementById('kutuphane-arama').value = "";
        kutuphanedeAra(); // Tüm kütüphaneyi A'dan Z'ye vitrine yükler
    }

    function kutuphaneModaliKapat() {
        document.getElementById('kutuphane-modali').style.display = "none";
        kutuphaneHedefIndex = null; kutuphaneHedefTur = null; seciliKutuphaneKelime = null;
        document.getElementById('vitrin-kutu').innerHTML = '<span style="color:#bdc3c7; font-weight:bold;">Listeden bir görsel seçin</span>';
        document.getElementById('vitrin-baslik').innerText = "Görsel Önizleme";
        document.getElementById('btn-kullan').style.opacity = "0.5";
        document.getElementById('btn-kullan').style.pointerEvents = "none";
    }

    function kutuphanedeAra() {
        let aranan = turkceTemizle(document.getElementById('kutuphane-arama').value);
        let listeDiv = document.getElementById('kutuphane-liste');
        listeDiv.innerHTML = "";
        
        if (typeof svgKutuphanesi === 'undefined') {
            listeDiv.innerHTML = "<p style='color:#e74c3c;'>HATA: gorsel-kutuphane.js yüklenemedi!</p>";
            return;
        }

        let keys = Object.keys(svgKutuphanesi);
        let sonuclar = keys.filter(k => turkceTemizle(k).includes(aranan));
        
        sonuclar.forEach(kelime => {
            let hamSvg = svgKutuphanesi[kelime];
            
            // Sol menüdeki ikonlar için de aynı Asit Banyosu!
            let temizKod = hamSvg.replace(/stroke-width="[^"]*"/gi, "").replace(/stroke="[^"]*"/gi, "").replace(/fill="[^"]*"/gi, "");
            
            let tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute'; tempDiv.style.visibility = 'hidden'; tempDiv.style.width = '1px'; tempDiv.style.height = '1px'; tempDiv.style.overflow = 'hidden';
            
            // Benzersiz ID verdik ki çakışma olmasın
            let benzersizId = `mini-temp-${Math.random().toString(36).substring(7)}`;
            tempDiv.innerHTML = `<svg id="${benzersizId}" xmlns="http://www.w3.org/2000/svg">${temizKod}</svg>`;
            document.body.appendChild(tempDiv);
            
            let mBox = {x: 0, y: 0, width: 100, height: 100};
            try { 
                let m = document.getElementById(benzersizId).getBBox();
                if(m.width > 0) mBox = m;
            } catch(e){}
            document.body.removeChild(tempDiv);
            
            // Sol menü çizgileri 0.04'ten 0.015'e düşürüldü (İncecik oldu)
            let mStrW = Math.max((mBox.width + mBox.height) / 2 * 0.015, 0.5); 
            let padX = mBox.width * 0.1; let padY = mBox.height * 0.1;
            
            let miniSvg = `<svg viewBox="${mBox.x - padX} ${mBox.y - padY} ${mBox.width + padX*2} ${mBox.height + padY*2}" width="100%" height="100%">
                <g fill="none" stroke="#2c3e50" stroke-width="${mStrW}" stroke-linecap="round" stroke-linejoin="round">${temizKod}</g>
            </svg>`;
            
            let btn = document.createElement('div');
            btn.style = "width:75px; height:75px; border:2px solid #ecf0f1; border-radius:8px; cursor:pointer; background:#fff; padding:5px; display:flex; flex-direction:column; align-items:center; transition:0.2s;";
            btn.onmouseover = () => btn.style.borderColor = "#3498db";
            btn.onmouseout = () => btn.style.borderColor = "#ecf0f1";
            
            btn.innerHTML = `<div style="width:40px; height:40px; margin-bottom:5px;">${miniSvg}</div><span style="font-size:9px; color:#555; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%; font-weight:bold;" title="${kelime}">${kelime}</span>`;
            
            btn.onclick = () => vitrineAl(kelime);
            listeDiv.appendChild(btn);
        });
    }

    function svgYiKesikliCizgiyeCevir(hamKod, secilenStil = "dotted") {
        // 1. ASİT BANYOSU: SVG'nin içindeki inatçı kalınlık, renk ve dolgu ayarlarını söküp atıyoruz!
        let temizKod = hamKod
            .replace(/stroke-width="[^"]*"/gi, "")
            .replace(/stroke="[^"]*"/gi, "")
            .replace(/fill="[^"]*"/gi, "");

        let tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute'; tempDiv.style.visibility = 'hidden'; tempDiv.style.width = '1px'; tempDiv.style.height = '1px'; tempDiv.style.overflow = 'hidden';
        tempDiv.innerHTML = `<svg id="temp-svg" xmlns="http://www.w3.org/2000/svg">${temizKod}</svg>`;
        document.body.appendChild(tempDiv);
        
        let bbox = {x: 0, y: 0, width: 100, height: 100}; 
        try { 
            let olcum = document.getElementById('temp-svg').getBBox(); 
            if (olcum.width > 0 && olcum.height > 0) { bbox = olcum; }
        } catch(e){}
        document.body.removeChild(tempDiv);
        
        let vbX = bbox.x; let vbY = bbox.y; 
        let vbW = bbox.width; let vbH = bbox.height;
        let padX = vbW * 0.1; let padY = vbH * 0.1;
        let ortalamaBoyut = (vbW + vbH) / 2;
        
        let strW, dashAttr;

        // YENİ İNCECİK ZARİF MATEMATİK (Çarpanlar inanılmaz düşürüldü)
        if (secilenStil === "solid") {
            strW = Math.max(ortalamaBoyut * 0.005, 0.2); // BAYA BİR İNCELTİLDİ! Kalem ucu gibi.
            dashAttr = `stroke-dasharray="none"`;
        } else if (secilenStil === "dashed") {
            strW = Math.max(ortalamaBoyut * 0.008, 0.4); // İnce kesikler
            let cizgi = strW * 4;
            let bosluk = strW * 3;
            dashAttr = `stroke-dasharray="${cizgi}, ${bosluk}"`;
        } else {
            // dotted (Noktalı) 
            strW = Math.max(ortalamaBoyut * 0.015, 0.6); // Kibar yuvarlak noktalar
            let bosluk = strW * 3.5;
            dashAttr = `stroke-dasharray="0, ${bosluk}"`;
        }
        
        // 2. KUVVET UYGULAMASI: İçine <style> etiketi koyarak ne olursa olsun İNCE çizmeyi zorunlu kılıyoruz.
        let finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX - padX} ${vbY - padY} ${vbW + padX*2} ${vbH + padY*2}" width="100%" height="100%">
            <g fill="none" stroke="#2c3e50" stroke-width="${strW}" ${dashAttr} stroke-linecap="round" stroke-linejoin="round">
                ${temizKod}
            </g>
        </svg>`;
        
        return finalSvg;
    }

    function vitriniGuncelle() {
        if (seciliKutuphaneKelime) {
            vitrineAl(seciliKutuphaneKelime);
        }
    }

    function vitrineAl(kelime) {
        seciliKutuphaneKelime = kelime;
        
        // Arayüzdeki seçim kutusundan güncel stili oku
        let stil = "dotted";
        let secimler = document.getElementsByName('svg-stil-secim');
        for(let radio of secimler) { if(radio.checked) stil = radio.value; }
        
        let islenmisSvg = svgYiKesikliCizgiyeCevir(svgKutuphanesi[kelime], stil);
        
        document.getElementById('vitrin-baslik').innerText = "Önizleme: " + kelime.toUpperCase();
        document.getElementById('vitrin-kutu').innerHTML = `<div style="width:80%; height:80%;">${islenmisSvg}</div>`;
        
        let btn = document.getElementById('btn-kullan');
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
    }

    function seciliGorseliKullan() {
        if (!seciliKutuphaneKelime) return;
        
        let stil = "dotted";
        let secimler = document.getElementsByName('svg-stil-secim');
        for(let radio of secimler) { if(radio.checked) stil = radio.value; }
        
        let islenmisSvg = svgYiKesikliCizgiyeCevir(svgKutuphanesi[seciliKutuphaneKelime], stil);
        let dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(islenmisSvg);
        
        // EVRENSEL DAĞITICI MOTOR
        if (kutuphaneHedefTur === 'grid') {
            aktifGridResimleri[kutuphaneHedefIndex] = dataUrl;
        } 
        else if (kutuphaneHedefTur === 'tekli_bas') {
            aktifBaslangicResmiTek = dataUrl;
        } 
        else if (kutuphaneHedefTur === 'tekli_bit') {
            aktifBitisResmiTek = dataUrl;
        } 
        else if (kutuphaneHedefTur === 'spagetti_bas') {
            aktifBaslangicResimleri[kutuphaneHedefIndex] = dataUrl;
        } 
        else if (kutuphaneHedefTur === 'spagetti_bit') {
            aktifBitisResimleri[kutuphaneHedefIndex] = dataUrl;
        }

        basligiGuncelle(); 
        kutuphaneModaliKapat();
    }


    // --- GLOBAL ERİŞİM BAĞLANTILARI (LEGACY UYUMLULUK) ---
    // Sadece fonksiyonları dışa açıyoruz, state değişkenleri içeride kalıyor.
    global.kutuphaneModaliAc = kutuphaneModaliAc;
    global.kutuphaneModaliKapat = kutuphaneModaliKapat;
    global.kutuphanedeAra = kutuphanedeAra;
    global.svgYiKesikliCizgiyeCevir = svgYiKesikliCizgiyeCevir;
    global.vitriniGuncelle = vitriniGuncelle;
    global.vitrineAl = vitrineAl;
    global.seciliGorseliKullan = seciliGorseliKullan;

})(typeof window !== 'undefined' ? window : this);