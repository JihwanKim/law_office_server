import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class SubAgentUserNotification {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  notification:string;

  @ManyToOne((type)=>User, (user)=>user.notifications, {onDelete: 'CASCADE'})
  @JoinColumn()
  user:User;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
