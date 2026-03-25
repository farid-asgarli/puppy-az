const TAPAZ_GRAPHQL_URL = 'https://tap.az/graphql';
const CATEGORY_ID = 'Z2lkOi8vdGFwL0NhdGVnb3J5LzU5OQ'; // /elanlar/heyvanlar

const TAPAZ_HEADERS = {
  accept: '*/*',
  'content-type': 'application/json',
  origin: 'https://tap.az',
  referer: 'https://tap.az/elanlar/heyvanlar',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
};

const GET_ADS_QUERY = `
  fragment AdBaseFields on Ad {
    id
    title
    price
    updatedAt
    region
    path
    kinds
    legacyResourceId
    isBookmarked
    shop {
      id
      __typename
    }
    photo {
      url
      __typename
    }
    desktopPhoto: photo(source: DESKTOP) {
      url
      __typename
    }
    status
    __typename
  }

  query GetAds_LATEST(
    $adKind: AdKindEnum
    $orderType: AdOrderEnum
    $keywords: String
    $first: Int
    $after: String
    $source: SourceEnum!
    $filters: AdFilterInput
    $keywordsSource: KeywordSourceEnum
    $sourceLink: String
  ) {
    ads(
      adKind: $adKind
      first: $first
      after: $after
      source: $source
      orderType: $orderType
      keywords: $keywords
      filters: $filters
      keywordsSource: $keywordsSource
      sourceLink: $sourceLink
    ) {
      nodes {
        ...AdBaseFields
        __typename
      }
      pageInfo {
        endCursor
        hasNextPage
        __typename
      }
      __typename
    }
  }
`;

export interface AdPhoto {
  url: string;
  __typename: string;
}

export interface Ad {
  id: string;
  title: string;
  price: number | null;
  updatedAt: string;
  region: string;
  path: string;
  kinds: string[];
  legacyResourceId: number;
  isBookmarked: boolean;
  shop: { id: string; __typename: string } | null;
  photo: AdPhoto | null;
  desktopPhoto: AdPhoto | null;
  status: string;
  __typename: string;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
  __typename: string;
}

export interface AdsPage {
  nodes: Ad[];
  pageInfo: PageInfo;
}

export async function getAds(first = 36, after: string | null = null): Promise<AdsPage> {
  const response = await fetch(TAPAZ_GRAPHQL_URL, {
    method: 'POST',
    headers: TAPAZ_HEADERS,
    body: JSON.stringify({
      operationName: 'GetAds_LATEST',
      variables: {
        first,
        after,
        source: 'DESKTOP',
        sourceLink: 'https://tap.az/elanlar/heyvanlar',
        filters: {
          categoryId: CATEGORY_ID,
          price: { from: null, to: null },
          regionId: null,
          propertyOptions: { collection: [], boolean: [], range: [] },
        },
      },
      query: GET_ADS_QUERY,
    }),
    // `next` is a Next.js extension to RequestInit for ISR revalidation
    ...({ next: { revalidate: 60 } } as object),
  });

  if (!response.ok) {
    throw new Error(`tap.az GraphQL request failed: ${response.status}`);
  }

  const json = await response.json();
  return json.data.ads as AdsPage;
}

// ── Ad Detail ──────────────────────────────────────────────

const GET_AD_DETAIL_QUERY = `
  query GetAd($legacyId: ID!) {
    ad(legacyId: $legacyId) {
      id
      title
      price
      updatedAt
      region
      path
      kinds
      legacyResourceId
      isBookmarked
      status
      body
      photos {
        url
        __typename
      }
      properties {
        name
        value
        __typename
      }
      user {
        id
        name
        __typename
      }
      shop {
        id
        __typename
      }
      __typename
    }
  }
`;

export interface AdProperty {
  name: string;
  value: string;
}

export interface AdDetail {
  id: string;
  title: string;
  price: number | null;
  updatedAt: string;
  region: string;
  path: string;
  kinds: string[];
  legacyResourceId: number;
  isBookmarked: boolean;
  status: string;
  body: string | null;
  photos: AdPhoto[];
  properties: AdProperty[];
  user: { id: string; name: string } | null;
  shop: { id: string } | null;
}

export async function getAdDetail(legacyId: number): Promise<AdDetail> {
  const response = await fetch(TAPAZ_GRAPHQL_URL, {
    method: 'POST',
    headers: TAPAZ_HEADERS,
    body: JSON.stringify({
      operationName: 'GetAd',
      variables: { legacyId: String(legacyId) },
      query: GET_AD_DETAIL_QUERY,
    }),
  });

  if (!response.ok) {
    throw new Error(`tap.az GraphQL request failed: ${response.status}`);
  }

  const json = await response.json();
  return json.data.ad as AdDetail;
}

// ── Phone number reveal ──────────────────────────────────────

export async function getAdPhones(legacyId: number, adPath: string): Promise<string[]> {
  const pageUrl = `https://tap.az${adPath}`;

  // 1. GET the ad page to obtain session cookie + CSRF token
  const pageRes = await fetch(pageUrl, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'user-agent': TAPAZ_HEADERS['user-agent'],
    },
  });

  if (!pageRes.ok) {
    throw new Error(`Failed to load ad page: ${pageRes.status}`);
  }

  const html = await pageRes.text();

  // Extract CSRF token from <meta name="csrf-token" content="...">
  const csrfMatch = html.match(/<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/);
  if (!csrfMatch) {
    throw new Error('CSRF token not found on page');
  }
  const csrfToken = csrfMatch[1];

  // Forward the Set-Cookie header so the session is valid for the POST
  const rawCookie = pageRes.headers.get('set-cookie') ?? '';
  // Extract _tapaz_session value from the Set-Cookie header
  const sessionMatch = rawCookie.match(/_tapaz_session=([^;]+)/);
  const sessionCookie = sessionMatch ? `_tapaz_session=${sessionMatch[1]}` : '';

  // 2. POST to the phones endpoint
  const phonesRes = await fetch(`https://tap.az/ads/${legacyId}/phones`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'content-length': '0',
      'user-agent': TAPAZ_HEADERS['user-agent'],
      origin: 'https://tap.az',
      referer: pageUrl,
      'x-csrf-token': csrfToken,
      'x-requested-with': 'XMLHttpRequest',
      ...(sessionCookie ? { cookie: sessionCookie } : {}),
    },
  });

  if (!phonesRes.ok) {
    throw new Error(`Phones request failed: ${phonesRes.status}`);
  }

  const data = await phonesRes.json();

  // Response shape: { phones: string[] } or string[] or { phones: [{phone: string}] }
  const raw: unknown[] = Array.isArray(data) ? data : (data?.phones ?? []);
  return raw
    .map((p) => (typeof p === 'string' ? p : ((p as Record<string, string>).phone ?? (p as Record<string, string>).number ?? '')))
    .filter(Boolean);
}
