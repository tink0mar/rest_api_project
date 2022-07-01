declare global {
  namespace NodeJS {
    interface ProcessEnv {
        TOKEN_SECRET: string;
    }
  }
}

export {};