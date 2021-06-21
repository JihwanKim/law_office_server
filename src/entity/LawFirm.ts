import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "./Group";
import { Customer } from "./Customer";
import { LawFirmJoinRequest } from "./LawFirmJoinRequest";
import { User } from "./User";
import * as Utils from "../utils/utils";
import { LawCase } from "./LawCase";

// onDelete: 'CASCADE'

export enum LawFirmStatus {
  DEFAULT = "DEFAULT",
  DELETED = "DELETED",
}

@Entity()
export class LawFirm {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ default: LawFirmStatus.DEFAULT, length: 10 })
  status: LawFirmStatus;

  @Column()
  name: string;

  @Column({length:20, unique:true})
  joinCode: string;

  @Column()
  telephone: string;

  @Column()
  address: string;

  @OneToMany((type) => Group, (group) => group.lawFirm)
  @JoinColumn()
  groups: Group[];

  @OneToMany((type) => Customer, (customer) => customer.lawFirm)
  @JoinColumn()
  customers: Customer[];

  @OneToOne((type) => User)
  @JoinColumn()
  ownerUser: User;

  @OneToMany((type) => User, (users)=> users.lawFirm)
  users: User[];

  @OneToMany(
    (type) => LawFirmJoinRequest,
    (joinRequests) => joinRequests.lawFirm
  )
  joinRequests: LawFirmJoinRequest[];

  @OneToMany(
    (type) => LawCase,
    (lawCase) => lawCase.lawFirm
  )
  lawCases: LawCase[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
  
  @BeforeInsert()
  @BeforeUpdate()
  joinCodeUpdate() {
    if(!this.joinCode){
      this.joinCode = Utils.randomString(10);
    }
  }
}
