var users = [];
// Função que recebe o nome do usuario e faz uma requisição
function requisicaoGithub(nomeDoUser) {
    fetch("https://api.github.com/users/".concat(nomeDoUser), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((function (res) { return console.log(res.json()); }))
        .then((function (data) { return console.log(data); }))
        .catch(function (err) { return console.error("Erro: ".concat(err)); });
}
// Teste para ver se está dando certo
requisicaoGithub('luiz0ph');