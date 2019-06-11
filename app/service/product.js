'use strict';

const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Service = require('egg').Service;

const uploadPath = 'app/public/upload/product';
class Product extends Service {
  async list({ offset = 0, limit = 10 }) {
    const { ctx } = this;
    return ctx.model.Product.findAndCountAll({
      order: [['created_at', 'DESC']],
      offset,
      limit,
    });
  }

  async find(id) {
    const { ctx } = this;
    const product = await ctx.model.Product.findOne({
      where: { id },
      include: [
        {
          model: ctx.model.Attachment,
          as: 'attachment',
          attributes: ['id', 'type', ['attachment', 'name'], 'description', 'url', 'uid'],
          through: { attributes: [] },
        },
        {
          model: ctx.model.Approval,
          as: 'approval',
          attributes: ['id', 'approval_type', 'approval_no'],
          through: { attributes: [] },
        },
      ],
    });;
    const approval = await product.getApproval();
    console.info(approval);
    if (!product) {
      ctx.throw(404, 'product not found');
    }
    return product;
  }

  async create(payload, files) {
    const { ctx } = this;
    const fileAttributes = JSON.parse(payload.fileAttributes) || [];
    const approvalList = JSON.parse(payload.approval_list) || [];
    // delete payload.fileAttributes;
    // delete payload.attribute_list;
    console.info(payload);
    const product = await ctx.model.Product.create(payload);
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
          type: fileAttributes[i].type,
          attachment: file.filename,
          file_type: fileAttributes[i].fileType,
          description: fileAttributes[i].description,
          url: targetPath,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj);
        console.info(attachment);
        product.addAttachment(attachment);
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }

    // create association of product-approvals
    const approvals = await ctx.model.Approval.findAll({
      where: { id: approvalList }
    });
    product.setApproval(approvals);
    return product;
  }

  async update(id, payload, files) {
    const { ctx } = this;
    const approvalList = JSON.parse(payload.approval_list) || [];
    const fileAttributes = JSON.parse(payload.fileAttributes) || [];
    const product = await ctx.model.Product.findByPk(id);
    if (!product) {
      ctx.throw(404, 'product not found');
    }

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
          // type: 'ProductAttachment',
          // attachment: file.filename,
          // file_type: 'Category Image',
          // description: fileAttributes[i].description,
          // url: targetPath,
          // uid: Math.random().toString(36).substring(7),

          type: fileAttributes[i].type,
          attachment: file.filename,
          file_type: fileAttributes[i].fileType,
          description: fileAttributes[i].description,
          url: targetPath,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj);
        console.info(attachment);
        product.addAttachment(attachment);
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }

    // create association of product-approvals
    const approvals = await ctx.model.Approval.findAll({
      where: { id: approvalList }
    });
    product.setApproval(approvals);

    return product.update(payload);
  }

  async destroy(id) {
    const { ctx } = this;
    const product = await ctx.model.Product.findByPk(id);
    if (!product) {
      ctx.throw(404, 'product not found');
    }

    // delete product-approval links but keep approval
    const approvals = await product.getApproval();
    product.removeApproval(approvals);
    // delete product-attachment links and attachments
    const attachments = await product.getAttachment();
    product.removeAttachment(attachments);
    // attachments.destroy();
    attachments.forEach(e => {
      e.destroy();
    });
    return product.destroy();
  }

  async deleteItsAttachment(id, attachment_id) {
    const { ctx } = this;
    const product = await ctx.model.Product.findByPk(id);
    const attachment = await ctx.model.Attachment.findByPk(attachment_id);
    if (!product) {
      ctx.throw(404, 'product not found');
    }
    if (!attachment) {
      ctx.throw(404, 'attachment not found');
    }
    product.removeAttachment(attachment);
    return attachment.destroy();
  }
}

module.exports = Product;
