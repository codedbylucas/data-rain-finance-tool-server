import { Injectable } from '@nestjs/common';
import { createUuid } from 'src/app/util/create-uuid';
import { CreateClienteResponse } from '../protocols/create-client-response';
import { ClientRepository } from '../repositories/client.repository';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async createClient(dto: CreateClientDto): Promise<CreateClienteResponse> {
    dto.companyName = dto.companyName.toLowerCase().trim();
    dto.phone = dto.phone.replace(/\s/g, '').replace(/[^0-9]/g, '');

    const clientCreated = await this.clientRepository.createClient({
      ...dto,
      id: createUuid(),
    });
    return {
      id: clientCreated.id,
      name: clientCreated.name,
      companyName: clientCreated.companyName,
      email: clientCreated.email,
      phone: clientCreated.phone,
    };
  }
}
