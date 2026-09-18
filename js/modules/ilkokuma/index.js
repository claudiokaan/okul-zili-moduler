// Okul Zili V3 - İlk Okuma Yazma Soru Tipleri Kaydı

(function(registry) {
    if (!registry) {
        console.error("Registry bulunamadi, ilkokuma modulu yuklenemedi.");
        return;
    }

    // 1. Harf Yazımı
    registry.register({
        id: "ilkokuma.harf_yazimi",
        name: "Harf Yazımı",
        createDefault: function() {
            return {
                fontBoyutu: 80
            };
        }
    });

})(typeof window !== 'undefined' && window.OkulZiliRegistry ? window.OkulZiliRegistry : null);