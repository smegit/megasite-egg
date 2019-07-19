'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;


  const ProductFeature = app.model.define('product_feature', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: INTEGER },
    feature_id: { type: INTEGER },
    created_at: DATE,
    updated_at: DATE,
  });

  // Approval.belongsToMany(Product);
  // Product.belongsToMany(Approval);

  // console.info(Approval);
  return ProductFeature;

};
