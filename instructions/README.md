# Atlas ClinicaCRM Kullanım ve İşletim Talimatları (Instructions Index)

**Atlas ClinicaCRM**, WhatsApp Business Cloud API tabanlı, çok temsilcili ortak gelen kutusu, hasta/kişi yönetimi, tedavi ve satış süreçleri (pipelines), toplu mesaj kampanyaları, no-code otomasyonlar ve yapay zeka destekli bilgi bankası sunan modern bir Klinik CRM platformudur.

Bu klasör (`instructions/`), sistemin tüm bileşenlerini, yetki matrisini, operasyonel iş akışlarını, kullanım senaryolarını ve teknik entegrasyonlarını adım adım açıklayan kapsamlı kılavuzları içerir.

---

## 📚 Dokümantasyon Haritası

| Doküman | Başlık | Hedef Kitle | İçerik Özeti |
|---|---|---|---|
| [`01_GENEL_SISTEM_VE_MIMARI.md`](./01_GENEL_SISTEM_VE_MIMARI.md) | Genel Sistem & Mimari | Tüm Kullanıcılar & Yöneticiler | Sistem bileşenleri, veri güvenliği, çoklu hesap (tenant) yapısı ve RLS mantığı. |
| [`02_ORTAK_GELEN_KUTUSU_VE_MESAJLASMA.md`](./02_ORTAK_GELEN_KUTUSU_VE_MESAJLASMA.md) | Ortak Gelen Kutusu & Mesajlaşma | Temsilciler & Danışmanlar | Sohbet yönetimi, temsilci atama, ses kaydı/medya gönderimi, hızlı yanıtlar, iç notlar. |
| [`03_HASTA_VE_KISI_YONETIMI.md`](./03_HASTA_VE_KISI_YONETIMI.md) | Hasta & Kişi Yönetimi | Hasta Kabul & Pazarlama | Kişi kartı, özel alanlar, etiketleme, CSV aktarımı ve telefon numarası tekilleştirme. |
| [`04_TEDAVI_VE_SATIS_SURECLERI.md`](./04_TEDAVI_VE_SATIS_SURECLERI.md) | Tedavi & Satış Süreçleri (Pipelines) | Satış & Klinik Yöneticileri | Kanban süreç yönetimi, fırsat/tedavi kartları, aşama geçişleri ve tutar takibi. |
| [`05_TOPLU_MESAJ_VE_KAMPANYALAR.md`](./05_TOPLU_MESAJ_VE_KAMPANYALAR.md) | Toplu Mesaj & Kampanyalar | Pazarlama & İletişim | Meta şablon yönetimi, hedef kitle filtreleme, kademeli gönderim ve raporlama. |
| [`06_OTOMASYONLAR_VE_GORSEL_AKISLAR.md`](./06_OTOMASYONLAR_VE_GORSEL_AKISLAR.md) | Otomasyonlar & Görsel Akışlar | Sistem Yöneticileri | Kural tabanlı otomasyonlar, sürükle-bırak görsel akış oluşturucu (Flow Builder) ve chatbot. |
| [`07_YAPAY_ZEKA_ASISTANI_VE_BILGI_BANKASI.md`](./07_YAPAY_ZEKA_ASISTANI_VE_BILGI_BANKASI.md) | Yapay Zeka Asistanı & Bilgi Bankası | Yöneticiler & Temsilciler | AI taslak önerileri, oto-pilot yanıt modu, RAG (doküman/SSS bilgi bankası) ve insana devir. |
| [`08_EKIP_YETKILENDIRME_VE_VARLIK.md`](./08_EKIP_YETKILENDIRME_VE_VARLIK.md) | Ekip Yönetimi & Yetkilendirme | Sistem Yöneticisi & HR | Rol matrisi (Owner, Admin, Agent, Viewer), davet yönetimi ve canlı temsilci varlık (presence) takibi. |
| [`09_ENTEGRASYONLAR_API_VE_WEBHOOKS.md`](./09_ENTEGRASYONLAR_API_VE_WEBHOOKS.md) | Entegrasyonlar, API & Webhooks | Geliştiriciler & Yazılım Ekibi | REST API v1 kullanımı, API anahtarı yönetimi, giden webhook'lar ve MCP sunucusu. |
| [`10_KURULUM_VE_META_YAPILANDIRMASI.md`](./10_KURULUM_VE_META_YAPILANDIRMASI.md) | Kurulum & Meta Yapılandırması | DevOps & Sistem Yöneticisi | WhatsApp Business Cloud API kurulumu, Supabase ayarları, ortam değişkenleri ve canlıya alma. |

