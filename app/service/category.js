'use strict';
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Service = require('egg').Service;

const uploadPath = 'app/public/upload/category';

class Category extends Service {
  async list({ offset = 0, limit = 10, search = {} }) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    search = JSON.parse(search);
    return ctx.model.Category.findAndCountAll({
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
    const category = await ctx.model.Category.findOne({
      where: { id },
      include: [{
        model: ctx.model.Attachment,
        as: 'attachment',
        attributes: ['id', 'type', ['attachment', 'name'], 'url', 'uid', 'description'],
        through: {
          attributes: [],
        },
      }, {
        model: ctx.model.Attribute,
        as: 'attribute',
        attributes: ['id', 'name', 'description', 'seq_group'],
        through: {
          attributes: [],
        },
      }],
    });
    //console.info(category);
    if (!category) {
      ctx.throw(404, 'category not found');
    }
    return category;
  }

  async create(payload, files) {
    console.info('create service called');
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const fileAttributes = JSON.parse(payload.fileAttributes);
    const attributeList = JSON.parse(payload.attribute_list);
    payload.sorter = payload.sorter.split(',');
    delete payload.fileAttributes;
    delete payload.attribute_list;
    console.info(payload);
    const category = await ctx.model.Category.create(payload, { userId: userId });

    console.info(fileAttributes);
    console.info(attributeList);
    // uploading files
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const targetPath = path.join(this.config.baseDir, uploadPath, file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        await pump(source, target);
        ctx.logger.warn('save %s to %s', file.filepath, targetPath);
        // add attachment
        const obj = {
          type: 'CategoryAttachment',
          attachment: file.filename,
          file_type: 'Category Image',
          description: fileAttributes[i].description,
          url: targetPath,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj, { userId: userId });
        console.info(attachment);
        // category.addAttachment(attachment);
        await ctx.model.CategoryAttachment.create({
          category_id: category.id,
          attachment_id: attachment.id
        }, { userId: userId });
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }

    // create association of category-attributes
    const attributes = await ctx.model.Attribute.findAll({
      where: { id: attributeList }
    });
    category.setAttribute(attributes);
    return category;
  }

  async update(id, payload, files) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const category = await ctx.model.Category.findByPk(id);
    const fileAttributes = JSON.parse(payload.fileAttributes);
    const attributeList = JSON.parse(payload.attribute_list);
    //console.info(payload.sorter);
    payload.sorter = payload.sorter.length > 0 ? payload.sorter.split(',') : null;
    if (!category) {
      ctx.throw(404, 'category not found');
    }
    //console.info(payload);
    //console.info(fileAttributes);

    // upload files
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const targetPath = path.join(this.config.baseDir, uploadPath, file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        await pump(source, target);
        ctx.logger.warn('save %s to %s', file.filepath, targetPath);
        // add attachment
        const obj = {
          type: 'CategoryAttachment',
          attachment: file.filename,
          file_type: 'Category Image',
          description: fileAttributes[i].description,
          url: targetPath,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj, { userId: userId });
        console.info(attachment);
        //category.addAttachment(attachment);
        await ctx.model.CategoryAttachment.create({
          category_id: category.id,
          attachment_id: attachment.id
        }, { userId: userId });
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }

    // create association of category-attributes
    const attributes = await ctx.model.Attribute.findAll({
      where: { id: attributeList }
    });
    category.setAttribute(attributes);

    return category.update(payload, { userId: userId });
  }

  async destroy(id) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const category = await ctx.model.Category.findByPk(id);
    if (!category) {
      ctx.throw(404, 'category not found');
    }

    const att = await category.getAttachment();
    category.removeAttachment(att); // remove the link table queries
    for (const attachment of att) { // remove the attachment table queries
      attachment.destroy({ userId: userId });
    }
    return category.destroy({ userId: userId });
  }

  async deleteItsAttachment(id, attachment_id) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const category = await ctx.model.Category.findByPk(id);
    const attachment = await ctx.model.Attachment.findByPk(attachment_id);
    if (!category) {
      ctx.throw(404, 'category not found');
    }
    if (!attachment) {
      ctx.throw(404, 'attachment not found');
    }
    category.removeAttachment(attachment);

    return attachment.destroy({ userId: userId });
  }

  async getAll() {
    const { ctx } = this;
    return ctx.model.Category.findAll({
      order: [['name', 'ASC']],
    });
  }

  async getItsAttribute(id) {
    const { ctx } = this;
    const category = await ctx.model.Category.findByPk(id);
    const sequelize = ctx.model;
    let orderByString = '';
    if (!category) {
      ctx.throw(404, 'category not found');
    }
    // return category.getAttribute({
    //   //order: [['sequence', 'ASC']],
    //   order: sequelize.customSorter
    // });
    console.info(category.sorter);
    const sorterArray = category.sorter || [];
    for (let i = 0; i < sorterArray.length; i++) {
      orderByString = orderByString + ` seq_group != '{${sorterArray[i]}}', `;
    }
    console.info(orderByString);
    return sequelize.query(' SELECT "attribute"."id", "attribute"."name", "attribute"."label", "attribute"."description", "attribute"."input_type", "attribute"."ui_type", "attribute"."options", "attribute"."seq_group", "attribute"."sequence", "attribute"."created_at", "attribute"."updated_at", "attribute"."revision", "category_attributes"."created_at" AS "category_attributes.created_at", "category_attributes"."updated_at" AS "category_attributes.updated_at", "category_attributes"."category_id" AS "category_attributes.category_id", "category_attributes"."attribute_id" AS "category_attributes.attribute_id" FROM "attributes" AS "attribute" INNER JOIN "category_attributes" AS "category_attributes" ON "attribute"."id" = "category_attributes"."attribute_id" AND "category_attributes"."category_id" = ' + id +
      " order by " + orderByString + "sequence asc, name asc;", {
        model: ctx.model.Attribute,
        mapToModel: true
      });
  }

  async checkName(name) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;

    const category = await ctx.model.Category.findOne({
      where: {
        name: {
          [Op.iLike]: `${name}`
        }
      },
    });
    if (category) {
      ctx.throw(422, `Category ${name} already exist.`);
    }
    return {
      success: true,
    }
  }
}

module.exports = Category;
