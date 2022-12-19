import { Body, Controller, Post } from '@nestjs/common';
import { CreateClienteResponse } from './protocols/create-client-response';
import { ClientService } from './service/client.service';
import { CreateClientDto } from './service/dto/create-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() dto: CreateClientDto,
  ): Promise<CreateClienteResponse> {
    return await this.clientService.createClient(dto);
  }
}
