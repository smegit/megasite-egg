'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;


  const CategoryAttachment = app.model.define('category_attachment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    category_id: { type: INTEGER },
    attachment_id: { type: INTEGER },
    created_at: DATE,
    updated_at: DATE,
  });

  // Approval.belongsToMany(Product);
  // Product.belongsToMany(Approval);

  // console.info(Approval);
  return CategoryAttachment;

};
