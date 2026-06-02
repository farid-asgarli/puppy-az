'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { AdDetail } from '@/lib/tapaz';

interface Category {
  id: number;
  title: string;
}

interface Breed {
  id: number;
  title: string;
  categoryId: number;
}

interface City {
  id: number;
  name: string;
}

interface Confidence {
  category: 'high' | 'medium' | 'low';
  breed: 'high' | 'medium' | 'low';
  city: 'high' | 'medium' | 'low';
  gender: 'high' | 'medium' | 'low';
  age: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  title: string;
  description: string;
  ageInMonths: number | null;
  gender: number | null;
  adType: number;
  color: string;
  weight: number | null;
  size: number | null;
  price: number;
  cityId: number | null;
  petBreedId: number | null;
  petCategoryId: number | null;
  confidence: Confidence;
  reasoning: string;
}

interface LookupData {
  categories: Category[];
  breeds: Breed[];
  cities: City[];
  colors: string[];
}

interface FormState {
  title: string;
  description: string;
  ageInMonths: string;
  gender: string;
  adType: string;
  color: string;
  weight: string;
  size: string;
  price: string;
  cityId: string;
  petBreedId: string;
  petCategoryId: string;
}

interface ImportAdFormProps {
  detail: AdDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GENDER_OPTIONS = [
  { value: '0', label: 'Bilinmir' },
  { value: '1', label: 'Erkək' },
  { value: '2', label: 'Dişi' },
];

const SIZE_OPTIONS = [
  { value: '', label: 'Seçilməyib' },
  { value: '1', label: 'Çox kiçik' },
  { value: '2', label: 'Kiçik' },
  { value: '3', label: 'Orta' },
  { value: '4', label: 'Böyük' },
  { value: '5', label: 'Çox böyük' },
];

const AD_TYPE_OPTIONS = [
  { value: '1', label: 'Satış' },
  { value: '2', label: 'Cütləşmə' },
  { value: '3', label: 'Tapılıb' },
  { value: '4', label: 'İtirilmiş' },
  { value: '5', label: 'Sahib olma' },
];

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const config = {
    high: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', label: 'Yüksək' },
    medium: { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Orta' },
    low: { color: 'text-red-600 bg-red-50 border-red-200', label: 'Aşağı' },
  };
  const c = config[level];
  return <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${c.color}`}>{c.label}</span>;
}

export function ImportAdForm({ detail, open, onOpenChange }: ImportAdFormProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [lookup, setLookup] = useState<LookupData | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [reasoning, setReasoning] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    ageInMonths: '',
    gender: '0',
    adType: '1',
    color: '',
    weight: '',
    size: '',
    price: '',
    cityId: '',
    petBreedId: '',
    petCategoryId: '',
  });

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Filter breeds by selected category
  const filteredBreeds = useMemo(() => {
    if (!lookup) return [];
    const catId = form.petCategoryId ? Number(form.petCategoryId) : null;
    if (!catId) return lookup.breeds;
    return lookup.breeds.filter((b) => b.categoryId === catId);
  }, [lookup, form.petCategoryId]);

  // Run AI analysis when dialog opens
  const runAnalysis = useCallback(async () => {
    setAnalyzing(true);
    setAnalyzeError(null);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: detail.title,
          description: detail.body,
          price: detail.price,
          region: detail.region,
          properties: detail.properties,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Analysis failed (${res.status})`);
      }

      const data: { analysis: AnalysisResult; lookup: LookupData } = await res.json();
      const a = data.analysis;

      setLookup(data.lookup);
      setConfidence(a.confidence);
      setReasoning(a.reasoning);
      setForm({
        title: a.title || detail.title,
        description: a.description || detail.body || '',
        ageInMonths: a.ageInMonths != null ? String(a.ageInMonths) : '',
        gender: a.gender != null ? String(a.gender) : '0',
        adType: String(a.adType || 1),
        color: a.color || '',
        weight: a.weight != null ? String(a.weight) : '',
        size: a.size != null ? String(a.size) : '',
        price: String(a.price ?? detail.price ?? 0),
        cityId: a.cityId != null ? String(a.cityId) : '',
        petBreedId: a.petBreedId != null ? String(a.petBreedId) : '',
        petCategoryId: a.petCategoryId != null ? String(a.petCategoryId) : '',
      });
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [detail]);

  useEffect(() => {
    if (open) {
      runAnalysis();
    }
  }, [open, runAnalysis]);

  // Reset breed when category changes
  useEffect(() => {
    if (!form.petCategoryId) return;
    const catId = Number(form.petCategoryId);
    const currentBreed = lookup?.breeds.find((b) => b.id === Number(form.petBreedId));
    if (currentBreed && currentBreed.categoryId !== catId) {
      updateField('petBreedId', '');
    }
  }, [form.petCategoryId, form.petBreedId, lookup, updateField]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        ageInMonths: form.ageInMonths ? Number(form.ageInMonths) : null,
        gender: form.gender ? Number(form.gender) : null,
        adType: Number(form.adType),
        color: form.color,
        weight: form.weight ? Number(form.weight) : null,
        size: form.size ? Number(form.size) : null,
        price: Number(form.price) || 0,
        cityId: Number(form.cityId),
        districtId: null,
        petBreedId: form.petBreedId ? Number(form.petBreedId) : null,
        petCategoryId: form.petCategoryId ? Number(form.petCategoryId) : null,
      };

      if (!payload.cityId) {
        setSubmitResult({ success: false, message: 'Şəhər seçilməlidir' });
        setSubmitting(false);
        return;
      }

      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Import failed (${res.status})`);
      }

      const data = await res.json();
      setSubmitResult({ success: true, message: `Elan uğurla yaradıldı! (ID: ${data.id})` });
    } catch (err) {
      setSubmitResult({ success: false, message: err instanceof Error ? err.message : 'Import failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            puppy.az-a import et
          </DialogTitle>
          <DialogDescription>AI elanı analiz edib sahələri avtomatik doldurdu. Yoxlayın və lazım olanları düzəldin.</DialogDescription>
        </DialogHeader>

        {/* AI Analysis State */}
        {analyzing && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">AI elanı analiz edir...</p>
          </div>
        )}

        {analyzeError && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm text-destructive font-medium">{analyzeError}</p>
            <button onClick={runAnalysis} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
              Yenidən cəhd et
            </button>
          </div>
        )}

        {/* Form */}
        {!analyzing && !analyzeError && (
          <div className="space-y-6 pt-2">
            {/* AI reasoning */}
            {reasoning && (
              <div className="bg-muted/50 border border-border rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Sparkles className="size-3" /> AI Analizi
                </p>
                <p className="text-sm text-foreground/80">{reasoning}</p>
              </div>
            )}

            {/* Row: Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Başlıq</Label>
              <Input id="title" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Elanın başlığı" />
            </div>

            {/* Row: Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Təsvir</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Elanın təsviri"
                rows={4}
              />
            </div>

            {/* Row: Category & Breed */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Kateqoriya</Label>
                  {confidence?.category && <ConfidenceBadge level={confidence.category} />}
                </div>
                <Select value={form.petCategoryId} onValueChange={(v) => updateField('petCategoryId', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kateqoriya seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookup?.categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Cins</Label>
                  {confidence?.breed && <ConfidenceBadge level={confidence.breed} />}
                </div>
                <Select value={form.petBreedId} onValueChange={(v) => updateField('petBreedId', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Cins seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBreeds.map((breed) => (
                      <SelectItem key={breed.id} value={String(breed.id)}>
                        {breed.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: City & Ad Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Şəhər</Label>
                  {confidence?.city && <ConfidenceBadge level={confidence.city} />}
                </div>
                <Select value={form.cityId} onValueChange={(v) => updateField('cityId', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Şəhər seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookup?.cities.map((city) => (
                      <SelectItem key={city.id} value={String(city.id)}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Elan növü</Label>
                <Select value={form.adType} onValueChange={(v) => updateField('adType', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AD_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: Gender & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Cins(iyyət)</Label>
                  {confidence?.gender && <ConfidenceBadge level={confidence.gender} />}
                </div>
                <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="age">Yaş (ay)</Label>
                  {confidence?.age && <ConfidenceBadge level={confidence.age} />}
                </div>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={form.ageInMonths}
                  onChange={(e) => updateField('ageInMonths', e.target.value)}
                  placeholder="Ay ilə yaşı"
                />
              </div>
            </div>

            {/* Row: Color & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rəng</Label>
                <Select value={form.color} onValueChange={(v) => updateField('color', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Rəng seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookup?.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ölçü</Label>
                <Select value={form.size} onValueChange={(v) => updateField('size', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ölçü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: Price & Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Qiymət (₼)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Çəki (kq)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Submit result */}
            {submitResult && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium ${
                  submitResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {submitResult.success ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
                {submitResult.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => onOpenChange(false)}
                className="px-5 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Ləğv et
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || submitResult?.success === true}
                className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {submitResult?.success ? 'Yaradıldı ✓' : 'puppy.az-a əlavə et'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
