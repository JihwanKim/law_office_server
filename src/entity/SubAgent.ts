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
import { SubAgentRequestUser } from "./SubAgentRequestUser";
import { SubAgentUserNotification } from "./SubAgentUserNotification";
import { User } from "./User";

@Entity()
export class SubAgent {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  title: string;
  @Column()
  content: string;
  
  @Column()
  @Index()
  court: string;

  @Column()
  pay: number;

  @ManyToOne((type) => User,  (user)=> user.requestingSubAgents, {nullable:false})
  @JoinColumn()
  requestingUser: User;

  @ManyToOne((type) => User, (user)=>user.acceptSubAgents, { nullable: true })
  @JoinColumn()
  acceptUser: User;

  @Column({default :false})
  isAccept:boolean;

  @OneToMany((type) => SubAgentRequestUser, (ubAgentRequestUser) => ubAgentRequestUser.subAgent)
  requests: SubAgentRequestUser[];

  @Column()
  trialStartTime: String;

  @Column({nullable:true})
  phoneNumber: String;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @BeforeUpdate()
  onAccept() {
    if (this.acceptUser && this.requests.length > 0) {
      this.requests.forEach(async (request: SubAgentRequestUser) => {
        if (request.user.idx == this.acceptUser.idx) {
          const notification = new SubAgentUserNotification();
          notification.user = request.user;
          notification.notification = JSON.stringify({
            type: "subagent",
            log_type: "accept",
            subagent: {
              idx: this.idx,
              title: this.title,
              content: this.content,
              court: this.court,
              pay: this.pay,
              trialStartTime: this.trialStartTime,
            },
          });
          await getRepository(SubAgentUserNotification).save(notification);
        } else {
          const notification = new SubAgentUserNotification();
          notification.user = request.user;
          notification.notification = JSON.stringify({
            type: "subagent",
            log_type: "deny",
            subagent: {
              idx: this.idx,
              title: this.title,
              content: this.content,
              court: this.court,
              pay: this.pay,
              trialStartTime: this.trialStartTime,
            },
          });
          await getRepository(SubAgentUserNotification).save(notification);
        }
      });
      this.isAccept = true;
    }
  }
}
