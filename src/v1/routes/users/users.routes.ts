import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "users",

  routes: {
    GET: "/",
    GET_ONE: "/:slug",

    POST: "/",

    PUT: "/:slug",
    PATCH: "/:slug",

    DELETE: "/:slug",
  } as const,

  operations: {
    GET: {
      summary: "Getting an array of user",
    },
    GET_ONE: {
      summary: "Getting a user by slug",
    },
    POST: {
      summary: "Creaing a user",
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
