import { Enumeration } from "@/utils";

export const EventsEnumeration = new Enumeration({
  POST_CREATED: "post.created",
  FOLLOW_CREATED: "follow.created",
  FRIENDSHIP_REQUEST_CREATED: "friendship-request.created",
  FRIENDSHIP_REQUEST_UPDATED: "friendship-request.updated",
});

export const Events = EventsEnumeration.enumeration;
export type Events = typeof EventsEnumeration.type;
