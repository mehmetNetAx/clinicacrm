"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_SCORING_RULES, ScoringRule, calculatePatientScore } from "@/lib/scoring/lead-scorer";
import { Sparkles, Plus, Trash2, Sliders, CheckCircle, Flame } from "lucide-react";

export function ScoringRulesDrawer() {
  const [rules, setRules] = useState<ScoringRule[]>(DEFAULT_SCORING_RULES);
  const [newRuleName, setNewRuleName] = useState("");
  const [newPoints, setNewPoints] = useState("15");

  // Test state
  const testData = {
    country: "United Kingdom",
    budget_eur: 5500,
    treatment_category: "Dental Implants",
    priority: "URGENT",
    whatsapp_replied: true,
  };

  const testResult = calculatePatientScore(testData, rules);

  const handleAddRule = () => {
    if (!newRuleName.trim()) return;
    const rule: ScoringRule = {
      id: `rule-${Date.now()}`,
      rule_name: newRuleName,
      category: "ENGAGEMENT",
      condition_key: "whatsapp_replied",
      operator: "EQUALS",
      condition_value: "true",
      score_points: parseInt(newPoints) || 10,
      status: "ACTIVE",
    };
    setRules([...rules, rule]);
    setNewRuleName("");
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2 border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
            <Sparkles className="h-4 w-4" />
            Zia AI Skorlama Kuralları
          </Button>
        }
      />
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 text-amber-500">
            <Sparkles className="h-5 w-5" />
            <SheetTitle className="text-lg font-bold">Dinamik Hasta Skorlama Motoru</SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Zoho Zia AI mantığıyla hasta lokasyonu, bütçesi, tedavi ilgisi ve WhatsApp yanıt hızına dayalı puanlama kurallarını yönetin.
          </SheetDescription>
        </SheetHeader>

        {/* Live Simulation Card */}
        <div className="my-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1">
              <Flame className="h-4 w-4" /> Canlı Skorlama Simülasyonu
            </span>
            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold">
              {testResult.tier} ({testResult.totalScore} Puan)
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            Test Hasta: <span className="font-medium text-foreground">John Smith (UK)</span> - Bütçe: <span className="font-medium text-foreground">5.500 €</span> - Diş Tedavisi
          </p>

          <div className="space-y-1 border-t border-amber-500/20 pt-2">
            {testResult.matchedRules.map((m, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-400" /> {m.ruleName}
                </span>
                <span className="font-bold text-amber-400">+{m.points} pt</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-3 py-2">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sliders className="h-3.5 w-3.5" /> Aktif Puanlama Kuralları ({rules.length})
          </h4>

          <div className="space-y-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm hover:border-accent transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{rule.rule_name}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {rule.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Koşul: <code className="text-primary font-mono text-[11px]">{rule.condition_key} {rule.operator} {rule.condition_value}</code>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-emerald-400">+{rule.score_points} pt</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Rule Form */}
          <div className="mt-6 rounded-lg border border-dashed border-border p-4 space-y-3">
            <h5 className="text-xs font-semibold">Yeni Skorlama Kuralı Ekle</h5>
            <div className="space-y-2">
              <Label className="text-xs">Kural Başlığı</Label>
              <Input
                placeholder="Örn: 24 Saat İçi Teklif Onayı"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Eklenecek Puan</Label>
              <Input
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
              />
            </div>
            <Button onClick={handleAddRule} className="w-full gap-2 text-xs" size="sm">
              <Plus className="h-3.5 w-3.5" /> Kuralı Oluştur
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
