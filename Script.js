let isCreating = false;

    function toggleMode() {
      isCreating = !isCreating;
      document.getElementById('formTitle').innerText = isCreating ? 'Criar Conta' : 'Login';
      document.querySelector('button').innerText = isCreating ? 'Cadastrar' : 'Entrar';
      document.getElementById('toggleText').innerText = isCreating ? 'Já tem uma conta? ' : 'Não tem uma conta? ';
      document.querySelector('.toggle a').innerText = isCreating ? 'Fazer Login' : 'Criar Conta';
    }

    function handleSubmit() {
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;

      if (!user || !pass) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      if (isCreating) {
        alert(`Usuário ${user} criado com sucesso!`);
        toggleMode();
      } else {
        alert(`Bem-vindo, ${user}!`);
      }
    }