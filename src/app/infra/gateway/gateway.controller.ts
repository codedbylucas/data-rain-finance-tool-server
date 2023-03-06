import { BadRequestException } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './services/gateway.service';

@WebSocketGateway(81, {
  cors: { credentials: 'http://127.0.0.1:5173/' },
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
})
export class GatewayController
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gatewayService: GatewayService) {}

  @WebSocketServer()
  public server: Server;

  handleConnection(client: Socket) {
    try {
      console.log(client.id, 'connect');
      let token = `${client.handshake.query.token}`;
      this.gatewayService.handleConnection(client.id, token);
    } catch (error) {
      console.log('errorrrrr');
    }
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, 'disconnect');
  }
}
