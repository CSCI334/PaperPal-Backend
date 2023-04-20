import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";

import { STATUS_CODE } from "../../constants/HttpConstants.js";
import { authenticated } from "../../middleware/Authenticated.js";

@controller("/dummy")
export default class DummyController{

}