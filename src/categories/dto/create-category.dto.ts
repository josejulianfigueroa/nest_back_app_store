import { IsString, IsUUID, MinLength } from "class-validator";

export class CreateCategoryDto {
    
        @IsString()
        @MinLength(1)
        name: string;
    
        @IsString()
        image: string;
    
        @IsString()
        @IsUUID('4', { message: 'El idClient debe ser un UUID válido' })
        idClient: string;

}
