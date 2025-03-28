var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('admin');
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {})
});

router.post('/login', async function(req, res, next) {
  const { email, senha } = req.body;

  const admin = await global.banco.buscarAdmin(email, senha);

  if (admin && admin.admincodigo) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin');
  }
});

module.exports = router;