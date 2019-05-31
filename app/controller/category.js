'use strict';

const Controller = require('egg').Controller;
class CategoryController extends Controller {

    async index() {
        const { ctx } = this;
        const query = {
            limit: ctx.helper.parseInt(ctx.query.limit),
            offset: ctx.helper.parseInt(ctx.query.offset),
        };
        const res = await ctx.service.category.list(query);
        ctx.body = res;
    }

    async show() {
        const { ctx } = this;
        const id = ctx.helper.parseInt(ctx.params.id);
        ctx.body = await ctx.service.category.find(id);
    }

    async create() {
        console.info('create called');
        const { ctx, service } = this;
        //ctx.validate(this.ProductCreateValidate);
        const payload = ctx.request.body || {};
        const files = ctx.request.files || [];
        console.info(payload);
        const res = await ctx.service.category.create(payload, files);
        ctx.body = res;
        ctx.status = 201;
    }

    async update() {
        const { ctx, service } = this;
        const id = ctx.helper.parseInt(ctx.params.id);
        const payload = ctx.request.body || {};
        const files = ctx.request.files || [];
        const res = await service.category.update(id, payload, files);
        ctx.body = res;
        ctx.status = 201;
    }

    async destroy() {
        const { ctx, service } = this;
        const id = ctx.helper.parseInt(ctx.params.id);
        const res = await service.category.destroy(id);
        ctx.body = res;
        ctx.status = 204;
    }

    async deleteItsAttachment() {
        const { ctx, service } = this;
        const id = ctx.helper.parseInt(ctx.params.id);
        const attachment_id = ctx.helper.parseInt(ctx.params.a_id);
        const res = await service.category.deleteItsAttachment(id, attachment_id);
        ctx.body = res;
        ctx.status = 204;
    }


}

module.exports = CategoryController;