import * as express from "express";
import { nextTick } from "process";
import { LawFirm } from "../../entity/LawFirm";
import { SubAgentBoardType } from "../../entity/SubAgentBoard";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as SubAgentBoardReplyService from "../../service/subagent_service/subagent-board-reply-service";

const router = express.Router();

/**
 * @apiDescription 댓글 쓰기 API
 * @api {post} /subagent/v1/boards/:boardIdx/replies
 * @apiVersion 0.0.1
 * @apiName createReply
 * @apiGroup subagent/reply
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} boardIdx 대상이 되는 게시글 인덱스
 * @apiParam {String} content 댓글 내용
 * @apiParam {Boolean} isAnonymous 익명여부.
 * 
 * @apiSuccess {Object} reply 댓글 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.post("/:boardIdx/replies", async (req, res) => {
  const user: User = req.session.user;
  const boardIdx = parseInt(req.params.boardIdx);
  const content = req.body.content;
  const isAnonymous = req.body.isAnonymous;

  return await SubAgentBoardReplyService.create(user,
    boardIdx,
    content,
    isAnonymous)
    .then((sucRs: any) => {
      return res.json({
        reply: sucRs.reply,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 댓글 업데이트 API
 * @api {put} /subagent/v1/boards/:boardIdx/replies/:replyIdx
 * @apiVersion 0.0.1
 * @apiName updateReply
 * @apiGroup subagent/reply
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} boardIdx 게시글 인덱스
 * @apiParam {Number} replyIdx 댓글 인덱스
 * @apiParam {String} content 댓글 내용
 * 
 * @apiSuccess {Object} reply 댓글 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.put("/:boardIdx/replies/:replyIdx", async (req, res) => {
  const user: User = req.session.user;
  const boardIdx = parseInt(req.params.boardIdx);
  const replyIdx = parseInt(req.params.replyIdx);
  const content = req.body.content;

  return await SubAgentBoardReplyService.update(user,
    replyIdx,
    content)
    .then((sucRs: any) => {
      return res.json({
        reply: sucRs.reply,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 댓글 삭제 API
 * @api {delete} /subagent/v1/boards/:boardIdx/replies/:replyIdx
 * @apiVersion 0.0.1
 * @apiName deleteReply
 * @apiGroup subagent/reply
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} boardIdx 게시글 인덱스
 * @apiParam {Number} replyIdx 댓글 인덱스
 * 
 * @apiSuccess {Object} reply 댓글 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.delete("/:boardIdx/replies/:replyIdx", async (req, res) => {
  const user: User = req.session.user;
  const replyIdx = parseInt(req.params.replyIdx);

  return await SubAgentBoardReplyService.remove(user,
    replyIdx,)
    .then((sucRs: any) => {
      return res.json({
        reply: sucRs.reply,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 댓글 목록 조회 API
 * @api {get} /subagent/v1/boards/:boardIdx/replies
 * @apiVersion 0.0.1
 * @apiName getReplies
 * @apiGroup subagent/reply
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} boardIdx 게시글 인덱스.
 * @apiParam {Number} offsetReplyIdx (query)이후 불러오기시, 댓글 offset
 * 
 * @apiSuccess {Object} replies 댓글 목록
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.get("/:boardIdx/replies", async (req, res) => {
  const user: User = req.session.user;
  const boardIdx = parseInt(req.params.boardIdx);
  const offsetReplyIdx:any = req.query.offsetReplyIdx;

  return await SubAgentBoardReplyService.getAll(user,
    boardIdx,
    offsetReplyIdx)
    .then((sucRs: any) => {
      return res.json({
      replies: sucRs.replies,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
