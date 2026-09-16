// Okul Zili V3 - Core Registry
// Modüler mimari için soru tiplerinin kaydedildiği merkezi depo.

(function(global) {
    // Tüm kayıtların tutulduğu gizli obje (Dışarıdan doğrudan erişilemez)
    const _items = {};

    const OkulZiliRegistry = {
        
        // Yeni bir soru tipini sisteme kaydeder
        register: function(definition) {
            // 1. Definition bir obje mi kontrolü
            if (!definition || typeof definition !== 'object') {
                console.error("Registry: Gecersiz kayit. Tanimi yapilan modul bir obje olmalidir.");
                return false;
            }

            // 2. Zorunlu Alanlar: ID ve Name (Boş olmayan string olmalı)
            if (typeof definition.id !== 'string' || definition.id.trim() === '') {
                console.error("Registry: Gecersiz kayit. Modulun 'id' alani bos olmayan bir metin (string) olmalidir.", definition);
                return false;
            }
            if (typeof definition.name !== 'string' || definition.name.trim() === '') {
                console.error("Registry: Gecersiz kayit. Modulun 'name' alani bos olmayan bir metin (string) olmalidir.", definition);
                return false;
            }

            // 3. Duplicate ID Kontrolü (Mevcut davranış korunuyor)
            if (_items[definition.id]) {
                console.warn("Registry: [" + definition.id + "] ID'li modul zaten kayitli. Uzerine yazilmiyor.");
                return false;
            }

            // 4. Opsiyonel Callback Doğrulaması (Eğer verilmişse mutlaka fonksiyon olmalı)
            const optionalCallbacks = [
                'createDefault', 
                'buildEditor', 
                'collectData', 
                'renderPreview', 
                'renderA4', 
                'validate'
            ];

            for (let i = 0; i < optionalCallbacks.length; i++) {
                const cbName = optionalCallbacks[i];
                if (definition[cbName] !== undefined && typeof definition[cbName] !== 'function') {
                    console.error("Registry: Gecersiz kayit. [" + definition.id + "] modulundeki '" + cbName + "' alani bir fonksiyon olmalidir.", definition);
                    return false;
                }
            }

            // Tüm kontrollerden geçti, depoya kaydet
            _items[definition.id] = definition;
            return true;
        },

        // ID'sine göre soru tipini getirir
        get: function(id) {
            return _items[id] || null;
        },

        // Bu ID'ye ait bir kayıt var mı kontrol eder
        has: function(id) {
            return !!_items[id];
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