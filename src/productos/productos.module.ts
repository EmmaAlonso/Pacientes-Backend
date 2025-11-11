import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { VarianteProducto } from './entities/variante-producto.entity';
import { ProductoEstudiante } from './entities/producto-estudiante.entity';
import { ProductosService } from './services/productos.service';
import { ProductosController } from './controllers/productos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, VarianteProducto, ProductoEstudiante]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
