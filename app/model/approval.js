'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, ARRAY } = app.Sequelize;

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
    effective_date: {
      type: DATE,
    },
    expiry_date: {
      type: DATE,
    },
    status: STRING(30),
    notes: TEXT,
    approval_doc: STRING(30),
    product_types: ARRAY(INTEGER),
    created_at: DATE,
    updated_at: DATE,
  });

  console.info('-------------------');
  // console.info(app.model.models);
  // Approval.belongsToMany(product, { through: 'ProductApprovals' });

  return Approval;
};
