import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MinLength 
} from 'class-validator';

export class CreateNotificationsRolDto {

   @ApiProperty({
        description: 'Mensaje',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    mensaje: string;

    @IsString({ each: true })
    @IsArray()
    roles: string[];
}
