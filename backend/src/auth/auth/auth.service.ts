import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/jwt.payload';
import { LoginUserDto } from 'src/user/login-user.dto';
import { UserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}
    async validateUser(payload: JwtPayload): Promise<User> {
        const user = await this.usersService.findByPayload(payload);    
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
        }    
        return user;  
    }

    async register(loginUserDto: LoginUserDto): Promise<any> {    
        const userDto = new UserDto();
        userDto.username = loginUserDto.username;
        userDto.password = loginUserDto.password;
        this.usersService.create(userDto);
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {    
        // find user in db    
        const user = await this.usersService.findByLogin(loginUserDto);
        
        // generate and sign token    
        const token = this._createToken(user);
        
        return {
            username: user.username, ...token,    
        };  
    }
    
    private _createToken({ username }: UserDto): any {
        const user: JwtPayload = { username };    
        const accessToken = this.jwtService.sign(user);    
        return {
            expiresIn: 600,
            accessToken,    
        };  
    }

}
