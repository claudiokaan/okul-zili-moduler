// Okul Zili V3 - Shared Text Utils
// Metin temizleme ve düzenleme araçları.

function turkceTemizle(metin) {
    if(!metin) return "";
    let harfler = { "ç":"c", "ğ":"g", "ı":"i", "i":"i", "ö":"o", "ş":"s", "ü":"u", "Ç":"C", "Ğ":"G", "İ":"I", "Ö":"O", "Ş":"S", "Ü":"U" };
    return metin.replace(/[çğıiöşüÇĞİÖŞÜ]/g, m => harfler[m]).toLowerCase().trim();
}

// Global erişim garantisi
window.turkceTemizle = turkceTemizle;