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

@WebSocketGateway(5001)
export class FriendsRequestGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  private readonly users: Map<string, string> = new Map();

  handleConnection(@ConnectedSocket() client: Socket): void {
    const userId = client.handshake.query?.userId.toString();
    const socketId = client.id;

    if (!userId || !socketId) {
      throw new WsException('invalid-credentials');
    }

    this.users.set(userId, socketId);
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
