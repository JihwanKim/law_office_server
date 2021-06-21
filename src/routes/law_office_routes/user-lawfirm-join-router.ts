import * as express from "express";
import * as LawFirmJoinService from "../../service/law_office_service/lawfirm-join-service";
import * as LawFirmJoinReadService from "../../service/law_office_service/lawfirm-join-read-service";
import { User } from "../../entity/User";
import logger from "../../logger";
const router = express.Router();

/**
 * @apiDescription 로펌 가입요청 API
 * @api {delete} /v1/users/lawfirms/joins
 * @apiVersion 0.0.1
 * @apiName joinLawFirm
 * @apiGroup lawfirm/join
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String} joinCode 로펌 가입 코드
 * 
 * @apiSuccess {Object} lawFirmJoinRequest 가입요청 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawFirmJoinRequest": {
              "idx": 3,
              "createTime": "2020-11-21T01:59:55.138Z",
              "updateTime": "2020-11-21T01:59:55.138Z"
          }
      }
 * 
 */
router.post("/", async (req, res) => {
  const user: User = req.session.user;

  const lawFirmIdx = parseInt(req.params.lawFirmIdx);
  const joinCode = req.body.joinCode;

  return await LawFirmJoinService.joinRequestByCode(user, joinCode)
    .then((sucRs: any) => {
      logger.info(
        `new join request to ${lawFirmIdx}! requestResult?:${sucRs.lawFirmJoinRequest} user:${user}`
      );
      return res.json({
        lawFirmJoinRequest: sucRs.lawFirmJoinRequest,
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
 * @apiDescription 로펌 가입취소 API
 * @api {delete} /v1/users/lawfirms/joins/:lawFirmJoinRequestIdx
 * @apiVersion 0.0.1
 * @apiName deleteLawFirmJoinRequest
 * @apiGroup lawfirm/join
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawFirmJoinRequestIdx 로펌 가입요청 인덱스
 * 
 * @apiSuccess {Object} lawFirmJoinRequest 가입 요청 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
    {
        "lawFirmJoinRequest": {
            "idx": 4,
            "createTime": "2020-11-21T04:13:04.677Z",
            "updateTime": "2020-11-21T04:13:04.677Z"
        }
    }
 * 
 */
router.delete("/:lawFirmJoinRequestIdx", async (req, res) => {
  const user: User = req.session.user;

  const lawFirmJoinRequestIdx = parseInt(req.params.lawFirmJoinRequestIdx);

  return await LawFirmJoinService.joinRequestCancel(user, lawFirmJoinRequestIdx)
    .then((sucRs: any) => {
      logger.info(
        `cancel join request user:${user}`
      );
      return res.json({
        lawFirmJoinRequest: sucRs.lawFirmJoinRequest,
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
 * @apiDescription 로펌 가입요청 목록 조회 API
 * @api {get} /v1/users/lawfirms/joins
 * @apiVersion 0.0.1
 * @apiName getLawFirmJoinRequests
 * @apiGroup lawfirm/join
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String} joinCode 로펌 가입 코드
 * 
 * @apiSuccess {Object} lawFirmJoinRequests 가입 요청 목록
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
    {
        "lawFirmJoinRequests": [
            {
                "idx": 3,
                "createTime": "2020-11-21T01:59:55.138Z",
                "updateTime": "2020-11-21T01:59:55.138Z",
                "lawFirm": {
                    "idx": 16,
                    "status": "DEFAULT",
                    "name": "testLawfirm",
                    "joinCode": "3737",
                    "telephone": "addres!!",
                    "address": "8210123412341234",
                    "createTime": "2020-11-18T12:17:30.786Z",
                    "updateTime": "2020-11-18T12:17:30.786Z"
                }
            }
        ]
    }
 * 
 */
router.get("/", async (req, res) => {
  const user: User = req.session.user;

  return await LawFirmJoinReadService.getAllForRequestUser(user)
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
