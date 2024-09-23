const users = [];
class User {
    constructor(id, login, name, bio, public_repos, repos_url) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.bio = bio;
        this.public_repos = public_repos;
        this.repos_url = repos_url;
    }
}
// Função que recebe o nome do usuario e faz uma requisição
function requisicaoGithub(nomeDoUser) {
    fetch(`https://api.github.com/users/${nomeDoUser}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((res => {
        const data = res.json().then(dado => {
            const novoUser = new User(dado.id, dado.login, dado.name, dado.bio, dado.public_repos, dado.repos_url);
            users.push(novoUser);
            console.log(`O usuario ${novoUser.name} foi adicionado na lista`);
        });
    }))
        .catch((err) => console.error(`Erro: ${err}`));
}
// Teste com meu github
requisicaoGithub('luiz0ph');
// Listar usuarios salvos na lista
function listarUsuarios() {
    console.log(users);
}
