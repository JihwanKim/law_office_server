// config
require("dotenv").config();

import * as express from "express";
import logger from "./logger";
import * as cors from "cors";
import * as helmet from "helmet";
import * as http from "http";
import config from "./config";

// DB
import "reflect-metadata";
import { createConnection, getConnectionOptions, getRepository } from "typeorm";
import { User } from "./entity/User";

// Router
import AuthRouter from "./routes/law_office_routes/auth-router";
import UserLawFirmJoinRouter from "./routes/law_office_routes/user-lawfirm-join-router";
import LawFirmRouter from "./routes/law_office_routes/lawfirm-router";
import LawFirmGroupRouter from "./routes/law_office_routes/lawfirm-group-router";
import LawFirmJoinRouter from "./routes/law_office_routes/lawfirm-join-router";
import LawFirmCustomerRouter from "./routes/law_office_routes/lawfirm-customer-router";
import LawFirmLawCaseRouter from "./routes/law_office_routes/lawfirm-lawcase-router";

import SubAgentRouter from "./routes/subagent_routes/subagent-router";
import SubAgentRequestsRouter from "./routes/subagent_routes/subagent-requests-router";
import SubAgentUserRouter from "./routes/subagent_routes/subagent-user-router";
import SubAgentBoardRouter from "./routes/subagent_routes/subagent-board-router";
import SubAgentBoardReplyRouter from "./routes/subagent_routes/subagent-board-reply-router";

import SubAgentCourtsRouter from "./routes/subagent_routes/subagent-courts-router";

import { LawFirm, LawFirmStatus } from "./entity/LawFirm";



declare global {
  namespace Express {
    interface Request {
      session: {
        user: User;
        lawFirm: LawFirm;
      };
    }
  }
}

const stopServer = async (server: http.Server, signal?: string) => {
  logger.info(`Stopping server with signal: ${signal}`);
  await server.close();
  process.exit();
};

async function authTokenCheker(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (auth && auth.includes("accessTokenSample")) {
    req.session = {};
    const userRepo = getRepository(User);
    req.session.user = await userRepo.findOne({
      relations: ["lawFirm"],
      where: { idx: parseInt(auth.split("_")[0]) },
    });

    if (req.session.user.lawFirm) {
      const lawFirmRepo = getRepository(LawFirm);
      req.session.lawFirm = await lawFirmRepo.findOne({
        relations: ["ownerUser"],
        where: { idx: req.session.user.lawFirm.idx },
      });
    }
    next();
  } else {
    res.status(401).send("invalid_auth");
    return;
  }
}

async function runServer() {
  //options for cors midddleware
  const options: cors.CorsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false,
  };

  const app = express();

  app.use(express.json());
  app.use("/docs", express.static("apidoc"));
  app.use(cors(options));
  app.use(helmet());

  app.use(function (req:any, res: any, next) {
    function afterResponse() {
      res.removeListener("finish", afterResponse);
      res.removeListener("close", afterResponse);

      const logObject = {
        method: req.method,
        authorization: req.headers.authorization,
        hostName: req.hostName,
        originalUrl: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body,
      };

      const requestInfo = {
        req: logObject,
        res: {
          statusCode: res.statusCode,
          body: res.statusCode > 400 ? res.body : {},
        },
      };

      logger.info(JSON.stringify(requestInfo));
    }
    res.on("finish", afterResponse);
    res.on("close", afterResponse);

    // action before request
    // eventually calling `next()`
    next();
  });

  app.use("/v1/auths", AuthRouter);
  app.use(authTokenCheker);

  app.use("/v1/lawfirms/customers", LawFirmCustomerRouter);
  app.use("/v1/lawfirms/lawcases", LawFirmLawCaseRouter);
  app.use("/v1/lawfirms/joins", LawFirmJoinRouter);
  app.use("/v1/lawfirms/groups", LawFirmGroupRouter);
  app.use("/v1/lawfirms", LawFirmRouter);

  app.use("/v1/users/lawfirms/joins", UserLawFirmJoinRouter);
  
  app.use("/subagent/v1/courts", SubAgentCourtsRouter);

  app.use("/subagent/v1/subagents", SubAgentRouter);
  app.use("/subagent/v1/subagents", SubAgentRequestsRouter);
  app.use("/subagent/v1/users", SubAgentUserRouter);
  app.use("/subagent/v1/boards", SubAgentBoardReplyRouter);
  app.use("/subagent/v1/boards", SubAgentBoardRouter);

  const server = app.listen(config.server.port, () => {
    console.log("Law Office Server Start!");
  });
  try {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    await createConnection({ ...connectionOptions, name: "default" });

    //임시 로펌 생성 코드
    const lawFirmRepo = getRepository(LawFirm);
    if (!(await lawFirmRepo.findOne({ idx: 1 }))) {
      const lawFirm = new LawFirm();
      lawFirm.name = "test";
      lawFirm.status = LawFirmStatus.DEFAULT;
      lawFirm.joinCode = "testJoinCode";
      lawFirm.telephone = "810123412341234";
      lawFirm.address = "test address";

      lawFirmRepo.save(lawFirm);
    }
  } catch (e) {
    console.log("server exeption e!", e);
    stopServer(server);
    throw e;
  }
}

runServer()
  .then(() => {
    logger.info("run succesfully");
  })
  .catch((ex: Error) => {
    logger.error("Unable run:", ex);
  });
