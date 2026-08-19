# IRON WARS — REBUILD v4

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

## v2
Daha karanlık/sinematik ışık, radar, askeri kuleler, pist, hangarlar, liman iskeleleri, üs duvarları, sokak lambaları, kasalar ve daha detaylı askeri sahne eklendi.

## v4
Cache-busting eklendi: `style.css?v=21` ve `game.js?v=21`. Ekranda ayrıca küçük `v4` rozeti görünür; böylece GitHub Pages'in yeni sürümü açtığı hemen anlaşılır.

## v4 görsel yükseltme
- Daha karanlık/sinematik gece atmosferi
- Prosedürel asfalt dokusu ve yol şeritleri
- Pist ve pist ışıkları
- Gözetleme kuleleri
- Yakıt tankları
- Daha fazla fabrika bacası
- Savunma bariyerleri ve çitler
- Daha detaylı 3D tanklar
- Daha detaylı helikopter + projektör
- Limanda hareket eden savaş gemileri
- Beton servis alanları
- Üs içi daha yoğun ışıklandırma
- Çalışan ekonomi ve bina tıklama sistemi korunur

Not: v4 hâlâ tamamen tarayıcı içinde prosedürel 3D model üretir; dışarıdan ağır model paketi gerektirmez.

## v4 performans optimizasyonları
- Mobilde render pixel ratio düşürüldü.
- Antialias kapatıldı.
- Gölge haritası 2048 -> 1024, mobilde 768.
- PCFSoftShadow yerine daha ucuz PCFShadow.
- Ağaç sayısı azaltıldı.
- Duman parçacıkları azaltıldı.
- Tank sayısı 5 -> 3.
- Kasalar 18 -> 10.
- Çok sayıda PointLight kaldırılıp emissive mesh ile değiştirildi.
- Pist ışıkları gerçek ışık yerine düşük maliyetli emissive obje.
- Deniz geometri güncellemesi her frame yerine her 3 frame.
- Sekme arka plandaysa render güncellemeleri duraklatılır.
- V3 askeri görünümü mümkün olduğunca korunur.
