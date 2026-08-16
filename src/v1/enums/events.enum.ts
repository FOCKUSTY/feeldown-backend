import { Enumeration } from "@/utils";

export const EventsEnumeration = new Enumeration({});

export const Events = EventsEnumeration.enumeration;
export type Events = typeof EventsEnumeration.type;
