import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ProjectEntity } from '@project/entity/project.entity';
import { UserEntity } from '@user/entity/user.entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({type:'uuid'}) projectId:string;
  @Column({type:'uuid'}) ownerId:string;
  @Column({ type: 'varchar', nullable: false }) description: string;
  @Column({ default: false }) finished?: boolean;
  @Column({ nullable: true }) plannedFinishDate?: Date;
  @Column({ nullable: true }) finishedDate?: Date;
  @CreateDateColumn() createdOn: Date;
  @UpdateDateColumn() updatedOn?: Date;

  @ManyToOne((type) => ProjectEntity)
  @JoinColumn({ name: "projectId" })
  project?: ProjectEntity;

  @ManyToOne((type) => UserEntity)
  @JoinColumn({ name: "ownerId" })
  owner?: UserEntity;
}
