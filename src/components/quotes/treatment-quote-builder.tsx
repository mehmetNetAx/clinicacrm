"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Trash2,
  Send,
  Download,
  Calculator,
  Building2,
  Plane,
  Languages,
  Stethoscope,
  Sparkles,
} from "lucide-react";

export interface QuoteItem {
  id: string;
  category: "Procedure" | "Hotel" | "VIP Transfer" | "Interpreter" | "Other";
  title: string;
  unitPrice: number;
  quantity: number;
}

interface TreatmentQuoteBuilderProps {
  patientId?: string;
  patientName?: string;
  onSaveQuote?: (quote: any) => void;
}

const CATEGORY_ICONS = {
  Procedure: Stethoscope,
  Hotel: Building2,
  "VIP Transfer": Plane,
  Interpreter: Languages,
  Other: Sparkles,
};

export function TreatmentQuoteBuilder({
  patientId = "pat-1",
  patientName = "Alex Rivera",
  onSaveQuote,
}: TreatmentQuoteBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState<"EUR" | "USD" | "GBP" | "TRY">("EUR");
  const [discountPercent, setDiscountPercent] = useState<number>(5);
  const [validDays, setValidDays] = useState<number>(30);
  const [notes, setNotes] = useState<string>(
    "Fiyata tüm pre-op kan tahlilleri, 5 yıldızlı otelde 4 gece konaklama ve özel VIP transfer dahildir."
  );

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: "item-1",
      category: "Procedure",
      title: "All-on-4 Diş İmplant Cerrahisi (Üst & Alt Çene Zirkonyum)",
      unitPrice: 3500,
      quantity: 1,
    },
    {
      id: "item-2",
      category: "Hotel",
      title: "5 Yıldızlı Lüks Otel Konaklaması (Kahvaltı Dahil - 4 Gece)",
      unitPrice: 120,
      quantity: 4,
    },
    {
      id: "item-3",
      category: "VIP Transfer",
      title: "Havalimanı - Otel - Klinik VIP Transfer Hizmeti",
      unitPrice: 200,
      quantity: 1,
    },
    {
      id: "item-4",
      category: "Interpreter",
      title: "Medikal İngilizce Özel Tercümanlık Hizmeti",
      unitPrice: 150,
      quantity: 1,
    },
  ]);

  const currencySymbol = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    TRY: "₺",
  }[currency];

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const netTotal = subtotal - discountAmount;

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      category: "Procedure",
      title: "Yeni Tedavi / Hizmet Kalemi",
      unitPrice: 500,
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Merhaba ${patientName}, Atlas ClinicaCRM Sağlık Grubu tedavi paket teklifiniz hazırlanmıştır.\n\n` +
        `📋 Paket: ${items[0]?.title || "Sağlık Turizmi Paketi"}\n` +
        `💰 Toplam Tutar: ${currencySymbol}${netTotal.toLocaleString()} (${currency})\n` +
        `⏳ Geçerlilik: ${validDays} gün\n\n` +
        `Teklifinizi detaylı incelemek için tıklayın: https://clinicacrm.com/patient-portal/pt_demo_quote`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <FileText className="h-4 w-4" />
            Tedavi Paketi & Teklif Oluştur
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Calculator className="h-6 w-6" />
              <DialogTitle className="text-xl font-bold">
                Çoklu Para Birimli Tedavi Paketi Hazırlayıcı
              </DialogTitle>
            </div>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-bold">
              Teklif No: Q-{Math.floor(100000 + Math.random() * 900000)}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{patientName}</span> için özelleştirilmiş medikal turizm paket fiyatı ve detaylı çizelgesi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Controls bar */}
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-muted/40 p-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Para Birimi</Label>
              <Select value={currency} onValueChange={(val: any) => setCurrency(val)}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                  <SelectItem value="USD">USD ($) - Dolar</SelectItem>
                  <SelectItem value="GBP">GBP (£) - Sterlin</SelectItem>
                  <SelectItem value="TRY">TRY (₺) - Türk Lirası</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Özel İndirim (%)</Label>
              <Input
                type="number"
                className="h-8 text-xs bg-background"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Geçerlilik Süresi (Gün)</Label>
              <Input
                type="number"
                className="h-8 text-xs bg-background"
                value={validDays}
                onChange={(e) => setValidDays(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Paket Kalemleri & Hizmetler ({items.length})
              </h4>
              <Button variant="outline" size="sm" onClick={handleAddItem} className="h-7 text-xs gap-1">
                <Plus className="h-3 w-3" /> Kalem Ekle
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item) => {
                const IconComponent = CATEGORY_ICONS[item.category] || Sparkles;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-center rounded-lg border border-border bg-card p-2.5 shadow-sm"
                  >
                    <div className="col-span-1 flex justify-center text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <div className="col-span-5 space-y-1">
                      <Input
                        className="h-8 text-xs"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
                      />
                    </div>

                    <div className="col-span-2">
                      <Input
                        type="number"
                        className="h-8 text-xs font-mono text-right"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdateItem(item.id, "unitPrice", Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="col-span-1">
                      <Input
                        type="number"
                        className="h-8 text-xs text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, "quantity", Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="col-span-2 text-right font-bold text-xs font-mono text-emerald-400">
                      {currencySymbol}
                      {(item.unitPrice * item.quantity).toLocaleString()}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Notes */}
          <div className="space-y-1.5 pt-2">
            <Label className="text-xs font-medium">Paket Koşulları & Dahil Olanlar</Label>
            <Textarea
              className="text-xs min-h-[60px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Pricing Summary Box */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Ara Toplam:</span>
              <span className="font-mono">{currencySymbol}{subtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Özel Paket İndirimi (%{discountPercent}):</span>
                <span className="font-mono">-{currencySymbol}{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-foreground border-t border-primary/20 pt-2">
              <span>Net Paket Tutar:</span>
              <span className="font-mono text-primary text-lg">
                {currencySymbol}{netTotal.toLocaleString()} {currency}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="gap-1 text-xs" onClick={() => setIsOpen(false)}>
            <Download className="h-3.5 w-3.5" /> PDF İndir
          </Button>
          <Button variant="secondary" onClick={handleSendWhatsApp} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
            <Send className="h-3.5 w-3.5" /> WhatsApp İle Gönder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
