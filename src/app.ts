import express, { Express } from "express";
import { ChatMeServer } from "./setupServer";

class ApplicationChatMe {
  public initApp(): void {
    const app: Express = express();
    const server: ChatMeServer = new ChatMeServer(app);
    server.start();
  }
}

//create instance
const application: ApplicationChatMe = new ApplicationChatMe();
application.initApp();
