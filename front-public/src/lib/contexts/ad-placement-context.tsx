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
} from "@/lib/types/ad-placement.types";
import { useAuth } from "@/lib/hooks/use-auth";
import { PetAdType } from "@/lib/api/types/pet-ad.types";

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
}

const AdPlacementContext = createContext<AdPlacementContextValue | null>(null);

const DRAFT_STORAGE_KEY_PREFIX = "ad_placement_draft";
const DRAFT_EXPIRATION_HOURS = 12;

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
      const expirationTime = DRAFT_EXPIRATION_HOURS * 60 * 60 * 1000;
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
      const expirationTime = DRAFT_EXPIRATION_HOURS * 60 * 60 * 1000;
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
      const expirationTime = DRAFT_EXPIRATION_HOURS * 60 * 60 * 1000;
      const isExpired = Date.now() - parsed.timestamp > expirationTime;

      if (isExpired) return null;
      return parsed.currentStep || "/ads/ad-placement/ad-type";
    } catch (error) {
      return null;
    }
  }, [draftStorageKey]);

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
