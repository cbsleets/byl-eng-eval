import { getUserResults } from "@/lib/data/users";
import { getAllRoles } from "@/lib/data/roles";
import { RoleId } from "@/lib/types";
import BreakdownClient from "./BreakdownClient";

export default async function Breakdown() {
  // 1. Get user 24601's scores
  const results = getUserResults("24601");
  
  // 2. Get all role information
  const allRoles = getAllRoles();

  // If no results found, show error
  if (!results) {
    return <div>User not found</div>;
  }

  // 3. Sort roles by score (highest to lowest)
  const sortedRoles = allRoles
    .map((role) => ({
      ...role,
      score: results[role.id as RoleId],
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <BreakdownClient sortedRoles={sortedRoles} />
    </div>
  );
}
