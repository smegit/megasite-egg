'use strict';

const Approval = require('./approval');
const Product = require('./product');
module.exports = app => {
    const { INTEGER } = app.Sequelize;

    
    const ProductApproval = app.model.define('product_approvals', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        product_id: { type: INTEGER },
        approval_id:  { type: INTEGER },
    });

    // Approval.belongsToMany(Product);
    // Product.belongsToMany(Approval);

    //console.info(Approval);
    return ProductApproval;

}