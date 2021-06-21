import * as express from "express";
import * as CustomerService from "../../service/law_office_service/customer-service";
import * as CustomerReadService from "../../service/law_office_service/customer-read-service";
import logger from "../../logger";
import { Customer } from "../../entity/Customer";

const router = express.Router();

/**
 * @apiDescription 고객등록 API
 * @api {post} /v1/lawfirms/customers
 * @apiVersion 0.0.1
 * @apiName createCustomer
 * @apiGroup lawfirm/customer
 * 
 * @apiParamExample {json} Request-Example:
 * {
      "name":"test customer",
      "phoneNumber":"82121341234",
      "sex":"MALE",
      "country":"대한민국",
      "email":"test@test.com",
      "birthday":"2020-10-11",
      "age":1,
      "description":"고객님",
      "reverse":true
    }
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String} name                              고객 이름
 * @apiParam {String} phoneNumber                       고객 핸드폰번호
 * @apiParam {String=["MALE","FEMAIL"]} sex             고객 성별
 * @apiParam {String} country                           고객 국적
 * @apiParam {String} email                             고객 이메일
 * @apiParam {String} birthday                          고객 생일
 * @apiParam {String} description                       고객 설명
 * 
 * @apiSuccess {Object} customer 고객정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
        "token": {
          "name": "test customer",
          "email": "test@test.com",
          "birthday": "2020-10-11",
          "phoneNumber": "82121341234",
          "age": 1,
          "sex": "MALE",
          "country": "대한민국",
          "description": "고객님",
          "lawFirm": {
              "idx": 1,
              "status": "DEFAULT",
              "name": "test",
              "joinCode": "",
              "telephone": "810123412341234",
              "address": "test address",
              "createTime": "2020-11-11T14:00:46.646Z",
              "updateTime": "2020-11-11T14:00:47.225Z"
          },
          "idx": 1,
          "createTime": "2020-11-13T13:03:07.553Z",
          "updateTime": "2020-11-13T13:03:07.553Z",
          "lastConsultingDate": "2020-11-13T13:03:07.000Z"
        },
      }
 * 
 */
router.post("/", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber; //
  const sex = req.body.sex; // MALE OR FEMALE
  const country = req.body.country;
  const email = req.body.email;
  const birthday = req.body.birthday;
  const description = req.body.description;
  return await CustomerService.newCustomer(
    lawFirm,
    name,
    phoneNumber,
    sex,
    country,
    email,
    birthday,
    description,
  ).then((sucOK: any) => {
    logger.info(
      `new customer insert! lawFirm:${lawFirm} user:${user} customer:${sucOK.customer}`,
    );
    return res.json({
      token: sucOK.customer,
    });
  }).catch(
    (err: any) => {
      console.log("고객등록 실패!", err);
      return res.json({
        token: err,
      });
    },
  );
});

/**
 * @apiDescription 고객정보 업데이트 API
 * @api {put} /v1/lawfirms/customers/:customerIdx
 * @apiVersion 0.0.1
 * @apiName updateCustomer
 * @apiGroup lawfirm/customer
 * 
 * @apiParamExample {json} Request-Example:
 * {
      "name":"test customer",
      "phoneNumber":"82121341234",
      "sex":"MALE",
      "country":"대한민국",
      "email":"test@test.com",
      "birthday":"2020-10-11",
      "age":1,
      "description":"고객님",
      "reverse":true
    }
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String} name                              고객 이름
 * @apiParam {String} phoneNumber                       고객 핸드폰번호
 * @apiParam {String=["MALE","FEMAIL"]} sex             고객 성별
 * @apiParam {String} country                           고객 국적
 * @apiParam {String} email                             고객 이메일
 * @apiParam {String} birthday                          고객 생일
 * @apiParam {String} description                       고객 설명
 * 
 * @apiSuccess {Object} customer 고객정보
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
        "token": {
          "name": "test customer",
          "email": "test@test.com",
          "birthday": "2020-10-11",
          "phoneNumber": "82121341234",
          "age": 1,
          "sex": "MALE",
          "country": "대한민국",
          "description": "고객님",
          "lawFirm": {
              "idx": 1,
              "status": "DEFAULT",
              "name": "test",
              "joinCode": "",
              "telephone": "810123412341234",
              "address": "test address",
              "createTime": "2020-11-11T14:00:46.646Z",
              "updateTime": "2020-11-11T14:00:47.225Z"
          },
          "idx": 1,
          "createTime": "2020-11-13T13:03:07.553Z",
          "updateTime": "2020-11-13T13:03:07.553Z",
          "lastConsultingDate": "2020-11-13T13:03:07.000Z"
        },
      }
 * 
 */
