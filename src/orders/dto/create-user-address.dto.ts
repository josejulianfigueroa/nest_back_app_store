import {   IsString 
} from 'class-validator';

export class CreateUserAddressDto {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    address: string;

    @IsString()
    address2: string;

    @IsString()
    phone: string;

    @IsString()
    city: string;

    @IsString()
    idCountry: string;
}   