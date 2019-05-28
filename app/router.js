'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  //router.resources('users', '/users', controller.users);

  // User Access
  router.post('/api/user/access/login', controller.userAccess.login);


  router.get('/api/users', app.jwt, controller.users.index);
  router.get('/api/users/:id', app.jwt, controller.users.show)
  router.post('/api/users', app.jwt, controller.users.create);
  router.put('/api/users/:id', app.jwt, controller.users.update);
  router.delete('/api/users/:id', app.jwt, controller.users.destroy);


  // routes for products
  router.get('/api/product', app.jwt, controller.product.index);
  router.get('/api/product/:id', app.jwt, controller.product.show)
  router.post('/api/product', app.jwt, controller.product.create);
  router.put('/api/product/:id', app.jwt, controller.product.update);
  router.delete('/api/product/:id', app.jwt, controller.product.destroy);
  // get associated approvals
  router.get('/api/product/:id/approval', app.jwt, controller.product.findItsApproval);

  //router.resources('product', '/product', controller.product);

  // routes for approvals
  router.get('/api/approval', app.jwt, controller.approval.index);
  router.get('/api/approval/:id', app.jwt, controller.approval.show)
  router.post('/api/approval', app.jwt, controller.approval.create);
  router.put('/api/approval/:id', app.jwt, controller.approval.update);
  router.delete('/api/approval/:id', app.jwt, controller.approval.destroy);
  //router.resources('approval', '/approval', controller.approval);
  router.get('/api/approval/:id/product', controller.approval.findItsProduct);

  // operations to attachments being attached to an approval
  router.get('/api/approval/:id/attachment', controller.approval.findItsAttachment);
  router.delete('/api/approval/:id/attachment/:a_id', controller.approval.deleteItsAttachment);

  // routes for upload
  router.post('/api/upload/approval', app.jwt, controller.upload.approval);


};
