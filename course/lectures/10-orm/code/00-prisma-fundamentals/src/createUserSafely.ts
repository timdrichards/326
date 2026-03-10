import { Prisma } from '@prisma/client'
import type { PrismaClient, User } from '@prisma/client'

type CreateUserResult =
  | { ok: true; user: User }
  | { ok: false; reason: 'duplicate_email' }

export async function createUserSafely(
  prisma: PrismaClient,
  email: string,
  name?: string,
): Promise<CreateUserResult> {
  try {
    const user = await prisma.user.create({
      data: { email, name },
    })

    return { ok: true, user }
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { ok: false, reason: 'duplicate_email' }
    }

    throw error
  }
}
