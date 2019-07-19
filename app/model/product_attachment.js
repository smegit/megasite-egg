'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;


  const ProductAttachment = app.model.define('product_attachment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: INTEGER },
    attachment_id: { type: INTEGER },
    created_at: DATE,
    updated_at: DATE,
  });

  // Approval.belongsToMany(Product);
  // Product.belongsToMany(Approval);

  // console.info(Approval);
  return ProductAttachment;

};
