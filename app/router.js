'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // router.resources('users', '/users', controller.users);

  // User Access
  router.post('/api/user/access/login', controller.userAccess.login);


  router.get('/api/users', app.jwt, controller.users.index);
  router.get('/api/users/:id', app.jwt, controller.users.show);
  router.post('/api/users', app.jwt, controller.users.create);
  router.put('/api/users/:id', app.jwt, controller.users.update);
  router.delete('/api/users/:id', app.jwt, controller.users.destroy);


  // routes for products
  router.get('/api/product', app.jwt, controller.product.index);
  // router.get('/api/product/move/move', app.jwt, controller.product.moveCoverImageToAttachment);

  router.get('/api/product/all', app.jwt, controller.product.getAll);
  router.get('/api/product/:id', app.jwt, controller.product.show);
  router.post('/api/product', app.jwt, controller.product.create);
  router.put('/api/product/:id', app.jwt, controller.product.update);
  router.delete('/api/product/:id', app.jwt, controller.product.destroy);
  // get associated approvals
  router.get('/api/product/:id/approval', app.jwt, controller.product.findItsApproval);
  router.delete('/api/product/:id/attachment/:a_id', app.jwt, controller.product.deleteItsAttachment);
  router.get('/api/product/check/:model_number', app.jwt, controller.product.checkModel);

  // router.resources('product', '/product', controller.product);

  // routes for approvals
  router.get('/api/approval', app.jwt, controller.approval.index);
  router.get('/api/approval/all', app.jwt, controller.approval.getAll);
  router.get('/api/approval/:id', app.jwt, controller.approval.show);
  router.post('/api/approval', app.jwt, controller.approval.create);
  router.put('/api/approval/:id', app.jwt, controller.approval.update);
  router.delete('/api/approval/:id', app.jwt, controller.approval.destroy);
  // router.resources('approval', '/approval', controller.approval);
  router.get('/api/approval/:id/product', controller.approval.findItsProduct);

  // operations to attachments being attached to an approval
  router.get('/api/approval/:id/attachment', controller.approval.findItsAttachment);
  router.delete('/api/approval/:id/attachment/:a_id', controller.approval.deleteItsAttachment);

  // routes for upload
  router.post('/api/upload/approval', app.jwt, controller.upload.approval);


  // routes for category
  router.get('/api/category', app.jwt, controller.category.index);
  router.get('/api/category/all', app.jwt, controller.category.getAll);
  router.get('/api/category/:id', app.jwt, controller.category.show);
  router.get('/api/category/:id/attribute', app.jwt, controller.category.getItsAttribute);
  router.post('/api/category', app.jwt, controller.category.create);
  router.put('/api/category/:id', app.jwt, controller.category.update);
  router.delete('/api/category/:id', app.jwt, controller.category.destroy);
  router.delete('/api/category/:id/attachment/:a_id', controller.category.deleteItsAttachment);
  router.get('/api/category/check/:name', app.jwt, controller.category.checkName);
  // routes for attribute
  router.get('/api/attribute', app.jwt, controller.attribute.index);
  router.get('/api/attribute/all', app.jwt, controller.attribute.getAll);
  router.get('/api/attribute/getByName/:name', app.jwt, controller.attribute.getByName);
  router.get('/api/attribute/:id', app.jwt, controller.attribute.show);
  router.post('/api/attribute', app.jwt, controller.attribute.create);
  router.put('/api/attribute/:id', app.jwt, controller.attribute.update);
  router.delete('/api/attribute/:id', app.jwt, controller.attribute.destroy);
  router.get('/api/attribute/check/:name', app.jwt, controller.attribute.checkName);


  // routes for feature
  router.get('/api/feature', app.jwt, controller.feature.index);
  // router.get('/api/feature/all', app.jwt, controller.feature.getAll);
  router.get('/api/feature/:id', app.jwt, controller.feature.show);
  router.post('/api/feature', app.jwt, controller.feature.create);
  router.put('/api/feature/:id', app.jwt, controller.feature.update);
  router.delete('/api/feature/:id', app.jwt, controller.feature.destroy);
  router.get('/api/feature/check/:feature_name', app.jwt, controller.feature.checkName);
  router.get('/api/feature/type/:f_type', app.jwt, controller.feature.getFeaturesByType);

  // routes for function
  router.get('/api/fun', app.jwt, controller.fun.index);
  router.get('/api/fun/all', app.jwt, controller.fun.getAll);
  router.get('/api/fun/:id', app.jwt, controller.fun.show);
  router.post('/api/fun', app.jwt, controller.fun.create);
  router.put('/api/fun/:id', app.jwt, controller.fun.update);
  router.delete('/api/fun/:id', app.jwt, controller.fun.destroy);
  router.get('/api/fun/check/:fun_code', app.jwt, controller.fun.checkFunCode);
};
