import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MachinesService } from './machines.service.js';
import {
  CreateMachineDto,
  UpdateMachineDto,
  CreateInspectionDto,
} from './dto/create-machine.dto.js';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async findAll(@Query('status') status?: string) {
    return this.machinesService.findAll(status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.machinesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    return this.machinesService.update(id, updateMachineDto);
  }

  @Put(':id')
  async updatePut(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    return this.machinesService.update(id, updateMachineDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.machinesService.remove(id);
  }

  @Get(':id/inspections')
  async getInspections(@Param('id') id: string) {
    return this.machinesService.getInspections(id);
  }

  @Post(':id/inspections')
  @HttpCode(HttpStatus.CREATED)
  async addInspection(
    @Param('id') id: string,
    @Body() createInspectionDto: CreateInspectionDto,
  ) {
    return this.machinesService.addInspection(id, createInspectionDto);
  }
}
