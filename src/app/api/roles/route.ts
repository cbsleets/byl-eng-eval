import { NextResponse } from "next/server";
import { getAllRoles } from "@/lib/data/roles";

export async function GET() {
  const roles = getAllRoles();

  return NextResponse.json({ roles }, { status: 200 });
}
