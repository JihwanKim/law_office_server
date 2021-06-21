import { getRepository, In, LessThan } from "typeorm";
import { SubAgentUserNotification } from "../../entity/SubAgentUserNotification";
import { SubAgent } from "../../entity/SubAgent";
import { User } from "../../entity/User";
import { SubAgentRequestUser } from "../../entity/SubAgentRequestUser";

export enum SubAgentShowType {
  DEFAULT = "DEFAULT",
  REQUESTING = "REQUESTING",
  REQUEST = "REQUEST",
  ACCEPT = "ACCEPT",
}

export async function create(
  user: User,
  title: string, // 제목
  content: string, // 제목
  court: string, // 법원
  pay: number, // 금액
  trialStartTime: String, // 재판시작시간
  phoneNumber: String // phonenmber
) {
  const subAgent = new SubAgent();
  subAgent.requestingUser = user;
  subAgent.title = title;
  subAgent.content = content;
  subAgent.court = court;
  subAgent.pay = pay;
  subAgent.trialStartTime = trialStartTime;
  if (phoneNumber && phoneNumber !== "") {
    subAgent.phoneNumber = phoneNumber;
  }

  await getRepository(SubAgent).save(subAgent);
  return { subAgent: subAgent };
}

export async function update(
  user: User,
  subAgentIdx: number,
  title: string, // 제목
  content: string, // 제목
  court: string, // 법원
  pay: number, // 금액
  trialStartTime: String, // 재판시작시간
  phoneNumber: String
) {
  const subAgentRepo = getRepository(SubAgent);
  const subAgent = await subAgentRepo.findOne({
    where: {
      idx: subAgentIdx,
      requestingUser: user,
    },
  });
  if (!subAgent) {
    throw { error: "has_not_permission" };
  }
  subAgent.title = title;
  subAgent.content = content;
  subAgent.court = court;
  subAgent.pay = pay;
  subAgent.trialStartTime = trialStartTime;
  if (phoneNumber && phoneNumber !== "") {
    subAgent.phoneNumber = phoneNumber;
  }

  await subAgentRepo.save(subAgent);
  return { subAgent: subAgent };
}

export async function remove(user: User, subAgentIdx: number) {
  const subAgentRepo = getRepository(SubAgent);
  const subAgent = await subAgentRepo.findOne({
    relations: ["requestingUser"],
    where: {
      idx: subAgentIdx,
    },
  });
  if (!subAgent) {
    throw { error: "not_exist_subagent" };
  }

  if (subAgent.requestingUser.idx != user.idx) {
    throw { error: "has_not_permission" };
  }

  // TODO : 나중에 디테일하게 디버깅해서, 왜 .remove 할 때 TypeError: Cannot read property 'tableName' of undefined 뜨는지 체크하기!
  // await subAgentRepo.remove(subAgent);
  await subAgentRepo.delete(subAgent.idx);

  return { subAgent: subAgent };
}

