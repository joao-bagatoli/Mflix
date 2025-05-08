var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('admin/login');
});

router.get('/dashboard', function(req, res) {
  verificaLogin(res);
  res.render('admin/dashboard', { admNome: global.adminNome })
});

router.post('/login', async function(req, res) {
  const { email, senha } = req.body;

  const admin = await global.banco.buscarAdmin(email, senha);

  if (admin && admin.admincodigo) {
    global.adminCodigo = admin.admincodigo;
    global.adminEmail = admin.adminemail;
    global.adminNome = admin.admnome;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin');
  }
});

router.get('/sair', function(req, res) {
  delete global.adminCodigo;
  delete global.adminEmail;
  delete global.adminNome;
  res.redirect('/admin');
});

function verificaLogin(res) {
  if (!global.adminEmail || global.adminEmail === '') {
    res.redirect('/admin');
  }
}

module.exports = router;