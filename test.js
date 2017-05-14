var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '123.207.227.220',
  user     : 'web_programming',
  password : 'web_programming',
  database : 'web_programming'
});

connection.connect();

connection.query('SELECT * from user', function(err, rows, fields) {
    if(err) console.log(err);
    console.log('The solution is: ', rows);
    connection.end();
});