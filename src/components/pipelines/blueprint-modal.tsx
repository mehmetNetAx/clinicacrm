"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileUp, AlertCircle, CheckCircle2, Lock } from "lucide-react";

export interface BlueprintRequirement {
  id: string;
  stageName: string;
  requiredFields: { key: string; label: string; type: "text" | "number" | "file" | "select" }[];
  requiredDocs: string[];
}

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Record<string, string>) => void;
  targetStage: string;
  patientName: string;
}

export function BlueprintModal({
  isOpen,
  onClose,
  onConfirm,
  targetStage,
  patientName,
}: BlueprintModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Requirements mapped per stage
  const getRequirements = (stage: string) => {
    if (stage.toLowerCase().includes("teklif") || stage.toLowerCase().includes("offer")) {
      return {
        requiredFields: [
          { key: "doctor_notes", label: "Konsültasyon Hekim Notu", type: "text" },
          { key: "est_budget", label: "Tahmini Paket Fiyatı (€)", type: "number" },
        ],
        requiredDocs: ["Tıbbi Röntgen / MR veya Fotoğraf"],
      };
    }
    if (stage.toLowerCase().includes("uçuş") || stage.toLowerCase().includes("flight") || stage.toLowerCase().includes("lojistik")) {
      return {
        requiredFields: [
          { key: "passport_no", label: "Pasaport Numarası", type: "text" },
          { key: "flight_code", label: "Uçuş Kodu & Geliş Saati", type: "text" },
        ],
        requiredDocs: ["Uçuş Bilet Görseli / PDF"],
      };
    }
    return {
      requiredFields: [{ key: "qualification_notes", label: "Hasta Ön Değerlendirme Notu", type: "text" }],
      requiredDocs: ["Ön Bilgi ve Şikayet Formu"],
    };
  };

  const reqs = getRequirements(targetStage);

  const handleDocUpload = (docName: string) => {
    if (!uploadedDocs.includes(docName)) {
      setUploadedDocs([...uploadedDocs, docName]);
    }
  };

  const handleSubmit = () => {
    // Check missing fields
    for (const field of reqs.requiredFields) {
      if (!formData[field.key] || formData[field.key].trim() === "") {
        setError(`Lütfen "${field.label}" alanını doldurun.`);
        return;
      }
    }
    // Check missing docs
    for (const doc of reqs.requiredDocs) {
      if (!uploadedDocs.includes(doc)) {
        setError(`Lütfen zorunlu evrak olan "${doc}" belgesini yükleyin.`);
        return;
      }
    }

    setError(null);
    onConfirm(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold">
              Zoho Blueprint: Aşama Güvence Kontrolü
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{patientName}</span> isimli hastayı{" "}
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              {targetStage}
            </Badge>{" "}
            aşamasına taşımak için zorunlu kriterlerin tamamlanması gerekmektedir.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 py-2">
          {/* Required Fields Section */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Zorunlu Veri Giriş Alanları
            </h4>
            {reqs.requiredFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key} className="text-xs font-medium">
                  {field.label} <span className="text-destructive">*</span>
                </Label>
                {field.type === "text" ? (
                  <Input
                    id={field.key}
                    placeholder={`${field.label} giriniz...`}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                  />
                ) : (
                  <Input
                    id={field.key}
                    type="number"
                    placeholder="0.00"
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
          </div>

          {/* Required Documents Section */}
          <div className="space-y-3 border-t pt-3">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <FileUp className="h-3.5 w-3.5" /> Zorunlu Medikal Belge / Dosya Yükleme
            </h4>
            <div className="space-y-2">
              {reqs.requiredDocs.map((doc) => {
                const isUploaded = uploadedDocs.includes(doc);
                return (
                  <div
                    key={doc}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isUploaded ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <FileUp className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{doc}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {isUploaded ? "Dosya doğrulandı" : "PDF, JPEG veya PNG formatında zorunlu"}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={isUploaded ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleDocUpload(doc)}
                    >
                      {isUploaded ? "Yüklendi" : "Dosya Seç"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Doğrula ve Aşamayı Güncelle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
