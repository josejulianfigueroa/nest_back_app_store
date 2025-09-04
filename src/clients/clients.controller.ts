import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('create')
    @ApiResponse({ status: 201, description: 'Client was created', type: CreateClientDto  })
    @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('get/:idCliente')
  @ApiResponse({ status: 400, description: 'Bad request' })
  findAllByClient(@Param('idCliente', ParseUUIDPipe ) idCliente: string, ) {
    return this.clientsService.findAllByClient(idCliente);
  }

  @Get('get/all/listar')
  @ApiResponse({ status: 400, description: 'Bad request' })
  findAllClient() {
    return this.clientsService.findAllClient();
  }


/*
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
    */
}
