'use strict';

const Service = require('egg').Service;

class Approval extends Service {
    async list({offset = 0, limit = 10}) {
        return this.ctx.model.Approval.findAndCountAll({
            offset,
            limit
        });
    }

    async find(id) {
        const { ctx } =  this;
        const approval = await ctx.model.Approval.findByPk(id);
        if (!approval) {
            ctx.throw(404, 'approval not found');
        }
        return approval;
    }

    async create(payload) {
        const { ctx } =  this;
        return ctx.model.Approval.create(payload); 
    }

    async update(id, payload) {
        const { ctx } = this;
        const approval = await ctx.model.Approval.findByPk(id);
        if(!approval) {
            ctx.throw(404, 'approval not found');
        }
        return approval.update(payload);
    }

    async destroy(id) {
        const { ctx } = this;
        const approval = await ctx.model.Approval.findByPk(id);
        if(!approval) {
            ctx.throw(404, 'approval not found');
        }
        return approval.destroy();
    }
    
}

module.exports = Approval;