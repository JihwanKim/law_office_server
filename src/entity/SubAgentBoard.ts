import { type } from "os";
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SubAgentBoardReply } from "./SubAgentBoardReply";
import { User } from "./User";

export enum SubAgentBoardType{
  ALL = "ALL",
  ALL_QA = "ALL Q&A",
  LAWYER = "LAWYER",
  LAWYER_QA = "LAWYER Q&A",
}

@Entity()
export class SubAgentBoard {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({default:SubAgentBoardType.ALL})
  boardType:SubAgentBoardType;

  @Column()
  title:string;

  @Column({nullable:true})
  content:string;

  @Column({default:"[]"})
  images:string;

  @OneToMany((type)=>SubAgentBoardReply, (reply)=>reply.board)
  replies:SubAgentBoardReply[];

  @ManyToOne((type)=>User, (user)=>user.subAgentBoards,{nullable:false, onDelete: 'CASCADE'})
  @JoinColumn()
  @Index()
  writeUser:User;

  @Column({default:true})
  isAnonymous:boolean;

  isMyBoard:boolean = false;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

}
