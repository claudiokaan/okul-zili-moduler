// ============================================================================
// OKUL ZİLİ - AKILLI ÇİZİM MOTORU (RESSAM)
// ============================================================================

const SVG_NS = "http://www.w3.org/2000/svg";
const tahta = document.getElementById('tahta');
const hedefHarf = document.getElementById('hedefHarf');
const cizimKatmani = document.getElementById('cizimKatmani');

function harfiCizdir() {
    let girilenHarf = document.getElementById('harfSecici').value;
    
    // Ekranda harfi güncelle
    hedefHarf.textContent = girilenHarf;
    
    // Eski çizimleri temizle
    cizimKatmani.innerHTML = '';

    // Harita veritabanımızda bu harf var mı?
    let rotaVerisi = harfRotalari[girilenHarf];
    if (!rotaVerisi) {
        alert("Babuş, bu harfin JSON verisi henüz yok: " + girilenHarf);
        return;
    }

    // Harfin güncel ölçülerini (BBox) al!
    let bbox = hedefHarf.getBBox();

    // Veritabanındaki çizgi (stroke) adımlarını sırayla dön
    rotaVerisi.strokes.forEach((stroke, index) => {
        let baslangicNoktaId = stroke[0];
        let bitisNoktaId = stroke[1];
        let yayDegeri = stroke[2] || 0; 

        let startPercent = rotaVerisi.anchors[baslangicNoktaId];
        let endPercent = rotaVerisi.anchors[bitisNoktaId];

        // Oranları, harfin GERÇEK piksel ölçüleriyle çarpıp gerçek koordinatları bul
        let startX = bbox.x + (bbox.width * startPercent[0]);
        let startY = bbox.y + (bbox.height * startPercent[1]);
        
        let endX = bbox.x + (bbox.width * endPercent[0]);
        let endY = bbox.y + (bbox.height * endPercent[1]);

        // Çizimi ekrana bas (Adım numarası index + 1)
        kilavuzYarat(startX, startY, endX, endY, yayDegeri, index + 1);
    });
}

function kilavuzYarat(x1, y1, x2, y2, bend, adimNumarasi) {
    let pathData = "";
    let bitisAcisi = 0; 

    if (bend === 0) {
        // DÜZ ÇİZGİ
        pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
        bitisAcisi = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    } else {
        // KAVİSLİ ÇİZGİ (Bezier)
        let midX = (x1 + x2) / 2;
        let midY = (y1 + y2) / 2;
        let dx = x2 - x1;
        let dy = y2 - y1;
        let len = Math.sqrt(dx * dx + dy * dy);
        
        let nx = -dy / len;
        let ny = dx / len;
        
        let cx = midX + nx * bend;
        let cy = midY + ny * bend;

        pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
        bitisAcisi = Math.atan2(y2 - cy, x2 - cx) * (180 / Math.PI);
    }

    // 1. Kesikli Çizgi
    let path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("class", "kilavuz-cizgi");
    cizimKatmani.appendChild(path);

    // 2. Ok Ucu
    let okGrup = document.createElementNS(SVG_NS, "g");
    okGrup.setAttribute("transform", `translate(${x2}, ${y2}) rotate(${bitisAcisi})`);
    
    let okUcu = document.createElementNS(SVG_NS, "polygon");
    okUcu.setAttribute("points", "0,0 -12,-6 -12,6"); 
    okUcu.setAttribute("class", "ok-ucu");
    okGrup.appendChild(okUcu);
    cizimKatmani.appendChild(okGrup);

    // 3. Numaralı Daire
    let numaraGrup = document.createElementNS(SVG_NS, "g");
    numaraGrup.setAttribute("transform", `translate(${x1}, ${y1})`);
    
    let daire = document.createElementNS(SVG_NS, "circle");
    daire.setAttribute("r", "10");
    daire.setAttribute("class", "numara-daire");
    
    let yazi = document.createElementNS(SVG_NS, "text");
    yazi.textContent = adimNumarasi;
    yazi.setAttribute("text-anchor", "middle");
    yazi.setAttribute("dy", "5"); 
    yazi.setAttribute("class", "numara-yazi");

    numaraGrup.appendChild(daire);
    numaraGrup.appendChild(yazi);
    cizimKatmani.appendChild(numaraGrup);
}

// Yüklenince tetikle
window.onload = () => {
    setTimeout(harfiCizdir, 100); 
};