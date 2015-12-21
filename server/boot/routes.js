module.exports = function(app) {
  app.get('/ping', function(req, res) {
    res.send('pong');
  });

  var router = app.loopback.Router();
  router.get('/ping2', function(req, res) {
    res.send('pongraoo');
  });
  app.use(router);
};
