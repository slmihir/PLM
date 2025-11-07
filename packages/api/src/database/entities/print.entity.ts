import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('universe_prints')
export class Print {
  @PrimaryGeneratedColumn('uuid')
  printId: string;

  @Column({ type: 'text' })
  artworkFilePath: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({
    type: 'enum',
    enum: ['available', 'unavailable'],
    default: 'available',
  })
  availabilityStatus: 'available' | 'unavailable';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

