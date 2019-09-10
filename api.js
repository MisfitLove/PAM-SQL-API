const restify = require('restify');
const mysql = require('mysql');

var server = restify.createServer();
var connection;

server.listen(process.env.PORT || 5000, function() {
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
    res.header('content-type', 'json');
    res.send({hello: 'world'});
    return next();
});

server.get('/db', function (req, res) {
    let dbs = [];
    //body = JSON.parse(req.body);    

    //  connection = mysql.createConnection({
    //     host     : "db4free.net",
    //     port     :  3306,
    //     database : "world4ulomeq",       
    //     user     : "ulomeq",
    //     password : "antyulomeq13",
    // });

    // console.log("host: ", req.params.host);
    // console.log("port: ",req.params.port);
    // console.log("database: ", req.params.database);
    // console.log("user: ", req.params.user);
    // console.log("password: ", req.params.password);

    connection = mysql.createConnection({
        host     : req.params.host,
        port     : req.params.port,
        database : req.params.database,       
        user     : req.params.user,
        password : req.params.password,
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            res.status(400);
            res.send("test");
        }else{

        console.log('Connected as id ' + connection.threadId);

        connection.query('SHOW DATABASES;', function (error, results, fields) {
            if (error)
                throw error;
    
            results.forEach(result => {
                dbs.push(result);
            });
            res.header('content-type', 'json')
            res.send(JSON.stringify(dbs));
        });

        connection.query("USE " + req.params.database + ";" , function (error, results, fields) {
            if(error)
                throw error;
        });


    }
    })
});

server.get('/tables', function (req, res) {
    
        connection.query('SHOW TABLES;', function (error, results, fields) {
            if (error)
                throw error;
    
            res.header('content-type', 'json')
            res.send(results);
        });
});

server.get('/columns/:name', function (req, res) {

    
    var query = "SHOW COLUMNS FROM " + req.params.name + ";";
    console.log(query);
    
    connection.query(query, function (error, results, fields) {
        if (error)
            throw error;

        res.header('content-type', 'json')
        res.send(results);
    });
});

server.get('/select', function (req, res) {
    
    var query = "SELECT " + req.params.value + " FROM " + req.params.table;
    console.log(query);
    
    connection.query(query, function (error, results, fields) {
        if (error)
            throw error;

        res.header('content-type', 'json')
        res.send(results);
    });
});

server.get('/selectCondition', function (req, res) {
    
    var query = "SELECT " + req.params.value + " FROM " + req.params.table + " WHERE " + req.params.cond + " = " + req.params.condVal + ";";
    console.log(query);
    
    connection.query(query, function (error, results, fields) {
        if (error)
            throw error;

        res.header('content-type', 'json')
        res.send(results);
    });
});

server.get('/selectArrayTest', function (req, res) {
    
    var paramsArr = JSON.parse(req.query.paramsArr);
    var paramsCondArr = JSON.parse(req.query.paramsCondArr);
    var paramsCondValArr = JSON.parse(req.query.paramsCondValArray);

    var paramsStr = "";
    var condStr = "";
    
    
   
    for(var i = 0; i < Object.keys(paramsArr).length; i++){

        if(i != Object.keys(paramsArr).length-1){
            paramsStr = paramsStr.concat(paramsArr[i] + ", ");
        }else{            
            paramsStr = paramsStr.concat(paramsArr[i]);
        }        
    }

    for(var i = 0; i < Object.keys(paramsCondArr).length; i++){

        if(i != Object.keys(paramsCondArr).length-1){
            condStr = condStr.concat(paramsCondArr[i] + " = " + paramsCondValArr[i] + " AND ");
        }else{
            condStr = condStr.concat(paramsCondArr[i] + " = " + paramsCondValArr[i]);
        }        
    }

    console.log(paramsStr);
    console.log(condStr);

    var query = "SELECT " + paramsStr + " FROM " + req.params.table + " WHERE " + condStr + ";";


    // var arr = JSON.parse(req.query.array);
    // console.log(arr);
    // var len = Object.keys(arr).length
    // console.log(len);

    // var test = arr[0];
    // console.log(test);
    // var query = "SELECT " + req.params.value + " FROM " + req.params.table + " WHERE " + req.params.cond + " = " + req.params.condVal + ";";
    // console.log(query);
    
    // connection.query(query, function (error, results, fields) {
    //     if (error)
    //         throw error;

    //     res.header('content-type', 'json')
    //     res.send(results);
    // });
});

// server.get('/test', function (req, res) {
    
//     var arr = JSON.parse(req.query.arr);
//     console.log(arr);
//     // for(var i = 0; i < Object.keys(paramsCondArr).length; i++){

//     //     if(i != Object.keys(paramsCondArr).length-1){
//     //         condStr = condStr.concat(paramsCondArr[i] + " = " + paramsCondValArr[i] + " AND ");
//     //     }else{
//     //         condStr = condStr.concat(paramsCondArr[i] + " = " + paramsCondValArr[i]);
//     //     }        
//     // }

//     console.log(paramsStr);
//     console.log(condStr);

//     //var query = "SELECT " + paramsStr + " FROM " + req.params.table + " WHERE " + condStr + ";";

// });


server.post('/query', (req, res) => {
    console.log(req.body);
    connect(req.body, res => res.send(200, res1));
});


// function connect(body, callback){
//     console.log("body? "+ body);
//     var connection = mysql.createConnection({
//         host     : "db4free.net",  // body.host, etc...
//         port     :  3306,
//         database : "world4ulomeq",       
//         user     : "ulomeq",
//         password : "antyulomeq13",
//     });
//     console.log(body)
//     connection.connect(function (err) {
//         if (err) {
//             console.error('Error connecting: ' + err.stack);
//             return;
//         }
//         console.log('Connected as id ' + connection.threadId);
//     });
     
//     let query = body.query ? 'SHOW DATABASES' : body.query
//     connection.query('SHOW DATABASES;', function (error, results, fields) {
//         if (error)
//             throw error;

//         callback(JSON.stringify(results));
//     });
//     connection.end();
    
// };

// curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{"username":"xyz","password":"xyz"}' \
//   http://localhost:3000/query