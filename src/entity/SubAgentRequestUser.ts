import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
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
import { SubAgent } from "./SubAgent";
import { SubAgentUserNotification } from "./SubAgentUserNotification";
import { User } from "./User";
export enum RequestStatus{
  WAITING = "WAITING", 
  DENY = "DENY", 
  ACCEPT = "ACCEPT"
}
export enum RequestType{
  REQUEST_TO_USER = "REQUEST_TO_USER", 
  REQUEST_TO_SUBAGENT = "REQUEST_TO_SUBAGENT"
}
@Entity()
export class SubAgentRequestUser {
  @PrimaryGeneratedColumn()
  idx: number;
  
  @Column({default:RequestStatus.WAITING})
  status:RequestStatus;

  @Column({default:RequestType.REQUEST_TO_SUBAGENT})
  requestType:RequestType;

  @ManyToOne((type)=> User, (user)=> user.requests)
  @JoinColumn()
  user:User;
  
  @ManyToOne((type)=>SubAgent, (subAgent)=>subAgent.requests)
  @JoinColumn()
  subAgent:SubAgent;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}

// user 1:N subagent 1:N reqeustUser