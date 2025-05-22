import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

interface ExtendedPrismaClient extends PrismaClient {}

export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(DatabaseService.name);
  public prisma: ExtendedPrismaClient;
  constructor(private configS: ConfigService) {
    this.prisma = new PrismaClient().$extends({
      result: {
        userFiles: {
          imageUrl: {
            needs: {
              imageKey: true,
            },
            compute(userFiles) {
              if (!userFiles.imageKey) return null;
              const url = process.env.AWS_DOMAIN;
              const imageUrl = `${url}/${userFiles.imageKey}`;
              return imageUrl;
            },
          },
        },
      },
    }) as unknown as ExtendedPrismaClient;
  }
  async onModuleInit() {
    try {
      await this.prisma.$connect();
      this.logger.log('Database connected');
    } catch (error) {
      this.logger.error(error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
