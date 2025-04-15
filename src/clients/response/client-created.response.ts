import { Client } from '@entities/clients/clients.entity';

export class ClientCreatedResponse extends Client {
  password: string;
}
