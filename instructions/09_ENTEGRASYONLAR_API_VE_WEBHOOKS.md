# 09 - Entegrasyonlar, Public API ve Webhooks Talimatları

**Entegrasyonlar, Public API ve Webhooks**, Atlas ClinicaCRM'i dış yazılımlarla (Hastane Bilgi Yönetim Sistemleri - HBYS, E-ticaret platformları, Zapier, Make, özel CRM'ler) bağlayan teknik entegrasyon katmanıdır.

---

## 1. Public REST API (`/api/v1`)

Atlas ClinicaCRM, dış sistemlerin CRM verilerine güvenli erişmesini sağlayan kapsamlı bir REST API sunar (`docs/public-api.md`).

### A. API Anahtarı (API Key) Oluşturma
1. **Ayarlar -> API Anahtarları** sayfasına gidin (`026_api_keys.sql`).
2. **"Yeni API Anahtarı Üret"** butonuna tıklayın.
3. Anahtar adı tanımlayın (Örn: *HBYS Entegrasyonu*) ve Yetki Kapsamlarını (Scopes) seçin:
   - `contacts:read`, `contacts:write`
   - `conversations:read`, `messages:send`
   - `deals:read`, `deals:write`
4. Üretilen gizli anahtarı (`wacrm_live_...`) güvenli bir yere kaydedin. (Bu anahtar sadece bir kez gösterilir).

### B. Örnek API İstekleri

#### 1. Yeni Hasta/Kişi Oluşturma (HTTP POST):
```bash
curl -X POST https://crm.kliniginiz.com/api/v1/contacts \
  -H "Authorization: Bearer wacrm_live_secret_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mehmet Demir",
    "phone": "+905321112233",
    "email": "mehmet@example.com",
    "tags": ["Diş Muayenesi", "Web Formu"]
  }'
```

#### 2. WhatsApp Mesajı Gönderme (HTTP POST):
```bash
curl -X POST https://crm.kliniginiz.com/api/v1/messages/send \
  -H "Authorization: Bearer wacrm_live_secret_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+905321112233",
    "message": "Sayın Mehmet Bey, muayene randevunuz oluşturulmuştur."
  }'
```

---

## 2. Giden Webhook'lar (Outbound Webhook Endpoints)

Atlas ClinicaCRM'de gerçekleşen olayları (Events) kendi sunucularınıza anında bildirmek için Webhook tanımlayabilirsiniz (`028_webhook_endpoints.sql`):

### Desteklenen Olaylar (Event Types):
- `message.received`: Hastadan yeni WhatsApp mesajı geldiğinde.
- `message.sent`: Temsilci veya bot mesaj gönderdiğinde.
- `contact.created` / `contact.updated`: Kişi kartı eklendiğinde veya güncellendiğinde.
- `deal.stage_changed`: Tedavi sürecinde fırsat kartı yeni bir aşamaya taşındığında.

### Webhook İmzası ve Güvenlik:
Tüm Webhook payload'ları `X-WACRM-Signature` başlığında **HMAC-SHA256** imzası ile gönderilir. Sunucunuz bu imzayı Secret key ile doğrulayarak isteğin Atlas ClinicaCRM'den geldiğinden emin olur.

---

## 3. Model Context Protocol (MCP) Sunucusu

Atlas ClinicaCRM, yapay zeka araçlarının (Claude Desktop, Cursor IDE vb.) CRM verilerinize doğrudan ve güvenli bir şekilde erişebilmesi için yerleşik bir **MCP Sunucusu** sunar (`mcp-server/` ve `docs/mcp.md`).

- **Varsayılan olarak Salt-Okunurdur (Read-Only)**.
- Claude veya Cursor üzerindeki AI asistanına: *"Son 24 saatte gelen diş estetiği hastalarını özetle"* veya *"Ahmet Yılmaz'ın son sohbet notlarını getir"* talimatı vererek doğrudan CRM veritabanını sorgulayabilirsiniz.

---

## 4. Detaylı Kullanım Senaryosu (Use Case)

### Senaryo: Hastane Bilgi Yönetim Sistemi (HBYS) Randevu Entegrasyonu
- **Amaç**: HBYS sisteminde hasta randevusu kaydedildiğinde Atlas ClinicaCRM'e otomatik kişi açılması ve WhatsApp onay mesajı atılması.
- **Entegrasyon Akışı**:
  1. HBYS yazılımı hasta randevusu aldığında ClinicaCRM REST API'ye HTTP POST yapar:
     `POST /api/v1/contacts` -> Kişi kaydedilir.
  2. HBYS yazılımı `POST /api/v1/messages/send` çağrısı yaparak Meta şablonu ile otomatik randevu konfirmasyonu gönderir.
  3. Hasta WhatsApp'tan *"Teşekkürler, randevuyu onaylıyorum"* cevabı verdiğinde ClinicaCRM `message.received` Webhook'unu HBYS sunucusuna fırlatır.
  4. HBYS sisteminde randevu durumu `[Onaylandı]` olarak güncellenir.
