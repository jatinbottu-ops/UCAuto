import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { prisma } from "@/lib/db";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function requireAuth(
  _request: NextRequest
): Promise<{ payload: TokenPayload } | NextResponse> {
  const stackUser = await stackServerApp.getUser({ or: "return-null" });
  if (!stackUser || !stackUser.primaryEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prismaUser = await prisma.user.findUnique({
    where: { stackAuthId: stackUser.id },
    select: { id: true, email: true, role: true },
  });

  if (!prismaUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { payload: { userId: prismaUser.id, email: prismaUser.email, role: prismaUser.role } };
}

export async function requireAdmin(
  request: NextRequest
): Promise<{ payload: TokenPayload } | NextResponse> {
  const result = await requireAuth(request);
  if (result instanceof NextResponse) return result;

  if (result.payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return result;
}
