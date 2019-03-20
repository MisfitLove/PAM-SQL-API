const restify = require('restify');
const mysql = require('mysql');


// server.get('/', function (req, res, next) {
//     res.send('home')
//     return next();
// });
  


// function respond(req, res, next) {
//   res.send('hello ' + req.params.name);
//   next();
// }

// var server = restify.createServer();
// server.get('/db/:name', respond);
// server.head('/db/:name', respond);

var server = restify.createServer();

server.get('/', function (req, res, next) {
    let json = JSON.stringify([{ name: "baza 1" }, { name: 'baza 2' }]);
    res.send(json);
    return next();
});

server.get('/db', function (req, res, next) {
    let dbs = [];
    body = JSON.parse(req.body);
    var connection = mysql.createConnection({
        host     : 'localhost',  //body.host
        database : 'bank',       //body.db
        user     : 'root',
        password : '',
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }

        console.log('Connected as id ' + connection.threadId);

    });

    connection.query('SHOW DATABASES;', function (error, results, fields) {
        if (error)
            throw error;

        results.forEach(result => {
            dbs.push(result);
        });
        res.send(JSON.stringify(dbs));
    });

    connection.end();

    return next();
});

server.post('/query', (req, res) => {
    console.log(req.body.username);
    res.send(200, 'ok');
});

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);

});