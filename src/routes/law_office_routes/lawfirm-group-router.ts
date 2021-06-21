import * as express from "express";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as LawFirmGroupService from "../../service/law_office_service/lawfirm-group-service";
import * as LawFIrmGroupReadService from "../../service/law_office_service/lawfirm-group-read-service";

const router = express.Router();

/**
 * @apiDescription 로펌 그룹 등록 API
 * @api {post} /v1/lawfirms/groups
 * @apiVersion 0.0.1
 * @apiName createLawFirmGroup
 * @apiGroup lawfirm/group
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} name 그룹 이름
 * @apiParam {String} description 그룹 설명
 * @apiParam {Number} permissionVersion 퍼미션 버전
 * @apiParam {String} permission 퍼미션 정보
 * 
 * @apiSuccess {Object} group 그룹정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
      {
          "groups": [
              {
                  "idx": 25,
                  "name": "관리자",
                  "description": "관리자 그룹",
                  "createTime": "2020-11-18T12:17:30.799Z",
                  "updateTime": "2020-11-18T12:17:30.799Z",
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
              },
              {
                  "idx": 26,
                  "name": "기본",
                  "description": "기본 그룹",
                  "createTime": "2020-11-18T12:17:30.811Z",
                  "updateTime": "2020-11-18T12:17:30.811Z",
                  "users": []
              },
              {
                  "idx": 27,
                  "name": "testLawfirm",
                  "description": "description!!!",
                  "createTime": "2020-11-20T12:02:31.953Z",
                  "updateTime": "2020-11-20T12:02:31.953Z",
                  "users": []
              },
              {
                  "idx": 28,
                  "name": "testLawfirm",
                  "description": "description!!!",
                  "createTime": "2020-11-20T12:03:30.887Z",
                  "updateTime": "2020-11-20T12:03:30.887Z",
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
          ]
      }
 * 
 */
