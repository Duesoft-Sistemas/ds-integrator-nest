import * as _ from 'lodash';
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
import { CryptoService } from 'src/crypto/crypto.service';
import { DataSource, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class ClientsService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
        private readonly cryptoService: CryptoService,
    ) {}

    async create(data: CreateClientDto, user: Payload): Promise<Client | { password: any }> {
        const { email, integrations: integrationIds, ...rest } = data;

        let client = await this.clientRepository.findOneBy({ cnpj: data.cnpj });

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
        }

        const password = this.cryptoService.generatePassword();
        const passwordEncrypted = await this.cryptoService.encrypt(password);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userToCreate = { user, email, password, name: data.name };
            const userProfile = queryRunner.manager.create(User, userToCreate);
            await queryRunner.manager.save(userProfile);

            const clientToCreate = {
                ...rest,
                user_id: user.id,
                profile_id: userProfile.id,
                integrations: integrationIds.map((integration_id) => ({
                    integration_id,
                })),
            };
            client = queryRunner.manager.create(Client, clientToCreate);
            await queryRunner.manager.save(client);

            await queryRunner.commitTransaction();

            return {
                ..._.omit(client, 'integrations'),
                password: passwordEncrypted,
            };
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
        const { email, integrations: integrationIds, ...rest } = data;

        let client = await this.clientRepository.findOne({
            where: { id: Not(id), cnpj: data.cnpj },
        });

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
        }

        client = await this.clientRepository.findOneBy({ id, deletedAt: IsNull() });

        if (!client) {
            throw new NotFoundException('Cliente não encontrado');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const profileToUpdate = queryRunner.manager.update(User, client.profile_id, { email });
            await queryRunner.manager.save(profileToUpdate);

            const clientToUpdate = queryRunner.manager.update(Client, client.id, {
                ...rest,
                integrations: integrationIds.map((integration_id) => ({ integration_id })),
            });
            await queryRunner.manager.save(clientToUpdate);
        } catch (ex) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                `Falha ao atualizar cliente. ${(ex as Error).message}`,
            );
        } finally {
            await queryRunner.release();
        }
    }

    async delete(data: DeleteClientDto): Promise<void> {
        const { id } = data;

        const client = await this.clientRepository.findOneBy({ id });
        if (!client) {
            throw new NotFoundException('Cliente não encontrado');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const profileToUpdate = queryRunner.manager.update(User, client.profile_id, {
                isActive: false,
                deletedAt: new Date(),
            });
            await queryRunner.manager.save(profileToUpdate);

            const clientToUpdate = queryRunner.manager.update(Client, client.id, {
                isActive: false,
                deletedAt: new Date(),
            });
            await queryRunner.manager.save(clientToUpdate);

            await queryRunner.commitTransaction();
        } catch (ex) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                `Falha ao cadastrar cliente. ${(ex as Error).message}`,
            );
        } finally {
            await queryRunner.release();
        }

        await this.clientRepository.update(id, { deletedAt: new Date(), isActive: false });
    }

    async list(): Promise<Client[]> {
        return await this.clientRepository.findBy({ deletedAt: IsNull() });
    }

    async findByUser(userId: number): Promise<Client> {
        return await this.clientRepository.findOneByOrFail({ user_id: userId });
    }
}
