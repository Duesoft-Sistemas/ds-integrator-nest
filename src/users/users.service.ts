import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dtos';
import { User } from '@entities/users/users.entity';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@entities/users/users.role';
import { Payload } from 'src/jwt/jwt.dto';

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
            where: { email },
            relations: ['client'],
        });
    }

    async createAdmin(data: CreateUserDto, user: Payload): Promise<User> {
        let register = await this.findByEmail(data.email);

        if (register) {
            throw new ConflictException(`O e-mail ${register.email} já existe`);
        }

        register = this.usersRepository.create(data);
        register.userId = user.id;
        register.roles = [UserRole.admin];
        return await this.usersRepository.save(register);
    }

    async create(data: CreateUserDto, user: Payload): Promise<User> {
        const { email } = data;

        let register = await this.findByEmail(email);

        if (register) {
            throw new ConflictException(`O e-mail ${register.email} já existe`);
        }

        register = this.usersRepository.create(data);
        register.userId = user.id;
        register.roles = [UserRole.support];
        return await this.usersRepository.save(register);
    }
}
