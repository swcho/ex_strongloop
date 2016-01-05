
/// <reference path="../express/express.d.ts"/>

declare module Loopback {

  export interface Response extends Express.Response {
    json(opt: any);
  }

  export interface LoopBackApplication extends Express.Application {

    use(path: string, handler: (req: Express.Request, res: Response, next) => void);
  }

  export interface IModel {
  }
}

declare module "loopback" {
  function e(): Loopback.LoopBackApplication;
  export = e;
}
