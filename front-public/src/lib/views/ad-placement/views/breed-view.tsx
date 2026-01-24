"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PetBreedDto } from "@/lib/api/types/pet-ad.types";
import { getPetBreedsAction } from "@/lib/auth/actions";
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

/**
 * Breed Selection View
 * Step 2: Choose pet breed with search functionality
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

  // Fetch breeds based on selected category using Server Action
  useEffect(() => {
    const fetchBreeds = async () => {
      if (!formData.categoryId) {
        // If no category selected, redirect back
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
    updateFormData({ petBreedId: breedId });
  };

  const handleNext = () => {
    if (selectedBreedId !== null) {
      navigateWithTransition("/ads/ad-placement/basics");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/category");
  };

  const canProceed = selectedBreedId !== null;

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
          </div>

          {/* Search Input */}
          {breeds.length > 0 && (
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("searchPlaceholder")}
            />
          )}

          {/* Results Count */}
          {searchQuery && (
            <Text variant="small" color="secondary">
              {filteredBreeds.length === 0
                ? t("noResults")
                : t("resultsCount", {
                    count: filteredBreeds.length,
                    plural: filteredBreeds.length !== 1 ? "s" : "",
                  })}
            </Text>
          )}

          {/* Breed List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredBreeds.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No breeds match "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-black underline font-medium"
                >
                  Clear search
                </button>
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
