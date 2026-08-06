import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";

@Injectable()
export class RelationshipService {
  public constructor(private readonly prisma: PrismaService) {}

  /**
   * Проверяет, есть ли блокировка между пользователями (в любую сторону)
   * @throws HttpException если существует блокировка (userA заблокировал userB или наоборот)
   */
  public async isBlockedOrThrow(userA: string, userB: string): Promise<void> {
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userA, blockedId: userB },
          { blockerId: userB, blockedId: userA },
        ],
      },
    });

    if (block) {
      // Определяем, кто кого заблокировал, чтобы выдать понятное сообщение
      const isBlockerA = block.blockerId === userA;
      const blockerName = isBlockerA ? "You" : "The user";
      const blockedName = isBlockerA ? "you" : "you";
      throw new HttpException(
        `${blockerName} have blocked ${blockedName}`,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Проверяет, есть ли подписка между пользователями
   */
  public async hasFollow(followerId: string, followeeId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });

    return follow;
  }

  /**
   * Проверяет, есть ли блокировка между пользователями (конкретное направление)
   */
  public async hasBlock(blockerId: string, blockedId: string) {
    const block = await this.prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });

    return block;
  }
}
