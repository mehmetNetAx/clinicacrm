"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ShieldAlert, UserCheck, Bell, AlertOctagon } from "lucide-react";

export interface SLAPolicy {
  id: string;
  policyName: string;
  targetStage: string;
  maxDurationHours: number;
  escalationRole: string;
  breachCount: number;
}

const DEFAULT_SLA_POLICIES: SLAPolicy[] = [
  {
    id: "sla-1",
    policyName: "VIP Hasta İlk Yanıt SLA'sı",
    targetStage: "Yeni Başvuru / Inquiry",
    maxDurationHours: 0.25, // 15 mins
    escalationRole: "Klinik Koordinatörü (SDR Lead)",
    breachCount: 2,
  },
  {
    id: "sla-2",
    policyName: "Medikal Değerlendirme & Hekim Onay SLA'sı",
    targetStage: "Tıbbi İnceleme",
    maxDurationHours: 4,
    escalationRole: "Başhekim / Operasyon Müdürü",
    breachCount: 0,
  },
  {
    id: "sla-3",
    policyName: "Paket & Teklif İletim SLA'sı",
    targetStage: "Teklif Hazırlandı",
    maxDurationHours: 2,
    escalationRole: "Satış Direktörü",
    breachCount: 1,
  },
  {
    id: "sla-4",
    policyName: "Uçuş & Transfer Lojistik Konfirmasyon SLA'sı",
    targetStage: "Lojistik & Transfer",
    maxDurationHours: 12,
    escalationRole: "Sağlık Turizmi Lojistik Yöneticisi",
    breachCount: 0,
  },
];

export function SLAEscalationMatrix() {
  const [policies, setPolicies] = useState<SLAPolicy[]>(DEFAULT_SLA_POLICIES);

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <CardTitle className="text-base font-bold">Zoho SLA & Yanıt Escalation Matrixi</CardTitle>
          </div>
          <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-xs font-semibold">
            {policies.reduce((acc, p) => acc + p.breachCount, 0)} Aktif SLA İhlali
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Geciken başvurular ve süreç aşamaları için tanımlanmış hedef süreler ve otomatik bildirim hiyerarşisi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm hover:bg-muted/40 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{policy.policyName}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {policy.targetStage}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" /> Maks. Süre:{" "}
                  <strong className="text-foreground">
                    {policy.maxDurationHours < 1
                      ? `${policy.maxDurationHours * 60} Dakika`
                      : `${policy.maxDurationHours} Saat`}
                  </strong>
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-emerald-500" /> Sorumlu:{" "}
                  <strong className="text-foreground">{policy.escalationRole}</strong>
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {policy.breachCount > 0 ? (
                <Badge variant="destructive" className="gap-1 text-xs">
                  <AlertOctagon className="h-3.5 w-3.5" />
                  {policy.breachCount} İhlal Kaydı
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                  Hedef Tutuyor
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
