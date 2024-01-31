import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToWs().getClient();
    try {
      const authHeader = req.handshake.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      console.log(authHeader, 'asda');

      if (bearer !== 'Bearer' || !token) {
        throw new WsException({
          message: 'Пользователь не авторизован',
        });
      }

      req.userId = this.jwtService.verify(token).sub;
      return true;
    } catch (e) {
      throw new WsException('Unauthorized');
    }
  }
}
