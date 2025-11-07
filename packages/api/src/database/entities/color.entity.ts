import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('universe_colors')
export class Color {
  @PrimaryColumn()
  colorCode: string;

  @Column({ type: 'text' })
  colorName: string;

  @Column({
    type: 'enum',
    enum: ['SS', 'AW'],
    nullable: true,
  })
  season?: 'SS' | 'AW';

  @Column({ type: 'varchar', length: 7, nullable: true })
  hexValue?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

