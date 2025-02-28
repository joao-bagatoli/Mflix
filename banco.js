const mysql = require('mysql2/promise');

const conexao = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'mflix'
    }
);

const email = 'tiaogaviao@outlook.com';
const senha = '123';

const sql = `select * from usuarios where usuemail = ${email} and ususenha = ${senha}`;

const [result] = conexao.query(sql);