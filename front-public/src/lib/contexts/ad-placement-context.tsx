"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  AdPlacementFormData,
  INITIAL_AD_PLACEMENT_DATA,
  UploadedImageInfo,
} from "@/lib/types/ad-placement.types";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  PetAdType,
  MyPetAdDto,
  PetAdStatus,
} from "@/lib/api/types/pet-ad.types";
import { getMyPetAdAction } from "@/lib/auth/actions";

// Helper function to get step order based on ad type
function getStepOrder(adType: PetAdType | null): string[] {
  const baseSteps = [
    "ad-type",
    "category",
    "breed",
    "basics",
    "physical",
    "details",
    "location",
    "photos",
  ];

  // Only add price step for Sale ads
  if (adType === PetAdType.Sale) {
    return [...baseSteps, "price", "review"];
  }

  return [...baseSteps, "review"];
}

interface AdPlacementContextValue {
  formData: AdPlacementFormData;
  updateFormData: (updates: Partial<AdPlacementFormData>) => void;
  resetFormData: () => void;
  saveAsDraft: () => Promise<void>;
  loadDraft: () => void;
  hasSavedDraft: () => boolean;
  getSavedStep: () => string | null;
  setCurrentStep: (step: string) => void;
  isDirty: boolean;
  maxReachedStep: string;
  // Edit mode
  editingAdId: number | null;
  isEditMode: boolean;
  loadExistingAd: (adId: number) => Promise<boolean>;
  clearEditMode: () => void;
}

const AdPlacementContext = createContext<AdPlacementContextValue | null>(null);

const DRAFT_STORAGE_KEY_PREFIX = "ad_placement_draft";
const DRAFT_EXPIRATION_DAYS = 5;

interface SavedDraft {
  data: AdPlacementFormData;
  timestamp: number;
  currentStep?: string;
  maxReachedStep?: string;
}

