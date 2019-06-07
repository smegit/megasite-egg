'use strict';

const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const Controller = require('egg').Controller;

class UploadController extends Controller {
  async approval() {
    const { ctx, service } = this;
    const file = ctx.request.files[0];
    const uid = ctx.request.body.uid;
    console.info(ctx.request.body);
    console.info(ctx.request.files);
    const uploadPath = 'app/public/upload/approvals';
    // const randomName = Math.floor(1000 + Math.random() * 9000) + file.filename;
    const targetPath = path.join(this.config.baseDir, uploadPath, file.filename);
    const source = fs.createReadStream(file.filepath);
    const target = fs.createWriteStream(targetPath);
    try {
      const resUpload = await pump(source, target);
      // console.info(resUpload);
      ctx.logger.warn('save %s to %s ', file.filepath, targetPath);
    } finally {

    }
    ctx.body = {
      success: true,
      msg: 'Upload successfully',
      url: `${uploadPath}/${file.filename}`,
      name: file.filename,
      uid,
      status: 'done',
    };
    ctx.status = 201;

  }
}
module.exports = UploadController;
