import express  from "express";
import { crearModelo } from "../../controllers/cmodels/tablemodels.controller.js";
import { eliminarModelo } from "../../controllers/cmodels/tablemodels.controller.js";
export const router=express.Router();


router.get('/crearmodelo',crearModelo);

router.get('/eliminarmodelo',eliminarModelo);