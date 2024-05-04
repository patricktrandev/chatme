import express, { Express } from "express";
import { ChatMeServer } from "./server";

class ChatMeApp {
  public initApp(): void {
    const app: Express = express();
    const server: ChatMeServer = new ChatMeServer(app);
    server.start();
  }
}

const chatMeApplication: ChatMeApp = new ChatMeApp();
chatMeApplication.initApp();
