document.getElementById('cadastroAluno').addEventListener('submit', function(event) {
      event.preventDefault();

      const aluno = {
        nome: document.getElementById('nome').value,
        idade: document.getElementById('idade').value,
        sexo: document.getElementById('sexo').value,
        dataNascimento: document.getElementById('dataNascimento').value,
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
        graduacao: document.getElementById('graduacao').value
      };

      // Enviar para backend (substituir com sua rota real)
      console.log("Aluno a ser enviado:", aluno);

      /*
      fetch('/api/cadastrar-aluno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      })
        .then(res => res.json())
        .then(data => alert(data.message))
        .catch(err => console.error('Erro ao cadastrar:', err));
      */

      alert("Aluno cadastrado com sucesso (simulado)!");
      this.reset();
    });
  