'use strict';

const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class AttributeController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.AttributeCreateValidate = {
      name: { type: 'string', required: true, allowEmpty: false },
    };
  }
  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      search: ctx.query.query || {}
    };
    const res = await ctx.service.attribute.list(query);
    ctx.body = res;
  }

  async show() {
    const { ctx } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    ctx.body = await ctx.service.attribute.find(id);
  }

  async create() {
    const { ctx, service } = this;
    ctx.validate(this.AttributeCreateValidate);
    const payload = ctx.request.body || {};
    const res = await service.attribute.create(payload);
    ctx.body = res;
    ctx.status = 201;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const payload = ctx.request.body || {};
    const res = await service.attribute.update(id, payload);
    ctx.body = res;
    ctx.status = 201;
  }

  async destroy() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const res = await service.attribute.destroy(id);
    ctx.body = res;
    ctx.status = 204;
  }

  async getAll() {
    const { ctx, service } = this;
    const res = await service.attribute.getAll();
    ctx.body = res;
  }

  async checkName() {
    const { ctx, service } = this;
    const name = ctx.params.name;
    const res = await service.attribute.checkName(name);
    ctx.body = res;
    ctx.status = 200;
  }

  async getByName() {
    const { ctx, service } = this;
    const name = ctx.params.name;
    const res = await service.attribute.getByName(name);
    ctx.body = res;
    ctx.status = 200;
  }
}

module.exports = AttributeController;
