import HTTP_STATUS from "http-status-codes";
import {
  Application,
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";
import cookieSession = require("cookie-session");
import hpp = require("hpp");
import Logger = require("bunyan");
import helmet from "helmet";
import cors = require("cors");
import compression = require("compression");
import http from "http";
import { config } from "./config";
import ApplicationRoutes from "../src/routes";
import {
  CustomError,
  IErrorResponse,
} from "./shared/globals/helpers/errorHandler";
const SERVER_PORT = 5000;
const logger: Logger = config.createLoggerConfig("server");

export class ChatMeServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.standardMiddleware(this.app);
    this.securityMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorhandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    //set up cookie
    app.use(
      cookieSession({
        name: "chatmesession",
        keys: [config.SECRET_KEY_ONE!, "test2"],
        maxAge: 24 * 3 * 3600000,
        secure: config.NODE_ENV !== "development",
      })
    );
    //set up hpp
    app.use(hpp());
    //set up helmet
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (err) {
      console.log(err);
    }
  }
  private routesMiddleware(app: Application): void {
    ApplicationRoutes(app);
  }

  private globalErrorhandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: `${req.originalUrl} not found.`,
      });
    });
    app.use(
      (
        error: IErrorResponse,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        logger.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeError());
        }
        next();
      }
    );
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Server running on port ${SERVER_PORT}`);
    });
  }
}
