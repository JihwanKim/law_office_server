import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { LawFirm } from "./LawFirm";
import { User } from "./User";
import { Permission } from "./Permission";
import { Customer } from "./Customer";
import { Group } from "./Group";

export enum LawCaseStataus {
  WAITING = "WAITING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  DELETED = "DELETED",
}

@Entity()
export class LawCase {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: LawCaseStataus.WAITING })
  lawStatus: LawCaseStataus;

  @ManyToOne((type) => LawFirm, (lawFirm) => lawFirm.lawCases, {
    onDelete: "CASCADE",
  })
  lawFirm: LawFirm;

  @ManyToMany((type) => User, (user) => user.lawCases)
  users: User[];

  @ManyToMany((type) => Customer, (customer) => customer.lawCases)
  customers: Customer[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
