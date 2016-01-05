var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
var config = {};
try {
    config = require('../providers.json');
}
catch (err) {
    console.log(err);
    console.trace();
    process.exit(1);
}
passportConfigurator.init();
for (var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
}
app.start = function () {
    return app.listen(function () {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};
app.use('/express-status', function (req, res, next) {
    res.json({ running: true });
});
boot(app, __dirname, function (err) {
    if (err)
        throw err;
    if (require.main === module)
        app.start();
});
//# sourceMappingURL=server.js.map