export function AdPlacementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AdPlacementFormData>(
    INITIAL_AD_PLACEMENT_DATA,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [currentStep, setCurrentStepState] = useState<string>(
    "/ads/ad-placement/ad-type",
  );
  const [maxReachedStep, setMaxReachedStep] = useState<string>(
    "/ads/ad-placement/ad-type",
  );

  // Edit mode state
  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const isEditMode = editingAdId !== null;

  // Create user-specific storage key
  const draftStorageKey = useMemo(() => {
    if (!user?.id) return null;
    return `${DRAFT_STORAGE_KEY_PREFIX}_${user.id}`;
  }, [user?.id]);

  // Load draft from localStorage when user changes
  useEffect(() => {
    if (draftStorageKey) {
      loadDraftInternal(draftStorageKey);
    } else {
      // Reset form when user logs out or is not authenticated
      setFormData(INITIAL_AD_PLACEMENT_DATA);
      setIsDirty(false);
    }
  }, [draftStorageKey]);

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    if (isDirty && draftStorageKey) {
      const draft: SavedDraft = {
        data: formData,
        timestamp: Date.now(),
        currentStep,
        maxReachedStep,
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    }
  }, [formData, isDirty, draftStorageKey, currentStep, maxReachedStep]);

  const loadDraftInternal = (storageKey: string) => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;

      const parsed: SavedDraft = JSON.parse(saved);
      const expirationTime = DRAFT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
      const isExpired = Date.now() - parsed.timestamp > expirationTime;

      if (isExpired) {
        localStorage.removeItem(storageKey);
        console.log("Draft expired and was cleared");
        return;
      }

      setFormData(parsed.data);
      if (parsed.currentStep) {
        setCurrentStepState(parsed.currentStep);
      }
      if (parsed.maxReachedStep) {
        setMaxReachedStep(parsed.maxReachedStep);
      }
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to load draft:", error);
      localStorage.removeItem(storageKey);
    }
  };

  const updateFormData = useCallback(
    (updates: Partial<AdPlacementFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
      setIsDirty(true);
    },
    [],
  );

  const resetFormData = useCallback(() => {
    setFormData(INITIAL_AD_PLACEMENT_DATA);
    setCurrentStepState("/ads/ad-placement/ad-type");
    setMaxReachedStep("/ads/ad-placement/ad-type");
    setIsDirty(false);
    if (draftStorageKey) {
      localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey]);

  const setCurrentStep = useCallback(
    (step: string) => {
      setCurrentStepState(step);
      // Update maxReachedStep if current step is further than previous max
      setMaxReachedStep((prev) => {
        const currentStepName = step.split("/").pop() || "";
        const prevMaxStepName = prev.split("/").pop() || "";

        // Use dynamic step order based on current ad type
        const stepOrder = getStepOrder(formData.adType);

        const currentIndex = stepOrder.indexOf(currentStepName);
        const prevMaxIndex = stepOrder.indexOf(prevMaxStepName);

        // Only update if current step is further
        if (currentIndex > prevMaxIndex) {
          return step;
        }
        return prev;
      });
      setIsDirty(true);
    },
    [formData.adType],
  );

  const saveAsDraft = useCallback(async () => {
    if (!draftStorageKey) return;
    const draft: SavedDraft = {
      data: formData,
      timestamp: Date.now(),
      currentStep,
      maxReachedStep,
    };
    localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    setIsDirty(false);
  }, [formData, draftStorageKey, currentStep, maxReachedStep]);

  const loadDraft = useCallback(() => {
    if (draftStorageKey) {
      loadDraftInternal(draftStorageKey);
    }
  }, [draftStorageKey]);

  const hasSavedDraft = useCallback((): boolean => {
    if (!draftStorageKey) return false;
    try {
      const saved = localStorage.getItem(draftStorageKey);
      if (!saved) return false;

      const parsed: SavedDraft = JSON.parse(saved);
      const expirationTime = DRAFT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
      const isExpired = Date.now() - parsed.timestamp > expirationTime;

      return !isExpired;
    } catch (error) {
      return false;
    }
  }, [draftStorageKey]);

  const getSavedStep = useCallback((): string | null => {
    if (!draftStorageKey) return null;
    try {
      const saved = localStorage.getItem(draftStorageKey);
      if (!saved) return null;

      const parsed: SavedDraft = JSON.parse(saved);
      const expirationTime = DRAFT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
      const isExpired = Date.now() - parsed.timestamp > expirationTime;

      if (isExpired) return null;
      return parsed.currentStep || "/ads/ad-placement/ad-type";
    } catch (error) {
      return null;
    }
  }, [draftStorageKey]);

  // Load existing ad for editing
  const loadExistingAd = useCallback(async (adId: number): Promise<boolean> => {
    try {
      const result = await getMyPetAdAction(adId);

      // Check if request was successful
      if (!result.success) {
        console.error("Failed to load ad:", result.error);
        return false;
      }

      const adData = result.data;

      // Check if ad can be edited (only pending, rejected, or draft)
      const editableStatuses = [
        PetAdStatus.Pending,
        PetAdStatus.Rejected,
        PetAdStatus.Draft,
      ];
      if (!editableStatuses.includes(adData.status)) {
        console.error("Ad cannot be edited - status:", adData.status);
        return false;
      }

      // Convert ad data to form data
      const formDataFromAd: AdPlacementFormData = {
        adType: adData.adType,
        categoryId: adData.breed?.categoryId ?? null,
        petBreedId: adData.breed?.id ?? null,
        gender: adData.gender,
        size: adData.size,
        ageInMonths: adData.ageInMonths,
        color: adData.color ?? "",
        weight: adData.weight,
        cityId: adData.cityId,
        uploadedImages:
          adData.images?.map(
            (img): UploadedImageInfo => ({
              id: img.id,
              url: img.url,
            }),
          ) ?? [],
        title: adData.title ?? "",
        description: adData.description ?? "",
        price: adData.price,
      };

      setFormData(formDataFromAd);
      setEditingAdId(adId);
      // In edit mode, all steps are accessible
      setMaxReachedStep("/ads/ad-placement/review");
      setIsDirty(false);

      return true;
    } catch (error) {
      console.error("Failed to load ad for editing:", error);
      return false;
    }
  }, []);

  // Clear edit mode and reset form
  const clearEditMode = useCallback(() => {
    setEditingAdId(null);
    setFormData(INITIAL_AD_PLACEMENT_DATA);
    setCurrentStepState("/ads/ad-placement/ad-type");
    setMaxReachedStep("/ads/ad-placement/ad-type");
    setIsDirty(false);
  }, []);

  return (
    <AdPlacementContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        saveAsDraft,
        loadDraft,
        hasSavedDraft,
        getSavedStep,
        setCurrentStep,
        isDirty,
        maxReachedStep,
        editingAdId,
        isEditMode,
        loadExistingAd,
        clearEditMode,
      }}
    >
      {children}
    </AdPlacementContext.Provider>
  );
}

export function useAdPlacement() {
  const context = useContext(AdPlacementContext);
  if (!context) {
    throw new Error("useAdPlacement must be used within AdPlacementProvider");
  }
  return context;
}
