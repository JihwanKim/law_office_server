import * as express from "express";
import { nextTick } from "process";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as SubAgentRequestService from "../../service/subagent_service/subagent-request-service";

const router = express.Router();

/**
 * @apiDescription 복대리 수락 요청 API
 * @api {post} /subagent/v1/subagents/:subAgentIdx/requests
 * @apiVersion 0.0.1
 * @apiName subAgentRequest
 * @apiGroup subagent/request
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} subAgentIdx 복대리 인덱스
 * 
 * @apiSuccess {Object} subAgent 복대리 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.post("/:subAgentIdx/requests", async (req, res) => {
  const user: User = req.session.user;
  const subAgentIdx = parseInt(req.params.subAgentIdx);

  return await SubAgentRequestService.requestToSubAgent(
    user,
    subAgentIdx)
    .then((sucRs: any) => {
      return res.json({
        subAgent: sucRs.subAgent,
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
 * @apiDescription 복대리 수락 요청 취소 API
 * @api {delete} /subagent/v1/subagents/:subAgentIdx/requests
 * @apiVersion 0.0.1
 * @apiName subAgentRequestCancel
 * @apiGroup subagent/request
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} subAgentIdx 복대리 인덱스
 * 
 * @apiSuccess {Object} subAgent 복대리정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.delete("/:subAgentIdx/requests", async (req, res) => {
  const user: User = req.session.user;
  const subAgentIdx = parseInt(req.params.subAgentIdx);

  return await SubAgentRequestService.cancelRequest(
    user,
    subAgentIdx
  )
    .then((sucRs: any) => {
      return res.json({
        subAgent: sucRs.subAgent,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 복대리 수락 요청 수락 API
 * @api {put} /subagent/v1/subagents/:subAgentIdx/requests/:targetUserIdx
 * @apiVersion 0.0.1
 * @apiName acceptSubAgentRequest
 * @apiGroup subagent/request
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} subAgentIdx 복대리 인덱스
 * @apiParam {Number} targetUserIdx 대상유저 인덱스
 * 
 * @apiSuccess {Object} subAgent 복대리 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.put("/:subAgentIdx/requests/:targetUserIdx", async (req, res) => {
  const user: User = req.session.user;
  const subAgentIdx = parseInt(req.params.subAgentIdx);
  const targetUserIdx = parseInt(req.params.targetUserIdx);

  return await SubAgentRequestService.acceptRequest(
    user,
    subAgentIdx,
    targetUserIdx)
    .then((sucRs: any) => {
      return res.json({
        subAgent: sucRs.subAgent,
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
 * @apiDescription 복대리 수락 요청 거절 API
 * @api {delete} /subagent/v1/subagents/:subAgentIdx/requests/:targetUserIdx
 * @apiVersion 0.0.1
 * @apiName denySubAgentRequest
 * @apiGroup subagent/request
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} subAgentIdx 복대리 인덱스
 * @apiParam {Number} targetUserIdx 대상유저 인덱스
 * 
 * 
 * @apiSuccess {Object} subAgent 복대리 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.delete("/:subAgentIdx/requests/:targetUserIdx", async (req, res) => {
  const user: User = req.session.user;
  const subAgentIdx = parseInt(req.params.subAgentIdx);
  const targetUserIdx = parseInt(req.params.targetUserIdx);

  return await SubAgentRequestService.denySubAgentRequest(
    user,
    subAgentIdx,
    targetUserIdx)
    .then((sucRs: any) => {
      return res.json({
        subAgent: sucRs.subAgent,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
