import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserRole } from '../../common/enum/role.enum';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);
    if (!token) return false;
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      client.data.user = payload;
      return true;
    } catch {
      return false;
    }
  }

  private extractToken(client: Socket): string | null {
    const { authorization } = client.handshake.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }
    return null;
  }
}
