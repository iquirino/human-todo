import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@user/entity/user.entity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({type:'uuid'}) ownerId:string;
  @Column({ type: 'varchar', nullable: false }) key: string;
  @Column({ type: 'varchar', nullable: false }) name: string;
  @CreateDateColumn() createdOn: Date;
  @UpdateDateColumn() updatedOn?: Date;

  @ManyToOne(type => UserEntity)
  @JoinColumn({ name: "ownerId" })
  owner?: UserEntity;
}
