export type Product = {
  categories: Array<{
    id: string;
    typeId: string;
  }>;
  productId?: string;
  categoryOrderHints: Record<string, string>;
  createdAt: string;
  description: {
    [key: string]: string;
  };
  hasStagedChanges: boolean;
  id: string;
  lastModifiedAt: string;
  masterVariant: {
    id: number;
    sku: string;
    key: string;
    attributes: Attribute[];

    prices: Array<{
      id: string;
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
    }>;
    images: Array<{
      dimensions: string;
      url: string;
    }>;
  };
  metaDescription: {
    [key: string]: string;
  };
  metaTitle: {
    [key: string]: string;
  };
  name: {
    [key: string]: string;
  };
  priceMode: string;
  productType: {
    typeId: string;
    id: string;
  };
  published: boolean;
  searchKeywords: {
    [key: string]: Array<string>;
  };
  slug: {
    [key: string]: string;
  };
  taxCategory: {
    typeId: string;
    id: string;
  };
  variants: Array<string>;
  version: number;
};

type Attribute = {
  name: string;
  value: string;
};

export type queryProductsResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
};

export const emptyProduct: Product = {
  categories: [],
  categoryOrderHints: {},
  createdAt: '',
  description: {},
  hasStagedChanges: false,
  id: '',
  lastModifiedAt: '',
  masterVariant: {
    id: 0,
    sku: '',
    key: '',
    prices: [],
    images: [],
    attributes: [{ name: '', value: '' }],
  },
  metaDescription: {},
  metaTitle: {},
  name: {},
  priceMode: '',
  productType: {
    typeId: '',
    id: '',
  },
  published: false,
  searchKeywords: {},
  slug: {},
  taxCategory: {
    typeId: '',
    id: '',
  },
  variants: [],
  version: 0,
};
