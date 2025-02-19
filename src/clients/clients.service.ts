import { Client } from '@entities/clients/clients.entity';
import { User } from '@entities/users/users.entity';
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/auth/auth.dtos';
import { CreateClientDto, DeleteClientDto, UpdateClientDto } from 'src/clients/clients.dtos';
import { IntegrationsService } from 'src/integrations/integrations.service';
import { DataSource, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class ClientsService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
        private readonly integrationsService: IntegrationsService,
    ) {}

    async create(data: CreateClientDto, user: Payload): Promise<Client> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { profile, integrations: integrationIds, ...rest } = data;

            let client = await this.clientRepository.findOneBy({ cnpj: data.cnpj });

            if (client) {
                throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
            }

            const userToCreate = { ...profile, user, name: data.name };
            const userProfile = queryRunner.manager.create(User, userToCreate);
            await queryRunner.manager.save(userProfile);

            const integrations = await this.integrationsService.listByIds(integrationIds);
            const clientToCreate = { ...rest, user, integrations, profile: userProfile };
            client = queryRunner.manager.create(Client, clientToCreate);
            await queryRunner.manager.save(client);

            await queryRunner.commitTransaction();

            return client;
        } catch (ex) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                `Falha ao cadastrar cliente. ${(ex as Error).message}`,
            );
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, data: UpdateClientDto): Promise<void> {
        const { cnpj, name, profile, integrations: integrationIds } = data;

        let client = await this.clientRepository.findOneBy({ id });

        if (!client) {
            throw new NotFoundException('Cliente não encontrado');
        }

        client = await this.clientRepository.findOne({ where: { id: Not(id), cnpj } });

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${cnpj} já registrado`);
        }

        const integrations = await this.integrationsService.listByIds(integrationIds);
        await this.clientRepository.update(id, { cnpj, name, profile, integrations });
    }

    async delete(data: DeleteClientDto): Promise<void> {
        const { id } = data;

        if (!(await this.clientRepository.findOneBy({ id }))) {
            throw new NotFoundException('Cliente não encontrado');
        }

        await this.clientRepository.update(id, { deletedAt: new Date() });
    }

    async list(): Promise<Client[]> {
        return await this.clientRepository.findBy({ deletedAt: IsNull() });
    }
}