export async function getAll(
  user: User,
  subAgentIdx?: string,
  type?: SubAgentShowType,
  offsetSubAgentIdx?: string,
  courts?: string
) {
  const repo = await getRepository(SubAgent);
  // 특정데이터만 조회
  if (subAgentIdx) {
    {
      const targetSubAgent = await repo.findOne({
        relations: ["requestingUser", "acceptUser", "requests"],
        where: { idx: parseInt(subAgentIdx) },
      });
      if (targetSubAgent.requestingUser.idx == user.idx) {
        return { subAgents: [targetSubAgent] };
      }

      if (targetSubAgent.acceptUser.idx == user.idx) {
        return { subAgents: [targetSubAgent] };
      }

      const requestUsersFilterWithoutMe = targetSubAgent.requests.filter(
        (element: SubAgentRequestUser) => element.user.idx == user.idx
      );
      targetSubAgent.requests = requestUsersFilterWithoutMe;
      return { subAgents: [targetSubAgent] };
    }
  }

  const defaultWhere = {};
  if (courts) {
    const courtList = courts.split(",");
    defaultWhere["court"] = In(courtList);
  }

  switch (type) {
    case SubAgentShowType.ACCEPT:
      defaultWhere["acceptUser"] = user;
      if (offsetSubAgentIdx) {
        defaultWhere["idx"] = LessThan(parseInt(offsetSubAgentIdx));
        return {
          subAgents: await repo.find({
            relations: ["requestingUser"],
            where: defaultWhere,
            take: 30,
            order: { idx: "DESC" },
          }),
        };
      } else {
        return {
          relations: ["requestingUser"],
          where: defaultWhere,
          subAgents: await repo.find({
            take: 30,
          }),
          order: { idx: "DESC" },
        };
      }

    case SubAgentShowType.REQUESTING:
      defaultWhere["requestingUser"] = user;
      if (offsetSubAgentIdx) {
        defaultWhere["idx"] = LessThan(parseInt(offsetSubAgentIdx));
        return {
          subAgents: await repo.find({
            relations: ["acceptUser", "requestUsers", "requestingUser"],
            where: defaultWhere,
            take: 30,
            order: { idx: "DESC" },
          }),
        };
      } else {
        return {
          subAgents: await repo.find({
            relations: ["acceptUser", "requestUsers", "requestingUser"],
            where: defaultWhere,
            take: 30,
            order: { idx: "DESC" },
          }),
        };
      }
    case SubAgentShowType.REQUEST:
      // defaultWhere['acceptUser'] = IsNull
      if (offsetSubAgentIdx) {
        defaultWhere["idx"] = LessThan(parseInt(offsetSubAgentIdx));
        return {
          subAgents: await repo
            .createQueryBuilder("subAgent")
            .innerJoinAndSelect("subAgent.requestingUser", "requestingUser")
            .leftJoinAndSelect(
              "subAgent.acceptUser",
              "acceptUser",
              "acceptUser.idx = :idx",
              { idx: user.idx }
            )
            .leftJoinAndSelect(
              "subAgent.requestUsers",
              "requestUser",
              "requestUser.idx = :idx",
              { idx: user.idx }
            )
            .where(defaultWhere)
            .andWhere(
              "acceptUser.idx IS NOT NULL OR requestUser.idx IS NOT NULL"
            )
            .take(30)
            .orderBy({ "subAgent.idx": "DESC" })
            .getMany(),
        };
      } else {
        return {
          subAgents: await repo
            .createQueryBuilder("subAgent")
            .innerJoinAndSelect("subAgent.requestingUser", "requestingUser")
            .leftJoinAndSelect(
              "subAgent.acceptUser",
              "acceptUser",
              "acceptUser.idx = :idx",
              { idx: user.idx }
            )
            .leftJoinAndSelect(
              "subAgent.requestUsers",
              "requestUser",
              "requestUser.idx = :idx",
              { idx: user.idx }
            )
            .andWhere(
              "acceptUser.idx IS NOT NULL OR requestUser.idx IS NOT NULL"
            )
            .getMany(),
        };
      }

    case SubAgentShowType.DEFAULT:
    default:
      if (offsetSubAgentIdx) {
        defaultWhere["idx"] = LessThan(parseInt(offsetSubAgentIdx));
      }
      return {
        subAgents: await repo
          .createQueryBuilder("subAgent")
          .innerJoinAndSelect("subAgent.requestingUser", "requestingUser")
          .leftJoinAndSelect(
            "subAgent.acceptUser",
            "acceptUser",
            "acceptUser.idx = :idx",
            { idx: user.idx }
          )
          .leftJoinAndSelect(
            "subAgent.requestUsers",
            "requestUser",
            "requestUser.idx = :idx",
            { idx: user.idx }
          )
          .where(defaultWhere)
          .take(30)
          .orderBy({ "subAgent.idx": "DESC" })
          .getMany(),
      };
  }
}

export async function getAllHistories(user: User, historyIdx?: string) {
  const repo = getRepository(SubAgentUserNotification);
  if (historyIdx) {
    return {
      subAgentHistories: await repo.find({
        where: {
          user: user,
          idx: LessThan(parseInt(historyIdx)),
        },
        take: 30,
        order: { idx: "DESC" },
      }),
    };
  } else {
    return {
      subAgentHistories: await repo.find({
        where: {
          user: user,
        },
        take: 30,
        order: { idx: "DESC" },
      }),
    };
  }
}
