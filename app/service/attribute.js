'use strict';

const Service = require('egg').Service;

class Attribute extends Service {
  async list({ offset = 0, limit = 10, search = {} }) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    search = JSON.parse(search);
    return this.ctx.model.Attribute.findAndCountAll({
      where: {
        ...search.name && { name: { [Op.iLike]: `%${search.name}%` } }
      },
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
    const userId = await ctx.helper.getUserByToken(ctx);
    // payload.encrypted_password = await ctx.genHash(payload.password);
    console.info(payload);
    return ctx.model.Attribute.create(payload, { userId: userId });
  }

  async update(id, payload) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const attribute = await ctx.model.Attribute.findByPk(id);
    if (!attribute) {
      ctx.throw(404, 'attribute not found');
    }

    return attribute.update(payload, { userId: userId });
  }

  async destroy(id) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const attribute = await ctx.model.Attribute.findByPk(id);
    if (!attribute) {
      ctx.throw(404, 'attribute not found');
    }
    return attribute.destroy({ userId: userId });
  }

  async getAll() {
    console.info('getAll called');
    const { ctx } = this;
    return ctx.model.Attribute.findAll();
  }

  async checkName(name) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    const attribute = await ctx.model.Attribute.findOne({
      where: {
        name: {
          [Op.iLike]: `${name}`
        }
      },
    });
    if (attribute) {
      ctx.throw(422, `${name} already exist.`);
    }
    return {
      success: true,
    }
  }

  async getByName(name) {
    const { ctx } = this;
    const attribute = await ctx.model.Attribute.findOne({
      where: {
        name: name
      }
    });
    if (!attribute) {
      ctx.throw(404, `attribute ${name} not found`);
    }
    return attribute;
  }

  async getSeqGroupList() {
    const { ctx } = this;
    const sequelize = ctx.model;
    return sequelize.query('select distinct seq_group from attributes;')
  }

}

module.exports = Attribute;
