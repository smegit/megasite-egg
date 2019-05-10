'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

    const product = require('./product');
    const ProductApproval = require('./product_approvals').ProductApproval;

  
    console.info(product);
    const Approval = app.model.define('approval', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      // name: STRING(30),
      // age: INTEGER,
      approval_type: STRING(30),
      date: DATE,
      approval_no: STRING(30),
      sub_type: STRING(30),
      description: TEXT,
      standard: STRING(30),
      reference: STRING(30),
      effective_date: DATE,
      expiry_date: DATE,
      status: STRING(30),
      notes: TEXT,
      approval_doc: STRING(30),
      created_at: DATE,
      updated_at: DATE,
    },
    {
        classMethods: {
          associate: function(models) {
            //console.info(models);
            Approval.belongsToMany(app.model.product, {through: ProductApproval, foreignKey: 'approval_id'});
          }
        },
        //tableName: 'approvals'
      } 
    );
  
    //approval.belongsToMany(product, {through: ProductApproval, foreignKey: 'approval_id'});
    //console.info(Approval);

    //Approval.belongsTo(Product);
    // Approval.associate = (models) => {
    //     Approval.hasMany(models.product);
    // }
    return Approval;
  };
  