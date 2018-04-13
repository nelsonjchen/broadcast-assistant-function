import { Request, Response } from "express";
import GoogleAssistant from './assistant';
import * as path from 'path';

const startConversation = (conversation) => {
  // setup the conversation
  conversation
    .on('response', text => console.log('Assistant Response:', text))
    // if we've requested a volume level change, get the percentage of the new level
    .on('volume-percent', percent => console.log('New Volume Percent:', percent))
    // the device needs to complete an action
    .on('device-action', action => console.log('Device Action:', action))
    // once the conversation is ended, see if we need to follow up
    .on('ended', (error, continueConversation) => {
      if (error) {
        console.log('Conversation Ended Error:', error);
      } else if (continueConversation) {
        console.log('Conversation Continued? Bye anyway.', error);
        conversation.end();
      } else {
        console.log('Conversation Complete');
        conversation.end();
      }
    })
    // catch any errors
    .on('error', (error) => {
      console.log('Conversation Error:', error);
    });
};

export function broadcastMessage(req: Request, res: Response) {
  const config = {
    auth: {
      keyFilePath: path.resolve(__dirname, 'credentials.json'),
      savedTokensBucket: 'broadcast-assistant-37619.appspot.com',
    }
  };

  const assistant = new GoogleAssistant(config.auth);
  assistant
    .on('ready', () => {
      assistant.start(
        {
          lang: 'en-US', // defaults to en-US, but try other ones, it's fun!
          textQuery: 'broadcast Hello World!'
        },
        startConversation
      )
    })

  res
    .status(200)
    .type("application/json")
    .send("{ \"result\": \"Hello World!\"}")
    .end()
}
