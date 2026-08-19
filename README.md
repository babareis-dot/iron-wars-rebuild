# IRON WARS — REBUILD v1

Bu proje önceki sürümlerden bağımsız, sıfırdan hazırlanmış gerçek 3D tarayıcı RTS temelidir.

## Artık tek bir arka plan resmi değildir
- Three.js / WebGL gerçek 3D sahne
- Ayrı 3D binalar
- Gerçek hareketli deniz
- Gerçek parçacık dumanı
- Hareket eden 3D tanklar
- Uçan helikopter
- Canlı bina ışıkları
- 3D kamera sürükleme / zoom
- Binalara gerçek raycast ile tıklama
- Mobil ve PC uyumlu

## Ekonomi
Yeni oyuncu:
- Para: 0
- Fuel: 50.000
- Çelik: 100.000
- Bakır: 100.000
- Altın: 25.000

Kaynak binaları 1 dakikalık üretime alınabilir.
Kaynak her saniye canlı eklenir.
Binalar Bakır ile geliştirilir.
Maksimum seviye 25.
Seviye yükseldikçe üretim, maliyet ve geliştirme süresi artar.
Kayıt localStorage ile cihazda tutulur.

## GitHub Pages
Tüm dosyaları repo köküne yükleyin.
Bu proje Three.js'i CDN üzerinden yükler, bu yüzden internet bağlantısı gerekir.

Sonraki aşamalar:
- Gerçek model/texture assetleri
- Tank/uçak/gemi üretim kuyruğu
- Dünya haritası
- PvP ve online hesap/backend
