"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  IconPaw,
  IconDog,
  IconCat,
  IconFeather,
  IconFish,
} from "@tabler/icons-react";
import { SearchBarDesktopAnimated } from "@/lib/components/searchbar";
import { SearchBarSyncProvider } from "@/lib/components/searchbar/searchbar-sync-context";
import { FilterParams } from "@/lib/filtering/types";
import { useRouter } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { FilterDialogContext } from "@/lib/contexts/filter-dialog-context";

type Locale = "az" | "en" | "ru";

// Page-specific translations
const notFoundMessages: Record<
  Locale,
  {
    title: string;
    description: string;
    homePage: string;
    viewAds: string;
    popularCategories: string;
    dogs: string;
    cats: string;
    birds: string;
    fish: string;
  }
> = {
  az: {
    title: "Səhifə tapılmadı",
    description:
      "Deyəsən bu səhifə evdən qaçıb! Yeni tüklü dost tapmaq üçün axtarışa başlayın.",
    homePage: "Ana səhifə",
    viewAds: "Elanlara bax",
    popularCategories: "Populyar kateqoriyalar",
    dogs: "İtlər",
    cats: "Pişiklər",
    birds: "Quşlar",
    fish: "Balıqlar",
  },
  en: {
    title: "Page not found",
    description:
      "Looks like this page ran away from home! Start searching to find a new furry friend.",
    homePage: "Home page",
    viewAds: "View ads",
    popularCategories: "Popular categories",
    dogs: "Dogs",
    cats: "Cats",
    birds: "Birds",
    fish: "Fish",
  },
  ru: {
    title: "Страница не найдена",
    description:
      "Похоже, эта страница убежала из дома! Начните поиск, чтобы найти нового пушистого друга.",
    homePage: "Главная",
    viewAds: "Смотреть объявления",
    popularCategories: "Популярные категории",
    dogs: "Собаки",
    cats: "Кошки",
    birds: "Птицы",
    fish: "Рыбы",
  },
};

