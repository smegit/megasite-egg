'use strict';

const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Controller = require('egg').Controller;

class ApprovalController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ApprovalCreateValidate = {
      approval_no: { type: 'string', required: true, allowEmpty: false },
    };
  }

  async index() {
    const { ctx, service } = this;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };
    const res = await service.approval.list(query);
    ctx.body = res;
  }

  async show() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    ctx.body = await service.approval.find(id);
  }

  async create() {
    const { ctx, service } = this;
    // ctx.validate(this.ApprovalCreateValidate);
    const payload = ctx.request.body || {};
    const files = ctx.request.files || [];
    // console.info(payload);
    // console.info(files);

    // call service
    const res = await service.approval.create(payload, files);
    ctx.body = res;
    ctx.status = 201;
  }

  async update() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const payload = ctx.request.body || {};
    const files = ctx.request.files || [];
    const res = await service.approval.update(id, payload, files);
    // console.info(payload);
    ctx.body = res;
    ctx.status = 201;
  }

  async destroy() {
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const res = await service.approval.destroy(id);
    ctx.body = res;
    ctx.status = 204;
  }
  // get associated products
  async findItsProduct() {
    console.info('findItsProduct called');
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const approval = await ctx.model.Approval.findByPk(id);
    console.info(approval);
    const res = await approval.getProducts();
    ctx.body = res;

  }
  // get associated attachments
  async findItsAttachment() {
    console.info('findItsAttachment called');
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const approval = await ctx.model.Approval.findByPk(id);
    // const attachments = await approval.getAttachment();
    console.info(approval);
    const attachment = await approval.getAttachment({
      attributes: ['id', 'type', 'url', ['attachment', 'name'], 'uid'],
      through: { attributes: [] },
    });
    ctx.body = attachment;
  }

  // delete associated attachment
  async deleteItsAttachment() {
    console.info('deleteItsAttachment called');
    const { ctx, service } = this;
    const id = ctx.helper.parseInt(ctx.params.id);
    const attachment_id = ctx.helper.parseInt(ctx.params.a_id);
    const res = await service.approval.deleteItsAttachment(id, attachment_id);
    ctx.body = res;
    ctx.status = 204;
    // console.info(ctx.params);
  }

  // get all approval
  async getAll() {
    console.info('getAll called');
    const { ctx, service } = this;
    const res = await service.approval.getAll();
    ctx.body = res;
    ctx.status = 200;
  }

}

module.exports = ApprovalController;
