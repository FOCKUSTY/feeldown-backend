import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "friendships",

  routes: {
    GET_ONE: "/:id",

    GET_USER_FRIENDS: "/:userSlug/friends",

    POST: "/",

    PUT: "/:id",
    PATCH: "/:id",
  } as const,

  operations: {
    GET_ONE: {
      summary: "Getting a friend by id",
    },
    GET_USER_FRIENDS: {
      summary: "Getting a user friends",
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