// Static messages for SearchBar component (each language)
const searchMessages: Record<Locale, Record<string, unknown>> = {
  az: {
    search: {
      searchPlaceholder: "Axtar...",
      recentSearches: "Son axtarışlar",
      clearSearches: "Axtarışları təmizlə",
      noRecentSearches: "Son axtarış yoxdur",
      popularCategories: "Populyar kateqoriyalar",
      resultsFound: "{count} nəticə tapıldı",
      filterBy: "Filtr",
      sortBy: "Sırala",
      adType: "Elan növü",
      category: "Kateqoriya",
      breed: "Cins",
      allAdTypes: "Bütün növlər",
      allCategories: "Bütün kateqoriyalar",
      allBreeds: "Bütün cinslər",
      searchCriteria: "Axtarış meyarları",
      adTypePlaceholder: "Təklif və ya sorğu",
      categoryPlaceholder: "Kateqoriya axtar",
      breedPlaceholder: "Cins",
      selectBreed: "Cins seç",
      selectCategoryFirst: "Əvvəlcə kateqoriya seçin",
      anyType: "Növ",
      allPets: "Kateqoriya",
      anyBreed: "Cins",
      searchQuestion: "Hansı ev heyvanını axtarırsınız?",
      filterSummaryPlaceholder: "Növ • Kateqoriya • Cins",
      searchTitle: "Axtar",
      filterYourSearch: "Axtarışınızı filtrləyin",
      anyAdType: "Növ",
      searchTips: "Axtarış məsləhətləri",
      searchTipsActive:
        "Filtrləri dəyişmək üçün istənilən sahəyə toxunun. Hamısını təmizləmək üçün sıfırdan başlayın.",
      searchTipsInactive:
        "Mükəmməl ev heyvanınızı tapmaq üçün filtrləri seçin. Bir neçə meyar birləşdirə bilərsiniz.",
      clearAll: "Hamısını təmizlə",
      searchButton: "Axtar",
      yearsOld: "yaşında",
      helperText: {
        default: "Mükəmməl ev heyvanı yoldaşınızı tapın",
        withAdType: "{adType} üçün axtar",
        withCategory: "{category} axtar",
        withBreed: "{breed} cinsli {category} axtar",
        withAdTypeAndCategory: "{adType} - {category}",
        withAdTypeAndBreed: "{adType} - {breed} cinsli {category}",
        full: "{adType} - {breed} cinsli {category}",
      },
    },
    common: {
      submit: "Göndər",
      cancel: "Ləğv et",
      confirm: "Təsdiq et",
      pleaseWait: "Gözləyin...",
      save: "Yadda saxla",
      delete: "Sil",
      edit: "Redaktə et",
      close: "Bağla",
      back: "Geri",
      next: "Növbəti",
      previous: "Əvvəlki",
      search: "Axtar",
      filter: "Filtr",
      sort: "Sırala",
      loading: "Yüklənir...",
      allDataLoaded: "Bütün məlumatlar yükləndi",
      adsCount: "{count} elan",
      error: "Xəta",
      success: "Uğurlu",
      noResults: "Nəticə tapılmadı",
      showMore: "Daha çox göstər",
      showLess: "Daha az göstər",
      all: "Hamısı",
      yes: "Bəli",
      no: "Xeyr",
      optional: "İstəyə bağlı",
      required: "Məcburi",
      notSelected: "Seçilməyib",
      adTypes: {
        sale: {
          title: "Satış",
          description: "Satılıq ev heyvanları tapın",
        },
        found: {
          title: "Tapılıb",
          description: "Yaxınlıqda tapılmış heyvanlar",
        },
        lost: {
          title: "İtirilmişdir",
          description: "İtirilmiş heyvanların tapılmasına kömək edin",
        },
        match: {
          title: "Cütləşmə",
          description: "Cütləşmə sorğuları üçün",
        },
        owning: {
          title: "Sahiblənmə",
          description: "Ev axtaran heyvanlar",
        },
      },
    },
    accessibility: {
      userMenu: "İstifadəçi menyusu",
      menu: "Menyu",
      selectLanguage: "Dil seçin",
      openSearch: "Axtarışı aç",
      closeSearch: "Axtarışı bağla",
      clear: "Təmizlə",
      close: "Bağla",
      search: "Axtar",
      share: "Paylaş",
      addToFavorites: "Seçilmişlərə əlavə et",
      removeFromFavorites: "Seçilmişlərdən sil",
      filterOptionsDescription: "Ev heyvanları elanları üçün filtr seçimləri",
      lostPuppyAnimation: "İtirilmiş bala animasiyası",
      previousPage: "Əvvəlki səhifə",
      nextPage: "Növbəti səhifə",
      premiumFeature: "Premium funksiya",
      pageNavigation: "Səhifə naviqasiyası",
      page: "Səhifə {number}",
      viewMode: "Görünüş rejimi",
      gridView: "Şəbəkə görünüşü",
      listView: "Siyahı görünüşü",
      closeMessage: "Mesajı bağla",
      selectAdType: "Elan növünü seç",
      selectCategory: "Kateqoriya seç",
      selectBreed: "Cins seç",
    },
    filters: {
      applyFilters: "Filtrlər",
    },
  },
  en: {
    search: {
      searchPlaceholder: "Search...",
      recentSearches: "Recent searches",
      clearSearches: "Clear searches",
      noRecentSearches: "No recent searches",
      popularCategories: "Popular categories",
      resultsFound: "{count} results found",
      filterBy: "Filter",
      sortBy: "Sort",
      adType: "Ad type",
      category: "Category",
      breed: "Breed",
      allAdTypes: "All types",
      allCategories: "All categories",
      allBreeds: "All breeds",
      searchCriteria: "Search criteria",
      adTypePlaceholder: "Offer or request",
      categoryPlaceholder: "Search category",
      breedPlaceholder: "Breed",
      selectBreed: "Select breed",
      selectCategoryFirst: "Select category first",
      anyType: "Type",
      allPets: "Category",
      anyBreed: "Breed",
      searchQuestion: "What pet are you looking for?",
      filterSummaryPlaceholder: "Type • Category • Breed",
      searchTitle: "Search",
      filterYourSearch: "Filter your search",
      anyAdType: "Type",
      searchTips: "Search tips",
      searchTipsActive:
        "Tap any field to change filters. Start fresh to clear all.",
      searchTipsInactive:
        "Select filters to find your perfect pet. You can combine multiple criteria.",
      clearAll: "Clear all",
      searchButton: "Search",
      yearsOld: "years old",
      helperText: {
        default: "Find your perfect pet companion",
        withAdType: "Search for {adType}",
        withCategory: "Search {category}",
        withBreed: "Search {breed} {category}",
        withAdTypeAndCategory: "{adType} - {category}",
        withAdTypeAndBreed: "{adType} - {breed} {category}",
        full: "{adType} - {breed} {category}",
      },
    },
    common: {
      submit: "Submit",
      cancel: "Cancel",
      confirm: "Confirm",
      pleaseWait: "Please wait...",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      loading: "Loading...",
      allDataLoaded: "All data loaded",
      adsCount: "{count} ads",
      error: "Error",
      success: "Success",
      noResults: "No results found",
      showMore: "Show more",
      showLess: "Show less",
      all: "All",
      yes: "Yes",
      no: "No",
      optional: "Optional",
      required: "Required",
      notSelected: "Not selected",
      adTypes: {
        sale: {
          title: "Sale",
          description: "Find pets for sale",
        },
        found: {
          title: "Found",
          description: "Animals found nearby",
        },
        lost: {
          title: "Lost",
          description: "Help find lost pets",
        },
        match: {
          title: "Mating",
          description: "For mating requests",
        },
        owning: {
          title: "Adoption",
          description: "Pets looking for homes",
        },
      },
    },
    accessibility: {
      userMenu: "User menu",
      menu: "Menu",
      selectLanguage: "Select language",
      openSearch: "Open search",
      closeSearch: "Close search",
      clear: "Clear",
      close: "Close",
      search: "Search",
      share: "Share",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      filterOptionsDescription: "Filter options for pet ads",
      lostPuppyAnimation: "Lost puppy animation",
      previousPage: "Previous page",
      nextPage: "Next page",
      premiumFeature: "Premium feature",
      pageNavigation: "Page navigation",
      page: "Page {number}",
      viewMode: "View mode",
      gridView: "Grid view",
      listView: "List view",
      closeMessage: "Close message",
      selectAdType: "Select ad type",
      selectCategory: "Select category",
      selectBreed: "Select breed",
    },
    filters: {
      applyFilters: "Filters",
    },
  },
  ru: {
    search: {
      searchPlaceholder: "Поиск...",
      recentSearches: "Недавние поиски",
      clearSearches: "Очистить поиски",
      noRecentSearches: "Нет недавних поисков",
      popularCategories: "Популярные категории",
      resultsFound: "Найдено {count} результатов",
      filterBy: "Фильтр",
      sortBy: "Сортировка",
      adType: "Тип объявления",
      category: "Категория",
      breed: "Порода",
      allAdTypes: "Все типы",
      allCategories: "Все категории",
      allBreeds: "Все породы",
      searchCriteria: "Критерии поиска",
      adTypePlaceholder: "Предложение или запрос",
      categoryPlaceholder: "Поиск категории",
      breedPlaceholder: "Порода",
      selectBreed: "Выберите породу",
      selectCategoryFirst: "Сначала выберите категорию",
      anyType: "Тип",
      allPets: "Категория",
      anyBreed: "Порода",
      searchQuestion: "Какого питомца вы ищете?",
      filterSummaryPlaceholder: "Тип • Категория • Порода",
      searchTitle: "Поиск",
      filterYourSearch: "Фильтрация поиска",
      anyAdType: "Тип",
      searchTips: "Советы по поиску",
      searchTipsActive:
        "Нажмите на любое поле, чтобы изменить фильтры. Начните заново, чтобы очистить все.",
      searchTipsInactive:
        "Выберите фильтры, чтобы найти идеального питомца. Можно комбинировать несколько критериев.",
      clearAll: "Очистить все",
      searchButton: "Искать",
      yearsOld: "лет",
      helperText: {
        default: "Найдите идеального питомца",
        withAdType: "Поиск {adType}",
        withCategory: "Поиск {category}",
        withBreed: "Поиск {breed} {category}",
        withAdTypeAndCategory: "{adType} - {category}",
        withAdTypeAndBreed: "{adType} - {breed} {category}",
        full: "{adType} - {breed} {category}",
      },
    },
    common: {
      submit: "Отправить",
      cancel: "Отмена",
      confirm: "Подтвердить",
      pleaseWait: "Подождите...",
      save: "Сохранить",
      delete: "Удалить",
      edit: "Редактировать",
      close: "Закрыть",
      back: "Назад",
      next: "Далее",
      previous: "Предыдущее",
      search: "Поиск",
      filter: "Фильтр",
      sort: "Сортировка",
      loading: "Загрузка...",
      allDataLoaded: "Все данные загружены",
      adsCount: "{count} объявлений",
      error: "Ошибка",
      success: "Успешно",
      noResults: "Результаты не найдены",
      showMore: "Показать больше",
      showLess: "Показать меньше",
      all: "Все",
      yes: "Да",
      no: "Нет",
      optional: "Необязательно",
      required: "Обязательно",
      notSelected: "Не выбрано",
      adTypes: {
        sale: {
          title: "Продажа",
          description: "Найти питомцев на продажу",
        },
        found: {
          title: "Найден",
          description: "Животные, найденные поблизости",
        },
        lost: {
          title: "Потерян",
          description: "Помогите найти потерянных питомцев",
        },
        match: {
          title: "Вязка",
          description: "Для запросов на вязку",
        },
        owning: {
          title: "Усыновление",
          description: "Питомцы, ищущие дом",
        },
      },
    },
    accessibility: {
      userMenu: "Меню пользователя",
      menu: "Меню",
      selectLanguage: "Выберите язык",
      openSearch: "Открыть поиск",
      closeSearch: "Закрыть поиск",
      clear: "Очистить",
      close: "Закрыть",
      search: "Поиск",
      share: "Поделиться",
      addToFavorites: "Добавить в избранное",
      removeFromFavorites: "Удалить из избранного",
      filterOptionsDescription: "Параметры фильтра для объявлений о питомцах",
      lostPuppyAnimation: "Анимация потерянного щенка",
      previousPage: "Предыдущая страница",
      nextPage: "Следующая страница",
      premiumFeature: "Премиум функция",
      pageNavigation: "Навигация по страницам",
      page: "Страница {number}",
      viewMode: "Режим просмотра",
      gridView: "Сетка",
      listView: "Список",
      closeMessage: "Закрыть сообщение",
      selectAdType: "Выберите тип объявления",
      selectCategory: "Выберите категорию",
      selectBreed: "Выберите породу",
    },
    filters: {
      applyFilters: "Фильтры",
    },
  },
};

