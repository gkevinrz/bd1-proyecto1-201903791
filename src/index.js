import express from 'express'
import config from 'config'

import {indexRouter} from '../routes/index.js'

const app=express();
 //Configuration
const port=config.get("server.port");
const host=config.get("server.host"); 

//Routers

app.use("/",indexRouter);


//app use 




app.listen(port);

