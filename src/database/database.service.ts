import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import "dotenv/config";


// -- Source - https://stackoverflow.com/a/79855497
// -- Posted by Beterraba, modified by community. See post 'Timeline' for change history
// -- Retrieved 2026-03-15, License - CC BY-SA 4.0



@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        await this.$connect()
    }

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL as string,
        });
        super({ adapter });

}}