import { Request, Response } from "express";
import GoogleAssistant from './assistant';
import * as path from 'path';

export function broadcastMessage(req: Request, res: Response) {
  const config = {
    auth: {
      keyFilePath: path.resolve(__dirname, 'credentials.json'),
      savedTokensBucket: 'broadcast-assistant-37619.appspot.com',
    }
  };
  console.log(req)

  const assistant = new GoogleAssistant(config.auth);

  res
      .status(200)
      .type("application/json")
      .send("{ \"result\": \"Hello World!\"}")
      .end()
}
