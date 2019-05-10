'use strict';

const Service = require('egg').Service;

class Product extends Service {
    async list({offset = 0, limit = 10}) {
        const { ctx } = this;
        return ctx.model.Product.findAndCountAll({
            offset,
            limit
        });
    }

    async find(id) {
        const { ctx } = this;
        const product = await ctx.model.Product.findByPk(id);
        if (!product) {
            ctx.throw(404, 'product not found');
        }
        return product;
    }

    async create(payload) {
        const { ctx } = this;
        return ctx.model.Product.create(payload);
    }

    async update(id, payload) {
        const { ctx } = this;
        const product = await ctx.model.Product.findByPk(id);
        if (!product) {
            ctx.throw(404, 'product not found');
        }
        return product.update(payload);
    }

    async destroy(id) {
        const { ctx } = this;
        const product = await ctx.model.Product.findByPk(id);
        if(!product) {
            ctx.throw(404, 'product not found');
        }
        return product.destroy();
    }
}

module.exports = Product;