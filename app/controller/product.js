'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ProductCreateValidate = {
      model_number: { type: 'string', required: true, allowEmpty: false },
    };

  }

  async index() {
    console.info('index called ----------------------');
    const { ctx } = this;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      search: ctx.query.query || {}
    };
    const res = await ctx.service.product.list(query);
    ctx.body = res;
  }

  async show() {
    const { ctx } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    ctx.body = await ctx.service.product.find(id);
  }

  async create() {
    const { ctx, service } = this;
    ctx.validate(this.ProductCreateValidate);
    const payload = ctx.request.body || {};
    payload.data = JSON.parse(payload.data);
    const files = ctx.request.files || [];
    //console.info(payload);
    const res = await service.product.create(payload, files);
    ctx.body = res;
    ctx.status = 201;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const payload = ctx.request.body || {};
    payload.data = JSON.parse(payload.data);
    const files = ctx.request.files || [];
    const res = await service.product.update(id, payload, files);
    ctx.body = res;
    ctx.status = 201;
  }

  async destroy() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const res = await service.product.destroy(id);
    ctx.body = res;
    ctx.status = 204;
  }

  async findItsApproval() {
    console.info('findItsApproval called');
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const product = await ctx.model.Product.findByPk(id);
    console.info(product);
    const res = await product.getApprovals();
    ctx.body = res;

  }

  async deleteItsAttachment() {
    console.info('deleteItsAttachment called');
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const attachment_id = ctx.helper.parseInt(ctx.params.a_id);
    const res = await service.product.deleteItsAttachment(id, attachment_id);
    ctx.body = res;
    ctx.status = 204;
  }

  async checkModel() {
    const { ctx, service } = this;
    const model_number = ctx.params.model_number;
    const res = await service.product.checkModel(model_number);
    ctx.body = res;
    ctx.status = 200;
  }

  async getAll() {
    const { ctx, service } = this;
    const res = await service.product.getAll();
    ctx.body = res;
    ctx.status = 200;
  }

  // async moveCoverImageToAttachment() {
  //   const { ctx, service } = this;
  //   const res = await service.product.moveCoverImageToAttachment();
  //   ctx.body = res;
  //   ctx.status = 200;
  // }
}

module.exports = ProductController;
