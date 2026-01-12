"use server";

import { getUserResults } from "@/lib/data/users";
import { Results, UserId } from "@/lib/types";

export type GetUserResultsSuccess = {
  ok: true;
  userId: UserId;
  results: Results;
};

export type GetUserResultsError = {
  ok: false;
  error: string;
};

export type GetUserResultsResponse =
  | GetUserResultsSuccess
  | GetUserResultsError;

export default async function getUserResultsAction(
  userId: string
): Promise<GetUserResultsResponse> {
  if (!userId || typeof userId !== "string") {
    return { ok: false, error: "Missing or invalid userId" };
  }

  const results = getUserResults(userId);

  if (!results) {
    return { ok: false, error: "Results not found" };
  }

  return { ok: true, userId, results };
}
