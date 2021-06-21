import * as express from "express";
import { nextTick } from "process";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as SubAgentUserService from "../../service/subagent_service/subagent-user-service";

const router = express.Router();

/**
 * @apiDescription 유저 조회 API
 * @api {get} /subagent/v1/users/:userIdx?
 * @apiVersion 0.0.1
 * @apiName getUserInfo
 * @apiGroup subagent/user
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} [userIdx] 정보 조회하는 대상 유저 인덱스. 만약, 내꺼를 조회할꺼면 넣지않으면됨.
 * 
 * 
 * @apiSuccess {Object} user 유저 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.get("/:userIdx?", async (req, res) => {
  const user: User = req.session.user;
  const userIdx = req.params.userIdx ? parseInt(req.params.userIdx) : user.idx;

  return await SubAgentUserService.getUserInfo(
    user,
    userIdx)
    .then((sucRs: any) => {
      return res.json({
        user: sucRs.user,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 유저 본인의 정보 업데이트 API
 * @api {put} /subagent/v1/users
 * @apiVersion 0.0.1
 * @apiName updateUserInfo
 * @apiGroup subagent/user
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String} name 변경하는 유저의 닉네임
 * @apiParam {String} phoneNumber 핸드폰 번호
 * @apiParam {String} lawyerAffiliationOffice 소속 사무실
 * @apiParam {String} lawyerAffiliationBranch 소속지회
 * @apiParam {String} bankAccountInfo 계좌정보
 * 
 * @apiSuccess {Object} subAgent 복대리정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.put("/", async (req, res) => {
  const user: User = req.session.user;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const lawyerAffiliationOffice = req.body.lawyerAffiliationOffice;
  const lawyerAffiliationBranch = req.body.lawyerAffiliationBranch;
  const bankAccountInfo = req.body.bankAccountInfo;

  return await SubAgentUserService.updateUserInfo(
    user,
    name,
    phoneNumber,
    lawyerAffiliationOffice,
    lawyerAffiliationBranch,
    bankAccountInfo
  )
    .then((sucRs: any) => {
      return res.json({
        user: sucRs.user,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
