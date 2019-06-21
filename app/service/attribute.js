'use strict';

const Service = require('egg').Service;

class Attribute extends Service {
  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Attribute.findAndCountAll({
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ['created_at', 'DESC']],
      offset,
      limit,
    });
  }

  async find(id) {
    const { ctx } = this;
    const attribute = await ctx.model.Attribute.findByPk(id);
    // console.info(attribute);
    if (!attribute) {
      ctx.throw(404, 'attribute not found');
    }
    return attribute;
  }

  async create(payload) {
    const { ctx } = this;
    // payload.encrypted_password = await ctx.genHash(payload.password);
    console.info(payload);
    return ctx.model.Attribute.create(payload);
  }

  async update(id, payload) {
    const { ctx } = this;
    const attribute = await ctx.model.Attribute.findByPk(id);
    if (!attribute) {
      ctx.throw(404, 'attribute not found');
    }

    return attribute.update(payload);
  }

  async destroy(id) {
    const { ctx } = this;
    const attribute = await ctx.model.Attribute.findByPk(id);
    if (!attribute) {
      ctx.throw(404, 'attribute not found');
    }
    return attribute.destroy();
  }

  async getAll() {
    console.info('getAll called');
    const { ctx } = this;
    return ctx.model.Attribute.findAll();
  }

}

module.exports = Attribute;
