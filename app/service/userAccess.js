'use strict';

const Service = require('egg').Service;

class UserAccessService extends Service {

  // login
  async login(payload) {
    const { ctx, service } = this;
    const user = await service.user.findByEmail(payload.email);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    const verifyPsw = await ctx.compare(payload.password, user.encrypted_password);
    if (!verifyPsw) {
      ctx.throw(401, 'wrong password');
    }
    return {
      token: await ctx.app.jwt.sign({
        data: {
          _id: user.email,
          userId: user.id
        },
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
      }, ctx.app.config.jwt.secret),
    };

  }
}

module.exports = UserAccessService;

