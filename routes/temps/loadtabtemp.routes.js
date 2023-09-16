import express  from "express";
import { loadtemptable } from "../../controllers/temps/loadtabtemp.controller.js";
export const router=express.Router();

router.get('/cargartabtemp',loadtemptable);