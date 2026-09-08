import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

/** The signed-in user, read from the session cookie — never from the request body. */
export async function currentUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new HttpError(401, "ต้องเข้าสู่ระบบก่อนทำรายการนี้");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new HttpError(403, "ต้องมีสิทธิ์ผู้ดูแลระบบ");
  return user;
}

/** Turns a thrown HttpError into its response and anything else into a 500. */
export function fail(error: unknown, fallback = "เกิดข้อผิดพลาดในระบบ") {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: fallback }, { status: 500 });
}

export function badRequest(message: string) {
  return new HttpError(400, message);
}

/** Coerces to a positive integer or throws — ids and quantities never arrive trusted. */
export function intOrFail(value: unknown, field: string, { min = 1, max = 1_000_000 } = {}) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw badRequest(`${field} ไม่ถูกต้อง`);
  }
  return n;
}

export function textOrFail(value: unknown, field: string, { max = 500, min = 1 } = {}) {
  const s = typeof value === "string" ? value.trim() : "";
  if (s.length < min || s.length > max) {
    throw badRequest(`${field} ต้องมีความยาว ${min}–${max} ตัวอักษร`);
  }
  return s;
}
