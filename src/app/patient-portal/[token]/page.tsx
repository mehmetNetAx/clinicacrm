"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AtlasLogo } from "@/components/layout/atlas-logo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Plane,
  Building2,
  Calendar,
  Stethoscope,
  FileUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PhoneCall,
  Download,
  UserCheck,
} from "lucide-react";

export default function PatientSelfServicePortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "Pre_Op_Blood_Results_2026.pdf",
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const patient = {
    name: "Alex Rivera",
    country: "United Kingdom 🇬🇧",
    treatment: "All-on-4 Dental Implant & Smile Design",
    doctor: "Op. Dr. Mehmet Demir",
    hotel: "Radisson Blu Bosphorus (4 Nights)",
    flight: "TK1984 - 24 Aug 2026, 14:30",
    transferDriver: "Ahmet Yılmaz (VIP Mercedes Vito - 34 CRM 001)",
    quoteAmount: "4.200 €",
    status: "CONFIRMED & SCHEDULED",
  };

  const itinerarySteps = [
    {
      title: "Havalimanı Karşılama & VIP Transfer",
      date: "24 Ağustos 2026 - 14:30",
      icon: Plane,
      status: "COMPLETED",
      desc: "VIP Sürücü Ahmet Bey havalimanı çıkış kapısında isminizle karşılayacaktır.",
    },
    {
      title: "Otel Check-in & Dinlenme",
      date: "24 Ağustos 2026 - 16:00",
      icon: Building2,
      status: "IN_PROGRESS",
      desc: "Radisson Blu Bosphorus suit oda konaklaması.",
    },
    {
      title: "Klinik Ön Konsültasyon & Panoramik Röntgen",
      date: "25 Ağustos 2026 - 10:00",
      icon: Stethoscope,
      status: "UPCOMING",
      desc: "Op. Dr. Mehmet Demir ile tedavi planı netleştirmesi ve 3D tomografi.",
    },
    {
      title: "All-on-4 İmplant Operasyonu",
      date: "25 Ağustos 2026 - 13:30",
      icon: Calendar,
      status: "UPCOMING",
      desc: "Sedasyon altında ağrısız implant yerleşimi.",
    },
    {
      title: "Kontrol Muayenesi & Geçici Protez Takılması",
      date: "27 Ağustos 2026 - 11:00",
      icon: CheckCircle2,
      status: "UPCOMING",
      desc: "Son estetik kontrol ve dönüş uçuşu öncesi onay.",
    },
  ];

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setUploadedFiles([...uploadedFiles, `Dental_XRay_${Date.now()}.png`]);
      setIsUploading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AtlasLogo size="sm" />
          <span className="text-xs text-muted-foreground border-l border-border pl-3 hidden sm:inline">
            Güvenli Hasta Self-Servis Portalı
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold gap-1 text-xs">
            <ShieldCheck className="h-3.5 w-3.5" /> HIPAA & KVKK Güvenli Access
          </Badge>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-background p-6 sm:p-8 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Hoş Geldiniz, {patient.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {patient.treatment}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{patient.country}</span> • Sorumlu Hekim:{" "}
                <strong className="text-foreground">{patient.doctor}</strong>
              </p>
            </div>

            <div className="flex flex-col items-end justify-center">
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1 px-3">
                {patient.status}
              </Badge>

              <span className="text-xs text-muted-foreground mt-2">
                Paket Fiyatı: <strong className="text-primary text-base font-mono">{patient.quoteAmount}</strong>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-card/60 p-2.5 rounded-lg border border-border/50">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold">{patient.hotel}</p>
                <p className="text-[11px] text-muted-foreground">Otel Rezervasyonu Onaylı</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-card/60 p-2.5 rounded-lg border border-border/50">
              <Plane className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold">{patient.flight}</p>
                <p className="text-[11px] text-muted-foreground">Varış Uçuş Detayı</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-card/60 p-2.5 rounded-lg border border-border/50">
              <UserCheck className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold">{patient.transferDriver}</p>
                <p className="text-[11px] text-muted-foreground">VIP Sürücü Bilgisi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Itinerary Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Canlı Tedavi & Seyahat Akışı
                </CardTitle>
                <CardDescription className="text-xs">
                  İstanbul seyahatiniz boyunca adım adım planlanan tıbbi randevular ve transfer saatleri.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {itinerarySteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isDone = step.status === "COMPLETED";
                  const isCurrent = step.status === "IN_PROGRESS";

                  return (
                    <div key={idx} className="flex gap-4 relative">
                      {idx !== itinerarySteps.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border" />
                      )}

                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-primary text-primary-foreground animate-pulse"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        <StepIcon className="h-4 w-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                          {isDone && (
                            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                              Tamamlandı
                            </Badge>
                          )}
                          {isCurrent && (
                            <Badge className="text-[10px] bg-primary text-primary-foreground">
                              Devam Ediyor
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-primary font-medium">{step.date}</p>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: File Upload & Coordinator Contact */}
          <div className="space-y-4">
            {/* File Upload Box */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileUp className="h-4 w-4 text-primary" />
                  Medikal Evrak & Röntgen Yükle
                </CardTitle>
                <CardDescription className="text-xs">
                  Hekiminizin incelemesi için dental röntgen, MR veya kan tahlili raporunuzu yükleyebilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  onClick={handleSimulateUpload}
                  className="border-2 border-dashed border-border hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-colors bg-muted/20"
                >
                  <FileUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs font-semibold text-foreground">
                    {isUploading ? "Yükleniyor..." : "Dosya Seç veya Sürükle"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    PDF, DICOM, JPEG, PNG (Maks 25 MB)
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold uppercase text-muted-foreground">
                      Yüklenen Belgeler ({uploadedFiles.length})
                    </span>
                    {uploadedFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs p-2 rounded-lg border border-border bg-card"
                      >
                        <span className="truncate max-w-[180px] font-medium text-foreground">
                          {file}
                        </span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Direct WhatsApp Contact Card */}
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" /> 7/24 Özel Hasta Asistanınız
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Seyahatiniz öncesinde veya boyunca tüm sorularınız için medikal koordinatörünüze ulaşın.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Selin Kaya</p>
                    <p className="text-xs text-muted-foreground">Uluslararası Hasta Koordinatörü</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
                  onClick={() => window.open("https://wa.me/?text=Merhaba%20Selin%20Hanım", "_blank")}
                >
                  <PhoneCall className="h-3.5 w-3.5" /> WhatsApp İle Canlı Destek Al
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground bg-card">
        © 2026 Atlas ClinicaCRM Sağlık Hizmetleri. Tüm hakları saklıdır. HIPAA & GDPR Uyumlu Hasta Portalı.
      </footer>
    </div>
  );
}
