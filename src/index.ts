const users: object[] = [];

// Dados esperados do user
interface DadosUser {
    id: number
    login: string
    name: string
    bio: string
    public_repos: number
    repos_url: string
}

class User implements DadosUser {
    id: number;
    login: string;
    name: string;
    bio: string;
    public_repos: number;
    repos_url: string;
    constructor(id: number, login: string, name: string, bio: string, public_repos: number, repos_url: string) {
        this.id = id
        this.login = login
        this.name = name
        this.bio = bio
        this.public_repos = public_repos
        this.repos_url = repos_url
    }
}

// Função que recebe o nome do usuario e faz uma requisição
function requisicaoGithub(nomeDoUser: string) {
    fetch(`https://api.github.com/users/${nomeDoUser}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }})
        .then((res => {
            const data = res.json().then(dado => {
                const novoUser = new User(dado.id, dado.login, dado.name, dado.bio, dado.public_repos, dado.repos_url);
                users.push(novoUser);
                console.log(`O usuario ${novoUser.name} foi adicionado na lista`);
                infoUser('luiz0ph');
            });
        }))
        .catch((err) => console.error(`Erro: ${err}`))
}

// Teste com meu github
requisicaoGithub('luiz0ph');

// Função para procurar um usuario em especifico
function procurarUser(login: string) {
    // No TS o find parece dar erro (NÃO DA ERRO NO JS)
    return users.find(user => user.login === login);
}

function infoUser(login: string) {
    const user = procurarUser(login);
    if (!user) {
        return "Usuario não encontrado";
    }

    console.log(`Usuario: ${user.login}`);
    fetch(user.repos_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }})
            .then(res => res.json().then(dado => {
                // Exibir os dados dos 3 primeiros repositorios
                console.log(`Repositorio: ${dado[0].name}`) // Nome do repositorio
                console.log(`Descrição: ${dado[0].description}`) // Descrição
                console.log(`Fork: ${dado[0].fork}`) // Fork
                console.log(`Estrelas: ${dado[0].stargazers_count}`) // Estrelas

                // Terminar mais tarde de fazer os outros dois
            }))
            .catch((err) => console.error(`Erro: ${err}`));
}

// Listar usuarios salvos na lista
function listarUsuarios() {
    console.log(users);
}