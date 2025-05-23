function existsOr404(ctx, instance) {
  if (!instance) {
    ctx.throw(404, 'Model not found')
  }
}

module.exports = {
  existsOr404
}
