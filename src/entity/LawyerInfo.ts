import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class LawyerInfo {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ length: 128 })
  serialNumber: string;

  @Column({ unique: true, length: 128 })
  issueNumber: string;

  @Column()
  isVarification: boolean;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
