import { Application, json, urlencoded } from "express";
import cookieSession = require("cookie-session");
import hpp = require("hpp");
import helmet from "helmet";
import cors = require("cors");
import compression = require("compression");
import http from "http";
import { config } from "./config";
import ApplicationRoutes from "../src/routes";
const SERVER_PORT = 5000;

export class ChatMeServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.standardMiddleware(this.app);
    this.securityMiddleware(this.app);
    this.routesMiddleware(this.app);
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

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  }
}
