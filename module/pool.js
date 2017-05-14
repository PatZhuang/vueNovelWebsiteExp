var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : '123.207.227.220',
  user     : 'web_programming',
  password : 'web_programming',
  database : 'web_programming'
});

module.exports = pool;