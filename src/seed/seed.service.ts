/* eslint-disable prettier/prettier */
import { Integration } from '@entities/integration/integration.entity';
import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { User } from '@entities/users/users.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ClientsService } from 'src/clients/clients.service';
import { CreateClientWithPasswordDto } from 'src/clients/dtos/create-client.dto';
import { CreateIntegrationDto } from 'src/integrations/integrations.dtos';
import { IntegrationsService } from 'src/integrations/integrations.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly clientService: ClientsService,
    private readonly integrationService: IntegrationsService,
  ) {}

  async run() {
    const userAdmin = await this.seedUserAdmin();
    const integrations = await this.seedIntegrations(userAdmin);

    await this.seedClients(
      userAdmin,
      integrations.filter((r) => r.key === IntegrationKey.tray),
    );
  }

  async seedUserAdmin(): Promise<User> {
    try {
      const data: CreateUserDto = {
        name: 'Duesoft',
        email: 'admin@duesoft.com.br',
        password: 'due_soft_339',
      };

      const register =
        (await this.userService.find({ email: data.email })) ??
        (await this.userService.createAdmin(data));

      this.logger.log(`Usuário ${register.name} criado com sucesso!`);

      return register;
    } catch (err) {
      this.logger.error(`Falha no seed de usuário admin. ${(err as Error).message}`);
      throw err;
    }
  }

  async seedIntegrations(user: User): Promise<Integration[]> {
    try {
      const data: CreateIntegrationDto[] = [
        { key: IntegrationKey.tray, name: 'Tray' },
        { key: IntegrationKey.espelhamento, name: 'Espelhamento' },
      ];

      const integrations = await Promise.all(
        data.map(async (item) => {
          const register =
            (await this.integrationService.find({ key: item.key })) ??
            (await this.integrationService.create(item, user));

          this.logger.log(`Integração ${register.name} criado com sucesso!`);

          return register;
        }),
      );

      return integrations;
    } catch (err) {
      this.logger.error(`Falha no seed de integrações. ${(err as Error).message}`);
      throw err;
    }
  }

  async seedClients(user: User, integrations: Integration[]): Promise<void> {
    try {
      const integrationIds = integrations.map((r) => r.id);
      const data: CreateClientWithPasswordDto[] = [
        { cnpj: '14444619000361', email: 'nayamyplussize@duesoft.com', name: 'Nayamy Plus Size', password: 'GkBRDqeRRbN3', integrations: integrationIds },
        { cnpj: '46036378000146', email: 'dcgunshouse@duesoft.com', name: 'DC Guns House', password: 'fFB6f2hZLFNX', integrations: integrationIds },
        { cnpj: '56560857000110', email: 'leledacuca@duesoft.com', name: 'Lele da cuca', password: 'A1JlgSLUmIH8', integrations: integrationIds },
        { cnpj: '29685477000130', email: 'farmsrugs@duesoft.com', name: 'Farms Rugs', password: 'epVi1Gp4rG4t', integrations: integrationIds },
        { cnpj: '34445466000112', email: 'forcaeluz@duesoft.com', name: 'Forca e Luz Solar', password: 'pgU9sLtReUIM', integrations: integrationIds },
        { cnpj: '00670226000108', email: 'rifane@duesoft.com', name: 'Rifane', password: '9fHMZHoj6SOh', integrations: integrationIds },
        { cnpj: '03255644000119', email: 'oklahoma@duesoft.com', name: 'Oklahoma Country Fashion', password: '6Z1Lr9mNrX0I', integrations: integrationIds },
        { cnpj: '30435064000186', email: 'cantagallo@duesoft.com', name: 'Cantagallo', password: 'A4Tyq4BiuAZr', integrations: integrationIds },
        { cnpj: '02373715000115', email: 'prudental@duesoft.com', name: 'Prudental', password: 'YC4IO8D6lBqMqXwn', integrations: integrationIds },
        { cnpj: '45844254000124', email: 'rvtech@duesoft.com', name: 'RV Tech', password: 'fgMeK9bDtEOEinoy', integrations: integrationIds },
        { cnpj: '00992787000115', email: 'mmdistribuidora@duesoft.com', name: 'M.M Distribuidora', password: 'WiQ4A+3erCiT4S14', integrations: integrationIds },
        { cnpj: '58539800000165', email: 'autocar@duesoft.com', name: 'Autocar Distribuidora', password: 'eAcCWZfGpTmzgSAJ', integrations: integrationIds },
        { cnpj: '55333363000130', email: 'papelariaprudentina@duesoft.com', name: 'Papelaria Prudentina', password: 'XyAqJfK/iTGAvD8h', integrations: integrationIds },
        { cnpj: '02956576000152', email: 'prudenflex@duesoft.com', name: 'Prudenflex', password: 'cTk4JvC5lUmtoxIK', integrations: integrationIds },
        { cnpj: '02253710000159', email: 'microtec@duesoft.com', name: 'Microtec', password: 'W3sUWMa+nhOynHI7', integrations: integrationIds },
      ];

      await Promise.all(
        data.map(async (item) => {
          const register =
            (await this.clientService.find({ cnpj: item.cnpj })) ??
            (await this.clientService.createWithPassword(item, user));

          this.logger.log(`Cliente ${register.name} criado com sucesso!`);

          return register;
        }),
      );
    } catch (err) {
      this.logger.error(`Falha no seed de clientes. ${(err as Error).message}`);
      throw err;
    }
  }
}
