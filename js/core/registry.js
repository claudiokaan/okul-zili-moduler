// Okul Zili V3 - Core Registry
// Modüler mimari için soru tiplerinin kaydedildiği merkezi depo.

(function(global) {
    // Tüm kayıtların tutulduğu gizli obje (Dışarıdan doğrudan erişilemez)
    const _items = {};

    const OkulZiliRegistry = {
        
        // Yeni bir soru tipini sisteme kaydeder
        register: function(definition) {
            if (!definition) {
                console.error("Registry: Tanimsiz bir modul kaydedilmeye calisildi.");
                return false;
            }
            if (!definition.id) {
                console.error("Registry: Gecersiz kayit. Modulun 'id' alani zorunludur.", definition);
                return false;
            }
            if (_items[definition.id]) {
                console.warn("Registry: [" + definition.id + "] ID'li modul zaten kayitli. Uzerine yazilmiyor.");
                return false; // Çakışma durumunda sessizce üzerine yazmayı reddeder ve uyarır
            }

            _items[definition.id] = definition;
            return true;
        },

        // ID'sine göre soru tipini getirir
        get: function(id) {
            return _items[id] || null; // Bulunamazsa güvenli bir şekilde null döner
        },

        // Bu ID'ye ait bir kayıt var mı kontrol eder
        has: function(id) {
            return !!_items[id]; // true veya false döner
        },

        // Kayıtlı tüm soru tiplerini dizi olarak döndürür
        list: function() {
            return Object.keys(_items).map(function(key) {
                return _items[key];
            });
        }
    };

    // Sistemi global namespace'e (window) güvenli bir şekilde bağla
    global.OkulZiliRegistry = OkulZiliRegistry;

})(typeof window !== 'undefined' ? window : this);