router.put("/:customerIdx", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const customerIdx = parseInt(req.params.customerIdx);
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber; //
  const sex = req.body.sex; // MALE OR FEMALE
  const country = req.body.country;
  const email = req.body.email;
  const birthday = req.body.birthday;
  const description = req.body.description;
  return await CustomerService.updateCustomer(
    lawFirm,
    customerIdx,
    name,
    phoneNumber,
    sex,
    country,
    email,
    birthday,
    description,
  ).then((sucOK: any) => {
    logger.info(
      `new customer insert! lawFirm:${lawFirm} user:${user} customer:${sucOK.customer}`,
    );
    return res.json({
      customer: sucOK.customer,
    });
  }).catch(
    (err: any) => {
      console.log("고객등록 실패!", err);
      return res.json({
        msg: "고객 정보 수정에 실패하였습니다.",
      });
    },
  );
});

/**
 * @apiDescription 조건부 고객 목록 조회 API
 * @api {get} /v1/lawfirms/customers/:type/:targetItem?
 * @apiVersion 0.0.1
 * @apiName getCustomer
 * @apiGroup lawfirm/customer
 * @apiExample {curl} 기본 목록 조회:
 *     curl -i http://localhost:5000/customers
 * @apiExample {curl} 검색 목록 조회:
 *     curl -i http://localhost:5000/customers/birthday/2020-10-11?reverse=true&order=idx
 * 
 * @apiHeader {String} Authorization AccesssToken
 * 
 * @apiParam {String=["idx","phoneNumber","birthday"]} [type] 검색 조건 타입
 * @apiParam {String} [targetItem] 대상값
 * @apiParam {Number} [page=0] [QueryString]페이지네이션값
 * @apiParam {String=["idx","lastConsultingDate"]} [order=idx] [QueryString]정렬 순서
 * @apiParam {Boolean} [reverse=false] [QueryString]역정렬 여부
 * @apiParam {Number} [limit=200] [QueryString]한번에 가져올 데이터 개수
 * 
 * 
 * 
 * @apiSuccess {Array} customers 고객정보 복록
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
    "customers": [
        {
            "idx": 1,
            "name": "test customer",
            "email": "test@test.com",
            "birthday": "2020-10-11",
            "phoneNumber": "82121341234",
            "age": 1,
            "sex": "MALE",
            "country": "대한민국",
            "description": "고객님",
            "createTime": "2020-11-13T13:03:07.553Z",
            "updateTime": "2020-11-13T13:03:07.553Z",
            "lastConsultingDate": "2020-11-13T13:03:07.000Z",
            "consultings": []
        }
    ]
}
 * 
 */
router.get("/:type?/:targetItem?", async (req, res) => {
  const user = req.session.user;
  const lawFirm = req.session.lawFirm;
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const orderBy = req.query.order ? req.query.order.toString() : "idx"; // idx, lastConsultingDate
  const reverse = req.query.reverse
    ? req.query.reverse.toString() == "true"
    : false;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 200;

  const type = (req.params.type);
  const targetItem = req.params.targetItem;
  return await CustomerReadService.readAllCustomer(
    lawFirm,
    page,
    orderBy,
    reverse,
    limit,
    type,
    targetItem,
  )
    .then(
      (okRes: any) => {
        return res.status(200).json({
          customers: okRes.customers,
        });
      },
    ).catch(
      (err: any) => {
        return res.json({
          reason: err.error,
        });
      },
    );
});

export default router;
