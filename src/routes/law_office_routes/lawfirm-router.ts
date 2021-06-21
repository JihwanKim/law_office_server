import * as express from "express";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as LawFirmService from "../../service/law_office_service/lawfirm-service";
import * as LawFirmReadService from "../../service/law_office_service/lawfirm-read-service";
import * as LawFirmJoinService from "../../service/law_office_service/lawfirm-join-service";
import * as LawFirmJoinReadService from "../../service/law_office_service/lawfirm-join-read-service";

const router = express.Router();

/**
 * @apiDescription 로펌 등록 API
 * @api {post} /v1/lawfirms
 * @apiVersion 0.0.1
 * @apiName createLawFirm
 * @apiGroup lawfirm
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} name 로펌 이름
 * @apiParam {String} telePhone 로펌의 전화번호
 * @apiParam {String} address 로펌 주소
 * 
 * 
 * @apiSuccess {Object} lawFirm 로펌정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
    "lawFirm": {
      "address": "010123412341234",
      "name": "test",
      "telephone": "test_address",
      "ownerUser": {
        "idx": 14,
        "type": "EMPLOYEE",
        "name": "임시이름2",
        "email": "TestEmail",
        "birthday": "2000-01-01",
        "phoneNumber": "010123412341234",
        "createTime": "2020-11-13T13:36:31.798Z",
        "updateTime": "2020-11-13T13:36:31.798Z",
        "groups": []
      },
      "groups": [],
      "joinCode": "randomStr",
      "idx": 25,
      "status": "DEFAULT",
      "createTime": "2020-11-13T13:36:38.845Z",
      "updateTime": "2020-11-13T13:36:38.845Z"
    }
  }
 * 
 */
router.post("/", async (req, res) => {
  const user: User = req.session.user;

  const name = req.body.name;
  const telePhone = req.body.telePhone;
  const address = req.body.address;

  return await LawFirmService.create(user, name, telePhone, address)
    .then((sucRs: any) => {
      logger.info(`new customer insert! lawFirm:${sucRs.lawFirm} user:${user}`);
      return res.json({
        lawFirm: sucRs.lawFirm,
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
 * @apiDescription 로펌 정보 업데이트 API
 * @api {put} /v1/lawfirms
 * @apiVersion 0.0.1
 * @apiName updateLawFirm
 * @apiGroup lawfirm
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} name 로펌 이름
 * @apiParam {String} telePhone 로펌의 전화번호
 * @apiParam {String} address 로펌 주소
 * @apiParam {String} [joinCode] 조인 코드 변경시, 포함하여 전송. 만약 아니라면, 전송 X. 포함한다면, 랜덤 문자열로 변경
 * 
 * 
 * @apiSuccess {Object} lawFirm 로펌정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
    "lawFirm": {
      "address": "010123412341234",
      "name": "test",
      "telephone": "test_address",
      "ownerUser": {
        "idx": 14,
        "type": "EMPLOYEE",
        "name": "임시이름2",
        "email": "TestEmail",
        "birthday": "2000-01-01",
        "phoneNumber": "010123412341234",
        "createTime": "2020-11-13T13:36:31.798Z",
        "updateTime": "2020-11-13T13:36:31.798Z",
        "groups": []
      },
      "groups": [],
      "joinCode": "randomStr",
      "idx": 25,
      "status": "DEFAULT",
      "createTime": "2020-11-13T13:36:38.845Z",
      "updateTime": "2020-11-13T13:36:38.845Z"
    }
  }
 * 
 */
router.put("/", async (req, res) => {
  const user: User = req.session.user;

  const name = req.body.name;
  const telePhone = req.body.telePhone;
  const address = req.body.address;
  const joinCode = req.body.joinCode;

  return await LawFirmService.update(user, name, telePhone, address, joinCode)
    .then((sucRs: any) => {
      logger.info(`update lawfirm! lawFirm:${sucRs.lawFirm} user:${user}`);
      return res.json({
        lawFirm: sucRs.lawFirm,
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
 * @apiDescription 자신이 가입된 로펌 조회 API
 * @api {get} /v1/lawfirms
 * @apiVersion 0.0.1
 * @apiName getLawFirm
 * @apiGroup lawfirm
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiSuccess {Object} lawFirm 로펌정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
    "lawFirm": {
      "address": "010123412341234",
      "name": "test",
      "telephone": "test_address",
      "ownerUser": {
        "idx": 14,
        "type": "EMPLOYEE",
        "name": "임시이름2",
        "email": "TestEmail",
        "birthday": "2000-01-01",
        "phoneNumber": "010123412341234",
        "createTime": "2020-11-13T13:36:31.798Z",
        "updateTime": "2020-11-13T13:36:31.798Z",
        "groups": []
      },
      "groups": [],
      "joinCode": "randomStr",
      "idx": 25,
      "status": "DEFAULT",
      "createTime": "2020-11-13T13:36:38.845Z",
      "updateTime": "2020-11-13T13:36:38.845Z"
    }
  }
 * 
 */
router.get("/", async (req, res) => {
  const lawFirm: LawFirm = req.session.lawFirm;

  return await LawFirmReadService.get(lawFirm)
    .then((sucRs: any) => {
      return res.json({
        lawFirm: sucRs.lawFirm,
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
