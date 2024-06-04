type Term = {
  term: string;
  count: number;
};

type AuthorFacet = {
  dataType: string;
  missing: number;
  other: number;
  terms: Term[];
  total: number;
  type: string;
};

type Facets = {
  'variants.attributes.author': AuthorFacet;
};

export type queryAuthorsResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: object[];
  facets: Facets;
};
