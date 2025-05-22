import { HttpException, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as generateUuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service extends S3Client {
  private bucketName: string;
  private region: string;
  constructor(private configS: ConfigService) {
    super();
    this.initConfig = {
      region: this.configS.get<string>('AWS_REGION') as string,
      credentials: {
        accessKeyId: this.configS.get<string>('AWS_ACCESS_KEY') as string,
        secretAccessKey: this.configS.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    };
    this.bucketName = this.configS.get<string>('AWS_BUCKET') as string;
    this.region = this.configS.get<string>('AWS_REGION') as string;
  }

  async uploadFile(file: Express.Multer.File, prefix: string) {
    const fileName = `${prefix}/${generateUuid()}`;
    const cmd = this.sendFileCommand(file, fileName);
    const response = await this.send(cmd);
    const {
      $metadata: { httpStatusCode },
    } = response;
    if (httpStatusCode === 200) {
      return fileName;
    }
  }

  sendFileCommand(file: Express.Multer.File, fileName: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    return command;
  }

  async getFielCommand() {}
}
