import * as express from "express";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as LawFirmJoinService from "../../service/law_office_service/lawfirm-join-service";
import * as LawFirmService from "../../service/law_office_service/lawfirm-service";
import * as LawFirmJoinReadService from "../../service/law_office_service/lawfirm-join-read-service";

const router = express.Router();

////////////////////////////////////////////////////////////////////////
//////////////////////////// group join ////////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * @apiDescription 로펌 가입승인 API
 * @api {post} /v1/lawfirms/joins/:lawFirmJoinRequestIdx
 * @apiVersion 0.0.1
 * @apiName acceptJoinLawFirm
 * @apiGroup lawfirm/join
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawFirmJoinRequestIdx 가입요청 인덱스
 * 
 * @apiSuccess {Object} lawFirm 로펌정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "user": {
              "idx": 20,
              "type": "EMPLOYEE",
              "name": "이름",
              "email": "test@test.com",
              "birthday": "2000-01-01",
              "phoneNumber": "8210123412341234",
              "createTime": "2020-11-17T05:13:02.158Z",
              "updateTime": "2020-11-21T04:23:29.000Z"
          }
      }
 * 
 */
router.post("/:lawFirmJoinRequestIdx", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  const lawFirmJoinRequestIdx = parseInt(req.params.lawFirmJoinRequestIdx);

  return await LawFirmService.joinAccept(user, lawFirm, lawFirmJoinRequestIdx)
    .then((sucRs: any) => {
      user.lawFirm = undefined;
      logger.info(`join accept! to ${lawFirm}! accepted user:${sucRs.user}`);
      return res.json({
        user: sucRs.user,
      });
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 로펌 가입요청 거절 API
 * @api {delete} /v1/lawfirms/joins/:lawFirmJoinRequestIdx
 * @apiVersion 0.0.1
 * @apiName rejectJoinLawFirm
 * @apiGroup lawfirm/join
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawFirmJoinRequestIdx 가입요청 인덱스
 * 
 * @apiSuccess {Object} user 유저정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "user": {
              "idx": 21,
              "type": "LAWYER",
              "name": "test",
              "email": "test@test.com",
              "birthday": "2000-01-01",
              "phoneNumber": "8210123412341234",
              "createTime": "2020-11-18T12:17:16.905Z",
              "updateTime": "2020-11-18T12:17:16.905Z"
          }
      }
 * 
 */
router.delete("/:lawFirmJoinRequestIdx", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  const lawFirmJoinRequestIdx = parseInt(req.params.lawFirmJoinRequestIdx);

  return await LawFirmService.joinReject(user, lawFirm, lawFirmJoinRequestIdx)
    .then((sucRs: any) => {
      logger.info(`join reject! ${lawFirm}! rejected user:${sucRs.user}`);
      return res.json({
        user: sucRs.user,
      });
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

/**
 * @apiDescription 로펌 가입요청 조회 API
 * @api {get} /v1/lawfirms/joins
 * @apiVersion 0.0.1
 * @apiName getJoinLawFirmList
 * @apiGroup lawfirm/join
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiSuccess {Array} lawFirmJoinRequests 가입요청정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
    {
        "lawFirmJoinRequests": [
            {
                "idx": 1,
                "createTime": "2020-11-21T01:50:29.446Z",
                "updateTime": "2020-11-21T01:50:29.446Z",
                "user": {
                    "idx": 21,
                    "type": "LAWYER",
                    "name": "test",
                    "email": "test@test.com",
                    "birthday": "2000-01-01",
                    "phoneNumber": "8210123412341234",
                    "createTime": "2020-11-18T12:17:16.905Z",
                    "updateTime": "2020-11-18T12:17:16.905Z"
                }
            },
            {
                "idx": 4,
                "createTime": "2020-11-21T04:13:04.677Z",
                "updateTime": "2020-11-21T04:13:04.677Z",
                "user": {
                    "idx": 20,
                    "type": "EMPLOYEE",
                    "name": "이름",
                    "email": "test@test.com",
                    "birthday": "2000-01-01",
                    "phoneNumber": "8210123412341234",
                    "createTime": "2020-11-17T05:13:02.158Z",
                    "updateTime": "2020-11-17T05:13:02.158Z"
                }
            }
        ]
    }
 * 
 */
router.get("/", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  return await LawFirmJoinReadService.getAll(user, lawFirm)
    .then((sucRs: any) => {
      return res.json({
        lawFirmJoinRequests: sucRs.lawFirmJoinRequests,
      });
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
