# 10 - Kurulum ve Meta Yapılandırması Talimatları

**Kurulum ve Meta Yapılandırması**, Atlas ClinicaCRM platformunun Meta WhatsApp Business Cloud API ve Supabase PostgreSQL veritabanı ile bağlantısını kurarak canlıya (Production) alma rehberidir.

---

## 1. Meta WhatsApp Business Cloud API Yapılandırması

Atlas ClinicaCRM, üçüncü parti pahalı aracı firmalar (WATI, Twilio, Interakt vb.) yerine **doğrundan Meta'nın resmi ve ücretsiz WhatsApp Cloud API altyapısını** kullanır.

### Adım 1: Meta Developer Hesabı ve App Oluşturma
1. [Meta for Developers](https://developers.facebook.com) portalına gidin ve giriş yapın.
2. **My Apps -> Create App** butonuna tıklayın.
3. Uygulama Tipi olarak **Business (İşletme)** seçin.
4. Uygulamaya ürün ekleme ekranından **WhatsApp** ürününü ekleyin.

### Adım 2: Telefon Numarası, Phone Number ID ve Permanent Token Alımı
1. WhatsApp -> **API Setup** sekmesine gidin.
2. Ekranda görünen **Phone Number ID** ve **WhatsApp Business Account ID (WABA ID)** değerlerini kopyalayın.
3. Test numaranızı veya kendi resmi işletme numaranızı ekleyin.
4. **Kalıcı Erişim Jetonu (Permanent Access Token)**:
   - Meta Business Manager -> **System Users (Sistem Kullanıcıları)** bölümüne gidin.
   - Yeni bir Sistem Kullanıcısı oluşturun ve yetki verin: `whatsapp_business_messaging`, `whatsapp_business_management`.
   - Süresiz (Never expire) Erişim Jetonunu üretin ve kopyalayın.

### Adım 3: Webhook Doğrulaması (Callback URL)
1. Meta Developer Portal -> WhatsApp -> **Configuration (Yapılandırma)** sekmesine geçin.
2. **Edit Webhook** butonuna basın:
   - **Callback URL**: `https://crm.kliniginiz.com/api/whatsapp/webhook`
   - **Verify Token**: Belirlediğiniz gizli metin (Örn: `klinik_crm_secret_verify_token_123`)
3. **Verify and Save** butonuna tıklayın.
4. Webhook Subscriptions altından **messages** alanına **Subscribe (Abone Ol)** basın.

---

## 2. Supabase Veritabanı ve Migration Kurulumu

ClinicaCRM veritabanı yapısı Supabase SQL migration dosyalarında (`supabase/migrations/`) hazırdır:

1. [Supabase Console](https://database.new) üzerinden yeni bir proje oluşturun.
2. Project Settings -> **API** bölümünden `SUPABASE_URL`, `ANON_KEY` ve `SERVICE_ROLE_KEY` değerlerini alın.
3. SQL Editor ekranını açın ve `supabase/migrations/` altındaki `.sql` dosyalarını sırasıyla (001'den 039'a kadar) çalıştırın.

---

## 3. Ortam Değişkenleri (`.env.local`) Yapılandırması

Sunucunuzda veya `.env.local` dosyanızda bulunması gereken kritik anahtarlar:

```env
# --- NEXT.JS APP CONFIG ---
NEXT_PUBLIC_APP_URL=https://crm.kliniginiz.com

# --- SUPABASE CONFIG ---
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# --- ENCRYPTION KEY (AES-256-GCM) ---
# 32-byte hex string (openssl rand -hex 32)
ENCRYPTION_KEY=64_karakterlik_hex_anahtar_buraya

# --- WHATSAPP META CLOUD API CONFIG ---
WHATSAPP_PHONE_NUMBER_ID=109283746501928
WHATSAPP_ACCESS_TOKEN=EAAG...
WHATSAPP_VERIFY_TOKEN=klinik_crm_secret_verify_token_123

# --- AI & EMBEDDINGS (OPSİYONEL) ---
OPENAI_API_KEY=sk-proj-...
```

---

## 4. Canlıya Alma (Deployment)

### A. Hostinger Node.js Deploy (Önerilen)
1. GitHub reponuzu veya forkladığınız reponuzu Hostinger hPanel -> **Websites -> Create Node.js App** sekmesinden bağlayın.
2. Ortam değişkenlerini (Env vars) hPanel paneline yapıştırın.
3. Push to `main` ile otomatik derleme ve yayını başlatın.

### B. Docker ile Canlıya Alma
Proje kök dizininde hazır Dockerfile ve `docker-compose.yml` bulunmaktadır (`docs/docker.md`):

```bash
docker compose build
docker compose up -d
```

---

## 5. Kurulum Sonrası Kontrol Listesi (Checklist)

- [ ] Meta Webhook durumu 'Active' görünüyor mu?
- [ ] Test WhatsApp numarasından gönderilen mesaj Atlas ClinicaCRM Inbox ekranına düşüyor mu?
- [ ] Temsilci yanıt verdiğinde mesaj WhatsApp'a ulaşıyor mu?
- [ ] Supabase Storage kovalarında (Buckets) `avatars`, `chat-media` klasörleri oluştu mu?
- [ ] API Token'lar AES-256 ile şifreleniyor mu?
