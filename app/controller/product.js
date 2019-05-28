'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.ProductCreateValidate = {
            model_number: { type: 'string', required: true, allowEmpty: false }
        }

    }

    async index() {
        const { ctx } = this;
        const query = {
            limit: ctx.helper.parseInt(ctx.query.limit),
            offset: ctx.helper.parseInt(ctx.query.offset),
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
        const res = await service.product.create(payload);
        ctx.body = res;
        ctx.status = 201;
    }

    async update() {
        const { ctx, service } = this;
        const id = ctx.helper.parseInt(ctx.params.id);
        const payload = ctx.request.body || {};
        const res = await service.product.update(id, payload);
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

}

module.exports = ProductController;
