import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateClientDto {

        @IsString()
        @IsEmail()
        email: string;
    
        @IsString()
        @MinLength(3)
        fullName: string;

        @IsString()
        @MinLength(3)
        rut: string;

        @IsString()
        image: string;

        @IsString()
        @MinLength(3)
        phone: string;

        @IsString()
        @MinLength(3)
        address: string;

        @IsString()
        web: string;

        @IsString()
        horario: string;
        
}
