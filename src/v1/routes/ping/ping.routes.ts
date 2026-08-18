import { Routes } from "@/utils";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "ping",
  routes: {
    GET: "",
  },
  operations: {
    GET: {
      summary: "get ping",
    },
  },
}).execute();
