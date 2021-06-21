import * as express from "express";
import { nextTick } from "process";
import { LawFirm } from "../../entity/LawFirm";
import { SubAgentBoardType } from "../../entity/SubAgentBoard";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as SubAgentBoardService from "../../service/subagent_service/subagent-board-service";

const router = express.Router();

/**
 * @apiDescription 게시글 쓰기 API
 * @api {post} /subagent/v1/boards/:boardType
 * @apiVersion 0.0.1
 * @apiName createBoard
 * @apiGroup subagent/board
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String=["ALL","ALL_QA","LAWYER","LAWYER_QA"]} boardType 게시글 타입.
 * @apiParam {String} title 게시글 제목
 * @apiParam {String} content 게시글 내용
 * @apiParam {Array} images 이미지 목록. ex) ["test.png","test2.png"]
 * @apiParam {Boolean} isAnonymous 익명여부.
 * 
 * 
 * @apiSuccess {Object} subAgentBoard 게시글 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.post("/:boardType", async (req, res) => {
  const user: User = req.session.user;
  const boardType = SubAgentBoardType[req.params.boardType];
  const title = req.body.title;
  const content = req.body.content;
  const images = req.body.images;
  const isAnonymous = req.body.isAnonymous;

  return await SubAgentBoardService.create(user,
    boardType,
    title,
    content,
    images,
    isAnonymous)
    .then((sucRs: any) => {
      return res.json({
        subAgentBoard: sucRs.subAgentBoard,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 게시글 업데이트 API
 * @api {put} /subagent/v1/boards/:boardIdx
 * @apiVersion 0.0.1
 * @apiName updateBoard
 * @apiGroup subagent/board
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} boardIdx 게시글 인덱스
 * @apiParam {String} title 게시글 제목
 * @apiParam {String} content 게시글 내용
 * @apiParam {Array} images 이미지 목록. ex) ["test.png","test2.png"]
 * 
 * @apiSuccess {Object} subAgentBoard 게시글 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.put("/:boardIdx", async (req, res) => {
  const user: User = req.session.user;
  const boardIdx = parseInt(req.params.boardIdx);
  const title = req.body.title;
  const content = req.body.content;
  const images = req.body.images;

  return await SubAgentBoardService.update(user,
    boardIdx,
    title,
    content,
    images)
    .then((sucRs: any) => {
      return res.json({
        subAgentBoard: sucRs.subAgentBoard,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 게시글 삭제 API
 * @api {delete} /subagent/v1/boards/:boardIdx
 * @apiVersion 0.0.1
 * @apiName deleteBoard
 * @apiGroup subagent/board
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} boardIdx 게시글 인덱스
 * 
 * @apiSuccess {Object} subAgentBoard 게시글 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.delete("/:boardIdx", async (req, res) => {
  const user: User = req.session.user;
  const boardIdx = parseInt(req.params.boardIdx);

  return await SubAgentBoardService.remove(user,
    boardIdx,)
    .then((sucRs: any) => {
      return res.json({
        subAgentBoard: sucRs.subAgentBoard,
      });
    })
    .catch((err: any) => {
      console.log("err ? ", err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 게시글 목록 조회 API
 * @api {get} /subagent/v1/boards/:boardType
 * @apiVersion 0.0.1
 * @apiName updateBoard
 * @apiGroup subagent/board
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String=["ALL","ALL_QA","LAWYER","LAWYER_QA"]} boardType 게시글 타입.
 * @apiParam {Number} offsetBoardIdx (query)이후 불러오기시, 게시글 offset
 * 
 * @apiSuccess {Object} subAgentBoard 게시글 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.get("/:boardType", async (req, res) => {
  const user: User = req.session.user;
  const boardType = SubAgentBoardType[req.params.boardType];
  const offsetBoardIdx = req.query.offsetBoardIdx;
  

  console.log("??",offsetBoardIdx);
  return await SubAgentBoardService.getAll(user,
    boardType,
    offsetBoardIdx)
    .then((sucRs: any) => {
      return res.json({
        subAgentBoards: sucRs.subAgentBoards,
      });
    })

    .catch((err: any) => {
      console.log("??? ", err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
