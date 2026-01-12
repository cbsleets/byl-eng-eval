export const ROLES = [
  "leader",
  "strategist",
  "organizer",
  "connector",
  "innovator",
  "builder",
  "challenger",
  "caretaker",
  "supporter",
  "expert",
] as const;

export type RoleId = (typeof ROLES)[number];

export function isRoleId(value: unknown): value is RoleId {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}

export type Role = {
  id: RoleId;
  name: string;
  role_desc: string;
  core_drive: string;
  most_like_when: string;
  high_rank_desc: string;
  low_rank_desc: string;
  top_rank_desc: string;
  bottom_rank_desc: string;
};

export type Results = Record<RoleId, number>;

export type UserId = string;

export function isUserId(value: unknown): value is UserId {
  return typeof value === "string";
}

export type UserResultsMap = Record<UserId, Results>;
