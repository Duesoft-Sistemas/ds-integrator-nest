import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from './users.dtos';
import { Payload } from 'src/auth/auth.dtos';
import { User } from '@entities/users/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    validDevice(deviceId: string): boolean {
        const deviceAuthorized = this.configService.get<string>('APP_DEVICE_ID');

        return !!deviceId && !!deviceAuthorized && deviceAuthorized == deviceId;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({
            where: { email, deletedAt: IsNull() },
            relations: ['client'],
        });
    }

    async createAdmin(data: CreateUserDto, userRegister: Payload): Promise<User> {
        let user = await this.findByEmail(data.email);

        if (user) {
            throw new ConflictException(`O e-mail ${user.email} já existe`);
        }

        user = this.usersRepository.create({ ...data, user: userRegister });

        return await this.usersRepository.save(user);
    }

    async create(data: CreateUserDto, userRegister: Payload): Promise<User> {
        const { email } = data;
        let user = await this.findByEmail(email);

        if (user) {
            throw new ConflictException(`O e-mail ${user.email} já existe`);
        }

        user = this.usersRepository.create({ ...data, user: userRegister });
        return await this.usersRepository.save(user);
    }
}
