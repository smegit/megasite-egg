'use strict';

const ProductApproval = require('./product_approvals').ProductApproval;
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const Approval = require('./approval').Approval;
  
  //const Approval = app.model.Approval;

  const Product = app.model.define('product', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    model_number: { type: STRING(30), required: true},
    type: { type: STRING(30), required: true },
    description: { type: STRING },
    aesthetic: { type: STRING },
    data: { type: JSON},
    created_at: DATE,
    updated_at: DATE,
  },
  {
    classMethods: {
      associate: function(models) {
        console.info(app);
        Product.belongsToMany(app.model.Approval, {through: ProductApproval, foreignKey: 'product_id'})
      }
    },
    //tableName: 'products'
  }
  );

  // Product.associate = (models) => {
  //   console.info(models);
  //   Product.belongsTo(models.approval);
  // }
  //console.info(Product.associate);
  //Product.belongsToMany(Approval, {through: ProductApproval});

  return Product;
};


