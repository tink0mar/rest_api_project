import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes/index';
import { bearerToken } from 'koa-bearer-token';
import { errorHandler } from './middlewares/error';
import Knex from 'knex';
import knexConfig from './knexfile';
import { Model } from 'objection';

const knex = Knex(knexConfig.development)

Model.knex(knex)

const app:Koa = new Koa();

app.use(bodyParser());
app.use(bearerToken());
app.use(errorHandler);
app.use(router.routes());
app.listen(3000, function(){
    console.log("Everything Okay");
});

export default app;