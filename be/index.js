const Koa = require('koa');
const { koaBody } = require('koa-body');
const Router = require("@koa/router")

const app = new Koa();
const router = new Router();

// Basic logging
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// Body parsing
app.use(koaBody());

// Simple route
app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);