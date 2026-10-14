import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('machines')
export class Machine {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column('simple-array')
  weldType: string[];

  @Column({ default: '220 V' })
  voltage: string;

  @Column({ default: '10 - 250 A' })
  amperage: string;

  @Column({ default: '40% @ 250 A' })
  dutyCycle: string;

  @Column({ default: 'Taller Principal' })
  location: string;

  @Column({ default: 'operativa' })
  status: string; // 'operativa' | 'mantenimiento' | 'en_revision'

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
