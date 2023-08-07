import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    
    static readonly prismaRecordNotFoundCode = `P2025`;
    static readonly prismaForeignKeyError = `P2003`;


    async onModuleInit() {
        await this.$connect();
    }
    
}