// Okul Zili V3 - Generic List Manager
// Soru silme, kopyalama ve sürükle-bırak sıralama operasyonları.

(function(global) {

    // --- DRAG STATE ---
    let suruklenenSira = null;

    // --- GENERIC LIST OPERATIONS ---
    function suruklemeyeBasla(e, index) {
        suruklenenSira = index;
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => { e.target.style.opacity = "0.4"; }, 0);
    }

    function suruklemeUstunde(e) { 
        e.preventDefault(); 
        e.dataTransfer.dropEffect = "move"; 
    }
    
    function suruklemeyiBirak(e, hedefIndex) {
        e.preventDefault(); 
        if (suruklenenSira === null || suruklenenSira === hedefIndex) return;
        durumuKaydet(); 
        const suruklenenMadde = kagitIcerigi.splice(suruklenenSira, 1)[0];
        kagitIcerigi.splice(hedefIndex, 0, suruklenenMadde);
        suruklenenSira = null; 
        arayuzuGuncelle();
    }
    
    function suruklemeBitti(e) { 
        e.target.style.opacity = "1"; 
    }
    
    function soruyuSil(index) { 
        durumuKaydet(); 
        kagitIcerigi.splice(index, 1); 
        arayuzuGuncelle(); 
    }

    function soruyuCogalt(index) {
        durumuKaydet(); 
        let orijinalSoru = kagitIcerigi[index];
        let kopyaSoru = JSON.parse(JSON.stringify(orijinalSoru)); 
        kopyaSoru.id = Date.now() + Math.random();
        kagitIcerigi.splice(index + 1, 0, kopyaSoru);
        arayuzuGuncelle();
    }

    // --- GLOBAL ERİŞİM BAĞLANTILARI (LEGACY UYUMLULUK) ---
    global.suruklemeyeBasla = suruklemeyeBasla;
    global.suruklemeUstunde = suruklemeUstunde;
    global.suruklemeyiBirak = suruklemeyiBirak;
    global.suruklemeBitti = suruklemeBitti;
    global.soruyuSil = soruyuSil;
    global.soruyuCogalt = soruyuCogalt;

})(typeof window !== 'undefined' ? window : this);