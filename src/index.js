import express from 'express'
import config from 'config'
import {indexRouter} from '../routes/index.js'
import {router as tablemodelRouter} from '../routes/rmodels/tablemodels.routes.js'
import {router as tabletempRouter} from '../routes/temps/loadtabtemp.routes.js'
//import {query} from '../utils/dbconnection.js'

const app=express();


//Configuration
const port=config.get("server.port");

//Routers

app.use("/",indexRouter); /* Index */

// Temps 
app.use("/temp",tabletempRouter);

//models
app.use("/model",tablemodelRouter);

// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// });



app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that! :(');
});




//query('xd');
app.listen(port);

