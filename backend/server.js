const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('./supabase');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Middleware para proteger rotas
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
}

// Rota de login admin
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const { data } = await supabase.get(`/admins?email=eq.${email}`);
  const admin = data[0];
  if (!admin) return res.status(400).json({ error: 'Admin não encontrado' });

  const valid = await bcrypt.compare(senha, admin.senha_hash);
  if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Criar novo aluno
app.post('/alunos', verifyToken, async (req, res) => {
  const { data, error } = await supabase.post('/alunos', req.body);
  if (error) return res.status(400).json(error);
  res.json(data);
});

// Buscar alunos com filtros (query params)
app.get('/alunos', async (req, res) => {
  let query = '/alunos?select=*';
  for (const [key, value] of Object.entries(req.query)) {
    query += `&${key}=ilike.*${value}*`;
  }
  const { data } = await supabase.get(query);
  res.json(data);
});

// Editar aluno
app.put('/alunos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { data } = await supabase.patch(`/alunos?id=eq.${id}`, req.body);
  res.json(data);
});

// Excluir aluno
app.delete('/alunos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  await supabase.delete(`/alunos?id=eq.${id}`);
  res.json({ success: true });
});

// Criar novo admin
app.post('/admin', async (req, res) => {
  const { email, senha, nome } = req.body;
  const senha_hash = await bcrypt.hash(senha, 10);
  const { data } = await supabase.post('/admins', { email, senha_hash, nome });
  res.json(data);
});

// Iniciar servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
