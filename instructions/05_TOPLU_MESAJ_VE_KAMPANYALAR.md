# 05 - Toplu Mesaj ve Kampanyalar (Broadcasts) Talimatları

**Toplu Mesaj ve Kampanyalar (Broadcasts)**, klinik hastalarınıza veya aday danışanlarınıza Meta onaylı WhatsApp şablon mesajlarını kullanarak toplu duyuru, kontrol randevusu hatırlatması, kampanya ve bilgilendirme mesajları göndermenizi sağlayan modüldür.

---

## 1. Toplu Mesaj Gönderim Mantığı ve Meta Kuralları

Meta (WhatsApp) kuralları gereği:
1. Hastalara toplu mesaj gönderilirken **sadece Meta tarafından onaylanmış Şablon Mesajlar (Message Templates)** kullanılabilir.
2. Serbest metin veya onaylanmamış mesajlar toplu olarak GÖNDERİLEMEZ.
3. Her şablon mesaj dinamik değişkenler içerebilir: `Sayın {{1}}, kliniğimizdeki {{2}} kontrol randevunuz yaklaşmaktadır.`

---

## 2. Operasyonel Adımlar ve Talimatlar

### A. Meta Şablonunun Seçilmesi veya Senkronizasyonu
1. **Yayınlar (Broadcasts) -> Şablonlar** sekmesine gidin.
2. Meta Business Dashboard üzerinde onaylanmış olan şablonlarınızı **"Şablonları Senkronize Et"** butonuna basarak çekin.
3. Şablon kütüphanesinden uygun mesaj şablonunu seçin.

### B. Hedef Kitle (Recipients) Belirleme
Mesajın iletileceği kişileri hassas şekilde filtreleyin:
- **Etikete Göre**: Örn: `[Diş Beyazlatma]`, `[Eski Hasta]`, `[İstanbul]`
- **Süreç Aşamasına Göre**: Örn: `[Teklif Sunuldu]` aşamasındaki adaylar.
- **Özel Filtre**: Belirli bir tarihten sonra kaydolan hastalar.

### C. Dinamik Değişken Eşleştirme (Variable Substitution)
Şablon içerisindeki değişkenleri hasta kartındaki alanlarla eşleştirin:
- `{{1}}` -> **Hasta Adı Soyadı** (`contact.name`)
- `{{2}}` -> **Son Muayene Tarihi** (`contact.custom_fields.last_visit`)
- `{{3}}` -> **Doktor Adı** (`contact.assigned_agent_name`)

Örnek Önizleme:
> *Sayın Ahmet Yılmaz, kliniğimizdeki 15 Ağustos 2026 kontrol randevunuz yaklaşmaktadır. Detaylı bilgi için yanıtlayabilirsiniz.*

### D. Gönderimi Başlatma ve Güvenlik (Rate-Limiting & Resume)
Atlas ClinicaCRM, WhatsApp numaranızın kısıtlanmaması ve spama düşmemesi için gelişmiş kademeli gönderim motoruna sahiptir (`005_broadcast_counts_incremental.sql` & `038_broadcast_resume.sql`):
1. Mesajlar gruplar halinde (batching) ve saniyede belirlenen güvenli limitler dahilinde arka planda sırayla gönderilir.
2. Herhangi bir bağlantı kopması veya sunucu yeniden başlaması durumunda gönderim kaldığı yerden **otomatik devam eder (Resume)**.
3. Gönderimi istediğiniz an **"Duraklat"** butonuna basarak durdurabilir, daha sonra **"Devam Et"** ile sürdürebilirsiniz.

---

## 3. Raporlama ve İstatistik Analizi

Yayın tamamlandığında veya gönderim sırasında canlı grafiklerle aşağıdaki metrikler izlenir:

| Metrik | Açıklama |
|---|---|
| **Hedef Kitle (Total)** | Kampanyaya dahil edilen toplam hasta sayısı. |
| **Gönderildi (Sent)** | WhatsApp sunucularına başarıyla iletilen mesaj sayısı. |
| **Teslim Edildi (Delivered)** | Hastanın telefonuna ulaşan mesaj sayısı. |
| **Okundu (Read)** | Hastanın mesajı açıp okuduğu anın takibi (Mavi tik). |
| **Başarısız (Failed)** | Geçersiz numara veya engelleme nedeniyle ulaşmayan mesajlar. |

---

## 4. Detaylı Kullanım Senaryoları (Use Cases)

### Senaryo: 6 Aylık Rutin Diş Kontrolü Kampanyası
- **Hedef**: Son muayene tarihi 6 ay öncesinde kalan ve etiketinde `[Diş Kontrolü]` olan 1.200 hastaya ulaşmak.
- **Uygulama Adımları**:
  1. Pazarlama Yöneticisi **Kişiler** sayfasından `[Diş Kontrolü]` etiketli hastaları süzer.
  2. **Yayın Oluştur** düğmesine tıklar.
  3. Meta şablonunu seçer: `rutin_kontrol_hatırlatma`.
  4. Değişkenleri eşleştirir: `{{1}}` -> Hasta Adı.
  5. Gönderimi saat 10:00'da başlatır.
  6. Yayın arka planda çalışırken canlı rapordan 1.180 mesajın teslim edildiğini ve 850 hastanın mesajı okuduğunu görür.
  7. Mesajı okuyup dönüş yapan 140 hasta Ortak Gelen Kutusu'na düşer ve temsilciler randevuları kaydeder.
