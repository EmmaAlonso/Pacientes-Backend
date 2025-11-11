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
import { GenerationsService } from './generations.service';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { UpdateGenerationDto } from './dto/update-generation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('generations')
export class GenerationsController {
  constructor(private readonly generationsService: GenerationsService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createGenerationDto: CreateGenerationDto) {
    return this.generationsService.create(createGenerationDto);
  }

  @Get()
  findAll() {
    return this.generationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generationsService.findOne(+id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGenerationDto: UpdateGenerationDto,
  ) {
    return this.generationsService.update(+id, updateGenerationDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generationsService.remove(+id);
  }
}
