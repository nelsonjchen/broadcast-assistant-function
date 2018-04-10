export interface AuthConfig {
  keyFilePath: string,
  savedTokensBucket: string,
}

export interface Config {
  auth: AuthConfig
}
