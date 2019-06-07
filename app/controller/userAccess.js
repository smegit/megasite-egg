'use strict';

const Controller = require('egg').Controller;

class UserAccessController extends Controller {

  constructor(ctx) {
    super(ctx);

    this.UserLoginTransfter = {
      email: { type: 'string', required: true, allowEmpty: false },
      password: { type: 'string', required: true, allowEmpty: false },
    };
  }
  // login
  async login() {
    const { ctx, service } = this;
    // Validate user login details
    ctx.validate(this.UserLoginTransfter);
    const payload = ctx.request.body || {};
    const res = await service.userAccess.login(payload);
    ctx.body = res;
  }
}

module.exports = UserAccessController;