router.post("/", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  const name = req.body.name;
  const description = req.body.description;
  const permissionVersion = parseInt(req.body.permissionVersion);
  const perm = req.body.permission;

  return await LawFirmGroupService.create(user, lawFirm, name, description, permissionVersion, perm)
    .then((sucRs: any) => {
      logger.info(`new lawfirm group insert! group:${sucRs.group} user:${user}`);
      return res.json({
        group: sucRs.group,
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
 * @apiDescription 로펌 그룹 수정 API
 * @api {put} /v1/lawfirms/groups/:groupIdx
 * @apiVersion 0.0.1
 * @apiName updateLawFirmGroup
 * @apiGroup lawfirm/group
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} groupIdx 그룹 인덱스
 * @apiParam {Number} name 그룹 이름
 * @apiParam {String} description 그룹 설명
 * 
 * 
 * @apiSuccess {Object} group 그룹정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
    {
        "group": {
            "idx": 29,
            "name": "testLawfirm22",
            "description": "description!!!",
            "createTime": "2020-11-20T12:04:57.196Z",
            "updateTime": "2020-11-20T12:11:59.000Z"
        }
    }
 * 
 */
router.put("/:groupIdx", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  const groupIdx = parseInt(req.params.groupIdx);

  const name = req.body.name;
  const description = req.body.description;

  return await LawFirmGroupService.update(user, lawFirm, groupIdx, name, description)
    .then((sucRs: any) => {
      logger.info(`group update! group:${sucRs.group} user:${user}`);
      return res.json({
        group: sucRs.group,
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
 * @apiDescription 로펌 그룹 삭제 API
 * @api {delete} /v1/lawfirms/groups/:groupIdx
 * @apiVersion 0.0.1
 * @apiName deleteLawFirmGroup
 * @apiGroup lawfirm/group
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} groupIdx 그룹 인덱스
 * 
 * @apiSuccess {Object} group 그룹정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
    {
        "group": {
            "idx": 29,
            "name": "testLawfirm22",
            "description": "description!!!",
            "createTime": "2020-11-20T12:04:57.196Z",
            "updateTime": "2020-11-20T12:11:59.000Z"
        }
    }
 * 
 */
router.delete("/:groupIdx", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  const groupIdx = parseInt(req.params.groupIdx);

  return await LawFirmGroupService.remove(user, lawFirm, groupIdx)
    .then((sucRs: any) => {
      logger.info(`group update! group:${sucRs.group} user:${user}`);
      return res.json({
        group: sucRs.group,
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
 * @apiDescription 로펌 그룹 목록 및 소속 유저 조회 API
 * @api {get} /v1/lawfirms/groups
 * @apiVersion 0.0.1
 * @apiName getLawFirmGroupsAndUsers
 * @apiGroup lawfirm/group
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} name 그룹 이름
 * @apiParam {String} description 그룹 설명
 * @apiParam {String} permissionVersion 퍼미션 버전
 * @apiParam {String} permission 퍼미션 정보
 * 
 * 
 * @apiSuccess {Array} groups 그룹 정보 리스트
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
    {
        "groups": [
            {
                "idx": 25,
                "name": "관리자",
                "description": "관리자 그룹",
                "createTime": "2020-11-18T12:17:30.799Z",
                "updateTime": "2020-11-18T12:17:30.799Z",
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
            },
            {
                "idx": 26,
                "name": "기본",
                "description": "기본 그룹",
                "createTime": "2020-11-18T12:17:30.811Z",
                "updateTime": "2020-11-18T12:17:30.811Z",
                "users": []
            }
        ]
    }
 * 
 */
router.get("/", async (req, res) => {
  // const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  return await LawFIrmGroupReadService.getAll(lawFirm)
    .then((sucRs: any) => {
      console.log(sucRs.groups);
      return res.json({
        groups: sucRs.groups,
      });
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(400).json({
        error: err.error,
      });
    });
});

////////////////////////////////////////////////////////////////////////
//////////////////////////// group user ////////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * @apiDescription 로펌 그룹에 유저 추가 API
 * @api {post} /v1/lawfirms/groups/:groupIdx/users/:userIdx
 * @apiVersion 0.0.1
 * @apiName addUserToGroup
 * @apiGroup lawfirm/group/user
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} groupIdx 그룹 인덱스
 * @apiParam {Number} userIdx 대상유저 인덱스
 * 
 * 
 * @apiSuccess {Object} group 그룹정보
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
router.post("/:groupIdx/users/:userIdx", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  const groupIdx: number = parseInt(req.params.groupIdx);
  const userIdx: number = parseInt(req.params.userIdx);

  return await LawFirmGroupService.addUser(user, lawFirm, userIdx, groupIdx)
    .then((sucRs: any) => {
      logger.info(`user_add_to_group groupIdx:${groupIdx}, user:${sucRs.user}`);
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
 * @apiDescription 로펌 그룹에서 유저 제거 API
 * @api {delete} /v1/lawfirms/groups/:groupIdx/users/:userIdx
 * @apiVersion 0.0.1
 * @apiName deleteUserByGroup
 * @apiGroup lawfirm/group/user
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} groupIdx 그룹 인덱스
 * @apiParam {Number} userIdx 대상유저 인덱스
 * 
 * 
 * @apiSuccess {Object} user 유저 정보
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
router.delete("/:groupIdx/users/:userIdx", async (req, res) => {
  const user: User = req.session.user;
  const lawFirm: LawFirm = req.session.lawFirm;

  const groupIdx: number = parseInt(req.params.groupIdx);
  const userIdx: number = parseInt(req.params.userIdx);

  return await LawFirmGroupService.removeUser(user, lawFirm, userIdx, groupIdx)
    .then((sucRs: any) => {
      logger.info(`user_remove_by_group groupIdx:${groupIdx}, user:${sucRs.user}`);
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

export default router;