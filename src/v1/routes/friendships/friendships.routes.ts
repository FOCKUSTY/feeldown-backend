import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "friendships",

  routes: {
    GET: "/",
    GET_ONE: "/:id",

    POST: "/",

    PUT: "/:id",
    PATCH: "/:id",
  } as const,

  operations: {
    GET: {
      summary: "Getting an array of friend",
    },
    GET_ONE: {
      summary: "Getting a friend by id",
    },
    POST: {
      summary: "Creaing a friend",
    },
    PUT: {
      summary: "Updating a friend",
    },
    PATCH: {
      summary: "Updating a friend",
    },
  } as const,
}).execute();
