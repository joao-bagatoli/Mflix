const mysql = require('mysql2/promise.js');

async function conectarBD() {
    if (global.conexao && global.conexao.state !== 'disconnected') {
        return global.conexao;
    }

    const conexao = await mysql.createConnection(
        {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'mflix'
        }
    );

    global.conexao = conexao;
    return conexao;
}

async function buscarUsuario(usuario) {
    const conexao = await conectarBD();

    const sql = "select * from usuarios where usuemail=? and ususenha=?;";
    const [usuarioEncontrado] = await conexao.query(sql, [usuario.email, usuario.senha]);

    if (usuarioEncontrado && usuarioEncontrado.length > 0) {
        return usuarioEncontrado[0];
    } else {
        return {};
    }
}

async function buscarPerfis(usuCodigo) {
    const conexao = await conectarBD();

    const sql = "select * from perfis where usucodigo=?;";
    const [perfisEncontrados] = await conexao.query(sql, [usuCodigo]);

    return perfisEncontrados;
}

async function buscarPerfil(codigoPerfil) {
    const conexao = await conectarBD();

    const sql = "select * from perfis where percodigo=?;";
    const [dadosPerfil] = await conexao.query(sql, [codigoPerfil]);

    return dadosPerfil[0];
}

async function buscarAdmin(email, senha) {
    const conexao = await conectarBD();

    const sql = "select * from administradores where adminemail=? and adminsenha=?;"
    const [admin] = await conexao.query(sql, [email, senha]);

    return admin[0];
}

module.exports = { buscarUsuario, buscarPerfis, buscarPerfil, buscarAdmin };