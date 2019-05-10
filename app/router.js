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

  //router.resources('product', '/product', controller.product);
  router.resources('approval', '/approval', controller.approval);
  router.get('/product/:id/approval', controller.product.findItsApproval)

};
