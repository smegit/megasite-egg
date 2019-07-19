'use strict';

module.exports = {
  parseInt(string) {
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  },
  success({ ctx, res = null, msg = 'success' }) {
    ctx.body = {
      code: 0,
      data: res,
      msg,
    };
    ctx.status = 200;
  },
  getAccessToken(ctx) {
    //console.info(ctx);
    let bearerToken = ctx.request.header.authorization;
    return bearerToken && bearerToken.replace("Bearer ", "");
  },
  async getUserByToken(ctx) {
    let token = this.getAccessToken(ctx);
    let decoded;
    try {
      decoded = await ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    } catch (error) {
      console.info(error);
    }
    return decoded.data.userId;
  }
};
