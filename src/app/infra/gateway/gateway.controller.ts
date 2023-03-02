import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './services/gateway.service';

@WebSocketGateway(81, {
  cors: true,
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

  handleDisconnect(client: Socket) {
    console.log(client.id, 'disconnect');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log(client.id, 'connect');
  }
}
