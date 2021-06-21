import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { LawFirm } from "./LawFirm";
import { User } from "./User";
import { Permission } from "./Permission";
import { LawCase } from "./LawCase";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne((type) => LawFirm, (LawFirm) => LawFirm.groups, {onDelete: 'CASCADE'})
  lawFirm: LawFirm;

  @ManyToMany((type) => User, (User) => User.groups)
  @JoinTable()
  users: User[];
  
  @OneToOne((type) => Permission, {onDelete: 'CASCADE'})
  @JoinColumn()
  permission: Permission;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
