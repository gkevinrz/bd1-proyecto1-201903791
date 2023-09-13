import express  from "express";


export const indexRouter=express.Router();


indexRouter.get("/",(request,response)=>{

    const main={title:"Proyecto 1",body:  " Sistema de bases de datos 1"};
    response.json(main);
})


