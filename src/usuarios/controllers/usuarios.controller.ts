import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { LogsService } from '../../logs/services/logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '../../common/enums/rol.enum';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly logsService: LogsService,
  ) {}

  @Get('publico')
  @ApiOperation({ summary: 'Endpoint público de prueba' })
  @ApiResponse({ status: 200, description: 'Respuesta pública.' })
  publico() {
    return { mensaje: 'Funciona sin autenticación' };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN, Rol.TALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  findAll(@Req() req) {
    console.log('Usuario autenticado:', req.user);
    return this.usuariosService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado.' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto, @Req() req) {
    const usuario = await this.usuariosService.create(createUsuarioDto);
    await this.logsService.registrarLog({
      usuarioId: req.user.id,
      accion: 'CREAR_USUARIO',
      detalle: `Usuario creado: ${usuario.email}`,
    });
    return usuario;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN, Rol.TALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() req,
  ) {
    const usuario = await this.usuariosService.update(+id, updateUsuarioDto);
    await this.logsService.registrarLog({
      usuarioId: req.user.id,
      accion: 'ACTUALIZAR_USUARIO',
      detalle: `Usuario actualizado: ${usuario.email}`,
    });
    return usuario;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado.' })
  async remove(@Param('id') id: string, @Req() req) {
    await this.usuariosService.remove(+id);
    await this.logsService.registrarLog({
      usuarioId: req.user.id,
      accion: 'ELIMINAR_USUARIO',
      detalle: `Usuario eliminado: ID ${id}`,
    });
    return { message: 'Usuario eliminado' };
  }
}
