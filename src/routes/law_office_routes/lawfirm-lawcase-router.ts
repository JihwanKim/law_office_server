import * as express from "express";
import { User, UserType } from "../../entity/User";
import { AuthType } from "../../entity/UserAuth";
import * as LawCaseService from "../../service/law_office_service/lawfirm-lawcase-service";
import * as LawCaseReadService from "../../service/law_office_service/lawfirm-lawcase-read-service";
import logger from "../../logger";
import { LawCaseStataus as LawCaseStatus } from "../../entity/LawCase";

const router = express.Router();

/**
 * @apiDescription 사건 등록 API
 * @api {post} /v1/lawfirms/lawcases
 * @apiVersion 0.0.1
 * @apiName createLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String} title                             사건 타이틀
 * @apiParam {String} description                       사건 설명
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawCase": {
              "title": "ㅅㅏ건1",
              "description": "non",
              "idx": 1,
              "lawStatus": "WAITING",
              "createTime": "2020-11-22T08:26:40.012Z",
              "updateTime": "2020-11-22T08:26:40.012Z"
          }
      }
 * 
 */
router.post("/", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const title = req.body.title;
  const description = req.body.description;
  return await LawCaseService.create(
    lawFirm,
    title,
    description
  ).then((sucOK: any) => {
    return res.json({
      lawCase: sucOK.lawCase,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});

/**
 * @apiDescription 사건 수정 API
 * @api {put} /v1/lawfirms/lawcases/:lawCaseIdx
 * @apiVersion 0.0.1
 * @apiName updateLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawCaseIdx                        사건 인덱스
 * 
 * @apiParam {String} title                             사건 타이틀
 * @apiParam {String} description                       사건 설명
 * @apiParam {String=["WAITING","ONGOING","COMPLETE"]} status                            사건 상태 수정
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawCase": {
              "title": "ㅅㅏ건1",
              "description": "non",
              "idx": 1,
              "lawStatus": "WAITING",
              "createTime": "2020-11-22T08:26:40.012Z",
              "updateTime": "2020-11-22T08:26:40.012Z"
          }
      }
 * 
 */
router.put("/:lawCaseIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const lawCaseIdx = parseInt(req.params.lawCaseIdx);
  const title = req.body.title;
  const status:LawCaseStatus = LawCaseStatus[req.body.status];
  const description = req.body.description;
  return await LawCaseService.update(
    user,
    lawFirm,
    lawCaseIdx,
    title,
    description,
    status
  ).then((sucOK: any) => {
    return res.json({
      lawCase: sucOK.lawCase,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});

/**
 * @apiDescription 사건 삭제 API
 * @api {delete} /v1/lawfirms/lawcases/:lawCaseIdx
 * @apiVersion 0.0.1
 * @apiName deleteLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawCaseIdx                        사건 인덱스
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawCase": {
              "title": "ㅅㅏ건1",
              "description": "non",
              "idx": 1,
              "lawStatus": "WAITING",
              "createTime": "2020-11-22T08:26:40.012Z",
              "updateTime": "2020-11-22T08:26:40.012Z"
          }
      }
 * 
 */
router.delete("/:lawCaseIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const lawCaseIdx = parseInt(req.params.lawCaseIdx);
  return await LawCaseService.remove(
    user,
    lawFirm,
    lawCaseIdx
  ).then((sucOK: any) => {
    return res.json({
      lawCase: sucOK.lawCase,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});

/**
 * @apiDescription 사건 목록 조회 API
 * @api {get} /v1/lawfirms/lawcases/[:lawCaseIdx]
 * @apiVersion 0.0.1
 * @apiName deleteLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} [lawCaseIdx]                        사건 인덱스
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawCases": [
              {
                  "idx": 7,
                  "title": "ㅅㅏ7",
                  "description": "non",
                  "lawStatus": "WAITING",
                  "createTime": "2020-11-22T08:27:06.955Z",
                  "updateTime": "2020-11-22T08:27:06.955Z",
                  "users": [],
                  "customers": [],
                  "group": null,
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
              },
              {
                  "idx": 4,
                  "title": "ㅅㅏ건4",
                  "description": "non",
                  "lawStatus": "WAITING",
                  "createTime": "2020-11-22T08:27:03.558Z",
                  "updateTime": "2020-11-22T08:27:03.558Z",
                  "users": [],
                  "customers": [],
                  "group": {
                      "idx": 25,
                      "name": "관리자",
                      "description": "관리자 그룹",
                      "createTime": "2020-11-18T12:17:30.799Z",
                      "updateTime": "2020-11-18T12:17:30.799Z"
                  },
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
              },
              {
                  "idx": 3,
                  "title": "ㅅㅏ건3",
                  "description": "non",
                  "lawStatus": "WAITING",
                  "createTime": "2020-11-22T08:27:02.960Z",
                  "updateTime": "2020-11-22T08:27:02.960Z",
                  "users": [],
                  "customers": [],
                  "group": {
                      "idx": 25,
                      "name": "관리자",
                      "description": "관리자 그룹",
                      "createTime": "2020-11-18T12:17:30.799Z",
                      "updateTime": "2020-11-18T12:17:30.799Z"
                  },
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
              },
              {
                  "idx": 1,
                  "title": "ㅅㅏ건1",
                  "description": "non",
                  "lawStatus": "WAITING",
                  "createTime": "2020-11-22T08:26:40.012Z",
                  "updateTime": "2020-11-22T08:26:40.012Z",
                  "users": [],
                  "customers": [],
                  "group": {
                      "idx": 28,
                      "name": "testLawfirm",
                      "description": "description!!!",
                      "createTime": "2020-11-20T12:03:30.887Z",
                      "updateTime": "2020-11-20T12:03:30.887Z"
                  },
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
router.get("/:lawCaseIdx?", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  return await LawCaseReadService.getAll(
    user,
    lawFirm
  ).then((sucOK: any) => {
    return res.json({
      lawCases: sucOK.lawCases,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});

/**
 * @apiDescription 사건에 유저 추가 API
 * @api {post} /v1/lawfirms/lawcases/:lawCaseIdx/users/:userIdx
 * @apiVersion 0.0.1
 * @apiName addUserToLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawCaseIdx                    사건 인덱스
 * @apiParam {Number} userIdx                       추가되는 유저 인덱스
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawCase": {
              "idx": 1,
              "title": "ㅅㅏ건1",
              "description": "non",
              "lawStatus": "WAITING",
              "createTime": "2020-11-22T08:26:40.012Z",
              "updateTime": "2020-11-22T08:26:40.012Z",
              "users": [
                  {
                      "idx": 21,
                      "type": "LAWYER",
                      "name": "test",
                      "email": "test@test.com",
                      "birthday": "2000-01-01",
                      "phoneNumber": "8210123412341234",
                      "createTime": "2020-11-18T12:17:16.905Z",
                      "updateTime": "2020-11-18T12:17:16.905Z"
                  }
              ]
          }
      }
 * 
 */
router.post("/:lawCaseIdx/users/:userIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const lawCaseIdx = parseInt(req.params.lawCaseIdx);
  const targetUserIdx = parseInt(req.params.userIdx);
  return await LawCaseService.addUser(
    user,
    lawFirm,
    lawCaseIdx,
    targetUserIdx
  ).then((sucOK: any) => {
    return res.json({
      lawCase: sucOK.lawCase,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});

/**
 * @apiDescription 사건에 유저 삭제 API
 * @api {delete} /v1/lawfirms/lawcases/:lawCaseIdx/users/:userIdx
 * @apiVersion 0.0.1
 * @apiName deleteUserByLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawCaseIdx                    사건 인덱스
 * @apiParam {Number} userIdx                       추가되는 유저 인덱스
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
     {
          "lawCase": {
              "idx": 1,
              "title": "ㅅㅏ건1",
              "description": "non",
              "lawStatus": "WAITING",
              "createTime": "2020-11-22T08:26:40.012Z",
              "updateTime": "2020-11-22T08:26:40.012Z",
              "users": [
              ]
          }
      }
 * 
 */
router.delete("/:lawCaseIdx/users/:userIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const lawCaseIdx = parseInt(req.params.lawCaseIdx);
  const targetUserIdx = parseInt(req.params.userIdx);
  return await LawCaseService.removeUser(
    user,
    lawFirm,
    lawCaseIdx,
    targetUserIdx
  ).then((sucOK: any) => {
    return res.json({
      lawCase: sucOK.lawCase,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});


/**
 * @apiDescription 사건에 고객 추가 API
 * @api {post} /v1/lawfirms/lawcases/:lawCaseIdx/customers/:customerIdx
 * @apiVersion 0.0.1
 * @apiName addCustomerToLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawCaseIdx                    사건 인덱스
 * @apiParam {Number} customerIdx                       추가되는 고객 인덱스
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawCase": {
              "idx": 1,
              "title": "ㅅㅏ건1",
              "description": "non",
              "lawStatus": "WAITING",
              "createTime": "2020-11-22T08:26:40.012Z",
              "updateTime": "2020-11-22T08:26:40.012Z",
              "customers": [
                  {
                      "idx": 2,
                      "name": "테스트이름",
                      "email": "test@test.com",
                      "birthday": "2000-01-01",
                      "phoneNumber": "8210123412341234",
                      "sex": "MALE",
                      "country": "대한민국",
                      "description": "설명",
                      "createTime": "2020-11-22T03:47:03.828Z",
                      "updateTime": "2020-11-22T03:47:03.828Z",
                      "lastConsultingDate": "2020-11-22T03:47:03.000Z"
                  }
              ]
          }
      }
 * 
 */
router.post("/:lawCaseIdx/customers/:customerIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const lawCaseIdx = parseInt(req.params.lawCaseIdx);
  const targetCustomerIdx = parseInt(req.params.customerIdx);
  return await LawCaseService.addCustomer(
    user,
    lawFirm,
    lawCaseIdx,
    targetCustomerIdx
  ).then((sucOK: any) => {
    return res.json({
      lawCase: sucOK.lawCase,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});

/**
 * @apiDescription 사건에 고객 제거 API
 * @api {delete} /v1/lawfirms/lawcases/:lawCaseIdx/customers/:customerIdx
 * @apiVersion 0.0.1
 * @apiName removeCustomerByLawCase
 * @apiGroup lawfirm/lawcase
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} lawCaseIdx                        사건 인덱스
 * @apiParam {Number} customerIdx                       추가되는 고객 인덱스
 * 
 * @apiSuccess {Object} lawCase 사건정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "lawCase": {
              "idx": 1,
              "title": "ㅅㅏ건1",
              "description": "non",
              "lawStatus": "WAITING",
              "createTime": "2020-11-22T08:26:40.012Z",
              "updateTime": "2020-11-22T08:26:40.012Z",
              "customers": [
              ]
          }
      }
 * 
 */
router.delete("/:lawCaseIdx/customers/:customerIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const lawCaseIdx = parseInt(req.params.lawCaseIdx);
  const targetCustomerIdx = parseInt(req.params.customerIdx);
  return await LawCaseService.removeCustomer(
    user,
    lawFirm,
    lawCaseIdx,
    targetCustomerIdx
  ).then((sucOK: any) => {
    return res.json({
      lawCase: sucOK.lawCase,
    });
  }).catch(
    (err: any) => {
      return res.json({
        token: err,
      });
    },
  );
});

export default router;
