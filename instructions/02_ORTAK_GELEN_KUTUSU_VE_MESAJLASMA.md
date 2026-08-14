# 02 - Ortak Gelen Kutusu ve Mesajlaşma Talimatları

**Ortak Gelen Kutusu (Shared Inbox)**, kliniğinizin resmi WhatsApp numarasına gelen tüm hasta iletişimini tek bir ekrandan, birden fazla temsilcinin eşzamanlı olarak yönetmesini sağlayan ana kumanda merkezidir.

---

## 1. Arayüz Bileşenleri ve Filtreleme

Sohbet ekranı üç ana bölmeden oluşur:

1. **Sol Panel (Sohbet Listesi ve Filtreler)**:
   - **Tüm Sohbetler**: Hesaba gelen tüm açık ve kapalı mesajlaşmalar.
   - **Bana Atananlar**: Oturum açmış olan temsilciye (Agent) atanmış özel sohbetler.
   - **Atanmamış (Unassigned)**: Henüz hiçbir temsilcinin üstlenmediği yeni hasta mesajları.
   - **Kapalı (Closed)**: İşlemi veya tedavisi tamamlanıp kapatılmış sohbet arşivleri.
   - **Arama & Etiket Filtresi**: Hasta adı, telefon numarası veya `[Diş Estetiği]`, `[Acil]`, `[VİP]` gibi etiketlere göre anında arama.

2. **Orta Panel (Aktif Mesaj Akışı)**:
   - Gerçek zamanlı mesajlaşma akışı (Supabase Realtime).
   - Temsilci tarafından verilen yanıtlar, hastadan gelen metin, ses kaydı, görsel ve dokümanlar.
   - **İç Notlar (Internal Notes)**: Sarı renkle vurgulanan ve hastaya gitmeyen, sadece klinik ekibinin görebildiği özel notlar.
   - Mesaj durumu göstergeleri (Tek tık: Gönderildi, Çift tık: Teslim Edildi, Mavi çift tık: Okundu).

3. **Sağ Panel (Hasta Detay Kartı & Hızlı İşlemler)**:
   - Hastanın Adı, Soyadı, Telefon Numarası, E-posta adresi.
   - Atanmış Temsilci değiştirme menüsü.
   - Etiket ekleme/çıkarma.
   - Özel Alanlar (Custom Fields): Örn: *Son Muayene Tarihi*, *Alerjiler*, *Tedavi Türü*.
   - İlgili Tedavi Süreci (Pipeline Deal) bağlantısı ve hızlı fırsat oluşturma düğmesi.

---

## 2. Operasyonel İş Akışları ve Adım Adım Talimatlar

### A. Yeni Gelen Hastayı Karşılama ve Atama
1. Sol panelden **"Atanmamış"** sekmesine tıklayın.
2. Yeni gelen hasta sohbetini seçin.
3. Sağ paneldeki **"Temsilci"** açılır menüsünden sohbeti kendinize veya ilgili klinik danışmanına atayın.
4. Sohbet artık **"Bana Atananlar"** sekmesine taşınır ve diğer temsilciler sohbet üzerinde işlem yapıldığını görür.

### B. Hızlı Yanıt (Quick Reply) Kullanımı
Daha önce tanımlanmış hazır şablon yanıtları kullanmak için:
1. Mesaj yazma kutusuna `/` (bölü işareti) yazın.
2. Açılan listeden kısayol adını seçin (Örn: `/adres`, `/fiyat-liste`, `/mesai-saatleri`).
3. Şablon metni mesaj kutusuna otomatik dolar. Gerekirse düzenleyip **Gönder** düğmesine basın.

### C. Ses Kaydı ve Medya Gönderimi
- **Mikrofon Düğmesi (Opus Recorder)**: Basılı tutarak veya tek tıkla canlı ses kaydı alın ve hastaya doğal ses mesajı olarak iletin.
- **Dosya Ekleme (Ataş İkonu)**: Muayene öncesi fotoğraflar, panoramik röntgen filmleri, PDF tahlil sonuçları veya klinik broşürlerini sürükleyip bırakarak yükleyin.

