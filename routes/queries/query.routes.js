import express  from "express";
import { query1,query2,query3,query4,query5,query6,query7,query8} from "../../controllers/queries/queries.controller.js";


export const router=express.Router();



router.get('/consulta1',query1);
router.get('/consulta2',query2);
router.get('/consulta3',query3);
router.get('/consulta4',query4);
router.get('/consulta5',query5);
router.get('/consulta6',query6);
router.get('/consulta7',query7);
router.get('/consulta8',query8);
