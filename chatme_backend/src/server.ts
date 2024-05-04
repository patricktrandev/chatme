import { Application, json, urlencoded } from "express";
import "express-async-errors";
import http from "http";
import cookieSession from "cookie-session";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { config } from "./config";
import applicationRoutes from "./routes";
export class ChatMeServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 72 * 60 * 60 * 1000, // 72 hours
        secure: config.NODE_ENV !== "development",
      })
    );
    app.use(hpp());
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
    app.use(
      json({
        limit: "50mb",
      })
    );
    app.use(
      urlencoded({
        extended: true,
        limit: "50mb",
      })
    );
  }
  private routesMiddleware(app: Application) {
    applicationRoutes(app);
  }
  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(Number(`${config.PORT}`), () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (err) {
      console.log(err);
    }
  }
}
