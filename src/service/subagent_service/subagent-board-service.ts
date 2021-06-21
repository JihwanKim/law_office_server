import { getRepository, LessThan } from "typeorm";
import { SubAgentBoard, SubAgentBoardType } from "../../entity/SubAgentBoard";
import { User, UserType } from "../../entity/User";

export async function create(
  user: User,
  boardType: SubAgentBoardType,
  title: string,
  content: string,
  images: Array<string>,
  isAnonymous: boolean
) {
  if (
    user.type === UserType.EMPLOYEE &&
    (boardType == SubAgentBoardType.LAWYER ||
      boardType === SubAgentBoardType.LAWYER_QA)
  ) {
    throw { error: "has_not_permission" };
  }

  const repo = await getRepository(SubAgentBoard);

  const board = new SubAgentBoard();
  board.title = title;
  board.boardType = boardType;
  board.content = content;
  board.images = JSON.stringify(images);
  board.isAnonymous = isAnonymous;
  board.writeUser = user;
  await repo.save(board);

  return { subAgentBoard: dataChangehideAnonymousAndCheckIsMyBoard(user, board) };
}

export async function update(
  user: User,
  boardIdx: number,
  title: string,
  content: string,
  images: Array<string>
) {
  const repo = await getRepository(SubAgentBoard);
  const board = await repo.findOne({
    where: {
      idx: boardIdx,
      writeUser: user,
    },
  });
  if (!board) {
    throw { error: "cannot_remove_board" };
  }

  board.title = title;
  board.content = content;
  board.images = JSON.stringify(images);
  await repo.save(board);

  return { subAgentBoard: dataChangehideAnonymousAndCheckIsMyBoard(user,board) };
}

export async function remove(user: User, boardIdx: number) {
  const repo = await getRepository(SubAgentBoard);
  const board = await repo.findOne({
    where: {
      idx: boardIdx,
      writeUser: user,
    },
  });
  if (!board) {
    throw { error: "cannot_remove_board" };
  }
  await repo.remove(board);
  return { subAgentBoard: dataChangehideAnonymousAndCheckIsMyBoard(user,board)  };
}

export async function getAll(
  user: User,
  boardType: SubAgentBoardType,
  offsetBoardIdx?: any
) {
  if (
    user.type === UserType.EMPLOYEE &&
    (boardType == SubAgentBoardType.LAWYER ||
      boardType === SubAgentBoardType.LAWYER_QA)
  ) {
    throw { error: "has_not_permission" };
  }

  const repo = await getRepository(SubAgentBoard);

  if (offsetBoardIdx) {
    const boardItems = await repo.find({
      relations: ["writeUser"],
      where: {
        idx: LessThan(parseInt(offsetBoardIdx)),
        boardType: boardType,
      },
      take: 30,
      order: { idx: "DESC" },
    });
    return {
      subAgentBoards: dataChangeListhideAnonymousAndCheckIsMyBoard(
        user,
        boardItems
      ),
    };
  } else {
    return {
      subAgentBoards: dataChangeListhideAnonymousAndCheckIsMyBoard(
        user,
        await repo.find({
          relations: ["writeUser"],
          where: {
            boardType: boardType,
          },
          take: 30,
          order: { idx: "DESC" },
        })
      ),
    };
  }
}

/// internal function

function dataChangeListhideAnonymousAndCheckIsMyBoard(
  user: User,
  boardItems: Array<SubAgentBoard>
) {
  return boardItems.map((board) => {
    return dataChangehideAnonymousAndCheckIsMyBoard(user, board);
  });
}

function dataChangehideAnonymousAndCheckIsMyBoard(
  user: User,
  board: SubAgentBoard
) {
  board.images = JSON.parse(board.images);

  if (board.writeUser && board.writeUser.idx == user.idx) {
    board.isMyBoard = true;
  }
  if (board.isAnonymous) {
    board.writeUser = null;
  }
  return board;
}
