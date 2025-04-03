import { User } from '@entities/users/users.entity';
import { UserRole } from '@entities/users/users.role';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/jwt/jwt.dto';
import { Not, Repository } from 'typeorm';

import { CreateUserDto } from './users.dtos';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private repository: Repository<User>,
  ) {}

  validDevice(deviceId: string): boolean {
    const deviceAuthorized = this.configService.get<string>('APP_DEVICE_ID');

    return !!deviceId && !!deviceAuthorized && deviceAuthorized == deviceId;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
      relations: ['client'],
    });
  }

  async createAdmin(data: CreateUserDto): Promise<User> {
    let register = await this.findByEmail(data.email);

    if (register) {
      throw new ConflictException(`O e-mail ${register.email} já existe`);
    }

    register = this.repository.create(data);
    register.isAdmin = true;
    register.roles = [UserRole.admin];
    return await this.repository.save(register);
  }

  async create(data: CreateUserDto, user: Payload): Promise<User> {
    const { email } = data;

    let register = await this.findByEmail(email);

    if (register) {
      throw new ConflictException(`O e-mail ${register.email} já existe`);
    }

    register = this.repository.create(data);
    register.userId = user.id;
    register.roles = [UserRole.support];
    return await this.repository.save(register);
  }

  async update(id: number, data: CreateUserDto): Promise<User> {
    const { email } = data;

    const register = await this.repository.findOneBy({ id });

    if (!register) {
      throw new NotFoundException(`Registro ID ${id} não encontrado`);
    }

    const match = await this.repository.findOneBy({ id: Not(id), email });

    if (match) {
      throw new ConflictException(`Usuário com email ${email} já cadastrado`);
    }

    Object.keys(data).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(register, key)) {
        register[key] = data[key];
      }
    });

    await this.repository.save(register);
    return register;
  }
}
