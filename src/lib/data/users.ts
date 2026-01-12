import raw from "@/data/users.json";
import { Results, UserId, UserResultsMap } from "@/lib/types";

const USER_RESULTS = raw as UserResultsMap;

export function getUserResults(userId: UserId): Results | null {
  return USER_RESULTS[userId] ?? null;
}
