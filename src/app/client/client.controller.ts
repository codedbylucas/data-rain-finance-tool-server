import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateClienteResponse } from './protocols/create-client-response';
import { FindAllClientsResponse } from './protocols/find-all-clients-response';
import { FindClientByIdResponse } from './protocols/find-client-by-id-response';
import { ClientService } from './service/client.service';
import { ClientResponsesDto } from './service/dto/client-responses.dto';
import { CreateClientDto } from './service/dto/create-client.dto';

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() dto: CreateClientDto,
  ): Promise<CreateClienteResponse> {
    return await this.clientService.createClient(dto);
  }

  @Post('budget-request')
  async clientResponses(@Body() dto: ClientResponsesDto) {
    return await this.clientService.createClientResponses(dto);
  }

  @Get()
  async findAllClients(): Promise<FindAllClientsResponse[]> {
    return await this.clientService.findAllClients();
  }

  @Get(':id')
  async findClientById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FindClientByIdResponse> {
    return await this.clientService.findClientById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteClientById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.clientService.deleteClientById(id);
  }
}
