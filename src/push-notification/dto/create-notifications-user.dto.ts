import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength 
} from 'class-validator';

export class CreateNotificationsUserDto {

   @ApiProperty({
        description: 'Mensaje',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    mensaje: string;

    @IsString()
    @IsUUID('4', { message: 'El idUserToSend debe ser un UUID válido' })
    idUserToSend: string;
}
