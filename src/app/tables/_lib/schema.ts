import { parseAsInteger, parseAsString } from "nuqs/server";

export const filterParsers = {
  name: parseAsString.withDefault(""),
  minImpressions: parseAsInteger.withDefault(0),
  minConversions: parseAsInteger.withDefault(0),
};
