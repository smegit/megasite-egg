'use strict';

const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Service = require('egg').Service;
//const Op = app.Sequelize.Op;

const uploadPath = '/upload/product';
class Product extends Service {
  async list({ offset = 0, limit = 10, search = {} }) {
    console.info('list called -------------');
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    // const whereClause = {};

    // for (var key in search) {
    //   if (search.hasOwnProperty(key)) {
    //     search[key] = { $like: `%${search[key]}%` };
    //   }
    // }
    console.info(search);
    search = JSON.parse(search);
    // let queryObj = {
    //   ...search.type && { type: { $like: `${search.type}` } },
    //   ...search.model_number && { model_number: search.model_number },
    // };
    // console.info(JSON.stringify(queryObj));
    // queryObj = JSON.stringify(queryObj);

    return ctx.model.Product.findAndCountAll({
      // where: { model_number: { [Op.like]: '%PA7395%' } },
      where: {
        ...search.model_number && { model_number: { [Op.iLike]: `%${search.model_number}%` } },
        ...search.type && { type: search.type },
        ...search.description && { description: { [Op.iLike]: `%${search.description}%` } },
      },
      order: [['created_at', 'DESC']],
      offset,
      limit,
      include: [{
        model: ctx.model.Category,
        as: 'category',
      }]
    });
  }

  async find(id) {
    const { ctx } = this;
    const product = await ctx.model.Product.findOne({
      where: { id },
      include: [
        {
          model: ctx.model.Category,
          as: 'category',
        },
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
        {
          model: ctx.model.Feature,
          as: 'feature',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      order: [[{ model: ctx.model.Feature, as: 'feature' }, 'name']]
    });;
    const approval = await product.getApproval();
    //console.info(approval);
    if (!product) {
      ctx.throw(404, 'product not found');
    }
    return product;
  }

  async create(payload, files) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const fileAttributes = JSON.parse(payload.fileAttributes) || [];
    const approvalList = JSON.parse(payload.approval_list) || [];
    // console.info((payload.feature).length);
    const featureList = (payload.feature).length > 0 ? JSON.parse(payload.feature) : [];
    // delete payload.fileAttributes;
    // delete payload.attribute_list;

    const product = await ctx.model.Product.create(payload, { userId: userId });
    // uploading files
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const targetPath = path.join(this.config.HOME, uploadPath, file.filename);
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
          //url: targetPath,
          url: `${uploadPath}/${file.filename}`,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj, { userId: userId });
        console.info(attachment);
        // product.addAttachment(attachment, { userId, userId });
        // const ob 
        await ctx.model.ProductAttachment.create({
          product_id: product.id,
          attachment_id: attachment.id,
        }, { userId: userId });

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

    // create association of product-features
    const existingFeaturesId = featureList.filter(e => Number.isInteger(e));
    const newFeaturesObj = featureList.filter(e => !Number.isInteger(e)).map(e => {
      return { name: e }
    });
    const features = await ctx.model.Feature.findAll({
      where: { id: existingFeaturesId }
    });
    const newFeatures = await ctx.model.Feature.bulkCreate(newFeaturesObj, { returning: true });
    product.setFeature(features);
    product.addFeature(newFeatures);
    return product;
  }

  async update(id, payload, files) {
    const { ctx } = this;
    const userId = await ctx.helper.getUserByToken(ctx);
    const approvalList = JSON.parse(payload.approval_list) || [];
    const fileAttributes = JSON.parse(payload.fileAttributes) || [];
    const featureList = JSON.parse(payload.feature) || [];
    const product = await ctx.model.Product.findByPk(id);
    if (!product) {
      ctx.throw(404, 'product not found');
    }

    // upload files
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const targetPath = path.join(this.config.HOME, uploadPath, file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        console.info(this.config);
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
          url: `${uploadPath}/${file.filename}`,
          uid: Math.random().toString(36).substring(7),
        };
        const attachment = await ctx.model.Attachment.create(obj, { userId, userId });
        console.info(attachment);
        //product.addAttachment(attachment, { userId: userId });
        await ctx.model.ProductAttachment.create({
          product_id: product.id,
          attachment_id: attachment.id,
        }, { userId: userId });
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

    // create association of product-features
    const existingFeaturesId = featureList.filter(e => Number.isInteger(e));
    const newFeaturesObj = featureList.filter(e => !Number.isInteger(e)).map(e => {
      return { name: e }
    });
    const features = await ctx.model.Feature.findAll({
      where: { id: existingFeaturesId }
    });
    const newFeatures = await ctx.model.Feature.bulkCreate(newFeaturesObj, { returning: true });
    product.setFeature(features, { userId: userId });
    product.addFeature(newFeatures, { userId: userId });
    //await ctx.model.ProductFeature.create()
    payload.type = parseInt(payload.type);
    console.info(payload);
    return product.update(payload, { userId: userId });
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
    console.info(ctx.model);
    const userId = await ctx.helper.getUserByToken(ctx);
    const product = await ctx.model.Product.findByPk(id);
    const attachment = await ctx.model.Attachment.findByPk(attachment_id);
    if (!product) {
      ctx.throw(404, 'product not found');
    }
    if (!attachment) {
      ctx.throw(404, 'attachment not found');
    }
    //product.removeAttachment(attachment);
    const productAttachment = await ctx.model.ProductAttachment.findOne({
      where: { product_id: id, attachment_id: attachment_id }
    });
    productAttachment.destroy({ userId: userId });
    // console.info(productAttachment);
    return attachment.destroy({ userId: userId });
  }

  async checkModel(model_number) {
    const { ctx } = this;
    const { Op } = ctx.app.Sequelize;
    const product = await ctx.model.Product.findOne({
      where: {
        model_number: {
          [Op.iLike]: `${model_number}`
        }
      },
    });
    if (product) {
      ctx.throw(422, `Product ${model_number} already exists.`);
    }
    return {
      success: true,
    }
  }

  async getAll() {
    const { ctx } = this;
    return ctx.model.Product.findAll({
      attributes: ['id', 'model_number']
    });
  }

  // async moveCoverImageToAttachment() {
  //   console.info('in MoveCoverImageToAttachment');
  //   const { ctx } = this;
  //   const { Op } = ctx.app.Sequelize;
  //   const prodWithCoverImage = await ctx.model.Product.findAll({
  //     where: {
  //       cover_image: { [Op.ne]: null }
  //     }
  //   });
  //   try {
  //     for (let i = 0; i < prodWithCoverImage.length; i++) {
  //       const obj = {
  //         type: 'CoverImage',
  //         attachment: prodWithCoverImage[i].dataValues.cover_image,
  //       }
  //       const attachment = await ctx.model.Attachment.create(obj);
  //       const product = await ctx.model.Product.findOne({
  //         where: { id: prodWithCoverImage[i].dataValues.id }
  //       })
  //       product.addAttachment(attachment);
  //     }
  //     console.info(prodWithCoverImage.length);
  //   } finally {

  //   }
  //   console.info(prodWithCoverImage[1]);
  // }
}

module.exports = Product;
