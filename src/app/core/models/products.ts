export type Product = {
  id: string;
  productType: {
    typeId: string;
    id: string;
  };
  masterData: {
    current: {
      name: {
        'en-US': string;
        'en-GB': string;
        'de-DE': string;
      };
      description: {
        'de-DE': string;
        'en-GB': string;
        'en-US': string;
      };
      categories: {
        typeId: string;
        id: string;
      }[];
      categoryOrderHints: Record<string, unknown>;
      slug: {
        'en-US': string;
        'en-GB': string;
        'de-DE': string;
      };
      masterVariant: {
        id: number;
        sku: string;
        prices: {
          id: string;
          value: {
            type: string;
            currencyCode: string;
            centAmount: number;
            fractionDigits: number;
          };
          country: string;
        }[];
        images: {
          url: string;
          dimensions: {
            w: number;
            h: number;
          };
        }[];
        attributes: {
          name: string;
          value: {
            key?: string;
            label?: {
              'de-DE': string;
              'en-GB': string;
              'en-US': string;
            };
            'en-GB'?: string;
            'de-DE'?: string;
            'en-US'?: string;
          };
        }[];
        availability: {
          isOnStock: boolean;
          availableQuantity: number;
          version: number;
          id: string;
        };
      };
      searchKeywords: Record<string, unknown>;
    };
    staged: {
      name: {
        'en-US': string;
        'en-GB': string;
        'de-DE': string;
      };
      description: {
        'de-DE': string;
        'en-GB': string;
        'en-US': string;
      };
      categories: {
        typeId: string;
        id: string;
      }[];
      categoryOrderHints: Record<string, unknown>;
      slug: {
        'en-US': string;
        'en-GB': string;
        'de-DE': string;
      };
      masterVariant: {
        id: number;
        sku: string;
        prices: {
          id: string;
          value: {
            type: string;
            currencyCode: string;
            centAmount: number;
            fractionDigits: number;
          };
          country: string;
        }[];
        images: {
          url: string;
          dimensions: {
            w: number;
            h: number;
          };
        }[];
        attributes: {
          name: string;
          value: {
            key?: string;
            label?: {
              'de-DE': string;
              'en-GB': string;
              'en-US': string;
            };
            'en-GB'?: string;
            'de-DE'?: string;
            'en-US'?: string;
          };
        }[];
        availability: {
          isOnStock: boolean;
          availableQuantity: number;
          version: number;
          id: string;
        };
      };
      searchKeywords: Record<string, unknown>;
    };
    published: boolean;
    hasStagedChanges: boolean;
  };
  key: string;
  taxCategory: {
    typeId: string;
    id: string;
  };
  lastVariantId: number;
};

export type queryProductsResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
};
