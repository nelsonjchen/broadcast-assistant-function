import * as EventEmitter from 'events';
import * as util from 'util';
import * as grpc from 'grpc';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as Storage from '@google-cloud/storage';
import { OAuth2Client } from 'google-auth-library';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { AuthConfig } from './config';

function Auth(config: AuthConfig) {
  const key = require(config.keyFilePath).installed;
  const oauthClient = new OAuth2Client(key.client_id, key.client_secret, key.redirect_uris[0]);
  const storage = Storage();
  let tokens: Credentials;

  const saveTokens = () => {
    oauthClient.setCredentials(tokens);
    this.emit('ready', oauthClient);

    storage.bucket(config.savedTokensBucket).file('tokens.json').createWriteStream().write(JSON.stringify(tokens))
  };

  const getTokens = () => {
    const url = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/assistant-sdk-prototype'],
    });

    // open the URL
    console.log('Attempted to automatically open the URL, but if it failed, copy/paste this in your browser:\n', url);

    // create the interface to accept the code
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    reader.question('Paste your code: ', processTokens);
  };

  const processTokens = (oauthCode) => {
    if (!oauthCode) process.exit(-1);

    // get our tokens to save
    oauthClient.getToken(oauthCode, (error, tkns) => {
      // if we didn't have an error, save the tokens
      if (error) throw new Error('Error getting tokens:' + error);

      tokens = tkns;
      saveTokens();
    });
  };

  // if the tokens are already saved, we can skip having to get the code for now
  process.nextTick(async () => {
    if (config.savedTokensBucket) {
      try {
        const tokensFile = await storage.bucket(config.savedTokensBucket).file('tokens.json').download();
        tokens = JSON.parse(tokensFile.toString());
      } catch (error) {
        // we need to get the tokens
        getTokens();
      } finally {
        if (tokens !== undefined) saveTokens();
      }
    }
  });

}

util.inherits(Auth, EventEmitter);
export default Auth;
