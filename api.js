const restify = require('restify');
const mysql = require('mysql');

//antyulomeq13

var server = restify.createServer();
var connection;


server.listen(3000, function() {
    console.log('%s listening at %s', server.name, server.url);  
  });

server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

server.get('/', function (req, res, next) {
    let json = JSON.stringify([{ name: "baza 1" }, { name: 'baza 2' }]);
    console.log(connection);
    res.send("dziaua");
    return next();
});

server.get('/tables', function (req, res, next) {

    //let tables = [];

    connection.query('SHOW TABLES;', function (error, results, fields) {
        if (error)
            throw error;

        // results.forEach(result => {
        //     tables.push(result);
        // });
        res.send(JSON.stringify(results));
    });

    return next();

});


server.get('/db', function (req, res, next) {
    let dbs = [];
    //body = JSON.parse(req.body);    

     connection = mysql.createConnection({
        host     : "db4free.net",
        port     :  3306,
        database : "world4ulomeq",       
        user     : "ulomeq",
        password : "antyulomeq13",
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }

        console.log('Connected as id ' + connection.threadId);
        connection.query('SHOW DATABASES;', function (error, results, fields) {
            if (error)
                throw error;
    
            results.forEach(result => {
                dbs.push(result);
            });
            res.send(JSON.stringify(dbs));
        });
    
    });



    //connection.end();

    return next();
});

server.post('/query', (req, res) => {
    console.log(req.body);
    connect(req.body, res => res.send(200, res1));
});


function connect(body, callback){
    console.log("body? "+ body);
    var connection = mysql.createConnection({
        host     : "db4free.net",  // body.host, etc...
        port     :  3306,
        database : "world4ulomeq",       
        user     : "ulomeq",
        password : "antyulomeq13",
    });
    console.log(body)
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
        console.log('Connected as id ' + connection.threadId);
    });
     
    let query = body.query ? 'SHOW DATABASES' : body.query
    connection.query('SHOW DATABASES;', function (error, results, fields) {
        if (error)
            throw error;

        callback(JSON.stringify(results));
    });
    connection.end();
    
};

// curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{"username":"xyz","password":"xyz"}' \
//   http://localhost:3000/query