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

// Rota padrão só para teste
app.get("/", (req, res) => {
  res.send("API está online 🎉");
});

// Middleware para proteger rotas com token JWT
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
  try {
    const { data, error } = await supabase.get(`/admins?email=eq.${email}`);
    if (error || !data || data.length === 0) {
      return res.status(400).json({ error: 'Admin não encontrado' });
    }

    const admin = data[0];
    const valid = await bcrypt.compare(senha, admin.senha_hash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

// Criar novo aluno (requer token)
app.post('/alunos', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase.post('/alunos', req.body);
    if (error) return res.status(400).json(error);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// Buscar alunos com filtros por query params (sem token)
app.get('/alunos', async (req, res) => {
  try {
    let query = '/alunos?select=*';
    for (const [key, value] of Object.entries(req.query)) {
      query += `&${key}=ilike.*${value}*`;
    }
    const { data, error } = await supabase.get(query);
    if (error) return res.status(400).json(error);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro na busca de alunos' });
  }
});

// Editar aluno (requer token)
app.put('/alunos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.patch(`/alunos?id=eq.${id}`, req.body);
    if (error) return res.status(400).json(error);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar aluno' });
  }
});

// Excluir aluno (requer token)
app.delete('/alunos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.delete(`/alunos?id=eq.${id}`);
    if (error) return res.status(400).json(error);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir aluno' });
  }
});

// Criar novo admin (aberto)
app.post('/admin', async (req, res) => {
  const { email, senha, nome } = req.body;
  try {
    const senha_hash = await bcrypt.hash(senha, 10);
    const { data, error } = await supabase.post('/admins', { email, senha_hash, nome });
    if (error) return res.status(400).json(error);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar admin' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

