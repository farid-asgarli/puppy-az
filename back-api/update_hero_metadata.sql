-- Update metadata for home_hero section with all translation keys
-- This allows the frontend to receive structured data

UPDATE "StaticSectionLocalizations" 
SET "Metadata" = '{
  "titlePart1": "Mükəmməl dostu",
  "titleHighlight1": "tapın",
  "titleHighlight2": "sevin",
  "browseAdsButton": "Elanlara baxın",
  "postAdButton": "Elan yerləşdir",
  "badge": "Azərbaycanda ev heyvanları bazarı",
  "scrollDown": "Daha çox",
  "trustIndicators": {
    "activeAds": "10,000+ aktiv elan",
    "safeShopping": "Təhlükəsiz alış-veriş",
    "verifiedSellers": "Təsdiqlənmiş satıcılar"
  }
}'
WHERE "StaticSectionId" = 1 AND "AppLocaleId" = 1;

UPDATE "StaticSectionLocalizations" 
SET "Metadata" = '{
  "titlePart1": "Find the perfect",
  "titleHighlight1": "friend",
  "titleHighlight2": "love",
  "browseAdsButton": "Browse Ads",
  "postAdButton": "Post an Ad",
  "badge": "Pet marketplace in Azerbaijan",
  "scrollDown": "Scroll down",
  "trustIndicators": {
    "activeAds": "10,000+ active ads",
    "safeShopping": "Safe shopping",
    "verifiedSellers": "Verified sellers"
  }
}'
WHERE "StaticSectionId" = 1 AND "AppLocaleId" = 2;

UPDATE "StaticSectionLocalizations" 
SET "Metadata" = '{
  "titlePart1": "Найдите идеального",
  "titleHighlight1": "друга",
  "titleHighlight2": "любовь",
  "browseAdsButton": "Просмотр объявлений",
  "postAdButton": "Разместить объявление",
  "badge": "Рынок домашних животных в Азербайджане",
  "scrollDown": "Прокрутить вниз",
  "trustIndicators": {
    "activeAds": "10,000+ активных объявлений",
    "safeShopping": "Безопасные покупки",
    "verifiedSellers": "Проверенные продавцы"
  }
}'
WHERE "StaticSectionId" = 1 AND "AppLocaleId" = 3;
