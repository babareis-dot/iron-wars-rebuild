# IRON WARS RTS DEMO — BIG BUILD

Bu paket önceki küçük prototiplerden bağımsız, daha büyük bir 2D/2.5D RTS demo paketidir.

Özellikler:
- Büyük dokulu çimen arazi
- Ağaç/kaya çevre detayları
- Kompakt üs yerleşimi
- 2 bayrak
- Önde ve hemen arkasında toplam 18 füze
- Ortada araç çıkış koridoru ve Hammer araç
- HQ, Çelik, Bakır, Fuel, Radar, Araç Merkezi ve ek fabrikalar
- Binaya dokunma/tıklama
- Lv.1–25 geliştirme
- Bakır geliştirme maliyeti
- Seviye arttıkça bina sprite boyutu büyür
- 1 dakikalık kaynak üretimi
- Saniyelik üst bar güncellemesi
- Kaynaklar ve seviyeler localStorage ile kayıt
- Mini harita
- Mobil sürükleme + masaüstü zoom
- GitHub Pages uyumlu

Bu demo online değildir. Beğenilirse gerçek sürümde backend, kullanıcı hesabı, dünya koordinatları,
gerçek oyuncu üsleri, savaş ve ittifak sistemi eklenebilir.


## XL Asset Pack
Bu sürüm sadece dosya şişirmek için hazırlanmadı. Gerçek kullanılabilir asset klasörleri eklendi:
- 8 adet 4096x4096 arazi dokusu
- 7 bina tipi x 6 görsel seviye kademesi = 42 bina sprite
- 8 tank görsel sınıfı
- 12 füze görsel sınıfı
- 3 büyük çevre atlası
- building/unit veri JSON dosyaları

Web için 700-800 MB tek yükleme önerilmez. Gerçek ürün sürümünde ağır assetler CDN + lazy loading ile bölünmelidir.
