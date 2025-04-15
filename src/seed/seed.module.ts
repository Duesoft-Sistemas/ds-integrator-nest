import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';
import { IntegrationsModule } from 'src/integrations/integrations.module';
import { UsersModule } from 'src/users/users.module';

import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, ClientsModule, IntegrationsModule],
  providers: [SeedService],
})
export class SeedModule implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly service: SeedService) {}

  async onModuleInit() {
    this.logger.log('******************** Iniciando Seed ********************');

    await this.service.run();

    this.logger.log('******************** Seed finalizado ********************');
  }
}
