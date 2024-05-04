import express, { Express } from "express";
import { ChatMeServer } from "./server";
import DBConnection from "./connectDB";
import { config } from "./config";
class ChatMeApp {
  public initApp(): void {
    this.loadConfig();
    DBConnection();
    const app: Express = express();
    const server: ChatMeServer = new ChatMeServer(app);
    server.start();
  }
  private loadConfig() {
    config.validateConfig();
  }
}

const chatMeApplication: ChatMeApp = new ChatMeApp();
chatMeApplication.initApp();