### D. Etkileşimli Mesaj (Interactive Message) Gönderimi
Hastanın hızlı seçim yapabilmesi için butonlu veya listeli mesajlar gönderin:
1. Mesaj alanındaki **"Etkileşimli Mesaj"** butonuna tıklayın.
2. **Buton Mesajı (Reply Buttons)**: En fazla 3 buton seçeneği tanımlayın (Örn: `[Randevu Al]`, `[Konum İstiyorum]`, `[Müşteri Temsilcisi]`).
3. **Liste Mesajı (List Menu)**: Başlık ve alt seçeneklerden oluşan menü listesi tanımlayın (Örn: Klinik Bölüm Seçimi).

### E. İç Not (Internal Note) Ekleme
Bir hasta hakkında hekime veya diğer vardiyadaki danışmana bilgi bırakmak için:
1. Mesaj kutusunun altındaki **"İç Not"** sekmesine geçin (veya Sarı kilit ikonuna tıklayın).
2. Notunuzu yazın: *Örn: "Hasta yarın saat 14:00 için Dr. Ahmet Bey'e randevu istedi, röntgen çekilecek."*
3. **Not Ekle** düğmesine basın. Bu mesaj hastaya WhatsApp'tan GİTMEZ, sadece panellerde görünür.

---

## 3. Detaylı Kullanım Senaryoları (Use Cases)

### Senaryo 1: Diş Kliniği İlk İletişim ve Muayene Yönlendirmesi
- **Aktörler**: Hasta (Zeynep Hanım), Klinik Temsilcisi (Mehmet Bey).
- **Akış**:
  1. Zeynep Hanım WhatsApp üzerinden *"Zirkonyum kaplama fiyatlarınız nedir?"* mesajı gönderir.
  2. Sistem hastayı otomatik olarak **"Atanmamış"** kutusuna düşürür ve otomasyon karşılama mesajı atar.
  3. Mehmet Bey sohbeti üzerine alır ve sağ panelden `[Zirkonyum]`, `[Yeni Hasta]` etiketlerini ekler.
  4. Mehmet Bey `/zirkonyum-bilgi` kısayolunu kullanarak detaylı tedavi süreç şablonunu iletir.
  5. Hastanın röntgen gönderebilmesi için medya talebinde bulunur.
  6. Görüşme sonunda sağ paneldeki **"Süreç Ekle"** butonuna basarak `[Diş Tedavileri]` pipeline'ına `[Muayene Bekleniyor]` aşamasında 15.000 TL tutarında yeni bir kart açar.

### Senaryo 2: Hekim ve Danışman Arası Vardiya Devri
- **Aktörler**: Gece Temsilcisi, Gündüz Temsilcisi.
- **Akış**:
  1. Gece vardiyasında gelen hasta acil ağrı şikayetinde bulunur.
  2. Gece temsilcisi iç not ekler: `[İÇ NOT: Hasta acil ağrı kesici önerisi istedi, sabah saat 09:00'da Dr. Ali Bey'in araması için söz verildi.]`
  3. Sohbetin atanmış temsilcisi gündüz temsilcisine değiştirilir ve etiket `[Acil Takip]` yapılır.
  4. Gündüz temsilcisi sabah sohbeti açtığında iç notu okur ve doğrudan hastayı arayarak süreci tamamlar.

---

## 4. Dikkat Edilmesi Gereken Kurallar

> [!WARNING]
> **Meta 24 Saat Kuralı**: Hastanın son gönderdiği mesajın üzerinden 24 saat geçtikten sonra hastaya serbest metin mesajı GöNDERİLEMEZ. 24 saat dolduğunda mesaj alanı kilitlenir ve hastaya sadece **Meta Onaylı Şablon Mesaj (Template)** gönderilebilir.

> [!TIP]
> Spama düşmemek ve hasta memnuniyetini artırmak için iç notlar üzerinden ekip içi iletişimi güçlü tutun ve hastaya aynı bilgiyi iki kez sormaktan kaçının.
