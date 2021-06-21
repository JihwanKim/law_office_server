import { getRepository, LessThan } from "typeorm";
import { SubAgentBoard, SubAgentBoardType } from "../../entity/SubAgentBoard";
import { SubAgentBoardReply } from "../../entity/SubAgentBoardReply";
import { User, UserType } from "../../entity/User";

export async function create(
  user: User,
  boardIdx: number,
  content: string,
  isAnonymous: boolean
) {
  const board = await getRepository(SubAgentBoard).findOne({
    where: { idx: boardIdx },
  });
  if (!board) {
    throw { error: "not_exist_board" };
  }
  if (
    user.type === UserType.EMPLOYEE &&
    (board.boardType == SubAgentBoardType.LAWYER ||
      board.boardType === SubAgentBoardType.LAWYER_QA)
  ) {
    throw { error: "has_not_permission" };
  }

  const replyRepo = await getRepository(SubAgentBoardReply);
  const reply = new SubAgentBoardReply();
  reply.content = content;
  reply.board = board;
  reply.writeUser = user;
  reply.isAnonymous = isAnonymous;
  await replyRepo.save(reply);

  return { reply: dateChagehideAnonymousAndCheckIsMyBoard(user, reply) };
}

export async function update(user: User, replyIdx: number, content: string) {
  const repo = getRepository(SubAgentBoardReply);
  const reply = await repo.findOne({
    relations: ["writeUser"],
    where: { idx: replyIdx },
  });

  if (!reply) {
    throw { error: "not_exist_reply" };
  }

  if (reply.writeUser.idx != user.idx) {
    throw { error: "cannot_update_reply" };
  }

  reply.content = content;
  await repo.save(reply);

  return { reply: dateChagehideAnonymousAndCheckIsMyBoard(user, reply) };
}

export async function remove(user: User, replyIdx: number) {
  const repo = getRepository(SubAgentBoardReply);
  const reply = await repo.findOne({
    relations: ["writeUser"],
    where: { idx: replyIdx },
  });

  if (!reply) {
    throw { error: "not_exist_reply" };
  }

  if (reply.writeUser.idx != user.idx) {
    throw { error: "cannot_update_reply" };
  }
  await repo.remove(reply);

  return { reply: dateChagehideAnonymousAndCheckIsMyBoard(user, reply) };
}

export async function getAll(
  user: User,
  boardIdx: number,
  offsetReplyIdx?: string
) {
  const board = await getRepository(SubAgentBoard).findOne({
    where: { idx: boardIdx },
  });
  if (!board) {
    throw { error: "not_exist_board" };
  }
  if (
    user.type === UserType.EMPLOYEE &&
    (board.boardType == SubAgentBoardType.LAWYER ||
      board.boardType === SubAgentBoardType.LAWYER_QA)
  ) {
    throw { error: "has_not_permission" };
  }

  const repo = await getRepository(SubAgentBoardReply);

  if (offsetReplyIdx) {
    return {
      replies: dateChageListhideAnonymousAndCheckIsMyBoard(
        user,
        await repo.find({
          relations: ["writeUser"],
          where: {
            idx: LessThan(parseInt(offsetReplyIdx)),
            board: board,
          },
          take: 2000,
        })
      ),
    };
  } else {
    return {
      replies: dateChageListhideAnonymousAndCheckIsMyBoard(
        user,
        await repo.find({
          relations: ["writeUser"],
          where: {
            board: board,
          },
          take: 2000,
        })
      ),
    };
  }
}

/// internal function

function dateChageListhideAnonymousAndCheckIsMyBoard(
  user: User,
  boardItems: Array<SubAgentBoardReply>
) {
  return boardItems.map((reply) => {
    return dateChagehideAnonymousAndCheckIsMyBoard(user, reply);
  });
}

function dateChagehideAnonymousAndCheckIsMyBoard(
  user: User,
  reply: SubAgentBoardReply
) {
  if (reply.writeUser.idx == user.idx) {
    reply.isMyReply = true;
  }
  if (reply.isAnonymous) {
    reply.writeUser = null;
  }
  return reply;
}
