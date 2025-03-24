import { User } from '@entities/users/users.entity';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import * as _ from 'lodash';

const payloadFields = ['id', 'email', 'name', 'roles', 'photo', 'isAdmin', 'isActive'] as Array<
  keyof User
>;

export type TokenType = 'access' | 'refresh';

export class Payload extends PickType(User, payloadFields) {
  @IsNumber()
  @Expose({ name: 'client_id' })
  clientId?: number;

  constructor(user: User) {
    super();

    payloadFields.forEach((key) => {
      const value = _.get(user, key);
      if (value) Object.assign(this, { [key]: value });
    });

    this.clientId = user.client?.id;
  }
}
