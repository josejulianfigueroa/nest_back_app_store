import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ClientsService {

  constructor(

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

     @InjectRepository(User)
      private readonly userRepository: Repository<User>,

  ) {}

  async create(createClientDto: CreateClientDto) {
      
      const clientExist = await this.clientRepository.findOne({
      where: { email: createClientDto.email, rut: createClientDto.rut }
    });

    if(clientExist){
         throw new BadRequestException( "Cliente/Empresa ya existe" );
    }
    
         const client = this.clientRepository.create({
          ...createClientDto
         });
   
         await this.clientRepository.save( client )
   
         return {
           client
         };
  }

  async findAllByClient(idClient: string) {
  
    const client = await this.clientRepository.findOne({
        where: { id: idClient }
      });
  
      if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
      }
        return { client };
      
    }

    async findAllClient() {
  
    return await this.clientRepository.find();
      
    }
}
