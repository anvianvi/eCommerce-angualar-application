type Price = {
  id: string;
  value: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
    type: string;
  };
};

type Name = {
  en: string;
};

type ProductSlug = {
  en: string;
};

type ProductType = {
  typeId: string;
  id: string;
  version: number;
};

type TotalPrice = {
  type: string;
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
};

type Image = {
  url: string;
};
type Variant = {
  id: number;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
};

type Attribute = {
  name: string;
  value: string;
};

export type LineItem = {
  addedAt: string;
  // discountedPricePerQuantity: any[];
  id: string;
  lastModifiedAt: string;
  lineItemMode: string;
  name: Name;
  // perMethodTaxRate: any[];
  price: Price;
  priceMode: string;
  productId: string;
  productSlug: ProductSlug;
  productType: ProductType;
  quantity: number;
  // state: any[];
  // taxedPricePortions: any[];
  totalPrice: TotalPrice;
  variant: Variant;
  origin: string;
};
