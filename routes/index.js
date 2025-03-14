var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { titulo: 'MFlix - Login' });
});

router.post('/login', async function(req, res, next) {
  const email = req.body.email;
  const senha = req.body.senha;

  const usuario = await global.banco.buscarUsuario({ email, senha });

  res.render('perfis', { titulo: 'MFlix - Perfis' });
});

module.exports = router;
