import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "follow",

  routes: {
    GET: "/",
    GET_ONE: "/:id",
    GET_FOLLOWERS: "/followers",
    GET_FOLLOWING: "/following",

    POST: "/",

    DELETE: "/:id",
  } as const,

  operations: {
    GET: {
      summary: "Getting an array of follow (where current user is follower)",
    },
    GET_ONE: {
      summary: "Getting a follow by id",
    },
    GET_FOLLOWERS: {
      summary: "Getting users who follow the current user",
    },
    GET_FOLLOWING: {
      summary: "Getting users the current user follows",
    },
    POST: {
      summary: "Creating a follow",
    },
    DELETE: {
      summary: "Deleting a follow",
    },
  } as const,
}).execute();
