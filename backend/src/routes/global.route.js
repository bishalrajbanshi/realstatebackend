import Router from "express";

const router = Router();

import { generateAccessTokens } from "../controller/global.controller.js";

router.route("/refresh").patch(generateAccessTokens);

export default router;