---

## 🎯 Kullanıcı Rollerine Göre Başlangıç Rehberi

### 1. Hasta Kabul / Klinik Temsilcisi (Operator / Agent)
- İncelemeniz gereken kılavuzlar:
  1. [`02_ORTAK_GELEN_KUTUSU_VE_MESAJLASMA.md`](./02_ORTAK_GELEN_KUTUSU_VE_MESAJLASMA.md) (Günlük mesajlaşma operasyonu)
  2. [`03_HASTA_VE_KISI_YONETIMI.md`](./03_HASTA_VE_KISI_YONETIMI.md) (Hasta bilgilerini güncelleme)
  3. [`04_TEDAVI_VE_SATIS_SURECLERI.md`](./04_TEDAVI_VE_SATIS_SURECLERI.md) (Hastanın tedavi sürecini takip etme)

### 2. Klinik & Pazarlama Yöneticisi (Admin / Manager)
- İncelemeniz gereken kılavuzlar:
  1. [`04_TEDAVI_VE_SATIS_SURECLERI.md`](./04_TEDAVI_VE_SATIS_SURECLERI.md) (Süreç aşamalarını yapılandırma)
  2. [`05_TOPLU_MESAJ_VE_KAMPANYALAR.md`](./05_TOPLU_MESAJ_VE_KAMPANYALAR.md) (Kampanya ve duyuru gönderimi)
  3. [`06_OTOMASYONLAR_VE_GORSEL_AKISLAR.md`](./06_OTOMASYONLAR_VE_GORSEL_AKISLAR.md) (Otomatik karşılama ve akış kurma)
  4. [`07_YAPAY_ZEKA_ASISTANI_VE_BILGI_BANKASI.md`](./07_YAPAY_ZEKA_ASISTANI_VE_BILGI_BANKASI.md) (AI asistan ve bilgi bankasını besleme)

### 3. Sistem Yöneticisi & Entegratör (Admin / Developer)
- İncelemeniz gereken kılavuzlar:
  1. [`01_GENEL_SISTEM_VE_MIMARI.md`](./01_GENEL_SISTEM_VE_MIMARI.md)
  2. [`08_EKIP_YETKILENDIRME_VE_VARLIK.md`](./08_EKIP_YETKILENDIRME_VE_VARLIK.md)
  3. [`09_ENTEGRASYONLAR_API_VE_WEBHOOKS.md`](./09_ENTEGRASYONLAR_API_VE_WEBHOOKS.md)
  4. [`10_KURULUM_VE_META_YAPILANDIRMASI.md`](./10_KURULUM_VE_META_YAPILANDIRMASI.md)

---

## 💡 Temel Kavramlar ve Sözlük

- **Account (Hesap / Organizasyon)**: Tüm hastaların, sohbetlerin ve ekibin bağlı olduğu en üst seviye mantıksal birim.
- **Shared Inbox (Ortak Gelen Kutusu)**: Tek bir WhatsApp numarasının birden fazla klinik personeli tarafından eşzamanlı kullanıldığı sohbet ekranı.
- **WAMI (WhatsApp Message ID)**: Meta WhatsApp API tarafından her mesaja atanan benzersiz tanımlayıcı.
- **Template Message (Şablon Mesaj)**: Müşteriye 24 saatlik müşteri hizmetleri penceresi kapalıyken gönderilebilen Meta onaylı standart mesajlar.
- **Visual Flow Builder (Görsel Akış)**: Sürükle-bırak yöntemiyle oluşturulan ve hastayla etkileşime giren dinamik senaryo ağaçları.
- **RAG (Retrieval-Augmented Generation)**: Yapay zekanın kliniğe ait SSS ve tedavi dokümanlarını okuyarak doğru yanıt vermesini sağlayan hibrit arama teknolojisi.
