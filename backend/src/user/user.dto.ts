import { IsNotEmpty } from "class-validator";

export class UserDto {  
    id: string;
    @IsNotEmpty()  username: string;
    @IsNotEmpty()  password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
}