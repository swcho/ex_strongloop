var async = require('async');
module.exports = function(app) {
//data sources
    var ossdbMysqlLocal = app.dataSources.ossdbMysqlLocal;
    var s = [];
    s.push(function(done) {
        ossdbMysqlLocal.automigrate('OssProject', function(err) {
            done(err);
        });
    });
    s.push(function(done) {
        ossdbMysqlLocal.automigrate('OssLicense', function(err) {
            done(err);
        });
    });
    s.push(function(done) {
        ossdbMysqlLocal.automigrate('OssPackage', function(err) {
            done(err);
        });
    });
    s.push(function(done) {
        ossdbMysqlLocal.automigrate('OssProduct', function(err) {
            done(err);
        });
    });
    async.series(s, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('ossdb model created');
        }
    });
};
