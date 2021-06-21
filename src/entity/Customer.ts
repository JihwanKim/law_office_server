import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Consulting } from "./Consulting";
import { LawCase } from "./LawCase";
import { LawFirm } from "./LawFirm";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  name: string;

  @Column({nullable:true})
  email: string;

  @Column({nullable:true})
  @Index()
  birthday: string;

  @Column({nullable:true})
  @Index()
  phoneNumber: string;

  @Column({ length: 10, nullable:true })
  sex: string;

  @Column({nullable:true})
  country: string;

  @Column({nullable:true})
  description: string;

  @ManyToMany((type) => LawCase, (lawCase) => lawCase.customers)
  @JoinTable()
  lawCases: LawCase[];
  
  @OneToMany(type=> Consulting, (consulting)=> consulting.customer)
  @JoinColumn()
  consultings: Consulting[];

  @ManyToOne((type) => LawFirm, (lawFirm) => lawFirm.customers, {onDelete: 'CASCADE'})
  lawFirm: LawFirm;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastConsultingDate: Date;
}
