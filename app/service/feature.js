'use strict';

const Service = require('egg').Service;

class Feature extends Service {
  async list({ offset = 0, limit = 10, search = {} }) {
    search = JSON.parse(search);
    console.info(search);
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    return ctx.model.Feature.findAndCountAll({
      where: {
        ...search.name && { name: { [Op.iLike]: `%${search.name}%` } }
      },
      offset,
      limit,
      order: [['created_at', 'desc']],
    });
  }

  async find(id) {
    const { ctx } = this;
    const feature = await ctx.model.Feature.findByPk(id);
    // console.info(user);
    if (!feature) {
      ctx.throw(404, 'feature not found');
    }
    return feature;
  }

  async create(payload) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    console.info(payload);
    return ctx.model.Feature.create(payload, { userId: userId });
  }

  async update(id, payload) {
    const { ctx } = this;
    const token = ctx.helper.getAccessToken(ctx);
    const userId = await ctx.helper.getUserByToken(ctx);
    console.info(token);
    console.info(userId);
    const feature = await ctx.model.Feature.findByPk(id);
    if (!feature) {
      ctx.throw(404, 'feature not found');
    }

    return feature.update(payload, { userId: userId });
  }

  async destroy(id) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const feature = await ctx.model.Feature.findByPk(id);
    if (!feature) {
      ctx.throw(404, 'feature not found');
    }
    return feature.destroy({ userId: userId });
  }

  async checkName(name) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    const feature = await ctx.model.Feature.findOne({
      where: {
        name: {
          [Op.iLike]: `${name}`
        }
      }
    });
    if (feature) {
      ctx.throw(422, `Feature Name ${name} already exists`);
    }
    return {
      success: "true",
    }
  }
  async getFeaturesByType(featureType) {
    const { ctx } = this;
    const features = await ctx.model.Feature.findAll({
      where: {
        //feature_type: featureType
      },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    if (!features) {
      ctx.throw(404, 'features not found');
    }
    return features;
  }
}

module.exports = Feature;
