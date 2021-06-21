import * as express from "express";
import * as ConsultingService from "../../service/law_office_service/consulting-service";
import * as ConsultingReadService from "../../service/law_office_service/consulting-read-service";
const router = express.Router();

/**
 * @apiDescription 컨설팅 등록 API
 * @api {post} /v1/consultings/customers/:customerIdx
 * @apiVersion 0.0.1
 * @apiName createConsulting
 * @apiGroup consulting
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {Number} customerIdx 고객의 인덱스
 * @apiParam {String} title 상담 제목
 * @apiParam {String} content 상담 내용
 * @apiParam {String=["text","json"]} [contentFormat="text"] 상담 내용 포맷
 * @apiParam {String} [uniqueness] 특이사항
 * 
 * 
 * 
 * @apiSuccess {Object} consulting 상담 데이터
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
  {
    "consulting":{}
  }
 * 
 */
router.post("/customers/:customerIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const customerIdx = parseInt(req.params.customerIdx);
  const title = req.body.title;
  const contentFormat = req.body.contentFormat;
  const content = req.body.content;
  const uniqueness = req.body.uniqueness;

  return await ConsultingService.newConsulting(
    user,
    lawFirm,
    customerIdx,
    title,
    contentFormat,
    content,
    uniqueness,
  )
    .then(
      (sucRs: any) => {
        console.log(sucRs);
        return res.json({
          token: sucRs.consulting,
        });
      },
    ).catch((err: any) => {
      return res.status(400).json({
        error: err.error,
      });
    });
});

export default router;
