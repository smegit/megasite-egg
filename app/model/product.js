'use strict';

const ProductApproval = require('./product_approvals').ProductApproval;
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const { approval } = app.model.models;

  const Product = app.model.define('product', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    model_number: { type: STRING(30), required: true },
    type: { type: STRING(30), required: true },
    description: { type: STRING },
    aesthetic: { type: STRING },
    data: { type: JSON },
    created_at: DATE,
    updated_at: DATE,
  });

  // console.info('--------------------------------');
  //console.info(app.model.models);
  Product.belongsToMany(approval, { through: 'product_approvals' });
  return Product;
};


