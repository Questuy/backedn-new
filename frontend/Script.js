document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  try {
    const res = await fetch('https://backedn-new.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      alert("Login realizado com sucesso!");
      // Armazena o token para usar depois
      localStorage.setItem("token", data.token);
      // Redirecionar, se quiser:
      // window.location.href = "painel.html";
    } else {
      alert("Erro no login: " + data.error);
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro de conexão com o servidor.");
  }
});
