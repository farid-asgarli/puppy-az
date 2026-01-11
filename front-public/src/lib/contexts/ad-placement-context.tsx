'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AdPlacementFormData, INITIAL_AD_PLACEMENT_DATA } from '@/lib/types/ad-placement.types';

interface AdPlacementContextValue {
  formData: AdPlacementFormData;
  updateFormData: (updates: Partial<AdPlacementFormData>) => void;
  resetFormData: () => void;
  saveAsDraft: () => Promise<void>;
  loadDraft: () => void;
  hasSavedDraft: () => boolean;
  isDirty: boolean;
}

const AdPlacementContext = createContext<AdPlacementContextValue | null>(null);

const DRAFT_STORAGE_KEY = 'ad_placement_draft';
const DRAFT_EXPIRATION_HOURS = 12;

interface SavedDraft {
  data: AdPlacementFormData;
  timestamp: number;
}

export function AdPlacementProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<AdPlacementFormData>(INITIAL_AD_PLACEMENT_DATA);
  const [isDirty, setIsDirty] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    if (isDirty) {
      const draft: SavedDraft = {
        data: formData,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, isDirty]);

  const updateFormData = useCallback((updates: Partial<AdPlacementFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(INITIAL_AD_PLACEMENT_DATA);
    setIsDirty(false);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  const saveAsDraft = useCallback(async () => {
    const draft: SavedDraft = {
      data: formData,
      timestamp: Date.now(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setIsDirty(false);
  }, [formData]);

  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!saved) return;

      const parsed: SavedDraft = JSON.parse(saved);
      const expirationTime = DRAFT_EXPIRATION_HOURS * 60 * 60 * 1000;
      const isExpired = Date.now() - parsed.timestamp > expirationTime;

      if (isExpired) {
        // Draft expired, clear it
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        console.log('Draft expired and was cleared');
        return;
      }

      // Draft is still valid
      setFormData(parsed.data);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to load draft:', error);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  const hasSavedDraft = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!saved) return false;

      const parsed: SavedDraft = JSON.parse(saved);
      const expirationTime = DRAFT_EXPIRATION_HOURS * 60 * 60 * 1000;
      const isExpired = Date.now() - parsed.timestamp > expirationTime;

      return !isExpired;
    } catch (error) {
      return false;
    }
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
        isDirty,
      }}
    >
      {children}
    </AdPlacementContext.Provider>
  );
}

export function useAdPlacement() {
  const context = useContext(AdPlacementContext);
  if (!context) {
    throw new Error('useAdPlacement must be used within AdPlacementProvider');
  }
  return context;
}
