import * as express from "express";
import { nextTick } from "process";
import { LawFirm } from "../../entity/LawFirm";
import { User } from "../../entity/User";
import logger from "../../logger";
import * as SubAgentUserService from "../../service/subagent_service/subagent-user-service";

const router = express.Router();

/**
 * @apiDescription 법원 목록 조회 API
 * @api {get} /subagent/v1/courts
 * @apiVersion 0.0.1
 * @apiName getCourts
 * @apiGroup subagent/court
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiSuccess {Object} user 유저 정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
  }
 * 
 */
router.get("/:userIdx?", async (req, res) => {
  // const user: User = req.session.user;
  // const userIdx = req.params.userIdx ? parseInt(req.params.userIdx) : user.idx;
  ;
  res.download("./court_list.json"); // Set disposition and send it.
});


export default router;
