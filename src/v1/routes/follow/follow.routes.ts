import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "follow",

  routes: {
    GET: "/",
    GET_ONE: "/:id",

    POST: "/",

    DELETE: "/:id",
  } as const,

  operations: {
    GET: {
      summary: "Getting an array of follow",
    },
    GET_ONE: {
      summary: "Getting a follow by id",
    },
    POST: {
      summary: "Creating a follow",
    },
    DELETE: {
      summary: "Deleting a follow",
    },
  } as const,
}).execute();
