import dotenv from "dotenv";
import bunyan from "bunyan";
dotenv.config({});
class ConfigChatMe {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public PORT: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || this.JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV || this.NODE_ENV;
    this.PORT = process.env.PORT || "5001";
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || this.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || this.SECRET_KEY_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL || this.CLIENT_URL;
  }
  //   public createLoggerConfig(name: string): bunyan {
  //     return bunyan.createLogger({
  //       name,
  //       level: "debug",
  //     });
  //   }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined. `);
      }
    }
  }
}

export const config: ConfigChatMe = new ConfigChatMe();
