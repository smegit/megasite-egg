'use strict';

const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Service = require('egg').Service;

const uploadPath = 'app/public/upload/category';

class Category extends Service {
    async list({ offset = 0, limit = 10 }) {
        const { ctx } = this;
        return ctx.model.Category.findAndCountAll({
            order: [
                ['created_at', 'DESC']],
            offset: offset,
            limit: limit
        });
    }

    async find(id) {
        const { ctx } = this;
        const category = await ctx.model.Category.findOne({
            where: { id: id },
            include: [
                {
                    model: ctx.model.Attachment,
                    as: 'attachment',
                    attributes: ['id', 'type', ['attachment', 'name'], 'url', 'uid', 'description'],
                    through: { attributes: [] }
                }
            ]
        });
        console.info(category);
        if (!category) {
            ctx.throw(404, 'category not found');
        }
        return category;
    }

    async create(payload, files) {
        const { ctx } = this;
        const category = await ctx.model.Category.create(payload);
        const fileAttributes = JSON.parse(payload.fileAttributes);

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
                }
                const attachment = await ctx.model.Attachment.create(obj);
                console.info(attachment);
                category.addAttachment(attachment);
            }
        } finally {
            // remove tmp files
            ctx.cleanupRequestFiles();
        }
        return category;
    }

    async update(id, payload, files) {
        const { ctx } = this;
        const category = await ctx.model.Category.findByPk(id);
        const fileAttributes = JSON.parse(payload.fileAttributes);
        if (!category) {
            ctx.throw(404, 'category not found');
        }
        console.info(payload);
        console.info(fileAttributes);
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
                }
                const attachment = await ctx.model.Attachment.create(obj);
                console.info(attachment);
                category.addAttachment(attachment);
            }
        } finally {
            // remove tmp files
            ctx.cleanupRequestFiles();
        }
        return category.update(payload);
    }

    async destroy(id) {
        const { ctx } = this;
        const category = await ctx.model.Category.findByPk(id);
        if (!category) {
            ctx.throw(404, 'category not found');
        }

        const att = await category.getAttachment();
        category.removeAttachment(att); // remove the link table queries
        for (const attachment of att) {  // remove the attachment table queries
            attachment.destroy();
        }
        return category.destroy();
    }

    async deleteItsAttachment(id, attachment_id) {
        const { ctx } = this;
        const category = await ctx.model.Category.findByPk(id);
        const attachment = await ctx.model.Attachment.findByPk(attachment_id);
        if (!category) {
            ctx.throw(404, 'category not found');
        }
        if (!attachment) {
            ctx.throw(404, 'attachment not found');
        }
        category.removeAttachment(attachment);
        return attachment.destroy();

    }
}

module.exports = Category;