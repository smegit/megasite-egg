'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const { product, approval, attachment, category, attribute } = app.model.models;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    // name: STRING(30),
    // age: INTEGER,
    firstname: STRING(30),
    surname: STRING(30),
    email: STRING(30),
    encrypted_password: STRING,
    created_at: DATE,
    updated_at: DATE,
  });
  // console.info(app.model.models);
  approval.belongsToMany(product, { through: 'product_approvals', as: 'approval' });
  // approval.belongsToMany(attachment, { through: 'approval_attachments', as: 'docs' });
  // console.info(app.model);
  approval.belongsToMany(attachment, { onDelete: 'cascade', through: 'approval_attachments', as: 'attachment' });
  category.belongsToMany(attachment, { through: 'category_attachments', as: 'attachment' });
  category.belongsToMany(attribute, { through: 'category_attributes', as: 'attribute' });
  product.belongsToMany(attachment, { through: 'product_attachments', as: 'attachment' });
  return User;
};
