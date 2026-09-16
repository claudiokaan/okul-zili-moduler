// Okul Zili V3 - Core State
// Belge durumu ve eski/yeni model uyumluluk (legacy resolver) metodlarını içerir.

(function(global) {
    const OkulZiliDocument = {
        
        // Verilen item objesinin 'content' mi yoksa 'question' mu olduğunu güvenle çözer.
        getItemKind: function(item) {
            // 1. Geçersiz input kontrolü (Sistemi çökertmez, güvenli fallback döner)
            if (!item || typeof item !== 'object') {
                return "unknown"; 
            }
            
            // 2. Yeni nesil V3 item kontrolü (Zaten kind atanmışsa direkt dön)
            if (item.kind) {
                return item.kind;
            }
            
            // 3. Eski nesil V2 legacy Zengin Metin kontrolü
            if (item.tip === "zengin-metin") {
                return "content";
            }
            
            // 4. Diğer tüm eski V2 legacy objeler varsayılan olarak sorudur
            return "question";
        }

    };

    // Global erişime (window) kontrollü olarak aç
    global.OkulZiliDocument = OkulZiliDocument;

})(typeof window !== 'undefined' ? window : this);