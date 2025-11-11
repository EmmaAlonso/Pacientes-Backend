import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../entities/producto.entity';
import { VarianteProducto } from '../entities/variante-producto.entity';
import { ProductoEstudiante } from '../entities/producto-estudiante.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '../../common/enums/rol.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Roles(Rol.ADMIN, Rol.VENDEDOR)
  @Get()
  findAll(): Promise<Producto[]> {
    return this.productosService.findAll();
  }

  @Roles(Rol.ADMIN, Rol.VENDEDOR)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Producto> {
    return this.productosService.findOne(+id);
  }

  @Roles(Rol.ADMIN, Rol.VENDEDOR)
  @Get(':id/variantes')
  findVariantes(@Param('id') id: string): Promise<VarianteProducto[]> {
    return this.productosService.findVariantes(+id);
  }

  @Roles(Rol.ADMIN, Rol.VENDEDOR, Rol.ESTUDIANTE)
  @Get('estudiante/:estudianteId')
  findProductosEstudiante(
    @Param('estudianteId') estudianteId: string,
  ): Promise<ProductoEstudiante[]> {
    return this.productosService.findProductosEstudiante(+estudianteId);
  }
}
