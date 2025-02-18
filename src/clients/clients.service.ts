import { Client } from '@entities/clients/clients.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto, DeleteClientDto, UpdateClientDto } from 'src/clients/clients.dtos';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class ClientsService {
    constructor(@InjectRepository(Client) private readonly clientRepository: Repository<Client>) {}

    async create(data: CreateClientDto) {
        const { cnpj, name, integrations, profile } = data;
        let client = await this.clientRepository.findOneBy({ cnpj });

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${cnpj} já registrado`);
        }

        client = this.clientRepository.create({ cnpj, name, integrations, profile });
        return await this.clientRepository.save(client);
    }

    async update(data: UpdateClientDto) {
        const { id, cnpj, name, integrations } = data;

        if (!(await this.clientRepository.findOneBy({ id }))) {
            throw new NotFoundException('Cliente não encontrado');
        }

        if (await this.clientRepository.findOne({ where: { id: Not(id), cnpj } })) {
            throw new ConflictException(`Cliente com CNPJ ${cnpj} já registrado`);
        }

        return await this.clientRepository.update(id, { cnpj, name, integrations });
    }

    async delete(data: DeleteClientDto): Promise<void> {
        const { id } = data;

        if (!(await this.clientRepository.findOneBy({ id }))) {
            throw new NotFoundException('Cliente não encontrado');
        }

        await this.clientRepository.delete(id);
    }

    async list(): Promise<Client[]> {
        return await this.clientRepository.findBy({ deletedAt: IsNull() });
    }
}
