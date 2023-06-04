const maria = require('maria');

const conn = maria.createConnection({
    host:'localhost',
    port: '3306',
    user:'root',
    password:'0955',
    database:'test'
});

module.exports= conn;


