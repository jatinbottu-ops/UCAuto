import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, TokenPayload } from "./auth";

export async function requireAuth(
  request: NextRequest
): Promise<{ payload: TokenPayload } | NextResponse> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAccessToken(token);
    return { payload };
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
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
