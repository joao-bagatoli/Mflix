var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { titulo: 'MFlix - Login' });
});

router.get('/perfis', async function(req, res, next) {
  verificarLogin(res);

  const registroPerfis = await global.banco.buscarPerfis(global.usucodigo);

  res.render('perfis', { titulo: 'MFlix - Perfis', registroPerfis});
});

router.post('/login', async function(req, res, next) {
  const email = req.body.email;
  const senha = req.body.senha;

  const usuario = await global.banco.buscarUsuario({ email, senha });

  if (usuario.usucodigo) {
    global.usucodigo = usuario.usucodigo;
    global.usuemail = usuario.usuemail;
    res.redirect('/perfis');
  } else {
    res.redirect('/');
  }
});

function verificarLogin(res) {
  if (!global.usuemail || global.usuemail == '') {
    res.redirect('/');
  }
}

module.exports = router;
