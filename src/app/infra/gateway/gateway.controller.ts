import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './services/gateway.service';

@WebSocketGateway(81, {
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
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
      if (!client.handshake.auth.token) {
        this.handleDisconnect(client);
        this.server.to(client.id).emit('connection', {
          status: false,
          message: 'Error making connection, token not informed',
        });
        return;
      }

      const connection = this.gatewayService.handleConnection(
        client.id,
        client.handshake.auth.token,
      );

      if (connection.isLeft()) {
        this.handleDisconnect(client);
        this.server.to(client.id).emit('connection', {
          status: false,
          message: 'Error making connection',
        });
        return;
      }

      this.server.to(client.id).emit('connection', {
        status: true,
        message: 'Connection made successfully',
      });

      console.log(client.id, 'connect');
    } catch (error) {
      console.log(error);
      this.handleDisconnect(client);
      this.server.to(client.id).emit('connection', {
        status: false,
        message: 'Error making connection',
      });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, 'disconnect');
  }
}
