import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';

export class UpdateImagesProductDto {

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images: string[];

}
