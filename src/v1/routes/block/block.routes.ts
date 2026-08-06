import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "block",

  routes: {
    GET: "/",
    GET_ONE: "/:id",

    POST: "/",

    DELETE: "/:id",
  } as const,

  operations: {
    GET: {
      summary: "Getting an array of block",
    },
    GET_ONE: {
      summary: "Getting a block by id",
    },
    POST: {
      summary: "Creating a block",
    },
    DELETE: {
      summary: "Deleting a block",
    },
  } as const,
}).execute();
