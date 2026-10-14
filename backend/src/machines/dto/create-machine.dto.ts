import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty({ message: 'El código / ID de la máquina es requerido' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la máquina es requerido' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La marca es requerida' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'El modelo es requerido' })
  model: string;

  @IsArray({ message: 'El tipo de soldadura debe ser una lista de tipos (ej: MIG, TIG, MMA)' })
  weldType: string[];

  @IsString()
  @IsNotEmpty({ message: 'El voltaje es requerido' })
  voltage: string;

  @IsString()
  @IsNotEmpty({ message: 'El amperaje es requerido' })
  amperage: string;

  @IsString()
  @IsNotEmpty({ message: 'El ciclo de trabajo es requerido' })
  dutyCycle: string;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación es requerida' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'El estado es requerido' })
  status: string; // 'operativa' | 'mantenimiento' | 'en_revision'

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMachineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsArray()
  weldType?: string[];

  @IsOptional()
  @IsString()
  voltage?: string;

  @IsOptional()
  @IsString()
  amperage?: string;

  @IsOptional()
  @IsString()
  dutyCycle?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateInspectionDto {
  @IsString()
  @IsNotEmpty()
  technician: string;

  @IsNotEmpty()
  checks: Record<string, boolean>;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
