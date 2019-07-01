'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;


  const { product, approval, attachment, category, attribute, feature } = app.model.models;

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
  approval.belongsToMany(product, { through: 'product_approvals', as: 'product' });
  //product.belongsToMany(approval, { through: 'product_approvals', as: 'product' });

  // approval.belongsToMany(attachment, { through: 'approval_attachments', as: 'docs' });
  // console.info(app.model);
  approval.belongsToMany(attachment, { onDelete: 'cascade', through: 'approval_attachments', as: 'attachment' });
  category.belongsToMany(attachment, { through: 'category_attachments', as: 'attachment' });
  category.belongsToMany(attribute, { through: 'category_attributes', as: 'attribute' });
  product.belongsToMany(attachment, { through: 'product_attachments', as: 'attachment' });
  // product.belongsToMany(category, { through: 'product_approvals', as: 'approval' });
  product.belongsTo(category, { foreignKey: 'type', as: 'category' });
  //category.hasMany(product, { foreignKey: 'type', as: 'cate_name' });

  product.belongsToMany(feature, { through: 'product_features', as: 'feature' });


  // define paper trails
  // User.Revisions = User.hasPaperTail();

  // const UserUser = sequelize.define('UserUser', {
  //   username: Sequelize.STRING,
  //   birthday: Sequelize.DATE
  // });
  //PaperTrail.defineModels();
  //console.info(app.model);

  // const PaperTrail = require('sequelize-paper-trail').init(app.model, { userModel: 'user', debug: true, enableRevisionChangeModel: true, enableCompression: true, enableMigration: true });
  // PaperTrail.defineModels();


  // define hooks

  // console.info(app.model);
  // const sequelize = app.model;
  // sequelize.addHook('afterCreate', (sequelize, options) => {
  //   console.info('afterCreated called');
  //   console.info(sequelize);
  //   console.info(options);
  //   // Do stuff
  // });
  // sequelize.addHook('afterUpdate', (sequelize, options) => {
  //   console.info('afterUpdate called');
  //   console.info(sequelize);
  //   console.info(options);
  //   // Do stuff
  // });
  // sequelize.addHook('afterDestroy', (sequelize, options) => {
  //   console.info('afterUpdate called');
  //   console.info(sequelize);
  //   console.info(options);
  //   // Do stuff
  // });
  return User;
};
