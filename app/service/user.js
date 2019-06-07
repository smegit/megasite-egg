'use strict';

const Service = require('egg').Service;

class User extends Service {
  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.User.findAndCountAll({
      offset,
      limit,
      // order: [[ 'created_at', 'desc'], ['id', 'desc']],
    });
  }

  async find(id) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(id);
    // console.info(user);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return user;
  }

  async create(payload) {
    const { ctx } = this;
    payload.encrypted_password = await ctx.genHash(payload.password);
    console.info(payload);
    return ctx.model.User.create(payload);
  }

  async update(id, payload) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    if (payload.password) {
      payload.encrypted_password = await ctx.genHash(payload.password);
    } else {
      console.info('no password');
    }

    return user.update(payload);
  }

  async destroy(id) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }

  // find by email
  async findByEmail(email) {
    const res = await this.ctx.model.User.findOne({ where: { email } });
    console.info(res);
    return this.ctx.model.User.findOne({ where: { email } });
  }

}

module.exports = User;
