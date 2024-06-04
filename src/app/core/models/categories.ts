export type Category = {
  id: string;
  version: number;
  key: string;
  name: {
    'en-GB': string;
    'en-US': string;
    'de-DE': string;
  };
  slug: {
    'en-GB': string;
    'en-US': string;
    'de-DE': string;
  };
};

export type CategoriesResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Category[];
};
