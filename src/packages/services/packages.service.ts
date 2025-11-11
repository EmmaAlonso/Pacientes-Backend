import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../entities/package.entity';
import { CreatePackageDto } from '../dto/create-package.dto';
import { UpdatePackageDto } from '../dto/update-package.dto';

interface UpdatePackageData {
  nombre?: string;
  descripcion?: string;
  precioReferencia?: number;
  activo?: boolean;
  usuario?: { id: number };
  universidad?: { id: number };
  student?: { id: number };
}

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packagesRepository: Repository<Package>,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const package_ = this.packagesRepository.create({
      ...createPackageDto,
      usuario: { id: createPackageDto.usuarioId },
      universidad: { id: createPackageDto.universidadId },
      student: { id: createPackageDto.studentId },
    });
    return this.packagesRepository.save(package_);
  }

  async findAll(): Promise<Package[]> {
    return this.packagesRepository.find({
      relations: ['usuario', 'universidad', 'student'],
    });
  }

  async findOne(id: number): Promise<Package> {
    const package_ = await this.packagesRepository.findOne({
      where: { id },
      relations: ['usuario', 'universidad', 'student'],
    });
    if (!package_) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado`);
    }
    return package_;
  }

  async update(
    id: number,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const package_ = await this.findOne(id);

    const updateData: UpdatePackageData = { ...updatePackageDto };
    if (updatePackageDto.usuarioId) {
      updateData.usuario = { id: updatePackageDto.usuarioId };
    }
    if (updatePackageDto.universidadId) {
      updateData.universidad = { id: updatePackageDto.universidadId };
    }
    if (updatePackageDto.studentId) {
      updateData.student = { id: updatePackageDto.studentId };
    }

    Object.assign(package_, updateData);
    return this.packagesRepository.save(package_);
  }

  async remove(id: number): Promise<Package> {
    const package_ = await this.findOne(id);
    return this.packagesRepository.remove(package_);
  }
}
