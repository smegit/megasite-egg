'use strict';

module.exports = {
  parseInt(string) {
    if (typeof string === 'number') return string;
    if (!string) return string;
    return parseInt(string) || 0;
  },
  success({ ctx, res = null, msg = 'success' }) {
    ctx.body = {
      code: 0,
      data: res,
      msg,
    };
    ctx.status = 200;
  },
};
