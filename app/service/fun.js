'use strict';
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Service = require('egg').Service;

const uploadPath = 'app/public/upload/function';

class Fun extends Service {
  async list({ offset = 0, limit = 10, search = {} }) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    search = search.length > 0 ? JSON.parse(search) : {};
    return ctx.model.Function.findAndCountAll({
      where: {
        ...search.name && { name: { [Op.iLike]: `%${search.name}%` } },
      },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  }

  async find(id) {
    const { ctx } = this;
    const fun = await ctx.model.Function.findOne({
      where: { id },
    });
    console.info(fun);
    if (!fun) {
      ctx.throw(404, 'function not found');
    }
    return fun;
  }

  async create(payload, files) {
    console.info('create service called');
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);


    console.info(payload);
    //const fun = await ctx.model.Function.create(payload, { userId: userId });

    // uploading files
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const targetPath = path.join(this.config.baseDir, uploadPath, file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        await pump(source, target);
        ctx.logger.warn('save %s to %s', file.filepath, targetPath);
        payload.url = targetPath;
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }
    return ctx.model.Function.create(payload, { userId: userId });;
  }

  async update(id, payload, files) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const fun = await ctx.model.Function.findByPk(id);
    if (!fun) {
      ctx.throw(404, 'function not found');
    }
    console.info(payload);

    // upload files
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const targetPath = path.join(this.config.baseDir, uploadPath, file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        await pump(source, target);
        ctx.logger.warn('save %s to %s', file.filepath, targetPath);
        payload.url = targetPath;
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }

    return fun.update(payload, { userId: userId });
  }

  async destroy(id) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const fun = await ctx.model.Function.findByPk(id);
    if (!fun) {
      ctx.throw(404, 'function not found');
    }

    return fun.destroy({ userId: userId });
  }


  async getAll() {
    const { ctx } = this;
    return ctx.model.Function.findAll();
  }


  async checkFunCode(funCode) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;

    const fun = await ctx.model.Function.findOne({
      where: {
        function_code: {
          [Op.iLike]: `${funCode}`
        }
      },
    });
    if (fun) {
      ctx.throw(422, `function ${funCode} already exist.`);
    }
    return {
      success: true,
    }
  }
}

module.exports = Fun;
