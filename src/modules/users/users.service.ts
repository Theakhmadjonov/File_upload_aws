import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { S3Service } from 'src/core/storage/s3/s3.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/core/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly s3: S3Service,
    private readonly Jwt: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const findUser = await this.db.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (findUser) throw new ConflictException('User already exists');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = await this.db.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });
    const token = await this.Jwt.signAsync({ id: user.id });
    return { user, token };
  }

  async updateUser(
    id: string,
    updateUserto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const fileName = await this.s3.uploadFile(file, 'images');
    const updatedUser = await this.db.prisma.user.update({
      where: {
        id,
      },
      data: updateUserto,
    });
    const userFile = await this.db.prisma.userFiles.create({
      data: {
        userId: id,
        imageKey: fileName as string,
      },
    });
    return updatedUser;
  }

  async getProfile(id: string) {
    const user = await this.db.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        file: true,
        createdAt: true,
        updatedAt: true,
        username: true,
      },
    });
    return user;
  }
}
