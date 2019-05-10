'use strict';

const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.UserCreateValidate = {
      firstname: { type: 'string', required: true, allowEmpty: false },
      surname: { type: 'string', required: true, allowEmpty: false },
      email: { type: 'string', required: true, allowEmpty: false },
      password: { type: 'password', required: true, allowEmpty: false },
    }
  }
  async index() {
    const ctx = this.ctx;
    const query =  {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    const res = await ctx.service.user.list(query);
    ctx.body = res;
  }

  async show() {
    const { ctx } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    ctx.body =  await ctx.service.user.find(id);
  }

  async create() {
    const { ctx, service } = this;
    ctx.validate(this.UserCreateValidate);
    const payload = ctx.request.body || {};
    const res = await service.user.create(payload);
    ctx.body = res;
    ctx.status = 201;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const payload = ctx.request.body || {};
    const res = await service.user.update(id, payload);
    ctx.body = res;
    ctx.status = 201;
  }

  async destroy() {
    const { ctx } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const res = await service.user.destroy(id);
    ctx.body = res;
    ctx.status = 204;
  }
}

module.exports = UserController;
