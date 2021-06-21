import { getRepository } from "typeorm";
import { SubAgent } from "../../entity/SubAgent";
import { RequestStatus, RequestType, SubAgentRequestUser } from "../../entity/SubAgentRequestUser";
import { SubAgentUserNotification } from "../../entity/SubAgentUserNotification";
import { User } from "../../entity/User";

export async function requestToSubAgent(user: User, subAgentIdx: number) {
  const subAgentRepo = getRepository(SubAgent);

  const subAgent = await subAgentRepo.findOne({
    relations: ["requestUsers", "acceptUser", "requestingUser"],
    where: {
      idx: subAgentIdx,
    },
  });

  if (!subAgent) {
    throw { error: "not_exist_subagent" };
  }

  if (subAgent.acceptUser) {
    throw { error: "already_accept_subagent" };
  }

  if (subAgent.requestingUser.idx === user.idx) {
    throw { error: "cannot_request_my_subagent" };
  }

  user = await getRepository(User).findOne({
    where: {
      idx: user.idx,
    },
  });

  const isAlreadyRequest =
    subAgent.requests.filter((element) => {
      return element.user.idx === user.idx;
    }).length > 0;

  if (isAlreadyRequest) {
    throw { error: "already_request_subagent" };
  }

  const subAgentRequestUser = new SubAgentRequestUser();

  subAgentRequestUser.user = user;
  subAgentRequestUser.subAgent = subAgent;

  subAgent.requests.push(subAgentRequestUser);

  await subAgentRepo.save(subAgent);
  // TODO : notify to requesting user

  subAgent.requests = [];

  return { subAgent: subAgent };
}

export async function acceptRequest(
  user: User,
  subAgentIdx: number,
  targetUserIdx: number
) {
  const subAgentRepo = getRepository(SubAgent);

  const subAgent = await subAgentRepo.findOne({
    relations: ["requests", "requests.user", "acceptUser", "requestingUser"],
    where: {
      idx: subAgentIdx,
    },
  });

  if (!subAgent) {
    throw { error: "not_exist_subagent" };
  }

  if (subAgent.requestingUser.idx !== user.idx) {
    throw { error: "has_not_permission" };
  }

  if (subAgent.acceptUser != null) {
    throw { error: "already_accept_subagent" };
  }

  const targetUser = await getRepository(User).findOne({
    where: { idx: targetUserIdx },
  });

  if (!targetUser) {
    throw { error: "not_exist_target_user" };
  }

  subAgent.acceptUser = targetUser;

  await subAgentRepo.save(subAgent);

  return { subAgent: subAgent };
}

export async function denySubAgentRequest(
  user: User,
  subAgentIdx: number,
  targetUserIdx: number
) {
  const subAgentRepo = getRepository(SubAgent);

  const subAgent = await subAgentRepo.findOne({
    where: {
      idx: subAgentIdx,
    },
  });

  if (!subAgent) {
    throw { error: "not_exist_subagent" };
  }

  if (subAgent.requestingUser.idx !== user.idx) {
    throw { error: "has_not_permission" };
  }

  const targetUser = await getRepository(User).findOne({
    where: { idx: targetUserIdx },
  });

  if (!targetUser) {
    throw { error: "not_exist_target_user" };
  }

  const subAgentRequest = await getRepository(SubAgentRequestUser).findOne({
    where: {
      user: targetUser,
      subAgent: subAgent,
      requestType:RequestType.REQUEST_TO_SUBAGENT
    },
  });

  if(!subAgentRequest){
    throw {error: "not_exist_request"};
  }
  subAgentRequest.status = RequestStatus.DENY;

  await getRepository(SubAgentRequestUser).save(subAgentRequest);

  // notify to deny user
  const notification = new SubAgentUserNotification();
  notification.user = user;
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

  return { subAgent: subAgent };
}

export async function cancelRequest(user: User, subAgentIdx: number) {
  const subAgentRepo = getRepository(SubAgent);

  const subAgent = await subAgentRepo.findOne({
    relations: ["requests"],
    where: {
      idx: subAgentIdx,
    },
  });

  const requestUserLength = subAgent.requests.length;
  subAgent.requests = subAgent.requests.filter(
    (element: SubAgentRequestUser) => {
      return element.user.idx !== user.idx;
    }
  );

  if (requestUserLength === subAgent.requests.length) {
    throw { error: "not_requeset_subagent" };
  }

  await subAgentRepo.save(subAgent);
  // TODO : notify to requesting user

  subAgent.requests = [];

  return { subAgent: subAgent };
}
