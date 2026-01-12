import { getRoleById } from "@/lib/data/roles";
import { isRoleId } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/roles/[roleId]">
) {
  const { roleId } = await ctx.params;

  if (!roleId || !isRoleId(roleId)) {
    return NextResponse.json(
      { error: "Missing or invalid roleId" },
      { status: 400 }
    );
  }

  const role = getRoleById(roleId);

  if (!role) {
    return NextResponse.json(
      { error: "Role not found", roleId },
      { status: 404 }
    );
  }

  return NextResponse.json(role, { status: 200 });
}
