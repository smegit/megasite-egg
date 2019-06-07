'use strict';

const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Service = require('egg').Service;

const uploadPath = 'app/public/upload/approvals';
class Approval extends Service {
  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Approval.findAndCountAll({
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        [ 'created_at', 'DESC' ]],
      offset,
      limit,
    });
  }

  async find(id) {
    const { ctx } = this;
    // const approval = await ctx.model.Approval.findByPk(id);
    const approval = await ctx.model.Approval.findOne({
      where: { id },
      include: [
        {
          model: ctx.model.Attachment,
          as: 'attachment',
          attributes: [ 'id', 'type', [ 'attachment', 'name' ], 'url', 'uid' ],
          through: { attributes: [] },
        },
      ],
    });
    if (!approval) {
      ctx.throw(404, 'approval not found');
    }
    // const attachment = approval.getDocs();
    // console.info(attachment);

    return approval;
  }

  async create(payload, files) {
    const { ctx } = this;
    const approval = await ctx.model.Approval.create(payload);
    // uploading files
    try {
      for (const file of files) {
        const targetPath = path.join(this.config.baseDir, uploadPath, file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        await pump(source, target);
        console.info(file);
        ctx.logger.warn('save %s to %s', file.filepath, targetPath);
        // add attachment
        const obj = {
          type: 'ApprovalAttachment',
          attachment: file.filename,
          file_type: 'Approval Document',
          descriptioin: 'Approval Description',
          url: targetPath,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj);
        console.info(attachment);
        approval.addAttachment(attachment);
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }


    return approval;
  }

  async update(id, payload, files) {
    const { ctx } = this;
    const approval = await ctx.model.Approval.findByPk(id);
    console.info(files);
    if (!approval) {
      ctx.throw(404, 'approval not found');
    }
    try {
      for (const file of files) {
        const targetPath = path.join(this.config.baseDir, uploadPath, file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        await pump(source, target);
        ctx.logger.warn('save %s to %s', file.filepath, targetPath);
        // add attachment
        const obj = {
          type: 'ApprovalAttachment',
          attachment: file.filename,
          file_type: 'Approval Document',
          descriptioin: 'Approval Description',
          url: targetPath,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj);
        console.info(attachment);
        approval.addAttachment(attachment);
      }
    } finally {
      // remove tmp files
      ctx.cleanupRequestFiles();
    }
    return approval.update(payload);
  }

  async destroy(id) {
    const { ctx } = this;
    const approval = await ctx.model.Approval.findByPk(id);
    if (!approval) {
      ctx.throw(404, 'approval not found');
    }

    const att = await approval.getAttachment();

    approval.removeAttachment(att); // remove the link table queries
    for (const attachment of att) { // remove the attachment table queries
      attachment.destroy();
    }
    return approval.destroy();
  }

  async deleteItsAttachment(id, attachment_id) {
    const { ctx } = this;
    const approval = await ctx.model.Approval.findByPk(id);
    const attachment = await ctx.model.Attachment.findByPk(attachment_id);
    console.info(attachment);
    console.info(approval);
    if (!approval) {
      ctx.throw(404, 'approval not found');
    }
    if (!attachment) {
      ctx.throw(404, 'attachment not found');
    }
    approval.removeAttachment(attachment);
    return attachment.destroy();
    // approval.getDocs(attachment_id);

  }

}

module.exports = Approval;
