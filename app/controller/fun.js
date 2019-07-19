'use strict';

const Controller = require('egg').Controller;

class FunController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.FunctionCreateValidate = {
      function_code: { type: 'string', required: true, allowEmpty: false },
      description: { type: 'string', required: true, allowEmpty: false },
    };
  }

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    const res = await ctx.service.fun.list(query);
    ctx.body = res;
  }

  async show() {
    const { ctx } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    ctx.body = await ctx.service.fun.find(id);
  }

  // Maybe contain icon
  async create() {
    const { ctx, service } = this;
    ctx.validate(this.FunctionCreateValidate);
    const payload = ctx.request.body || {};
    const files = ctx.request.files || [];
    const res = await service.fun.create(payload, files);
    ctx.body = res;
    ctx.status = 201;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const payload = ctx.request.body || {};
    const files = ctx.request.files || [];
    const res = await service.fun.update(id, payload, files);
    ctx.body = res;
    ctx.status = 201;
  }

  async destroy() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const res = await service.fun.destroy(id);
    ctx.body = res;
    ctx.status = 204;
  }

  async checkFunCode() {
    const { ctx, service } = this;
    const funCode = ctx.params.fun_code;
    const res = await service.fun.checkFunCode(funCode);
    ctx.body = res;
    ctx.status = 200;
  }
}

module.exports = FunController;
