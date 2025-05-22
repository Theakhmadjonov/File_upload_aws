// import {
//     CanActivate,
//     ExecutionContext,
//     ForbiddenException,
//     Injectable,
//   } from '@nestjs/common';
//   import { JwtService } from '@nestjs/jwt';
//   import { PrismaService } from 'src/core/database/prisma.service';
  
//   @Injectable()
//   class AuthGuard implements CanActivate {
//     constructor(
//       private prisma: PrismaService,
//       private jwtService: JwtService,
//     ) {}
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const request = context.switchToHttp().getRequest();
//       const token = request.cookies?.auth_token;
//       if (!token) {
//         throw new ForbiddenException('Token not found in cookies');
//       }
//       try {
//         const { user_id } = await this.jwtService.verifyAsync(token);
//         request.userId = user_id;
//         return true;
//       } catch (error) {
//         throw new ForbiddenException('Token invalid');
//       }
//     }
//   }
//   export default AuthGuard;
  