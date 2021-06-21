import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LawCase } from "./LawCase";
import { Group } from "./Group";
import { LawyerInfo } from "./LawyerInfo";
import { LawFirm } from "./LawFirm";
import { LawFirmJoinRequest } from "./LawFirmJoinRequest";
import { Permission } from "./Permission";
import { UserAuth } from "./UserAuth";
import { BankAccount } from "./BankAccount";
import { LawyerAffiliation } from "./LawyerAffiliation";
import { SubAgent } from "./SubAgent";
import { SubAgentUserNotification } from "./SubAgentUserNotification";
import { SubAgentBoard } from "./SubAgentBoard";
import { SubAgentBoardReply } from "./SubAgentBoardReply";
import { SubAgentRequestUser } from "./SubAgentRequestUser";

export enum UserType {
  LAWYER = "LAWYER",
  EMPLOYEE = "EMPLOYEE",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ length: 10 })
  type: UserType;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  birthday: string;

  @Column()
  phoneNumber: string;

  @OneToOne((type) => LawyerInfo)
  lawyerInfo: LawyerInfo;

  @OneToOne((type) => Permission)
  @JoinColumn()
  permission: Permission;

  @ManyToMany((type) => Group, (group) => group.users)
  groups: Group[];

  @ManyToMany((type) => LawCase, (lawCase) => lawCase.users)
  @JoinTable()
  lawCases: LawCase[];

  @OneToMany((type) => UserAuth, (auth) => auth.user)
  @JoinColumn()
  auths: UserAuth[];

  @OneToMany((type) => LawFirmJoinRequest, (joinRequests) => joinRequests.user)
  joinRequests: LawFirmJoinRequest[];
  
  //subagent 용!
  @OneToOne((type) => BankAccount, {nullable:true})
  @JoinColumn()
  bankAccount: BankAccount;

  @OneToOne((type) => LawyerAffiliation, {nullable:true})
  @JoinColumn()
  lawyerAffiliation: LawyerAffiliation;

  @ManyToOne((type) => LawFirm, (lawFirm) => lawFirm.users)
  lawFirm: LawFirm;

  @OneToMany((type)=>SubAgent, (subagent)=>subagent.requestingUser)
  requestingSubAgents:SubAgent[];

  @OneToMany((type)=>SubAgent, (subagent)=>subagent.acceptUser)
  acceptSubAgents:SubAgent[];

  @OneToMany((type) => SubAgentBoard, (subAgentBoard) => subAgentBoard.writeUser)
  subAgentBoards: SubAgentBoard[];

  @OneToMany((type) => SubAgentBoardReply, (subAgentBoardReply) => subAgentBoardReply.writeUser)
  subAgentBoardReplies: SubAgentBoardReply[];

  @OneToMany((type) => SubAgentUserNotification, (notification) => notification.user)
  notifications: SubAgentUserNotification[];

  @OneToMany((type) => SubAgentRequestUser, (request) => request.user)
  requests: SubAgentRequestUser[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
