"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PetAdType, PetBreedDto } from "@/lib/api/types/pet-ad.types";
import { getPetBreedsAction, suggestBreedAction } from "@/lib/auth/actions";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import {
  ViewFooter,
  ViewLayout,
  LoadingState,
  SearchInput,
} from "../components";
import { OptionCard } from "@/lib/components/views/ad-placement";
import { Heading, Text } from "@/lib/primitives/typography";
import { cn } from "@/lib/external/utils";

/**
 * Breed Selection View
 * Step 2: Choose pet breed with search functionality
 * Users can suggest a new breed if they can't find theirs
 */
export default function BreedView() {
  const t = useTranslations("adPlacementDetails.breedView");
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [breeds, setBreeds] = useState<PetBreedDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBreedId, setSelectedBreedId] = useState<number | null>(
    formData.petBreedId,
  );

  // Breed suggestion state
  const savedSuggestion = formData.suggestedBreedName ?? "";
  const [isSuggesting, setIsSuggesting] = useState(savedSuggestion.length > 0);
  const [suggestedName, setSuggestedName] = useState(savedSuggestion);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);

  // Check if breed is optional for current ad type (Found=2, Owning=5)
  const isBreedOptional =
    formData.adType === PetAdType.Found || formData.adType === PetAdType.Owning;

  // Fetch breeds based on selected category using Server Action
  useEffect(() => {
    const fetchBreeds = async () => {
      if (!formData.categoryId) {
        navigateWithTransition("/ads/ad-placement/category");
        return;
      }

      try {
        setLoading(true);
        const result = await getPetBreedsAction(formData.categoryId);
        if (result.success) {
          setBreeds(result.data);
        } else {
          console.error("Failed to fetch breeds:", result.error);
        }
      } catch (error) {
        console.error("Failed to fetch breeds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, [formData.categoryId, navigateWithTransition]);

  // Filter breeds based on search query
  const filteredBreeds = useMemo(() => {
    if (!searchQuery.trim()) return breeds;

    const query = searchQuery.toLowerCase();
    return breeds.filter((breed) => breed.title.toLowerCase().includes(query));
  }, [breeds, searchQuery]);

  const handleSelect = (breedId: number) => {
    setSelectedBreedId(breedId);
    setIsSuggesting(false);
    setSuggestedName("");
    setSuggestionSubmitted(false);
    updateFormData({
      petBreedId: breedId === 0 ? null : breedId,
      suggestedBreedName: "",
    });
  };

  const handleStartSuggestion = () => {
    setIsSuggesting(true);
    setSelectedBreedId(null);
    setSuggestedName(searchQuery);
    setSuggestionSubmitted(false);
    setSuggestionError(null);
    updateFormData({ petBreedId: null, suggestedBreedName: searchQuery });
  };

  const handleSuggestionNameChange = (value: string) => {
    setSuggestedName(value);
    setSuggestionError(null);
    updateFormData({ suggestedBreedName: value });
  };

  const handleSubmitSuggestion = async () => {
    if (!suggestedName.trim() || !formData.categoryId) return;

    setSubmittingSuggestion(true);
    setSuggestionError(null);

    try {
      const result = await suggestBreedAction(
        suggestedName.trim(),
        formData.categoryId,
      );
      if (result.success) {
        setSuggestionSubmitted(true);
      } else {
        // If breed was already suggested, treat it as success —
        // the breed is already in the review queue
        const errorMsg = result.error || "";
        if (
          errorMsg.includes("AlreadySuggested") ||
          errorMsg.includes("artıq təklif") ||
          errorMsg.includes("already been suggested") ||
          errorMsg.includes("уже предложена")
        ) {
          setSuggestionSubmitted(true);
        } else {
          setSuggestionError(errorMsg || t("suggestionError"));
        }
      }
    } catch {
      setSuggestionError(t("suggestionError"));
    } finally {
      setSubmittingSuggestion(false);
    }
  };

  const handleCancelSuggestion = () => {
    setIsSuggesting(false);
    setSuggestedName("");
    setSuggestionSubmitted(false);
    setSuggestionError(null);
    updateFormData({ suggestedBreedName: "" });
  };

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition("/ads/ad-placement/basics");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/category");
  };

  const canProceed =
    selectedBreedId !== null ||
    (isSuggesting && suggestedName.trim().length > 0) ||
    isBreedOptional;

  if (loading) {
    return <LoadingState message={t("loading")} />;
  }

  return (
    <>
      <ViewLayout>
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="subsection">{t("heading")}</Heading>
            <Text variant="body-lg" color="secondary">
              {breeds.length > 0
                ? t("subtitle", { count: breeds.length })
                : t("noBreeds")}
            </Text>
            {isBreedOptional && (
              <Text variant="small" color="secondary" className="italic">
                {t("optional")}
              </Text>
            )}
          </div>

          {/* "Other" breed option for optional breed selection */}
          {isBreedOptional && (
            <OptionCard
              selected={selectedBreedId === 0}
              onClick={() => handleSelect(0)}
              title={t("otherBreed")}
              size="sm"
            />
          )}

          {/* Breed suggestion mode */}
          {isSuggesting ? (
            <div className="space-y-4">
              {suggestionSubmitted ? (
                /* ── Success state ── */
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <Text
                      variant="body-lg"
                      className="font-semibold text-green-800"
                    >
                      {t("suggestionSent")}
                    </Text>

                    <div className="flex items-center gap-2 rounded-lg bg-green-100/80 px-4 py-2">
                      <svg
                        className="w-4 h-4 text-green-700 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <Text
                        variant="small"
                        className="font-medium text-green-800"
                      >
                        &quot;{suggestedName}&quot;
                      </Text>
                    </div>

                    <button
                      onClick={handleCancelSuggestion}
                      className="mt-2 text-sm text-green-700 hover:text-green-900 underline underline-offset-2 transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Suggestion input form ── */
                <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                  {/* Header with icon */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <Text variant="body-lg" className="font-semibold">
                        {t("suggestTitle")}
                      </Text>
                      <Text variant="small" color="secondary">
                        {t("suggestDescription")}
                      </Text>
                    </div>
                  </div>

                  {/* Input field */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={suggestedName}
                      onChange={(e) =>
                        handleSuggestionNameChange(e.target.value)
                      }
                      placeholder={t("suggestPlaceholder")}
                      maxLength={100}
                      className={cn(
                        "w-full rounded-xl border-2 px-4 py-3.5 text-base transition-all duration-200",
                        "placeholder:text-gray-400 focus:outline-none",
                        suggestionError
                          ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-gray-200 bg-gray-50 focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-100",
                      )}
                      autoFocus
                    />

                    {/* Error message */}
                    {suggestionError && (
                      <div className="flex items-center gap-2 text-red-600">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <Text variant="small" className="text-red-600">
                          {suggestionError}
                        </Text>
                      </div>
                    )}
                  </div>

                  {/* Hint note */}
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-2.5">
                    <svg
                      className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <Text variant="small" className="text-amber-700">
                      {t("suggestionNote")}
                    </Text>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleSubmitSuggestion}
                      disabled={!suggestedName.trim() || submittingSuggestion}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200",
                        "disabled:cursor-not-allowed",
                        suggestedName.trim()
                          ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed",
                      )}
                    >
                      {submittingSuggestion ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          {t("submitting")}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          {t("submitSuggestion")}
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCancelSuggestion}
                      className="rounded-xl px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 active:scale-[0.98]"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Search Input */}
              {breeds.length > 0 && (
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t("searchPlaceholder")}
                />
              )}

              {/* Breed List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredBreeds.length === 0 && searchQuery ? (
                  /* ── No results — compact suggest prompt ── */
                  <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <Text variant="small" className="font-semibold">
                          {t("noMatchMessage", { query: searchQuery })}
                        </Text>
                        <Text variant="small" color="secondary">
                          {t("suggestDescription")}
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleStartSuggestion}
                        className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        {t("suggestBreed", { name: searchQuery })}
                      </button>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
                      >
                        {t("clearSearch")}
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredBreeds.map((breed) => (
                    <OptionCard
                      key={breed.id}
                      selected={selectedBreedId === breed.id}
                      onClick={() => handleSelect(breed.id)}
                      title={breed.title}
                      size="sm"
                    />
                  ))
                )}
              </div>

              {/* "Can't find your breed?" link — always visible */}
              {breeds.length > 0 && !searchQuery && (
                <div className="pt-3">
                  <button
                    onClick={() => setIsSuggesting(true)}
                    className="group flex items-center gap-2.5 w-full rounded-xl border-2 border-dashed border-gray-200 px-5 py-4 text-left hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <svg
                        className="w-4.5 h-4.5 text-gray-500 group-hover:text-gray-700 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <Text
                      variant="small"
                      className="font-medium text-gray-500 group-hover:text-gray-700 transition-colors"
                    >
                      {t("cantFindBreed")}
                    </Text>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </ViewLayout>

      <ViewFooter
        onBack={handleBack}
        onNext={handleNext}
        canProceed={canProceed}
      />
    </>
  );
}
