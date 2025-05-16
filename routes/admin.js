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

router.get('/categorias', async function(req, res) {
  verificaLogin(res);
  const categorias = await global.banco.adminBuscarCategorias();
  res.render('admin/categorias', { categorias, mensagem: null, sucesso: false, admNome: global.adminNome });
});

router.get('/novacategoria', function(req, res) {
  verificaLogin(res);
  // res.render('admin/categorias_novo', { admNome: global.adminNome, mensagem: null, sucesso: false });
  res.render('admin/categorias_form', { admNome: global.adminNome, categoria: null, mensagem: null, sucesso: false });
});

router.post('/novacategoria', async function(req, res) {
  verificaLogin(res);

  const { catnome, catnomenormal } = req.body;

  if (!catnome || !catnomenormal) {
    // return res.render('admin/categorias_novo', {
    //   admNome: global.adminNome,
    //   mensagem: 'Todos os campos devem ser preenchidos',
    //   sucesso: false
    // });
    return res.render('admin/categorias_form', {
      admNome: global.adminNome,
      categoria: null,
      mensagem: 'Todos os campos devem ser preenchidos',
      sucesso: false
    });
  }

  const categoriaJaExiste = await global.banco.adminBuscarCategoria(catnome);

  if (categoriaJaExiste) {
    // return res.render('admin/categorias_novo', {
    //   admNome: global.adminNome,
    //   mensagem: 'Categoria já existe no banco de dados',
    //   sucesso: false
    // });
    return res.render('admin/categorias_novo', {
      admNome: global.adminNome,
      categoria: null,
      mensagem: 'Categoria já existe no banco de dados',
      sucesso: false
    });
  }

  await global.banco.adminInserirCategoria(catnome, catnomenormal);

  // return res.render('admin/categorias_novo', {
  //   admNome: global.admNome,
  //   mensagem: 'Categoria criada com sucesso',
  //   sucesso: true
  // });
  return res.render('admin/categorias_form', {
    admNome: global.admNome,
    categoria: null,
    mensagem: 'Categoria criada com sucesso',
    sucesso: true
  });
});

router.get('/atualizarcategoria/:id', async function(req, res) {
  verificaLogin(res);

  const codigo = parseInt(req.params.id);
  const categoria = await global.banco.adminBuscarCategoriaPorCodigo(codigo);

  if (!categoria) {
    // return res.render('admin/categorias_atualizar', {
    //   admNome: global.admNome,
    //   mensagem: 'Categoria não encontrada',
    //   sucesso: false
    // });
    return res.render('admin/categorias_form', {
      admNome: global.admNome,
      categoria: {},
      mensagem: 'Categoria não encontrada',
      sucesso: false
    });
  }

  // res.render('admin/categorias_atualizar', {
  //   admNome: global.admNome,
  //   categoria,
  //   mensagem: null,
  //   sucesso: null
  // });
  res.render('admin/categorias_form', {
    admNome: global.admNome,
    categoria,
    mensagem: null,
    sucesso: null
  });
});

router.post('/atualizarcategoria/:id', async function(req, res) {
  verificaLogin(res);

  const catcodigo = parseInt(req.params.id);
  const { catnome, catnomenormal } = req.body;

  if (!catnome || !catnomenormal) {
    // return res.render('admin/categorias_atualizar', {
    //   admNome: global.admNome,
    //   categoria: { catcodigo, catnome, catnomenormal },
    //   mensagem: 'Todos os campos são obrigatórios',
    //   sucesso: false
    // });
    return res.render('admin/categorias_form', {
      admNome: global.admNome,
      categoria: { catcodigo, catnome, catnomenormal },
      mensagem: 'Todos os campos são obrigatórios',
      sucesso: false
    });
  }

  const categoriaJaExiste = await global.banco.adminBuscarCategoria(catnome);

  if (categoriaJaExiste) {
    // return res.render('admin/categorias_atualizar', {
    //   admNome: global.admNome,
    //   categoria: { catcodigo, catnome, catnomenormal },
    //   mensagem: 'Categoria já existe',
    //   sucesso: false
    // });
    return res.render('admin/categorias_form', {
      admNome: global.admNome,
      categoria: { catcodigo, catnome, catnomenormal },
      mensagem: 'Categoria já existe',
      sucesso: false
    });
  }

  await global.banco.adminAtualizarCategoria(catcodigo, catnome, catnomenormal);

  return res.render('admin/categorias_atualizar', {
    admNome: global.admNome,
    categoria: { catcodigo, catnome, catnomenormal },
    mensagem: 'Categoria atualizada com sucesso',
    sucesso: true
  });
});

function verificaLogin(res) {
  if (!global.adminEmail || global.adminEmail === '') {
    res.redirect('/admin');
  }
}

module.exports = router;