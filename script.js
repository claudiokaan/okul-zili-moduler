                // --- 0.0. ÖZEL NESNE VE ÇOKLU GÖRSEL YÜKLEME HAFIZASI ---
                let aktifBaslangicResimleri = ["", "", "", "", ""];
                let aktifBitisResimleri = ["", "", "", "", ""];
                let aktifArkaplanResmi = "";

                let aktifBaslangicResmiTek = ""; 
                let aktifBitisResmiTek = "";

                
                // --- YENİ: GRİD (IZGARA) HAFIZASI VE OKUYUCUSU ---
    let aktifGridResimleri = {}; 
    let aktifGridMetinleri = {}; // YENİ: Yazı hafızası!

    

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

    // BÜYÜLÜ MATEMATİK MOTORU: SEÇİLEN STİLE GÖRE SVG'Yİ YENİDEN İNŞA EDER
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

    // YENİ: Radio butonlara tıklandıkça vitrini canlı canlı değiştiren tetikleyici
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



    function metinDegistiGrid(input, index) {
        aktifGridMetinleri[index] = input.value;
        basligiGuncelle(); // Yazdıkça önizlemeye anında yansıtır
    }

    function resmiCevirGrid(input, index) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                aktifGridResimleri[index] = e.target.result;
                basligiGuncelle(); // Resmi seçer seçmez önizlemeyi günceller
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function gridBoyutDegisti() {
        nesneYuklemeAlaniniGuncelle();
        basligiGuncelle();
    }

    // ==============================================================
    // YENİ: EVRENSEL DOODLE (SÜSLÜ ÇERÇEVE) MOTORU VE KÜTÜPHANESİ
    // ==============================================================
    const doodleKutuphanesi = {
        // KLASİK ŞEMALAR
        'modern': { k: 'M10,30 L10,20 Q10,10 20,10 L30,10', e: 'M0,10 L30,10' },
        'capraz': { k: 'M10,30 L10,20 L20,10 L30,10', e: 'M0,10 L30,10' },
        'bulut':  { k: 'M10,30 Q5,20 15,15 Q15,5 30,10', e: 'M0,10 Q15,0 30,10' },
        'solid':  { k: 'M10,30 L10,10 L30,10', e: 'M0,10 L30,10' },
        'dashed': { k: 'M10,30 L10,10 L30,10', e: 'M0,10 L10,10 M20,10 L30,10' },
        'dotted': { k: 'M10,30 L10,10 L30,10', e: 'M3,10 L3.1,10 M15,10 L15.1,10 M27,10 L27.1,10' },
        
        // 24 SÜSLÜ STİL (Görselden Birebir Çevrildi)
        'tek-gul':    { k: 'M10,30 L10,10 L30,10 M10,10 Q5,5 10,0 Q15,5 10,10', e: 'M0,10 L30,10' },
        'cicek1':     { k: 'M10,30 L10,10 L30,10 M10,10 A2,2 0 1,1 10.1,10 M10,20 A2,2 0 1,1 10.1,20 M20,10 A2,2 0 1,1 20.1,10', e: 'M0,10 L30,10 M15,10 A2,2 0 1,1 15.1,10' },
        'dalli':      { k: 'M10,30 L10,10 L30,10 M10,20 Q5,15 10,15 M10,15 Q15,10 10,10 M20,10 Q15,5 15,10', e: 'M0,10 L30,10 M15,10 Q10,5 10,10 M20,10 Q25,15 25,10' },
        'cicek2':     { k: 'M10,30 L10,10 L30,10 M10,10 Q5,5 10,0 Q15,5 10,10 M10,20 Q5,15 10,10 M20,10 Q15,5 10,10', e: 'M0,10 L30,10 M15,10 Q10,5 15,0 Q20,5 15,10' },
        'ok1':        { k: 'M10,30 L10,10 L30,10 M5,25 L10,30 L15,25 M25,5 L30,10 L25,15', e: 'M0,10 L30,10 M10,5 L15,10 L10,15 M20,5 L25,10 L20,15' },
        'ok2':        { k: 'M12,30 L12,12 L30,12 M8,30 L8,8 L30,8 M5,25 L10,30 L15,25', e: 'M0,12 L30,12 M0,8 L30,8 M10,5 L15,10 L10,15' },
        'ok3':        { k: 'M10,30 L10,10 L30,10 M5,20 L10,25 L15,20 M5,15 L10,20 L15,15 M20,5 L25,10 L20,15 M15,5 L20,10 L15,15', e: 'M0,10 L30,10 M5,5 L10,10 L5,15 M15,5 L20,10 L15,15' },
        'kalpok':     { k: 'M10,30 L10,10 L30,10 M5,20 Q0,15 5,15 Q10,15 10,20 Q10,15 15,15 Q20,15 15,20 M20,5 Q15,0 15,5 Q15,10 20,10 Q20,5 25,5', e: 'M0,10 L30,10 M10,5 Q5,0 5,5 Q5,10 10,10 Q10,5 15,5' },
        'klas1':      { k: 'M10,30 L10,10 L30,10 M10,10 Q0,10 0,0 Q10,0 10,10', e: 'M0,10 L30,10' },
        'klas2':      { k: 'M10,30 L10,10 L30,10 M10,20 Q0,20 0,10 Q10,0 20,10', e: 'M0,10 L30,10 M15,10 Q5,0 15,0 Q25,0 15,10' },
        'klas3':      { k: 'M10,30 L10,10 L30,10 M10,20 L5,20 L5,15 L15,15 L15,5 L20,5', e: 'M0,10 L15,10 L15,5 L25,5 L25,10 L30,10' },
        'helezon':    { k: 'M10,30 L10,15 Q0,15 0,5 Q15,0 15,10 L30,10', e: 'M0,10 L10,10 Q10,0 20,0 Q30,10 30,10' },
        'zarli':      { k: 'M10,30 L10,10 L30,10 M5,15 h10 v-10 h-10 Z M5,15 M7,12 L7.1,12 M13,8 L13.1,8', e: 'M0,10 L10,10 M10,5 h10 v10 h-10 Z M15,10 L15.1,10 M20,10 L30,10' },
        'klas4':      { k: 'M10,30 L10,10 L30,10 M10,20 A5,5 0 0,1 20,10', e: 'M0,10 L30,10 M5,10 A5,5 0 0,1 15,10 M15,10 A5,5 0 0,1 25,10' },
        'kalin1':     { k: 'M10,30 L10,10 L30,10 M5,20 L10,15 L15,20 L10,25 Z M15,10 L20,5 L25,10 L20,15 Z', e: 'M0,10 L30,10 M10,10 L15,5 L20,10 L15,15 Z' },
        'kalin2':     { k: 'M10,30 L10,10 L30,10 M6,25 L14,25 M6,20 L14,20 M15,6 L15,14 M20,6 L20,14', e: 'M0,10 L30,10 M10,6 L10,14 M20,6 L20,14' },
        'kalem':      { k: 'M10,30 L10,10 L30,10 M6,30 L10,25 L14,30 M6,25 L6,14 L14,14 L14,25 M14,14 L10,10 L14,6 M14,6 L25,6 L25,14 L14,14 M25,6 L30,10 L25,14', e: 'M0,6 L30,6 M0,14 L30,14 M0,10 L30,10' },
        'orumcek':    { k: 'M10,30 L10,10 L30,10 M10,10 L25,25 M10,20 Q15,15 20,10 M10,30 Q20,20 30,10', e: 'M0,10 L30,10 M15,10 L25,20 M5,10 L15,20' },
        'kalpli':     { k: 'M10,30 L10,10 L30,10 M10,20 Q5,15 10,10 Q15,15 10,20 M20,10 Q15,5 20,0 Q25,5 20,10', e: 'M0,10 L30,10 M15,10 Q10,5 15,0 Q20,5 15,10' },
        'suslemeli':  { k: 'M10,30 L10,10 L30,10 M10,10 L5,5 A2,2 0 1,1 5.1,5 M10,20 L5,20 A1,1 0 1,1 5.1,20 M20,10 L20,5 A1,1 0 1,1 20.1,5', e: 'M0,10 L30,10 M15,10 L15,5 A2,2 0 1,1 15.1,5' },
        'cicekkenar': { k: 'M10,30 L10,10 L30,10 M10,20 A10,10 0 0,1 20,10 M10,15 L15,15 M15,10 L15,15', e: 'M0,10 L30,10 M0,10 A15,15 0 0,1 30,10' },
        'cetvel':     { k: 'M10,30 L10,10 L30,10 M10,25 L15,25 M10,20 L18,20 M10,15 L15,15 M15,10 L15,15 M20,10 L20,18 M25,10 L25,15', e: 'M0,10 L30,10 M5,10 L5,15 M10,10 L10,18 M15,10 L15,15 M20,10 L20,18 M25,10 L25,15' },
        'pecete':     { k: 'M10,30 L10,10 L30,10 M10,30 Q5,20 10,10 Q20,5 30,10 M5,20 A1,1 0 1,1 5.1,20 M20,5 A1,1 0 1,1 20.1,5', e: 'M0,10 L30,10 M0,10 Q15,0 30,10 M15,5 A1,1 0 1,1 15.1,5' },
        'origamik':   { k: 'M10,30 L10,10 L30,10 M10,20 L20,10 M10,30 L30,10 M10,10 L20,20', e: 'M0,10 L30,10 M0,0 L15,10 L30,0' },
    };

    function olusturBorderImage(temaId, stilId, renk) {
        let koseData = doodleKutuphanesi[temaId] || doodleKutuphanesi['modern'];
        let kenarData = doodleKutuphanesi[stilId] || doodleKutuphanesi['solid'];
        let stw = (stilId === 'dotted' || stilId === 'suslu') ? 3 : 2.5; // Noktalılar için kalınlık
        let lineCap = (stilId === 'dotted' || stilId === 'suslu') ? "round" : "butt";

        let svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90"><g fill="none" stroke="${renk}" stroke-width="${stw}" stroke-linecap="${lineCap}" stroke-linejoin="round"><g transform="translate(0,0)"><path d="${koseData.k}"/></g><g transform="translate(90,0) rotate(90)"><path d="${koseData.k}"/></g><g transform="translate(90,90) rotate(180)"><path d="${koseData.k}"/></g><g transform="translate(0,90) rotate(270)"><path d="${koseData.k}"/></g><g transform="translate(30,0)"><path d="${kenarData.e}"/></g><g transform="translate(90,30) rotate(90)"><path d="${kenarData.e}"/></g><g transform="translate(60,90) rotate(180)"><path d="${kenarData.e}"/></g><g transform="translate(0,60) rotate(270)"><path d="${kenarData.e}"/></g></g></svg>`;
        
        // YENİ: Hata verdiren utf8 formatı düzeltildi, tam güvenli şifreleme!
        return "data:image/svg+xml," + encodeURIComponent(svgStr);
    }

    function secimMenuHTML(seciliDeger, tip) {
        let m = `
            <option value="modern" ${seciliDeger==='modern'?'selected':''}>1. Şema: Modern</option>
            <option value="capraz" ${seciliDeger==='capraz'?'selected':''}>2. Şema: Çapraz Yaprak</option>
            <option value="bulut" ${seciliDeger==='bulut'?'selected':''}>3. Şema: Bulut</option>
            <option value="solid" ${seciliDeger==='solid'?'selected':''}>Düz Çizgi</option>
            <option value="dashed" ${seciliDeger==='dashed'?'selected':''}>Kesikli Çizgi</option>
            <option value="dotted" ${seciliDeger==='dotted'?'selected':''}>Noktalı Çizgi</option>
            <optgroup label="✨ Süslü (Doodle) Stiller">`;
        const susluIsimler = ['tek-gul','cicek1','dalli','cicek2','ok1','ok2','ok3','kalpok','klas1','klas2','klas3','klas4','helezon','zarli','kalin1','kalin2','kalem','orumcek','kalpli','suslemeli','cicekkenar','cetvel','pecete','origamik'];
        const susluEtiketler = ['Süslü Tek Gül','Süslü Çiçekli 1','Süslü Dallı','Süslü Çiçekli 2','Süslü Oklu 1','Süslü Oklu 2','Süslü Oklu 3','Süslü Kalpli Oklu','Süslü Klasik 1','Süslü Klasik 2','Süslü Klasik 3','Süslü Klasik 4','Süslü Helezon','Süslü Zarlı','Süslü Kalın 1','Süslü Kalın 2','Süslü Kalem','Süslü Örümcek Ağı','Süslü Kalpli','Süslü Süslemeli','Süslü Çiçek Kenarlı','Süslü Cetvelli','Süslü Peçete Kenarlı','Süslü Origamik'];
        for(let i=0; i<24; i++){ m += `<option value="${susluIsimler[i]}" ${seciliDeger===susluIsimler[i]?'selected':''}>${susluEtiketler[i]}</option>`; }
        m += `</optgroup>`; return m;
    }


    


                // --- ANA HAFIZA VE KISAYOLLAR BURADA ---
                let kagitIcerigi = [];
                let genelSatirBoslugu = 15; // Kağıdın ilk açılıştaki standart alt boşluğu

                // MEB 2024 Yeni Müfredat Harf Grupları (ANETİL...)
                const mebHarfSirasiBuyuk = ['A','N','E','T','İ','L','O','K','U','R','I','M','Ü','S','Ö','Y','D','Z','Ç','B','G','C','Ş','P','H','V','Ğ','F','J'];
                const mebHarfSirasiKucuk = ['a','n','e','t','i','l','o','k','u','r','ı','m','ü','s','ö','y','d','z','ç','b','g','c','ş','p','h','v','ğ','f','j'];


                function isSatirCizgisi(k) {
                    if(!k) return false;
                    
                    // FİX: ".includes" mantığı tamamen iptal edildi! 
                    // Sadece birebir tam eşleşen (Exact Match) konulara çizgi izni verilir.
                    const kesinCizgiKonulari = [
                        "Dikey Çizgiler",
                        "Yatay Çizgiler",
                        "Dikey, çapraz (sağa yatık ve sola yatık - / \\ ) çizgiler",
                        "Satıra aralığında yatay, dikey, çapraz (sağa yatık ve sola yatık - / \\ ) çizgiler",
                        "Dağ şekilli çizgiler",
                        "Satır aralığında dağ şekilli çizgiler",
                        "Sola/sağa bakan ok ucu şekilli çizgiler",
                        "Satır aralığında sola/sağa bakan ok ucu şekilli çizgiler",
                        "Büyük O, büyük C ve büyük ters C şekilli çizgiler",
                        "Satır aralığında büyük O, büyük C and büyük ters C şekilli çizgiler",
                        "Büyük U, büyük ters U, büyük S, büyük J çalışmaları",
                        "Satır aralığında büyük U, büyük ters U, büyük S, büyük J çalışmaları",
                        "Kavisli/Dalga Çizgiler",
                        "Sürekli Yuvarlama ve Helezon Çizgileri",
                        "Boş Satır"
                    ];
                    
                    return kesinCizgiKonulari.includes(k);
                }

                function generateLiveRowSVG(konu, detaylar) {
                    let kilavuzAktif = detaylar.includes("Kılavuz Çizgi Ekle");
                    let dPath = "";
                    let bosluk = 45; 
                    
                    // Kılavuz kutusu orijinal ve SABİT oranları (20 ve 76)
                    let yTop = 20, yMid = 48, yBot = 76;
                    let yLineTop = 22, yLineBot = 74; 
                    
                    // TÜM GÜVENLİK DEĞİŞKENLERİ EN BAŞTA (Burayı eksik etmemek çok önemli)
                    let isDikey = konu.includes("Dikey") || konu.includes("dikey");
                    let isCapraz = konu.includes("Çapraz") || konu.includes("çapraz");
                    let isOkUcu = konu.includes("Ok") || konu.includes("ok");
                    let isDag = konu.includes("Dağ") || konu.includes("dağ");
                    let isOC = konu.includes("Büyük O") || konu.includes("büyük O") || konu.includes("O,") || konu.includes("o, c") || konu.includes("O, C");
                    let isU = konu.includes("Büyük U") || konu.includes("büyük u") || konu.includes("büyük U");
                    let isKavisli = konu.includes("Kavisli") || konu.includes("kavisli");
                    let isYuvarlama = konu.includes("Yuvarlama") || konu.includes("Helezon"); // YENİ EKLENEN MOTORUN ŞALTERİ

                    // 1. DİKEY, ÇAPRAZ ve OK UÇLARI MOTORU
                    if (isDikey || isCapraz || isOkUcu) {
                        let sefSecim = [];
                        if (detaylar.includes("Dikey")) sefSecim.push("dikey");
                        if (detaylar.includes("Sağa Yatık ( / )")) sefSecim.push("saga");
                        if (detaylar.includes("Sola Yatık ( \\ )")) sefSecim.push("sola");
                        if (detaylar.includes("Sağa Bakan (>)")) sefSecim.push("sagok");
                        if (detaylar.includes("Sola Bakan (<)")) sefSecim.push("solok");
                        
                        if (sefSecim.length === 0) {
                            if (isOkUcu) sefSecim = ["sagok"];
                            else if (isCapraz) sefSecim = ["saga"];
                            else sefSecim = ["dikey"];
                        }
                        
                        let counter = 0;
                        for (let x = 30; x <= 570; x += bosluk) {
                            let mod = sefSecim[counter % sefSecim.length];
                            
                            if (mod === "dikey") dPath += `M ${x},${yLineTop} L ${x},${yLineBot} `;
                            else if (mod === "saga") dPath += `M ${x-15},${yLineBot} L ${x+15},${yLineTop} `;
                            else if (mod === "sola") dPath += `M ${x-15},${yLineTop} L ${x+15},${yLineBot} `;
                            else if (mod === "sagok") dPath += `M ${x-10},${yLineTop+10} L ${x+10},${yMid} M ${x+10},${yMid} L ${x-10},${yLineBot-10} `; 
                            else if (mod === "solok") dPath += `M ${x+10},${yLineTop+10} L ${x-10},${yMid} M ${x-10},${yMid} L ${x+10},${yLineBot-10} `; 
                            counter++;
                        }
                    } 
                    // 2. DAĞ ŞEKİLLERİ MOTORU
                    else if (isDag) {
                        let x = 5; 
                        while (x < 580) {
                            dPath += `M ${x},${yLineBot} L ${x+20},${yLineTop} M ${x+20},${yLineTop} L ${x+40},${yLineBot} M ${x+40},${yLineBot} L ${x+50},${yMid} M ${x+50},${yMid} L ${x+60},${yLineBot} `;
                            x += 60; 
                        }
                    } 
                    // 3. O, C VE TERS C MOTORU
                    else if (isOC) {
                        let sefSecim = [];
                        if (detaylar.includes("O Şekli")) sefSecim.push("O");
                        if (detaylar.includes("C Şekli")) sefSecim.push("C");
                        if (detaylar.includes("Ters C Şekli")) sefSecim.push("TersC");
                        
                        if (sefSecim.length === 0) sefSecim = ["O"]; 
                        
                        let isKucuk = detaylar.includes("Küçük Boyut");
                        let topY = isKucuk ? yMid : yLineTop;
                        let botY = yLineBot;
                        let rY = (botY - topY) / 2;
                        let rX = isKucuk ? 10 : 16; 
                        let cOffset = isKucuk ? 6 : 10;
                        
                        let counter = 0;
                        for (let x = 35; x <= 565; x += 40) {
                            let mod = sefSecim[counter % sefSecim.length];
                            if (mod === "O") dPath += `M ${x},${topY} A ${rX},${rY} 0 1,0 ${x},${botY} A ${rX},${rY} 0 1,0 ${x},${topY} `;
                            else if (mod === "C") dPath += `M ${x+cOffset},${topY} A ${rX},${rY} 0 0,0 ${x+cOffset},${botY} `;
                            else if (mod === "TersC") dPath += `M ${x-cOffset},${topY} A ${rX},${rY} 0 0,1 ${x-cOffset},${botY} `;
                            counter++;
                        }
                    } 
                    // 4. BÜYÜK U, TERS U, S VE J MOTORU
                    else if (isU) {
                        let sefSecim = [];
                        if (detaylar.includes("Büyük U")) sefSecim.push("U");
                        if (detaylar.includes("Büyük Ters U")) sefSecim.push("TersU");
                        if (detaylar.includes("Büyük S")) sefSecim.push("S");
                        if (detaylar.includes("Büyük Ters S")) sefSecim.push("TersS");
                        if (detaylar.includes("Büyük J")) sefSecim.push("J");
                        if (detaylar.includes("Omuz Omuza U")) sefSecim.push("OmuzOmuzaU");
                        
                        if (sefSecim.length === 0) sefSecim = ["U"]; 
                        
                        let counter = 0;
                        for (let x = 35; x <= 565; x += 50) { 
                            let mod = sefSecim[counter % sefSecim.length];
                            
                            if (mod === "U") {
                                dPath += `M ${x},${yLineTop} L ${x},${yLineBot-13} M ${x},${yLineBot-13} A 13,13 0 0,0 ${x+26},${yLineBot-13} M ${x+26},${yLineBot-13} L ${x+26},${yLineTop} `;
                            } else if (mod === "TersU") {
                                dPath += `M ${x},${yLineBot} L ${x},${yLineTop+13} M ${x},${yLineTop+13} A 13,13 0 0,1 ${x+26},${yLineTop+13} M ${x+26},${yLineTop+13} L ${x+26},${yLineBot} `;
                            } else if (mod === "J") {
                                dPath += `M ${x+15},${yLineTop} L ${x+15},${yLineBot-10} M ${x+15},${yLineBot-10} A 10,10 0 0,1 ${x-5},${yLineBot-5} `;
                            } else if (mod === "S") {
                                dPath += `M ${x+18},${yLineTop+6} A 9,12 0 0,0 ${x+2},${yLineTop+13} C ${x+2},${yMid+2} ${x+18},${yMid-2} ${x+18},${yLineBot-13} A 9,12 0 0,1 ${x+2},${yLineBot-6} `;
                            } else if (mod === "TersS") {
                                dPath += `M ${x+2},${yLineTop+6} A 9,12 0 0,1 ${x+18},${yLineTop+13} C ${x+18},${yMid+2} ${x+2},${yMid-2} ${x+2},${yLineBot-13} A 9,12 0 0,0 ${x+18},${yLineBot-6} `;
                            } else if (mod === "OmuzOmuzaU") {
                                dPath += `M ${x},${yLineTop} L ${x},${yLineBot-13} A 12.5,13 0 0,0 ${x+25},${yLineBot-13} L ${x+25},${yLineTop} L ${x+25},${yLineBot-13} A 12.5,13 0 0,0 ${x+50},${yLineBot-13} L ${x+50},${yLineTop} `;
                            }
                            counter++;
                        }
                    }
                    // 5. KAVİSLİ / OKYANUS DALGASI MOTORU
                    else if (isKavisli) {
                        let sefSecim = [];
                        if (detaylar.includes("Normal Dalga")) sefSecim.push("Normal");
                        if (detaylar.includes("Ters Dalga")) sefSecim.push("Ters");
                        
                        if (sefSecim.length === 0) sefSecim = ["Normal"];
                        
                        let counter = 0;
                        let x = 5; 
                        while (x < 550) {
                            let mod = sefSecim[counter % sefSecim.length];
                            
                            if (mod === "Normal") {
                                dPath += `M ${x},${yLineBot} C ${x+10},${yLineBot} ${x+20},${yLineTop} ${x+35},${yLineTop} `;
                                dPath += `M ${x+35},${yLineTop} C ${x+30},${yLineTop} ${x+25},${yLineBot} ${x+50},${yLineBot} `;
                            } else if (mod === "Ters") {
                                dPath += `M ${x},${yLineTop} C ${x+10},${yLineTop} ${x+20},${yLineBot} ${x+35},${yLineBot} `;
                                dPath += `M ${x+35},${yLineBot} C ${x+30},${yLineBot} ${x+25},${yLineTop} ${x+50},${yLineTop} `;
                            }
                            
                            x += 50; 
                            counter++;
                        }
                    } 
                    // 6. SÜREKLİ YUVARLAMA VE HELEZON MOTORU (Fotoğraflardaki Döngüler)
                    else if (isYuvarlama) {
                        let sefSecim = [];
                        if (detaylar.includes("Küçük Tepe")) sefSecim.push("KucukTepe");
                        if (detaylar.includes("Büyük Tepe")) sefSecim.push("BuyukTepe");
                        if (detaylar.includes("Küçük Helezon (e)")) sefSecim.push("KucukHelezon");
                        if (detaylar.includes("Büyük Helezon (l)")) sefSecim.push("BuyukHelezon");
                        if (detaylar.includes("Yatık Helezon")) sefSecim.push("YatikHelezon");
                        if (detaylar.includes("Kurdele Döngü")) sefSecim.push("Kurdele");
                        
                        if (sefSecim.length === 0) sefSecim = ["KucukHelezon"]; // Varsayılan Şekil
                        
                        let counter = 0;
                        let x = 5; 
                        while (x < 560) {
                            let mod = sefSecim[counter % sefSecim.length];
                            let step = 30; 
                            
                            if (mod === "KucukTepe") {
                                dPath += `M ${x},${yLineBot} C ${x+5},${yLineBot} ${x+5},${yMid} ${x+15},${yMid} C ${x+25},${yMid} ${x+25},${yLineBot} ${x+30},${yLineBot} `;
                                step = 30;
                            } else if (mod === "BuyukTepe") {
                                dPath += `M ${x},${yLineBot} C ${x+5},${yLineBot} ${x+5},${yLineTop} ${x+15},${yLineTop} C ${x+25},${yLineTop} ${x+25},${yLineBot} ${x+30},${yLineBot} `;
                                step = 30;
                            } else if (mod === "KucukHelezon") {
                                dPath += `M ${x},${yLineBot} C ${x+25},${yLineBot-5} ${x+25},${yMid} ${x+15},${yMid} C ${x+5},${yMid} ${x+5},${yLineBot} ${x+30},${yLineBot} `;
                                step = 30;
                            } else if (mod === "BuyukHelezon") {
                                dPath += `M ${x},${yLineBot} C ${x+25},${yLineBot-5} ${x+25},${yLineTop} ${x+15},${yLineTop} C ${x+5},${yLineTop} ${x+5},${yLineBot} ${x+30},${yLineBot} `;
                                step = 30;
                            } else if (mod === "YatikHelezon") {
                                dPath += `M ${x},${yLineBot} C ${x+20},${yLineBot-2} ${x+20},${yMid} ${x+12},${yMid} C ${x+4},${yMid} ${x+4},${yLineBot} ${x+20},${yLineBot} `;
                                step = 20;
                            } else if (mod === "Kurdele") {
                                dPath += `M ${x},${yLineBot} C ${x+30},${yLineBot} ${x+40},${yLineTop} ${x+25},${yLineTop} C ${x+10},${yLineTop} ${x+10},${yLineBot} ${x+40},${yLineBot} `;
                                step = 40;
                            }
                            
                            x += step; 
                            counter++;
                        }
                    }
                    // FALLBACK (Eski sabit kütüphane için)
                    else {
                        let rawSvg = cizgiKutuphanesi[konu] || "";
                        let match = rawSvg.match(/d="([^"]+)"/);
                        if (match) dPath = match[1];
                    }

                    // FONT VE KILAVUZU BAS
                    let strokeDash = detaylar.includes("Kesikli Çizgi") ? "6, 4" : (detaylar.includes("Noktalı Çizgi") ? "0, 3.5" : "none");
                    let strokeColor = detaylar.includes("Noktalı Çizgi") ? "#333" : "#2c3e50";
                    let strokeWidth = detaylar.includes("Noktalı Çizgi") ? "1.5" : "2.5";
                    let strokeOpacity = detaylar.includes("Hayalet Çizgi") ? "0.15" : "1";
                    let kilavuzLines = kilavuzAktif ? `
                        <rect x="0" y="${yMid}" width="600" height="${yBot - yMid}" fill="#fff4cc" />
                        <rect x="0" y="${yTop}" width="600" height="${yBot - yTop}" fill="none" stroke="#2c3e50" stroke-width="1.5" />
                        <line x1="0" y1="${yMid}" x2="600" y2="${yMid}" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5, 5" />` : "";


                    return `<div style="width: 100%; height: 96px;"><svg width="100%" height="100%" viewBox="0 0 600 96" preserveAspectRatio="none" style="overflow: visible;">${kilavuzLines}<path d="${dPath}" fill="none" stroke="${strokeColor}" stroke-opacity="${strokeOpacity}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${strokeDash}" /></svg></div>`;
                }



                // --- KILAVUZ ÇİZGİ GRUBU VE FONKSİYONU ---
                const satirAraligiCizgileri = [
                    "Dikey Çizgiler", "Yatay Çizgiler", 
                    "Satıra aralığında yatay, dikey, çapraz (sağa yatık ve sola yatık - / \\ ) çizgiler", 
                    "Satır aralığında dağ şekilli çizgiler", 
                    "Satır aralığında sola/sağa bakan ok ucu şekilli çizgiler", 
                    "Satır aralığında büyük O, büyük C and büyük ters C şekilli çizgiler", 
                    "Satır aralığında büyük U, büyük ters U, büyük S, büyük J çalışmaları"
                ];

                function kilavuzSatirSayisiDegistir(index, yeniSayi) {
                    kagitIcerigi[index].satirSayisi = parseInt(yeniSayi);
                    document.getElementById(`satir-sayisi-deger-${index}`).innerText = `${yeniSayi} Adet`; 
                    kagidiCiz(); 
                }



                document.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); geriAl(); }
                    if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) { e.preventDefault(); ileriAl(); }
                });

                function resmiCevirTekli(input, tur) {
                    if (input.files && input.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            if (tur === 'baslangic') aktifBaslangicResmiTek = e.target.result;
                            if (tur === 'bitis') aktifBitisResmiTek = e.target.result;
                            if (tur === 'arkaplan') aktifArkaplanResmi = e.target.result; // YENİ EKLENEN SATIR
                        };
                        reader.readAsDataURL(input.files[0]);
                    }
                }

                function resmiCevirSpagetti(input, tur, idx) {
                    if (input.files && input.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            if (tur === 'baslangic') aktifBaslangicResimleri[idx] = e.target.result;
                            if (tur === 'bitis') aktifBitisResimleri[idx] = e.target.result;
                            if (tur === 'arkaplan') aktifArkaplanResmi = e.target.result;
                        };
                        reader.readAsDataURL(input.files[0]);
                    }
                }

                // --- ORTA SÜTUNDAN CANLI RESİM DEĞİŞTİRME MOTORU ---
                function aktifResimDegistir(index, tur, input) {
                    if (input.files && input.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            if(tur === 'baslangic') kagitIcerigi[index].baslangicResmi = e.target.result;
                            if(tur === 'bitis') kagitIcerigi[index].bitisResmi = e.target.result;
                            if(tur === 'arkaplan') kagitIcerigi[index].arkaplanResmi = e.target.result; // YENİ EKLENDİ
                            kagidiCiz(); 
                        };
                        reader.readAsDataURL(input.files[0]);
                    }
                }

                // --- 1. SÜTUNDAKİ GÖRSEL YÜKLEME PANELİNİ DİNAMİK YARATAN MOTOR ---
    function nesneYuklemeAlaniniGuncelle() {
        const nesneYuklemeAlani = document.getElementById('nesne-yukleme-alani');
        if (!nesneYuklemeAlani) return;

        
        
        const konuSecimi = document.getElementById('konu-secimi') ? document.getElementById('konu-secimi').value : '';
        const soruTipiSecimi = document.getElementById('soru-tipi-secimi') ? document.getElementById('soru-tipi-secimi').value : '';

        // Panelin görünürlük kontrolü
        const gecerliSoruTipleri = ["Sesi Barındıranı İşaretleme", "Sesi Barındıranı Boyama", "Sesin Konumunu Bulma", "Gizli Harf Bulma", "Ses Sayısı Kadar Yazma", "Okuduğunu Boyama/Tamamlama", "Mantıksal İşaretleme"];
        const gecerliKonular = [
            "Bir nesneden başlayıp başka bir nesneye doğru rastgele (ama üst üste binmeyen) çizgiler", 
            "Labirent Çalışmaları", 
            "Karmaşık Yol/Eşleştirme Çalışmaları (Spagetti Labirent)", 
            "Hece Birleştirme", 
            "Kelime Birleştirme", 
            "Cümle Oluşturma", 
            "Heceye Ayırma", 
            "Kelimeye Ayırma", 
            "Kılavuz Çizgiye Serbest Yazı", 
            "Otomatik Çengel Bulmaca", 
            "Kelime Avı (Sözcük Bulmaca)", 
            "Şifreli Mesaj (Gizli Cümle)", 
            "Harf Karıştırmaca",
            "Labirentten Kelime Toplama",
            "Kelime Zinciri (Yılan Bulmaca)",
            "Mini Sudoku (4x4)",
            "Cümle-Görsel İlişkisi",
            "Yönerge Takibi (Okuduğunu Uygulama)", 
            "Hikaye Kurgusu ve Analiz", 
            "Metin İçi Mantık",
            "Okuma ve Yazma Pratiği"
        ];
        const secilenOzl = Array.from(document.querySelectorAll('input[name="ozellik"]:checked')).map(el => el.value);
        const gorselBoyamaMi = soruTipiSecimi === "Dış Hat Boyama" && secilenOzl.includes("Görsel Boyama");

        if (gecerliKonular.includes(konuSecimi) || gecerliSoruTipleri.includes(soruTipiSecimi) || gorselBoyamaMi) {            
            nesneYuklemeAlani.style.display = "block";
        } else {
            nesneYuklemeAlani.style.display = "none";
            return;
        }

        // =========================================================
        // 1. HECE VE KELİME BİRLEŞTİRME PANELİ (Akıllı Tire Sistemi)
        // =========================================================
        if (konuSecimi === "Hece Birleştirme" || konuSecimi === "Kelime Birleştirme") {
            // Kelime Birleştirme ise 15 harf hakkı ver, Hece ise menüden (örn: 3) sayıyı al.
            let maxHarf = parseInt(soruTipiSecimi) || (konuSecimi === "Kelime Birleştirme" ? 15 : 2); 
            let curMetin = aktifGridMetinleri[0] || "";
            let etiketYazi = konuSecimi === "Kelime Birleştirme" ? "Birleştirilecek Kelimeyi Yazın:" : "Birleştirilecek Heceyi Yazın:";
            let placeholderYazi = konuSecimi === "Kelime Birleştirme" ? "Örn: o-kul veya bil-gi-sa-yar" : "Örn: k-al";

            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #4DB8FF;">
                <label style="font-size: 11px; font-weight: bold; color: #e67e22;">🎨 Kutu Şeması (Köşe):</label>
                <select id="kutu-temasi-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                    ${secimMenuHTML("modern", "tema")}
                </select>
                <label style="font-size: 11px; font-weight: bold; color: #e67e22;">✍️ Kenar Çizgisi:</label>
                <select id="kenar-stili-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                    ${secimMenuHTML("solid", "stil")}
                </select>
            </div>
            <div style="margin-bottom: 10px; background: #e8f4f8; padding: 10px; border-radius: 6px; border: 1px solid #3498db;">
                <label style="font-size: 11px; font-weight: bold; color: #2980b9;">📝 ${etiketYazi}</label>
                <input type="text" oninput="let v=this.value.replace(/-+/g, '-').replace(/^-/, ''); let c='', hc=0; for(let char of v){ if(char==='-'){c+='-';} else if(hc<${maxHarf}){c+=char; hc++;} } this.value=c; aktifGridMetinleri[0]=c; basligiGuncelle();" value="${curMetin}" placeholder="${placeholderYazi}" style="width: 100%; font-size: 14px; padding: 8px; border: 1px solid #3498db; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; text-align: center; letter-spacing: 2px; text-transform: lowercase;">
                <div style="font-size: 9.5px; color: #e74c3c; margin-top: 6px; text-align: center; font-weight:bold;">Kutuların bölünmesini istediğiniz yerlere tire (-) koyun.<br>Maks. ${maxHarf} harf girebilirsiniz (Tireler hariç).</div>
            </div>`;
            return;
        }   


        // =========================================================
        // YENİ: KILAVUZ ÇİZGİYE SERBEST YAZI PANELİ
        // =========================================================
        if (konuSecimi === "Kılavuz Çizgiye Serbest Yazı") {
            let curMetin = aktifGridMetinleri[0] || "";
            let resimAlaniHtml = "";
            
            // Eğer resimli yazı seçildiyse görsel ekleme butonlarını getir
            if (soruTipiSecimi === "Yanına Resimli Yazı") {
                resimAlaniHtml = `
                <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #4DB8FF;">
                    <label style="font-size: 11px; font-weight: bold; color: #2f3640;">🖼️ Yanına Eklenecek Görsel:</label>
                    <div style="display: flex; gap: 4px; margin-top: 4px;">
                        <button onclick="kutuphaneModaliAc(0, 'tekli_bas')" style="flex: 1; font-size: 10px; padding: 6px; background: #9b59b6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🔍 Kütüphane</button>
                        <input type="file" onchange="resmiCevirTekli(this, 'baslangic')" style="flex: 1; font-size: 9px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                </div>`;
            }

            nesneYuklemeAlani.innerHTML = `
            ${resimAlaniHtml}
            <div style="margin-bottom: 10px; background: #e8f4f8; padding: 10px; border-radius: 6px; border: 1px solid #3498db;">
                <label style="font-size: 11px; font-weight: bold; color: #2980b9;">📝 Yazdırılacak Metni Girin:</label>
                <input type="text" maxlength="60" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" value="${curMetin}" placeholder="Örn: Atatürk" style="width: 100%; font-size: 14px; padding: 8px; border: 1px solid #3498db; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; text-align: center; letter-spacing: 1px;">
                <div style="font-size: 9.5px; color: #7f8c8d; margin-top: 6px; text-align: center;">Hece, kelime veya cümle yazabilirsiniz (Maks 60 karakter).</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: OTOMATİK ÇENGEL BULMACA PANELİ (KENDİ GÖRSELİNİ YÜKLE)
        // =========================================================
        if (konuSecimi === "Otomatik Çengel Bulmaca") {
            let curMetin = aktifGridMetinleri[0] || "";
            let kelimeDizisi = curMetin.split(',').map(k => k.trim()).filter(k => k.length > 1);
            
            // Eğer "Nesneli Bulmaca" seçiliyse her kelime için bir dosya yükleme kutucuğu bas!
            let resimYuklemeAlanlari = "";
            if (soruTipiSecimi === "Nesneli Bulmaca" && kelimeDizisi.length > 0) {
                resimYuklemeAlanlari = `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e67e22;">
                    <label style="font-size: 11px; font-weight: bold; color: #d35400; display:block; margin-bottom:2px;">🖼️ Nesne Görselleri (İsteğe Bağlı):</label>
                    <div style="font-size: 9.5px; color: #e74c3c; margin-bottom: 8px; font-weight: bold;">(Arka planı şeffaf .png tercih sebebidir)</div>
                    <div style="display: flex; flex-direction: column; gap: 5px; max-height: 180px; overflow-y: auto; padding-right: 5px;">
                `;
                kelimeDizisi.forEach((kelime, idx) => {
                    let bgCol = aktifGridResimleri[idx] ? "#d4edda" : "#fff"; // Resim yüklendiyse yeşil yakar
                    resimYuklemeAlanlari += `
                    <div style="display: flex; align-items: center; justify-content: space-between; background: ${bgCol}; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px;">
                        <span style="font-size: 10px; font-weight: bold; color: #2c3e50; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${kelime}</span>
                        <input type="file" accept="image/*" onchange="resmiCevirGrid(this, ${idx})" style="width: 140px; font-size: 9px;">
                    </div>`;
                });
                resimYuklemeAlanlari += `</div></div>`;
            }

            // DİKKAT: onblur eklendi ki kelime yazarken zırt pırt yeniden çizilip odağı bozmasın!
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #fff3e0; padding: 10px; border-radius: 6px; border: 1px solid #e67e22;">
                <label style="font-size: 11px; font-weight: bold; color: #d35400;">🧩 Bulmaca İçin Kelimeleri Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: ütü, tünel, ünlü, ülke, tül" style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #e67e22; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #7f8c8d; margin-top: 6px; text-align: center;">Kelimeleri virgülle (,) ayırın.<br>Yazmayı bitirip <b>boşluğa tıkladığınızda</b> resim menüsü açılır.</div>
                ${resimYuklemeAlanlari}
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: KELİME AVI (SÖZCÜK BULMACA) PANELİ
        // =========================================================
        if (konuSecimi === "Kelime Avı (Sözcük Bulmaca)") {
            let curMetin = aktifGridMetinleri[0] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #e8f8f5; padding: 10px; border-radius: 6px; border: 1px solid #1abc9c;">
                <label style="font-size: 11px; font-weight: bold; color: #16a085;">🕵️‍♂️ Gizlenecek Kelimeleri Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: kök, örtü, önlük, kömür, örnek" style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #1abc9c; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #7f8c8d; margin-top: 6px; text-align: center;">Kelimeleri virgülle (,) ayırarak yazın.<br>Sistem boyutu otomatik ayarlayacaktır.</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: ŞİFRELİ MESAJ (GÖRSEL DESTEKLİ) PANELİ
        // =========================================================
        if (konuSecimi === "Şifreli Mesaj (Gizli Cümle)") {
            let curMetin = aktifGridMetinleri[0] || "";
            let orjinalMetin = curMetin.toLocaleUpperCase('tr-TR');
            let benzersizHarfler = [...new Set(orjinalMetin.replace(/[^A-ZÇĞIİÖŞÜ]/g, '').split(''))];

            let resimYuklemeAlanlari = "";
            if (soruTipiSecimi === "Nesne Şifreli" && benzersizHarfler.length > 0) {
                resimYuklemeAlanlari = `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #9b59b6;">
                    <label style="font-size: 11px; font-weight: bold; color: #8e44ad; display:block; margin-bottom:2px;">🖼️ Harf Görselleri (İsteğe Bağlı):</label>
                    <div style="font-size: 9.5px; color: #e74c3c; margin-bottom: 8px; font-weight: bold;">(Arka planı şeffaf .png tercih sebebidir)</div>
                    <div style="display: flex; flex-direction: column; gap: 5px; max-height: 180px; overflow-y: auto; padding-right: 5px;">
                `;
                // Her farklı harf için 1 tane dosya yükleme kutusu oluştur!
                benzersizHarfler.forEach((harf, idx) => {
                    let bgCol = aktifGridResimleri[idx] ? "#d4edda" : "#fff";
                    resimYuklemeAlanlari += `
                    <div style="display: flex; align-items: center; justify-content: space-between; background: ${bgCol}; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px;">
                        <span style="font-size: 11px; font-weight: bold; color: #2c3e50; width: 30px; text-align:center;">${harf}</span>
                        <input type="file" accept="image/*" onchange="resmiCevirGrid(this, ${idx})" style="width: 140px; font-size: 9px;">
                    </div>`;
                });
                resimYuklemeAlanlari += `</div></div>`;
            }

            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #f4ecf7; padding: 10px; border-radius: 6px; border: 1px solid #9b59b6;">
                <label style="font-size: 11px; font-weight: bold; color: #8e44ad;">🕵️‍♀️ Gizlenecek Cümleyi / Mesajı Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: ATATÜRK ÇOK BÜYÜKTÜR" style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #9b59b6; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #7f8c8d; margin-top: 6px; text-align: center;">Yazmayı bitirip <b>boşluğa tıkladığınızda</b> nesne menüsü açılır.</div>
                ${resimYuklemeAlanlari}
            </div>`;
            return;
        }


        // YENİ: GİZLİ HARF BULMA İÇİN SADECE KUTU ŞEMASI AÇILSIN
            if (soruTipiSecimi === "Gizli Harf Bulma") {
                nesneYuklemeAlani.innerHTML = `
                <div style="margin-bottom: 12px; padding-bottom: 8px;">
                    <label style="font-size: 11px; font-weight: bold; color: #e67e22;">🎨 Kutu Şeması (Köşe):</label>
                    <select id="kutu-temasi-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                        ${secimMenuHTML("modern", "tema")}
                    </select>
                    
                    <label style="font-size: 11px; font-weight: bold; color: #e67e22;">✍️ Kenar Çizgisi:</label>
                    <select id="kenar-stili-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                        ${secimMenuHTML("dashed", "stil")}
                    </select>
                </div>`;
                return;
            }


            // =========================================================
        // YENİ: HARF KARIŞTIRMACA PANELİ (GÖRSEL DESTEKLİ)
        // =========================================================
        if (konuSecimi === "Harf Karıştırmaca") {
            let curMetin = aktifGridResimleri[0] || ""; // (Metinleri aktifGridMetinleri[0] içinde tutuyoruz)
            // Not: Sol panelde kelimeleri almak için aktifGridMetinleri kullanılıyor
            let hamKelimeMetni = aktifGridMetinleri[0] || "";
            let kelimeDizisi = hamKelimeMetni.split(',').map(k => k.trim()).filter(k => k.length > 1);

            let resimYuklemeAlanlari = "";
            if (kelimeDizisi.length > 0) {
                resimYuklemeAlanlari = `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #f39c12;">
                    <label style="font-size: 11px; font-weight: bold; color: #d68910; display:block; margin-bottom:2px;">🖼️ İpucu Görselleri (İsteğe Bağlı):</label>
                    <div style="font-size: 9.5px; color: #e74c3c; margin-bottom: 8px; font-weight: bold;">(Yüklenmezse otomatik kütüphaneden aranır)</div>
                    <div style="display: flex; flex-direction: column; gap: 5px; max-height: 180px; overflow-y: auto; padding-right: 5px;">
                `;
                kelimeDizisi.forEach((kelime, idx) => {
                    let bgCol = aktifGridResimleri[idx] ? "#d4edda" : "#fff";
                    resimYuklemeAlanlari += `
                    <div style="display: flex; align-items: center; justify-content: space-between; background: ${bgCol}; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px;">
                        <span style="font-size: 10px; font-weight: bold; color: #2c3e50; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${kelime}</span>
                        <input type="file" accept="image/*" onchange="resmiCevirGrid(this, ${idx})" style="width: 140px; font-size: 9px;">
                    </div>`;
                });
                resimYuklemeAlanlari += `</div></div>`;
            }

            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #fef9e7; padding: 10px; border-radius: 6px; border: 1px solid #f39c12;">
                <label style="font-size: 11px; font-weight: bold; color: #d68910;">🔤 Karıştırılacak Kelimeleri Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: kalem, silgi, defter, çanta" style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #f39c12; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${hamKelimeMetni}</textarea>
                <div style="font-size: 9.5px; color: #7f8c8d; margin-top: 6px; text-align: center;">Kelimeleri virgülle ayırın, <b>boşluğa tıklayınca</b> görsel menüsü açılır.</div>
                ${resimYuklemeAlanlari}
            </div>`;
            return;
        }


        // =========================================================
        // YENİ: LABİRENTTEN KELİME TOPLAMA PANELİ
        // =========================================================
        if (konuSecimi === "Labirentten Kelime Toplama") {
            let curMetin = aktifGridMetinleri[0] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #e8f6f3; padding: 10px; border-radius: 6px; border: 1px solid #1abc9c;">
                <label style="font-size: 11px; font-weight: bold; color: #16a085;">🕵️‍♂️ Gizlenecek TEK Kelimeyi Girin:</label>
                <input type="text" onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: CUMHURİYET" value="${curMetin}" style="width: 100%; font-size: 13px; padding: 8px; border: 1px solid #1abc9c; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; text-align:center;">
                <div style="font-size: 9.5px; color: #7f8c8d; margin-top: 6px; text-align: center;">Labirentin çözüm yoluna gizlenecek tek bir kelime girin.</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: KELİME ZİNCİRİ (YILAN BULMACA) PANELİ
        // =========================================================
        if (konuSecimi === "Kelime Zinciri (Yılan Bulmaca)") {
            let curMetin = aktifGridMetinleri[0] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #fff8e1; padding: 10px; border-radius: 6px; border: 1px solid #f1c40f;">
                <label style="font-size: 11px; font-weight: bold; color: #f39c12;">🐍 Zincir Kelimeleri Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: elma, armut, tren, nar" style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #f1c40f; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #7f8c8d; margin-top: 6px; text-align: center;">Kelimeleri virgülle ayırın. Sistem doğru sırayı kendi bulacaktır!</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: MİNİ SUDOKU (4x4) PANELİ
        // =========================================================
        if (konuSecimi === "Mini Sudoku (4x4)") {
            let curMetin = aktifGridMetinleri[0] || "";
            let ogeDizisi = curMetin.split(',').map(k => k.trim().toLocaleUpperCase('tr-TR')).filter(k => k.length > 0);
            
            let resimYuklemeAlanlari = "";
            if (soruTipiSecimi === "Nesneli (Görsel)" && ogeDizisi.length === 4) {
                resimYuklemeAlanlari = `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e84393;">
                    <label style="font-size: 11px; font-weight: bold; color: #d63031; display:block; margin-bottom:2px;">🖼️ Sudoku Nesneleri (İsteğe Bağlı):</label>
                    <div style="font-size: 9.5px; color: #e74c3c; margin-bottom: 8px; font-weight: bold;">(PNG yüklemezseniz kütüphaneden aranır)</div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                `;
                ogeDizisi.forEach((oge, idx) => {
                    let bgCol = aktifGridResimleri[idx] ? "#d4edda" : "#fff";
                    resimYuklemeAlanlari += `
                    <div style="display: flex; align-items: center; justify-content: space-between; background: ${bgCol}; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px;">
                        <span style="font-size: 10px; font-weight: bold; color: #2c3e50; width: 40px; overflow: hidden;">${oge}</span>
                        <input type="file" accept="image/*" onchange="resmiCevirGrid(this, ${idx})" style="width: 140px; font-size: 9px;">
                    </div>`;
                });
                resimYuklemeAlanlari += `</div></div>`;
            }

            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #ffeaa7; padding: 10px; border-radius: 6px; border: 1px solid #fdcb6e;">
                <label style="font-size: 11px; font-weight: bold; color: #d35400;">🎲 4 Adet Harf, Sayı veya Nesne Girin:</label>
                <input type="text" onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: 1, 2, 3, 4 veya elma, armut, muz, nar" value="${curMetin}" style="width: 100%; font-size: 12px; padding: 8px; border: 1px solid #fdcb6e; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50;">
                <div style="font-size: 9.5px; color: #d35400; margin-top: 6px; text-align: center;">Virgülle ayırarak <b>tam 4 farklı öge</b> girin.<br>Boşluğa tıkladığınızda menü güncellenir.</div>
                ${resimYuklemeAlanlari}
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: OKUDUĞUNU EŞLEŞTİRME PANELİ
        // =========================================================
        if (konuSecimi === "Cümle-Görsel İlişkisi" && soruTipiSecimi === "Okuduğunu Eşleştirme") {
            let html = `
            <div style="margin-bottom: 10px; background: #f0f4c3; padding: 10px; border-radius: 6px; border: 1px solid #afb42b;">
                <label style="font-size: 11px; font-weight: bold; color: #827717;">🔗 Cümleleri ve Görsellerini Girin:</label>
                <div style="font-size: 9.5px; color: #555; margin-bottom: 8px;">Görseller kağıtta <b>karışık sırada</b> çıkacaktır! Siz doğru karşılıklarını yan yana girin.</div>`;

            for(let i=0; i<4; i++) {
                let curMetin = aktifGridMetinleri[i] || "";
                let bgCol = aktifGridResimleri[i] ? "#d4edda" : "#fff";
                html += `
                <div style="margin-bottom: 8px; border-left: 3px solid #c0ca33; padding-left: 5px;">
                    <input type="text" oninput="aktifGridMetinleri[${i}] = this.value; basligiGuncelle();" placeholder="${i+1}. Cümleyi yazın (Örn: Ağaçta elma var)" value="${curMetin}" style="width: 100%; font-size: 11px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 3px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; background: ${bgCol}; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px;">
                        <span style="font-size: 9px; font-weight: bold; color: #2c3e50;">${i+1}. Görsel:</span>
                        <div style="display: flex; gap: 4px;">
                            <button onclick="kutuphaneModaliAc(${i}, 'grid')" style="font-size: 9px; padding: 3px 5px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight:bold;">🔍 Kütüphane</button>
                            <input type="file" accept="image/*" onchange="resmiCevirGrid(this, ${i})" style="width: 120px; font-size: 9px;">
                        </div>
                    </div>
                </div>`;
            }
            html += `</div>`;
            nesneYuklemeAlani.innerHTML = html;
            return;
        }   

        // =========================================================
        // YENİ: OKUDUĞUNU ÇİZME PANELİ
        // =========================================================
        if (konuSecimi === "Cümle-Görsel İlişkisi" && soruTipiSecimi === "Okuduğunu Çizme") {
            let curMetin = aktifGridMetinleri[0] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #e8eaf6; padding: 10px; border-radius: 6px; border: 1px solid #3f51b5;">
                <label style="font-size: 11px; font-weight: bold; color: #283593;">✍️ Çizilecek Metni / Cümleyi Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: Ağaçta kırmızı bir elma var..." style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #3f51b5; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #555; margin-top: 6px; text-align: center;">Bu cümlenin altına öğrencinin resim çizmesi için devasa bir boş pano eklenecektir.</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: OKUDUĞUNU BOYAMA / TAMAMLAMA PANELİ
        // =========================================================
        if (soruTipiSecimi === "Okuduğunu Boyama/Tamamlama") {
            let curMetin = aktifGridMetinleri[0] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #e0f7fa; padding: 10px; border-radius: 6px; border: 1px solid #00bcd4;">
                <label style="font-size: 11px; font-weight: bold; color: #00838f;">🖼️ Boyanacak/Tamamlanacak Şablonu Seçin:</label>
                <div style="display: flex; gap: 4px; margin-top: 5px; margin-bottom: 10px;">
                    <button onclick="kutuphaneModaliAc(0, 'tekli_bas')" style="flex: 1; font-size: 10px; padding: 6px; background: #9b59b6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🔍 Kütüphane</button>
                    <input type="file" accept="image/*" onchange="resmiCevirTekli(this, 'baslangic')" style="flex: 1; font-size: 9px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <label style="font-size: 11px; font-weight: bold; color: #00838f;">📝 Yönergeleri (Görevleri) Yazın:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn:\n1. Evin çatısını kırmızıya boya.\n2. Evin yanına bir ağaç çiz." style="width: 100%; height: 80px; font-size: 12px; padding: 8px; border: 1px solid #00bcd4; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #006064; margin-top: 6px; text-align: center;">Öğrencinin yapması gereken görevleri enter'a basarak alt alta yazın.</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: MANTIKSAL İŞARETLEME PANELİ
        // =========================================================
        if (soruTipiSecimi === "Mantıksal İşaretleme") {
            let curMetin = aktifGridMetinleri[0] || "";
            let resimYuklemeAlanlari = `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #8e44ad;">
                <label style="font-size: 11px; font-weight: bold; color: #9b59b6; display:block; margin-bottom:2px;">🖼️ Yan Yana Dizilecek 4 Nesne:</label>
                <div style="display: flex; flex-direction: column; gap: 5px;">
            `;
            
            // 4 Adet Görsel Giriş Yuvası
            for(let i=0; i<4; i++) {
                let bgCol = aktifGridResimleri[i] ? "#d4edda" : "#fff";
                resimYuklemeAlanlari += `
                <div style="display: flex; align-items: center; justify-content: space-between; background: ${bgCol}; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px;">
                    <span style="font-size: 10px; font-weight: bold; color: #2c3e50;">${i+1}. Nesne:</span>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="kutuphaneModaliAc(${i}, 'grid')" style="font-size: 9px; padding: 3px 5px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight:bold;">🔍 Kütüphane</button>
                        <input type="file" accept="image/*" onchange="resmiCevirGrid(this, ${i})" style="width: 120px; font-size: 9px;">
                    </div>
                </div>`;
            }
            resimYuklemeAlanlari += `</div></div>`;

            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #f3e5f5; padding: 10px; border-radius: 6px; border: 1px solid #ab47bc;">
                <label style="font-size: 11px; font-weight: bold; color: #6a1b9a;">📝 Yönergeyi (Görevleri) Yazın:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: Meyvelerin altındaki kutuya çarpı at, hayvanları yuvarlak içine al." style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #ab47bc; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                ${resimYuklemeAlanlari}
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: OLAY SIRALAMA PANELİ
        // =========================================================
        if (konuSecimi === "Hikaye Kurgusu ve Analiz" && soruTipiSecimi === "Olay Sıralama") {
            let curMetin = aktifGridMetinleri[0] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #e8f5e9; padding: 10px; border-radius: 6px; border: 1px solid #4caf50;">
                <label style="font-size: 11px; font-weight: bold; color: #2e7d32;">📝 Olay Cümlelerini Doğru Sırayla Alt Alta Yazın:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn:\nTohumu ektim.\nHer gün suladım.\nFiliz verdi.\nÇiçek açtı." style="width: 100%; height: 90px; font-size: 12px; padding: 8px; border: 1px solid #4caf50; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #1b5e20; margin-top: 6px; text-align: center;">Her satıra bir cümle yazın. <b>Sistem cümleleri kağıda otomatik olarak KARIŞIK sırada basacaktır!</b></div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: KELİME AVCISI (BOŞLUK DOLDURMA) PANELİ
        // =========================================================
        if (konuSecimi === "Hikaye Kurgusu ve Analiz" && soruTipiSecimi === "Kelime Avcısı (Boşluk Doldurma)") {
            let curMetin = aktifGridMetinleri[0] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #fff3e0; padding: 10px; border-radius: 6px; border: 1px solid #ff9800;">
                <label style="font-size: 11px; font-weight: bold; color: #e65100;">📝 Boşluk Doldurma Cümlelerini Yazın:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn:\nAli [okula] gitti.\nAyşe kırmızı [kalem] aldı." style="width: 100%; height: 90px; font-size: 12px; padding: 8px; border: 1px solid #ff9800; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${curMetin}</textarea>
                <div style="font-size: 9.5px; color: #e65100; margin-top: 6px; text-align: center;">Gizlemek istediğiniz kelimeyi <b>köşeli parantez [ ]</b> içine alın. Sistem o kelimeleri yukarıya banka olarak dizecektir.</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: DOĞRU MU YANLIŞ MI PANELİ
        // =========================================================
        if (konuSecimi === "Metin İçi Mantık" && soruTipiSecimi === "Doğru mu, Yanlış mı?") {
            let parca = aktifGridMetinleri[0] || "";
            let yargilar = aktifGridMetinleri[1] || "";
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #e3f2fd; padding: 10px; border-radius: 6px; border: 1px solid #2196f3;">
                <label style="font-size: 11px; font-weight: bold; color: #1565c0;">📖 Okuma Parçasını Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: Ali sabah erken kalktı. Elini yüzünü yıkadı..." style="width: 100%; height: 70px; font-size: 12px; padding: 8px; border: 1px solid #2196f3; border-radius: 4px; margin-top: 5px; margin-bottom: 10px; font-weight: bold; color: #2c3e50; resize:none;">${parca}</textarea>
                
                <label style="font-size: 11px; font-weight: bold; color: #1565c0;">🤔 Doğru / Yanlış Cümlelerini Yazın:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[1] = this.value; basligiGuncelle();" placeholder="Örn:\nAli sabah geç kalktı.\nAli elini yüzünü yıkadı." style="width: 100%; height: 70px; font-size: 12px; padding: 8px; border: 1px solid #2196f3; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${yargilar}</textarea>
                <div style="font-size: 9.5px; color: #1565c0; margin-top: 6px; text-align: center;">Yargı cümlelerini enter'a basarak alt alta yazın. Yüz ifadeleri otomatik eklenecektir.</div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: 5N1K VE ÇOKTAN SEÇMELİ PANELİ
        // =========================================================
        if (konuSecimi === "Metin İçi Mantık" && soruTipiSecimi === "5N1K ve Çoktan Seçmeli") {
            let parca = aktifGridMetinleri[0] || "";
            let soru = aktifGridMetinleri[1] || "";
            
            let resimYuklemeAlanlari = `<div style="display: flex; gap: 8px; margin-top: 10px;">`;
            let harfler = ['A', 'B', 'C'];
            for(let i=0; i<3; i++) {
                let bgCol = aktifGridResimleri[i] ? "#d4edda" : "#fff";
                resimYuklemeAlanlari += `
                <div style="flex:1; background: ${bgCol}; padding: 6px; border: 1px solid #ccc; border-radius: 4px; text-align:center;">
                    <span style="font-size: 10px; font-weight: bold; color:#2c3e50;">Şık ${harfler[i]}</span>
                    <div style="margin-top:6px;">
                        <button onclick="kutuphaneModaliAc(${i}, 'grid')" style="font-size: 9px; padding: 4px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; width:100%; margin-bottom:4px; font-weight:bold;">🔍 Kütüphane</button>
                        <input type="file" accept="image/*" onchange="resmiCevirGrid(this, ${i})" style="width: 100%; font-size: 9px;">
                    </div>
                </div>`;
            }
            resimYuklemeAlanlari += `</div>`;

            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #fce4ec; padding: 10px; border-radius: 6px; border: 1px solid #e91e63;">
                <label style="font-size: 11px; font-weight: bold; color: #880e4f;">📖 Okuma Parçasını Girin:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: Ayşe kırmızı elmayı yedi..." style="width: 100%; height: 60px; font-size: 12px; padding: 8px; border: 1px solid #e91e63; border-radius: 4px; margin-top: 5px; margin-bottom: 10px; font-weight: bold; color: #2c3e50; resize:none;">${parca}</textarea>
                
                <label style="font-size: 11px; font-weight: bold; color: #880e4f;">❓ 5N1K Sorusunu Yazın:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[1] = this.value; basligiGuncelle();" placeholder="Örn: Ayşe ne yedi?" style="width: 100%; height: 40px; font-size: 12px; padding: 8px; border: 1px solid #e91e63; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; resize:none;">${soru}</textarea>
                
                <div style="margin-top:10px; border-top:1px dashed #e91e63; padding-top:10px;">
                    <label style="font-size: 11px; font-weight: bold; color: #880e4f;">🖼️ Çoktan Seçmeli Şıklar (İsteğe Bağlı):</label>
                    <div style="font-size: 9.5px; color: #880e4f; margin-top: 2px;">Resim eklerseniz A, B, C şıklı test olur. Boş bırakırsanız klasik boşluk doldurma çizgisi çıkar.</div>
                    ${resimYuklemeAlanlari}
                </div>
            </div>`;
            return;
        }

        // =========================================================
        // YENİ: OKUYALIM YAZALIM PANELİ
        // =========================================================
        if (konuSecimi === "Okuma ve Yazma Pratiği" && soruTipiSecimi === "Okuyalım Yazalım") {
            let baslik = aktifGridMetinleri[0] || "";
            let metin = aktifGridMetinleri[1] || "";
            let satirSayisi = aktifGridMetinleri[2] || "6"; 
            
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px; background: #e8f8f5; padding: 10px; border-radius: 6px; border: 1px solid #1abc9c;">
                <label style="font-size: 11px; font-weight: bold; color: #16a085;">📌 Metin Başlığı:</label>
                <input type="text" onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[0] = this.value; basligiGuncelle();" placeholder="Örn: OYA İLE AYLA" value="${baslik}" style="width: 100%; font-size: 12px; padding: 6px; border: 1px solid #1abc9c; border-radius: 4px; margin-top: 5px; margin-bottom: 10px; font-weight: bold;">
                
                <label style="font-size: 11px; font-weight: bold; color: #16a085;">📖 Okuma Metni:</label>
                <textarea onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[1] = this.value; basligiGuncelle();" placeholder="Örn:\nAyla un al.\nAyla maya al." style="width: 100%; height: 80px; font-size: 12px; padding: 8px; border: 1px solid #1abc9c; border-radius: 4px; margin-top: 5px; margin-bottom: 10px; color: #2c3e50; resize:none;">${metin}</textarea>
                
                <label style="font-size: 11px; font-weight: bold; color: #16a085;">✍️ Kaç Adet Kılavuz Çizgi Çizilsin?</label>
                <input type="number" min="1" max="10" onblur="nesneYuklemeAlaniniGuncelle()" oninput="aktifGridMetinleri[2] = this.value; basligiGuncelle();" value="${satirSayisi}" style="width: 100%; font-size: 12px; padding: 6px; border: 1px solid #1abc9c; border-radius: 4px; margin-top: 5px; font-weight: bold;">
            </div>`;
            return;
        }

        

        







        // =========================================================
        // 1. HECE, KELİME VE CÜMLE (BİRLEŞTİRME & AYIRMA) PANELİ
        // =========================================================
        const sihirliKonular = ["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma"];
        if (sihirliKonular.includes(konuSecimi)) {
            let maxHarf = 15;
            if (konuSecimi === "Hece Birleştirme") maxHarf = parseInt(soruTipiSecimi) || 2; 
            if (konuSecimi.includes("Cümle") || konuSecimi.includes("Kelimeye Ayırma")) maxHarf = 60;
            
            let curMetin = aktifGridMetinleri[0] || "";
            let etiketYazi = konuSecimi.includes("Ayırma") ? "Parçalanacak Metni Yazın:" : "Birleştirilecek Metni Yazın:";
            let placeholderYazi = (konuSecimi.includes("Cümle") || konuSecimi.includes("Kelimeye Ayırma")) ? "Örn: Ali-ata-bak." : "Örn: k-al veya o-kul";

            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #4DB8FF;">
                <label style="font-size: 11px; font-weight: bold; color: #e67e22;">🎨 Kutu Şeması (Köşe):</label>
                <select id="kutu-temasi-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                    ${secimMenuHTML("modern", "tema")}
                </select>
                <label style="font-size: 11px; font-weight: bold; color: #e67e22;">✍️ Kenar Çizgisi:</label>
                <select id="kenar-stili-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                    ${secimMenuHTML("solid", "stil")}
                </select>
            </div>
            <div style="margin-bottom: 10px; background: #e8f4f8; padding: 10px; border-radius: 6px; border: 1px solid #3498db;">
                <label style="font-size: 11px; font-weight: bold; color: #2980b9;">📝 ${etiketYazi}</label>
                <input type="text" oninput="let v=this.value.replace(/-+/g, '-').replace(/^-/, ''); let c='', hc=0; for(let char of v){ if(char==='-'){c+='-';} else if(hc<${maxHarf}){c+=char; hc++;} } this.value=c; aktifGridMetinleri[0]=c; basligiGuncelle();" value="${curMetin}" placeholder="${placeholderYazi}" style="width: 100%; font-size: 14px; padding: 8px; border: 1px solid #3498db; border-radius: 4px; margin-top: 5px; font-weight: bold; color: #2c3e50; text-align: center; letter-spacing: 2px;">
                <div style="font-size: 9.5px; color: #e74c3c; margin-top: 6px; text-align: center; font-weight:bold;">Kutuların bölünmesini istediğiniz yerlere tire (-) koyun.<br>Maks. ${maxHarf} karakter (Tireler hariç).</div>
            </div>`;
            return;
        }

            // =========================================================
            // 3. EVRENSEL GRİD PANELİ (Sesi Bulma, Boyama, Ses Sayısı)
        // =========================================================
        if (["Sesi Barındıranı İşaretleme", "Sesin Konumunu Bulma", "Sesi Barındıranı Boyama", "Ses Sayısı Kadar Yazma"].includes(soruTipiSecimi)) {
            let cols = document.getElementById('grid-col-input') ? parseInt(document.getElementById('grid-col-input').value) : 2;
            let rows = document.getElementById('grid-row-input') ? parseInt(document.getElementById('grid-row-input').value) : 4;
            let defaultYuvarlak = (soruTipiSecimi === "Sesin Konumunu Bulma") ? 3 : (soruTipiSecimi === "Sesi Barındıranı Boyama" ? 0 : 1);
            let yuvarlakSayisi = document.getElementById('grid-yuvarlak-input') ? parseInt(document.getElementById('grid-yuvarlak-input').value) : defaultYuvarlak;

            let html = `
                <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #4DB8FF;">
                    <label style="font-size: 11px; font-weight: bold; color: #e67e22;">🎨 Kutu Şeması (Köşe):</label>
                    <select id="kutu-temasi-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                        ${secimMenuHTML("modern", "tema")}
                    </select>
                    <label style="font-size: 11px; font-weight: bold; color: #e67e22;">✍️ Kenar Çizgisi:</label>
                    <select id="kenar-stili-secimi" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 5px;">
                        ${secimMenuHTML(soruTipiSecimi === "Ses Sayısı Kadar Yazma" ? "solid" : "solid", "stil")}
                    </select>
                </div>
                
                <div style="margin-bottom: 10px; display: flex; gap: 5px;">
                    <div style="flex: 1;">
                        <label style="font-size: 10px; font-weight: bold; color: #2c3e50;">📏 Sütun:</label>
                        <input type="number" id="grid-col-input" value="${cols}" min="1" max="10" onchange="gridBoyutDegisti()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 10px; font-weight: bold; color: #2c3e50;">📏 Satır:</label>
                        <input type="number" id="grid-row-input" value="${rows}" min="1" max="10" onchange="gridBoyutDegisti()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>
                    ${soruTipiSecimi !== "Ses Sayısı Kadar Yazma" ? `
                    <div style="flex: 1.2;">
                        <label style="font-size: 10px; font-weight: bold; color: #2c3e50;">⚪ Yuv. Adedi:</label>
                        <input type="number" id="grid-yuvarlak-input" value="${yuvarlakSayisi}" min="0" max="6" onchange="basligiGuncelle()" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>` : ''}
                </div>
                <div style="max-height: 380px; overflow-y: auto; padding-right: 5px;">`;

            for (let r = 1; r <= rows; r++) {
                for (let c = 1; c <= cols; c++) {
                    let idx = (r - 1) * cols + (c - 1); 
                    let curMetin = aktifGridMetinleri[idx] || ""; 
                    
                    if (soruTipiSecimi === "Ses Sayısı Kadar Yazma") {
                        html += `
                        <div style="margin-bottom: 6px; padding-left: 5px; border-left: 2px solid #8e44ad;">
                            <label style="font-size: 10px; color: #555; font-weight:bold;">${idx+1}. Kelime:</label>
                            <input type="text" oninput="metinDegistiGrid(this, ${idx})" value="${curMetin}" placeholder="Kelime girin..." style="width: 100%; font-size: 11px; padding: 6px; border: 1px solid #ddd; border-radius: 3px; margin-top: 2px; font-weight: bold; color: #2c3e50;">
                        </div>`;
                    } else {
                        html += `
                        <div style="margin-bottom: 6px; padding-left: 5px; border-left: 2px solid #a2d148;">
                            <label style="font-size: 10px; color: #555; font-weight:bold;">${c}. Sütun, ${r}. Satır:</label>
                            <div style="display: flex; gap: 4px; margin-top: 2px;">
                                <button onclick="kutuphaneModaliAc(${idx}, 'grid')" style="flex: 1.5; font-size: 9px; padding: 2px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;" title="Kütüphaneden Seç">🔍 Kütüphane</button>
                                <input type="file" onchange="resmiCevirGrid(this, ${idx})" style="flex: 1; font-size: 9px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;" title="Bilgisayardan Yükle">
                                <input type="text" oninput="metinDegistiGrid(this, ${idx})" value="${curMetin}" placeholder="Yazı (İsteğe Bağlı)" style="flex: 1.5; font-size: 10px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;">
                            </div>
                        </div>`;
                    }
                }
            }
            html += `</div><div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 5px;"><label style="font-size: 11px; font-weight: bold; color: #2f3640;">📏 Izgara Genel Boyutu:</label><input type="range" id="ilk-nesne-boyutu" min="20" max="150" value="100" style="width: 100%; cursor: ew-resize;"></div>`;
            nesneYuklemeAlani.innerHTML = html;
            return;
        }
        
        // 4. SPAGETTİ LABİRENT
        if (konuSecimi === "Karmaşık Yol/Eşleştirme Çalışmaları (Spagetti Labirent)") {
            const dropdown = document.getElementById('spagetti-dropdown-secimi');
            const yolSecimi = dropdown ? dropdown.value : "3 Yollu Kördüğüm";
            let adet = 3;
            if (yolSecimi === "4 Yollu Kördüğüm") adet = 4;
            if (yolSecimi === "5 Yollu Kördüğüm") adet = 5;
            
            let html = `<div style="max-height: 380px; overflow-y: auto; padding-right: 5px;">`;
            html += `
                <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #4DB8FF;">
                    <label style="font-size: 11px; font-weight: bold; color: #e67e22;">🏞️ Ortak Arka Plan Manzarası:</label>
                    <input type="file" onchange="resmiCevirSpagetti(this, 'arkaplan', 0)" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
                </div>`;
                
            html += `<div style="font-size: 11px; font-weight: bold; color: #3498db; margin-bottom: 6px;">🏁 Başlangıç Nesneleri (Ayrı Ayrı):</div>`;
            for (let i = 0; i < adet; i++) {
                html += `
                    <div style="margin-bottom: 6px; padding-left: 5px; border-left: 2px solid #3498db;">
                        <label style="font-size: 10px; color: #555;">${i+1}. Yolun Başlangıç Resmi:</label>
                        <div style="display: flex; gap: 4px; margin-top: 2px;">
                            <button onclick="kutuphaneModaliAc(${i}, 'spagetti_bas')" style="flex: 1; font-size: 9px; padding: 2px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;" title="Kütüphaneden Seç">🔍 Kütüphane</button>
                            <input type="file" onchange="resmiCevirSpagetti(this, 'baslangic', ${i})" style="flex: 1; font-size: 9px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;" title="Bilgisayardan Yükle">
                        </div>
                    </div>`;
            }
            
            html += `<div style="font-size: 11px; font-weight: bold; color: #e74c3c; margin-top: 10px; margin-bottom: 6px;">🎯 Bitiş Nesneleri (Ayrı Ayrı):</div>`;
            for (let i = 0; i < adet; i++) {
                html += `
                    <div style="margin-bottom: 6px; padding-left: 5px; border-left: 2px solid #e74c3c;">
                        <label style="font-size: 10px; color: #555;">${i+1}. Yolun Bitiş Resmi:</label>
                        <div style="display: flex; gap: 4px; margin-top: 2px;">
                            <button onclick="kutuphaneModaliAc(${i}, 'spagetti_bit')" style="flex: 1; font-size: 9px; padding: 2px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;" title="Kütüphaneden Seç">🔍 Kütüphane</button>
                            <input type="file" onchange="resmiCevirSpagetti(this, 'bitis', ${i})" style="flex: 1; font-size: 9px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;" title="Bilgisayardan Yükle">
                        </div>
                    </div>`;
            }
            
            html += `</div>
                <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 5px;">
                    <label style="font-size: 11px; font-weight: bold; color: #2f3640;">📏 Görsel Genel Boyutu:</label>
                    <input type="range" id="ilk-nesne-boyutu" min="20" max="150" value="40" style="width: 100%; cursor: ew-resize;">
                </div>`;
            nesneYuklemeAlani.innerHTML = html;
            return;
        }
        
        // 5. DIŞ HAT BOYAMA
        if (soruTipiSecimi === "Dış Hat Boyama") {
            nesneYuklemeAlani.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label style="font-size: 11px; font-weight: bold; color: #2f3640;">🎨 Boyanacak Görseli Seç:</label>
                <div style="display: flex; gap: 4px; margin-top: 2px;">
                    <button onclick="kutuphaneModaliAc(0, 'tekli_bas')" style="flex: 1; font-size: 10px; padding: 4px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">🔍 Kütüphane</button>
                    <input type="file" onchange="resmiCevirTekli(this, 'baslangic')" style="flex: 1; font-size: 9px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
                </div>
            </div>
            <div>
                <label style="font-size: 11px; font-weight: bold; color: #2f3640;">📏 Görsel Boyutu:</label>
                <input type="range" id="ilk-nesne-boyutu" min="50" max="400" value="150" onchange="basligiGuncelle()" style="width: 100%; cursor: ew-resize;">
            </div>`;
            return;
        }

        // 6. DİĞER STANDART EŞLEŞTİRME VE LABİRENTLER
        let arkaplanHtml = "";
        if (konuSecimi === "Labirent Çalışmaları") {
            arkaplanHtml = `
            <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #4DB8FF;">
                <label style="font-size: 11px; font-weight: bold; color: #e67e22;">🏞️ Arka Plan Manzarası:</label>
                <input type="file" onchange="resmiCevirTekli(this, 'arkaplan')" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
            </div>`;
        }

        nesneYuklemeAlani.innerHTML = `
            ${arkaplanHtml}
            <div style="margin-bottom: 10px;">
                <label style="font-size: 11px; font-weight: bold; color: #2f3640;">🏁 Başlangıç / Sol Nesne:</label>
                <div style="display: flex; gap: 4px; margin-top: 2px;">
                    <button onclick="kutuphaneModaliAc(0, 'tekli_bas')" style="flex: 1; font-size: 10px; padding: 4px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">🔍 Kütüphane</button>
                    <input type="file" onchange="resmiCevirTekli(this, 'baslangic')" style="flex: 1; font-size: 9px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="font-size: 11px; font-weight: bold; color: #2f3640;">🎯 Bitiş / Sağ Nesne:</label>
                <div style="display: flex; gap: 4px; margin-top: 2px;">
                    <button onclick="kutuphaneModaliAc(0, 'tekli_bit')" style="flex: 1; font-size: 10px; padding: 4px; background: #9b59b6; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">🔍 Kütüphane</button>
                    <input type="file" onchange="resmiCevirTekli(this, 'bitis')" style="flex: 1; font-size: 9px; padding: 4px; border: 1px solid #ccc; border-radius: 3px;">
                </div>
            </div>
            <div>
                <label style="font-size: 11px; font-weight: bold; color: #2f3640;">📏 Görsel Boyutu:</label>
                <input type="range" id="ilk-nesne-boyutu" min="20" max="150" value="40" style="width: 100%; cursor: ew-resize;">
            </div>`;
    }

                // --- MODÜLER RENK DEĞİŞTİRİCİ MOTOR ---
                function renkDegisti(index, renkDegeri) {
                    kagitIcerigi[index].renk = renkDegeri;
                    kagidiCiz(); 
                }

                function gridAyarDegisti(index, ayar, val) {
                    if (ayar === 'tema') kagitIcerigi[index].gridTema = val;
                    if (ayar === 'stil') kagitIcerigi[index].gridStil = val;
                    if (ayar === 'yuv') kagitIcerigi[index].gridYuv = parseInt(val);
                    kagidiCiz(); 
                }

                // --- 0.5 HAFIZA (UNDO/REDO) MOTORU ---
                let kagitGecmisi = [];
                let kagitGelecegi = [];


                


                // ==============================================================
                // YENİ: KUSURSUZ OK VE KAVİS MOTORU (NUMARA HEP DÜZ DURUR!)
                // ==============================================================
                function okCiz(numara, uzunluk, renk, kavis = 0, cift = false, uzanti = 0, rot = 0) {
                    let d = `M 0,10 L 0,${uzunluk}`;
                    let polyRot = 0;
                    let endX = 0;
                    let endY = uzunluk;
                    
                    if (kavis !== 0 || uzanti !== 0) {
                        if (cift) {
                            let midY = (uzunluk / 2) + 5;
                            let k = kavis; 
                            let altK = k > 0 ? k + 10 : k - 10; 
                            
                            let midX = k > 0 ? 20 : -20; 
                            endX = k > 0 ? 10 : -10;     
                            
                            d = `M 0,10 C ${k},10 ${k},${midY - 10} ${midX},${midY} C ${altK},${midY + 10} ${altK},${uzunluk} ${endX},${uzunluk}`;
                            
                            polyRot = k > 0 ? 120 : -120; 
                            endY = uzunluk;
                        } else {
                            endX = uzanti;
                            endY = uzunluk;
                            d = `M 0,10 Q ${kavis},${uzunluk/2 + 5} ${endX},${endY}`;
                            
                            if (uzanti > 0) { polyRot = 90; } 
                            else if (uzanti < 0) { polyRot = -90; } 
                            else {
                                let dx = endX - kavis; let dy = endY - (uzunluk/2 + 5);
                                polyRot = (Math.atan2(dy, dx) * (180 / Math.PI)) - 90;
                            }
                        }
                    }

                    let w = Math.max(Math.abs(kavis) * 2 + 80, Math.abs(uzanti) * 2 + 80);
                    let offsetX = w / 2;
                    let offsetY = 20;
                    
                    // MUCİZE BURADA: Çizgiyi rotate ile döndürüyoruz ama Nokta ve Text sabit kalıyor!
                    return `
                    <svg width="${w}" height="${Math.max(uzunluk + 40, 50)}" style="overflow:visible; position:absolute; left:-${offsetX}px; top:-${offsetY}px; pointer-events:none;">
                        <g transform="translate(${offsetX}, ${offsetY})">
                            <!-- Sadece Çizgi ve Ok Ucu Döner -->
                            <g transform="rotate(${rot})">
                                <path d="${d}" fill="none" stroke="${renk}" stroke-width="2.5" stroke-dasharray="6,4" stroke-linecap="round" />
                                <polygon points="-5,-2 5,-2 0,8" fill="${renk}" transform="translate(${endX}, ${endY}) rotate(${polyRot})" />
                            </g>
                            <!-- Numara ve Kırmızı Nokta Daima Dik Durur! -->
                            <circle cx="0" cy="0" r="4" fill="${renk}" />
                            <text x="10" y="4" fill="${renk}" font-size="14" font-family="sans-serif" font-weight="bold">${numara}</text>
                        </g>
                    </svg>`;
                }





                function masterHedefSec(index, hedef) {
                    kagitIcerigi[index].masterHedef = hedef;
                    arayuzuGuncelle(); 
                }

                function evrenselKontrolDegisti(index, ayarTipi, miktar, mutlakDeger = null) {
                    let hedef = kagitIcerigi[index].masterHedef || 'evrensel';

                    const harita = {
                        'evrensel': { x: 'genelX', y: 'genelY', size: 'genelScale', rot: null, kavis: null, u: null },
                        'yonerge':  { x: null,     y: null,     size: 'yonergeBoyut',rot: null, kavis: null, u: null },
                        'harf':     { x: 'harfX',  y: 'harfY',  size: 'fontBoyutu',  rot: null, kavis: null, u: null },
                        'kilavuz':  { x: null,     y: 'pBgY',   size: 'pBgH',        rot: null, kavis: null, u: null },
                        'ok1':      { x: 'o1X',    y: 'o1Y',    size: 'o1L',         rot: 'o1R', kavis: 'o1K', u: 'o1U' },
                        'ok2':      { x: 'o2X',    y: 'o2Y',    size: 'o2L',         rot: 'o2R', kavis: 'o2K', u: 'o2U' },
                        'ok3':      { x: 'o3X',    y: 'o3Y',    size: 'o3L',         rot: 'o3R', kavis: 'o3K', u: 'o3U' },
                        'genislik': { x: null,     y: null,     size: 'genislik',    rot: null, kavis: null, u: null }, // YENİ MERKEZİ BAĞLANTI!
                        'nesne':    { x: null,     y: null,     size: 'nesneBoyutu', rot: null, kavis: null, u: null },
                        'resim':    { x: 'resimX', y: 'resimY', size: 'resimBoyutu', rot: null, kavis: null, u: null }
                    };

                    let prop = harita[hedef][ayarTipi];
                    if (!prop) return; 

                    if (mutlakDeger !== null) {
                        kagitIcerigi[index][prop] = parseInt(mutlakDeger) || 0;
                    } else {
                        kagitIcerigi[index][prop] = (kagitIcerigi[index][prop] || 0) + miktar;
                    }
                    
                    // Genişliği %10 ile %100 arasına kilitliyoruz ki kağıttan dışarı taşmasın
                    if (prop === 'genislik') {
                        if (kagitIcerigi[index][prop] > 100) kagitIcerigi[index][prop] = 100;
                        if (kagitIcerigi[index][prop] < 10) kagitIcerigi[index][prop] = 10;
                    }

                    kagidiCiz();
                    
                    let inputEl = document.getElementById(`master-input-${ayarTipi}-${index}`);
                    if (inputEl) inputEl.value = kagitIcerigi[index][prop];
                }

                // YENİ ÇOKLU VE KAVİSLİ SÖZLÜK (A ve a için hazırlandı)
                const harfBaslangic = {
                    'A': {
                        // h1: Sol Çapraz Bacak (/)
                        h1: { mX: -150, mY: -150, mW: 140, mH: 300, mRot: 0, oX: -10, oY: -110, oRot: 110 },
                        // h2: Sağ Çapraz Bacak (\)
                        h2: { mX: -10, mY: -150, mW: 150, mH: 300, mRot: 0, oX: 10, oY: -110, oRot: 70 },
                        // h3: Ortadaki Yatay Çizgi (-)
                        h3: { mX: -60, mY: 10, mW: 120, mH: 50, mRot: 0, oX: -50, oY: 35, oRot: 0 }
                    },
                    'a': {
                        ok1: {x: 8, y: -5, rot: 65, l: 80, k: -30},  // Kavisli gövde (X ve Y'yi sen gireceksin)
                        ok2: {x: 50, y: 10, rot: 180, l: 80, k: 0} // Aşağı inen düz çizgi (Değerlerini kendi ayarına göre değiştir)
                    },
                    'default': {
                        ok1: {x: 0, y: -80, rot: 180, l: 140, k: 0}
                    },

                    'B': {
                        ok1: {x: -60, y: -70, rot: 0, l: 150, k: 0},   // 1. Ok: Soldaki dik direk
                        ok2: {x: 10, y: -90, rot: 0, l: 192, k: 50, cift: true} // 2. Ok: Direğin hemen sağından başlayan "3" şekli
                    },
                    'b': {
                        ok1: {x: -30, y: -110, rot: 180, l: 150, k: 0},   // 1. Ok: Soldaki uzun dik çizgi (Aşağı doğru)
                        ok2: {x: -20, y: -10, rot: 75, l: 110, k: 60}     // 2. Ok: Ortadan başlayan büyük kavisli göbek
                    },

                    'C': {
                        ok1: {x: 15, y: -70, rot: 0, l: 140, k: -100} // Yukarıdan aşağıya inerken sola devasa bir kavis
                    },
                    'c': {
                        ok1: {x: 10, y: 0, rot: 0, l: 70, k: -60}   // Aynı mantığın sadece daha küçük ve aşağıda olanı
                    },
                };

                function pAyarDegisti(index, ayar, val) {
                    if(ayar === 'tip') {
                        kagitIcerigi[index].takipHarfTipi = val;
                        let harf = kagitIcerigi[index].konu.split(" ")[0];
                        let hedefHarf = val === 'buyuk' ? harf.toLocaleUpperCase('tr-TR') : harf.toLocaleLowerCase('tr-TR');
                        if (harf === "İ") hedefHarf = val === 'buyuk' ? "İ" : "i";
                        if (harf === "I") hedefHarf = val === 'buyuk' ? "I" : "ı";
                        
                        let bas = harfBaslangic[hedefHarf] || harfBaslangic['default'];
                        if (bas.ok1) { kagitIcerigi[index].o1X=bas.ok1.x; kagitIcerigi[index].o1Y=bas.ok1.y; kagitIcerigi[index].o1R=bas.ok1.rot; kagitIcerigi[index].o1L=bas.ok1.l; kagitIcerigi[index].o1K=bas.ok1.k||0; }
                        if (bas.ok2) { kagitIcerigi[index].o2A=true; kagitIcerigi[index].o2X=bas.ok2.x; kagitIcerigi[index].o2Y=bas.ok2.y; kagitIcerigi[index].o2R=bas.ok2.rot; kagitIcerigi[index].o2L=bas.ok2.l; kagitIcerigi[index].o2K=bas.ok2.k||0; } else { kagitIcerigi[index].o2A=false; }
                        if (bas.ok3) { kagitIcerigi[index].o3A=true; kagitIcerigi[index].o3X=bas.ok3.x; kagitIcerigi[index].o3Y=bas.ok3.y; kagitIcerigi[index].o3R=bas.ok3.rot; kagitIcerigi[index].o3L=bas.ok3.l; kagitIcerigi[index].o3K=bas.ok3.k||0; } else { kagitIcerigi[index].o3A=false; }
                    }
                    if(ayar === 'duzen') kagitIcerigi[index].takipDuzen = val;
                    if(ayar === 'bg') kagitIcerigi[index].takipBg = val;
                    if(ayar === 'o2A') kagitIcerigi[index].o2A = (val === 'true');
                    if(ayar === 'o3A') kagitIcerigi[index].o3A = (val === 'true');
                    arayuzuGuncelle();
                }

                function durumuKaydet() {
                    kagitGecmisi.push(JSON.parse(JSON.stringify(kagitIcerigi)));
                    kagitGelecegi = []; 
                }

                function geriAl() {
                    if (kagitGecmisi.length > 0) {
                        kagitGelecegi.push(JSON.parse(JSON.stringify(kagitIcerigi)));
                        kagitIcerigi = kagitGecmisi.pop();
                        arayuzuGuncelle();
                    }
                }

                function ileriAl() {
                    if (kagitGelecegi.length > 0) {
                        kagitGecmisi.push(JSON.parse(JSON.stringify(kagitIcerigi)));
                        kagitIcerigi = kagitGelecegi.pop();
                        arayuzuGuncelle();
                    }
                }

                // --- 3. MENÜ YÖNETİMİ ---
                function sinifDegisti() {
                    const sinifSecimi = document.getElementById('sinif-secimi').value;
                    const dersSelect = document.getElementById('ders-secimi');
                    dersSelect.innerHTML = ''; 
                    const mevcutDersler = Object.keys(mufredat[sinifSecimi] || {});
                    mevcutDersler.forEach(dersKodu => {
                        const option = document.createElement('option');
                        option.value = dersKodu;
                        option.innerText = dersIsimleri[dersKodu];
                        dersSelect.appendChild(option);
                    });
                    dersDegisti(); 
                }

                function dersDegisti() {
                    const sinifSecimi = document.getElementById('sinif-secimi').value;
                    const dersSecimi = document.getElementById('ders-secimi').value;
                    const uniteSelect = document.getElementById('unite-secimi');
                    
                    if(document.getElementById('yazdir-sinif')) document.getElementById('yazdir-sinif').innerText = sinifSecimi;
                    
                    uniteSelect.innerHTML = '';
                    const uniteler = Object.keys(mufredat[sinifSecimi][dersSecimi] || {});
                    uniteler.forEach(unite => {
                        const option = document.createElement('option');
                        option.value = unite;
                        option.innerText = unite;
                        uniteSelect.appendChild(option);
                    });
                    uniteDegisti();
                }

                function uniteDegisti() {
                    const sinifSecimi = document.getElementById('sinif-secimi').value;
                    const dersSecimi = document.getElementById('ders-secimi').value;
                    const uniteSecimi = document.getElementById('unite-secimi').value;
                    const konuSelect = document.getElementById('konu-secimi');

                    konuSelect.innerHTML = '';
                    const konular = Object.keys(mufredat[sinifSecimi][dersSecimi][uniteSecimi] || {});
                    
                    konular.forEach(konu => {
                        const option = document.createElement('option');
                        option.value = konu;
                        option.innerText = konu;
                        konuSelect.appendChild(option);
                    });
                    konuDegisti();
                }

                function konuDegisti() {
        const sinifSecimi = document.getElementById('sinif-secimi').value;
        const dersSecimi = document.getElementById('ders-secimi').value;
        const uniteSecimi = document.getElementById('unite-secimi').value;
        const konuSecimi = document.getElementById('konu-secimi').value;
        
        const tooltipText = document.getElementById('konu-tooltip');
        const ornekGorselAlani = document.getElementById('ornek-gorsel-alani');
        const ornekResim = document.getElementById('konu-ornek-resim');
        const ozellikKutulari = document.getElementById('ozellik-kutulari');
        
        const soruTipiLabel = document.getElementById('soru-tipi-label');
        const soruTipiSecimi = document.getElementById('soru-tipi-secimi');
        // soruTipi hataya sebep olmasın diye güvene alındı
        let soruTipi = soruTipiSecimi ? soruTipiSecimi.value : ""; 

        const zorlukAlani = document.getElementById('zorluk-alani');
        if (zorlukAlani) zorlukAlani.style.display = "none"; // Kalıcı olarak gizlendi

        const labirentAlani = document.getElementById('labirent-ayarlari');
        if (labirentAlani) labirentAlani.style.display = (konuSecimi === "Labirent Çalışmaları") ? "block" : "none";

        if (mufredat[sinifSecimi] && mufredat[sinifSecimi][dersSecimi] && mufredat[sinifSecimi][dersSecimi][uniteSecimi] && mufredat[sinifSecimi][dersSecimi][uniteSecimi][konuSecimi]) {
            let secilenKonuVerisi = mufredat[sinifSecimi][dersSecimi][uniteSecimi][konuSecimi];
            if (tooltipText) tooltipText.innerText = secilenKonuVerisi.bilgi || "Bilgi yok.";
            if (ornekResim) ornekResim.src = "ornek-yok.png";
            if (ornekGorselAlani) ornekGorselAlani.style.display = "block";
        } else {
            if(ornekGorselAlani) ornekGorselAlani.style.display = "none";
        }

        ozellikKutulari.innerHTML = '';

        if (konuSecimi.includes("Harfi")) {
            if(soruTipiLabel) soruTipiLabel.style.display = "block";
            if(soruTipiSecimi) {
                soruTipiSecimi.style.display = "block";
                soruTipiSecimi.innerHTML = '<option value="">-- Soru Tipi Seçin --</option>';
                Object.keys(harfSoruTipleri).forEach(tip => {
                    soruTipiSecimi.innerHTML += `<option value="${tip}">${tip}</option>`;
                });
            }
            if(document.getElementById('ozellikler-alani')) document.getElementById('ozellikler-alani').style.display = 'none';
        } 
        // YENİ: Veriyi data.js'den okuyan dinamik motor!
        else if (typeof heceSoruTipleri !== 'undefined' && heceSoruTipleri[konuSecimi]) {
            if(soruTipiLabel) soruTipiLabel.style.display = "block";
            if(soruTipiSecimi) {
                soruTipiSecimi.style.display = "block";
                soruTipiSecimi.innerHTML = '<option value="">-- Soru Tipi Seçin --</option>';
                heceSoruTipleri[konuSecimi].forEach(tip => {
                    soruTipiSecimi.innerHTML += `<option value="${tip}">${tip}</option>`;
                });
            }
            if(document.getElementById('ozellikler-alani')) document.getElementById('ozellikler-alani').style.display = 'none';
        }
        else {
            if(soruTipiLabel) soruTipiLabel.style.display = "none";
            if(soruTipiSecimi) soruTipiSecimi.style.display = "none";
            
            const matAyarlari = document.getElementById('matematik-ayarlari');
            if (dersSecimi === 'matematik') {
                if(matAyarlari) matAyarlari.style.display = 'block';
                if(document.getElementById('ozellikler-alani')) document.getElementById('ozellikler-alani').style.display = 'none';
            } else {
                if(matAyarlari) matAyarlari.style.display = 'none';
                const secilenKonu = mufredat[sinifSecimi][dersSecimi][uniteSecimi][konuSecimi];
                const ozellikler = secilenKonu ? secilenKonu.ozellikler : [];
                
                if (ozellikler && ozellikler.length > 0) {
                    if(document.getElementById('ozellikler-alani')) document.getElementById('ozellikler-alani').style.display = 'block';
                    
                    if (konuSecimi === "Karmaşık Yol/Eşleştirme Çalışmaları (Spagetti Labirent)") {
                        let selectHtml = `
                            <label style="font-size: 11px; font-weight: bold; color: #2c3e50; display: block; margin-bottom: 5px;">🧬 Yol Sayısı Seçimi:</label>
                            <select id="spagetti-dropdown-secimi" name="ozellik" onchange="basligiGuncelle(); nesneYuklemeAlaniniGuncelle();" style="width: 100%; font-size: 11px; padding: 5px; border: 1px solid #b2bec3; border-radius: 4px; color: #2c3e50; font-weight: bold; background:#fff; cursor:pointer;">`;
                        ozellikler.forEach(ozellik => {
                            selectHtml += `<option value="${ozellik}">${ozellik}</option>`;
                        });
                        selectHtml += `</select>`;
                        ozellikKutulari.innerHTML = selectHtml;
                    } 
                    else {
                        ozellikler.forEach(ozellik => {
                            if (ozellik === "Normal Çizgi" || ozellik === "Dikey" || ozellik === "Sağa Bakan (>)" || ozellik === "Büyük Boyut" || ozellik === "O Şekli" || ozellik === "Büyük U" || ozellik === "Normal Dalga" || ozellik === "Ters Dalga" || ozellik === "Küçük Tepe") {
                                const ayirici = document.createElement('div'); 
                                ayirici.style.width = "100%";
                                ayirici.style.borderTop = "1px dashed #b2bec3";
                                ayirici.style.margin = "10px 0 10px 0";
                                ozellikKutulari.appendChild(ayirici);
                            }

                            const div = document.createElement('div');
                            div.style.display = "flex"; div.style.alignItems = "center"; div.style.marginBottom = "6px";
                            div.innerHTML = `<input type="checkbox" name="ozellik" value="${ozellik}" onchange="varyasyonKontrol(this); basligiGuncelle(); nesneYuklemeAlaniniGuncelle();" style="width: 16px; height: 16px; margin: 0 8px 0 0; cursor: pointer;"> <span style="font-size:12px;">${ozellik}</span>`;
                            ozellikKutulari.appendChild(div);
                        });
                    }
                } else {
                    if(document.getElementById('ozellikler-alani')) document.getElementById('ozellikler-alani').style.display = 'none';
                }
            }
        }
        
        // YENİ: Boş Kılavuz Satır butonunu sadece İlkokuma dersindeyken göster
        // Burada "const nesneYuklemeAlani" KODU SİLİNDİ, hata yaratan kısım buydu!
        const bosSatirBtn = document.getElementById('bos-satir-ekle-btn');
        if (bosSatirBtn) {
            bosSatirBtn.style.display = (dersSecimi === "ilkokuma") ? "block" : "none";
        }

        basligiGuncelle();
        nesneYuklemeAlaniniGuncelle(); 
    } // <--- İŞTE SİSTEMİ ÇÖKERTEN EKSİK PARANTEZ BURAYA GELDİ!

                function soruTipiDegisti() {
                    const soruTipi = document.getElementById('soru-tipi-secimi').value;
                    const ozellikKutulari = document.getElementById('ozellik-kutulari');
                    
                    const zorlukAlani = document.getElementById('zorluk-alani');
                    if (zorlukAlani) zorlukAlani.style.display = "none"; // Kalıcı olarak gizlendi

                    ozellikKutulari.innerHTML = '';

                    // YENİ: Sadece harf soru tiplerine değil, Serbest Yazı tiplerine de VIP geçiş izni veriyoruz!
                    if (soruTipi && (harfSoruTipleri[soruTipi] || ["Sadece Yazı", "Yanına Resimli Yazı"].includes(soruTipi))) {
                        if(document.getElementById('ozellikler-alani')) document.getElementById('ozellikler-alani').style.display = 'block';
                        
                        let sonGrupIdx = -1;
                        
                       // YENİ: Dışarıdaki dosyayı ezip kendi varyasyonlarımızı yönetiyoruz!
                        let gecerliListe = harfSoruTipleri[soruTipi] || [];
                        
                        if (soruTipi === "Parmakla Takip Etme") {
                            gecerliListe = ["Sadece Küçük Harf", "İçi Boş Font", "Kesikli Font", "Yanına Satır At", "Kılavuz Çizgiyi Gizle"];
                        } else if (soruTipi === "Dış Hat Boyama") {
                            gecerliListe = ["Büyük Harf", "Küçük Harf", "Görsel Boyama"];
                        } else if (soruTipi === "Gizli Harf Bulma") {
                            gecerliListe = ["Sadece Küçük Harf", "Sadece Büyük Harf", "Henüz Öğrenilmemiş Harfler Eklensin"];
                        } else if (soruTipi === "Sadece Yazı") {
                            gecerliListe = ["Normal Font", "Kesikli Font", "İçi Boş Font", "Hayalet Font", "İlk Metin Normal (Gerisi Kesikli)", "İlk Metin Normal (Gerisi Hayalet)"];
                        } else if (soruTipi === "Yanına Resimli Yazı") {
                            gecerliListe = ["Normal Font", "Kesikli Font", "İçi Boş Font", "Hayalet Font", "İlk Metin Normal (Gerisi Kesikli)", "İlk Metin Normal (Gerisi Hayalet)", "Görseli Sağa Al (Varsayılan Sol)"];
                        }

                        gecerliListe.forEach((ozellik, idx) => {
                            let akimGrupIdx = -1;
                            evrenselZitliklar.forEach((grup, gIdx) => {
                                if (grup.includes(ozellik)) akimGrupIdx = gIdx;
                            });


                            // YENİ: Kılavuz Çizgi Ekle'den hemen önce KESİKLİ ÇİZGİ atar
                            if (ozellik === "Kılavuz Çizgi Ekle") {
                                const ayirici = document.createElement('div');
                                ayirici.style.width = "100%";
                                ayirici.style.borderTop = "1px dashed #b2bec3";
                                ayirici.style.margin = "10px 0 10px 0";
                                ozellikKutulari.appendChild(ayirici);
                            } 
                            // Normal zıtlık grupları arasındaki düz çizgi
                            else if (idx > 0 && akimGrupIdx !== sonGrupIdx && akimGrupIdx !== -1 && sonGrupIdx !== -1) {
                                const ayiriciCizgi = document.createElement('div');
                                ayiriciCizgi.style.width = "100%";
                                ayiriciCizgi.style.borderTop = "1.5px solid #b2bec3"; 
                                ayiriciCizgi.style.margin = "12px 0 12px 0"; 
                                ozellikKutulari.appendChild(ayiriciCizgi);
                            }
                            
                            if (akimGrupIdx !== -1) sonGrupIdx = akimGrupIdx;

                            const div = document.createElement('div');
                            div.style.display = "flex";
                            div.style.alignItems = "center";
                            div.style.marginBottom = "6px";
                            div.innerHTML = `<input type="checkbox" name="ozellik" value="${ozellik}" onchange="varyasyonKontrol(this); basligiGuncelle(); nesneYuklemeAlaniniGuncelle();" style="width: auto; margin: 0 8px 0 0; cursor: pointer;"> <span style="font-size:12px; line-height:1.2;">${ozellik}</span>`;
                            ozellikKutulari.appendChild(div);
                        });
                    } else {
                        if(document.getElementById('ozellikler-alani')) document.getElementById('ozellikler-alani').style.display = 'none';
                    }
                    
                    // YENİ: Soru tipi değiştiğinde görsel yükleme panelini tetikler
                    const nesYukAlani2 = document.getElementById('nesne-yukleme-alani');
                    if (nesYukAlani2) {
                        const gecerliSoruTipleri = [
                            "Sesi Barındıranı İşaretleme", 
                            "Sesi Barındıranı Boyama", 
                            "Sesin Konumunu Bulma", 
                            "Gizli Harf Bulma", 
                            "Ses Sayısı Kadar Yazma"
                        ];
                        
                        let anlikKonuSecimi = document.getElementById('konu-secimi') ? document.getElementById('konu-secimi').value : '';

                        // Soru tipi bu listedeyse veya dış hat boyamada özel bir ayar seçildiyse paneli göster
                        // Soru tipi bu listedeyse veya dış hat boyamada özel bir ayar seçildiyse paneli göster
                        if (gecerliSoruTipleri.includes(soruTipi) || ["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma"].includes(anlikKonuSecimi) || (soruTipi === "Dış Hat Boyama" && document.querySelector('input[value="Görsel Boyama"]')?.checked)) {
                            nesYukAlani2.style.display = "block";
                        } else {
                            nesYukAlani2.style.display = "none";
                        }
                    }
                    
                    // YENİ: Boş Kılavuz Satır butonunu sadece İlkokuma dersindeyken göster
                    const bosSatirBtn = document.getElementById('bos-satir-ekle-btn');
                    const gecerliDers = document.getElementById('ders-secimi') ? document.getElementById('ders-secimi').value : '';
                    if (bosSatirBtn) {
                        bosSatirBtn.style.display = (gecerliDers === "ilkokuma") ? "block" : "none";
                    }

                    basligiGuncelle();
                    nesneYuklemeAlaniniGuncelle(); 
                }

                function varyasyonKontrol(tiklananKutu) {
                    if (!tiklananKutu.checked) return;
                    const deger = tiklananKutu.value;
                    
                    // YENİ: Desen oluşturabilmek için Şekil Yönlerini zıtlık kuralından "MUAF" tuttuk!
                    if (["Dikey", "Sağa Yatık ( / )", "Sola Yatık ( \\ )"].includes(deger)) return;

                    const tumKutular = document.querySelectorAll('input[name="ozellik"]');
                    let aitOlduguGrup = evrenselZitliklar.find(grup => grup.includes(deger));
                    if (aitOlduguGrup) {
                        tumKutular.forEach(kutu => {
                            if (kutu !== tiklananKutu && aitOlduguGrup.includes(kutu.value)) {
                                kutu.checked = false;
                            }
                        });
                    }
                }

                function basligiGuncelle() {
                    const uniteSecimi = document.getElementById('unite-secimi') ? document.getElementById('unite-secimi').value : '';
                    const konuSecimi = document.getElementById('konu-secimi') ? document.getElementById('konu-secimi').value : '';
                    const soruTipiSecimi = document.getElementById('soru-tipi-secimi') ? document.getElementById('soru-tipi-secimi').value : '';
                    
                    // Hem normal kutuları hem de yeni açılır menüyü tek kalemde yakalar
                    const secilenler = Array.from(document.querySelectorAll('input[name="ozellik"]:checked, select[id="spagetti-dropdown-secimi"]')).map(el => el.value);
                    
                    const yazdirKonu = document.getElementById('yazdir-konu');
                    if (yazdirKonu && kagitIcerigi.length === 0) {
                        const ozelBaslik = document.getElementById('ozel-baslik') ? document.getElementById('ozel-baslik').value.trim() : "";
                        let anaBaslik = ozelBaslik !== "" ? ozelBaslik.toUpperCase() : (uniteSecimi ? uniteSecimi.toUpperCase() : '');
                        
                        let kisaIsim = konuSecimi;
                        const sinifSecimi = document.getElementById('sinif-secimi') ? document.getElementById('sinif-secimi').value : '';
                        const dersSecimi = document.getElementById('ders-secimi') ? document.getElementById('ders-secimi').value : '';
                        if (mufredat[sinifSecimi] && mufredat[sinifSecimi][dersSecimi] && mufredat[sinifSecimi][dersSecimi][uniteSecimi] && mufredat[sinifSecimi][dersSecimi][uniteSecimi][konuSecimi]) {
                            kisaIsim = mufredat[sinifSecimi][dersSecimi][uniteSecimi][konuSecimi].kisaAd || konuSecimi;
                        }

                        // YENİ: Alt başlığı küçük puntolarla ana başlığın altına basar
                        let kisaIsimBuyuk = kisaIsim.toLocaleUpperCase('tr-TR'); // Türkçeye uygun büyütür
                        yazdirKonu.innerHTML = `
                            <div style="line-height: 1.1; transform: translateY(-8px);"> 
                                <div style="font-weight: 700; font-family: 'Quicksand', sans-serif;">${anaBaslik}</div>
                                <div style="font-size: 14px; font-weight: 300; font-family: 'Quicksand', sans-serif; margin-top: 2px; opacity: 0.95; letter-spacing: 1px;">${kisaIsimBuyuk}</div>
                            </div>
                        `;
                    }
                    canliOnizlemeyiCiz(konuSecimi, soruTipiSecimi, secilenler);
                }

                // YENİ: ORTAK HECE BİRLEŞTİRME ÇİZİM MOTORU (Önizleme ve Matbaa aynı yerden beslenir)
                function heceBirlestirmeOlustur(metin, tema, stil, cRengi) {
                    let hamMetin = metin || "";
                    
                    // =======================================================
                    // YENİ ZEKİ FİLTRE: Baştaki ve sondaki tireleri yoksay!
                    // Sadece harflerin arasındaki geçerli tireleri kabul eder.
                    // =======================================================
                    let cizimMetni = hamMetin.replace(/^-+|-+$/g, ''); 
                    
                    // Tire varsa tireden böl ve boşlukları at, yoksa harf harf böl
                    let parcalar = cizimMetni.includes("-") ? cizimMetni.split("-").filter(p => p !== "") : cizimMetni.split("");
                    let birlesikMetin = cizimMetni.replace(/-/g, ""); 
                    
                    let bRadius = "12px";
                    if(tema === "capraz") bRadius = "15px 4px 15px 4px"; 
                    if(tema === "bulut") bRadius = "20px 15px 25px 20px"; 
                    let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 3px;` : "";
                    let boxThickness = (stil === "suslu") ? "4px" : "3px";
                    let borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 15px; border-image-outset: 5px; border-image-repeat: round; background-color: #eaf2f8; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: 0 4px 8px rgba(0,0,0,0.05); ${susluOutline}`;

                    let kutuBoyutu = 60; 
                    let pSize = 36; 

                    // min-width eklendi ki kutu içine "al" veya "tren" gelince sıkışmasın, yana esnesin
                    let ayriKutularHtml = parcalar.map(p => `
                        <div style="${borderCSS} min-width:${kutuBoyutu}px; height:${kutuBoyutu}px; display:flex; align-items:center; justify-content:center; margin: 0 5px; padding: 0 10px; box-sizing: border-box;">
                            <span style="font-family:'TemelYazi', sans-serif; font-size:${pSize}px; color:#2c3e50; line-height:1; transform:translateY(4px);">${p}</span>
                        </div>
                    `).join("");

                    if (parcalar.length === 0 || birlesikMetin === "") {
                        ayriKutularHtml = `
                        <div style="${borderCSS} width:${kutuBoyutu}px; height:${kutuBoyutu}px; display:flex; align-items:center; justify-content:center; margin: 0 5px;"></div>
                        <div style="${borderCSS} width:${kutuBoyutu}px; height:${kutuBoyutu}px; display:flex; align-items:center; justify-content:center; margin: 0 5px;"></div>`;
                    }

                    let genisKutuW = Math.max(kutuBoyutu * 1.5, birlesikMetin.length * 30 + 30);
                    let birlesikKutuHtml = `
                    <div style="${borderCSS} min-width:${genisKutuW}px; height:${kutuBoyutu}px; display:flex; align-items:center; justify-content:center; padding: 0 15px; box-sizing: border-box;">
                        <span style="font-family:'TemelYazi', sans-serif; font-size:${pSize}px; color:#2c3e50; line-height:1; transform:translateY(4px); letter-spacing:2px;">${birlesikMetin}</span>
                    </div>`;

                    let yTop = 20, yMid = 48, yBot = 76;
                    let kilavuzLines = `
                    <svg width="100%" height="96px" viewBox="0 0 600 96" preserveAspectRatio="none" style="overflow: visible; display:block;">
                        <rect x="0" y="${yMid}" width="600" height="${yBot - yMid}" fill="#fff4cc" />
                        <rect x="0" y="${yTop}" width="600" height="${yBot - yTop}" fill="none" stroke="#2c3e50" stroke-width="1.5" />
                        <line x1="0" y1="${yMid}" x2="600" y2="${yMid}" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5, 5" />
                    </svg>`;

                    return `
                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 0; gap: 15px;">
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <div style="display: flex; align-items: center;">${ayriKutularHtml}</div>
                            <div style="font-size: 30px; color: #bdc3c7; margin: 0 20px;">➔</div>
                            <div>${birlesikKutuHtml}</div>
                        </div>
                        <div style="width: 100%; max-width: 600px;">
                            ${kilavuzLines}
                        </div>
                    </div>`;
                }

                // YENİ: BİRLEŞTİRME VE AYIRMA ORTAK ÇİZİM MOTORU (Her Şeyi Yapan Zeka!)
                function heceVeKelimeMotoru(metin, tema, stil, cRengi, mod, isCumle) {
                    let hamMetin = metin || "";
                    let cizimMetni = hamMetin.replace(/^-+|-+$/g, '');

                    let parcalar = cizimMetni.includes("-") ? cizimMetni.split("-").filter(p => p !== "") : cizimMetni.split("");
                    
                    // Zeka: Cümle modundaysa tireleri boşluğa çevir (Ali ata bak.), hece modundaysa yok et (bilgisayar).
                    let birlesikMetin = cizimMetni.replace(/-/g, isCumle ? " " : "");

                    let bRadius = "12px";
                    if(tema === "capraz") bRadius = "15px 4px 15px 4px"; 
                    if(tema === "bulut") bRadius = "20px 15px 25px 20px"; 
                    let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 3px;` : "";
                    let boxThickness = (stil === "suslu") ? "4px" : "3px";
                    let borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 15px; border-image-outset: 5px; border-image-repeat: round; background-color: #eaf2f8; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: 0 4px 8px rgba(0,0,0,0.05); ${susluOutline}`;

                    let kutuBoyutu = 60; 
                    let pSize = 36; 

                    let ayriKutularHtml = parcalar.map(p => `
                        <div style="${borderCSS} min-width:${kutuBoyutu}px; height:${kutuBoyutu}px; display:flex; align-items:center; justify-content:center; margin: 0 5px; padding: 0 10px; box-sizing: border-box;">
                            <span style="font-family:'TemelYazi', sans-serif; font-size:${pSize}px; color:#2c3e50; line-height:1; transform:translateY(4px);">${p}</span>
                        </div>
                    `).join("");

                    if (parcalar.length === 0 || birlesikMetin === "") {
                        ayriKutularHtml = `<div style="${borderCSS} width:${kutuBoyutu}px; height:${kutuBoyutu}px; display:flex; align-items:center; justify-content:center; margin: 0 5px;"></div>`;
                    }
                    
                    let genisKutuW = Math.max(kutuBoyutu * 1.5, birlesikMetin.length * (isCumle ? 18 : 25) + 30);
                    let birlesikKutuHtml = `
                    <div style="${borderCSS} min-width:${genisKutuW}px; height:${kutuBoyutu}px; display:flex; align-items:center; justify-content:center; padding: 0 15px; box-sizing: border-box;">
                        <span style="font-family:'TemelYazi', sans-serif; font-size:${pSize}px; color:#2c3e50; line-height:1; transform:translateY(4px); letter-spacing:2px; white-space:nowrap;">${birlesikMetin}</span>
                    </div>`;

                    let yTop = 20, yMid = 48, yBot = 76;
                    let kilavuzLines = `
                    <svg width="100%" height="96px" viewBox="0 0 600 96" preserveAspectRatio="none" style="overflow: visible; display:block;">
                        <rect x="0" y="${yMid}" width="600" height="${yBot - yMid}" fill="#fff4cc" />
                        <rect x="0" y="${yTop}" width="600" height="${yBot - yTop}" fill="none" stroke="#2c3e50" stroke-width="1.5" />
                        <line x1="0" y1="${yMid}" x2="600" y2="${yMid}" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5, 5" />
                    </svg>`;

                    let ustKisimHtml = "";
                    if (mod === "ayir") { // Zeka: Parçalama moduysa oku ve kutuları tersten çiz!
                        ustKisimHtml = `
                        <div style="display: flex; align-items: center; justify-content: center; flex-wrap:wrap; gap:10px;">
                            <div>${birlesikKutuHtml}</div>
                            <div style="font-size: 30px; color: #bdc3c7; margin: 0 15px; transform: scaleX(-1);">➔</div>
                            <div style="display: flex; align-items: center; flex-wrap:wrap;">${ayriKutularHtml}</div>
                        </div>`;
                    } else {
                        ustKisimHtml = `
                        <div style="display: flex; align-items: center; justify-content: center; flex-wrap:wrap; gap:10px;">
                            <div style="display: flex; align-items: center; flex-wrap:wrap;">${ayriKutularHtml}</div>
                            <div style="font-size: 30px; color: #bdc3c7; margin: 0 15px;">➔</div>
                            <div>${birlesikKutuHtml}</div>
                        </div>`;
                    }

                    return `
                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 0; gap: 15px;">
                        ${ustKisimHtml}
                        <div style="width: 100%; max-width: 600px;">
                            ${kilavuzLines}
                        </div>
                    </div>`;
                }

                // YENİ: KILAVUZ ÇİZGİYE SERBEST YAZI MOTORU (Ortak & Kusursuz Resim Desteği & Joystick)
                function serbestYaziOlustur(metin, detaylar, fSize, tekrarSayisi, imgSrc = "", resimliMod = false, resimSagdaMi = false, imgStyle = "") {
                    let hamMetin = metin || "";
                    let baseFontClass = "meb-temel";
                    if (detaylar.includes("Kesikli Font")) baseFontClass = "meb-kesik-kontur";
                    if (detaylar.includes("İçi Boş Font")) baseFontClass = "meb-kontur";
                    
                    let opacity = detaylar.includes("Hayalet Font") ? "0.2" : "1";
                    
                    let yTop = 20, yMid = 48, yBot = 76;
                    
                    // FİX 1: z-index 0 yapıldı. -1 yapınca Önizleme'de ve A4 kağıdında en arkaya gömülüp görünmez oluyordu!
                    let bgSvg = `
                    <svg width="100%" height="96px" viewBox="0 0 600 96" preserveAspectRatio="none" style="position:absolute; top:0; left:0; z-index:0; overflow:visible;">
                        <rect x="0" y="${yMid}" width="600" height="${yBot - yMid}" fill="#fff4cc" />
                        <rect x="0" y="${yTop}" width="600" height="${yBot - yTop}" fill="none" stroke="#2c3e50" stroke-width="1.5" />
                        <line x1="0" y1="${yMid}" x2="600" y2="${yMid}" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5, 5" />
                    </svg>`;

                    let harflerHtml = "";
                    for (let s = 0; s < tekrarSayisi; s++) {
                        let currentClass = baseFontClass;
                        let currentOpacity = opacity; 
                        
                        if (detaylar.includes("İlk Metin Normal (Gerisi Kesikli)")) {
                            currentClass = (s === 0) ? "meb-temel" : "meb-kesik-kontur";
                        } else if (detaylar.includes("İlk Metin Normal (Gerisi Hayalet)")) {
                            currentClass = "meb-temel"; 
                            currentOpacity = (s === 0) ? "1" : "0.2"; 
                        }
                        
                        harflerHtml += `<span class="${currentClass}" style="font-size: ${fSize}px; color: #111; line-height: 0.75; margin-right: 30px; opacity: ${currentOpacity}; z-index: 1; display: inline-block; white-space: pre; transform: translateY(8px);">${hamMetin}</span>`;
                    }

                    let yaziAlaniHtml = `
                    <div style="flex: 1; width: 100%; min-width: 200px; height: 96px; position: relative; display: flex; align-items: flex-start; justify-content: flex-start; overflow: visible; padding-top: 15px; box-sizing: border-box;">
                        ${bgSvg}
                        <div style="display: flex; align-items: flex-start; width: 100%; z-index: 1; position: relative; overflow: visible; padding-left: 10px;">
                            ${harflerHtml}
                        </div>
                    </div>`;

                    if (!resimliMod) {
                        return `<div style="width: 100%; display: block;">${yaziAlaniHtml}</div>`;
                    }

                    // FİX 2: Placeholder (Yer Tutucu) SVG'si encodeURIComponent ile şifrelendi. 
                    // Şifrelenmediği için < ve > işaretleri HTML'i kırıyor, diğer soruları bile yok ediyordu!
                    let placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#f1f2f6"><rect width="100" height="100"/><text x="50" y="50" fill="#a4b0be" font-size="14" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">Görsel</text></svg>`;
                    let finalImgSrc = imgSrc ? imgSrc : "data:image/svg+xml," + encodeURIComponent(placeholderSvg);

                    let gorselHtml = `
                    <div style="width: 110px; height: 96px; flex-shrink: 0; border: 2px dashed #bdc3c7; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: center; padding: 5px; box-sizing: border-box; box-shadow: 2px 2px 5px rgba(0,0,0,0.05); overflow: visible;">
                        <img src="${finalImgSrc}" style="max-width: 100%; max-height: 100%; object-fit: contain; ${imgStyle}" />
                    </div>`;

                    if (resimSagdaMi) {
                        return `<div style="width: 100%; display: flex; gap: 15px; align-items: center; padding-left: 10px; overflow: visible;">${yaziAlaniHtml}${gorselHtml}</div>`;
                    } else {
                        return `<div style="width: 100%; display: flex; gap: 15px; align-items: center; padding-left: 10px; overflow: visible;">${gorselHtml}${yaziAlaniHtml}</div>`;
                    }
                }

                // YENİ: ÇENGEL BULMACA ÇİZİM MOTORU (KULLANICI İTHALAT DESTEKLİ, ZEKALI VE HAFIZALI)
                function bulmacaOlustur(metin, madde = null, soruTipi = "Sembollü Bulmaca") {
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Kelimeleri Virgülle Girin ]</div>`;
                    }

                    let kelimeDizisi = metin.split(',').map(k => k.trim()).filter(k => k.length > 1);
                    if (kelimeDizisi.length < 2) return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold;">En az 2 kelime girmelisiniz!</div>`;

                    let bulmacaData;
                    
                    if (madde && madde.bulmacaHafiza && madde.bulmacaSonMetin === metin && !madde.bulmacaZarla) {
                        bulmacaData = madde.bulmacaHafiza;
                    } else {
                        bulmacaData = typeof BulmacaMotoru !== 'undefined' ? BulmacaMotoru.uret(kelimeDizisi) : null;
                        if (madde && bulmacaData) {
                            madde.bulmacaHafiza = bulmacaData;
                            madde.bulmacaSonMetin = metin;
                            madde.bulmacaZarla = false; 
                        }
                    }

                    if (!bulmacaData) return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold;">Kesişen harf bulunamadı!</div>`;

                    // ZEKÂ: A4 baskısında mıyız (madde.gridResimleri), yoksa Önizleme'de miyiz (aktifGridResimleri) anlar.
                    let resimHafizasi = (madde && madde.gridResimleri) ? madde.gridResimleri : (typeof aktifGridResimleri !== 'undefined' ? aktifGridResimleri : {});

                    bulmacaData.kelimeler.forEach(k => {
                        k.gorselIcerigi = k.sembol; // Varsayılan geometrik
                        
                        if (soruTipi === "Nesneli Bulmaca") {
                            let tK = typeof turkceTemizle === "function" ? turkceTemizle(k.kelime) : k.kelime.toLowerCase().trim();
                            
                            // Kullanıcının virgülle yazdığı orjinal kelime sırasını tespit et
                            let orjIndex = kelimeDizisi.findIndex(orj => (typeof turkceTemizle === "function" ? turkceTemizle(orj) : orj.toLowerCase().trim()) === tK);
                            
                            // 1. ÖNCELİK: Kullanıcı bilgisayardan bir şey eklemiş mi?
                            let kullaniciResmi = orjIndex !== -1 ? resimHafizasi[orjIndex] : null;

                            if (kullaniciResmi) {
                                // Kullanıcı kendi PNG'sini yüklemiş, SVG içine <image> olarak göm!
                                k.gorselIcerigi = `<image href="${kullaniciResmi}" x="-15" y="-15" width="130" height="130" preserveAspectRatio="xMidYMid meet" />`;
                            } else {
                                // 2. ÖNCELİK: Kullanıcı bir şey yüklememiş, Kütüphanede var mı?
                                let kKey = typeof svgKutuphanesi !== 'undefined' ? Object.keys(svgKutuphanesi).find(key => (typeof turkceTemizle === "function" ? turkceTemizle(key) : key.toLowerCase().trim()) === tK) : null;

                                if (kKey && svgKutuphanesi[kKey]) {
                                    let hamSvg = svgKutuphanesi[kKey];
                                    let temizKod = hamSvg.replace(/stroke-width="[^"]*"/gi, "").replace(/stroke="[^"]*"/gi, "").replace(/fill="[^"]*"/gi, "");
                                    k.gorselIcerigi = `<g fill="none" stroke="#e67e22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${temizKod}</g>`;
                                } else {
                                    // 3. ÖNCELİK: İkisi de yoksa "?" bas
                                    k.gorselIcerigi = `<text x="50" y="60" font-size="65" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#e74c3c">?</text>`;
                                }
                            }
                        }
                    });

                    // --- 1. ÜST KISIM: İPUÇLARI ---
                    let ipucuHtml = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 25px; width:100%;">`;
                    bulmacaData.kelimeler.forEach(k => {
                        ipucuHtml += `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 35px; height: 28px; border: 2px solid #3498db; border-radius: 6px 6px 0 0; border-bottom: none; display: flex; align-items: center; justify-content: center; background: #fff;">
                                <svg width="22" height="22" viewBox="-10 -10 120 120" style="overflow:visible;">${k.gorselIcerigi}</svg>
                            </div>
                            <div style="border: 2px solid #3498db; border-radius: 6px; padding: 4px 12px; font-family: 'TemelYazi', sans-serif; font-size: 20px; color: #2c3e50; font-weight: normal; text-transform: lowercase; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); letter-spacing: 1px;">
                                ${k.kelime}
                            </div>
                        </div>`;
                    });
                    ipucuHtml += `</div>`;

                    // --- 2. ALT KISIM: KESİŞEN BOŞ KUTULAR ---
                    let kBoyut = 36; 
                    let sBoyut = 18; 
                    
                    let gridPixelW = bulmacaData.genislik * kBoyut;
                    let gridPixelH = bulmacaData.yukseklik * kBoyut;
                    
                    let kutularHtml = "";
                    bulmacaData.kelimeler.forEach(k => {
                        let sembolX = k.yatay ? (k.x * kBoyut) - sBoyut - 6 : (k.x * kBoyut) + (kBoyut - sBoyut) / 2;
                        let sembolY = k.yatay ? (k.y * kBoyut) + (kBoyut - sBoyut) / 2 : (k.y * kBoyut) - sBoyut - 6;
                        
                        kutularHtml += `<svg width="${sBoyut}" height="${sBoyut}" viewBox="-10 -10 120 120" style="position: absolute; left: ${sembolX}px; top: ${sembolY}px; z-index: 5; overflow: visible;">${k.gorselIcerigi}</svg>`;

                        for (let i = 0; i < k.kelime.length; i++) {
                            let kX = k.yatay ? (k.x + i) * kBoyut : k.x * kBoyut;
                            let kY = k.yatay ? k.y * kBoyut : (k.y + i) * kBoyut;
                            kutularHtml += `<div style="position: absolute; left: ${kX}px; top: ${kY}px; width: ${kBoyut}px; height: ${kBoyut}px; border: 2px solid #3498db; background: #fff; box-sizing: border-box; display:flex; align-items:center; justify-content:center;"></div>`;
                        }
                    });

                    let altGridHtml = `
                    <div style="width: 100%; display: flex; justify-content: center;">
                        <div style="position: relative; width: ${gridPixelW}px; height: ${gridPixelH}px;">
                            ${kutularHtml}
                        </div>
                    </div>`;

                    return `
                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; padding: 15px 0;">
                        ${ipucuHtml}
                        ${altGridHtml}
                    </div>`;
                }

                // YENİ: KELİME AVI (SÖZCÜK BULMACA) ÇİZİM MOTORU (HAFIZALI)
                function kelimeAviOlustur(metin, madde = null) {
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Kelimeleri Virgülle Girin ]</div>`;
                    }

                    let kelimeDizisi = metin.split(',').map(k => k.trim()).filter(k => k.length > 1);
                    if (kelimeDizisi.length < 2) return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold;">En az 2 kelime girmelisiniz!</div>`;

                    let avData;
                    // Hafıza Kontrolü (Zar atılmadıysa ve kelime değişmediyse eskiyi tut)
                    if (madde && madde.bulmacaHafiza && madde.bulmacaSonMetin === metin && !madde.bulmacaZarla) {
                        avData = madde.bulmacaHafiza;
                    } else {
                        avData = typeof KelimeAviMotoru !== 'undefined' ? KelimeAviMotoru.uret(kelimeDizisi) : null;
                        if (madde && avData) {
                            madde.bulmacaHafiza = avData;
                            madde.bulmacaSonMetin = metin;
                            madde.bulmacaZarla = false; 
                        }
                    }

                    if (!avData) return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold;">Matris oluşturulamadı!</div>`;

                    // --- 1. ÜST KISIM: HARF MATRİSİ (Tablo Şeklinde) ---
                    let hBoyut = 38; // Kutu en-boy
                    let matrisHtml = `<div style="display: grid; grid-template-columns: repeat(${avData.boyut}, ${hBoyut}px); border-top: 2px solid #3498db; border-left: 2px solid #3498db; width: fit-content; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background:#fff;">`;
                    
                    for (let r = 0; r < avData.boyut; r++) {
                        for (let c = 0; c < avData.boyut; c++) {
                            matrisHtml += `
                            <div style="width: ${hBoyut}px; height: ${hBoyut}px; border-right: 2px solid #3498db; border-bottom: 2px solid #3498db; display: flex; align-items: center; justify-content: center; font-family: 'TemelYazi', sans-serif; font-size: 24px; color: #2c3e50; font-weight: normal;">
                                ${avData.matris[r][c]}
                            </div>`;
                        }
                    }
                    matrisHtml += `</div>`;

                    // --- 2. ALT KISIM: ARANACAK KELİMELER BİLGİSİ ---
                    let ipucuHtml = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 25px; width:100%; max-width: 500px;">`;
                    avData.kelimeler.forEach(k => {
                        ipucuHtml += `
                        <div style="border: 2px solid #2ecc71; border-radius: 8px; padding: 6px 16px; font-family: 'TemelYazi', sans-serif; font-size: 20px; color: #2c3e50; font-weight: normal; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); letter-spacing: 1px;">
                            ${k}
                        </div>`;
                    });
                    ipucuHtml += `</div>`;

                    return `
                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; padding: 15px 0;">
                        ${matrisHtml}
                        ${ipucuHtml}
                    </div>`;
                }

                // YENİ: ŞİFRELİ MESAJ ÇİZİM MOTORU (GÖRSEL DESTEKLİ)
                function kriptogramOlustur(metin, madde = null, soruTipi = "Sayı Şifreli") {
                    if (!metin || metin.trim() === "") return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Şifreli Mesajı Girin ]</div>`;
                    
                    let kriptoData;
                    if (madde && madde.bulmacaHafiza && madde.bulmacaSonMetin === metin && !madde.bulmacaZarla) {
                        kriptoData = madde.bulmacaHafiza;
                    } else {
                        kriptoData = typeof KriptogramMotoru !== 'undefined' ? KriptogramMotoru.uret(metin, soruTipi) : null;
                        if (madde && kriptoData) {
                            madde.bulmacaHafiza = kriptoData;
                            madde.bulmacaSonMetin = metin;
                            madde.bulmacaZarla = false; 
                        }
                    }

                    if(!kriptoData) return `<div>Hata oluştu!</div>`;

                    // A4 ve Önizleme hafıza senkronizasyonu
                    let resimHafizasi = (madde && madde.gridResimleri) ? madde.gridResimleri : (typeof aktifGridResimleri !== 'undefined' ? aktifGridResimleri : {});

                    // ZEKÂ: Şifreyi görsele veya metne dönüştüren merkezi robot!
                    function sifreGorseliVer(harf, sifreDegeri) {
                        if (soruTipi === "Sembol Şifreli") return `<span style="font-size:22px; color:#2c3e50;">${sifreDegeri}</span>`;
                        if (soruTipi === "Sayı Şifreli") return `<span style="font-size:20px; font-weight:bold; color:#e74c3c;">${sifreDegeri}</span>`;
                        
                        // Nesne Şifreli ise İthalat kontrolü yap!
                        let orjIndex = kriptoData.benzersizHarfler.indexOf(harf);
                        let kullaniciResmi = orjIndex !== -1 ? resimHafizasi[orjIndex] : null;

                        if (kullaniciResmi) {
                            // Kullanıcı PNG yüklemiş!
                            return `<svg width="26" height="26" viewBox="-10 -10 120 120" style="overflow:visible;"><image href="${kullaniciResmi}" x="-15" y="-15" width="130" height="130" preserveAspectRatio="xMidYMid meet" /></svg>`;
                        } else {
                            // PNG yok, Kütüphaneye (svgKutuphanesi) bak! Harf isminde svg var mı?
                            let tK = typeof turkceTemizle === "function" ? turkceTemizle(harf) : harf.toLowerCase();
                            let kKey = typeof svgKutuphanesi !== 'undefined' ? Object.keys(svgKutuphanesi).find(key => (typeof turkceTemizle === "function" ? turkceTemizle(key) : key.toLowerCase().trim()) === tK) : null;

                            if (kKey && svgKutuphanesi[kKey]) {
                                let hamSvg = svgKutuphanesi[kKey];
                                let temizKod = hamSvg.replace(/stroke-width="[^"]*"/gi, "").replace(/stroke="[^"]*"/gi, "").replace(/fill="[^"]*"/gi, "");
                                return `<svg width="26" height="26" viewBox="-10 -10 120 120" style="overflow:visible;"><g fill="none" stroke="#e67e22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${temizKod}</g></svg>`;
                            } else {
                                // İkisi de yoksa kırmızı uyarı (?)
                                return `<svg width="26" height="26" viewBox="-10 -10 120 120" style="overflow:visible;"><text x="50" y="60" font-size="65" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#e74c3c">?</text></svg>`;
                            }
                        }
                    }
                    
                    // --- 1. ANAHTAR TABLOSU (ŞİFRE ÇÖZÜCÜ) ---
                    let anahtarHtml = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-bottom:35px; border:2px dashed #bdc3c7; padding:15px; border-radius:10px; background:#fafafa;">`;
                    
                    // FİX: Dümdüz sırayla değil, motordan gelen 'gosterimSirasi' ile karışık çiziyoruz!
                    kriptoData.gosterimSirasi.forEach(harf => {
                        let sifre = kriptoData.anahtar[harf];
                        anahtarHtml += `
                        <div style="display:flex; flex-direction:column; align-items:center; border:2px solid #95a5a6; border-radius:6px; background:#fff; overflow:hidden;">
                            <div style="padding:4px 12px; background:#ecf0f1; border-bottom:2px solid #95a5a6; font-family:'TemelYazi', sans-serif; font-size:20px; color:#2c3e50;">${harf}</div>
                            <div style="padding:4px 12px; display:flex; align-items:center; justify-content:center; min-height:28px;">${sifreGorseliVer(harf, sifre)}</div>
                        </div>`;
                    });
                    anahtarHtml += `</div>`;
                    
                    // --- 2. ÇÖZÜM ALANI (KUTULAR) ---
                    let cozumHtml = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:30px;">`; 
                    
                    kriptoData.kelimeler.forEach(kelime => {
                        let kelimeHtml = `<div style="display:flex; gap:6px;">`; 
                        for (let i=0; i<kelime.length; i++) {
                            let harf = kelime[i];
                            let sifre = kriptoData.anahtar[harf];
                            
                            if (!sifre) {
                                kelimeHtml += `<div style="display:flex; align-items:flex-end; justify-content:center; width:15px; font-size:30px; font-weight:bold; color:#2c3e50; padding-bottom:25px;">${harf}</div>`;
                                continue; 
                            }
                            
                            kelimeHtml += `
                            <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                                <div style="width:40px; height:40px; border:2px solid #3498db; background:#fff; border-radius:6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"></div>
                                ${sifreGorseliVer(harf, sifre)}
                            </div>`;
                        }
                        kelimeHtml += `</div>`;
                        cozumHtml += kelimeHtml;
                    });
                    cozumHtml += `</div>`;
                    
                    return `<div style="width:100%; display:flex; flex-direction:column; align-items:center; padding:15px 0;">${anahtarHtml}${cozumHtml}</div>`;
                }

                // YENİ: HARF KARIŞTIRMACA ÇİZİM MOTORU (GÖRSELLER BÜYÜTÜLDÜ VE PNG HATASI ÇÖZÜLDÜ)
                function harfKaristirmaOlustur(metin, madde = null) {
                    
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Karıştırılacak Kelimeleri Girin ]</div>`;
                    }

                    let hamListe = metin.split(',').map(k => k.trim()).filter(k => k.length > 1);
                    if (hamListe.length === 0) {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#95a5a6; font-style:italic;">[ En az 2 harfli bir kelime bekleniyor... ]</div>`;
                    }
                    
                    let karisikData;
                    if (madde && madde.bulmacaHafiza && madde.bulmacaSonMetin === metin && !madde.bulmacaZarla) {
                        karisikData = madde.bulmacaHafiza;
                    } else {
                        karisikData = typeof HarfKaristirmaMotoru !== 'undefined' ? HarfKaristirmaMotoru.uret(metin) : null;
                        if (madde && karisikData) {
                            madde.bulmacaHafiza = karisikData;
                            madde.bulmacaSonMetin = metin;
                            madde.bulmacaZarla = false; 
                        }
                    }

                    if (!karisikData || !karisikData.kelimeler) {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold;">Motor kelimeleri işleyemedi!</div>`;
                    }

                    let resimHafizasi = (madde && madde.gridResimleri) ? madde.gridResimleri : (typeof aktifGridResimleri !== 'undefined' ? aktifGridResimleri : {});

                    let listeHtml = `<div style="display:flex; flex-direction:column; gap:20px; width:100%; max-width:550px; margin:0 auto;">`;

                    karisikData.kelimeler.forEach((item) => {
                        // CERRAHİ MÜDAHALE 1: orjinal -> orijinal olarak düzeltildi
                        let kelimeOrj = item.orijinal; 
                        let tK = typeof turkceTemizle === "function" ? turkceTemizle(kelimeOrj) : kelimeOrj.toLowerCase().trim();
                        let orjIndex = hamListe.findIndex(orj => (typeof turkceTemizle === "function" ? turkceTemizle(orj) : orj.toLowerCase().trim()) === tK);
                        let kullaniciResmi = orjIndex !== -1 ? resimHafizasi[orjIndex] : null;

                        // FİX: Kutu stili senin çizimine göre büyük bir dikdörtgen yapıldı (110x80) ve flex-shrink:0 eklendi ki ezilmesin.
                        let kutuStili = "width:110px; height:80px; border:2px solid #f39c12; border-radius:8px; background:#fff; display:flex; align-items:center; justify-content:center; padding:6px; flex-shrink:0;";

                        let gorselHtml = "";
                        if (kullaniciResmi) {
                            // FİX: <image> yerine standart HTML <img> etiketi kullanıldı. PNG'ler artık %100 basılacak!
                            gorselHtml = `<div style="${kutuStili}"><img src="${kullaniciResmi}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px;" /></div>`;
                        } else {
                            let kKey = typeof svgKutuphanesi !== 'undefined' ? Object.keys(svgKutuphanesi).find(key => (typeof turkceTemizle === "function" ? turkceTemizle(key) : key.toLowerCase().trim()) === tK) : null;
                            if (kKey && svgKutuphanesi[kKey]) {
                                let hamSvg = svgKutuphanesi[kKey];
                                let temizKod = hamSvg.replace(/stroke-width="[^"]*"/gi, "").replace(/stroke="[^"]*"/gi, "").replace(/fill="[^"]*"/gi, "");
                                // FİX: Kütüphaneden gelen SVG de yeni büyük kutuya göre %100 sığacak şekilde ayarlandı.
                                gorselHtml = `<div style="${kutuStili}"><svg width="100%" height="100%" viewBox="-10 -10 120 120"><g fill="none" stroke="#e67e22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${temizKod}</g></svg></div>`;
                            } else {
                                // FİX: Bulunamayan resim (?) işareti de kutuya orantılı büyütüldü.
                                gorselHtml = `<div style="width:110px; height:80px; border:2px dashed #bdc3c7; border-radius:8px; background:#fff; display:flex; align-items:center; justify-content:center; font-size:32px; color:#e74c3c; font-weight:bold; flex-shrink:0;">?</div>`;
                            }
                        }

                        let karisikHarflerHtml = `<div style="display:flex; gap:6px;">`;
                        item.karisik.forEach(h => {
                            karisikHarflerHtml += `<div style="width:36px; height:36px; border:2px solid #e67e22; background:#fef9e7; border-radius:6px; display:flex; align-items:center; justify-content:center; font-family:'TemelYazi', sans-serif; font-size:22px; color:#d68910;">${h}</div>`;
                        });
                        karisikHarflerHtml += `</div>`;

                        let bosKutularHtml = `<div style="display:flex; gap:6px;">`;
                        // CERRAHİ MÜDAHALE 2: orjinal -> orijinal olarak düzeltildi
                        for(let i=0; i<item.orijinal.length; i++) {
                            bosKutularHtml += `<div style="width:36px; height:36px; border:2px solid #3498db; background:#fff; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.05);"></div>`;
                        }
                        bosKutularHtml += `</div>`;

                        listeHtml += `
                        <div style="display:flex; align-items:center; justify-content:space-between; background:#fafafa; border:1px solid #ddd; border-radius:10px; padding:10px 15px; box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                            ${gorselHtml}
                            <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
                                ${karisikHarflerHtml}
                                ${bosKutularHtml}
                            </div>
                        </div>`;
                    });

                    listeHtml += `</div>`;
                    return `<div style="width:100%; display:flex; flex-direction:column; align-items:center; padding:15px 0;">${listeHtml}</div>`;
                }

                // YENİ: LABİRENTTEN KELİME TOPLAMA ÇİZİM MOTORU
                function labirentKelimeOlustur(metin, madde = null) {
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Labirente Gizlenecek Kelimeyi Girin ]</div>`;
                    }

                    let kelime = metin.trim().replace(/\s+/g, '');
                    if (kelime.length < 2) {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#95a5a6; font-style:italic;">[ En az 2 harfli bir kelime bekleniyor... ]</div>`;
                    }

                    let labData;
                    if (madde && madde.bulmacaHafiza && madde.bulmacaSonMetin === metin && !madde.bulmacaZarla) {
                        labData = madde.bulmacaHafiza;
                    } else {
                        labData = typeof LabirentKelimeMotoru !== 'undefined' ? LabirentKelimeMotoru.uret(metin) : null;
                        if (madde && labData) {
                            madde.bulmacaHafiza = labData;
                            madde.bulmacaSonMetin = metin;
                            madde.bulmacaZarla = false; 
                        }
                    }

                    if (!labData) return `<div style="color:#e74c3c; font-weight:bold; text-align:center;">Motor labirenti oluşturamadı!</div>`;

                    // 1. Labirenti Çiz (CSS Grid ile duvarları yıkık odalar)
                    let hBoyut = 38; // Hücre Genişliği
                    let mazeHtml = `<div style="display: grid; grid-template-columns: repeat(${labData.boyut}, ${hBoyut}px); width: max-content; margin: 0 auto; background: #fff; border: 4px solid #2c3e50; padding: 2px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); position: relative;">`;
                    
                    for(let r=0; r<labData.boyut; r++) {
                        for(let c=0; c<labData.boyut; c++) {
                            let cell = labData.grid[r][c];
                            let bTop = cell.N ? '2px solid #34495e' : '1px solid transparent';
                            let bBot = cell.S ? '2px solid #34495e' : '1px solid transparent';
                            let bLeft = cell.W ? '2px solid #34495e' : '1px solid transparent';
                            let bRight = cell.E ? '2px solid #34495e' : '1px solid transparent';
                            
                            let bgCol = (r===0 && c===0) ? '#e8f8f5' : (r===labData.boyut-1 && c===labData.boyut-1) ? '#fdedec' : 'transparent';
                            
                            mazeHtml += `<div style="width:${hBoyut}px; height:${hBoyut}px; box-sizing:border-box; border-top:${bTop}; border-bottom:${bBot}; border-left:${bLeft}; border-right:${bRight}; background:${bgCol}; display:flex; align-items:center; justify-content:center; font-family:'TemelYazi', sans-serif; font-size:18px; font-weight:bold; color:#2980b9;">${cell.char}</div>`;
                        }
                    }
                    
                    // Giriş Çıkış Etiketleri
                    mazeHtml += `
                        <div style="position:absolute; top:-25px; left:5px; font-size:12px; font-weight:bold; color:#27ae60; background:#fff; padding:0 5px;">GİRİŞ ↓</div>
                        <div style="position:absolute; bottom:-25px; right:5px; font-size:12px; font-weight:bold; color:#c0392b; background:#fff; padding:0 5px;">ÇIKIŞ ↓</div>
                    </div>`;

                    // 2. Çözüm Kutucuklarını Çiz
                    let kutuHtml = `<div style="display:flex; justify-content:center; gap:6px; margin-top:40px;">`;
                    for(let i=0; i<labData.kelime.length; i++){
                        kutuHtml += `<div style="width:36px; height:36px; border:2px solid #3498db; border-radius:6px; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,0.05);"></div>`;
                    }
                    kutuHtml += `</div>`;

                    return `<div style="width:100%; display:flex; flex-direction:column; align-items:center; padding:30px 0;">${mazeHtml}${kutuHtml}</div>`;
                }

                // YENİ: KELİME ZİNCİRİ ÇİZİM MOTORU
                function kelimeZinciriOlustur(metin, madde = null) {
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Zincir kelimeleri girin ]</div>`;
                    }

                    let zincirData;
                    if (madde && madde.bulmacaHafiza && madde.bulmacaSonMetin === metin && !madde.bulmacaZarla) {
                        zincirData = madde.bulmacaHafiza;
                    } else {
                        zincirData = typeof KelimeZinciriMotoru !== 'undefined' ? KelimeZinciriMotoru.uret(metin) : null;
                        if (madde && zincirData && !zincirData.hata) {
                            madde.bulmacaHafiza = zincirData;
                            madde.bulmacaSonMetin = metin;
                            madde.bulmacaZarla = false; 
                        }
                    }

                    if (zincirData && zincirData.hata) {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold; text-align:center; padding:10px;">${zincirData.hata}</div>`;
                    }

                    if (!zincirData || !zincirData.grid) return `<div>Hata oluştu!</div>`;

                    // 1. İpuçlarını Çiz (Alt alta kelime listesi)
                    let ipucuHtml = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-bottom:20px;">`;
                    zincirData.kelimeler.forEach(k => {
                        ipucuHtml += `<div style="padding:4px 12px; background:#fff; border:2px solid #f1c40f; border-radius:15px; font-family:'TemelYazi', sans-serif; font-size:16px; font-weight:bold; color:#d35400;">${k}</div>`;
                    });
                    ipucuHtml += `</div>`;

                    // 2. Yılan Gridini Çiz
                    let cellW = 42; 
                    let s = zincirData.sinirlar;
                    let pW = (s.maxX - s.minX + 1) * cellW;
                    let pH = (s.maxY - s.minY + 1) * cellW;

                    let yilanHtml = `<div style="position:relative; width:${pW}px; height:${pH}px; margin:0 auto;">`;
                    
                    for (let key in zincirData.grid) {
                        let cell = zincirData.grid[key];
                        let [x, y] = key.split(',').map(Number);
                        let px = (x - s.minX) * cellW;
                        let py = (y - s.minY) * cellW;
                        
                        let isDolu = cell.isNode || cell.isStart; // Sadece Kesişimler ve İlk harf görünür
                        let bg = cell.isStart ? '#2ecc71' : (cell.isNode ? '#f39c12' : '#fff');
                        let col = isDolu ? '#fff' : 'transparent'; // Harf gizli ama kutu var
                        let borderCol = cell.isStart ? '#27ae60' : (cell.isNode ? '#e67e22' : '#3498db');
                        
                        // ZEKÂ: Harfler şeffaf basılıyor ki öğretmen önizlemede vs görmek isterse sadece CSS rengini değiştirmesi yetsin!
                        yilanHtml += `<div style="position:absolute; left:${px}px; top:${py}px; width:${cellW}px; height:${cellW}px; border:3px solid ${borderCol}; background:${bg}; color:${col}; display:flex; align-items:center; justify-content:center; font-family:'TemelYazi', sans-serif; font-size:24px; font-weight:bold; box-sizing:border-box; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">${cell.char}</div>`;
                    }
                    yilanHtml += `</div>`;

                    return `<div style="width:100%; display:flex; flex-direction:column; align-items:center; padding:15px 0;">${ipucuHtml}${yilanHtml}</div>`;
                }

                // YENİ: MİNİ SUDOKU ÇİZİM MOTORU
                function miniSudokuOlustur(metin, madde = null, soruTipi = "Harfli veya Sayısal") {
                    if (!metin || metin.trim() === "") return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ 4 Adet Öge Girin ]</div>`;

                    let suData;
                    if (madde && madde.bulmacaHafiza && madde.bulmacaSonMetin === metin && !madde.bulmacaZarla) {
                        suData = madde.bulmacaHafiza;
                    } else {
                        suData = typeof MiniSudokuMotoru !== 'undefined' ? MiniSudokuMotoru.uret(metin) : null;
                        if (madde && suData && !suData.hata) {
                            madde.bulmacaHafiza = suData;
                            madde.bulmacaSonMetin = metin;
                            madde.bulmacaZarla = false; 
                        }
                    }

                    if (suData && suData.hata) return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold; text-align:center;">${suData.hata}</div>`;
                    if (!suData || !suData.bulmacaGrid) return `<div>Hata oluştu!</div>`;

                    let resimHafizasi = (madde && madde.gridResimleri) ? madde.gridResimleri : (typeof aktifGridResimleri !== 'undefined' ? aktifGridResimleri : {});

                    // 1. İpuçları (Kullanılacak Ögeler Listesi)
                    let ipucuHtml = `<div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">`;
                    suData.ogeler.forEach((oge, idx) => {
                        let gorselHtml = oge;
                        if (soruTipi === "Nesneli (Görsel)") {
                            let kullaniciResmi = resimHafizasi[idx];
                            if (kullaniciResmi) {
                                gorselHtml = `<img src="${kullaniciResmi}" style="width:30px; height:30px; object-fit:contain;" />`;
                            } else {
                                let tK = typeof turkceTemizle === "function" ? turkceTemizle(oge) : oge.toLowerCase().trim();
                                let kKey = typeof svgKutuphanesi !== 'undefined' ? Object.keys(svgKutuphanesi).find(key => (typeof turkceTemizle === "function" ? turkceTemizle(key) : key.toLowerCase().trim()) === tK) : null;
                                if (kKey && svgKutuphanesi[kKey]) {
                                    let temizKod = svgKutuphanesi[kKey].replace(/stroke-width="[^"]*"/gi, "").replace(/stroke="[^"]*"/gi, "").replace(/fill="[^"]*"/gi, "");
                                    gorselHtml = `<svg width="30" height="30" viewBox="-10 -10 120 120"><g fill="none" stroke="#e67e22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${temizKod}</g></svg>`;
                                } else {
                                    gorselHtml = `<span style="font-size:20px; color:#e74c3c; font-weight:bold;">?</span>`;
                                }
                            }
                        }
                        ipucuHtml += `<div style="padding:6px 12px; background:#fff; border:2px dashed #9b59b6; border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:'TemelYazi', sans-serif; font-size:20px; font-weight:bold; color:#8e44ad;">${gorselHtml}</div>`;
                    });
                    ipucuHtml += `</div>`;

                    // 2. Sudoku Tablosu Çizimi (4x4)
                    let cellW = 60;
                    let gridHtml = `<div style="display:grid; grid-template-columns:repeat(4, ${cellW}px); grid-template-rows:repeat(4, ${cellW}px); border:4px solid #2c3e50; width:max-content; margin:0 auto; background:#fff; box-shadow:0 4px 10px rgba(0,0,0,0.1);">`;
                    
                    for(let r=0; r<4; r++) {
                        for(let c=0; c<4; c++) {
                            let bRight = (c === 1) ? '3px solid #2c3e50' : '1px solid #bdc3c7'; // 2x2 Blok ayrımı (Dikey)
                            let bBot = (r === 1) ? '3px solid #2c3e50' : '1px solid #bdc3c7';   // 2x2 Blok ayrımı (Yatay)
                            if (c === 3) bRight = 'none';
                            if (r === 3) bBot = 'none';

                            let ogeIndex = suData.bulmacaGrid[r][c];
                            let cellIcerik = "";

                            if (ogeIndex !== null) {
                                let oge = suData.ogeler[ogeIndex];
                                cellIcerik = `<span style="font-family:'TemelYazi', sans-serif; font-size:28px; font-weight:bold; color:#2c3e50;">${oge}</span>`;
                                
                                if (soruTipi === "Nesneli (Görsel)") {
                                    let kullaniciResmi = resimHafizasi[ogeIndex];
                                    if (kullaniciResmi) {
                                        cellIcerik = `<img src="${kullaniciResmi}" style="width:45px; height:45px; object-fit:contain;" />`;
                                    } else {
                                        let tK = typeof turkceTemizle === "function" ? turkceTemizle(oge) : oge.toLowerCase().trim();
                                        let kKey = typeof svgKutuphanesi !== 'undefined' ? Object.keys(svgKutuphanesi).find(key => (typeof turkceTemizle === "function" ? turkceTemizle(key) : key.toLowerCase().trim()) === tK) : null;
                                        if (kKey && svgKutuphanesi[kKey]) {
                                            let temizKod = svgKutuphanesi[kKey].replace(/stroke-width="[^"]*"/gi, "").replace(/stroke="[^"]*"/gi, "").replace(/fill="[^"]*"/gi, "");
                                            cellIcerik = `<svg width="45" height="45" viewBox="-10 -10 120 120"><g fill="none" stroke="#e67e22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${temizKod}</g></svg>`;
                                        } else {
                                            cellIcerik = `<span style="font-size:28px; color:#e74c3c; font-weight:bold;">?</span>`;
                                        }
                                    }
                                }
                            }

                            gridHtml += `<div style="border-right:${bRight}; border-bottom:${bBot}; width:${cellW}px; height:${cellW}px; display:flex; align-items:center; justify-content:center; box-sizing:border-box;">${cellIcerik}</div>`;
                        }
                    }
                    gridHtml += `</div>`;

                    return `<div style="width:100%; display:flex; flex-direction:column; align-items:center; padding:15px 0;">${ipucuHtml}${gridHtml}</div>`;
                }

                // YENİ: OKUDUĞUNU EŞLEŞTİRME ÇİZİM MOTORU (GÖRSELLERİ KARIŞTIRIR)
                function okudugunuEslestirmeOlustur(madde = null, metinler = {}, resimler = {}) {
                    // Karıştırma (Shuffle) Algoritması - Zar atılınca veya yeni girilince sıralamayı bozar!
                    let sira = [0, 1, 2, 3];
                    if (madde && madde.karisikSira && !madde.bulmacaZarla) {
                        sira = madde.karisikSira;
                    } else {
                        sira = sira.sort(() => Math.random() - 0.5);
                        if (madde) {
                            madde.karisikSira = sira;
                            madde.bulmacaZarla = false;
                        }
                    }

                    let rowsHtml = "";
                    for(let i=0; i<4; i++) {
                        let orjIndex = i;
                        let cMetin = metinler[orjIndex] || `[ ${orjIndex+1}. Cümle girilmedi ]`;
                        
                        let resimIndex = sira[i];
                        let cResim = resimler[resimIndex];
                        let gorselHtml = "";
                        
                        if (cResim) {
                            gorselHtml = `<img src="${cResim}" style="width: 100%; height: 100%; object-fit: contain;" />`;
                        } else {
                            gorselHtml = `<div style="width:100%; height:100%; border:2px dashed #bdc3c7; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#95a5a6; font-size:12px;">Görsel ${resimIndex+1}</div>`;
                        }

                        rowsHtml += `
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;">
                            <div style="display: flex; align-items: center; width: 65%;">
                                <div style="flex:1; border: 2px solid #8bc34a; padding: 12px 15px; border-radius: 12px; font-family: 'TemelYazi', sans-serif; font-size: 24px; color: #2c3e50; background: #fdfefe; box-shadow: 0 4px 6px rgba(0,0,0,0.05); min-height: 40px; display: flex; align-items: center; justify-content:center;">${cMetin}</div>
                                <div style="width: 16px; height: 16px; border-radius: 50%; background: #e74c3c; margin-left: 15px; border: 3px solid #fdfefe; box-shadow: 0 0 0 2px #e74c3c;"></div>
                            </div>
                            <div style="display: flex; align-items: center; width: 25%;">
                                <div style="width: 16px; height: 16px; border-radius: 50%; background: #3498db; margin-right: 15px; border: 3px solid #fdfefe; box-shadow: 0 0 0 2px #3498db;"></div>
                                <div style="width: 90px; height: 90px; padding: 5px; border: 2px solid #3498db; border-radius: 12px; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                                    ${gorselHtml}
                                </div>
                            </div>
                        </div>`;
                    }

                    return `<div style="width: 100%; max-width: 600px; padding: 20px 0;">${rowsHtml}</div>`;
                }

                // YENİ: OKUDUĞUNU ÇİZME ÇİZİM MOTORU
                function okudugunuCizmeOlustur(metin) {
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Çizilecek Cümleyi Girin ]</div>`;
                    }

                    return `
                    <div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 15px;">
                        <div style="width: 95%; text-align: center; font-family: 'TemelYazi', sans-serif; font-size: 26px; color: #2c3e50; line-height: 1.4; padding: 5px 15px;">
                            ${metin}
                        </div>
                        <div style="width: 90%; height: 260px; border: 3px dashed #bdc3c7; border-radius: 16px; background: #fafafa; position: relative; box-shadow: inset 0 0 10px rgba(0,0,0,0.03);">
                            <div style="position: absolute; bottom: 12px; right: 18px; color: #bdc3c7; font-size: 35px; opacity: 0.5;">✏️</div>
                        </div>
                    </div>`;
                }

                // YENİ: OKUDUĞUNU BOYAMA / TAMAMLAMA ÇİZİM MOTORU (GELİŞMİŞ YERLEŞİM)
                function okudugunuBoyamaOlustur(metin, resimSrc, detaylar = []) {
                    let konum = "ust";
                    if (detaylar.includes("Görsel Altta")) konum = "alt";
                    if (detaylar.includes("Görsel Solda")) konum = "sol";
                    if (detaylar.includes("Görsel Sağda")) konum = "sag";

                    let imgHtml = "";
                    if (resimSrc) {
                        let maxHeight = (konum === "sol" || konum === "sag") ? "180px" : "250px";
                        imgHtml = `<img src="${resimSrc}" style="max-width: 100%; max-height: ${maxHeight}; object-fit: contain;" />`;
                    } else {
                        let h = (konum === "sol" || konum === "sag") ? "150px" : "200px";
                        imgHtml = `<div style="width:100%; height:${h}; border:2px dashed #bdc3c7; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#95a5a6; font-size:16px; font-weight:bold; background:#f9f9f9; min-width:150px;">[ Görsel Seçin ]</div>`;
                    }

                    let instructionsHtml = "";
                    if (metin && metin.trim() !== "") {
                        let lines = metin.split('\n').filter(l => l.trim() !== '');
                        lines.forEach(line => {
                            instructionsHtml += `
                            <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                                <div style="width: 24px; height: 24px; border: 2.5px solid #00bcd4; border-radius: 6px; background: #fff; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); margin-top: 2px;"></div>
                                <div style="font-family: 'TemelYazi', sans-serif; font-size: 22px; color: #2c3e50; line-height: 1.3;">${line}</div>
                            </div>`;
                        });
                    } else {
                        instructionsHtml = `<div style="color:#bdc3c7; font-style:italic; font-size:14px; text-align:center;">[ Panele öğrenci için yönergeler girin ]</div>`;
                    }

                    let imgContainer = `<div style="display: flex; justify-content: center; align-items: center; ${konum === 'sol' || konum === 'sag' ? 'flex: 1; max-width: 40%;' : 'width: 100%; min-height: 100px;'}">${imgHtml}</div>`;
                    
                    // FİX: Senin harika fikrin! Metin kutusu sadece içeriği kadar yer kaplasın (width: fit-content)
                    let textContainer = `<div style="background: #fafafa; border: 2px solid #ecf0f1; border-radius: 12px; padding: 20px 20px 8px 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); height: fit-content; width: fit-content; min-width: 200px; max-width: ${konum === 'sol' || konum === 'sag' ? '55%' : '95%'};">${instructionsHtml}</div>`;

                    let finalHtml = "";
                    if (konum === "ust") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; gap: 25px;">${imgContainer}${textContainer}</div>`;
                    } else if (konum === "alt") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; gap: 25px;">${textContainer}${imgContainer}</div>`;
                    } else if (konum === "sol") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 25px;">${imgContainer}${textContainer}</div>`;
                    } else if (konum === "sag") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 25px;">${textContainer}${imgContainer}</div>`;
                    }

                    return `<div style="width: 100%; display: flex; justify-content: center; padding: 15px 0;">${finalHtml}</div>`;
                }

                // YENİ: MANTIKSAL İŞARETLEME ÇİZİM MOTORU (ESNEK FLEX YAPI)
                function mantiksalIsaretlemeOlustur(metin, resimHafizasi = {}, detaylar = []) {
                    let konum = "ust";
                    if (detaylar.includes("Görsel Altta")) konum = "alt";
                    if (detaylar.includes("Görsel Solda")) konum = "sol";
                    if (detaylar.includes("Görsel Sağda")) konum = "sag";

                    let resimlerHtml = "";
                    
                    // Görselleri oluştur (2x2 sığması için ebatlar bir tık inceltildi)
                    for(let i=0; i<4; i++) {
                        let rSrc = resimHafizasi[i];
                        let icerik = rSrc 
                            ? `<img src="${rSrc}" style="width:75px; height:75px; object-fit:contain;" />` 
                            : `<span style="font-size:30px; color:#bdc3c7;">?</span>`;
                        
                        resimlerHtml += `
                        <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                            <div style="width:95px; height:95px; border:2px dashed #95a5a6; border-radius:14px; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
                                ${icerik}
                            </div>
                            <div style="width:30px; height:30px; border:3px solid #34495e; border-radius:6px; background:#fff; box-shadow:inset 0 2px 4px rgba(0,0,0,0.05);"></div>
                        </div>`;
                    }

                    let yonergeHtml = "";
                    if (metin && metin.trim() !== "") {
                        let lines = metin.split('\n').filter(l => l.trim() !== '');
                        let metinIcerik = lines.map(line => `<div style="margin-bottom:6px;">${line}</div>`).join("");
                        yonergeHtml = `<div style="font-family: 'TemelYazi', sans-serif; font-size: 22px; color: #2c3e50; line-height: 1.3; text-align:center;">${metinIcerik}</div>`;
                    } else {
                        yonergeHtml = `<div style="color:#bdc3c7; font-style:italic; font-size:14px; text-align:center;">[ Panele öğrenci için yönerge girin ]</div>`;
                    }

                    // FİX: Flex Container! Yanlarda ise flex-wrap ile kutular 2x2 dizilir, %45 genişlik alır.
                    let imgContainerStyle = (konum === 'sol' || konum === 'sag') 
                        ? `display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; flex: 1; max-width: 50%;` 
                        : `display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; width: 100%;`;

                    let imgContainer = `<div style="${imgContainerStyle}">${resimlerHtml}</div>`;
                    let textContainer = `<div style="background: #fafafa; border: 2px solid #ecf0f1; border-radius: 12px; padding: 15px 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); height: fit-content; width: fit-content; min-width: 200px; max-width: ${(konum === 'sol' || konum === 'sag') ? '50%' : '95%'};">${yonergeHtml}</div>`;

                    let finalHtml = "";
                    if (konum === "ust") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; gap: 25px;">${imgContainer}${textContainer}</div>`;
                    } else if (konum === "alt") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; gap: 25px;">${textContainer}${imgContainer}</div>`;
                    } else if (konum === "sol") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 25px;">${imgContainer}${textContainer}</div>`;
                    } else if (konum === "sag") {
                        finalHtml = `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 25px;">${textContainer}${imgContainer}</div>`;
                    }

                    return `<div style="width: 100%; display: flex; justify-content: center; padding: 15px 0;">${finalHtml}</div>`;
                }

                // YENİ: OLAY SIRALAMA ÇİZİM MOTORU
                function olaySiralamaOlustur(metin, madde = null) {
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Cümleleri Alt Alta Girin ]</div>`;
                    }

                    let cumleler = metin.split('\n').map(c => c.trim()).filter(c => c.length > 0);
                    if (cumleler.length < 2) {
                         return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold;">Sıralama için en az 2 cümle girmelisiniz!</div>`;
                    }

                    // ZEKÂ: Cümleleri Otomatik Karıştırma (Zar Atıldıkça Değişir)
                    let sira = Array.from({length: cumleler.length}, (_, i) => i);
                    if (madde && madde.karisikSira && !madde.bulmacaZarla) {
                        sira = madde.karisikSira;
                    } else {
                        sira = sira.sort(() => Math.random() - 0.5);
                        if (madde) {
                            madde.karisikSira = sira;
                            madde.bulmacaZarla = false;
                        }
                    }

                    let rowsHtml = "";
                    sira.forEach((index) => {
                        let cMetin = cumleler[index];
                        rowsHtml += `
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; width: 100%;">
                            <div style="width: 50px; height: 50px; border: 3px solid #4caf50; border-radius: 12px; background: #fff; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); flex-shrink: 0; display:flex; align-items:center; justify-content:center;"></div>
                            <div style="flex: 1; border: 2px solid #ecf0f1; border-radius: 12px; padding: 12px 18px; background: #fafafa; font-family: 'TemelYazi', sans-serif; font-size: 24px; color: #2c3e50; line-height: 1.3; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                                ${cMetin}
                            </div>
                        </div>`;
                    });

                    return `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; padding: 15px 0;">${rowsHtml}</div>`;
                }

                // YENİ: KELİME AVCISI (BOŞLUK DOLDURMA) ÇİZİM MOTORU
                function kelimeAvcisiBoslukOlustur(metin, madde = null) {
                    if (!metin || metin.trim() === "") {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Cümleleri ve [gizli] kelimeleri girin ]</div>`;
                    }

                    let cumleler = metin.split('\n').map(c => c.trim()).filter(c => c.length > 0);
                    let kelimeBankasi = [];
                    let islenmisCumleler = [];

                    // ZEKÂ: Cümlelerdeki [kelime] yapılarını bul, sök, boşluk çizgisi koy!
                    cumleler.forEach(cumle => {
                        let matches = cumle.match(/\[(.*?)\]/g);
                        let islenmis = cumle;
                        if (matches) {
                            matches.forEach(m => {
                                let kelime = m.replace('[', '').replace(']', '').trim();
                                if(kelime) kelimeBankasi.push(kelime);
                                // Kelimeyi silip yerine öğrencinin yazacağı şık bir kesikli çizgi ekliyoruz
                                islenmis = islenmis.replace(m, `<span style="display:inline-block; min-width:80px; padding:0 15px; height:30px; border-bottom:3px dashed #3498db; margin:0 8px; transform:translateY(8px);"></span>`);
                            });
                        }
                        islenmisCumleler.push(islenmis);
                    });

                    if (kelimeBankasi.length === 0) {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold; text-align:center;">Lütfen gizlenecek kelimeleri [köşeli parantez] içine alın!<br>(Örn: Ali [top] oynadı)</div>`;
                    }

                    // Kelimeleri Karıştır (Zar Atılınca Yeniden Karışır)
                    let sira = Array.from({length: kelimeBankasi.length}, (_, i) => i);
                    if (madde && madde.karisikSira && !madde.bulmacaZarla && madde.karisikSira.length === kelimeBankasi.length) {
                        sira = madde.karisikSira;
                    } else {
                        sira = sira.sort(() => Math.random() - 0.5);
                        if (madde) {
                            madde.karisikSira = sira;
                            madde.bulmacaZarla = false;
                        }
                    }

                    let karisikKelimeler = sira.map(i => kelimeBankasi[i]);

                    // 1. Kelime Bankası Çizimi (Yukarıdaki Kutu)
                    let bankaHtml = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin-bottom:30px; padding:15px 20px; border:2px dashed #f39c12; border-radius:12px; background:#fffdf5; width:100%; box-sizing:border-box;">`;
                    karisikKelimeler.forEach(k => {
                        bankaHtml += `<div style="padding:6px 18px; border:2px solid #e67e22; border-radius:20px; font-family:'TemelYazi', sans-serif; font-size:24px; font-weight:normal; color:#d35400; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,0.05);">${k}</div>`;
                    });
                    bankaHtml += `</div>`;

                    // 2. Eksik Cümlelerin Çizimi (Alttaki Liste)
                    let rowsHtml = "";
                    islenmisCumleler.forEach((cMetin, index) => {
                        rowsHtml += `
                        <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; width: 100%;">
                            <div style="width:30px; height:30px; border-radius:50%; background:#3498db; color:#fff; font-family:sans-serif; font-size:16px; font-weight:bold; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px;">${index+1}</div>
                            <div style="flex: 1; font-family: 'TemelYazi', sans-serif; font-size: 26px; color: #2c3e50; line-height: 1.6;">
                                ${cMetin}
                            </div>
                        </div>`;
                    });

                    return `<div style="width: 100%; max-width: 650px; display: flex; flex-direction: column; align-items: center; padding: 10px 0;">${bankaHtml}<div style="width:100%; padding:0 10px; box-sizing:border-box;">${rowsHtml}</div></div>`;
                }

                // YENİ: DOĞRU MU YANLIŞ MI ÇİZİM MOTORU
                function dogruMuYanlisMiOlustur(parca, yargilar) {
                    if ((!parca || parca.trim() === "") && (!yargilar || yargilar.trim() === "")) {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Okuma parçasını ve cümleleri girin ]</div>`;
                    }

                    // 1. Okuma Parçası Alanı
                    let parcaHtml = "";
                    if (parca && parca.trim() !== "") {
                        // Enter'ları <br> yap
                        let pFormatli = parca.replace(/\n/g, "<br>");
                        parcaHtml = `
                        <div style="width: 100%; background: #fffdf5; border: 2px dashed #f1c40f; border-radius: 12px; padding: 15px 20px; box-sizing: border-box; font-family: 'TemelYazi', sans-serif; font-size: 24px; color: #2c3e50; line-height: 1.5; box-shadow: inset 0 2px 5px rgba(0,0,0,0.02); margin-bottom: 25px;">
                            ${pFormatli}
                        </div>`;
                    }

                    // Gülen ve Üzgün Yüz SVG (Boyanabilir formda, içi beyaz)
                    let happySVG = `<svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" stroke="#2ecc71" stroke-width="2"/><path d="M8 14.5C9.5 16.5 14.5 16.5 16 14.5" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round"/><circle cx="8.5" cy="10" r="1.5" fill="#2ecc71"/><circle cx="15.5" cy="10" r="1.5" fill="#2ecc71"/></svg>`;
                    let sadSVG = `<svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" stroke="#e74c3c" stroke-width="2"/><path d="M8 16.5C9.5 14.5 14.5 14.5 16 16.5" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round"/><circle cx="8.5" cy="10" r="1.5" fill="#e74c3c"/><circle cx="15.5" cy="10" r="1.5" fill="#e74c3c"/></svg>`;

                    // 2. Yargı Cümleleri
                    let yargilarHtml = "";
                    if (yargilar && yargilar.trim() !== "") {
                        let lines = yargilar.split('\n').filter(l => l.trim() !== '');
                        lines.forEach(line => {
                            yargilarHtml += `
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 15px; width: 100%; border-bottom: 1px dashed #ecf0f1; padding-bottom: 10px;">
                                <div style="flex: 1; font-family: 'TemelYazi', sans-serif; font-size: 24px; color: #34495e; line-height: 1.3;">${line}</div>
                                <div style="display: flex; gap: 12px; align-items: center; flex-shrink: 0; padding-right:5px;">
                                    <div style="cursor:pointer;" title="Doğru">${happySVG}</div>
                                    <div style="cursor:pointer;" title="Yanlış">${sadSVG}</div>
                                </div>
                            </div>`;
                        });
                    }

                    return `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; padding: 10px 0;">${parcaHtml}<div style="width:100%; padding:0 5px; box-sizing:border-box;">${yargilarHtml}</div></div>`;
                }

                // YENİ: 5N1K VE ÇOKTAN SEÇMELİ ÇİZİM MOTORU (HİBRİT)
                function besNBirKOlustur(parca, soru, resimHafizasi = {}) {
                    if ((!parca || parca.trim() === "") && (!soru || soru.trim() === "")) {
                        return `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px;">[ Okuma parçasını ve soruyu girin ]</div>`;
                    }

                    // 1. Okuma Parçası Alanı
                    let parcaHtml = "";
                    if (parca && parca.trim() !== "") {
                        let pFormatli = parca.replace(/\n/g, "<br>");
                        parcaHtml = `
                        <div style="width: 100%; background: #fffdf5; border: 2px dashed #f1c40f; border-radius: 12px; padding: 15px 20px; box-sizing: border-box; font-family: 'TemelYazi', sans-serif; font-size: 24px; color: #2c3e50; line-height: 1.5; box-shadow: inset 0 2px 5px rgba(0,0,0,0.02); margin-bottom: 20px;">
                            ${pFormatli}
                        </div>`;
                    }

                    // 2. Soru Metni
                    let soruHtml = "";
                    if (soru && soru.trim() !== "") {
                        soruHtml = `<div style="font-family: 'TemelYazi', sans-serif; font-size: 26px; font-weight: bold; color: #e74c3c; margin-bottom: 20px; text-align:center; width:100%;">${soru}</div>`;
                    }

                    // 3. ZEKÂ: Şıklar mı yoksa Boşluk mu?
                    let seceneklerHtml = "";
                    if (resimHafizasi[0] || resimHafizasi[1] || resimHafizasi[2]) {
                        // Görsel girilmiş, Test Modu!
                        let harfler = ['A', 'B', 'C'];
                        let items = "";
                        for(let i=0; i<3; i++) {
                            let rSrc = resimHafizasi[i];
                            let img = rSrc ? `<img src="${rSrc}" style="width:90%; height:90%; object-fit:contain;" />` : `<span style="color:#bdc3c7;">?</span>`;
                            
                            items += `
                            <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
                                <div style="width:36px; height:36px; border-radius:50%; background:#e74c3c; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${harfler[i]}</div>
                                <div style="width:110px; height:110px; border:2px solid #bdc3c7; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.02);">${img}</div>
                            </div>`;
                        }
                        seceneklerHtml = `<div style="display:flex; justify-content:space-around; width:100%; align-items:flex-end;">${items}</div>`;
                    } else {
                        // Görsel yok, Klasik Boşluk Doldurma Modu!
                        seceneklerHtml = `
                        <div style="display:flex; align-items:center; justify-content:flex-start; width:100%; gap:15px; padding-left:20px;">
                            <span style="font-family: 'TemelYazi', sans-serif; font-size: 24px; color: #2c3e50;">Cevap:</span>
                            <div style="flex:1; max-width:400px; border-bottom:3px dashed #95a5a6; height:30px;"></div>
                        </div>`;
                    }

                    return `<div style="width: 100%; max-width: 600px; display: flex; flex-direction: column; align-items: center; padding: 10px 0;">${parcaHtml}${soruHtml}${seceneklerHtml}</div>`;
                }

                // YENİ: OKUYALIM YAZALIM ÇİZİM MOTORU (GÖRSELE BİREBİR UYGUN)
                function okuyalimYazalimOlustur(baslik, metin, satirSayisi) {
                    let sSayisi = parseInt(satirSayisi) || 6;
                    
                    // 1. Amorf (Bulutsuz) Arka Planlı Metin Alanı
                    let metinKutusuHtml = "";
                    if (metin && metin.trim() !== "") {
                        let bHtml = baslik ? `<div style="font-family: 'TemelYazi', sans-serif; font-size: 26px; font-weight: bold; margin-bottom: 12px; letter-spacing: 1px;">${baslik}</div>` : "";
                        let mFormatli = metin.replace(/\n/g, "<br>");
                        
                        metinKutusuHtml = `
                        <div style="background: #a2d9ce; border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%; padding: 35px 50px; text-align: center; max-width: 85%; margin: 0 auto 30px auto; box-shadow: 4px 6px 0 rgba(0,0,0,0.05); position: relative; border: 2px solid #76d7c4;">
                            ${bHtml}
                            <div style="font-family: 'TemelYazi', sans-serif; font-size: 24px; line-height: 1.4; color: #2c3e50; text-align: left; display: inline-block;">
                                ${mFormatli}
                            </div>
                        </div>`;
                    } else {
                        metinKutusuHtml = `<div style="width:100%; height:100px; display:flex; align-items:center; justify-content:center; color:#bdc3c7; font-weight:bold; border:2px dashed #ecf0f1; border-radius:8px; margin-bottom:20px;">[ Metin Girin ]</div>`;
                    }

                    // 2. Kılavuz Çizgiler (Ortası Renkli)
                    let cizgilerHtml = "";
                    for(let i=0; i<sSayisi; i++) {
                        cizgilerHtml += `
                        <div style="width: 100%; height: 42px; display: flex; flex-direction: column; margin-bottom: 18px; border-top: 1px solid #7f8c8d; border-bottom: 1px solid #7f8c8d; box-sizing: border-box;">
                            <div style="flex: 1; border-bottom: 1px dashed #bdc3c7;"></div>
                            <div style="flex: 1; background: #fae5d3; border-bottom: 1px dashed #bdc3c7;"></div>
                            <div style="flex: 1;"></div>
                        </div>`;
                    }

                    return `<div style="width: 100%; max-width: 650px; display: flex; flex-direction: column; align-items: center; padding: 10px 0;">
                        ${metinKutusuHtml}
                        <div style="width: 100%; padding: 0 10px; box-sizing: border-box;">${cizgilerHtml}</div>
                    </div>`;
                }


            

                






        function canliOnizlemeyiCiz(konu, soruTipi, secilenler) {
        const ornekGorselAlani = document.getElementById('ornek-gorsel-alani');
        const ornekResim = document.getElementById('konu-ornek-resim');
        if(!ornekGorselAlani) return;

        let canliKutu = document.getElementById('canli-onizleme-kutusu');
        if (!canliKutu) {
            canliKutu = document.createElement('div');
            canliKutu.id = 'canli-onizleme-kutusu';
            canliKutu.style.width = "100%";
            canliKutu.style.minHeight = "100px";
            canliKutu.style.background = "#fff";
            canliKutu.style.border = "2px dashed #4DB8FF";
            canliKutu.style.borderRadius = "8px";
            canliKutu.style.display = "flex";
            canliKutu.style.alignItems = "center";
            canliKutu.style.justifyContent = "center";
            canliKutu.style.marginTop = "10px";
            canliKutu.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.05)";
            ornekGorselAlani.appendChild(canliKutu);
        }

        // YENİ: Harf seçili ama "Soru Tipi" boşsa o karanlık hata fotoğrafını gizle!
        if (konu && konu.includes("Harfi") && (!soruTipi || soruTipi === "")) {
            canliKutu.style.display = "none";
            if(ornekResim) ornekResim.style.display = "none";
            return; 
        }

        if (konu && konu.includes("Kesikli çizgili-konturlu")) {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let seciliObjeler = secilenler.length > 0 ? secilenler : ["Ev"];
            let svglerHtml = seciliObjeler.map(isim => { 
                let svgPath = nesneSVGleri[isim] || nesneSVGleri["Ev"]; 
                return `<svg width="45" height="45" viewBox="0 0 100 100" style="overflow: visible; flex-shrink: 0; margin: 3px;">
                            <g fill="none" stroke="#2c3e50" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4, 4">
                                ${svgPath}
                            </g>
                        </svg>`; 
            }).join("");
            
            canliKutu.innerHTML = `<div style="width: 100%; min-height: 60px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; padding: 5px;">${svglerHtml}</div>`;
        }
        else if (isSatirCizgisi(konu)) {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = `<div style="width: 100%; transform: scale(0.85); transform-origin: center;">${generateLiveRowSVG(konu, secilenler)}</div>`;
        }
        else if (konu === "Labirent Çalışmaları") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let miniLab = rastgeleLabirentUret(12, 5);
            canliKutu.innerHTML = `
                <div style="width: 100%; height: 90px; display: flex; align-items: center; justify-content: center;">
                    <svg width="85%" height="90%" viewBox="-45 -10 ${miniLab.width + 90} ${miniLab.height + 20}" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">
                        <path d="${miniLab.path}" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="square" />
                        <text x="-42" y="11" font-size="10" font-weight="bold" fill="#e74c3c" font-family="sans-serif">GİRİŞ</text>
                        <text x="${miniLab.width + 5}" y="${miniLab.height - 4}" font-size="10" font-weight="bold" fill="#27ae60" font-family="sans-serif">ÇIKIŞ</text>
                    </svg>
                </div>`;
        }
        else if (cizgiKutuphanesi && cizgiKutuphanesi[konu]) {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            let dondurmeStili = secilenler.includes("Dikey Yönde") ? "transform: rotate(90deg);" : "";
            canliKutu.innerHTML = `<div style="width: 90%; height: 60px; display: flex; align-items: center; justify-content: center; ${dondurmeStili}">${cizgiKutuphanesi[konu]}</div>`;
        } 
        else if (konu === "Karmaşık Yol/Eşleştirme Çalışmaları (Spagetti Labirent)") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let secilenYol = "3 Yollu Kördüğüm";
            secilenler.forEach(sec => { if (sec.includes("Yollu Kördüğüm")) secilenYol = sec; });
            
            let yollar = spagettiYollar[secilenYol] || spagettiYollar["3 Yollu Kördüğüm"];
            let borders = ""; let fills = "";
            yollar.forEach(yol => {
                borders += `<path d="${yol.d}" stroke="#2c3e50" stroke-width="16" fill="none" stroke-linecap="butt" stroke-linejoin="round" />`;
                fills += `<path d="${yol.d}" stroke="#f1c40f" stroke-width="10" fill="none" stroke-linecap="butt" stroke-linejoin="round" />`;
            });
            
            canliKutu.innerHTML = `<div style="width: 100%; height: 90px; display: flex; align-items: center; justify-content: center;"><svg width="95%" height="100%" viewBox="-20 -20 640 320" preserveAspectRatio="xMidYMid meet"><g>${borders}</g><g>${fills}</g></svg></div>`;
        }
        else if (["Sesi Barındıranı İşaretleme", "Sesin Konumunu Bulma", "Sesi Barındıranı Boyama"].includes(soruTipi)) {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let cols = document.getElementById('grid-col-input') ? parseInt(document.getElementById('grid-col-input').value) : 2;
            let rows = document.getElementById('grid-row-input') ? parseInt(document.getElementById('grid-row-input').value) : 4;
            let tema = document.getElementById('kutu-temasi-secimi') ? document.getElementById('kutu-temasi-secimi').value : "modern";
            let stil = document.getElementById('kenar-stili-secimi') ? document.getElementById('kenar-stili-secimi').value : "solid";
            let yuvSayisi = document.getElementById('grid-yuvarlak-input') ? parseInt(document.getElementById('grid-yuvarlak-input').value) : 1;

            let bRadius = "10px";
            if(tema === "capraz") bRadius = "15px 2px 15px 2px";
            if(tema === "bulut") bRadius = "20px 15px 25px 20px";

            let bStil = (stil === "suslu") ? "double" : stil;
            let susluOutline = (stil === "suslu") ? `outline: 2px dotted #a2d148; outline-offset: 2px;` : "";
            
            let borderCSS = `border: 2px solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, '#a2d148')}'); border-image-slice: 30; border-image-width: 10px; border-image-outset: 4px; border-image-repeat: round; border-radius: ${bRadius}; ${susluOutline}`;

            let gridHtml = `<div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 8px; width: 90%; padding: 10px;">`;
            for(let r=0; r<rows; r++){
                for(let c=0; c<cols; c++){
                    let idx = r * cols + c;
                    let imgSrc = aktifGridResimleri[idx] || "";
                    let metin = aktifGridMetinleri[idx] || ""; 
                    
                    let gorselHtml = "";
                    if (imgSrc) {
                        gorselHtml = `<img src="${imgSrc}" style="width: 25px; height: 25px; object-fit: contain; margin-top: 2px;" />`;
                    } else if (!metin) {
                        gorselHtml = `<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' fill='%23eee'><rect width='30' height='30'/></svg>" style="width: 25px; height: 25px; object-fit: contain; margin-top: 2px;" />`;
                    }

                    let metinHtml = metin ? `<div style="font-size: 13px; font-weight: 700; color: #2c3e50; font-family: 'Quicksand', sans-serif; text-align: center; margin-top: 2px;">${metin}</div>` : "";
                    
                    let yuvHtml = `<div style="display: flex; gap: 3px; margin-top: auto; margin-bottom: 3px;">`;
                    for(let y=0; y<yuvSayisi; y++){ yuvHtml += `<div style="width: 10px; height: 10px; border: 1.5px solid #a2d148; border-radius: 50%; background: #fff;"></div>`; }
                    yuvHtml += `</div>`;

                    gridHtml += `
                        <div style="${borderCSS} padding: 4px; display: flex; flex-direction: column; align-items: center; background: #fff; background-clip: padding-box; height: 60px; justify-content: flex-start; box-sizing: border-box;">
                            ${gorselHtml}
                            ${metinHtml}
                            ${yuvHtml}
                        </div>`;
                }
            }
            gridHtml += `</div>`;
            canliKutu.innerHTML = gridHtml;
        }

        else if (konu.includes("Harfi") && soruTipi === "Dış Hat Boyama") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";

            if (secilenler.includes("Görsel Boyama")) {
                let imgSrc = aktifBaslangicResmiTek || "";
                let imgTag = imgSrc ? `<img src="${imgSrc}" style="width: 90px; height: 90px; object-fit: contain;" />` : `<div style="font-size:11px; color:#777; border: 1px dashed #ccc; padding: 20px; border-radius: 8px;">[ Görsel Eklenecek ]</div>`;
                canliKutu.innerHTML = `<div style="width: 100%; min-height: 120px; display: flex; align-items: center; justify-content: center; padding: 15px;">${imgTag}</div>`;
            } else {
                let harf = konu.split(" ")[0];
            let buyukHarf = harf.toLocaleUpperCase('tr-TR');
            let kucukHarf = harf.toLocaleLowerCase('tr-TR');
            if (harf === "İ") { buyukHarf = "İ"; kucukHarf = "i"; }
            if (harf === "I") { buyukHarf = "I"; kucukHarf = "ı"; }

            let harfDizisi = [];
            if (secilenler.includes("Küçük Harf") && !secilenler.includes("Büyük Harf")) harfDizisi.push(kucukHarf);
            else if (secilenler.includes("Büyük Harf") && !secilenler.includes("Küçük Harf")) harfDizisi.push(buyukHarf);
            else harfDizisi.push(buyukHarf, kucukHarf);

            // Dış hat boyama için en iyi font "meb-kesik-kontur"dur
            let harflerHtml = harfDizisi.map(h => `<span class="meb-kesik-kontur" style="font-size: 110px; color: #2c3e50; line-height: 1; margin: 0 15px;">${h}</span>`).join('');

            canliKutu.innerHTML = `
            <div style="width: 100%; min-height: 120px; display: flex; align-items: center; justify-content: center; padding: 15px;">
                ${harflerHtml}
            </div>`;
        }
        } 

        // YENİ HARF MOTORU ÖNİZLEMESİ BURADA!
        else if (konu.includes("Harfi") && soruTipi === "Harf Yazımı") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";

            let harf = konu.split(" ")[0];
            let buyukHarf = harf.toLocaleUpperCase('tr-TR');
            let kucukHarf = harf.toLocaleLowerCase('tr-TR');
            
            if (harf === "İ") { buyukHarf = "İ"; kucukHarf = "i"; }
            if (harf === "I") { buyukHarf = "I"; kucukHarf = "ı"; }
            
            let fontSinifi = "meb-temel";
            if (secilenler.includes("Kesikli Font")) fontSinifi = "meb-kesik-kontur";
            if (secilenler.includes("İçi Boş Font")) fontSinifi = "meb-kontur";
            
            let opacity = secilenler.includes("Hayalet Font") ? "0.2" : "1";
            let kilavuzAktif = secilenler.includes("Kılavuz Çizgi Ekle") || secilenler.includes("Hayalet Çizgi");
            let kilavuzOpacity = secilenler.includes("Hayalet Çizgi") ? "0.25" : "1";

            let harfDizisi = [];
            if (secilenler.includes("Sadece Küçük Harf")) harfDizisi.push(kucukHarf);
            else if (secilenler.includes("Sadece Büyük Harf")) harfDizisi.push(buyukHarf);
            else harfDizisi.push(buyukHarf, kucukHarf);

            let bgSvg = "";
            if (kilavuzAktif) {
                bgSvg = `
                <svg width="100%" height="100%" viewBox="0 0 600 96" preserveAspectRatio="none" style="position:absolute; top:0; left:0; z-index:0; overflow:visible; opacity:${kilavuzOpacity};">
                    <rect x="0" y="48" width="600" height="28" fill="#fff4cc" />
                    <rect x="0" y="20" width="600" height="56" fill="none" stroke="#2c3e50" stroke-width="1.5" />
                    <line x1="0" y1="48" x2="600" y2="48" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5, 5" />
                </svg>`;
            }

            let harflerHtml = "";
            let tekrarSayisi = 3; 
            for (let s = 0; s < tekrarSayisi; s++) {
                harfDizisi.forEach((h, charIndex) => {
                    let cClass = fontSinifi;
                    let fSize = 80; 
                    
                    if (secilenler.includes("İlk Harf Devasa") && s === 0 && charIndex === 0) {
                        fSize = 110; 
                        cClass = "meb-temel"; 
                    } else if (secilenler.includes("İlk Harf Kılavuz (Gerisi Kesikli)")) {
                        cClass = (s === 0 && charIndex === 0) ? "meb-temel" : "meb-kesik-kontur";
                    }

                    harflerHtml += `<span class="${cClass}" style="font-size: ${fSize}px; color: #111; line-height: 0.75; margin: 0 10px; opacity: ${opacity}; position: relative; z-index: 1; display: inline-block; white-space: nowrap; transform: translateY(8px);">${h}</span>`;
                });
            }

            canliKutu.innerHTML = `
            <div style="width: 100%; height: 96px; position: relative; display: flex; align-items: flex-start; justify-content: center; overflow: hidden; padding-top: 15px;">
                ${bgSvg}
                <div style="display: flex; align-items: flex-start; justify-content: center; z-index: 1;">
                    ${harflerHtml}
                </div>
            </div>`;
        }

        else if (konu.includes("Harfi") && soruTipi === "Parmakla Takip Etme") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";

            let harf = konu.split(" ")[0];
            let detaylar = secilenler || []; 
            let isKucuk = detaylar.includes("Sadece Küçük Harf");
            let pDuzen = detaylar.includes("Yanına Satır At") ? "satirli" : "tek"; 
            let pBg = detaylar.includes("Kılavuz Çizgiyi Gizle") ? "yok" : "var"; 
            
            let fontClass = "meb-temel";
            if (detaylar.includes("Kesikli Font")) fontClass = "meb-kesik-kontur";
            else if (detaylar.includes("İçi Boş Font")) fontClass = "meb-kontur";

            let hText = isKucuk ? harf.toLocaleLowerCase('tr-TR') : harf.toLocaleUpperCase('tr-TR');
            if (harf === "İ") hText = isKucuk ? "i" : "İ";
            if (harf === "I") hText = isKucuk ? "ı" : "I";

            let hY = 19; 
            let fBoyut = 250; 
            let pBgH = fBoyut * 1.4; 
            let kutuH = pBgH * 0.5; 

            // ENİNE KÜÇÜLME HATASI ÇÖZÜMÜ: width="100%" iptal! Sabit width="600px" verip taşanı gizliyoruz. Çizgi aralıkları (dasharray) asla ezilmeyecek.
            let bgSvg = "";
            if (pBg === 'var') {
                bgSvg = `<svg width="600px" height="${pBgH}px" style="position:absolute; top:calc(50% - ${pBgH/2}px); left:0; z-index:-1;" preserveAspectRatio="xMinYMid slice">
                    <rect x="0" y="50%" width="600" height="25%" fill="#fff4cc" />
                    <rect x="0" y="25%" width="600" height="50%" fill="none" stroke="#2c3e50" stroke-width="1.5"/>
                    <line x1="0" y1="50%" x2="600" y2="50%" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="8,8"/>
                </svg>`;
            }

            let solKutu = `
            <div style="position:relative; width:${pDuzen === 'satirli' ? '40%' : '100%'}; display:flex; justify-content:center; align-items:center; height:${kutuH}px; overflow:hidden; border-radius:8px; border: 1px solid #ccc; background: white;">
                ${bgSvg}
                <div style="position:relative; transform: scale(0.6); display:flex; justify-content:center; align-items:center;">
                    <div style="transform: translateY(${hY}px);">
                        <span class="${fontClass}" style="font-size: ${fBoyut}px; color: #34495e; line-height: 0.8; display: block;">${hText}</span>
                    </div>
                </div>
            </div>`;

            // SENİN YENİ MANTIĞIN: Yan tarafa zorla satır ekleyip tarayıcıyı boğmuyoruz. Sadece öğretmene bilgi veriyoruz.
            let sagKutu = "";
            if (pDuzen === 'satirli') {
                sagKutu = `
                <div style="width:58%; height:${kutuH}px; border:2px dashed #bdc3c7; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#7f8c8d; font-size:11px; font-weight:bold; text-align:center; padding:10px; background:#f8f9fa;">
                    👉 Harf sola sabitlendi!<br>Şimdi alttan ekleyeceğiniz<br>"Boş Kılavuz Satırları" otomatik<br>olarak harfin sağına uzanacak.
                </div>`;
            }

            canliKutu.innerHTML = `
            <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 15px 10px;">
                ${solKutu}
                ${sagKutu}
            </div>`;
        }

        // =========================================================
        // YENİ: GİZLİ HARF BULMA MOTORU (CANLI ÖNİZLEME)
        // =========================================================
        else if (konu.includes("Harfi") && soruTipi === "Gizli Harf Bulma") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";

            let harf = konu.split(" ")[0];
            let buyukHarf = harf.toLocaleUpperCase('tr-TR');
            if (harf === "İ") buyukHarf = "İ"; 
            if (harf === "I") buyukHarf = "I";

            let harfIndex = mebHarfSirasiBuyuk.indexOf(buyukHarf);
            if (harfIndex === -1) harfIndex = 5; 

            let aktifDetaylar = secilenler || [];
            let isKucuk = aktifDetaylar.includes("Sadece Küçük Harf");
            let isBuyuk = aktifDetaylar.includes("Sadece Büyük Harf");
            let ogrenilmemisEklensin = aktifDetaylar.includes("Henüz Öğrenilmemiş Harfler Eklensin");
            
            if(!isKucuk && !isBuyuk) { isKucuk = true; isBuyuk = true; }

            let havuz = [];
            let sinir = ogrenilmemisEklensin ? mebHarfSirasiBuyuk.length : (harfIndex + 1);
            
            for (let i = 0; i < sinir; i++) {
                if (isBuyuk) havuz.push(mebHarfSirasiBuyuk[i]);
                if (isKucuk) havuz.push(mebHarfSirasiKucuk[i]);
            }
            if (havuz.length < 3) havuz.push('E', 'e', 'A', 'a');

            let hedefHavuz = [];
            if (isBuyuk) hedefHavuz.push(buyukHarf);
            if (isKucuk) hedefHavuz.push(mebHarfSirasiKucuk[mebHarfSirasiBuyuk.indexOf(buyukHarf)] || harf.toLocaleLowerCase('tr-TR'));

            // Kutu Şeması Ayarları
            let tema = document.getElementById('kutu-temasi-secimi') ? document.getElementById('kutu-temasi-secimi').value : "modern";
            let stil = document.getElementById('kenar-stili-secimi') ? document.getElementById('kenar-stili-secimi').value : "dashed";
            let cRengi = "#3498db"; // Önizleme için standart renk
            
            let bRadius = "12px";
            if(tema === "capraz") bRadius = "15px 4px 15px 4px"; 
            if(tema === "bulut") bRadius = "25px 20px 30px 25px"; 
            let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 4px;` : "";
            let boxThickness = (stil === "suslu") ? "4px" : "3px";
            let borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 15px; border-image-outset: 5px; border-image-repeat: round; background-color: #fdfefe; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); ${susluOutline}`;

            let harflerSVG = "";
            for(let r=0; r<4; r++) {
                for(let c=0; c<12; c++) {
                    let cx = 35 + (c * 46) + (Math.random() * 12 - 6); 
                    let cy = 35 + (r * 35) + (Math.random() * 10 - 5); 
                    let rot = Math.floor(Math.random() * 41) - 20; 
                    
                    let basilacakHarf = "";
                    if (Math.random() < 0.15 && hedefHavuz.length > 0) {
                        basilacakHarf = hedefHavuz[Math.floor(Math.random() * hedefHavuz.length)];
                    } else {
                        basilacakHarf = havuz[Math.floor(Math.random() * havuz.length)];
                    }

                    let rSize = 26 + Math.floor(Math.random() * 11);
                    // YENİ: Font TemelYazi ve normal kalınlık yapıldı!
                    harflerSVG += `<text x="${cx}" y="${cy}" font-family="'TemelYazi', sans-serif" font-weight="normal" font-size="${rSize}px" fill="#2c3e50" transform="rotate(${rot}, ${cx}, ${cy})">${basilacakHarf}</text>`;
                }
            }

            // YENİ: width="100%" yapılarak yan panellere taşması engellendi.
            canliKutu.innerHTML = `
            <div style="width: 100%; display: flex; align-items: center; justify-content: center; padding: 10px;">
                <div style="${borderCSS} width: 100%; max-width: 600px;">
                    <svg width="100%" height="auto" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">
                        ${harflerSVG}
                    </svg>
                </div>
            </div>`;
        }

        // =========================================================
        // YENİ: SES SAYISI KADAR YAZMA (CANLI ÖNİZLEME)
        // =========================================================
        else if (soruTipi === "Ses Sayısı Kadar Yazma") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";

            let cols = document.getElementById('grid-col-input') ? parseInt(document.getElementById('grid-col-input').value) : 2;
            let rows = document.getElementById('grid-row-input') ? parseInt(document.getElementById('grid-row-input').value) : 4;
            let sliderVal = document.getElementById('ilk-nesne-boyutu') ? parseInt(document.getElementById('ilk-nesne-boyutu').value) : 100;
            
            let aktifDetaylar = secilenler || [];
            let cizgiVarMi = aktifDetaylar.includes("Noktalı Çizgi Çiz");
            let esittirVarMi = aktifDetaylar.includes("Eşittir (=) Koy");

            // YENİ: Önizleme için CSS Kutu Motorunu devreye soktuk!
            let tema = document.getElementById('kutu-temasi-secimi') ? document.getElementById('kutu-temasi-secimi').value : "modern";
            let stil = document.getElementById('kenar-stili-secimi') ? document.getElementById('kenar-stili-secimi').value : "solid";
            let cRengi = "#3498db"; 
            
            let bRadius = "12px";
            if(tema === "capraz") bRadius = "15px 4px 15px 4px"; 
            if(tema === "bulut") bRadius = "25px 20px 30px 25px"; 
            let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 4px;` : "";
            let boxThickness = (stil === "suslu") ? "4px" : "3px";
            let borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 15px; border-image-outset: 5px; border-image-repeat: round; background-color: #fff; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: 0 4px 10px rgba(0,0,0,0.04); ${susluOutline}`;

            let kutuGorseli = cizgiVarMi 
                ? `<div style="width: 40px; border-bottom: 2.5px dashed #7f8c8d; margin-left: 10px; margin-bottom: 5px;"></div>`
                : `<div style="width: 25px; height: 25px; border: 2.5px solid #95a5a6; border-radius: 4px; margin-left: 10px;"></div>`;
            let esittirHtml = esittirVarMi ? `<span style="color:#7f8c8d; font-family:'Quicksand', sans-serif; font-weight:bold; font-size:20px; margin-left:10px;">=</span>` : "";

            let gridHtml = `<div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 15px; width: 100%; padding: 15px;">`;
            
            for(let i = 0; i < rows * cols; i++) {
                let imgSrc = aktifGridResimleri[i] || "";
                let metin = aktifGridMetinleri[i] || "";

                let gorselHtml = imgSrc ? `<img src="${imgSrc}" style="width: ${sliderVal * 0.4}px; height: ${sliderVal * 0.4}px; object-fit: contain; margin-right: 10px;" />` : ``;
                let fPunto = Math.max(sliderVal * 0.3, 14);
                let metinHtml = metin ? `<span style="font-size: ${fPunto}px; font-weight: 700; color: #2c3e50; font-family: 'TemelYazi', sans-serif;">${metin}</span>` : "";
                
                if (!imgSrc && !metin) metinHtml = `<span style="color: #bdc3c7;">—</span>`;

                gridHtml += `
                <div style="${borderCSS} display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; box-sizing: border-box; min-height: 50px;">
                    <div style="display: flex; align-items: center;">
                        ${gorselHtml}
                        ${metinHtml}
                    </div>
                    <div style="display: flex; align-items: center;">
                        ${esittirHtml}
                        ${kutuGorseli}
                    </div>
                </div>`;
            }
            gridHtml += `</div>`;

            canliKutu.innerHTML = `
            <div style="width: 100%; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 8px;">
                ${gridHtml}
            </div>`;
        }

        // =========================================================
        // YENİ: AKILLI MOTOR (BİRLEŞTİRME VE AYIRMA ÖNİZLEMESİ)
        // =========================================================
        else if (["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma"].includes(konu)) {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";

            let girilenMetin = aktifGridMetinleri[0] || "";
            let tema = document.getElementById('kutu-temasi-secimi') ? document.getElementById('kutu-temasi-secimi').value : "modern";
            let stil = document.getElementById('kenar-stili-secimi') ? document.getElementById('kenar-stili-secimi').value : "solid";
            
            let mod = konu.includes("Ayırma") ? "ayir" : "birlestir";
            let isCumle = (konu === "Cümle Oluşturma" || konu === "Kelimeye Ayırma");

            canliKutu.innerHTML = heceVeKelimeMotoru(girilenMetin, tema, stil, "#3498db", mod, isCumle);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        // =========================================================
        // YENİ: KILAVUZ ÇİZGİYE SERBEST YAZI (CANLI ÖNİZLEME)
        // =========================================================
        else if (konu === "Kılavuz Çizgiye Serbest Yazı") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let girilenMetin = aktifGridMetinleri[0] || "Atatürk";
            let fSize = 80; 
            let tekrar = 2; 
            
            let resimliMod = (soruTipi === "Yanına Resimli Yazı");
            let imgSrc = resimliMod ? (aktifBaslangicResmiTek || "") : "";
            let resimSagdaMi = secilenler.includes("Görseli Sağa Al (Varsayılan Sol)");
            
            canliKutu.innerHTML = serbestYaziOlustur(girilenMetin, secilenler, fSize, tekrar, imgSrc, resimliMod, resimSagdaMi, "");
            
            let imgStyle = secilenler.includes("Görseli Sağa Al (Varsayılan Sol)") ? "margin-left: auto;" : "";

            canliKutu.innerHTML = serbestYaziOlustur(girilenMetin, secilenler, fSize, tekrar, imgSrc, resimliMod, resimSagdaMi, imgStyle);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        // =========================================================
        // YENİ: OTOMATİK ÇENGEL BULMACA (CANLI ÖNİZLEME)
        // =========================================================
        else if (konu === "Otomatik Çengel Bulmaca") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let girilenMetin = aktifGridMetinleri[0] || "";
            canliKutu.innerHTML = bulmacaOlustur(girilenMetin, null, soruTipi); // Soru Tipi eklendi!
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        // =========================================================
        // YENİ: KELİME AVI (CANLI ÖNİZLEME)
        // =========================================================
        else if (konu === "Kelime Avı (Sözcük Bulmaca)") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let girilenMetin = aktifGridMetinleri[0] || "";
            canliKutu.innerHTML = kelimeAviOlustur(girilenMetin);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        // =========================================================
        // YENİ: ŞİFRELİ MESAJ (CANLI ÖNİZLEME)
        // =========================================================
        else if (konu === "Şifreli Mesaj (Gizli Cümle)") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let girilenMetin = aktifGridMetinleri[0] || "";
            canliKutu.innerHTML = kriptogramOlustur(girilenMetin, null, soruTipi);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Harf Karıştırmaca") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let hamKelimeMetni = aktifGridMetinleri[0] || "";
            canliKutu.innerHTML = harfKaristirmaOlustur(hamKelimeMetni);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        // =========================================================
        // YENİ: LABİRENT (CANLI ÖNİZLEME)
        // =========================================================
        else if (konu === "Labirentten Kelime Toplama") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            
            let hamKelimeMetni = aktifGridMetinleri[0] || "";
            canliKutu.innerHTML = labirentKelimeOlustur(hamKelimeMetni);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Kelime Zinciri (Yılan Bulmaca)") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            let hamKelimeMetni = aktifGridMetinleri[0] || "";
            canliKutu.innerHTML = kelimeZinciriOlustur(hamKelimeMetni);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Mini Sudoku (4x4)") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            let hamKelimeMetni = aktifGridMetinleri[0] || "";
            canliKutu.innerHTML = miniSudokuOlustur(hamKelimeMetni, null, soruTipi);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Cümle-Görsel İlişkisi" && soruTipi === "Okuduğunu Eşleştirme") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = okudugunuEslestirmeOlustur(null, aktifGridMetinleri, aktifGridResimleri);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Cümle-Görsel İlişkisi" && soruTipi === "Okuduğunu Çizme") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = okudugunuCizmeOlustur(aktifGridMetinleri[0]);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (soruTipi === "Okuduğunu Boyama/Tamamlama") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = okudugunuBoyamaOlustur(aktifGridMetinleri[0], aktifBaslangicResmiTek, secilenler);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (soruTipi === "Mantıksal İşaretleme") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = mantiksalIsaretlemeOlustur(aktifGridMetinleri[0], aktifGridResimleri, secilenler);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Hikaye Kurgusu ve Analiz" && soruTipi === "Olay Sıralama") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = olaySiralamaOlustur(aktifGridMetinleri[0]);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Hikaye Kurgusu ve Analiz" && soruTipi === "Kelime Avcısı (Boşluk Doldurma)") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = kelimeAvcisiBoslukOlustur(aktifGridMetinleri[0]);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Metin İçi Mantık" && soruTipi === "Doğru mu, Yanlış mı?") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = dogruMuYanlisMiOlustur(aktifGridMetinleri[0], aktifGridMetinleri[1]);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Metin İçi Mantık" && soruTipi === "5N1K ve Çoktan Seçmeli") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = besNBirKOlustur(aktifGridMetinleri[0], aktifGridMetinleri[1], aktifGridResimleri);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }

        else if (konu === "Okuma ve Yazma Pratiği" && soruTipi === "Okuyalım Yazalım") {
            if(ornekResim) ornekResim.style.display = "none";
            canliKutu.style.display = "flex";
            canliKutu.innerHTML = okuyalimYazalimOlustur(aktifGridMetinleri[0], aktifGridMetinleri[1], aktifGridMetinleri[2]);
            canliKutu.style.background = "transparent";
            canliKutu.style.border = "none";
            canliKutu.style.boxShadow = "none";
        }









        





        else {
            canliKutu.style.display = "none";
            if(ornekResim) ornekResim.style.display = "block";
        }
    }







                

                // --- 4. BİREYSEL MADDE MOTORU ---
                function listeyeEkle() {
                    durumuKaydet();

                    const sinifSecimi = document.getElementById('sinif-secimi') ? document.getElementById('sinif-secimi').value : '';
                    const dersSecimi = document.getElementById('ders-secimi') ? document.getElementById('ders-secimi').value : '';
                    const uniteSecimi = document.getElementById('unite-secimi') ? document.getElementById('unite-secimi').value : '';
                    const konuSecimi = document.getElementById('konu-secimi') ? document.getElementById('konu-secimi').value : '';

                    let zenginAlan = document.getElementById('zengin-metin-alani');
                    let zenginEditor = document.getElementById('gelismis-editor');
                    
                    if (zenginAlan && zenginAlan.style.display === "block" && zenginEditor.innerHTML.trim() !== "") {
                        let secilenTema = document.getElementById('zengin-tema-secimi').value;
                        let secilenStil = document.getElementById('zengin-stil-secimi').value;
                        let secilenRenk = document.getElementById('zengin-renk-secimi').value;

                        if (duzenlenenMetinIndex !== null) {
                            kagitIcerigi[duzenlenenMetinIndex].icerik = zenginEditor.innerHTML;
                            kagitIcerigi[duzenlenenMetinIndex].zenginTema = secilenTema;
                            kagitIcerigi[duzenlenenMetinIndex].zenginStil = secilenStil;
                            kagitIcerigi[duzenlenenMetinIndex].renk = secilenRenk;
                        } else {
                            let mirasDers = kagitIcerigi.length > 0 ? kagitIcerigi[0].ders : "ilkokuma"; 
                            kagitIcerigi.push({
                                kind: "content", id: Date.now() + Math.random(), tip: "zengin-metin", icerik: zenginEditor.innerHTML, bosluk: genelSatirBoslugu, ders: mirasDers, unite: uniteSecimi || "Okuma Yazma", konu: "Serbest Metin Çalışması", kisaKonu: "Serbest Metin", zenginTema: secilenTema, zenginStil: secilenStil, renk: secilenRenk, genelScale: 100, genelX: 0, genelY: 0, metinGenislik: 100, metinYukseklik: 0
                            });
                        }
                        arayuzuGuncelle(); metinMotorunuGecisYap(); return; 
                    }

                    const soruSayisi = document.getElementById('soru-sayisi') ? parseInt(document.getElementById('soru-sayisi').value) : 1;
                    let secilenSoruTipi = "";

                    if (document.getElementById('soru-tipi-secimi')) {
                        const seciliSoruTipiEl = document.getElementById('soru-tipi-secimi');

                        if (
                            konuSecimi.includes("Harfi") || 
                            ["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma", "Kılavuz Çizgiye Serbest Yazı", "Otomatik Çengel Bulmaca", "Kelime Avı (Sözcük Bulmaca)", "Şifreli Mesaj (Gizli Cümle)", "Harf Karıştırmaca", "Labirentten Kelime Toplama", "Kelime Zinciri (Yılan Bulmaca)", "Mini Sudoku (4x4)", "Cümle-Görsel İlişkisi", "Yönerge Takibi (Okuduğunu Uygulama)", "Hikaye Kurgusu ve Analiz", "Metin İçi Mantık","Okuma ve Yazma Pratiği", "Okuma ve Yazma Pratiği"].includes(konuSecimi)
                        ) {
                            secilenSoruTipi = seciliSoruTipiEl.value;
                        }
                    }

                    const secilenKonuVerisi = (mufredat[sinifSecimi] && mufredat[sinifSecimi][dersSecimi] && mufredat[sinifSecimi][dersSecimi][uniteSecimi] && mufredat[sinifSecimi][dersSecimi][uniteSecimi][konuSecimi]) ? mufredat[sinifSecimi][dersSecimi][uniteSecimi][konuSecimi] : null;
                    const kisaIsim = (secilenKonuVerisi && secilenKonuVerisi.kisaAd) ? secilenKonuVerisi.kisaAd : konuSecimi;
                    
                    let mufredatSirasi = 999; let sayac = 0;
                    if (mufredat[sinifSecimi] && mufredat[sinifSecimi][dersSecimi]) {
                        for (let u in mufredat[sinifSecimi][dersSecimi]) {
                            for (let k in mufredat[sinifSecimi][dersSecimi][u]) { sayac++; if (k === konuSecimi) { mufredatSirasi = sayac; } }
                        }
                    }

                    let labPath = "", lW = 0, lH = 0, lSatir = 10;
                    if (konuSecimi === "Labirent Çalışmaları") {
                        let cols = parseInt(document.getElementById('labirent-sutun').value) || 15; let rows = parseInt(document.getElementById('labirent-satir').value) || 10;
                        cols = Math.min(Math.max(cols, 5), 35); rows = Math.min(Math.max(rows, 5), 40); lSatir = rows;
                        let mazeData = rastgeleLabirentUret(cols, rows); labPath = mazeData.path; lW = mazeData.width; lH = mazeData.height;
                    }

                    for (let i = 0; i < soruSayisi; i++) {
                        let gCols = 2, gRows = 4, gTema = "modern", gStil = "solid", gYuv = 1;
                        if (konuSecimi === "Hece Birleştirme" || ["Sesi Barındıranı İşaretleme", "Sesin Konumunu Bulma", "Sesi Barındıranı Boyama", "Gizli Harf Bulma", "Ses Sayısı Kadar Yazma"].includes(secilenSoruTipi)) {
                            gTema = document.getElementById('kutu-temasi-secimi') ? document.getElementById('kutu-temasi-secimi').value : "modern";
                            gStil = document.getElementById('kenar-stili-secimi') ? document.getElementById('kenar-stili-secimi').value : "solid";
                            
                           // Akıllı motorlarda Sütun/Satır kutuları olmadığı için hatayı engelledik
                            if (!["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma", "Kılavuz Çizgiye Serbest Yazı", "Otomatik Çengel Bulmaca"].includes(konuSecimi)) {
                                gCols = document.getElementById('grid-col-input') ? parseInt(document.getElementById('grid-col-input').value) : 2;
                                gRows = document.getElementById('grid-row-input') ? parseInt(document.getElementById('grid-row-input').value) : 4;
                                gYuv = document.getElementById('grid-yuvarlak-input') ? parseInt(document.getElementById('grid-yuvarlak-input').value) : 1;
                            }
                        }

                        let madde = {
                            kind: "question", id: Date.now() + Math.random(), sinif: sinifSecimi, ders: dersSecimi, unite: uniteSecimi, konu: konuSecimi, kisaKonu: kisaIsim, soruTipi: secilenSoruTipi, fontBoyutu: (["Parmakla Takip Etme", "Dış Hat Boyama"].includes(secilenSoruTipi) ? 250 : 80), mufredatSirasi: mufredatSirasi, tip: dersSecimi === 'matematik' ? "matematik" : "ilkokuma",
                            baslangicResmi: typeof aktifBaslangicResmiTek !== 'undefined' ? aktifBaslangicResmiTek : "", bitisResmi: typeof aktifBitisResmiTek !== 'undefined' ? aktifBitisResmiTek : "", arkaplanResmi: typeof aktifArkaplanResmi !== 'undefined' ? aktifArkaplanResmi : "",
                            baslangicResimleri: [...aktifBaslangicResimleri], bitisResimleri: [...aktifBitisResimleri],
                            gridCols: gCols, gridRows: gRows, gridTema: gTema, gridStil: gStil, gridYuv: gYuv, gridResimleri: {...aktifGridResimleri}, gridMetinleri: {...aktifGridMetinleri}, 
                            bX: [0, 0, 0, 0, 0], bY: [0, 0, 0, 0, 0], sX: [0, 0, 0, 0, 0], sY: [0, 0, 0, 0, 0], bBoyut: [40, 40, 40, 40, 40], sBoyut: [40, 40, 40, 40, 40],
                            lX: 0, lY: 0, lScale: 100, bgX: 0, bgY: 0, bgBoyut: 600, renk: "#f1c40f", labSekme: 'tumu', bosluk: genelSatirBoslugu, yonerge: "",
                            genelScale: 100, genelX: 0, genelY: 0, yonergeBoyut: 15, labPath: labPath, lW: lW, lH: lH, labirentSatir: lSatir
                        };

                        if (dersSecimi === 'matematik') {
                            madde.islemTuru = document.getElementById('islem-turu').value;
                            const minSayi = parseInt(document.getElementById('min-sayi').value); const maxSayi = parseInt(document.getElementById('max-sayi').value);
                            let sayi1 = rastgeleSayi(minSayi, maxSayi); let sayi2 = rastgeleSayi(minSayi, maxSayi);
                            if ((madde.islemTuru === '-' || madde.islemTuru === '/') && sayi2 > sayi1) { let temp = sayi1; sayi1 = sayi2; sayi2 = temp; }
                            madde.sayi1 = sayi1; madde.sayi2 = sayi2;
                        } else {
                            madde.detaylar = Array.from(document.querySelectorAll('input[name="ozellik"]:checked, select[id="spagetti-dropdown-secimi"]')).map(el => el.value);
                        }
                        
                        // YENİ: Harf eklendiği an sözlükten kaç ok varsa o kadarını otomatik yükle!
                        if (secilenSoruTipi === "Parmakla Takip Etme") {
                            let harf = konuSecimi.split(" ")[0];
                            let isKucuk = madde.detaylar.includes("Sadece Küçük Harf");
                            let hText = isKucuk ? harf.toLocaleLowerCase('tr-TR') : harf.toLocaleUpperCase('tr-TR');
                            if (harf === "İ") hText = isKucuk ? "i" : "İ";
                            if (harf === "I") hText = isKucuk ? "ı" : "I";
                            
                            let bas = harfBaslangic[hText] || harfBaslangic['default'];


                            if(bas.ok1) { madde.o1X=bas.ok1.x; madde.o1Y=bas.ok1.y; madde.o1R=bas.ok1.rot; madde.o1L=bas.ok1.l; madde.o1K=bas.ok1.k||0;}
                            if(bas.ok2) { madde.o2A=true; madde.o2X=bas.ok2.x; madde.o2Y=bas.ok2.y; madde.o2R=bas.ok2.rot; madde.o2L=bas.ok2.l; madde.o2K=bas.ok2.k||0;}
                            if(bas.ok3) { madde.o3A=true; madde.o3X=bas.ok3.x; madde.o3Y=bas.ok3.y; madde.o3R=bas.ok3.rot; madde.o3L=bas.ok3.l; madde.o3K=bas.ok3.k||0;}
                        }
                        kagitIcerigi.push(madde);
                    }
                    arayuzuGuncelle();
                }

                function yonergeDegistir(index, metin) {
                    kagitIcerigi[index].yonerge = metin;
                    kagidiCiz();
                }

                function yonergeBoyutDegistir(index, val) {
                    kagitIcerigi[index].yonergeBoyut = parseInt(val);
                    document.getElementById(`yonerge-boyut-deger-${index}`).innerText = val + 'px';
                    kagidiCiz();
                }
                function genelOlcekDegistir(index, val) {
                    kagitIcerigi[index].genelScale = parseInt(val);
                    document.getElementById(`genel-olcek-deger-${index}`).innerText = '%' + val;
                    kagidiCiz();
                }
                function genelKonumDegistir(index, eksen, miktar) {
                    if(eksen === 'x') kagitIcerigi[index].genelX = (kagitIcerigi[index].genelX || 0) + miktar;
                    if(eksen === 'y') kagitIcerigi[index].genelY = (kagitIcerigi[index].genelY || 0) + miktar;
                    kagidiCiz();
                }


                function arayuzuGuncelle() {
                    listeyiCiz();
                    satirBosluguMenusunuGuncelle(); 
                    kagidiCiz();
                }

                function bulmacaZarla(index) {
                    kagitIcerigi[index].bulmacaZarla = true; 
                    kagidiCiz(); 
                }


                // --- 5. SÜRÜKLE BIRAK MOTORU ---
                let suruklenenSira = null;

                

                function listeyiCiz() {
                    const listeKutusu = document.getElementById('soru-listesi-kutusu');
                    if(!listeKutusu) return;
                    listeKutusu.innerHTML = '';

                    kagitIcerigi.forEach((madde, index) => {
                        if (madde.tip === "zengin-metin") {
                            let kisaMetin = madde.icerik.replace(/<[^>]*>?/gm, '').substring(0, 45) + "...";
                            let gScale = madde.genelScale || 100;
                            let btnStil = "background: #fff; border: 1px solid #90caf9; border-radius: 4px; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #1565c0; transition: 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.1);";
                            
                            listeKutusu.innerHTML += `
                                <div class="liste-item" draggable="true" ondragstart="suruklemeyeBasla(event, ${index})" ondragover="suruklemeUstunde(event)" ondrop="suruklemeyiBirak(event, ${index})" ondragend="suruklemeBitti(event)">
                                    <div style="flex-grow: 1;">
                                        <div style="pointer-events: none;"><strong style="font-size: 13px; color: #9b59b6;">📝 Serbest Metin Bloğu</strong></div>
                                        <div style="font-size: 10px; color: #555; margin-top: 5px; background: #f9f9f9; padding: 6px; border-radius: 4px; border: 1px solid #eee;">"${kisaMetin}"</div>
                                        <div style="margin-top: 8px; display:flex; justify-content:space-between; align-items:center;">
                                            <label style="font-size: 9px; color: #555; font-weight:bold;">Alt Boşluk:</label>
                                            <input type="range" min="0" max="150" value="${madde.bosluk}" oninput="zenginMetinBoslukDegisti(${index}, this.value)" style="width: 65%; height: 4px; cursor: ew-resize;">
                                        </div>
                                        <div style="margin-top: 8px; display:flex; justify-content:space-between; align-items:center;">
                                            <label style="font-size: 9px; color: #555; font-weight:bold;">Metin Ölçeği: <span id="genel-olcek-deger-${index}">%${gScale}</span></label>
                                            <input type="range" min="30" max="250" value="${gScale}" oninput="genelOlcekDegistir(${index}, this.value)" style="width: 55%; height: 4px; cursor: ew-resize;">
                                        </div>
                                        <div style="margin-top: 8px; border-top: 1px dashed #ccc; padding-top: 6px; background:#f0f8ff; border-radius:4px; padding:6px;">
                                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                                                <label style="font-size: 9px; color: #0984e3; font-weight:bold;">Genişlik (En): <span id="zengin-ebat-w-${index}">%${madde.metinGenislik || 100}</span></label>
                                                <input type="range" min="10" max="100" value="${madde.metinGenislik || 100}" oninput="zenginMetinEbatDegisti(${index}, 'w', this.value)" style="width: 50%; height: 4px; cursor: ew-resize;">
                                            </div>
                                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                                <label style="font-size: 9px; color: #0984e3; font-weight:bold;">Yükseklik (Boy): <span id="zengin-ebat-h-${index}">${!madde.metinYukseklik || madde.metinYukseklik == 0 ? 'Oto' : madde.metinYukseklik + 'px'}</span></label>
                                                <input type="range" min="0" max="800" value="${madde.metinYukseklik || 0}" oninput="zenginMetinEbatDegisti(${index}, 'h', this.value)" style="width: 50%; height: 4px; cursor: ew-resize;">
                                            </div>
                                        </div>
                                        <div style="text-align: center; margin-top: 6px; border-top: 1px dashed #ccc; padding-top: 6px;">
                                            <div style="font-size: 9px; color: #555; margin-bottom: 4px; font-weight:bold;">Metni Serbest Konumlandır (X/Y)</div>
                                            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
                                                <div><button onclick="genelKonumDegistir(${index}, 'y', -5)" style="${btnStil}">▲</button></div>
                                                <div style="display: flex; gap: 2px;">
                                                    <button onclick="genelKonumDegistir(${index}, 'x', -5)" style="${btnStil}">◀</button>
                                                    <button onclick="genelKonumDegistir(${index}, 'y', 5)" style="${btnStil}">▼</button>
                                                    <button onclick="genelKonumDegistir(${index}, 'x', 5)" style="${btnStil}">▶</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #ddd;">
                                            <label style="font-size: 9px; color: #2980b9; font-weight:bold; display:block; margin-bottom:3px;">🎨 Şablon (Arka Plan):</label>
                                            <select onchange="zenginMetinSablonDegisti(${index}, this.value)" style="width: 100%; font-size: 10px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                                                <option value="ilkokuma" ${madde.ders === 'ilkokuma' ? 'selected' : ''}>📚 İlk Okuma Yazma</option>
                                                <option value="turkce" ${madde.ders === 'turkce' ? 'selected' : ''}>📕 Türkçe</option>
                                                <option value="matematik" ${madde.ders === 'matematik' ? 'selected' : ''}>📐 Matematik</option>
                                                <option value="hayatbilgisi" ${madde.ders === 'hayatbilgisi' ? 'selected' : ''}>🌍 Hayat Bilgisi</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 5px; margin-left: 10px;">
                                        <button onclick="metniDuzenle(${index})" style="background: #f39c12; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;" title="Düzenle">✏️</button>
                                        <button class="btn-sil" onclick="soruyuSil(${index})" style="background: #ff7675; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;" title="Sil">X</button>
                                    </div>
                                </div>`;
                            return;
                        }

                        let detaylarHtml = "";
                        if (madde.detaylar && madde.detaylar.length > 0) { detaylarHtml = `<div style="font-size: 10px; color: #2980b9; margin-top: 4px; font-weight: 500; display: flex; align-items: center; gap: 3px;"><span>⚙️</span> <span>${madde.detaylar.join(' - ')}</span></div>`; } 
                        else if (madde.soruTipi) { detaylarHtml = `<div style="font-size: 10px; color: #27ae60; margin-top: 4px; font-weight: 500; display: flex; align-items: center; gap: 3px;"><span>📝</span> <span>${madde.soruTipi}</span></div>`; }

                        let ozelliklerHtml = "";

                        if (madde.konu === "Karmaşık Yol/Eşleştirme Çalışmaları (Spagetti Labirent)") {
                            ozelliklerHtml += `<div style="margin-top: 8px; display:flex; justify-content:space-between; align-items:center; background: #fdfbfb; padding: 6px 8px; border-radius: 4px; border: 1px solid #dcdde1;"><label style="font-size: 10px; color: #2c3e50; font-weight: bold;">🎨 Yol Dolgu Rengi:</label><input type="color" value="${madde.renk || '#f1c40f'}" oninput="renkDegisti(${index}, this.value)" style="cursor:pointer; border:none; width:35px; height:25px; border-radius:4px; padding:0;"></div>`;
                        } else if (["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma"].includes(madde.konu) || ["Sesi Barındıranı İşaretleme", "Sesi Barındıranı Boyama", "Gizli Harf Bulma", "Ses Sayısı Kadar Yazma"].includes(madde.soruTipi)) {
                            let defaultRenk = (["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma"].includes(madde.konu) || madde.soruTipi === "Gizli Harf Bulma") ? "#3498db" : "#a2d148";

                            let curColor = (madde.renk && madde.renk !== "#f1c40f") ? madde.renk : defaultRenk;
                            ozelliklerHtml += `
                            <div style="margin-top: 8px; padding: 6px 8px; background: #fdfbfb; border: 1px solid #dcdde1; border-radius: 4px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                    <label style="font-size: 10px; color: #2c3e50; font-weight: bold;">🎨 Çizgi Rengi:</label>
                                    <input type="color" value="${curColor}" oninput="renkDegisti(${index}, this.value)" style="cursor:pointer; border:none; width:35px; height:25px; border-radius:4px; padding:0;">
                                </div>
                                <div style="margin-bottom: 6px;">
                                    <label style="font-size: 9px; color: #2c3e50; font-weight: bold;">🎨 Kutu Şeması (Köşe):</label>
                                    <select onchange="gridAyarDegisti(${index}, 'tema', this.value)" style="width: 100%; font-size: 9px; padding: 3px; border: 1px solid #ccc; border-radius: 3px;">
                                        ${secimMenuHTML(madde.gridTema || 'modern', 'tema')}
                                    </select>
                                </div>
                                <div style="margin-bottom: 6px;">
                                    <label style="font-size: 9px; color: #2c3e50; font-weight: bold;">✍️ Kenar Çizgisi Stili:</label>
                                    <select onchange="gridAyarDegisti(${index}, 'stil', this.value)" style="width: 100%; font-size: 9px; padding: 3px; border: 1px solid #ccc; border-radius: 3px;">
                                        ${secimMenuHTML(madde.gridStil || 'dashed', 'stil')}
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size: 9px; color: #2c3e50; font-weight: bold; display:block; margin-bottom:3px;">🏞️ Arka Plan Manzarası Ekle:</label>
                                    <input type="file" onchange="aktifResimDegistir(${index}, 'arkaplan', this)" style="width: 100%; font-size: 8px; padding: 2px;">
                                </div>
                            </div>`;
                        } else if (madde.soruTipi === "Harf Yazımı" || madde.konu === "Kılavuz Çizgiye Serbest Yazı") {
                            let mevcutAdet = madde.harfSayisi !== undefined ? madde.harfSayisi : 0; 
                            let adetGosterge = mevcutAdet === 0 ? "Otomatik" : mevcutAdet + " Adet";
                            let etiket = madde.konu === "Kılavuz Çizgiye Serbest Yazı" ? "Örnek Metin Adedi:" : "Örnek Harf Adedi:";
                            ozelliklerHtml += `<div style="margin-top: 8px; background: #f8f9fa; padding: 6px 8px; border-radius: 4px; border: 1px solid #ddd;"><label style="font-size: 10px; color: #e67e22; display: flex; justify-content: space-between; font-weight:bold;"><span>${etiket}</span> <span id="harfsayisi-deger-${index}">${adetGosterge}</span></label><input type="range" min="0" max="12" value="${mevcutAdet}" oninput="harfSayisiDegistir(${index}, this.value)" style="width: 100%; height: 4px; margin-top: 4px; cursor: pointer;"></div>`;
                        } else if (madde.konu === "Dalgalı Çizgiler") {
                            let fDeger = madde.dalgaFrekansi || 60; let yDeger = madde.dalgaYuksekligi || 50;
                            ozelliklerHtml += `<div style="margin-top: 8px; background: #e3f2fd; padding: 6px 8px; border-radius: 4px; border: 1px solid #bbdefb;"><label style="font-size: 10px; color: #1565c0; display: flex; justify-content: space-between; font-weight: bold;"><span>🌊 Dalga Sıklığı:</span> <span id="frekans-deger-${index}">${fDeger}</span></label><input type="range" min="20" max="150" value="${fDeger}" oninput="dalgaFrekansiDegistir(${index}, this.value)" style="width: 100%; height: 4px; margin-top: 6px; margin-bottom: 12px; cursor: ew-resize;"><label style="font-size: 10px; color: #1565c0; display: flex; justify-content: space-between; font-weight: bold; border-top: 1px dashed #90caf9; padding-top: 8px;"><span>↕️ Dalga Yüksekliği:</span> <span id="yukseklik-deger-${index}">${yDeger}</span></label><input type="range" min="10" max="120" value="${yDeger}" oninput="dalgaYuksekligiDegistir(${index}, this.value)" style="width: 100%; height: 4px; margin-top: 6px; margin-bottom: 6px; cursor: ew-resize;"></div>`;
                        } else if (madde.konu === "Kesikli çizgili-konturlu nesnenin dış hat çigilerinin üzerinden giderek varlığı oluşturma sonra da onu boyama çalışmaları") {
                            let nSayi = madde.nesneSayisi || 1; 
                            ozelliklerHtml += `<div style="margin-top: 8px; background: #e8f5e9; padding: 6px 8px; border-radius: 4px; border: 1px solid #c8e6c9;"><label style="font-size: 10px; color: #2e7d32; display: flex; justify-content: space-between; font-weight: bold;"><span>🔢 Şekil Sayısı:</span> <span id="sayi-deger-${index}">${nSayi} Adet</span></label><input type="range" min="1" max="15" value="${nSayi}" oninput="nesneSayisiDegistir(${index}, this.value)" style="width: 100%; height: 4px; margin-top: 6px; cursor: pointer;"></div>`;
                        }

                        // --- JOYSTICK MERKEZİ ---
                        let hedef = madde.masterHedef || 'evrensel';
                        let hrt = {
                            'evrensel': { x: 'genelX', y: 'genelY', size: 'genelScale', rot: null, kavis: null, u: null },
                            'genislik': { x: null,     y: null,     size: 'genislik',   rot: null, kavis: null, u: null }, 
                            'yonerge':  { x: null,     y: null,     size: 'yonergeBoyut',rot: null, kavis: null, u: null },
                            'resim':    { x: 'resimX', y: 'resimY', size: 'resimBoyutu', rot: null, kavis: null, u: null }
                        };

                        if (madde.soruTipi === "Parmakla Takip Etme") {
                            hrt['harf']    = { x: 'harfX',  y: 'harfY',  size: 'fontBoyutu',  rot: null, kavis: null, u: null };
                            hrt['kilavuz'] = { x: null,     y: 'pBgY',   size: 'pBgH',        rot: null, kavis: null, u: null };
                            hrt['ok1']     = { x: 'o1X',    y: 'o1Y',    size: 'o1L',         rot: 'o1R', kavis: 'o1K', u: 'o1U' };
                            if (madde.o2A) hrt['ok2'] = { x: 'o2X', y: 'o2Y', size: 'o2L', rot: 'o2R', kavis: 'o2K', u: 'o2U' };
                            if (madde.o3A) hrt['ok3'] = { x: 'o3X', y: 'o3Y', size: 'o3L', rot: 'o3R', kavis: 'o3K', u: 'o3U' };
                        } else if (madde.soruTipi === "Harf Yazımı" || madde.soruTipi === "Dış Hat Boyama" || madde.konu === "Kılavuz Çizgiye Serbest Yazı") {
                            hrt['harf'] = { x: 0, y: 0, size: 'fontBoyutu', rot: null, kavis: null, u: null };
                        } else if (madde.nesneBoyutu !== undefined) {
                            hrt['nesne'] = { x: null, y: null, size: 'nesneBoyutu', rot: null, kavis: null, u: null };
                        }

                        if (!hrt[hedef]) { hedef = 'evrensel'; kagitIcerigi[index].masterHedef = 'evrensel'; }
                        let cur = { ...hrt[hedef] };
                        
                        let gosterilecekSize = kagitIcerigi[index][cur.size] || 0;
                        if (gosterilecekSize === 0) {
                            if (cur.size === "genelScale" || cur.size === "lScale") gosterilecekSize = 100;
                            if (cur.size === "genislik") gosterilecekSize = 100; // BAŞLANGIÇ GENİŞLİĞİ %100
                            if (cur.size === "resimBoyutu") gosterilecekSize = 100;
                            if (cur.size === "fontBoyutu" && madde.soruTipi === "Parmakla Takip Etme") gosterilecekSize = 250;
                            if (cur.size === "fontBoyutu" && madde.soruTipi === "Harf Yazımı") gosterilecekSize = 80;
                            if (cur.size === "pBgH") gosterilecekSize = 160;
                            if (cur.size === "o1L") gosterilecekSize = 140;
                            if (cur.size === "o2L" || cur.size === "o3L") gosterilecekSize = 60;
                            if (cur.size === "yonergeBoyut") gosterilecekSize = 15;
                        }
                        
                        let gosterilecekRot = cur.rot ? (kagitIcerigi[index][cur.rot] || 0) : 0;
                        if (cur.rot === "o1R" && gosterilecekRot === 0) gosterilecekRot = 180;
                        if (cur.rot === "o2R" && gosterilecekRot === 0) gosterilecekRot = -90;
                        if (cur.rot === "o3R" && gosterilecekRot === 0) gosterilecekRot = 90;
                        
                        let sEtiket = "Boyut/Ölçek";
                        if (hedef === 'evrensel' || hedef === 'lab_olcek') sEtiket = "Sistem Ölçeği (%)";
                        if (hedef === 'genislik') sEtiket = "Enine Uzunluk (%)"; // ETİKET OTOMATİK DEĞİŞİR
                        if (hedef === 'yonerge') sEtiket = "Yazı Puntosu (px)";
                        if (hedef === 'harf') sEtiket = "Punto Ayarı (px)";
                        if (hedef === 'kilavuz') sEtiket = "Kılavuz Boyu (px)";
                        if (hedef.includes('ok')) sEtiket = "Ok Uzunluğu (px)";
                        if (hedef === 'nesne') sEtiket = "Görsel Boyutu (px)";

                        let btnStil = "background: #fff; border: 1px solid #bdc3c7; border-radius: 5px; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #2c3e50; transition: 0.1s; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-weight:bold;";

                        // SENİN İSTEDİĞİN ÖZEL MANTIK BURADA! (Adı "Kılavuz Çizgiyi Düzenle" yapıldı)
                        let genislikSecenekHtml = `<option value="genislik" ${hedef==='genislik'?'selected':''}>📏 Kılavuz Çizgiyi Düzenle (Enine)</option>`;
                        if (madde.soruTipi !== "Parmakla Takip Etme" && madde.konu !== "Boş Satır" && !(madde.detaylar && madde.detaylar.includes("Kılavuz Çizgi Ekle"))) {
                            genislikSecenekHtml = `<option value="genislik" ${hedef==='genislik'?'selected':''}>📏 Satır Genişliğini Düzenle</option>`;
                        }

                        // YENİ: Bulmaca ve Kelime Avı modlarında çıkacak Zar atma butonu
                        let ekstraBulmacaButonu = "";
                        if (madde.konu === "Otomatik Çengel Bulmaca" || madde.konu === "Kelime Avı (Sözcük Bulmaca)" || madde.konu === "Şifreli Mesaj (Gizli Cümle)" || madde.konu === "Harf Karıştırmaca" || madde.konu === "Labirentten Kelime Toplama" || madde.konu === "Kelime Zinciri (Yılan Bulmaca)" || madde.konu === "Mini Sudoku (4x4)" || madde.konu === "Cümle-Görsel İlişkisi" || madde.konu === "Hikaye Kurgusu ve Analiz") {
                            ekstraBulmacaButonu = `<button onclick="bulmacaZarla(${index})" style="width: 100%; background: #9b59b6; color: #fff; font-size: 11px; font-weight: bold; border: none; border-radius: 4px; padding: 6px; margin-bottom: 10px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">🎲 Farklı Bir Dizilim Üret</button>`;
                        }




                        let masterPanelHtml = `
                        <div style="margin-top: 10px; margin-bottom: 10px;">
                            <input type="text" value="${madde.yonerge || ''}" placeholder="Soru metni / Yönerge yazın..." oninput="yonergeDegistir(${index}, this.value)" style="width: 100%; font-size: 11px; padding: 6px; border: 1px solid #ccc; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                        </div>

                        <div style="background: #f8f9fa; border: 2px solid #bdc3c7; border-radius: 8px; padding: 10px; margin-bottom: 10px;">
                            <div style="font-size: 11px; font-weight: bold; color: #2c3e50; margin-bottom: 8px;">🕹️ KONTROL MERKEZİ</div>
                            
                            ${ekstraBulmacaButonu}
                            
                            <select onchange="masterHedefSec(${index}, this.value)" style="width: 100%; font-size: 11px; padding: 6px; border: 2px solid #3498db; border-radius: 4px; margin-bottom: 15px; font-weight: bold; color: #2c3e50; background: #fff; cursor: pointer;">
                                <option value="evrensel" ${hedef==='evrensel'?'selected':''}>🌍 Komple Grubu Düzenle</option>
                                ${genislikSecenekHtml}
                                <option value="yonerge" ${hedef==='yonerge'?'selected':''}>📝 Soru Metni Puntosu</option>
                                ${madde.soruTipi === "Parmakla Takip Etme" ? `
                                <option value="harf" ${hedef==='harf'?'selected':''}>🔠 Sadece Harfi Düzenle</option>
                                <option value="kilavuz" ${hedef==='kilavuz'?'selected':''}>↕️ Kılavuz Çizgiyi Düzenle (Boyuna)</option>
                                ` : ''}
                                ${(["Harf Yazımı", "Dış Hat Boyama"].includes(madde.soruTipi) || madde.konu === "Kılavuz Çizgiye Serbest Yazı") ? `<option value="harf" ${hedef==='harf'?'selected':''}>🔠 Yazı Puntosunu Düzenle</option>` : ''} 
                                ${madde.nesneBoyutu !== undefined ? `<option value="nesne" ${hedef==='nesne'?'selected':''}>🎨 Görsel Boyutunu Düzenle</option>` : ''}
                                ${madde.soruTipi === "Yanına Resimli Yazı" ? `<option value="resim" ${hedef==='resim'?'selected':''}>🖼️ Görseli Düzenle</option>` : ''}
                            </select>

                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; background: #ecf0f1; padding: 8px; border-radius: 50%; ${(cur.x === null && cur.y === null) ? 'opacity:0.3; pointer-events:none;' : ''}">
                                    <div><button onclick="evrenselKontrolDegisti(${index}, 'y', -5)" style="${btnStil}" ${cur.y === null ? 'disabled style="opacity:0.2;"' : ''}>▲</button></div>
                                    <div style="display: flex; gap: 4px;">
                                        <button onclick="evrenselKontrolDegisti(${index}, 'x', -5)" style="${btnStil}" ${cur.x === null ? 'disabled style="opacity:0.2;"' : ''}>◀</button>
                                        <button onclick="evrenselKontrolDegisti(${index}, 'y', 5)" style="${btnStil}" ${cur.y === null ? 'disabled style="opacity:0.2;"' : ''}>▼</button>
                                        <button onclick="evrenselKontrolDegisti(${index}, 'x', 5)" style="${btnStil}" ${cur.x === null ? 'disabled style="opacity:0.2;"' : ''}>▶</button>
                                    </div>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 10px; width: 50%;">
                                    <div style="display: flex; flex-direction: column;">
                                        <label style="font-size: 9px; font-weight: bold; color: #7f8c8d; margin-bottom: 2px;">📏 ${sEtiket}:</label>
                                        <input type="number" id="master-input-size-${index}" value="${gosterilecekSize}" onchange="evrenselKontrolDegisti(${index}, 'size', 0, this.value)" style="width: 100%; padding: 5px; font-size: 11px; border: 1px solid #bdc3c7; border-radius: 4px; font-weight: bold; text-align:center;">
                                    </div>
                                    ${cur.rot !== null ? `
                                    <div style="display: flex; flex-direction: column;">
                                        <label style="font-size: 9px; font-weight: bold; color: #7f8c8d; margin-bottom: 2px;">🔄 Dönme Açısı (°):</label>
                                        <input type="number" id="master-input-rot-${index}" value="${gosterilecekRot}" onchange="evrenselKontrolDegisti(${index}, 'rot', 0, this.value)" style="width: 100%; padding: 5px; font-size: 11px; border: 1px solid #bdc3c7; border-radius: 4px; font-weight: bold; text-align:center;">
                                    </div>` : ''}
                                    ${cur.kavis !== null ? `
                                    <div style="display: flex; flex-direction: column;">
                                        <label style="font-size: 9px; font-weight: bold; color: #7f8c8d; margin-bottom: 2px;">🌙 Kavis Derecesi:</label>
                                        <input type="number" id="master-input-kavis-${index}" value="${kagitIcerigi[index][cur.kavis] || 0}" onchange="evrenselKontrolDegisti(${index}, 'kavis', 0, this.value)" style="width: 100%; padding: 5px; font-size: 11px; border: 1px solid #bdc3c7; border-radius: 4px; font-weight: bold; text-align:center;">
                                    </div>` : ''}
                                    ${cur.u !== null ? `
                                    <div style="display: flex; flex-direction: column;">
                                        <label style="font-size: 9px; font-weight: bold; color: #7f8c8d; margin-bottom: 2px;">📏 Düz Uzantı (px):</label>
                                        <input type="number" id="master-input-u-${index}" value="${kagitIcerigi[index][cur.u] || 0}" onchange="evrenselKontrolDegisti(${index}, 'u', 0, this.value)" style="width: 100%; padding: 5px; font-size: 11px; border: 1px solid #bdc3c7; border-radius: 4px; font-weight: bold; text-align:center;">
                                    </div>` : ''}
                                </div>
                            </div>
                        </div>`;

                        listeKutusu.innerHTML += `
                            <div class="liste-item" draggable="true" ondragstart="suruklemeyeBasla(event, ${index})" ondragover="suruklemeUstunde(event)" ondrop="suruklemeyiBirak(event, ${index})" ondragend="suruklemeBitti(event)">
                                <div style="flex-grow: 1;">
                                    <div style="pointer-events: none;"><strong style="font-size: 13px; color: #333;">Soru ${index + 1}</strong><br><span style="font-size: 11px; color: #777; font-weight: bold;">${madde.kisaKonu || madde.konu}</span>${detaylarHtml}</div>
                                    ${masterPanelHtml}
                                    ${ozelliklerHtml}
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 5px; margin-left: 10px;">
                                    <button onclick="soruyuCogalt(${index})" style="background: #3498db; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">+</button>
                                    <button class="btn-sil" onclick="soruyuSil(${index})" style="background: #ff7675; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">X</button>
                                </div>
                            </div>`;
                    });
                }
                // (Eğer üstteki parantez varsa, sorun yok. Eğer yoksa ekle.)

                function fontunuDegistir(index, yeniBoyut) {
                    kagitIcerigi[index].fontBoyutu = parseInt(yeniBoyut);
                    document.getElementById(`punto-deger-${index}`).innerText = `${yeniBoyut}px`; 
                    kagidiCiz(); 
                }

                function noktaAyarDegisti(index, charIndex, tip, val) {
                // Hafızada bu diziler yoksa hemen oluştur
                if (!Array.isArray(kagitIcerigi[index].nX)) kagitIcerigi[index].nX = [0, 0];
                if (!Array.isArray(kagitIcerigi[index].nY)) kagitIcerigi[index].nY = [0, 0];
                if (!Array.isArray(kagitIcerigi[index].nRot)) kagitIcerigi[index].nRot = [0, 0];
                
                // Değeri güncelle
                if (tip === 'x') kagitIcerigi[index].nX[charIndex] = parseInt(val);
                if (tip === 'y') kagitIcerigi[index].nY[charIndex] = parseInt(val);
                if (tip === 'rot') kagitIcerigi[index].nRot[charIndex] = parseInt(val);
                
                // Arayüzdeki rakamı canlı olarak değiştir
                let targetId = `val-n${tip}-${index}-${charIndex}`;
                let gosterge = document.getElementById(targetId);
                if(gosterge) {
                    gosterge.innerText = tip === 'rot' ? val + '°' : val + 'px';
                }
                kagidiCiz(); // Kâğıdı anında güncelle
            }

                function dalgaFrekansiDegistir(index, yeniFrekans) {
                    kagitIcerigi[index].dalgaFrekansi = parseInt(yeniFrekans);
                    document.getElementById(`frekans-deger-${index}`).innerText = yeniFrekans;
                    kagidiCiz(); 
                }

                function dalgaYuksekligiDegistir(index, yeniYukseklik) {
                    kagitIcerigi[index].dalgaYuksekligi = parseInt(yeniYukseklik);
                    document.getElementById(`yukseklik-deger-${index}`).innerText = yeniYukseklik;
                    kagidiCiz(); 
                }

                function nesneBoyutunuDegistir(index, yeniBoyut) {
                    kagitIcerigi[index].nesneBoyutu = parseInt(yeniBoyut);
                    document.getElementById(`nesne-deger-${index}`).innerText = `${yeniBoyut}px`; 
                    kagidiCiz(); 
                }

                function nesneKonumDegistir(index, nesne, eksen, miktar) {
                    if(nesne === 'bas') {
                        if(eksen === 'x') kagitIcerigi[index].bX = (kagitIcerigi[index].bX || 0) + miktar;
                        if(eksen === 'y') kagitIcerigi[index].bY = (kagitIcerigi[index].bY || 0) + miktar;
                    } else {
                        if(eksen === 'x') kagitIcerigi[index].sX = (kagitIcerigi[index].sX || 0) + miktar;
                        if(eksen === 'y') kagitIcerigi[index].sY = (kagitIcerigi[index].sY || 0) + miktar;
                    }
                    kagidiCiz(); 
                }

                function suruklemeyeBasla(e, index) {
                    suruklenenSira = index;
                    e.dataTransfer.effectAllowed = "move";
                    setTimeout(() => { e.target.style.opacity = "0.4"; }, 0);
                }

                function suruklemeUstunde(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }
                function suruklemeyiBirak(e, hedefIndex) {
                    e.preventDefault(); if (suruklenenSira === null || suruklenenSira === hedefIndex) return;
                    durumuKaydet(); 
                    const suruklenenMadde = kagitIcerigi.splice(suruklenenSira, 1)[0];
                    kagitIcerigi.splice(hedefIndex, 0, suruklenenMadde);
                    suruklenenSira = null; arayuzuGuncelle();
                }
                function suruklemeBitti(e) { e.target.style.opacity = "1"; }
                function soruyuSil(index) { durumuKaydet(); kagitIcerigi.splice(index, 1); arayuzuGuncelle(); }
                function rastgeleSayi(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

                // --- 2. MATBAA MOTORU (SAĞ PANEL A4 BASKISI) ---
    function kagidiCiz() {
        const soruAlani = document.getElementById('soru-alani');
        const a4Kagidi = document.getElementById('calisma-kagidi');
        const dersSecici = document.getElementById('ders-secimi'); 
        const ozelBaslikGirdisi = document.getElementById('ozel-baslik') ? document.getElementById('ozel-baslik').value.trim() : "";
        
        if(!soruAlani) return;
        soruAlani.innerHTML = '';

        // ==============================================================
        // YENİ: İKİ SÜTUN (TEST) FORMATI VE ORTA ÇİZGİ MOTORU (KUSURSUZ)
        // ==============================================================
        let eskiYazi = document.getElementById('orta-sutun-yazisi');
        if (eskiYazi) eskiYazi.remove(); // Varsa eski yayınevi yazısını sil
        
        let sutunAyar = document.getElementById('sayfa-sutun-ayari') ? document.getElementById('sayfa-sutun-ayari').value : "1";
        let yayineviMetni = document.getElementById('yayinevi-metni') ? document.getElementById('yayinevi-metni').value : "OKUL ZİLİ YAYINCILIK";
        
        if (sutunAyar === "2") {
            // İki Sütun CSS Gücü (Yukarıdan Aşağıya Dolması İçin Height ve Auto-fill Şart!)
            soruAlani.style.display = "block"; 
            soruAlani.style.columnCount = "2";
            soruAlani.style.columnGap = "40px"; 
            soruAlani.style.columnFill = "auto"; // YUKARIDAN AŞAĞIYA doldurma kuralı!
            soruAlani.style.height = "860px"; // A4 kağıdın net içerik boyu. Aşağı kadar dolar, sonra sağa atlar.
            
            // CSS'in kendi kusursuz sütun çizgisini kullanıyoruz! Asla kaymaz.
            soruAlani.style.columnRule = "1.5px dashed #bdc3c7"; 
            
            // Yayınevi metnini kağıdın tam ortasına çapalarız
            a4Kagidi.style.position = "relative"; 
            let yaziDiv = document.createElement('div');
            yaziDiv.id = 'orta-sutun-yazisi';
            yaziDiv.innerText = yayineviMetni;
            yaziDiv.style.position = 'absolute';
            yaziDiv.style.top = '55%'; // A4'ün dikey merkezi (Pembe başlık payı dahil)
            yaziDiv.style.left = '50%';    
            yaziDiv.style.transform = 'translate(-50%, -50%) rotate(-90deg)'; 
            yaziDiv.style.background = '#fff'; // Çizgiyi kesip ferah bir görünüm verir
            yaziDiv.style.padding = '0 15px';
            yaziDiv.style.color = '#95a5a6';
            yaziDiv.style.letterSpacing = '5px'; 
            yaziDiv.style.fontSize = '12px';
            yaziDiv.style.fontWeight = 'bold';
            yaziDiv.style.whiteSpace = 'nowrap';
            yaziDiv.style.zIndex = '10';
            
            a4Kagidi.appendChild(yaziDiv);
        } else {
            // 1 Sütuna (Normal Formata) Geri Dönüş
            soruAlani.style.display = ""; 
            soruAlani.style.columnCount = "";
            soruAlani.style.columnGap = "";
            soruAlani.style.columnFill = "";
            soruAlani.style.height = "";
            soruAlani.style.columnRule = "";
        }

        // Soruların ortadan ikiye yarılıp parçalanmaması için %100 kesin çözüm (inline-block)
        let korumaStili = document.getElementById('sutun-koruma-stili');
        if(!korumaStili) {
            korumaStili = document.createElement('style');
            korumaStili.id = 'sutun-koruma-stili';
            document.head.appendChild(korumaStili);
        }
        korumaStili.innerHTML = `#soru-alani > div { page-break-inside: avoid; break-inside: avoid; display: inline-block; width: 100%; vertical-align: top; }`;
        // ==============================================================

        if (kagitIcerigi.length === 0) {
            if(a4Kagidi && dersSecici) a4Kagidi.style.backgroundImage = `url('${dersSecici.value}-sablon.png')`;
            return; 
        }

        const ilkModul = kagitIcerigi[0];
        if(a4Kagidi) a4Kagidi.style.backgroundImage = `url('${ilkModul.ders}-sablon.png')`;
        
        const yazdirKonuEl = document.getElementById('yazdir-konu');
        if (yazdirKonuEl) {
            let essizUniteler = [...new Set(kagitIcerigi.map(m => m.unite))];
            let essizKonular = [...new Set(kagitIcerigi.map(m => m.kisaKonu || m.konu))];
            
            let anaBaslik = "";
            if (ozelBaslikGirdisi !== "") {
                anaBaslik = ozelBaslikGirdisi.toUpperCase(); 
            } else if (essizUniteler.length === 1) {
                anaBaslik = essizUniteler[0].toUpperCase(); 
            } else {
                anaBaslik = "KARMA ÇALIŞMA KAĞIDI"; 
            }
            
            let altBaslik = essizKonular.join(" • ").toLocaleUpperCase('tr-TR');
            
            yazdirKonuEl.innerHTML = `
                <div style="line-height: 1.1; transform: translateY(-8px);">
                    <div style="font-weight: 700; font-family: 'Quicksand', sans-serif;">${anaBaslik}</div>
                    <div style="font-size: 14px; font-weight: 300; font-family: 'Quicksand', sans-serif; margin-top: 2px; opacity: 0.95; letter-spacing: 1px;">${altBaslik}</div>
                </div>
            `;
        }

        
        // =========================================================
        // YENİ: GPT FLEXBOX MİMARİSİ İÇİN TEMİZLİK VE İLERİYE BAKIŞ!
        // =========================================================
        kagitIcerigi.forEach(m => m.isGrupCocugu = false); // Önce herkesi sıfırla

        kagitIcerigi.forEach((madde, index) => {
            
            // Eğer bu çizgi, devasa harfin içine gömüldüyse ana döngüde bir daha kağıda basma! Pas geç!
            if (madde.isGrupCocugu) return; 

            let mevcutBosluk = madde.bosluk !== undefined ? madde.bosluk : genelSatirBoslugu;
            let mGenislik = madde.genislik === undefined ? 100 : madde.genislik;

            // ZEHİRLİ FLOAT, CLEAR VE NEGATİF MARGİNLER TAMAMEN ÇÖPE ATILDI! 
            // Herkes paşa paşa düz iniyor.
            let anaKapsayiciStil = `clear: both; grid-column: span 4; width: ${mGenislik}%; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; position: relative; margin-bottom: ${mevcutBosluk}px;`;




        // ==============================================================
            // YENİ: ZENGİN METİN İÇİN A4 BASKI MOTORU (ÇERÇEVELİ + KONUMLANDIRMA)
            // ==============================================================
            if (madde.tip === "zengin-metin") {
                let tema = madde.zenginTema || "yok";
                let stil = madde.zenginStil || "yok";
                let cRengi = madde.renk || "#2c3e50";
                let borderCSS = "";
                let innerPadding = "5px 30px";
                
                // Konum ve Ölçek değişkenlerini hafızadan çek!
                let gScale = (madde.genelScale || 100) / 100;
                let gX = madde.genelX || 0; 
                let gY = madde.genelY || 0;
                
                if (tema !== "yok" && stil !== "yok") {
                    let bRadius = "20px";
                    if(tema === "capraz") bRadius = "30px 4px 30px 4px"; 
                    if(tema === "bulut") bRadius = "40px 30px 50px 40px"; 
                    
                    let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 4px;` : "";
                    let boxThickness = (stil === "suslu") ? "5px" : "3px";
                    
                    borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 20px; border-image-outset: 12px; border-image-repeat: round; background-color: #fff; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: 0 4px 10px rgba(0,0,0,0.04); ${susluOutline}`;
                    innerPadding = "25px 30px"; 
                }

                // Ebat kurallarını belirle
                let mGenislik = madde.metinGenislik || 100;
                let mYukseklik = madde.metinYukseklik || 0;
                // Yükseklik 0 ise otomatik uzar, 0'dan büyükse sabit kalır ve taşan kısımları (taşmaması için) gizler
                let yukseklikKural = mYukseklik > 0 ? `height: ${mYukseklik}px; overflow: hidden;` : `min-height: 50px;`;

                // YENİ: transform: translate(X, Y) scale() ile kağıtta gezer. width: ${mGenislik}% ile daralır.
                soruAlani.innerHTML += `
                    <div style="grid-column: span 4; width: 100%; position: relative; margin-bottom: ${mevcutBosluk}px; padding: 0 20px; display: flex; justify-content: center;">
                        <div style="transform: translate(${gX}px, ${gY}px) scale(${gScale}); transform-origin: top center; width: ${mGenislik}%;">
                            <div style="${borderCSS} text-align: left; padding: ${innerPadding}; font-family: 'Quicksand', sans-serif; font-size: 16px; color: #2c3e50; line-height: 1.6; box-sizing: border-box; width: 100%; ${yukseklikKural}">
                                ${madde.icerik}
                            </div>
                        </div>
                    </div>`;
                return;
            }

            let yBoyut = madde.yonergeBoyut || 15;
            let soruMetniHtml = madde.yonerge ? `<div style="width: 100%; text-align: left; padding-left: 20px; font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; font-size: ${yBoyut}px; color: #2c3e50; margin-bottom: 10px; font-weight: 500;">${madde.yonerge}</div>` : "";

            if (madde.tip === 'matematik') {
                let gScale = (madde.genelScale || 100) / 100;
                let gX = madde.genelX || 0; let gY = madde.genelY || 0;
                let gercekKutuBoyu = 90 * gScale; 
                soruAlani.innerHTML += `<div style="grid-column: span 4; width: 100%; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; position: relative; margin-bottom: ${mevcutBosluk}px;">${soruMetniHtml}<div style="height: ${gercekKutuBoyu}px; width: 100%;"><div style="transform: translate(${gX}px, ${gY}px) scale(${gScale}); transform-origin: left top;"><div class="soru-kutusu" style="margin-left: 20px;"><div>${madde.sayi1}</div><div class="islem-isareti">${madde.islemTuru}</div><div>${madde.sayi2}</div><div class="cizgi"></div></div></div></div></div>`;
            } else {
                let cizgiAdi = madde.konu; 
                let cizgiIcerigi = "";
                let kutuBoyu = 75; 

                if (cizgiAdi === "Dalgalı Çizgiler") {
                    let frekans = madde.dalgaFrekansi || 60;
                    let yukseklik = madde.dalgaYuksekligi || 50;
                    kutuBoyu = Math.max(75, (yukseklik * 2) + 20); 
                    let merkezY = kutuBoyu / 2; 
                    let kontrolY = merkezY - yukseklik; 
                    let dPath = `M 0,${merkezY} Q ${frekans/2},${kontrolY} ${frekans},${merkezY} `;
                    for (let x = frekans * 2; x <= 600 + frekans; x += frekans) dPath += `T ${x},${merkezY} `;
                    cizgiIcerigi = `<svg width="100%" height="100%" viewBox="0 0 600 ${kutuBoyu}" preserveAspectRatio="none" style="overflow: hidden;"><path d="${dPath}" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0, 7" /></svg>`;
                }
                else if (cizgiAdi === "Bir nesneden başlayıp başka bir nesneye doğru rastgele (ama üst üste binmeyen) çizgiler") {
                    let nBoyut = madde.nesneBoyutu || 40; 
                    let bX = madde.bX[0] !== undefined ? madde.bX[0] : (madde.bX || 0); 
                    let bY = madde.bY[0] !== undefined ? madde.bY[0] : (madde.bY || 0); 
                    let sX = madde.sX[0] !== undefined ? madde.sX[0] : (madde.sX || 0); 
                    let sY = madde.sY[0] !== undefined ? madde.sY[0] : (madde.sY || 0);
                    let imgBas = (madde.baslangicResimleri && madde.baslangicResimleri[0] !== "") ? madde.baslangicResimleri[0] : madde.baslangicResmi;
                    let imgSon = (madde.bitisResimleri && madde.bitisResimleri[0] !== "") ? madde.bitisResimleri[0] : madde.bitisResmi;
                    let merkezY = 40 - (nBoyut / 2);
                    let finalBasX = 5 + bX; let finalBasY = merkezY + bY;
                    let finalSonX = 580 - nBoyut + sX; let finalSonY = merkezY + sY;
                    let kullanilacakCizim = (madde.ozelCizimYolu && madde.ozelCizimYolu.length > 5) ? madde.ozelCizimYolu : `M 10,25 C 100,-10 300,60 440,25`;
                    let baslangicCizimi = imgBas ? `<image href="${imgBas}" x="${finalBasX}" y="${finalBasY}" width="${nBoyut}" height="${nBoyut}" preserveAspectRatio="xMidYMid meet" />` : `<circle cx="${20 + bX}" cy="${40 + bY}" r="${nBoyut/2}" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="4,4"/>`;
                    let bitisCizimi = imgSon ? `<image href="${imgSon}" x="${finalSonX}" y="${finalSonY}" width="${nBoyut}" height="${nBoyut}" preserveAspectRatio="xMidYMid meet" />` : `<rect x="${finalSonX}" y="${finalSonY}" width="${nBoyut}" height="${nBoyut}" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="4,4"/>`;
                    cizgiIcerigi = `<div style="width: 100%; height: 100%; padding-left: 20px;"><svg width="100%" height="100%" viewBox="0 0 600 80" preserveAspectRatio="none" style="overflow: visible;">${baslangicCizimi}${bitisCizimi}<svg x="${finalBasX + nBoyut}" y="15" width="${finalSonX - (finalBasX + nBoyut)}" height="50" viewBox="0 0 450 50" preserveAspectRatio="none" style="overflow: visible;"><path d="${kullanilacakCizim}" fill="transparent" stroke="#555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0, 7" /></svg></svg></div>`;
                    let lScale = (madde.lScale || 100) / 100; let lX = madde.lX || 0; let lY = madde.lY || 0;
                    cizgiIcerigi = `<div style="transform: translate(${lX}px, ${lY}px) scale(${lScale}); transform-origin: left center; width:100%; height:100%;">${cizgiIcerigi}</div>`;
                    kutuBoyu = Math.max(75, nBoyut + 20) * lScale;
                }
                else if (cizgiAdi === "Kesikli çizgili-konturlu nesnenin dış hat çigilerinin üzerinden giderek varlığı oluşturma sonra da onu boyama çalışmaları") {
                    let boyut = madde.nesneBoyutu || 120; let adet = madde.nesneSayisi || 1; 
                    let baseNesneler = (madde.detaylar && madde.detaylar.length > 0) ? madde.detaylar : ["Ev"]; 
                    let secilenNesneler = []; for (let i = 0; i < adet; i++) { secilenNesneler.push(...baseNesneler); }
                    let olcek = boyut / 100; let dinamikKalinlik = 2.5 / olcek; let dinamikBosluk = 7 / olcek;
                    let svgler = secilenNesneler.map(isim => { let svgPath = nesneSVGleri[isim] || nesneSVGleri["Ev"]; return `<svg width="${boyut}" height="${boyut}" viewBox="0 0 100 100" style="overflow: visible; flex-shrink: 0;"><g fill="none" stroke="#555" stroke-width="${dinamikKalinlik}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0, ${dinamikBosluk}">${svgPath}</g></svg>`; }).join("");
                    cizgiIcerigi = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-start; padding-left: 20px; flex-wrap: wrap; gap: 20px;">${svgler}</div>`;
                    kutuBoyu = boyut + 20;
                }
                else if (cizgiAdi === "Labirent Çalışmaları") {
                    let lScale = (madde.lScale || 100) / 100; let lX = madde.lX || 0; let lY = madde.lY || 0; 
                    kutuBoyu = Math.max(150, (madde.lH + 60) * lScale); 
                    let imgBas = (madde.baslangicResimleri && madde.baslangicResimleri[0] !== "") ? madde.baslangicResimleri[0] : madde.baslangicResmi;
                    let imgSon = (madde.bitisResimleri && madde.bitisResimleri[0] !== "") ? madde.bitisResimleri[0] : madde.bitisResmi;
                    let ibBoyut = madde.bBoyut[0] !== undefined ? madde.bBoyut[0] : 40; let isBoyut = madde.sBoyut[0] !== undefined ? madde.sBoyut[0] : 40;
                    let bX = madde.bX[0] !== undefined ? madde.bX[0] : 0; let bY = madde.bY[0] !== undefined ? madde.bY[0] : 0;
                    let sX = madde.sX[0] !== undefined ? madde.sX[0] : 0; let sY = madde.sY[0] !== undefined ? madde.sY[0] : 0;
                    let bgX = madde.bgX || 0; let bgY = madde.bgY || 0; let bgBoyut = madde.bgBoyut || 600;
                    let bgLayer = "";
                    if (madde.arkaplanResmi) { bgLayer = `<image href="${madde.arkaplanResmi}" x="${bgX - 60}" y="${bgY - 20}" width="${bgBoyut}" height="${madde.lH + 40}" preserveAspectRatio="xMidYMid meet" opacity="0.6"/>`; }
                    let baslangicCizimi = imgBas ? `<image href="${imgBas}" x="${-ibBoyut - 5 + bX}" y="${-ibBoyut/2 + 7.5 + bY}" width="${ibBoyut}" height="${ibBoyut}" preserveAspectRatio="xMidYMid meet" />` : `<text x="${-45 + bX}" y="${12 + bY}" font-size="13" font-weight="bold" fill="#e74c3c" font-family="sans-serif">GİRİŞ</text>`;
                    let bitisCizimi = imgSon ? `<image href="${imgSon}" x="${madde.lW + 5 + sX}" y="${madde.lH - 15 - isBoyut/2 + 7.5 + sY}" width="${isBoyut}" height="${isBoyut}" preserveAspectRatio="xMidYMid meet" />` : `<text x="${madde.lW + 10 + sX}" y="${madde.lH - 3 + sY}" font-size="13" font-weight="bold" fill="#27ae60" font-family="sans-serif">ÇIKIŞ</text>`;
                    cizgiIcerigi = `<div style="width: 100%; display: flex; justify-content: center; align-items: center; padding-top: 15px;"><div style="transform: translate(${lX}px, ${lY}px) scale(${lScale}); transform-origin: center top;"><svg width="${madde.lW + 120}" height="${madde.lH + 40}" viewBox="-60 -20 ${madde.lW + 120} ${madde.lH + 40}" style="overflow: visible;">${bgLayer}<path d="${madde.labPath}" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="square" stroke-linejoin="miter" />${baslangicCizimi}${bitisCizimi}</svg></div></div>`;
                }
                else if (cizgiAdi === "Karmaşık Yol/Eşleştirme Çalışmaları (Spagetti Labirent)") {
                    let secilenYol = (madde.detaylar && madde.detaylar.length > 0) ? madde.detaylar[0] : "3 Yollu Kördüğüm";
                    let yollar = spagettiYollar[secilenYol] || spagettiYollar["3 Yollu Kördüğüm"];
                    let lScale = (madde.lScale || 100) / 100; let lX = madde.lX || 0; let lY = madde.lY || 0; 
                    let bgX = madde.bgX || 0; let bgY = madde.bgY || 0; let bgBoyut = madde.bgBoyut || 600;
                    kutuBoyu = Math.max(120, 280 * lScale + 20); 
                    let bgLayer = "";
                    if (madde.arkaplanResmi) { bgLayer = `<image href="${madde.arkaplanResmi}" x="${bgX}" y="${bgY}" width="${bgBoyut}" height="310" preserveAspectRatio="xMidYMid meet" opacity="0.8"/>`; }
                    let borders = ""; let fills = ""; let images = "";
                    let secilenRenk = madde.renk || "#f1c40f";
                    yollar.forEach((yol, i) => {
                        borders += `<path d="${yol.d}" stroke="#2c3e50" stroke-width="16" fill="none" stroke-linecap="butt" stroke-linejoin="round" />`;
                        fills += `<path d="${yol.d}" stroke="${secilenRenk}" stroke-width="10" fill="none" stroke-linecap="butt" stroke-linejoin="round" />`;
                        let imgBas = (madde.baslangicResimleri && madde.baslangicResimleri[i]) ? madde.baslangicResimleri[i] : madde.baslangicResmi;
                        let imgSon = (madde.bitisResimleri && madde.bitisResimleri[i]) ? madde.bitisResimleri[i] : madde.bitisResmi;
                        let ibX = madde.bX[i] !== undefined ? madde.bX[i] : 0; let ibY = madde.bY[i] !== undefined ? madde.bY[i] : 0; let ibBoyut = madde.bBoyut[i] !== undefined ? madde.bBoyut[i] : 40;
                        let isX = madde.sX[i] !== undefined ? madde.sX[i] : 0; let isY = madde.sY[i] !== undefined ? madde.sY[i] : 0; let isBoyut = madde.sBoyut[i] !== undefined ? madde.sBoyut[i] : 40;
                        if (imgBas) images += `<image href="${imgBas}" x="${0 - ibBoyut/2 + ibX}" y="${yol.y1 - ibBoyut/2 + ibY}" width="${ibBoyut}" height="${ibBoyut}" preserveAspectRatio="xMidYMid meet" />`;
                        if (imgSon) images += `<image href="${imgSon}" x="${600 - isBoyut/2 + isX}" y="${yol.y2 - isBoyut/2 + isY}" width="${isBoyut}" height="${isBoyut}" preserveAspectRatio="xMidYMid meet" />`;
                    });
                    cizgiIcerigi = `<div style="width: 100%; display: flex; justify-content: flex-start; align-items: center; padding-top: 15px; padding-left: 20px;"><div style="transform: translate(${lX}px, ${lY}px) scale(${lScale}); transform-origin: left top; width: 100%;"><svg width="100%" viewBox="-30 -10 660 310" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">${bgLayer}<g>${borders}</g><g>${fills}</g><g>${images}</g></svg></div></div>`;
                }
                else if (isSatirCizgisi(cizgiAdi)) {
                    cizgiIcerigi = generateLiveRowSVG(cizgiAdi, madde.detaylar || []);
                    kutuBoyu = 96;
                }
                else if (cizgiAdi.includes("Harfi") && madde.soruTipi === "Dış Hat Boyama") {
                    let detaylar = madde.detaylar || [];
                    let fSize = madde.fontBoyutu || 250;
                    
                    if (detaylar.includes("Görsel Boyama")) {
                        // Kütüphaneden gelen görseli (veya yüklenen resmi) bas
                        let nBoyut = document.getElementById('ilk-nesne-boyutu') ? parseInt(document.getElementById('ilk-nesne-boyutu').value) : 150;
                        let imgSrc = madde.baslangicResmi || "";
                        let imgTag = imgSrc ? `<image href="${imgSrc}" x="${(600 - nBoyut)/2}" y="0" width="${nBoyut}" height="${nBoyut}" preserveAspectRatio="xMidYMid meet" />` : `<rect x="${(600 - nBoyut)/2}" y="0" width="${nBoyut}" height="${nBoyut}" fill="none" stroke="#ccc" stroke-dasharray="5,5"/><text x="300" y="${nBoyut/2}" font-family="sans-serif" font-size="14" fill="#ccc" text-anchor="middle" dominant-baseline="middle">[ Görsel Eklenecek ]</text>`;
                        
                        cizgiIcerigi = `
                        <div style="width: 100%; display: flex; align-items: center; justify-content: center; min-height: ${nBoyut + 40}px; padding: 20px 0;">
                            <svg width="600" height="${nBoyut}" viewBox="0 0 600 ${nBoyut}" style="overflow: visible;">
                                ${imgTag}
                            </svg>
                        </div>`;
                        kutuBoyu = nBoyut + 40;
                    } else {
                        // Harf Basımı Modu
                        let harf = cizgiAdi.split(" ")[0];
                        let buyukHarf = harf.toLocaleUpperCase('tr-TR');
                    let kucukHarf = harf.toLocaleLowerCase('tr-TR');
                    
                    if (harf === "İ") { buyukHarf = "İ"; kucukHarf = "i"; }
                    if (harf === "I") { buyukHarf = "I"; kucukHarf = "ı"; }

                    // Değişkenleri zaten yukarıda tanımlamıştık, o yüzden buradan "let fSize..." satırlarını sildik
                    let harfDizisi = [];
                    if (detaylar.includes("Küçük Harf") && !detaylar.includes("Büyük Harf")) harfDizisi.push(kucukHarf);
                    else if (detaylar.includes("Büyük Harf") && !detaylar.includes("Küçük Harf")) harfDizisi.push(buyukHarf);
                    else harfDizisi.push(buyukHarf, kucukHarf);

                    let harflerHtml = harfDizisi.map(h => `<span class="meb-kesik-kontur" style="font-size: ${fSize}px; color: #2c3e50; line-height: 1; margin: 0 30px; display: inline-block;">${h}</span>`).join('');

                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; align-items: center; justify-content: center; min-height: ${fSize}px; padding: 20px 0;">
                        ${harflerHtml}
                    </div>`;
                    
                    kutuBoyu = fSize + 40;
                }
            } // <--- İŞTE UNUTULAN İKİNCİ EFSANE PARANTEZ GELDİ!

                // İŞTE SİLİNEN O EFSANE SATIR GERİ GELDİ!
                else if (cizgiAdi.includes("Harfi") && madde.soruTipi === "Harf Yazımı") {
                    let harf = cizgiAdi.split(" ")[0];
                    let buyukHarf = harf.toLocaleUpperCase('tr-TR');
                    let kucukHarf = harf.toLocaleLowerCase('tr-TR');
                    
                    if (harf === "İ") { buyukHarf = "İ"; kucukHarf = "i"; }
                    if (harf === "I") { buyukHarf = "I"; kucukHarf = "ı"; }

                    let fontBoyutu = madde.fontBoyutu || 80;
                    let detaylar = madde.detaylar || [];

                    let harfDizisi = [];
                    if (detaylar.includes("Sadece Küçük Harf")) harfDizisi.push(kucukHarf);
                    else if (detaylar.includes("Sadece Büyük Harf")) harfDizisi.push(buyukHarf);
                    else harfDizisi.push(buyukHarf, kucukHarf);

                    let baseFontClass = "meb-temel";
                    if (detaylar.includes("Kesikli Font")) baseFontClass = "meb-kesik-kontur";
                    if (detaylar.includes("İçi Boş Font")) baseFontClass = "meb-kontur";
                    
                    let opacity = detaylar.includes("Hayalet Font") ? "0.2" : "1";
                    let kilavuzAktif = detaylar.includes("Kılavuz Çizgi Ekle") || detaylar.includes("Hayalet Çizgi");
                    let kilavuzOpacity = detaylar.includes("Hayalet Çizgi") ? "0.25" : "1";

                    let bgSvg = "";
                    if (kilavuzAktif) {
                        let yTop = 20, yMid = 48, yBot = 76;
                        bgSvg = `
                        <svg width="100%" height="100%" viewBox="0 0 600 96" preserveAspectRatio="none" style="position:absolute; top:0; left:0; z-index:0; overflow:visible; opacity:${kilavuzOpacity};">
                            <rect x="0" y="${yMid}" width="600" height="${yBot - yMid}" fill="#fff4cc" />
                            <rect x="0" y="${yTop}" width="600" height="${yBot - yTop}" fill="none" stroke="#2c3e50" stroke-width="1.5" />
                            <line x1="0" y1="${yMid}" x2="600" y2="${yMid}" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5, 5" />
                        </svg>`;
                    }

                    let harflerHtml = "";
                    let fontCarpani = (harfDizisi.length > 1) ? 2.0 : 1.0; 
                    
                    let sutunFormati = document.getElementById('sayfa-sutun-ayari') ? document.getElementById('sayfa-sutun-ayari').value : "1";
                    let tekrarSayisi = 3;
                    
                    // ==============================================================
                    // YENİ: İSTEĞE BAĞLI "HARF ADEDİ" MOTORU (KOLAYDAN ZORA MANTIĞI)
                    // ==============================================================
                    if (madde.harfSayisi && madde.harfSayisi > 0) {
                        tekrarSayisi = madde.harfSayisi; // Kullanıcı kaydırıcıdan kaç seçtiyse kesin olarak onu bas!
                    } else {
                        // Kullanıcı özel bir sayı seçmediyse (Otomatik Mod) alan hesabına göre bas
                        let maxAlan = (sutunFormati === "2") ? 240 : 520; 
                        tekrarSayisi = Math.floor(maxAlan / (fontBoyutu * fontCarpani)); 
                        if (tekrarSayisi < 1) tekrarSayisi = 1;
                        if (sutunFormati === "2" && tekrarSayisi > 3) tekrarSayisi = 3;
                        if (sutunFormati === "1" && tekrarSayisi < 3) tekrarSayisi = 3;
                    }

                    for (let s = 0; s < tekrarSayisi; s++) {
                        harfDizisi.forEach((h, charIndex) => {
                            let currentClass = baseFontClass;
                            let fSize = fontBoyutu;

                            if (detaylar.includes("İlk Harf Devasa") && s === 0 && charIndex === 0) {
                                fSize = fontBoyutu * 1.4;
                                currentClass = "meb-temel"; 
                            } else if (detaylar.includes("İlk Harf Kılavuz (Gerisi Kesikli)")) {
                                currentClass = (s === 0 && charIndex === 0) ? "meb-temel" : "meb-kesik-kontur";
                            }
                            
                            // Çift sütunda harfler birbirine yapışmasın diye sağdan-soldan payı hafif kısıtlıyoruz
                            let yanBosluk = (sutunFormati === "2") ? "8px" : "15px";

                            harflerHtml += `<span class="${currentClass}" style="font-size: ${fSize}px; color: #111; line-height: 0.75; margin: 0 ${yanBosluk}; opacity: ${opacity}; z-index: 1; display: inline-block; white-space: nowrap; transform: translateY(8px);">${h}</span>`;
                        });
                    }

                    cizgiIcerigi = `
                    <div style="width: 100%; height: 96px; position: relative; display: flex; align-items: flex-start; justify-content: flex-start; padding-left: 20px; padding-top: 15px;">
                        ${bgSvg}
                        <div style="display: flex; align-items: flex-start; width: 100%; z-index: 1; position: relative;">
                            ${harflerHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 96;
                }

                else if (cizgiAdi.includes("Harfi") && madde.soruTipi === "Parmakla Takip Etme") {
                    let harf = cizgiAdi.split(" ")[0];
                    let detaylar = madde.detaylar || [];
                    
                    let isKucuk = detaylar.includes("Sadece Küçük Harf");
                    let pDuzen = detaylar.includes("Yanına Satır At") ? "satirli" : "tek"; 
                    let pBg = detaylar.includes("Kılavuz Çizgiyi Gizle") ? "yok" : "var"; 
                    
                    let fontClass = "meb-temel"; 
                    if (detaylar.includes("Kesikli Font")) fontClass = "meb-kesik-kontur";
                    else if (detaylar.includes("İçi Boş Font")) fontClass = "meb-kontur";
                    
                    let hText = isKucuk ? harf.toLocaleLowerCase('tr-TR') : harf.toLocaleUpperCase('tr-TR');
                    if (harf === "İ") hText = isKucuk ? "i" : "İ";
                    if (harf === "I") hText = isKucuk ? "ı" : "I";
                    
                    let fBoyut = madde.fontBoyutu || 250;
                    if (fBoyut < 150) fBoyut = 250; 

                    let hX = madde.harfX || 0; let hY = madde.harfY || 19; 
                    let pBgH = madde.pBgH || (fBoyut * 1.4); 
                    let pBgY = madde.pBgY || 0;
                    let gScale = (madde.genelScale || 100) / 100;
                    let gX = madde.genelX || 0; let gY = madde.genelY || 0;
                    
                    // DÜZELTME: 600px sabit değerleri 100% yapıldı! Artık satır sonuna kadar kusursuz uzar.
                    let bgSvg = "";
                    if (pBg === 'var') {
                        bgSvg = `<svg width="100%" height="${pBgH}px" style="position:absolute; top:calc(50% - ${pBgH/2}px + ${pBgY}px); left:0; z-index:-1;">
                            <rect x="0" y="50%" width="100%" height="25%" fill="#fff4cc" />
                            <rect x="0" y="25%" width="100%" height="50%" fill="none" stroke="#2c3e50" stroke-width="1.5"/>
                            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="8,8"/>
                        </svg>`;
                    }

                    let baslangicNoktasi = (num, renk, rot) => `
                    <div style="position:absolute; left:-20px; top:-20px; width:40px; height:40px; pointer-events:none;">
                        <svg width="40" height="40" style="overflow:visible; position:absolute; left:0; top:0; transform: rotate(${rot}deg);">
                            <g transform="translate(20,20)">
                                <polygon points="12,-4 20,0 12,4" fill="${renk}" />
                                <circle cx="0" cy="0" r="10" fill="white" stroke="${renk}" stroke-width="2"/>
                            </g>
                        </svg>
                        <div style="position:absolute; left:0; top:0; width:40px; height:40px; display:flex; justify-content:center; align-items:center;">
                            <span style="color:${renk}; font-size:12px; font-family:sans-serif; font-weight:bold; transform:translateY(1px);">${num}</span>
                        </div>
                    </div>`;

                    // YENİ: Manuel oklar tamamen kaldırıldı. Yerine Akıllı Motor Kapsayıcısı eklendi!
                    let fontSVG = `
                    <div class="akilli-rota-kapsayici" data-harf="${hText}" style="position:absolute; left:0; top:0; width:100%; height:100%; pointer-events:none;">
                        <svg width="400" height="400" style="overflow:visible; position:absolute; left:-200px; top:-200px; pointer-events:none;">
                            <g transform="translate(200, 200)">
                                <text class="rota-hedef-metin ${fontClass}" x="0" y="-1" style="font-size:${fBoyut}px;" dominant-baseline="central" text-anchor="middle" fill="#2c3e50">${hText}</text>
                                <!-- MOTOR JSON VERİSİYLE BURAYI KUSURSUZ OKLARLA DOLDURACAK -->
                                <g class="rota-cizim-katmani"></g>
                            </g>
                        </svg>
                    </div>`;
                    let ok1Svg = ""; let ok2Svg = ""; let ok3Svg = ""; // Döngü hata vermesin diye boş bıraktık



                    let maxKutuBoyu = pBgH * 0.5;

                    if (pDuzen === 'satirli') {
                        // =========================================================
                        // YENİ GPT FLEX MİMARİSİ: İleriye Bakış (Look-Ahead) Motoru
                        // =========================================================

                        // 1. SOL KUTU (Devasa Harf Kafesi - Eni sabit 220px)
                        let solKutuHtml = `
                        <div style="width: 220px; height: ${maxKutuBoyu}px; flex-shrink: 0; position: relative; display:flex; justify-content:center; align-items:center;">
                            <div style="position:absolute; width:100%; height:100%; transform: scale(${gScale}) translate(${gX}px, ${gY}px); transform-origin: center; display:flex; justify-content:center; align-items:center;">
                                <div style="position:absolute; width:100%; height:100%; left:0; top:0; overflow:hidden; border-radius: 8px;">
                                    ${bgSvg}
                                </div>
                                <div style="position:absolute; left:50%; top:50%; width:0; height:0; transform: translate(${hX}px, ${hY}px); z-index:1;">
                                    ${fontSVG}
                                    ${ok1Svg}
                                    ${ok2Svg}
                                    ${ok3Svg}
                                </div>
                            </div>
                        </div>`;

                        // 2. SAĞ KUTU (Satırların Birleştiği Esnek Kapsayıcı)
                        let sagKutuHtml = `<div style="flex: 1; display: flex; flex-direction: column; gap: 15px; padding-left: 20px; justify-content: center;">`;

                        let cizgiBulundu = false;

                        // GELECEĞİ GÖREN DÖNGÜ: Benden sonra eklenmiş 2 soru kılavuz çizgisi mi?
                        // Evetse onları al, harfin yanındaki kutuya göm ve ana listeden gizle!
                        for (let i = 1; i <= 2; i++) {
                            let siradakiMadde = kagitIcerigi[index + i];
                            if (siradakiMadde && isSatirCizgisi(siradakiMadde.konu)) {
                                cizgiBulundu = true;
                                siradakiMadde.isGrupCocugu = true; // Dışarıya sızmasın diye işaretledik

                                let cizgiGorseli = generateLiveRowSVG(siradakiMadde.konu, siradakiMadde.detaylar || []);
                                let cScale = (siradakiMadde.genelScale || 100) / 100;
                                let cX = siradakiMadde.genelX || 0;
                                let cY = siradakiMadde.genelY || 0;

                                sagKutuHtml += `
                                <div style="width: 100%; height: 96px;">
                                    <div style="transform: translate(${cX}px, ${cY}px) scale(${cScale}); transform-origin: left center; width: 100%; height: 100%;">
                                        ${cizgiGorseli}
                                    </div>
                                </div>`;
                            }
                        }

                        if (!cizgiBulundu) {
                            sagKutuHtml += `<div style="border:2px dashed #bdc3c7; height: ${maxKutuBoyu}px; display:flex; align-items:center; justify-content:center; color:#7f8c8d; font-size:14px; font-weight:bold; text-align:center; padding:10px; border-radius:8px;">👉 Harf sola sabitlendi!<br>Şimdi "Boş Kılavuz Satır" eklerseniz<br>buraya şıkır şıkır oturacak.</div>`;
                        }
                        sagKutuHtml += `</div>`;

                        // 3. İKİSİNİ BİRLEŞTİREN ANA FLEX KAPSAYICI
                        cizgiIcerigi = `
                        <div class="parmak-container" style="display: flex; width: 100%; align-items: center; justify-content: space-between;">
                            ${solKutuHtml}
                            ${sagKutuHtml}
                        </div>`;

                        kutuBoyu = maxKutuBoyu;
                        anaKapsayiciStil = `clear: both; grid-column: span 4; width: 100%; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; position: relative; margin-bottom: 20px;`;
                    } else {
                        // NORMAL (TEK VE ORTALI) HARF BASKISI
                        cizgiIcerigi = `
                        <div style="width: 100%; display: flex; align-items: center; justify-content: center; padding: 45px 0;">
                            <div style="position:relative; width:100%; height: ${maxKutuBoyu}px; border: 1px solid #ecf0f1; border-radius: 8px; overflow:visible;">
                                <div style="position:absolute; width:100%; height:100%; transform: scale(${gScale}) translate(${gX}px, ${gY}px); transform-origin: center; display:flex; justify-content:center; align-items:center;">
                                    
                                    <!-- DÜZELTME BURADA: width:50% olan maske width:100% yapıldı! -->
                                    <div style="position:absolute; width:100%; height:100%; left:0; top:0; overflow:hidden; border-radius: 8px;">
                                        ${bgSvg}
                                    </div>
                                    
                                    <div style="position:absolute; left:50%; top:50%; width:0; height:0; transform: translate(${hX}px, ${hY}px); z-index:1;">
                                        ${fontSVG}
                                        ${ok1Svg}
                                        ${ok2Svg}
                                        ${ok3Svg}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        
                        kutuBoyu = maxKutuBoyu + 30;
                    }
                }
                
                // ==============================================================
                // YENİ: EVRENSEL AKILLI GRİD (IZGARA) MOTORU - A4 BASKI
                // ==============================================================
                else if (["Sesi Barındıranı İşaretleme", "Sesin Konumunu Bulma", "Sesi Barındıranı Boyama"].includes(madde.soruTipi)) {
                    let cols = madde.gridCols || 2;
                    let rows = madde.gridRows || 4;
                    let tema = madde.gridTema || "modern";
                    let stil = madde.gridStil || "solid";
                    let yuvSayisi = madde.gridYuv !== undefined ? madde.gridYuv : 1;
                    
                    let images = madde.gridResimleri || {};
                    let detaylar = madde.detaylar || [];
                    let cRengi = (madde.renk && madde.renk !== "#f1c40f") ? madde.renk : "#a2d148";
                    let cizimTipi = detaylar.includes("Varlıkların Altını Çiz") ? "cizgi" : "kutu";

                    let lScale = (madde.lScale || 100) / 100;
                    let lX = madde.lX || 0; let lY = madde.lY || 0;
                    let bgX = madde.bgX || 0; let bgY = madde.bgY || 0; let bgBoyut = madde.bgBoyut || 600;
                    let imgScale = (madde.bBoyut[0] === 40) ? 60 : madde.bBoyut[0]; 
                    let imgX = madde.bX[0] || 0; let imgY = madde.bY[0] || 0;
                    
                    let bgLayer = madde.arkaplanResmi ? `<img src="${madde.arkaplanResmi}" style="position: absolute; left: ${bgX}px; top: ${bgY}px; width: ${bgBoyut}px; opacity: 0.6; z-index: 0;" />` : "";
                    
                    let gap = 30; 
                    let availableWidth = 560; 
                    let boxWidth = (availableWidth - (gap * (cols - 1))) / cols;
                    if(boxWidth > 220) boxWidth = 220; 
                    let boxHeight = boxWidth * 0.75; 

                    let bRadius = "20px";
                    if(tema === "capraz") bRadius = "30px 4px 30px 4px"; 
                    if(tema === "bulut") bRadius = "40px 30px 50px 40px"; 

                    let bStil = (stil === "suslu") ? "double" : stil;
                    let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 4px;` : "";
                    let boxThickness = (stil === "suslu") ? "5px" : "3px";
                    
                    // YENİ: Longhand CSS (Hata riskini sıfıra indirir)
                    let borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 20px; border-image-outset: 12px; border-image-repeat: round; background-color: #fff; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: 0 4px 10px rgba(0,0,0,0.04); ${susluOutline}`;
                    
    let gridHtml = `<div style="display: grid; grid-template-columns: repeat(${cols}, ${boxWidth}px); gap: ${gap}px; justify-content: center; width: 100%; position: relative; z-index: 1; padding: 10px;">`;
                    
                    let metinler = madde.gridMetinleri || {}; // YENİ: Hafızadan metinleri aldık

                    for(let r=0; r<rows; r++){
                        for(let c=0; c<cols; c++){
                            let idx = r * cols + c;
                            let imgSrc = images[idx] || '';
                            let metin = metinler[idx] || ''; // Kutuya ait metin
                            
                            let imgTag = imgSrc ? `<img src="${imgSrc}" style="width: ${imgScale}%; height: ${imgScale}%; object-fit: contain; transform: translate(${imgX}px, ${imgY}px); margin-top: 10px;" />` : ``;
                            
                            // YENİ: Metin Boyutu Görsel Boyutu Slider'ından otomatik güç alır! (Örn: Scale 60 ise boyut 27px olur)
                            let fPunto = imgScale * 0.45;
                            let metinTag = metin ? `<div style="font-size: ${fPunto}px; font-weight: 700; color: #2c3e50; font-family: 'Quicksand', sans-serif; text-align: center; transform: translate(${imgX}px, ${imgY}px); margin-top: 8px;">${metin}</div>` : "";
                            
                            let isaretAlani = "";
                            if (cizimTipi === "cizgi") {
                                isaretAlani = `<div style="width: 65%; height: 4px; background-color: ${cRengi}; border-radius: 4px; margin-top: auto; margin-bottom: 24px;"></div>`;
                            } else {
                                isaretAlani += `<div style="display: flex; gap: 8px; margin-top: auto; margin-bottom: 12px;">`;
                                for(let y=0; y<yuvSayisi; y++){
                                    isaretAlani += `<div style="width: 28px; height: 28px; border: 3px solid ${cRengi}; border-radius: 50%; background: #fbfdfb; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>`;
                                }
                                isaretAlani += `</div>`;
                            }

                            gridHtml += `
                                <div style="${borderCSS} display: flex; flex-direction: column; align-items: center; justify-content: flex-start; height: ${boxHeight}px; position: relative; box-sizing: border-box; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
                                    ${imgTag}
                                    ${metinTag}
                                    ${isaretAlani}
                                </div>`;
                        }
                    }                
                    gridHtml += `</div>`;
                    
                   let totalHeight = (rows * boxHeight) + ((rows - 1) * gap);
                    kutuBoyu = (totalHeight + 60) * lScale; 
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 15px;">
                        <div style="transform: translate(${lX}px, ${lY}px) scale(${lScale}); transform-origin: top center; width: 100%; position: relative;">
                            ${bgLayer}
                            ${gridHtml}
                        </div>
                    </div>`;
                }

                // =========================================================
                // YENİ: GİZLİ HARF BULMA MOTORU (A4 BASKI)
                // =========================================================
                else if (cizgiAdi.includes("Harfi") && madde.soruTipi === "Gizli Harf Bulma") {
                    let harf = cizgiAdi.split(" ")[0];
                    let buyukHarf = harf.toLocaleUpperCase('tr-TR');
                    if (harf === "İ") buyukHarf = "İ"; 
                    if (harf === "I") buyukHarf = "I";

                    let harfIndex = mebHarfSirasiBuyuk.indexOf(buyukHarf);
                    if (harfIndex === -1) harfIndex = 5; 

                    let aktifDetaylar = madde.detaylar || [];
                    let isKucuk = aktifDetaylar.includes("Sadece Küçük Harf");
                    let isBuyuk = aktifDetaylar.includes("Sadece Büyük Harf");
                    let ogrenilmemisEklensin = aktifDetaylar.includes("Henüz Öğrenilmemiş Harfler Eklensin");
                    
                    if(!isKucuk && !isBuyuk) { isKucuk = true; isBuyuk = true; }

                    let havuz = [];
                    let sinir = ogrenilmemisEklensin ? mebHarfSirasiBuyuk.length : (harfIndex + 1);
                    
                    for (let i = 0; i < sinir; i++) {
                        if (isBuyuk) havuz.push(mebHarfSirasiBuyuk[i]);
                        if (isKucuk) havuz.push(mebHarfSirasiKucuk[i]);
                    }
                    if (havuz.length < 3) havuz.push('E', 'e', 'A', 'a');

                    let hedefHavuz = [];
                    if (isBuyuk) hedefHavuz.push(buyukHarf);
                    if (isKucuk) hedefHavuz.push(mebHarfSirasiKucuk[mebHarfSirasiBuyuk.indexOf(buyukHarf)] || harf.toLocaleLowerCase('tr-TR'));

                    // A4 Kutusu CSS Motoru Bağlantısı
                    let tema = madde.gridTema || "modern";
                    let stil = madde.gridStil || "dashed";
                    let cRengi = madde.renk || "#3498db";

                    let bRadius = "12px";
                    if(tema === "capraz") bRadius = "15px 4px 15px 4px"; 
                    if(tema === "bulut") bRadius = "25px 20px 30px 25px"; 
                    let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 4px;` : "";
                    let boxThickness = (stil === "suslu") ? "5px" : "3px";
                    let borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 15px; border-image-outset: 5px; border-image-repeat: round; background-color: #fdfefe; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05); ${susluOutline}`;

                    let harflerSVG = "";
                    for(let r=0; r<4; r++) {
                        for(let c=0; c<12; c++) {
                            let cx = 35 + (c * 46) + (Math.random() * 12 - 6); 
                            let cy = 35 + (r * 35) + (Math.random() * 10 - 5); 
                            let rot = Math.floor(Math.random() * 41) - 20; 
                            
                            let basilacakHarf = "";
                            if (Math.random() < 0.15 && hedefHavuz.length > 0) {
                                basilacakHarf = hedefHavuz[Math.floor(Math.random() * hedefHavuz.length)];
                            } else {
                                basilacakHarf = havuz[Math.floor(Math.random() * havuz.length)];
                            }

                            let rSize = 26 + Math.floor(Math.random() * 11);
                            // MEB FONTU BURADA DA GÜNCELLENDİ
                            harflerSVG += `<text x="${cx}" y="${cy}" font-family="'TemelYazi', sans-serif" font-weight="normal" font-size="${rSize}px" fill="#2c3e50" transform="rotate(${rot}, ${cx}, ${cy})">${basilacakHarf}</text>`;
                        }
                    }

                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; align-items: center; justify-content: center; padding: 10px 0;">
                        <div style="${borderCSS} width: 600px; display: flex; justify-content: center;">
                            <svg width="100%" height="auto" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">
                                ${harflerSVG}
                            </svg>
                        </div>
                    </div>`;
                    
                    kutuBoyu = 195; // Çerçeve için yükseklik payı azıcık artırıldı
                }

                else if (madde.konu === "Harf Karıştırmaca") {
                    let hamKelimeMetni = madde.gridMetinleri[0] || "";
                    let lScale = (madde.genelScale || 100) / 100;

                    let icerikHtml = harfKaristirmaOlustur(hamKelimeMetni, madde);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = (hamKelimeMetni.split(',').length * 65) * lScale; 
                }

                // =========================================================
                // YENİ: LABİRENT (A4 BASKI)
                // =========================================================
                else if (madde.konu === "Labirentten Kelime Toplama") {
                    let hamKelimeMetni = madde.gridMetinleri[0] || "";
                    let lScale = (madde.genelScale || 100) / 100;

                    let icerikHtml = labirentKelimeOlustur(hamKelimeMetni, madde);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 450 * lScale; 
                }

                else if (madde.konu === "Kelime Zinciri (Yılan Bulmaca)") {
                    let hamKelimeMetni = madde.gridMetinleri[0] || "";
                    let lScale = (madde.genelScale || 100) / 100;
                    let icerikHtml = kelimeZinciriOlustur(hamKelimeMetni, madde);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 400 * lScale; 
                }

                else if (madde.konu === "Mini Sudoku (4x4)") {
                    let hamKelimeMetni = madde.gridMetinleri[0] || "";
                    let lScale = (madde.genelScale || 100) / 100;
                    let icerikHtml = miniSudokuOlustur(hamKelimeMetni, madde, madde.soruTipi);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 360 * lScale; 
                }

                else if (madde.konu === "Cümle-Görsel İlişkisi" && madde.soruTipi === "Okuduğunu Eşleştirme") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let icerikHtml = okudugunuEslestirmeOlustur(madde, madde.gridMetinleri, madde.gridResimleri);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 480 * lScale;
                }

                else if (madde.konu === "Cümle-Görsel İlişkisi" && madde.soruTipi === "Okuduğunu Çizme") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let icerikHtml = okudugunuCizmeOlustur(madde.gridMetinleri[0]);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 360 * lScale;
                }

                // =========================================================
                // YENİ: SES SAYISI KADAR YAZMA MOTORU (A4 BASKI)
                // =========================================================
                else if (madde.soruTipi === "Ses Sayısı Kadar Yazma") {
                    let cols = madde.gridCols || 2;
                    let rows = madde.gridRows || 4;
                    let images = madde.gridResimleri || {};
                    let metinler = madde.gridMetinleri || {};
                    let detaylar = madde.detaylar || [];
                    
                    let lScale = (madde.lScale || 100) / 100;
                    let lX = madde.lX || 0; let lY = madde.lY || 0;
                    let imgScale = (madde.bBoyut && madde.bBoyut[0] === 40) ? 60 : (madde.bBoyut ? madde.bBoyut[0] : 60); 
                    let imgX = (madde.bX && madde.bX[0]) || 0; 
                    let imgY = (madde.bY && madde.bY[0]) || 0;

                    // YENİ: A4 Matbaa için CSS Kutu Motorunu devreye soktuk!
                    let tema = madde.gridTema || "modern";
                    let stil = madde.gridStil || "solid";
                    let cRengi = (madde.renk && madde.renk !== "#f1c40f") ? madde.renk : "#a2d148";

                    let bRadius = "20px";
                    if(tema === "capraz") bRadius = "30px 4px 30px 4px"; 
                    if(tema === "bulut") bRadius = "40px 30px 50px 40px"; 

                    let susluOutline = (stil === "suslu") ? `outline: 2px dotted ${cRengi}; outline-offset: 4px;` : "";
                    let boxThickness = (stil === "suslu") ? "5px" : "3px";
                    let borderCSS = `border: ${boxThickness} solid transparent; border-image-source: url('${olusturBorderImage(tema, stil, cRengi)}'); border-image-slice: 30; border-image-width: 20px; border-image-outset: 8px; border-image-repeat: round; background-color: #fff; background-clip: padding-box; border-radius: ${bRadius}; box-shadow: 0 4px 10px rgba(0,0,0,0.04); ${susluOutline}`;

                    let cizgiVarMi = detaylar.includes("Noktalı Çizgi Çiz");
                    let esittirVarMi = detaylar.includes("Eşittir (=) Koy");

                    let kutuGorseli = cizgiVarMi 
                        ? `<div style="width: 50px; border-bottom: 3px dashed #7f8c8d; margin-left: 15px; margin-bottom: 5px;"></div>`
                        : `<div style="width: 35px; height: 35px; border: 3px solid #95a5a6; border-radius: 6px; margin-left: 15px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);"></div>`;
                    let esittirHtml = esittirVarMi ? `<span style="color:#7f8c8d; font-family:'Quicksand', sans-serif; font-weight:bold; font-size:30px; margin-left:15px;">=</span>` : "";

                    let gap = 40; 
                    let availableWidth = 560; 
                    let boxWidth = (availableWidth - (gap * (cols - 1))) / cols;

                    let gridHtml = `<div style="display: grid; grid-template-columns: repeat(${cols}, ${boxWidth}px); gap: ${gap}px; justify-content: center; width: 100%; position: relative; z-index: 1; padding: 10px;">`;
                    
                    let satirYuksekligi = Math.max(imgScale, 40);

                    for(let r=0; r<rows; r++){
                        for(let c=0; c<cols; c++){
                            let idx = r * cols + c;
                            let imgSrc = images[idx] || '';
                            let metin = metinler[idx] || '';
                            
                            let gorselHtml = imgSrc ? `<img src="${imgSrc}" style="width: ${imgScale}px; height: ${imgScale}px; object-fit: contain; margin-right: 15px; transform: translate(${imgX}px, ${imgY}px);" />` : ``;
                            
                            let fPunto = Math.max(imgScale * 0.45, 18);
                            let metinHtml = metin ? `<span style="font-size: ${fPunto}px; font-weight: 700; color: #2c3e50; font-family: 'TemelYazi', sans-serif; transform: translate(${imgX}px, ${imgY}px);">${metin}</span>` : "";
                            
                            if (!imgSrc && !metin) metinHtml = `<span style="color: #bdc3c7; font-size: 24px;">—</span>`;

                            gridHtml += `
                            <div style="${borderCSS} display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; height: ${satirYuksekligi + 20}px; box-sizing: border-box;">
                                <div style="display: flex; align-items: center;">
                                    ${gorselHtml}
                                    ${metinHtml}
                                </div>
                                <div style="display: flex; align-items: center;">
                                    ${esittirHtml}
                                    ${kutuGorseli}
                                </div>
                            </div>`;
                        }
                    }
                    gridHtml += `</div>`;
                    
                    let totalHeight = (rows * satirYuksekligi) + ((rows - 1) * gap);
                    kutuBoyu = (totalHeight + 60) * lScale; 
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 15px;">
                        <div style="transform: translate(${lX}px, ${lY}px) scale(${lScale}); transform-origin: top center; width: 100%; position: relative;">
                            ${gridHtml}
                        </div>
                    </div>`;
                }

                // =========================================================
                // YENİ: AKILLI MOTOR (A4 BASKI)
                // =========================================================
                else if (["Hece Birleştirme", "Kelime Birleştirme", "Cümle Oluşturma", "Heceye Ayırma", "Kelimeye Ayırma"].includes(madde.konu)) {
                    let girilenMetin = madde.gridMetinleri[0] || "";
                    let tema = madde.gridTema || "modern";
                    let stil = madde.gridStil || "solid";
                    let cRengi = (madde.renk && madde.renk !== "#f1c40f") ? madde.renk : "#3498db";
                    
                    let lScale = (madde.lScale || 100) / 100;
                    let lX = madde.lX || 0; let lY = madde.lY || 0;

                    let mod = madde.konu.includes("Ayırma") ? "ayir" : "birlestir";
                    let isCumle = (madde.konu === "Cümle Oluşturma" || madde.konu === "Kelimeye Ayırma");

                    let icerikHtml = heceVeKelimeMotoru(girilenMetin, tema, stil, cRengi, mod, isCumle);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: translate(${lX}px, ${lY}px) scale(${lScale}); transform-origin: top center; width: 100%; position: relative;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 200 * lScale;
                }   

                // =========================================================
                // YENİ: KILAVUZ ÇİZGİYE SERBEST YAZI (A4 BASKI)
                // =========================================================
                else if (madde.konu === "Kılavuz Çizgiye Serbest Yazı") {
                    let girilenMetin = madde.gridMetinleri[0] || "";
                    let detaylar = madde.detaylar || [];
                    let fSize = madde.fontBoyutu || 80;
                    
                    let lScale = (madde.lScale || 100) / 100;

                    let sutunFormati = document.getElementById('sayfa-sutun-ayari') ? document.getElementById('sayfa-sutun-ayari').value : "1";
                    
                    let tekrarSayisi = 2;
                    if (madde.harfSayisi && madde.harfSayisi > 0) {
                        tekrarSayisi = madde.harfSayisi; // Öğretmen kaydırıcıyı ellediyse onun dediği olur!
                    } else {
                        // OTOMATİK MOD: Seçilen sütun düzenine ve kelimenin uzunluğuna göre kağıda sığacak optimum adedi hesaplar
                        let resimPayi = (madde.soruTipi === "Yanına Resimli Yazı") ? 120 : 0;
                        let maxAlan = (sutunFormati === "2") ? (200 - resimPayi) : (500 - resimPayi); 
                        let tahminiGenislik = (girilenMetin.length * (fSize * 0.45)) + 30; 
                        tekrarSayisi = Math.floor(maxAlan / tahminiGenislik);
                        if(tekrarSayisi < 1) tekrarSayisi = 1;
                    }

                    let resimliMod = (madde.soruTipi === "Yanına Resimli Yazı");
                    let imgSrc = resimliMod ? (madde.baslangicResmi || "") : "";
                    let resimSagdaMi = detaylar.includes("Görseli Sağa Al (Varsayılan Sol)");

                    // YENİ: Joystick'ten gelen verileri alıp CSS'e dönüştürüyoruz (Yeni global değişkenlerle)
                    let imgStyle = "";
                    if (resimliMod) {
                        let rX = madde.resimX || 0;
                        let rY = madde.resimY || 0;
                        let rScale = (madde.resimBoyutu || 100) / 100;
                        imgStyle = `transform: translate(${rX}px, ${rY}px) scale(${rScale}); transition: transform 0.2s ease;`;
                    }

                    cizgiIcerigi = serbestYaziOlustur(girilenMetin, detaylar, fSize, tekrarSayisi, imgSrc, resimliMod, resimSagdaMi, imgStyle);
                    kutuBoyu = 96;
                }

                // =========================================================
                // YENİ: OTOMATİK ÇENGEL BULMACA (A4 BASKI)
                // =========================================================
                else if (madde.konu === "Otomatik Çengel Bulmaca") {
                    let girilenMetin = madde.gridMetinleri[0] || "";
                    let lScale = (madde.genelScale || 100) / 100;

                    let icerikHtml = bulmacaOlustur(girilenMetin, madde, madde.soruTipi); // Soru Tipi eklendi!
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 380 * lScale; // Boyutlar ufaldiği için yükseklik rezervini de 380'e çektik
                }

                // =========================================================
                // YENİ: KELİME AVI (A4 BASKI)
                // =========================================================
                else if (madde.konu === "Kelime Avı (Sözcük Bulmaca)") {
                    let girilenMetin = madde.gridMetinleri[0] || "";
                    let lScale = (madde.genelScale || 100) / 100;

                    let icerikHtml = kelimeAviOlustur(girilenMetin, madde);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 400 * lScale; 
                }

                // =========================================================
                // YENİ: ŞİFRELİ MESAJ (A4 BASKI)
                // =========================================================
                else if (madde.konu === "Şifreli Mesaj (Gizli Cümle)") {
                    let girilenMetin = madde.gridMetinleri[0] || "";
                    let lScale = (madde.genelScale || 100) / 100;

                    let icerikHtml = kriptogramOlustur(girilenMetin, madde, madde.soruTipi);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    kutuBoyu = 300 * lScale; // İhtiyaca göre kendiliğinden ayarlanır
                }

                else if (madde.soruTipi === "Okuduğunu Boyama/Tamamlama") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let metin = madde.gridMetinleri[0] || "";
                    let resim = madde.baslangicResmi || "";
                    let detaylar = madde.detaylar || [];
                    let icerikHtml = okudugunuBoyamaOlustur(metin, resim, detaylar);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    let satirSayisi = metin ? metin.split('\n').filter(l => l.trim() !== '').length : 1;
                    
                    // ZEKÂ: Görsel solda veya sağdaysa yükseklikten muazzam tasarruf edilir!
                    if (detaylar.includes("Görsel Solda") || detaylar.includes("Görsel Sağda")) {
                        kutuBoyu = Math.max(200, (satirSayisi * 50) + 40) * lScale; 
                    } else {
                        kutuBoyu = (300 + (satirSayisi * 45)) * lScale;
                    }
                }

                else if (madde.soruTipi === "Mantıksal İşaretleme") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let metin = madde.gridMetinleri[0] || "";
                    let detaylar = madde.detaylar || [];
                    let icerikHtml = mantiksalIsaretlemeOlustur(metin, madde.gridResimleri, detaylar);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    let satirSayisi = metin ? metin.split('\n').filter(l => l.trim() !== '').length : 1;
                    
                    // ZEKÂ: Görsel solda veya sağdaysa 2x2 kare dizileceği için kutu yüksekliğini garantiye alıyoruz
                    if (detaylar.includes("Görsel Solda") || detaylar.includes("Görsel Sağda")) {
                        kutuBoyu = Math.max(300, (satirSayisi * 40) + 40) * lScale; 
                    } else {
                        kutuBoyu = (260 + (satirSayisi * 30)) * lScale;
                    }
                }

                else if (madde.konu === "Hikaye Kurgusu ve Analiz" && madde.soruTipi === "Olay Sıralama") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let metin = madde.gridMetinleri[0] || "";
                    let icerikHtml = olaySiralamaOlustur(metin, madde);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    let satirSayisi = metin ? metin.split('\n').filter(l => l.trim() !== '').length : 1;
                    kutuBoyu = (satirSayisi * 80) * lScale;
                }

                else if (madde.konu === "Hikaye Kurgusu ve Analiz" && madde.soruTipi === "Kelime Avcısı (Boşluk Doldurma)") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let metin = madde.gridMetinleri[0] || "";
                    let icerikHtml = kelimeAvcisiBoslukOlustur(metin, madde);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    // Kelime bankası ve satırlar için dinamik yükseklik hesabı
                    let satirSayisi = metin ? metin.split('\n').filter(l => l.trim() !== '').length : 1;
                    kutuBoyu = (130 + (satirSayisi * 65)) * lScale;
                }

                else if (madde.konu === "Metin İçi Mantık" && madde.soruTipi === "Doğru mu, Yanlış mı?") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let parca = madde.gridMetinleri[0] || "";
                    let yargilar = madde.gridMetinleri[1] || "";
                    let icerikHtml = dogruMuYanlisMiOlustur(parca, yargilar);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    // Boyu zekice hesaplayalım: Okuma parçası alanı + Yargı satırları
                    let parcaSatir = parca ? parca.split('\n').length : 0;
                    let ySatir = yargilar ? yargilar.split('\n').filter(l => l.trim() !== '').length : 1;
                    kutuBoyu = ((parcaSatir * 40) + 80 + (ySatir * 60)) * lScale;
                }

                else if (madde.konu === "Metin İçi Mantık" && madde.soruTipi === "5N1K ve Çoktan Seçmeli") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let parca = madde.gridMetinleri[0] || "";
                    let soru = madde.gridMetinleri[1] || "";
                    let icerikHtml = besNBirKOlustur(parca, soru, madde.gridResimleri);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    let parcaSatir = parca ? parca.split('\n').length : 0;
                    // Eğer resim varsa kutu yüksekliğini test şıklarına göre, yoksa boşluk çizgisine göre ayarla
                    let eklentiBoyu = (madde.gridResimleri && (madde.gridResimleri[0] || madde.gridResimleri[1] || madde.gridResimleri[2])) ? 240 : 130;
                    kutuBoyu = ((parcaSatir * 40) + eklentiBoyu) * lScale;
                }

                else if (madde.konu === "Okuma ve Yazma Pratiği" && madde.soruTipi === "Okuyalım Yazalım") {
                    let lScale = (madde.genelScale || 100) / 100;
                    let baslik = madde.gridMetinleri[0] || "";
                    let metin = madde.gridMetinleri[1] || "";
                    let sSayisi = parseInt(madde.gridMetinleri[2]) || 6;
                    
                    let icerikHtml = okuyalimYazalimOlustur(baslik, metin, sSayisi);
                    
                    cizgiIcerigi = `
                    <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding-top: 10px;">
                        <div style="transform: scale(${lScale}); transform-origin: top center; width: 100%; position: relative; display:flex; justify-content:center;">
                            ${icerikHtml}
                        </div>
                    </div>`;
                    
                    let metinSatir = metin ? metin.split('\n').length : 0;
                    // Başlık (40px) + Metin satırları (30px) + Boşluklar (60px) + Çizgiler (sSayisi * 60px)
                    kutuBoyu = (100 + (metinSatir * 30) + (sSayisi * 60)) * lScale;
                }









                else {
                    cizgiIcerigi = cizgiKutuphanesi[cizgiAdi] || `<div style="width:100%; height:100%; border:2px dashed #bdc3c7; border-radius:8px; display:flex; align-items:center; justify-content:center;">[ Görsel Eklenecek ]</div>`;
                }
                
                let rotasyonFonksiyonu = (madde.detaylar && madde.detaylar.includes("Dikey Yönde")) ? "rotate(90deg)" : "";
                let gScale = (madde.genelScale || 100) / 100;
                let gX = madde.genelX || 0; let gY = madde.genelY || 0;
                let gercekKutuBoyu = kutuBoyu * gScale; 
                
                soruAlani.innerHTML += `
                    <div style="${anaKapsayiciStil}">
                    ${soruMetniHtml}
                    <div style="height: ${gercekKutuBoyu}px; width: 100%;">
                        <div style="transform: translate(${gX}px, ${gY}px) scale(${gScale}) ${rotasyonFonksiyonu}; transform-origin: left top; width: 100%; height: 100%; display: flex; align-items: center; justify-content: flex-start;">
                            ${cizgiIcerigi}
                        </div>
                    </div>
                </div>`;
            }

            
            
        });

        

        

        setTimeout(() => {
            let uyari = document.getElementById('genel-tasma-uyarisi');
            if (uyari) uyari.style.display = 'none'; 
            
            // YENİ: Kağıt ekrana basıldığı an bizim efsanevi çizim motoru devreye girip okları çizer!
            if (typeof akilliRotalariCiz === "function") {
                akilliRotalariCiz();
            }
        }, 150);
    
    }

                function nesneSayisiDegistir(index, yeniSayi) {
                    kagitIcerigi[index].nesneSayisi = parseInt(yeniSayi);
                    document.getElementById(`sayi-deger-${index}`).innerText = `${yeniSayi} Adet`; 
                    kagidiCiz(); 
                }

                function kapsayiciGenislikDegisti(index, val) {
        kagitIcerigi[index].genislik = parseInt(val);
        kagidiCiz();
    }

                // --- 6. SERBEST ÇİZİM (CANVAS) MOTORU ---
                let cizimYapiyorMu = false;
                let anlikCizimYolu = ""; 

                // --- SİSTEM İLK AÇILIŞ (BAŞLATMA) MOTORU ---
                document.addEventListener('DOMContentLoaded', () => {
                    // Zengin metin menülerini süslü kütüphane ile doldur
                    let zTem = document.getElementById('zengin-tema-secimi');
                    let zStil = document.getElementById('zengin-stil-secimi');
                    if(zTem) zTem.innerHTML = '<option value="yok">❌ Yok (Çerçevesiz)</option>' + secimMenuHTML('', 'tema');
                    if(zStil) zStil.innerHTML = '<option value="yok">❌ Yok (Çerçevesiz)</option>' + secimMenuHTML('', 'stil');

                    // YENİ: Ayar panelini (nesne yükleme) Önizleme kutusunun üstüne taşır!
                    const yuklemeAlani = document.getElementById('nesne-yukleme-alani');
                    const ornekAlani = document.getElementById('ornek-gorsel-alani');
                    if(yuklemeAlani && ornekAlani) {
                        ornekAlani.parentNode.insertBefore(yuklemeAlani, ornekAlani);
                    }

                    setTimeout(() => {
                        const sinifKutusu = document.getElementById('sinif-secimi');
                        if (sinifKutusu) {
                            sinifKutusu.selectedIndex = 0; 
                            sinifDegisti(); 
                        }
                        kagidiCiz(); 
                        
                        let dersMenus = document.getElementById('ders-secimi');
                        if (dersMenus) {
                            dersMenus.addEventListener('change', () => {
                                if (kagitIcerigi.length === 0) { kagidiCiz(); }
                            });
                        }
                    }, 100); 
                });

                function tahtayiTemizle() {
                    const tahta = document.getElementById('cizim-tahtasi');
                    if(!tahta) return;
                    const ctx = tahta.getContext('2d');
                    ctx.clearRect(0, 0, tahta.width, tahta.height);
                    anlikCizimYolu = ""; 
                }

                // --- 7. YAPAY ZEKA LABİRENT MOTORU (DFS ALGORİTMASI) ---
                function rastgeleLabirentUret(cols, rows) {
                    let grid = [];
                    for (let r = 0; r < rows; r++) {
                        let row = [];
                        for (let c = 0; c < cols; c++) {
                            row.push({top: 1, right: 1, bottom: 1, left: 1, visited: false});
                        }
                        grid.push(row);
                    }

                    let r = 0, c = 0;
                    let stack = [];
                    grid[r][c].visited = true;
                    let unvisited = rows * cols - 1;

                    while (unvisited > 0) {
                        let neighbors = [];
                        if (r > 0 && !grid[r-1][c].visited) neighbors.push({nr: r-1, nc: c, dir: 'T'});
                        if (c < cols-1 && !grid[r][c+1].visited) neighbors.push({nr: r, nc: c+1, dir: 'R'});
                        if (r < rows-1 && !grid[r+1][c].visited) neighbors.push({nr: r+1, nc: c, dir: 'B'});
                        if (c > 0 && !grid[r][c-1].visited) neighbors.push({nr: r, nc: c-1, dir: 'L'});

                        if (neighbors.length > 0) {
                            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                            stack.push({r, c});
                            if (next.dir === 'T') { grid[r][c].top = 0; grid[next.nr][next.nc].bottom = 0; }
                            if (next.dir === 'R') { grid[r][c].right = 0; grid[next.nr][next.nc].left = 0; }
                            if (next.dir === 'B') { grid[r][c].bottom = 0; grid[next.nr][next.nc].top = 0; }
                            if (next.dir === 'L') { grid[r][c].left = 0; grid[next.nr][next.nc].right = 0; }
                            r = next.nr; c = next.nc;
                            grid[r][c].visited = true;
                            unvisited--;
                        } else if (stack.length > 0) {
                            let prev = stack.pop();
                            r = prev.r; c = prev.c;
                        } else {
                            break;
                        }
                    }

                    grid[0][0].left = 0; 
                    grid[rows-1][cols-1].right = 0; 

                    let path = "";
                    let w = 15; 
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            let x = col * w; let y = row * w;
                            if (grid[row][col].top) path += `M ${x},${y} L ${x+w},${y} `;
                            if (grid[row][col].right) path += `M ${x+w},${y} L ${x+w},${y+w} `;
                            if (grid[row][col].bottom) path += `M ${x},${y+w} L ${x+w},${y+w} `;
                            if (grid[row][col].left) path += `M ${x},${y} L ${x},${y+w} `;
                        }
                    }
                    return { path: path, width: cols*w, height: rows*w };
                }

                

                function soruyuCogalt(index) {
                    durumuKaydet(); 
                    let orijinalSoru = kagitIcerigi[index];
                    let kopyaSoru = JSON.parse(JSON.stringify(orijinalSoru)); 
                    kopyaSoru.id = Date.now() + Math.random();
                    kagitIcerigi.splice(index + 1, 0, kopyaSoru);
                    arayuzuGuncelle();
                }

                // --- 8. LABİRENT ÖZEL AYAR MOTORLARI (AKILLI PANEL) ---
                function labirentSekmeDegisti(index, sekme) {
                    kagitIcerigi[index].labSekme = sekme;
                    listeyiCiz(); 
                }

                function labirentBoyutDegisti(index, deger) {
                    let sekme = kagitIcerigi[index].labSekme || 'tumu';
                    let val = parseInt(deger);
                    
                    if (sekme === 'tumu') kagitIcerigi[index].lScale = val;
                    else if (sekme === 'arkaplan') kagitIcerigi[index].bgBoyut = val; 
                    else if (sekme === 'baslangic_hepsi') {
                        for(let i=0; i<5; i++) kagitIcerigi[index].bBoyut[i] = val;
                    }
                    else if (sekme === 'bitis_hepsi') {
                        for(let i=0; i<5; i++) kagitIcerigi[index].sBoyut[i] = val;
                    }
                    else if (sekme.startsWith('baslangic_')) {
                        let idx = parseInt(sekme.split('_')[1]);
                        kagitIcerigi[index].bBoyut[idx] = val;
                    }
                    else if (sekme.startsWith('bitis_')) {
                        let idx = parseInt(sekme.split('_')[1]);
                        kagitIcerigi[index].sBoyut[idx] = val;
                    }
                    
                    document.getElementById(`labirent-deger-${index}`).innerText = (sekme === 'tumu') ? `%${deger}` : `${deger}px`; 
                    kagidiCiz(); 
                }

                function labirentKonumDegisti(index, eksen, miktar) {
                    let sekme = kagitIcerigi[index].labSekme || 'tumu';
                    if (sekme === 'tumu') {
                        if (eksen === 'x') kagitIcerigi[index].lX = (kagitIcerigi[index].lX || 0) + miktar;
                        if (eksen === 'y') kagitIcerigi[index].lY = (kagitIcerigi[index].lY || 0) + miktar;
                    } else if (sekme === 'arkaplan') { 
                        if (eksen === 'x') kagitIcerigi[index].bgX = (kagitIcerigi[index].bgX || 0) + miktar;
                        if (eksen === 'y') kagitIcerigi[index].bgY = (kagitIcerigi[index].bgY || 0) + miktar;
                    } else if (sekme === 'baslangic_hepsi') {
                        for(let i=0; i<5; i++) {
                            if (eksen === 'x') kagitIcerigi[index].bX[i] = (kagitIcerigi[index].bX[i] || 0) + miktar;
                            if (eksen === 'y') kagitIcerigi[index].bY[i] = (kagitIcerigi[index].bY[i] || 0) + miktar;
                        }
                    } else if (sekme === 'bitis_hepsi') {
                        for(let i=0; i<5; i++) {
                            if (eksen === 'x') kagitIcerigi[index].sX[i] = (kagitIcerigi[index].sX[i] || 0) + miktar;
                            if (eksen === 'y') kagitIcerigi[index].sY[i] = (kagitIcerigi[index].sY[i] || 0) + miktar;
                        }
                    } else if (sekme.startsWith('baslangic_')) {
                        let idx = parseInt(sekme.split('_')[1]);
                        if (eksen === 'x') kagitIcerigi[index].bX[idx] = (kagitIcerigi[index].bX[idx] || 0) + miktar;
                        if (eksen === 'y') kagitIcerigi[index].bY[idx] = (kagitIcerigi[index].bY[idx] || 0) + miktar;
                    } else if (sekme.startsWith('bitis_')) {
                        let idx = parseInt(sekme.split('_')[1]);
                        if (eksen === 'x') kagitIcerigi[index].sX[idx] = (kagitIcerigi[index].sX[idx] || 0) + miktar;
                        if (eksen === 'y') kagitIcerigi[index].sY[idx] = (kagitIcerigi[index].sY[idx] || 0) + miktar;
                    }
                    kagidiCiz();
                }

                // --- 9. DİNAMİK SATIR ARALIĞI VE MİZANPAJ MOTORU ---
                function satirBosluguMenusunuGuncelle() {
                    const select = document.getElementById('satir-boslugu-hedef');
                    if (!select) return;
                    const seciliDeger = select.value; 

                    select.innerHTML = '<option value="tumu">🌐 Tüm Kağıdın Aralığı</option>';
                    
                    kagitIcerigi.forEach((madde, index) => {
                        select.innerHTML += `<option value="${index}">📄 Soru ${index + 1} Alt Boşluğu</option>`;
                    });
                    
                    if (seciliDeger === 'tumu' || parseInt(seciliDeger) < kagitIcerigi.length) {
                        select.value = seciliDeger;
                    } else {
                        select.value = 'tumu';
                    }
                }

                function satirBosluguHedefDegisti() {
                    const select = document.getElementById('satir-boslugu-hedef');
                    const slider = document.getElementById('satir-boslugu');
                    if (!select || !slider) return;
                    
                    const hedef = select.value;
                    if (hedef === 'tumu') {
                        slider.value = genelSatirBoslugu;
                    } else {
                        const idx = parseInt(hedef);
                        slider.value = kagitIcerigi[idx].bosluk !== undefined ? kagitIcerigi[idx].bosluk : genelSatirBoslugu;
                    }
                }

                function satirBosluguAyarla(deger) {
                    const select = document.getElementById('satir-boslugu-hedef');
                    if (!select) return;
                    
                    const hedef = select.value;
                    const v = parseInt(deger);
                    
                    if (hedef === 'tumu') {
                        genelSatirBoslugu = v;
                        kagitIcerigi.forEach(madde => {
                            madde.bosluk = v;
                        });
                    } else {
                        const idx = parseInt(hedef);
                        if (kagitIcerigi[idx]) {
                            kagitIcerigi[idx].bosluk = v; 
                        }
                    }

                    
                    kagidiCiz(); 

                    
                }

                // ==============================================================
                // YENİ: ZENGİN METİN (WORD) MOTORU KONTROLCÜSÜ
                // ==============================================================

                // 1. Arayüzü gizle/göster animasyonu
                function metinMotorunuGecisYap() {
                    const kapsayici = document.getElementById('gelismis-metin-motoru-kapsayici');
                    const alan = document.getElementById('zengin-metin-alani');
                    const btn = document.getElementById('metin-motoru-btn');
                    const btnEkle = document.getElementById('metin-ekle-btn');
                    
                    let acikMi = alan.style.display === "block";
                    let solSutun = kapsayici.parentElement;
                    
                    Array.from(solSutun.children).forEach(child => {
                        if (child !== kapsayici) {
                            child.style.display = acikMi ? "" : "none"; 
                        }
                    });

                    if (acikMi) {
                        // Motoru Kapatma Durumu
                        alan.style.display = "none";
                        btn.style.display = "block"; 
                        
                        duzenlenenMetinIndex = null;
                        document.getElementById('gelismis-editor').innerHTML = "";
                        
                        // YENİ: Kapanırken seçimleri sıfırla
                        let zTem = document.getElementById('zengin-tema-secimi');
                        let zStil = document.getElementById('zengin-stil-secimi');
                        if(zTem) zTem.value = "yok";
                        if(zStil) zStil.value = "yok";

                        if(btnEkle) {
                            btnEkle.innerHTML = "➕ Yazıyı Kâğıda Bas";
                            btnEkle.style.background = "#2ecc71"; // Geri yeşil yap
                        }
                        
                        if (typeof konuDegisti === "function") konuDegisti(); 
                    } else {
                        // Motoru Açma Durumu
                        alan.style.display = "block";
                        btn.style.display = "none"; 
                        document.getElementById('gelismis-editor').focus(); 
                    }
                }

                // 2. Word Komutlarını İşleyen Format Motoru
                function metinFormatla(komut, deger = null) {
                    document.execCommand(komut, false, deger);
                    document.getElementById('gelismis-editor').focus();
                }

                function zenginMetinBoslukDegisti(index, val) {
                    kagitIcerigi[index].bosluk = parseInt(val);
                    kagidiCiz();
                }

                function zenginMetinSablonDegisti(index, val) {
                    kagitIcerigi[index].ders = val;
                    kagidiCiz();
                }

                // Hangi metnin düzenlendiğini akılda tutan hafıza
                let duzenlenenMetinIndex = null;

                // Orta Sütundan Tetiklenen Düzenleme Fonksiyonu
                function metniDuzenle(index) {
                    let zenginAlan = document.getElementById('zengin-metin-alani');
                    let zenginEditor = document.getElementById('gelismis-editor');
                    let btnEkle = document.getElementById('metin-ekle-btn');
                    
                    duzenlenenMetinIndex = index;
                    
                    // Asıl metni ve ÇERÇEVE ayarlarını geri yükle
                    zenginEditor.innerHTML = kagitIcerigi[index].icerik;
                    
                    let zTem = document.getElementById('zengin-tema-secimi');
                    let zStil = document.getElementById('zengin-stil-secimi');
                    let zRenk = document.getElementById('zengin-renk-secimi');
                    
                    if(zTem) zTem.value = kagitIcerigi[index].zenginTema || "yok";
                    if(zStil) zStil.value = kagitIcerigi[index].zenginStil || "yok";
                    if(zRenk && kagitIcerigi[index].renk) zRenk.value = kagitIcerigi[index].renk;
                    
                    if (zenginAlan.style.display !== "block") {
                        metinMotorunuGecisYap(); 
                    }
                    
                    if(btnEkle) {
                        btnEkle.innerHTML = "🔄 Değişiklikleri Kaydet";
                        btnEkle.style.background = "#f39c12"; 
                    }
                    
                    zenginEditor.focus();
                }
                function zenginMetinEbatDegisti(index, eksen, val) {
        if (eksen === 'w') kagitIcerigi[index].metinGenislik = parseInt(val);
        if (eksen === 'h') kagitIcerigi[index].metinYukseklik = parseInt(val);
        
        // Değerleri Orta Sütunda canlı olarak gösterelim (Oto veya PX formatında)
        let gosterge = document.getElementById(`zengin-ebat-${eksen}-${index}`);
        if (gosterge) {
            gosterge.innerText = (eksen === 'w') ? `%${val}` : (val === "0" ? "Oto" : `${val}px`);
        }
        
        kagidiCiz();
    }

    // --- YENİ: SÜTUN GEÇİŞ TETİKLEYİCİSİ ---
    function sayfaSablonuDegisti() {
        let sutunAyar = document.getElementById('sayfa-sutun-ayari').value;
        let yayineviKutusu = document.getElementById('yayinevi-kutusu');
        
        // Sadece "2 sütun" seçiliyse yayınevi metin kutusunu göster
        if (sutunAyar === "2") {
            yayineviKutusu.style.display = "block";
        } else {
            yayineviKutusu.style.display = "none";
        }
        
        kagidiCiz(); // Kağıdı yeni formata göre tekrar çiz
    }

    function harfSayisiDegistir(index, yeniAdet) {
        kagitIcerigi[index].harfSayisi = parseInt(yeniAdet);
        document.getElementById(`harfsayisi-deger-${index}`).innerText = parseInt(yeniAdet) === 0 ? "Otomatik" : `${yeniAdet} Adet`; 
        kagidiCiz(); 
    }

    // ==============================================================
    // YENİ: HIZLI "BOŞ KILAVUZ SATIR" EKLEME MOTORU
    // ==============================================================
    function bosKilavuzSatirEkle() {
        durumuKaydet(); // Geri alabilmek için hafızaya at
        
        const sinifSecimi = document.getElementById('sinif-secimi') ? document.getElementById('sinif-secimi').value : '';
        const dersSecimi = document.getElementById('ders-secimi') ? document.getElementById('ders-secimi').value : 'ilkokuma';
        const uniteSecimi = document.getElementById('unite-secimi') ? document.getElementById('unite-secimi').value : '';
        
        kagitIcerigi.push({
            id: Date.now() + Math.random(),
            tip: "ilkokuma",
            sinif: sinifSecimi, 
            ders: dersSecimi, 
            unite: uniteSecimi || "Okuma Yazma", 
            konu: "Boş Satır", 
            kisaKonu: "Boş Kılavuz",
            detaylar: ["Kılavuz Çizgi Ekle"], // Bu şifre sayesinde direkt kılavuz satırı çizilecek
            bosluk: genelSatirBoslugu,
            
            // Gerekli boş veriler (Hata vermemesi için)
            bX: [0], bY: [0], sX: [0], sY: [0],
            bBoyut: [40], sBoyut: [40],
            genelScale: 100, genelX: 0, genelY: 0,
            lX: 0, lY: 0, lScale: 100, bgX: 0, bgY: 0, bgBoyut: 600,
            labPath: "", lW: 0, lH: 0, labirentSatir: 10
        });
        
        arayuzuGuncelle();
    }

// ============================================================================
// YENİ EKLENTİ: AKILLI HARF ROTALARI (BBox DNA MOTORU - V4 MEB İSTİSNA SÖZLÜKLÜ)
// ============================================================================
function akilliRotalariCiz() {
    const kapsayicilar = document.querySelectorAll('.akilli-rota-kapsayici');
    
    // 🐇 ŞAPKADAN ÇIKAN TAVŞAN: MEB Pedagojik İstisna Sözlüğü
    // Sistem zincir (uç uca nokta) yakalasa bile, bu harflerdeki bu düğümlerde (node) kalemi ZORLA kaldırır!
    const mebIstisnalari = {
        'B': [5], // B'nin üst göbeği ile alt göbeği 5 numaralı noktada birleşir. Buradan kopar.
        'm': [3]  // m'nin birinci tümseği ile ikinci tümseği 3 numaralı noktada birleşir. Buradan kopar.
    };

    kapsayicilar.forEach(kapsayici => {
        let harf = kapsayici.getAttribute('data-harf');
        let textEl = kapsayici.querySelector('.rota-hedef-metin');
        let cizimKatmani = kapsayici.querySelector('.rota-cizim-katmani');

        if (!textEl || !cizimKatmani) return;

        let rotaVerisi = typeof harfRotalari !== 'undefined' ? harfRotalari[harf] : null;
        if (!rotaVerisi) return; 

        let bbox = textEl.getBBox();
        let pathHTML = "";

        let gercekHamleSayisi = 1;
        let sonBitisNoktasi = null;

        let gercekFontBoyutu = parseFloat(textEl.style.fontSize) || 250;
        let kavisOlcekCarpani = gercekFontBoyutu / 400;

        rotaVerisi.strokes.forEach((stroke, index) => {
            let basId = stroke[0];
            let bitId = stroke[1];
            let bend = stroke[2] || 0;

            let sP = rotaVerisi.anchors[basId];
            let eP = rotaVerisi.anchors[bitId];

            if(!sP || !eP) return;

            let x1 = bbox.x + (bbox.width * sP[0]);
            let y1 = bbox.y + (bbox.height * sP[1]);
            let x2 = bbox.x + (bbox.width * eP[0]);
            let y2 = bbox.y + (bbox.height * eP[1]);

            let d = "";
            let bitisAcisi = 0;

            let gercekBend = bend * kavisOlcekCarpani;

            if (gercekBend === 0) {
                d = `M ${x1} ${y1} L ${x2} ${y2}`;
                bitisAcisi = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            } else {
                let midX = (x1 + x2) / 2;
                let midY = (y1 + y2) / 2;
                let dx = x2 - x1;
                let dy = y2 - y1;
                let len = Math.sqrt(dx * dx + dy * dy);
                let nx = -dy / len;
                let ny = dx / len;
                
                let cx = midX + nx * gercekBend;
                let cy = midY + ny * gercekBend;
                
                d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
                bitisAcisi = Math.atan2(y2 - cy, x2 - cx) * (180 / Math.PI);
            }

            pathHTML += `<path d="${d}" fill="none" stroke="#e74c3c" stroke-width="3.5" stroke-dasharray="8,6" stroke-linecap="round" />`;

            // =========================================================
            // ZİNCİR VE "MEB İSTİSNA" KONTROLÜ
            // =========================================================
            
            let buYeniBirHamleMi = (basId !== sonBitisNoktasi);

            // ⚡ MAKSİMUM ZEKÂ: Eğer bu nokta istisna sözlüğündeyse, matematiksel zinciri ez ve yeni hamle say!
            if (mebIstisnalari[harf] && mebIstisnalari[harf].includes(basId)) {
                buYeniBirHamleMi = true;
            }

            if (buYeniBirHamleMi) {
                pathHTML += `<g transform="translate(${x1}, ${y1})">
                                <circle cx="0" cy="0" r="10" fill="#e74c3c" stroke="#fff" stroke-width="2" />
                                <text x="0" y="4" fill="#fff" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">${gercekHamleSayisi}</text>
                             </g>`;
                gercekHamleSayisi++; 
            }

            let sonrakiStroke = rotaVerisi.strokes[index + 1];
            let buHamleninSonuMu = true;

            if (sonrakiStroke && sonrakiStroke[0] === bitId) {
                // Sonraki stroke benden devam ediyor. AMA ya sonraki stroke'un başlama noktası bir "istisna" ise?
                if (mebIstisnalari[harf] && mebIstisnalari[harf].includes(sonrakiStroke[0])) {
                    buHamleninSonuMu = true; // Zinciri ZORLA koparttık, buraya oku yapıştır!
                } else {
                    buHamleninSonuMu = false; // Normal şekilde sarmaya devam et
                }
            }

            if (buHamleninSonuMu) {
                pathHTML += `<g transform="translate(${x2}, ${y2}) rotate(${bitisAcisi})">
                                <polygon points="0,0 -12,-6 -12,6" fill="#e74c3c" />
                             </g>`;
            }

            sonBitisNoktasi = bitId;
        }); // rotaVerisi döngüsünü kapatır

        cizimKatmani.innerHTML = pathHTML; // Çizimi ekrana basar
    }); // kapsayicilar döngüsünü kapatır
} // akilliRotalariCiz fonksiyonunu kapatır

// ==============================================================
// FİNAL: PDF KAYDET / YAZDIR MOTORU
// ==============================================================
function yazdir() {
    if (typeof kagitIcerigi !== 'undefined' && kagitIcerigi.length === 0) {
        alert("⚠️ Kağıt tamamen boş! Lütfen yazdırmadan önce sol menüden soru ekleyin.");
        return;
    }
    
    // Tarayıcının varsayılan PDF'e Kaydet / Yazdır penceresini tetikler
    window.print();
}

// YENİ: Sadece ve sadece BİREBİR eşleşen en alt butonu bulur, tıklamanın sıçramasını engeller!
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        let tumElemanlar = document.querySelectorAll('*');
        tumElemanlar.forEach(el => {
            // Sadece yazısı BİREBİR eşleşen ve içinde başka html etiketi olmayan (en saf) butonu bul
            if (el.textContent.trim() === "PDF Kaydet / Yazdır" && el.children.length === 0) {
                el.style.cursor = "pointer";
                el.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // FİX: Tıklamanın üst div'lere (menülere) bulaşmasını KESİN engeller!
                    yazdir();
                };
            }
        });
    }, 500); 
});

// ==============================================================
// YENİ: KUSURSUZ A4 MATBAA (BASKI) CSS MOTORU
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
    const printStili = document.createElement('style');
    printStili.innerHTML = `
        @media print {
            /* 1. Tarayıcı metaverilerini (Tarih, URL, Sayfa No) KÖKÜNDEN SİLER */
            @page {
                size: A4 portrait;
                margin: 0; 
            }
            
            /* 2. Kağıdın etrafındaki grilikleri ve scrollbarı temizle */
            html, body {
                background: #fff !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 210mm;
                height: 297mm;
                overflow: hidden !important;
            }
            
            /* 3. Ekranda ne kadar menü, ayar, buton varsa görünmez yap */
            body * {
                visibility: hidden;
            }
            
            /* 4. SADECE bizim A4 kağıdını ve içindeki soruları görünür yap */
            #calisma-kagidi, #calisma-kagidi * {
                visibility: visible;
            }
            
            /* 5. A4 Kağıdını devasa yapıp sol üst köşeye MÜHÜRLE */
            #calisma-kagidi {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                transform: scale(1) !important; /* Tarayıcının ezip küçültmesini engeller */
                
                /* YENİ: Renklerin matbaada soluk çıkmasını engeller, arka planları zorla basar */
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    `;
    document.head.appendChild(printStili);
});