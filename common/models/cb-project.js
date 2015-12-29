
var loopback = require('loopback');
var request = require('request');
var config = require('./cb-user-config.json');

module.exports = function(CbProject) {

    console.log(CbProject);
    CbProject.ping = function(cb) {
        cb(null, 'test');
    };
    CbProject.remoteMethod('ping', {
        http: {
            verb: 'get'
        },
        returns: {
            arg: 'data',
            type: 'string'
        }
    });

    CbProject.getAll = function(cb) {

        var ctx = loopback.getCurrentContext();

        // Get the current access token
        var accessToken = ctx.get('accessToken');

        var userId = accessToken.userId;

        var CbUser = CbProject.app.models.CbUser;
        CbUser.findById(userId, function(err, user) {
            if (err) {
                cb(err);
                return;
            }

            var httpCredential = user.httpCredential;
            console.log(httpCredential);

            request({
                method: 'GET',
                uri: config.baseUrl + '/rest/projects',
                headers: {
                    'Authorization': httpCredential
                }
            }, function(err, ret) {
                if (err) {
                    cb(err);
                    return;
                }
                if (ret && ret.body) {
                    cb(null, JSON.parse(ret.body));
                }
            });
        });

    };

    CbProject.remoteMethod('getAll', {
        http: {
            path: '/',
            verb: 'get'
        },
        returns: {
            type: 'array',
            root: true
        }
    });
};
