export type queryDiscountsResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Discount[];
};

export type Discount = {
  id: string;
  value: Value;
  predicate: string;
  name: Translation;
  description: Translation;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  sortOrder: string;
  references: Reference[];
  key: string;
};

export interface Value {
  type: string;
  permyriad: number;
}

export interface Translation {
  en: string;
}

export interface Reference {
  typeId: string;
  id: string;
}
