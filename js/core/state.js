// Okul Zili V3 - Core State
// Belge durumu ve eski/yeni model uyumluluk (legacy resolver) metodlarını içerir.

(function(global) {
    // --- D3.1: LEGACY DOCUMENT ITEM KIND RESOLVER ---
    const OkulZiliDocument = {
        getItemKind: function(item) {
            if (!item || typeof item !== 'object') {
                return "unknown"; 
            }
            if (item.kind) {
                return item.kind;
            }
            if (item.tip === "zengin-metin") {
                return "content";
            }
            return "question";
        }
    };
    global.OkulZiliDocument = OkulZiliDocument;

    // --- F5.2: DOCUMENT STATE & HISTORY ---
    // Legacy uyumluluk için değişkenleri doğrudan global nesneye (window) bağlıyoruz.
    global.kagitIcerigi = [];
    global.kagitGecmisi = [];
    global.kagitGelecegi = [];

    global.durumuKaydet = function() {
        global.kagitGecmisi.push(JSON.parse(JSON.stringify(global.kagitIcerigi)));
        global.kagitGelecegi = [];
    };

    global.geriAl = function() {
        if (global.kagitGecmisi.length > 0) {
            global.kagitGelecegi.push(JSON.parse(JSON.stringify(global.kagitIcerigi)));
            global.kagitIcerigi = global.kagitGecmisi.pop();
            if (typeof global.arayuzuGuncelle === 'function') {
                global.arayuzuGuncelle();
            }
        }
    };

    global.ileriAl = function() {
        if (global.kagitGelecegi.length > 0) {
            global.kagitGecmisi.push(JSON.parse(JSON.stringify(global.kagitIcerigi)));
            global.kagitIcerigi = global.kagitGelecegi.pop();
            if (typeof global.arayuzuGuncelle === 'function') {
                global.arayuzuGuncelle();
            }
        }
    };

})(typeof window !== 'undefined' ? window : this);