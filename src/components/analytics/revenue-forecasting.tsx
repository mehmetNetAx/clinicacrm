'use client';

import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Sparkles, 
  ArrowUpRight, 
  Calendar,
  PieChart
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function AIRevenueForecasting() {
  const forecastMonths = [
    { month: 'Ağustos 2026', projected: 145000, actual: 138000, growth: '+12.4%' },
    { month: 'Eylül 2026', projected: 168000, actual: 0, growth: '+15.8%' },
    { month: 'Ekim 2026', projected: 192000, actual: 0, growth: '+14.2%' },
    { month: 'Kasım 2026', projected: 215000, actual: 0, growth: '+18.1%' },
  ];

  const microSegmentRevenue = [
    { name: 'Kardiyoloji Hipertansiyon Riski (SEG-CARDIO)', estRevenue: '€48,500', patientCount: 28, convRate: '78%' },
    { name: 'Diyabet HbA1c Takip Açığı (SEG-DIABETES)', estRevenue: '€34,200', patientCount: 42, convRate: '82%' },
    { name: 'Sağlık Turizmi Saç Ekimi (SEG-TOURISM)', estRevenue: '€82,000', patientCount: 31, convRate: '65%' },
    { name: 'Onkolojik Önleyici Check-Up (SEG-ONCO)', estRevenue: '€27,800', patientCount: 19, convRate: '71%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Gelecek 90 Günlük AI Gelir Projeksiyonu</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">€575,000</h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="h-4 w-4" />
            <span>Geçen çeyreğe göre %16.4 artış tahmini</span>
          </div>
        </Card>

        <Card className="p-4 bg-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Tahmini Yeni Hasta Hacmi</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">245 Hasta</h3>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Otonom SDR Ajanları Tarafından Niteliklendirildi</span>
          </div>
        </Card>

        <Card className="p-4 bg-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Ortalama Tedavi Paketi Getirisi</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">€2,347 / Hasta</h3>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            AI Sales Coach Upsell Etkisi: <strong>+€380 / Hasta</strong>
          </div>
        </Card>

        <Card className="p-4 bg-card">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Klinik Kural Dönüşüm Oranı</span>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">%74.8</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Reasoning Engine Doğruluk Oranı: %94
          </div>
        </Card>
      </div>

      {/* Monthly Projections & Segment Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Forecast Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Aylık AI Gelir ve Hacim Projeksiyonları
            </CardTitle>
            <CardDescription>
              Tableau & AI Data Cloud destekli hassas gelir tahminleme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {forecastMonths.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{item.month}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{item.growth}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-muted-foreground text-xs">Tahmin: €{item.projected.toLocaleString()}</span>
                  <span className="text-foreground">
                    {item.actual > 0 ? `Gerçekleşen: €${item.actual.toLocaleString()}` : 'Projeksiyon Aşamasında'}
                  </span>
                </div>
                <Progress value={item.actual > 0 ? (item.actual / item.projected) * 100 : 75} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Micro-Segment Revenue Forecast */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Mikro-Segment Bazlı Potansiyel Gelir Dağılımı
            </CardTitle>
            <CardDescription>
              Klinik mikro-segmentlerden beklenen tahmini satış hacmi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {microSegmentRevenue.map((seg, idx) => (
              <div key={idx} className="p-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{seg.name}</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border-emerald-200">
                    {seg.estRevenue}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>Eşleşen Hasta: <strong>{seg.patientCount} Kişi</strong></span>
                  <span>Tahmini Dönüşüm: <strong>{seg.convRate}</strong></span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
