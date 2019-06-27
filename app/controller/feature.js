'use strict';

const Controller = require('egg').Controller;
//const Sequelize = require('sequelize');




class FeatureController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.FeatureCreateValidate = {
      name: { type: 'string', required: true, allowEmpty: false },
    };
    const sequelize = ctx.app.Sequelize;
    console.info('--------------------sequelize')
    //console.info(ctx.app.model);
    // const PaperTrail = require('sequelize-paper-trail').init(ctx.app.model, { userModel: '', debug: true, enableRevisionChangeModel: true, enableCompression: true, enableMigration: true });
    // PaperTrail.defineModels();
    // ctx.model.Feature.Revisions = ctx.model.Feature.hasPaperTrail();

  }


  async index() {
    console.info('index called ----------------------');
    const { ctx } = this;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      search: ctx.query.query || {}
    };
    const res = await ctx.service.feature.list(query);
    ctx.body = res;
  }

  async show() {
    const { ctx } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    ctx.body = await ctx.service.feature.find(id);
  }

  async create() {
    const { ctx, service } = this;
    ctx.validate(this.FeatureCreateValidate);
    const payload = ctx.request.body || {};
    console.info(payload);
    const res = await service.feature.create(payload);
    ctx.body = res;
    ctx.status = 201;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const payload = ctx.request.body || {};
    const res = await service.feature.update(id, payload);
    ctx.body = res;
    ctx.status = 201;
  }

  async destroy() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const res = await service.feature.destroy(id);
    ctx.body = res;
    ctx.status = 204;
  }

  async checkName() {
    const { ctx, service } = this;
    const featureName = ctx.params.feature_name;
    const res = await service.feature.checkName(featureName);
    ctx.body = res;
    ctx.status = 200;
  }

  async getFeaturesByType() {
    const { ctx, service } = this;
    const featureType = ctx.helper.parseInt(ctx.params.f_type);
    const res = await service.feature.getFeaturesByType(featureType);
    ctx.body = res;
    ctx.status = 200;
  }

}

module.exports = FeatureController;
