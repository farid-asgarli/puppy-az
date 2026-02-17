// Admin API endpoints
const ADMIN_BASE = "/admin";

export const endpoints = {
  // Auth
  auth: {
    login: `${ADMIN_BASE}/auth/login`,
    logout: `${ADMIN_BASE}/auth/logout`,
    me: `${ADMIN_BASE}/auth/me`,
    register: `${ADMIN_BASE}/auth/register`,
    refreshToken: `${ADMIN_BASE}/auth/refresh-token`,
  },

  // Admin Users
  users: {
    list: `${ADMIN_BASE}/user`,
    byId: (id: string) => `${ADMIN_BASE}/user/${id}`,
    create: `${ADMIN_BASE}/user`,
    update: (id: string) => `${ADMIN_BASE}/user/${id}`,
    delete: (id: string) => `${ADMIN_BASE}/user/${id}`,
  },

  // Regular Users (consumers)
  regularUsers: {
    list: `${ADMIN_BASE}/regular-users`,
  },

  // Roles
  roles: {
    list: `${ADMIN_BASE}/role`,
    byId: (id: string) => `${ADMIN_BASE}/role/${id}`,
    assignToUser: (userId: string) =>
      `${ADMIN_BASE}/role/user/${userId}/assign`,
    removeFromUser: (userId: string) =>
      `${ADMIN_BASE}/role/user/${userId}/remove`,
  },

  // Pet Ads (Listings)
  listings: {
    search: `${ADMIN_BASE}/pet-ads/search`,
    getById: (id: number) => `${ADMIN_BASE}/pet-ads/${id}`,
    review: (id: number) => `${ADMIN_BASE}/pet-ads/${id}/review`,
    premium: (id: number) => `${ADMIN_BASE}/pet-ads/${id}/premium`,
    vip: (id: number) => `${ADMIN_BASE}/pet-ads/${id}/vip`,
    setStatus: (id: number) => `${ADMIN_BASE}/pet-ads/${id}/set-status`,
    assignBreed: (id: number) => `${ADMIN_BASE}/pet-ads/${id}/assign-breed`,
    assignDistrict: (id: number) =>
      `${ADMIN_BASE}/pet-ads/${id}/assign-district`,
  },

  // Pet Categories
  categories: {
    list: `${ADMIN_BASE}/pet-categories`,
    byId: (id: number) => `${ADMIN_BASE}/pet-categories/${id}`,
    create: `${ADMIN_BASE}/pet-categories`,
    update: (id: number) => `${ADMIN_BASE}/pet-categories/${id}`,
    softDelete: (id: number) => `${ADMIN_BASE}/pet-categories/${id}/soft`,
    hardDelete: (id: number) => `${ADMIN_BASE}/pet-categories/${id}`,
    restore: (id: number) => `${ADMIN_BASE}/pet-categories/${id}/restore`,
  },

  // Pet Breeds
  breeds: {
    list: `${ADMIN_BASE}/pet-breeds`,
    byId: (id: number) => `${ADMIN_BASE}/pet-breeds/${id}`,
    create: `${ADMIN_BASE}/pet-breeds`,
    update: (id: number) => `${ADMIN_BASE}/pet-breeds/${id}`,
    softDelete: (id: number) => `${ADMIN_BASE}/pet-breeds/${id}/soft`,
    hardDelete: (id: number) => `${ADMIN_BASE}/pet-breeds/${id}`,
    restore: (id: number) => `${ADMIN_BASE}/pet-breeds/${id}/restore`,
  },

  // Breed Suggestions
  breedSuggestions: {
    list: `${ADMIN_BASE}/breed-suggestions`,
    approve: (id: number) => `${ADMIN_BASE}/breed-suggestions/${id}/approve`,
    reject: (id: number) => `${ADMIN_BASE}/breed-suggestions/${id}/reject`,
  },

  // Cities
  cities: {
    list: `${ADMIN_BASE}/cities`,
    publicList: "/cities",
    byId: (id: number) => `${ADMIN_BASE}/cities/${id}`,
    create: `${ADMIN_BASE}/cities`,
    update: (id: number) => `${ADMIN_BASE}/cities/${id}`,
    softDelete: (id: number) => `${ADMIN_BASE}/cities/${id}/soft`,
    hardDelete: (id: number) => `${ADMIN_BASE}/cities/${id}`,
    restore: (id: number) => `${ADMIN_BASE}/cities/${id}/restore`,
  },

  // Districts
  districts: {
    list: `${ADMIN_BASE}/districts`,
    byId: (id: number) => `${ADMIN_BASE}/districts/${id}`,
    byCity: (cityId: number) => `/districts/by-city/${cityId}`,
    create: `${ADMIN_BASE}/districts`,
    update: (id: number) => `${ADMIN_BASE}/districts/${id}`,
    softDelete: (id: number) => `${ADMIN_BASE}/districts/${id}/soft`,
    hardDelete: (id: number) => `${ADMIN_BASE}/districts/${id}`,
    restore: (id: number) => `${ADMIN_BASE}/districts/${id}/restore`,
  },

  // Colors
  colors: {
    list: "/pet-ads/colors",
    byId: (id: number) => `${ADMIN_BASE}/colors/${id}`,
    create: `${ADMIN_BASE}/colors`,
    update: (id: number) => `${ADMIN_BASE}/colors/${id}`,
    delete: (id: number) => `${ADMIN_BASE}/colors/${id}`,
  },

  // Pet Ad Types (Listing Types)
  listingTypes: {
    list: `${ADMIN_BASE}/pet-ad-types`,
    publicList: "/pet-ads/types",
    create: `${ADMIN_BASE}/pet-ad-types`,
    update: (id: number) => `${ADMIN_BASE}/pet-ad-types/${id}`,
    softDelete: (id: number) => `${ADMIN_BASE}/pet-ad-types/${id}/soft`,
    restore: (id: number) => `${ADMIN_BASE}/pet-ad-types/${id}/restore`,
  },

  // Messages
  messages: {
    list: `${ADMIN_BASE}/messages`,
    byId: (id: number) => `${ADMIN_BASE}/messages/${id}`,
    reply: (id: number) => `${ADMIN_BASE}/messages/${id}/reply`,
    markRead: (id: number) => `${ADMIN_BASE}/messages/${id}/read`,
  },

  // Contact Messages
  contactMessages: {
    list: `${ADMIN_BASE}/contact-messages`,
    byId: (id: number) => `${ADMIN_BASE}/contact-messages/${id}`,
    reply: (id: number) => `${ADMIN_BASE}/contact-messages/${id}/reply`,
    stats: `${ADMIN_BASE}/contact-messages/stats`,
    star: (id: number) => `${ADMIN_BASE}/contact-messages/${id}/star`,
    unstar: (id: number) => `${ADMIN_BASE}/contact-messages/${id}/unstar`,
    spam: (id: number) => `${ADMIN_BASE}/contact-messages/${id}/spam`,
    unspam: (id: number) => `${ADMIN_BASE}/contact-messages/${id}/unspam`,
    archive: (id: number) => `${ADMIN_BASE}/contact-messages/${id}/archive`,
    unarchive: (id: number) => `${ADMIN_BASE}/contact-messages/${id}/unarchive`,
  },

  // Static Sections
  staticSections: {
    list: `${ADMIN_BASE}/static-sections`,
    byId: (id: string) => `${ADMIN_BASE}/static-sections/${id}`,
    update: (id: string) => `${ADMIN_BASE}/static-sections/${id}`,
  },

  // Dashboard
  dashboard: {
    stats: `${ADMIN_BASE}/dashboard/stats`,
    chartStats: `${ADMIN_BASE}/dashboard/chart-stats`,
    listingStats: `${ADMIN_BASE}/dashboard/listing-stats`,
  },
} as const;
