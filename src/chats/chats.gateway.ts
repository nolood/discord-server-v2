import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';

@WebSocketGateway(5002)
export class ChatsGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(private readonly authService: AuthService) {}

  private readonly users: Map<string, string> = new Map();

  handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.authService.handleWsAuth(
        client.handshake.headers.authorization,
      );
      const socketId = client.id;

      if (!userId || !socketId) {
        throw new WsException('unauthorized');
      }

      this.users.set(userId, socketId);
    } catch (e) {
      client.emit('invalid-credentials');
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const socketId = client.id;

    this.users.forEach((value, key) => {
      if (value === socketId) {
        this.users.delete(key);
      }
    });
  }
}
