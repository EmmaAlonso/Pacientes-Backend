import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { VarianteProducto } from '../entities/variante-producto.entity';
import { ProductoEstudiante } from '../entities/producto-estudiante.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(VarianteProducto)
    private readonly varianteRepository: Repository<VarianteProducto>,
    @InjectRepository(ProductoEstudiante)
    private readonly productoEstudianteRepository: Repository<ProductoEstudiante>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async findVariantes(productoId: number): Promise<VarianteProducto[]> {
    return this.varianteRepository.find({
      where: { producto: { id: productoId } },
    });
  }

  async findProductosEstudiante(
    estudianteId: number,
  ): Promise<ProductoEstudiante[]> {
    return this.productoEstudianteRepository.find({
      where: { student: { id: estudianteId } },
    });
  }
}
