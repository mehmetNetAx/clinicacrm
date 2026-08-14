'use client';

import { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  Clock,
  Coins
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReasoningResult } from '@/lib/ai/reasoning-engine';
import { DEFAULT_AGENT_GUARDRAILS } from '@/lib/ai/guardrails';

interface ReasoningLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reasoningResult?: ReasoningResult | null;
  patientName?: string;
  onSeamlessHandoff?: () => void;
}

export function ReasoningLogDrawer({
  isOpen,
  onClose,
  reasoningResult,
  patientName = 'Hasta',
  onSeamlessHandoff
}: ReasoningLogDrawerProps) {
  const [handoffDone, setHandoffDone] = useState(false);

  if (!reasoningResult) return null;

  const guardrail = DEFAULT_AGENT_GUARDRAILS['appointment-agent'];

  const handleHandoff = () => {
    setHandoffDone(true);
    if (onSeamlessHandoff) {
      onSeamlessHandoff();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  AI Reasoning Log Transparency & Decision Trace
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
                    <ShieldCheck className="h-3 w-3 mr-1" /> PHI Masked
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {patientName} için yapay zeka karar mekanizması adımları ve şeffaf akıl yürütme günlüğü
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Karar Özeti & Öncelik
              </span>
              <Badge 
                className={
                  reasoningResult.priority === 'URGENT' 
                    ? 'bg-rose-500 text-white' 
                    : reasoningResult.priority === 'MEDIUM' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-emerald-600 text-white'
                }
              >
                {reasoningResult.priority} PREFERENCE
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground mb-3">
              {reasoningResult.reasoningSummary}
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border">
                <span className="text-muted-foreground block mb-0.5">Tavsiye Branş</span>
                <span className="font-semibold text-foreground">{reasoningResult.recommendedCategory}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border">
                <span className="text-muted-foreground block mb-0.5">AI Güven Skoru</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">%{reasoningResult.confidence}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border">
                <span className="text-muted-foreground block mb-0.5">Sigorta Ön Yetkilendirme</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {reasoningResult.preAuthNeeded ? `Gerekli (%${reasoningResult.preAuthProbability})` : 'Gerekmiyor'}
                </span>
              </div>
            </div>
          </div>

          {/* Guardrails & Flex Credits Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Coins className="h-4 w-4" />
              <span>
                <strong>Agent Guardrail Status:</strong> Session Turn 1/{guardrail.maxTurnsPerSession} | Used Budget: ${guardrail.usedBudgetUsd} / ${guardrail.monthlyBudgetLimitUsd} USD
              </span>
            </div>
            <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
              Strict Mode Active
            </Badge>
          </div>

          {/* Step-by-Step Reasoning Trace */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Şeffaf Akıl Yürütme Adımları (Step-by-Step Trace)
            </h4>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {reasoningResult.traceSteps.map((step) => {
                let StepIcon = CheckCircle2;
                let iconColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950';

                if (step.status === 'WARNING') {
                  StepIcon = AlertTriangle;
                  iconColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950';
                } else if (step.status === 'FAILED') {
                  StepIcon = XCircle;
                  iconColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950';
                } else if (step.status === 'INFO') {
                  StepIcon = Info;
                  iconColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950';
                }

                return (
                  <div key={step.stepIndex} className="relative pl-9 space-y-1">
                    <div className={`absolute left-1 top-1 p-1 rounded-full border ${iconColor}`}>
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <div className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-foreground">
                          Adım {step.stepIndex}: {step.title}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px]">
                          <Clock className="h-3 w-3" /> {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                      {step.ruleCode && (
                        <div className="mt-2 pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            Rule: {step.ruleCode}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Status: {step.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex items-center justify-between sm:justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Agentforce Trust Layer HIPAA Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Kapat
            </Button>
            <Button 
              size="sm" 
              className={handoffDone ? 'bg-emerald-600 text-white' : 'bg-primary text-primary-foreground'}
              onClick={handleHandoff}
              disabled={handoffDone}
            >
              {handoffDone ? (
                <>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Temsilciye Devredildi (Seamless Hand-off)
                </>
              ) : (
                <>
                  <UserCheck className="mr-1.5 h-4 w-4" /> Seamless Hand-off (İnsana Devret)
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
