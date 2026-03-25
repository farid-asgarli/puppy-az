import { getAds } from '@/lib/tapaz';
import { AdGrid } from '@/components/ad-grid';
import { Search } from 'lucide-react';

const categories = [
  { icon: '🐕', label: 'İtlər' },
  { icon: '🐈', label: 'Pişiklər' },
  { icon: '🐦', label: 'Quşlar' },
  { icon: '🐟', label: 'Balıqlar' },
  { icon: '🐹', label: 'Gəmiricilər' },
  { icon: '🐢', label: 'Sürünənlər' },
  { icon: '🐴', label: 'Atlar' },
  { icon: '🐰', label: 'Dovşanlar' },
  { icon: '🦜', label: 'Tutuquşular' },
  { icon: '🎾', label: 'Aksesuarlar' },
  { icon: '🦴', label: 'Yem' },
  { icon: '🏥', label: 'Veterinar' },
];

export default async function Home() {
  const { nodes: initialAds, pageInfo: initialPageInfo } = await getAds(24);

  return (
    <div className="min-h-screen bg-background">
      {/* Airbnb-style header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-630 mx-auto px-4 sm:px-6 md:px-10 xl:px-20">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-primary text-3xl leading-none">🐾</span>
              <span className="text-xl font-bold text-primary hidden md:block">tap.az</span>
            </a>

            {/* Search pill */}
            <div className="flex-1 max-w-lg mx-auto">
              <div className="flex items-center border border-border rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
                <div className="flex-1 px-5 py-2.5">
                  <span className="text-sm font-semibold">Heyvanlar</span>
                </div>
                <div className="hidden sm:block border-l border-border px-5 py-2.5">
                  <span className="text-sm text-muted-foreground">Bütün bölgələr</span>
                </div>
                <div className="hidden sm:block border-l border-border px-5 py-2.5">
                  <span className="text-sm text-muted-foreground">{initialAds.length}+ elan</span>
                </div>
                <div className="p-2 pr-2.5">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <Search className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right placeholder */}
            <div className="hidden sm:flex items-center shrink-0">
              <span className="text-sm font-medium text-foreground">Elanlar</span>
            </div>
          </div>
        </div>
      </header>

      {/* Category strip */}
      <div className="sticky top-16 sm:top-20 z-40 bg-background border-b border-border">
        <div className="max-w-630 mx-auto px-4 sm:px-6 md:px-10 xl:px-20">
          <div className="flex items-end gap-8 overflow-x-auto scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={cat.label}
                className={`flex flex-col items-center gap-1.5 min-w-fit pt-3 pb-3 border-b-2 transition-all ${
                  i === 0 ? 'border-foreground opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-muted-foreground/40'
                }`}
              >
                <span className="text-2xl leading-none">{cat.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <main className="max-w-630 mx-auto px-4 sm:px-6 md:px-10 xl:px-20 pt-6 pb-10">
        <AdGrid initialAds={initialAds} initialPageInfo={initialPageInfo} />
      </main>

      {/* Airbnb-style footer */}
      <footer className="bg-muted border-t border-border">
        <div className="max-w-630 mx-auto px-4 sm:px-6 md:px-10 xl:px-20">
          <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-semibold mb-3">Dəstək</h3>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>Elanlar hər 60 saniyədə yenilənir</li>
                <li>Heyvanlar kateqoriyası</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Kateqoriyalar</h3>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>İtlər və pişiklər</li>
                <li>Quşlar və balıqlar</li>
                <li>Aksesuarlar</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Haqqında</h3>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>tap.az scraper</li>
                <li>Bütün elanlar tap.az-dandır</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">&copy; 2026 tap.az Heyvanlar</p>
            <p className="text-sm text-muted-foreground">🐾 Puppy Az</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
