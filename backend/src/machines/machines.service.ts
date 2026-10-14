import {
  Injectable,
  Logger,
  OnModuleInit,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity.js';
import { Inspection } from './entities/inspection.entity.js';
import {
  CreateMachineDto,
  UpdateMachineDto,
  CreateInspectionDto,
} from './dto/create-machine.dto.js';

@Injectable()
export class MachinesService implements OnModuleInit {
  private readonly logger = new Logger(MachinesService.name);

  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    @InjectRepository(Inspection)
    private readonly inspectionRepository: Repository<Inspection>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedMachines();
  }

  async seedMachines(): Promise<void> {
    const count = await this.machineRepository.count();
    if (count > 0) {
      return;
    }

    this.logger.log('Base de datos sin máquinas. Sembrando catálogo inicial de soldadoras...');

    const initialMachines: CreateMachineDto[] = [
      {
        id: 'SLD-MIG-001',
        name: 'Soldadora MIG Principal',
        brand: 'Lincoln Electric',
        model: 'Power MIG 360MP',
        weldType: ['MIG', 'TIG', 'MMA'],
        voltage: '220 / 440 V',
        amperage: '5 – 360 A',
        dutyCycle: '40% @ 300 A',
        location: 'Nave A · Línea 1',
        status: 'operativa',
        notes: 'Equipo principal de la línea 1 en óptimas condiciones.',
      },
      {
        id: 'SLD-TIG-002',
        name: 'Equipo TIG Inox',
        brand: 'Miller',
        model: 'Dynasty 280 DX',
        weldType: ['TIG', 'MMA'],
        voltage: '120 – 480 V',
        amperage: '1 – 280 A',
        dutyCycle: '40% @ 280 A',
        location: 'Nave A · Cabina 3',
        status: 'operativa',
        notes: 'Utilizada para soldadura de acero inoxidable de alta precisión.',
      },
      {
        id: 'SLD-MMA-003',
        name: 'Inversor Electrodo Campo',
        brand: 'ESAB',
        model: 'Rogue ES 200i',
        weldType: ['MMA'],
        voltage: '220 V',
        amperage: '16 – 200 A',
        dutyCycle: '35% @ 200 A',
        location: 'Patio exterior',
        status: 'mantenimiento',
        notes: 'Cable de masa dañado. Pendiente de recambio de aislamiento.',
      },
      {
        id: 'SLD-MIG-004',
        name: 'MIG Pulsada Aluminio',
        brand: 'Fronius',
        model: 'TPS 400i',
        weldType: ['MIG'],
        voltage: '400 V',
        amperage: '3 – 400 A',
        dutyCycle: '50% @ 400 A',
        location: 'Nave B · Línea 2',
        status: 'operativa',
        notes: 'Configurada con rodillos y antorcha para alambre de aluminio.',
      },
      {
        id: 'SLD-TIG-005',
        name: 'TIG AC/DC Taller',
        brand: 'Kemppi',
        model: 'MasterTig 335',
        weldType: ['TIG', 'MMA'],
        voltage: '400 V',
        amperage: '3 – 330 A',
        dutyCycle: '40% @ 330 A',
        location: 'Taller mantenimiento',
        status: 'operativa',
        notes: 'Equipo estacionario de calibración y pruebas.',
      },
      {
        id: 'SLD-MIG-006',
        name: 'Multiproceso Portátil',
        brand: 'Lincoln Electric',
        model: 'Flextec 350X',
        weldType: ['MIG', 'MMA'],
        voltage: '380 – 575 V',
        amperage: '5 – 425 A',
        dutyCycle: '100% @ 350 A',
        location: 'Nave B · Estructuras',
        status: 'en_revision',
        notes: 'Ventilador con ruido intermitente. Requiere inspección eléctrica.',
      },
    ];

    for (const m of initialMachines) {
      const machine = this.machineRepository.create(m);
      await this.machineRepository.save(machine);
    }

    // Seed sample inspections
    const allOk = { cables: true, gas: true, torch: true, vent: true };
    const inspections = [
      {
        machineId: 'SLD-MIG-001',
        technician: 'Carlos Rojas',
        checks: allOk,
        status: 'operativa',
        notes: 'Turno sin novedades, equipo calibrado.',
      },
      {
        machineId: 'SLD-MMA-003',
        technician: 'Jorge Pérez',
        checks: { ...allOk, cables: false },
        status: 'mantenimiento',
        notes: 'Cable de masa con aislamiento roto cerca de la pinza.',
      },
      {
        machineId: 'SLD-MIG-006',
        technician: 'Ana Martínez',
        checks: { ...allOk, vent: false },
        status: 'en_revision',
        notes: 'Ventilador hace ruido en frío.',
      },
    ];

    for (const insp of inspections) {
      const ins = this.inspectionRepository.create(insp);
      await this.inspectionRepository.save(ins);
    }

    this.logger.log('Sembrado de máquinas e inspecciones completado.');
  }

  async findAll(status?: string): Promise<Machine[]> {
    if (status) {
      return this.machineRepository.find({
        where: { status },
        order: { createdAt: 'DESC' },
      });
    }
    return this.machineRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Machine> {
    const machine = await this.machineRepository.findOne({ where: { id } });
    if (!machine) {
      throw new NotFoundException(`Máquina con ID ${id} no encontrada`);
    }
    return machine;
  }

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const existing = await this.machineRepository.findOne({
      where: { id: createMachineDto.id },
    });
    if (existing) {
      throw new ConflictException(
        `Ya existe una máquina registrada con el código ${createMachineDto.id}`,
      );
    }

    const machine = this.machineRepository.create(createMachineDto);
    return this.machineRepository.save(machine);
  }

  async update(id: string, updateMachineDto: UpdateMachineDto): Promise<Machine> {
    const machine = await this.findOne(id);
    Object.assign(machine, updateMachineDto);
    return this.machineRepository.save(machine);
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const machine = await this.findOne(id);
    await this.machineRepository.remove(machine);
    return { success: true, message: `Máquina ${id} eliminada correctamente` };
  }

  async getInspections(machineId: string): Promise<Inspection[]> {
    await this.findOne(machineId); // Ensure machine exists
    return this.inspectionRepository.find({
      where: { machineId },
      order: { date: 'DESC' },
      take: 20,
    });
  }

  async addInspection(
    machineId: string,
    createInspectionDto: CreateInspectionDto,
  ): Promise<Inspection> {
    const machine = await this.findOne(machineId);

    // Update machine status based on inspection
    machine.status = createInspectionDto.status;
    await this.machineRepository.save(machine);

    const inspection = this.inspectionRepository.create({
      ...createInspectionDto,
      machineId,
    });
    return this.inspectionRepository.save(inspection);
  }
}
