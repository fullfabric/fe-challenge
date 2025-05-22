const Router = require("@koa/router")

const router = new Router();

router.post("/games", async (ctx) => {
  ctx.body = {
    message: "Hello World"
  }
})

router.get("/games", async (ctx) => {
  ctx.body = {
    message: "Hello World"
  }
})

router.get("/games/:id", async (ctx) => {
  ctx.body = {
    message: "Hello World"
  }
})

router.post("/games/:id/play", async (ctx) => {
  ctx.body = {
    message: "Hello World"
  }
})

router.post("/games/:id/roll", async (ctx) => {
  ctx.body = {
    message: "Hello World"
  }
})

module.exports = router;