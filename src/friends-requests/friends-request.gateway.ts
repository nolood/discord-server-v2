import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../users/users.model';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway(5001)
export class FriendsRequestGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly authService: AuthService) {}

  private readonly users: Map<string, string> = new Map();

  handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.authService.handleWsAuth(
        client.handshake.headers.authorization,
      );
      const socketId = client.id;

      if (!userId || !socketId) {
        throw new WsException('Unauthorized');
      }

      this.users.set(userId, socketId);
    } catch (e) {
      client.emit('invalid-credentials');
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    const socketId = client.id;

    this.users.forEach((value, key) => {
      if (value === socketId) {
        this.users.delete(key);
      }
    });
  }

  sendFriendRequest(recipientId: number, sender: User) {
    const socketId = this.users.get(recipientId.toString());

    this.server.to(socketId).emit('new-friend-request', {
      msg: 'New friend request',
      content: sender,
    });
  }
}
