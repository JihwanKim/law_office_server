import * as express from "express";
import { User, UserType } from "../../entity/User";
import { AuthType } from "../../entity/UserAuth";
import * as AuthService from "../../service/law_office_service/auth-service";
import * as AuthReadService from "../../service/law_office_service/auth-read-service";
import logger from "../../logger";

const router = express.Router();

/**
 * @apiDescription 회원가입 API
 * @api {post} /v1/auths
 * @apiVersion 0.0.1
 * @apiName createUser
 * @apiGroup auth
 *
 * @apiParam {String="NORMAL","EMAIL","PROVIDER_GOOGLE","PROVIDER_KAKAO"} [authType="NORMAL"] 인증타입 (기본값 : Normal)
 * @apiParam {String} id                              사용할 계정 아이디
 * @apiParam {String} password                        사용할 계정 비밀번호
 * @apiParam {String="EMPLOYEE", "LAWYER"} userType    유저 타입
 * @apiParam {String} [serialNumber]                  userType이 LAWYER일 경우, 변호사 일련번호
 * @apiParam {String} [issueNumber]                   userType이 LAWYER일 경우, 변호사 발급변호
 * @apiParam {String} name                            이름
 * @apiParam {String} email                           이메일
 * @apiParam {String} birthday                        생일
 * @apiParam {String} phoneNumber                     핸드폰번호
 *
 * @apiSuccess {Object} user 유저 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *           "type": "EMPLOYEE",
 *           "name": "임시이름2",
 *           "birthday": "2000-01-01",
 *           "email": "TestEmail",
 *           "phoneNumber": "010123412341234",
 *           "auths": [
 *               {
 *                   "id": "testAcc222",
 *                   "password": null,
 *                   "type": "NORMAL",
 *                   "idx": 10,
 *                   "createTime": "2020-11-13T12:43:17.658Z",
 *                   "updateTime": "2020-11-13T12:43:17.658Z"
 *               }
 *           ],
 *           "idx": 13,
 *           "createTime": "2020-11-13T12:43:17.662Z",
 *           "updateTime": "2020-11-13T12:43:17.662Z"
 *       }
 *     }
 *
 */
router.post("/", async (req, res) => {
  const id = req.body.id === undefined ? req.body.email : req.body.id;
  const password = req.body.password;
  const authType: AuthType = req.body.authType
    ? (<any>AuthType)[req.body.authType]
    : AuthType.NORMAL; // normal, email, provider
  const userType: UserType = (<any>UserType)[req.body.userType]; // employee or lawyer
  const serialNumber = req.body.serialNumber; // 일련번호
  const issueNumber = req.body.issueNumber; // 발급번호
  const name = req.body.name;
  const email = req.body.email;
  const birthday = req.body.birthday;
  const phoneNumber = req.body.phoneNumber;

  return await AuthService.signUp(
    userType, // employee or lawyer
    name,
    email,
    birthday,
    phoneNumber,
    authType, // normal, email, provider
    id,
    password,
    // lawyer!
    serialNumber, // 일련번호
    issueNumber
  )
    .then((sucRs: any) => {
      logger.info(`new user insert! user:${sucRs.user}`);
      return res.json({
        user: sucRs.user,
      });
    })
    .catch((anyFail: any) => {
      return res.status(400).json({
        error: anyFail.error,
      });
    });
});

/**
 * @apiDescription 로그인 API
 * @api {post} /v1/auths/session
 * @apiVersion 0.0.1
 * @apiName Login
 * @apiGroup auth
 *
 * @apiParam {String="NORMAL","EMAIL","PROVIDER_GOOGLE","PROVIDER_KAKAO"} [authType="NORMAL"] 인증타입 (기본값 : Normal)
 * @apiParam {String} id                              계정 아이디
 * @apiParam {String} password                        계정 비밀번호
 *
 * @apiSuccess {String} token 엑세스토큰
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "{user_idx}_accessToken"
 *     }
 *
 */
router.post("/session/", async (req, res) => {
  const id = req.body.id === undefined ? req.body.email : req.body.id;
  const password = req.body.password;
  const authType =
    req.body.authType === undefined ? "NORMAL" : req.body.authType; // normal ?
  return await AuthReadService.signIn(authType, id, password)
    .then((sucRs: any) => {
      console.log(sucRs);
      return res.json({
        token: sucRs.accessToken,
      });
    })
    .catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
