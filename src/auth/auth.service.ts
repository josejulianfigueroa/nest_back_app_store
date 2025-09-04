import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');
    
  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private readonly jwtService: JwtService,
  ) {}


  async create( createUserDto: CreateUserDto) {

      const client = await this.clientRepository.findOne({
      where: { id: createUserDto.idClient }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }

      const userValid = await this.userRepository.findOne({
      where: { email: createUserDto.email, client },
      select: { email: true, password: true, id: true, role: true, image: true, fullName: true,
              isActive: true, emailVerified: true, tokenPhone: true, createdAt: true
       }
    });

    if ( userValid ) 
      {  throw new BadRequestException( "Usuario ya existe" );    }

      const { password, idClient, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ),
        client
      });

      await this.userRepository.save( user )
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };
     
  }

  async login( loginUserDto: LoginUserDto ) {

    const { password, email, idClient } = loginUserDto;

     const client = await this.clientRepository.findOne({
      where: { id: idClient }
    });

    if(!client){
        throw new BadRequestException( "Cliente/Empresa no existe" );
    }

       const user = await this.userRepository.findOne({
      where: { email, client },
      select: { email: true, password: true, id: true, role: true, image: true, fullName: true,
              isActive: true, emailVerified: true, tokenPhone: true, createdAt: true, rut: true
       }
    });

    if ( !user ) 
      throw new UnauthorizedException('Credenciales no válidas (email)');
      
    if (!user.password || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no válidas (password)');

      delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
 
  }

  async checkAuthStatus( user: User ){

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }
  
  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }

 async findAllUsers( idCliente: string) {

       const client = await this.clientRepository.findOne({
      where: { id: idCliente }
    });

    if(!client){
         throw new BadRequestException( "Cliente/Empresa no existe" );
    }
    
    return await this.userRepository.find({
      where: { client }
    });
  }

}
