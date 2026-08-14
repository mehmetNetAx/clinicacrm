'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  Lightbulb, 
  Zap, 
  Bot,
  DollarSign
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AISalesCoachProps {
  patientName?: string;
  treatmentType?: string;
  leadValueEur?: number;
}

export function AISalesCoach({
  patientName = 'Ahmet Yılmaz',
  treatmentType = 'Saç Ekimi & FUE Tedavisi',
  leadValueEur = 2800
}: AISalesCoachProps) {
  const [objectionHandled, setObjectionHandled] = useState<string | null>(null);

  const objectionTips = [
    {
      id: 'price',
      title: 'Fiyat İtirazı ("Diğer klinikler daha ucuz")',
      recommendation: 'VIP Transfer, 5 Yıldızlı Otel Konaklaması ve Medikal Garanti Sertifikasını vurgulayın. Fiyattan ziyade paket kapsamındaki klinik kaliteye ve ekstralara odaklanın.',
      script: `"Ahmet Bey, haklısınız ancak sunduğumuz pakete 5 yıldızlı otel, VIP transfer ve 10 yıl garantili safir FUE uç teknolojisi dahildir."`
    },
    {
      id: 'time',
      title: 'Zaman & İyileşme Süresi Endişesi',
      recommendation: 'İğnesiz anestezi ve Mikro-FUE tekniği sayesinde 3 gün içinde sosyal hayata dönüş garantisi sunulduğunu iletin.',
      script: `"Ağrısız teknoloji sayesinde işlemden 48 saat sonra normal günlük aktivitenize dönebilirsiniz."`
    },
    {
      id: 'guarantee',
      title: 'Sonuç Garantisi Sorusu',
      recommendation: 'Before/After Medikal Galeri örneklerini WhatsApp üzerinden iletin ve onaylı onam sertifikasından bahsedin.',
      script: `"Klinigimizde uygulanan işlemler yazılı garanti sertifikası ile koruma altındadır. Size benzer vakaların sonuçlarını iletebilirim."`
    }
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                AI Sales Coach (Canlı Satış Koçu)
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Real-Time AI
                </Badge>
              </CardTitle>
              <CardDescription>
                {patientName} için anlık görüşme ve fırsat dönüştürme tavsiyeleri
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Tahmini Fırsat Değeri</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              €{leadValueEur.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Patient Sentiment & Conversion Probability */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1 text-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Tahmini Satış Dönüşüm Olasılığı
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">%84</span>
          </div>
          <Progress value={84} className="h-2 bg-slate-200 dark:bg-slate-800" />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground">
            <span>Hasta Eğilimi: <strong>Yüksek İlgi (HOT Lead)</strong></span>
            <span>Önerilen İletişim Kanalı: <strong>WhatsApp Voice Note</strong></span>
          </div>
        </div>

        {/* Real-time Objection Handling Suggestions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Canlı İtiraz Karşılama ve Konuşma Metinleri (Scripts)
          </h4>
          <div className="space-y-2">
            {objectionTips.map((tip) => (
              <div 
                key={tip.id} 
                className="p-3 rounded-lg border bg-card hover:border-primary/40 transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span className="flex items-center gap-1.5 text-primary">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {tip.title}
                  </span>
                  <Button 
                    size="xs" 
                    variant={objectionHandled === tip.id ? 'default' : 'outline'}
                    className="h-6 text-[11px] px-2"
                    onClick={() => setObjectionHandled(tip.id)}
                  >
                    {objectionHandled === tip.id ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Kullanıldı
                      </>
                    ) : (
                      'Metni Kullan'
                    )}
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  <strong>Strateji:</strong> {tip.recommendation}
                </p>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 border-l-2 border-primary">
                  {tip.script}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upsell Cross-sell Package Suggestion */}
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <DollarSign className="h-4 w-4" /> AI Upsell Önerisi: PRP + Ozon Tedavi Paketi
            </span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Hasta Saç Ekimi paketi alırken PRP eklemesi durumunda %15 indirim fırsatı sunulabilir (+€450 ek gelir).
            </p>
          </div>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
            +€450 Upsell
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
