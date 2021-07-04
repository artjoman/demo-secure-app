import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './login-user.dto';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    async create(userDto: UserDto): Promise<any> {
        const { username, password } = userDto;

        // check if the user exists in the db    
        const userInDb = await this.usersRepository.findOne({
            where: { username }
        });
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const user: User = await this.usersRepository.create({ username, password, });
        await this.usersRepository.save(user);
        return user;
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async findByPayload({ username }: any): Promise<User> {
        return await this.usersRepository.findOne({
            where: { username }
        });
    }

    async findByLogin({ username, password }: LoginUserDto): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { username } });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        // compare passwords    
        const areEqual = await this.comparePasswords(user.password, password);

        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    private async comparePasswords(passwordHash, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const match = await bcrypt.compare(password, passwordHash);

        if (!match) {
            return false;
        } else {
            return true;
        }
    }
}