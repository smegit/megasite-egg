'use strict';

const Controller = require('egg').Controller;

class ApprovalController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.ApprovalCreateValidate = {
            approval_no: { type: 'string', required: true, allowEmpty: false }
        }
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
        const { ctx, service } =  this;
        const id = ctx.helper.parseInt(ctx.params.id);
        ctx.body = await service.approval.find(id);
    }

    async create() {
        const { ctx, service } = this;
        ctx.validate(this.ApprovalCreateValidate);
        const payload =  ctx.request.body || {};
        const res = await service.approval.create(payload);
        ctx.body = res;
        ctx.status = 201;
    }

    async update() {
        const { ctx, service } = this;
        const id = ctx.helper.parseInt(ctx.params.id);
        const payload = ctx.request.body || {};
        const res =  await service.approval.update(id, payload);
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
    
}

module.exports = ApprovalController;