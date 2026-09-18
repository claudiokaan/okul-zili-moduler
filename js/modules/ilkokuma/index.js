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
        },
        buildEditor: function(context) {
            // context.container -> Özelliklerin basılacağı DOM elementi
            if (!context || !context.container) return;

            // data.js'den global verileri çek
            const varyasyonlar = window.harfSoruTipleri ? (window.harfSoruTipleri["Harf Yazımı"] || []) : [];
            const zitliklar = window.evrenselZitliklar || [];

            let sonGrupIdx = -1;

            varyasyonlar.forEach((ozellik, idx) => {
                let akimGrupIdx = -1;
                zitliklar.forEach((grup, gIdx) => {
                    if (grup.includes(ozellik)) akimGrupIdx = gIdx;
                });

                // Kılavuz Çizgi Ekle'den önce dashed çizgi
                if (ozellik === "Kılavuz Çizgi Ekle") {
                    const ayirici = document.createElement('div');
                    ayirici.style.width = "100%";
                    ayirici.style.borderTop = "1px dashed #b2bec3";
                    ayirici.style.margin = "10px 0 10px 0";
                    context.container.appendChild(ayirici);
                }
                // Normal zıtlık grupları arasındaki düz çizgi
                else if (idx > 0 && akimGrupIdx !== sonGrupIdx && akimGrupIdx !== -1 && sonGrupIdx !== -1) {
                    const ayiriciCizgi = document.createElement('div');
                    ayiriciCizgi.style.width = "100%";
                    ayiriciCizgi.style.borderTop = "1.5px solid #b2bec3";
                    ayiriciCizgi.style.margin = "12px 0 12px 0";
                    context.container.appendChild(ayiriciCizgi);
                }

                if (akimGrupIdx !== -1) sonGrupIdx = akimGrupIdx;

                const div = document.createElement('div');
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.marginBottom = "6px";
                div.innerHTML = `<input type="checkbox" name="ozellik" value="${ozellik}" onchange="varyasyonKontrol(this); basligiGuncelle(); nesneYuklemeAlaniniGuncelle();" style="width: auto; margin: 0 8px 0 0; cursor: pointer;"> <span style="font-size:12px; line-height:1.2;">${ozellik}</span>`;
                context.container.appendChild(div);
            });
        }
    });

})(typeof window !== 'undefined' && window.OkulZiliRegistry ? window.OkulZiliRegistry : null);