# 08 - Ekip Yönetimi, Yetkilendirme ve Canlı Varlık Talimatları

**Ekip Yönetimi ve Yetkilendirme**, kliniğiniz bünyesindeki Hekimlerin, Hasta Kabul Temsilcilerinin, Sağlık Danışmanlarının ve Sistem Yöneticilerinin yetki alanlarını düzenleyen ve temsilcilerin anlık canlı durumlarını (Presence) izleyen modüldür.

---

## 1. Rol Bazlı Erişim Yönetimi (RBAC) Matrisi

Atlas ClinicaCRM üzerinde tanımlı 4 temel kullanıcı rolü bulunur (`017_account_sharing.sql`):

| Yetki / Modül | Hesap Sahibi (Owner) | Yönetici (Admin) | Temsilci (Agent) | İzleyici (Viewer) |
|---|:---:|:---:|:---:|:---:|
| **Gelen Kutusu (Inbox)** | Tam Erişim | Tam Erişim | Sadece Atananlar / Hesaptakiler | Sadece Okuma |
| **Mesaj Gönderme / Not Ekleme** | Evet | Evet | Evet | Hayır |
| **Kişiler / Hasta Kartları** | Okuma/Yazma/Silme | Okuma/Yazma/Silme | Okuma/Yazma | Sadece Okuma |
| **Süreçler (Pipelines)** | Tam Yönetim | Tam Yönetim | Fırsat Güncelleme | Sadece Okuma |
| **Toplu Mesaj (Broadcast)** | Evet | Evet | Hayır | Hayır |
| **Otomasyon & Akış Oluşturucu** | Evet | Evet | Hayır | Hayır |
| **Ekip Üyesi Davet Etme/Silme** | Evet | Evet | Hayır | Hayır |
| **Meta & WhatsApp Ayarları** | Evet | Evet | Hayır | Hayır |
| **API Keys & Webhooks** | Evet | Hayır | Hayır | Hayır |

---

## 2. Operasyonel İşlemler ve Talimatlar

### A. Ekip Üyesi Davet Etme
1. Sol menüden **Ayarlar -> Ekip (Team)** sekmesine gidin.
2. **"Üye Davet Et"** butonuna tıklayın.
3. Davet edilecek kişinin E-posta adresini girin ve Rolünü seçin (`Admin`, `Agent` veya `Viewer`).
4. **"Davet Bağlantısı Üret"** butonuna basın (`019_invitation_rpcs.sql`).
5. Oluşan güvenli davet bağlantısını temsilciye iletin. Temsilci bağlantıya tıklayarak şifresini belirler ve kliniğe dahil olur.

### B. Rol Değiştirme veya Üye Çıkarma
- Üye listesinden ilgili kullanıcının yanındaki rol açılır menüsünden yetkisini anında değiştirebilirsiniz.
- Kliniğinizden ayrılan bir çalışanın erişimini kesmek için **"Hesaptan Çıkar"** butonuna basmanız yeterlidir.

### C. Canlı Varlık (Member Presence) Takibi
Sistem, temsilcilerin sisteme bağlı olup olmadığını gerçek zamanlı takip eder (`024_member_presence.sql`):
- **🟢 Çevrimiçi (Online)**: Temsilci aktif olarak ekran başında ve sohbet yanıtlayabilir.
- **🟡 Boşta (Idle)**: Temsilci 5 dakikadır fare/klavye hareketi yapmadı.
- **🔴 Çevrimdışı (Offline)**: Temsilci oturumu kapattı veya tarayıcıyı kapattı.

Sohbet atama ekranlarında sistem otomatik olarak sadece **Çevrimiçi** olan temsilcileri öne çıkarır.

---

## 3. Detaylı Kullanım Senaryosu (Use Case)

### Senaryo: Yeni İşe Başlayan Hasta Danışmanının Sisteme Dahil Edilmesi
- **Amaç**: Yeni başlayan Danışman Merve Hanım'a sadece kendi hastalarıyla iletişim kurabileceği `Agent` rolünde erişim vermek.
- **Adımlar**:
  1. Klinik Yöneticisi **Ayarlar -> Ekip** ekranını açar.
  2. `merve@klinik.com` adresi için `Agent` rolünü seçer ve davet linkini üretir.
  3. Merve Hanım linke tıklar, adını yazıp şifresini belirler.
  4. Merve Hanım sisteme girdiğinde sol menüde *Ayarlar*, *API*, *Otomasyonlar* gibi idari menülerin gizlendiğini görür.
  5. Sadece **Gelen Kutusu**, **Kişiler** ve **Süreçler** modüllerini kullanarak hasta takip operasyonuna başlar.
