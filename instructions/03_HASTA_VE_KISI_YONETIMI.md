# 03 - Hasta ve Kişi Yönetimi Talimatları

**Hasta ve Kişi Yönetimi (Contacts)**, kliniğinizle iletişime geçen tüm aday hastaların, mevcut hastaların ve danışanların veritabanını, tıbbi etiketlerini, özel alanlarını ve iletişim geçmişini merkezi olarak yönettiğiniz modüldür.

---

## 1. Kişi Kartı ve Veri Yapısı

Sistemde her hasta için aşağıdaki standart ve özelleştirilebilir veri alanları tutulur:

| Veri Alanı | Açıklama | Örnek Değer |
|---|---|---|
| **Adı Soyadı (Name)** | Hastanın tam adı | Ahmet Yılmaz |
| **Telefon (Phone)** | Uluslararası formatta WhatsApp numarası | `+905321234567` |
| **E-posta (Email)** | Hastanın iletişim e-postası | ahmet@example.com |
| **Etiketler (Tags)** | Segmentasyon ve kategorizasyon etiketleri | `[Sac Ekimi]`, `[VIP]`, `[İstanbul]` |
| **Özel Alanlar (Custom Fields)** | Kliniğe özel tanımlanan dinamik veriler | *Kan Grubu*, *Alerji*, *TCKN*, *Sponsor* |
| **Atanmış Danışman** | Hastadan sorumlu klinik temsilcisi | Dr. Elif Hanım |
| **Zaman Çizelgesi (Timeline)** | Tüm mesajlaşma, süreç ve işlem geçmişi | Kronolojik log akışı |

---

## 2. Operasyonel İşlemler ve Talimatlar

### A. Yeni Kişi/Hasta Ekleme
1. Sol menüden **Kişiler (Contacts)** sekmesine girin.
2. Sağ üstteki **"Yeni Kişi Ekle"** butonuna tıklayın.
3. Ad, Soyadı ve Ülke kodlu Telefon Numarasını girin.
4. Varsa etiketleri ve özel alanları doldurarak **Kaydet** butonuna basın.

> [!NOTE]
> WhatsApp üzerinden kliniğe ilk defa mesaj atan bilinmeyen numaralar, sistem tarafından otomatik olarak Kişi Kartı olarak oluşturulur ve WhatsApp profillerindeki isim varsayılan ad olarak atanır.

### B. Özel Alanlar (Custom Fields) Yapılandırması
Kliniğinizin ihtiyaç duyduğu özel verileri (Örn: *Tedavi Bütçesi*, *Referans Kaynağı*, *Pasaport No*) tanımlamak için:
1. **Ayarlar -> Özel Alanlar** bölümüne gidin.
2. **"Yeni Alan Ekle"** butonuna tıklayın.
3. Alan Tipi seçin: `Metin (Text)`, `Sayı (Number)`, `Tarih (Date)`, `Açılır Liste (Dropdown)` veya `Mantıksal (Boolean)`.
4. Alan Adı tanımlayın ve kaydedin. Artık tüm kişi kartlarında bu alan görünecektir.

### C. Telefon Numarası Tekilleştirme (Deduplication)
Aynı hastanın birden fazla kez kaydedilmesini önlemek için veritabanında otomatik telefon numarası tekilleştirme (`022_contact_phone_dedup.sql`) bulunur.
- Telefon numaraları uluslararası standart olan **E.164** formatında temizlenir (Örn: `0532 123 45 67` -> `905321234567`).
- Çifte kayıt tespiti durumunda sistem uyarı verir ve sohbetleri tek hasta kartı altında birleştirir.

### D. Toplu Kişi İçe Aktarma (CSV Import)
Eski hasta listelerinizi veya Excel tablolarınızı sisteme aktarmak için:
1. **Kişiler** sayfasında **"İçe Aktar (Import CSV)"** butonuna tıklayın.
2. Örnek CSV şablonunu indirin.
3. Sutunları eşleştirin:
   - `phone` -> Telefon (Zorunlu)
   - `name` -> Ad Soyad
   - `email` -> E-posta
   - `tags` -> Etiketler (Virgülle ayrılmış: `Sac Ekimi, VIP`)
4. Dosyayı yükleyin ve eşleştirme önizlemesini onaylayarak aktarımı başlatın.

### E. Gelişmiş Filtreleme ve Segmentasyon
Pazarlama kampanyaları veya hekim kontrolleri için hasta grupları oluşturun:
- **Etikete Göre Filtre**: `[Saç Ekimi]` ve `[Takip Bekliyor]` etiketlerine sahip hastaları süzün.
- **Son Aktivite Tarihi**: Son 30 gündür iletişim kurulmamış hastaları listeleyin.
- Filtrelenen kişileri toplu mesaj (Broadcast) listesine aktarın veya CSV olarak dışa aktarın (Export).

---

## 3. Detaylı Kullanım Senaryoları (Use Cases)

### Senaryo: Saç Ekimi Kliniği Aday Hasta Segmentasyonu ve İçe Aktarma
- **Amaç**: Fuardan toplanan 500 adet aday hasta kartvizitini sisteme aktarmak ve etiketlemek.
- **Adım Adım Akış**:
  1. Pazarlama ekibi Excel tablosunu düzenler: `Name`, `Phone`, `CustomField:FuarSehri`, `Tags:Fuar2026,SacEkimiAday`.
  2. ClinicaCRM **Kişiler -> Import** ekranından dosya yüklenir.
  3. Sistem 12 adet geçersiz telefon numarasını raporlar, kalan 488 kişiyi başarılı şekilde kaydeder.
  4. Kişiler listesinden `[Fuar2026]` etiketi süzülür.
  5. Süzülen 488 kişiye tek tıkla **Toplu Mesaj Kampanyası (Broadcast)** tanımlanarak kişiselleştirilmiş Hoş Geldiniz mesajı iletilir.
