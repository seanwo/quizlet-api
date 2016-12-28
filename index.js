var Client = require('node-rest-client').Client;
var client = new Client();

function GET(url, access_token, compare, augment) {
    return new Promise(
        function (resolve, reject) {

            function done(data, response) {
                client.removeListener('error', error);
                if ((compare !== undefined) && (compare)) {
                    data.sort(compare);
                }
                if ((augment !== undefined) && (augment)) {
                    data = augment(data);
                }
                resolve(data);
            }

            function error(err) {
                client.removeListener('error', error);
                reject(err);
            }

            var args = {
                headers: { 'Authorization': 'Bearer ' + access_token }
            };

            client.get(url, args, done);
            client.on('error', error);
        }
    )
}

function PUT(url, access_token) {
    return new Promise(
        function (resolve, reject) {

            function done(data, response) {
                client.removeListener('error', error);
                resolve(data);
            }

            function error(err) {
                client.removeListener('error', error);
                reject(err);
            }

            var args = {
                headers: { 'Authorization': 'Bearer ' + access_token }
            };

            client.put(url, args, done);
            client.on('error', error);
        }
    )
}

function DELETE(url, access_token) {
    return new Promise(
        function (resolve, reject) {

            function done(data, response) {
                client.removeListener('error', error);
                resolve(data);
            }

            function error(err) {
                client.removeListener('error', error);
                reject(err);
            }

            var args = {
                headers: { 'Authorization': 'Bearer ' + access_token }
            };

            client.delete(url, args, done);
            client.on('error', error);
        }
    )
}

function compareModifiedDateDescending(a, b) {
    return b.modified_date - a.modified_date;
}

function compareFavoriteOrModifiedDateDescending(a, b) {
    return Math.max(b.favorite_timestamp, b.modified_date) -
        Math.max(a.favorite_timestamp, a.modified_date)
}

function compareAddedOrModifiedDateDescending(a, b) {
    return Math.max(b.added_timestamp, b.modified_date) -
        Math.max(a.added_timestamp, a.modified_date)
}

function compareCreatedDateDescending(a, b) {
    return b.created_date - a.created_date;
}

function compareStartDateDescending(a, b) {
    return b.start_date - a.created_start_datedate;
}

function pruneSets(data) {
    var pruned = [];
    for (var i = 0; i < data.length; i++) {
        var entry = {};
        entry.id = data[i].id;
        entry.title = data[i].title;
        pruned.push(entry);
    }
    return pruned;
}

function pruneClasses(data) {
    var pruned = [];
    for (var i = 0; i < data.length; i++) {
        var entry = {};
        entry.id = data[i].id;
        entry.name = data[i].name;
        pruned.push(entry);
    }
    return pruned;
}

const termSafeLimit = 128;
const definitionSafeLimit = 256;

function safeTerms(data) {
    for (var i = 0; i < data.terms.length; i++) {
        if (data.terms[i].term.length > termSafeLimit) {
            data.terms[i].term = data.terms[i].term.substr(0, termSafeLimit)
        }
        if (data.terms[i].definition.length > definitionSafeLimit) {
            data.terms[i].definition = data.terms[i].definition.substr(0, definitionSafeLimit)
        }
    }
    return data;
}

function quizletAPI(user_id, access_token) {
    this.user_id = user_id;
    this.access_token = access_token;
};

quizletAPI.prototype.getUser = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id, this.access_token);
}

quizletAPI.prototype.getUserSets = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/sets',
        this.access_token,
        compareModifiedDateDescending);
}

quizletAPI.prototype.getUserSetsBasic = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/sets',
        this.access_token,
        compareModifiedDateDescending,
        pruneSets);
}

quizletAPI.prototype.getUserFavorites = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/favorites',
        this.access_token,
        compareFavoriteOrModifiedDateDescending);
}

quizletAPI.prototype.getUserFavoritesBasic = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/favorites',
        this.access_token,
        compareFavoriteOrModifiedDateDescending,
        pruneSets);
}

quizletAPI.prototype.getUserClasses = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/classes',
        this.access_token,
        compareCreatedDateDescending);
}

quizletAPI.prototype.getUserClassesBasic = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/classes',
        this.access_token,
        compareCreatedDateDescending,
        pruneClasses);
}

quizletAPI.prototype.getUserStudied = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/studied',
        this.access_token,
        compareStartDateDescending);
}

quizletAPI.prototype.getUserStudiedBasic = function () {
    return GET('https://api.quizlet.com/2.0/users/' + this.user_id + '/studied',
        this.access_token,
        compareStartDateDescending,
        pruneSets);
}

quizletAPI.prototype.markUserSetFavorite = function (set_id) {
    return PUT('https://api.quizlet.com/2.0/users/' + this.user_id + '/favorites/' + set_id, this.access_token);
}

quizletAPI.prototype.unmarkUserSetFavorite = function (set_id) {
    return DELETE('https://api.quizlet.com/2.0/users/' + this.user_id + '/favorites/' + set_id, this.access_token);
}

quizletAPI.prototype.getClass = function (class_id) {
    return GET('https://api.quizlet.com/2.0/classes/' + class_id, this.access_token);
}

quizletAPI.prototype.getClassSets = function (class_id) {
    return GET('https://api.quizlet.com/2.0/classes/' + class_id + '/sets',
        this.access_token,
        compareAddedOrModifiedDateDescending);
}

quizletAPI.prototype.getClassSetsBasic = function (class_id) {
    return GET('https://api.quizlet.com/2.0/classes/' + class_id + '/sets',
        this.access_token,
        compareAddedOrModifiedDateDescending,
        pruneSets);
}

quizletAPI.prototype.getSet = function (set_id) {
    return GET('https://api.quizlet.com/2.0/sets/' + set_id, this.access_token);
}

quizletAPI.prototype.getSafeSet = function (set_id) {
    return GET('https://api.quizlet.com/2.0/sets/' + set_id,
        this.access_token,
        null,
        safeTerms);
}

module.exports.QuizletAPI = quizletAPI;