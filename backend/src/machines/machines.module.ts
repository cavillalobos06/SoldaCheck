import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './entities/machine.entity.js';
import { Inspection } from './entities/inspection.entity.js';
import { MachinesService } from './machines.service.js';
import { MachinesController } from './machines.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, Inspection])],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService],
})
export class MachinesModule {}
