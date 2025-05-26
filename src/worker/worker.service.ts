import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async callSelf(): Promise<void> {
    try {
      const url = this.configService.get('APP_URL');
      await fetch(url);

      this.logger.log(`API executando com sucesso!`);
    } catch (err) {
      this.logger.error(`Falha ao tentar chamar api. ${(err as Error).message}`);

      throw err;
    }
  }

  async clearIntegrationHistory(): Promise<void> {
    try {
      const query = `DELETE FROM integration_history WHERE created_at < NOW() - INTERVAL '2 day'`;
      await this.dataSource.query(query);

      this.logger.log(`Histórico limpo com sucesso com sucesso!`);
    } catch (err) {
      this.logger.error(
        `Falha ao tentar limpar histórico da integração. ${(err as Error).message}`,
      );

      throw err;
    }
  }
}
