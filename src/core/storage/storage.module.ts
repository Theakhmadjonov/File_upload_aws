import { Global, Module } from "@nestjs/common";
import { S3Service } from "./s3/s3.service";

@Global()
@Module({
    providers: [S3Service],
    controllers: [],
    exports: [S3Service]
})
export class StorageModule{ } 