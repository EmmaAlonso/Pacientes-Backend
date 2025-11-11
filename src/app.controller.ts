import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint principal' })
  @ApiResponse({ status: 200, description: 'Mensaje de bienvenida.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
