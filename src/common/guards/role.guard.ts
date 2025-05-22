// import {
//     CanActivate,
//     ExecutionContext,
//     ForbiddenException,
//     Injectable,
//   } from '@nestjs/common';
//   import { Reflector } from '@nestjs/core';
//   import { PrismaService } from 'src/core/database/prisma.service';
  
//   @Injectable()
//   class RoleGuard implements CanActivate {
//     constructor(
//       private prisma: PrismaService,
//       private reflector: Reflector,
//     ) {}
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//       const request = context.switchToHttp().getRequest();
//       const userId = request.userId;
//       const findUser = await this.prisma.user.findUnique({
//         where: { id: userId },
//       });
//       if (!findUser) throw new ForbiddenException('User not found');
//       const userRole = findUser?.role;
//       const handler = context.getHandler();
//       const roles = this.reflector.get('roles', handler);
//       if (!roles.includes(userRole))
//         throw new ForbiddenException('Role required');
//       return true;
//     }
//   }
//   export default RoleGuard;
  