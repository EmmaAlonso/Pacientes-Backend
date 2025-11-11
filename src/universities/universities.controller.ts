import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('universities')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crear una o varias universidades' })
  @ApiResponse({
    status: 201,
    description: 'Universidad o universidades creadas.',
  })
  create(
    @Body() createUniversityDto: CreateUniversityDto | CreateUniversityDto[],
  ) {
    return this.universitiesService.create(createUniversityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las universidades' })
  @ApiResponse({ status: 200, description: 'Lista de universidades.' })
  findAll() {
    return this.universitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener universidad por ID' })
  @ApiResponse({ status: 200, description: 'Universidad encontrada.' })
  findOne(@Param('id') id: string) {
    return this.universitiesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar universidad' })
  @ApiResponse({ status: 200, description: 'Universidad actualizada.' })
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ) {
    return this.universitiesService.update(+id, updateUniversityDto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Eliminar universidad' })
  @ApiResponse({ status: 200, description: 'Universidad eliminada.' })
  remove(@Param('id') id: string) {
    return this.universitiesService.remove(+id);
  }
}
