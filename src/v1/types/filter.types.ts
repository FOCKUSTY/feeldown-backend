import type {
  AVAILABLE_SORT_TYPES,
  AVAILABLE_SORT_ORDERING,
} from "@1/constants";

export type Filter = {
  sort: (typeof AVAILABLE_SORT_ORDERING)[number];
  sortBy: (typeof AVAILABLE_SORT_TYPES)[number];
  limit: number;
  offset: number;
};
