import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "users",

  routes: {
    GET_ONE: "/:slug",

    PUT: "/:slug",
    PATCH: "/:slug",

    DELETE: "/:id",
  } as const,

  operations: {
    GET_ONE: {
      summary: "Getting a user by slug",
    },
    PUT: {
      summary: "Updating a user",
    },
    PATCH: {
      summary: "Updating a user",
    },
    DELETE: {
      summary: "Deleting a user",
    },
  } as const,
}).execute();
