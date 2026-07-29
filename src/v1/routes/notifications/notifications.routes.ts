import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "notifications",

  routes: {
    GET: "/",
    GET_ONE: "/:id",

    GET_COUNT: "/count",

    PUT_MANY: "/",
    PATCH_MANY: "/",

    PUT: "/:id",
    PATCH: "/:id",
  } as const,

  operations: {
    GET: {
      summary: "Getting an array of notification",
    },
    GET_ONE: {
      summary: "Getting a notification by id",
    },
    GET_COUNT: {
      summary: "Getting a count of notification of user",
    },
    PATCH_MANY: {
      summary: "Read/unread a notifications",
    },
    PUT_MANY: {
      summary: "Read/unread a notifications",
    },
    PUT: {
      summary: "Read/unred a notification",
    },
    PATCH: {
      summary: "Read/unred a notification",
    },
  } as const,
}).execute();
