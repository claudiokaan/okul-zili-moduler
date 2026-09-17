// Okul Zili V3 - Menu Manager
// Müfredat ve jenerik menü seçim zincirini yöneten fonksiyonlar.

(function(global) {

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

    // --- GLOBAL ERİŞİM BAĞLANTILARI (LEGACY UYUMLULUK) ---
    global.sinifDegisti = sinifDegisti;
    global.dersDegisti = dersDegisti;
    global.uniteDegisti = uniteDegisti;

})(typeof window !== 'undefined' ? window : this);