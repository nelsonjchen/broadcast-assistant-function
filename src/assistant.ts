import * as EventEmitter from 'events';
import * as util from 'util';

import * as Assistant from 'google-assistant/components/assistant';
// Use internal Auth
import Auth from './auth';
import * as Conversation from 'google-assistant/components/conversation';

export default class GoogleAssistant extends EventEmitter {
  assistant: any;

  constructor(authConfig, callback?) {
    super()
    if (authConfig === undefined) {
      const error = new Error('Missing auth config object!');
      this.emit('error', error);
      if (callback) callback(error);
      return;
    }
    // we need to auth with Google right out of the gate
    const auth = new Auth(authConfig);

    auth.on('ready', (client) => {
      this.assistant = new Assistant(client);
      this.emit('ready', this.assistant);
      if (callback) callback(this.assistant);
    });
  }

  start(conversationConfig, callback) {
    if (this.assistant === undefined) {
      const error = new Error('Tried calling start() before the ready event!');
      this.emit('error', error);
      if (callback) callback(error);
      return;
    }

    const conversation = new Conversation(this.assistant, conversationConfig);
    this.emit('started', conversation);
    if (callback) callback(conversation);
  }
};