// Detect locale from cookie or browser
function detectLocale(): Locale {
  if (typeof window === "undefined") return "az";

  // 1. Check NEXT_LOCALE cookie
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "NEXT_LOCALE" && ["az", "en", "ru"].includes(value)) {
      return value as Locale;
    }
  }

  // 2. Check browser language
  const browserLang = navigator.language.split("-")[0];
  if (["az", "en", "ru"].includes(browserLang)) {
    return browserLang as Locale;
  }

  return "az";
}

const WomanHoldingDogAnimation = dynamic(
  () => import("@/lib/components/animations/woman-holding-dog"),
  { ssr: false },
);

export default function NotFound() {
  const router = useRouter();
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("az");
  const [isClient, setIsClient] = useState(false);

  // Detect locale on client
  useEffect(() => {
    setIsClient(true);
    setLocale(detectLocale());
  }, []);

  const t = notFoundMessages[locale];
  const messages = searchMessages[locale];

  const updateFilters = useCallback(
    (filters: Partial<FilterParams>) => {
      const params = new URLSearchParams();
      if (filters["ad-type"]) params.set("ad-type", String(filters["ad-type"]));
      if (filters.category) params.set("category", String(filters.category));
      if (filters.breed) params.set("breed", String(filters.breed));
      router.push(`/${locale}/ads/s?${params.toString()}`);
    },
    [router, locale],
  );

  const initialValues = useMemo(
    () => ({
      adType: null,
      category: null,
      breed: null,
    }),
    [],
  );

  const filters = useMemo(() => ({}) as FilterParams, []);
  const isSearchRoute = false;

  // FilterDialogContext value
  const filterDialogValue = useMemo(
    () => ({
      isOpen: isFilterDialogOpen,
      openDialog: () => setIsFilterDialogOpen(true),
      closeDialog: () => setIsFilterDialogOpen(false),
    }),
    [isFilterDialogOpen],
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <FilterDialogContext.Provider value={filterDialogValue}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30 flex items-center justify-center px-4 py-8 overflow-visible relative">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient orbs */}
            <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-gradient-to-br from-purple-200/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-gradient-to-tl from-indigo-200/20 to-transparent rounded-full blur-3xl" />

            {/* Floating paws - only a few subtle ones */}
            <div
              className="absolute top-[10%] right-[15%] animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <IconPaw className="w-8 h-8 text-purple-200/40 rotate-[15deg]" />
            </div>
            <div
              className="absolute bottom-[20%] left-[10%] animate-bounce"
              style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
            >
              <IconPaw className="w-6 h-6 text-indigo-200/40 rotate-[-20deg]" />
            </div>
            <div
              className="absolute top-[30%] left-[5%] animate-bounce"
              style={{ animationDuration: "4.5s", animationDelay: "1s" }}
            >
              <IconPaw className="w-5 h-5 text-purple-200/30 rotate-[25deg]" />
            </div>
          </div>

          {/* Main content - split layout */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-6xl">
            {/* Left side - Large Animation */}
            <div className="flex-shrink-0 relative">
              {/* Glow effect behind animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl scale-110" />
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px]">
                <WomanHoldingDogAnimation />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg">
              {/* Simple 404 */}
              <div className="mb-6">
                <span className="text-8xl sm:text-9xl lg:text-[180px] font-black text-neutral-800 leading-none tracking-tight">
                  404
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 tracking-tight leading-tight">
                {t.title}
              </h1>

              <p className="text-neutral-500 mt-3 text-base max-w-md">
                {t.description}
              </p>

              {/* Search bar */}
              {isClient && (
                <div className="mt-6 w-full relative z-50">
                  <SearchBarSyncProvider
                    initialValues={initialValues}
                    updateUrlFilters={updateFilters}
                    currentUrlFilters={filters}
                    isSearchRoute={isSearchRoute}
                  >
                    <SearchBarDesktopAnimated
                      key={`${filters["ad-type"] ?? ""}-${filters.category ?? ""}-${filters.breed ?? ""}`}
                      hideFilterButton
                      dropdownDirection="up"
                      className="!mx-0 !ml-0 justify-center lg:justify-start"
                    />
                  </SearchBarSyncProvider>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-6">
                <Link
                  href={`/${locale}`}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  {t.homePage}
                </Link>
                <Link
                  href={`/${locale}/ads`}
                  className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <span className="flex items-center gap-2">
                    {t.viewAds}
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Category pills */}
              <div className="mt-8 w-full">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3 font-medium">
                  {t.popularCategories}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <Link
                    href={`/${locale}/ads/s?category=1`}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200/80 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm"
                  >
                    <IconDog className="w-4 h-4 text-purple-500" />
                    <span className="text-neutral-600 group-hover:text-purple-700">
                      {t.dogs}
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/ads/s?category=2`}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200/80 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                  >
                    <IconCat className="w-4 h-4 text-blue-500" />
                    <span className="text-neutral-600 group-hover:text-blue-700">
                      {t.cats}
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/ads/s?category=3`}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200/80 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-sm"
                  >
                    <IconFeather className="w-4 h-4 text-emerald-500" />
                    <span className="text-neutral-600 group-hover:text-emerald-700">
                      {t.birds}
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/ads/s?category=4`}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200/80 hover:border-cyan-300 hover:bg-cyan-50 transition-all text-sm"
                  >
                    <IconFish className="w-4 h-4 text-cyan-500" />
                    <span className="text-neutral-600 group-hover:text-cyan-700">
                      {t.fish}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FilterDialogContext.Provider>
    </NextIntlClientProvider>
  );
}
