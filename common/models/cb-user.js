
var request = require('request');
var debug = require('debug')('loopback:user');
var config = require('./cb-user-config.json');

var KBaseUrlRest = config.baseUrl + '/rest';

function _get(aPath, aCb) {
    request(KBaseUrlRest + '/' + aPath, {
        'auth': {
            'user': config.user,
            'pass': config.pass
        }
    }, handle_resp(aPath, aCb));
}

module.exports = function(CbUser) {
    //console.log(CbUser);
    CbUser.login = function(credentials, include, fn) {
        var self = this;
        if (typeof include === 'function') {
            fn = include;
            include = undefined;
        }

        fn = fn || utils.createPromiseCallback();

        include = (include || '');
        if (Array.isArray(include)) {
            include = include.map(function(val) {
                return val.toLowerCase();
            });
        } else {
            include = include.toLowerCase();
        }

        var realmDelimiter;
        // Check if realm is required
        var realmRequired = !!(self.settings.realmRequired ||
        self.settings.realmDelimiter);
        if (realmRequired) {
            realmDelimiter = self.settings.realmDelimiter;
        }
        var query = self.normalizeCredentials(credentials, realmRequired,
            realmDelimiter);

        if (realmRequired && !query.realm) {
            var err1 = new Error('realm is required');
            err1.statusCode = 400;
            err1.code = 'REALM_REQUIRED';
            fn(err1);
            return fn.promise;
        }
        if (!query.email && !query.username) {
            var err2 = new Error('username or email is required');
            err2.statusCode = 400;
            err2.code = 'USERNAME_EMAIL_REQUIRED';
            fn(err2);
            return fn.promise;
        }

        var httpCredential = 'Basic ' + new Buffer(credentials.username + ':' + credentials.password).toString('base64');

        request({
            method: 'GET',
            uri: config.baseUrl + '/rest/users/page/1?pagesize=1&filter=' + credentials.username,
            headers: {
                'Authorization': httpCredential
            }
        }, function(err, ret) {
            if (err) {
                fn(err);
            } else if (ret && ret.body) {
                var cbUser = JSON.parse(ret.body).users[0];
                console.log(cbUser);
                self.create({
                    name: cbUser.name,
                    email: cbUser.email,
                    password: credentials.password,
                    httpCredential: httpCredential
                }, function(err, user) {
                    function tokenHandler(err, token) {
                        if (err) return fn(err);
                        if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
                            // NOTE(bajtos) We can't set token.user here:
                            //  1. token.user already exists, it's a function injected by
                            //     "AccessToken belongsTo User" relation
                            //  2. ModelBaseClass.toJSON() ignores own properties, thus
                            //     the value won't be included in the HTTP response
                            // See also loopback#161 and loopback#162
                            token.__data.user = user;
                        }
                        fn(err, token);
                    }
                    if (user.createAccessToken.length === 2) {
                        user.createAccessToken(credentials.ttl, tokenHandler);
                    } else {
                        user.createAccessToken(credentials.ttl, credentials, tokenHandler);
                    }
                });
            }
        });

        return fn.promise;
    };
};
