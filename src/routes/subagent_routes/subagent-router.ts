import * as express from "express";
import { nextTick } from "process";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as SubAgentService from "../../service/subagent_service/subagent-service";

const router = express.Router();

/**
 * @apiDescription 복대리 등록 API
 * @api {post} /subagent/v1/subagents
 * @apiVersion 0.0.1
 * @apiName createSubagent
 * @apiGroup subagent
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String} title 복대리 게시글 제목
 * @apiParam {String} content 복대리 게시글 내용
 * @apiParam {String} court 법원 이름
 * @apiParam {String} pay 복대리 페이
 * @apiParam {String} trialStartTime 재판시작시간
 * 
 * 
 * @apiSuccess {Object} subAgent 복대리정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.post("/", async (req, res) => {
  const user: User = req.session.user;
  const title = req.body.title;
  const content = req.body.content;
  const court = req.body.court;
  const pay = parseInt(req.body.pay);
  const trialStartTime = req.body.trialStartTime;
  const phoneNumber = req.body.phoneNumber;

  return await SubAgentService.create(user, title, content, court, pay, trialStartTime, phoneNumber)
    .then((sucRs: any) => {
      return res.json({
        subAgent: sucRs.subAgent,
      });
    })
    .catch((err: any) => {
      console.log("err ? ",err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 복대리 업데이트 API
 * @api {put} /subagent/v1/subagents/:subAgentIdx
 * @apiVersion 0.0.1
 * @apiName updateSubAgent
 * @apiGroup subagent
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Nmber} subAgentIdx 복대리 인덱스
 * @apiParam {String} title 복대리 게시글 제목
 * @apiParam {String} content 복대리 게시글 내용
 * @apiParam {String} court 법원 이름
 * @apiParam {String} pay 복대리 페이
 * @apiParam {String} trialStartTime 재판시작시간
 * 
 * 
 * @apiSuccess {Object} subAgent 복대리 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
   {
   }
 * 
 */
router.put("/:subAgentIdx?", async (req, res) => {
  const user: User = req.session.user;
  const subAgentIdx = parseInt(req.params.subAgentIdx);
  const title = req.body.title;
  const content = req.body.content;
  const court = req.body.court;
  const pay = parseInt(req.body.pay);
  const trialStartTime = req.body.trialStartTime;
  const phoneNumber = req.body.phoneNumber;

  return await SubAgentService.update(user, subAgentIdx, title, content, court, pay, trialStartTime, phoneNumber)
    .then((sucRs: any) => {
      return res.json({
        subAgent: sucRs.subAgent,
      });
    })
    .catch((err: any) => {
      console.log("err ? ",err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 복대리 삭제 API
 * @api {delete} /subagent/v1/subagents/:subAgentIdx
 * @apiVersion 0.0.1
 * @apiName deleteSubAgent
 * @apiGroup subagent
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} subAgentIdx 복대리 인덱스
 * 
 * 
 * @apiSuccess {Object} SubAgent 복대리정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.delete("/:subAgentIdx", async (req, res) => {
  const user: User = req.session.user;
  const subAgentIdx = parseInt(req.params.subAgentIdx);

  return await SubAgentService.remove(user, subAgentIdx)
    .then((sucRs: any) => {
      return res.json({
        subAgent: sucRs.subAgent,
      });
    })
    .catch((err: any) => {
      console.log("err ? ",err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 알람 조회 API
 * @api {get} /subagent/v1/subagents/histories/:historyIdx?
 * @apiVersion 0.0.1
 * @apiName getSubAgentHistories
 * @apiGroup subagent
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} [historyIdx] 최초 요청이 아닐경우, 이전 데이터를 가져오기 위한 offset
 * 
 * @apiSuccess {Object} lawFirm 로펌정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
    "subAgentHistories":[]
  }
 * 
 */
router.get("/histories/:historyIdx?", async (req, res) => {
  const user: User = req.session.user;

  const historyIdx = req.params.historyIdx;

  return await SubAgentService.getAllHistories(user, historyIdx)
    .then((sucRs: any) => {
      return res.json({
        subAgentHistories: sucRs.subAgentHistories,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});



/**
 * @apiDescription 복대리 정보 조회 API
 * @api {get} /subagent/v1/subagents/:subAgentIdx?
 * @apiVersion 0.0.1
 * @apiName getSubAgentInfo
 * @apiGroup subagent
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} subAgentIdx 복대리 인덱스
 * @apiParam {String=["BOARD", "REQUESTING", "REQUEST", "ACCEPTED"]} [type=BOARD] (query string)조회 타입. REQUESTING의 경우, 내가 복대리 요청했던 글들만보임. REQUSET의 경우, 복대리 요청에대해 하겠다고 신청한 경우가 모두 보임. ACCEPTED의 경우, 성사된 복대리만 보임.
 * @apiParam {String=["DEFAULT"]} [courts=DEFAULT] 지역 필터링값 (query string)
 * @apiParam {Number} [offsetSubAgentIdx] (query string)만약, after로 가져온다면, 가져왔던 마지막 게시글의 인덱스
 * 
 * @apiSuccess {Object} SubAgents 복대리 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.get("/:subAgentIdx?", async (req, res) => {
  const user: User = req.session.user;
  const subAgentIdx = req.params.subAgentIdx;
  const typeRaw:any = req.query['type'];
  const type = SubAgentService.SubAgentShowType[typeRaw ? typeRaw : "DEFAULT"];
  const offsetSubAgentIdx:any = req.query.offsetSubAgentIdx;
  const courts:any = req.query.courts;

  // user: User,
  // subAgentIdx?: string,
  // type?: SubAgentShowType,
  // offsetSubAgentIdx?: string
  return await SubAgentService.getAll(user, subAgentIdx, type, offsetSubAgentIdx, courts)
    .then((sucRs: any) => {
      return res.json({
        subAgents: sucRs.subAgents,
      });
    })
    .catch((err: any) => {
      console.log("err ? ",err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
