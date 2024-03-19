import express, { Express } from "express";
import { ChatMeServer } from "./setupServer";
import DBConnection from "../src/setupDB";
import { config } from "./config";
class ApplicationChatMe {
  public initApp(): void {
    this.loadConfig();
    DBConnection();
    const app: Express = express();
    const server: ChatMeServer = new ChatMeServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

//create instance
const application: ApplicationChatMe = new ApplicationChatMe();
application.initApp();
