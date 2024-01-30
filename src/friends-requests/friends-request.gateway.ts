import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export class FriendsRequestGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]): any {
    // Todo
    const userId = args[0].userId;
    client.join(userId.toString());
  }

  handleDisconnect(client: Socket): any {
    // Todo
  }

  handleFriendRequest(payload: {
    senderId: number;
    recipientId: number;
  }): void {
    this.server
      .to(payload.recipientId.toString())
      .emit('friend-request', payload);
  }
}
