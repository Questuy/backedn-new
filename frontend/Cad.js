document.getElementById('cadastroAluno').addEventListener('submit', async function(event) {
  event.preventDefault();

  const aluno = {
    nome: document.getElementById('nome').value,
    idade: parseInt(document.getElementById('idade').value),
    sexo: document.getElementById('sexo').value,
    data_nascimento: document.getElementById('dataNascimento').value,
    cpf: document.getElementById('cpf').value,
    peso: parseFloat(document.getElementById('peso').value),
    altura: parseFloat(document.getElementById('altura').value),
    endereco: {
      rua: document.getElementById('rua').value,
      numero: document.getElementById('numero').value,
      bairro: document.getElementById('bairro').value,
      cidade: document.getElementById('cidade').value,
      cep: document.getElementById('cep').value
    },
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value,
    faixa_graduacao: document.getElementById('graduacao').value
  };

  try {
    const res = await fetch('https://backedn-new.onrender.com/alunos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Substitua com seu token JWT real se necessário
        'Authorization': 'seu-token-jwt'
      },
      body: JSON.stringify(aluno)
    });

    const data = await res.json();
    if (res.ok) {
      alert("Aluno cadastrado com sucesso!");
      this.reset();
    } else {
      alert("Erro ao cadastrar: " + data.error);
    }
  } catch (err) {
    console.error('Erro ao cadastrar:', err);
    alert("Erro na requisição.");
  }
});
