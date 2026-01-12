import raw from "@/data/roles.json";
import { Role, RoleId } from "@/lib/types";

const ROLES = raw as Role[];

export function getAllRoles(): Role[] {
  return ROLES;
}

export function getRoleById(roleId: RoleId): Role | null {
  return ROLES.find((role) => role.id === roleId) ?? null;
}
