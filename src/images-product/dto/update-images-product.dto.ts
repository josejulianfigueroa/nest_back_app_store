import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, IsUUID, MinLength 
} from 'class-validator';

export class UpdateImagesProductDto {

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images: string[];

    @IsString()
    @IsUUID('4', { message: 'El idClient debe ser un UUID válido' })
    idClient: string;

}
