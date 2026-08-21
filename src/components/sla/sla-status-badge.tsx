"use client";

import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SLAStatusBadgeProps {
  stageName: string;
  createdAt: string; // ISO string
  slaHours?: number;
}

export function SLAStatusBadge({
  stageName,
  createdAt,
  slaHours = 4,
}: SLAStatusBadgeProps) {
  const created = new Date(createdAt).getTime();
  const now = new Date().getTime();
  const elapsedHours = (now - created) / (1000 * 60 * 60);
  const remainingHours = slaHours - elapsedHours;

  let status: "OK" | "WARNING" | "BREACHED" = "OK";
  if (remainingHours <= 0) {
    status = "BREACHED";
  } else if (remainingHours <= 1) {
    status = "WARNING";
  }

  if (status === "BREACHED") {
    return (
      <Badge
        variant="destructive"
        className="gap-1 px-2 py-0.5 text-[10px] font-semibold animate-pulse"
        title={`${stageName} aşamasında SLA süresi aşıldı! (${Math.abs(Math.round(remainingHours * 60))} dk gecikme)`}
      >
        <AlertTriangle className="h-3 w-3" />
        SLA Aşımı ({Math.abs(Math.round(remainingHours * 60))} dk)
      </Badge>
    );
  }

  if (status === "WARNING") {
    return (
      <Badge
        variant="outline"
        className="gap-1 px-2 py-0.5 text-[10px] font-semibold border-amber-500/50 bg-amber-500/10 text-amber-500"
        title={`${stageName} aşamasında SLA dolmak üzere!`}
      >
        <Clock className="h-3 w-3 animate-spin" />
        SLA Uyarısı ({Math.round(remainingHours * 60)} dk kaldı)
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="gap-1 px-2 py-0.5 text-[10px] text-muted-foreground font-normal"
    >
      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
      SLA Uygun ({Math.round(remainingHours)} saat)
    </Badge>
  );
}
