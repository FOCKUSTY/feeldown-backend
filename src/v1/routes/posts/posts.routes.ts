import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "posts",

  routes: {
    GET: "/",
    GET_ONE: "/:slug",

    POST: "/",

    PUT: "/:slug",
    PATCH: "/:slug",

    DELETE: "/:id",
  } as const,

  operations: {
    GET: {
      summary: "Getting an array of post",
    },
    GET_ONE: {
      summary: "Getting a post by slug",
    },
    POST: {
      summary: "Creaing a post",
    },
    PUT: {
      summary: "Updating a post",
    },
    PATCH: {
      summary: "Updating a post",
    },
    DELETE: {
      summary: "Deleting a post",
    },
  } as const,
}).execute();
