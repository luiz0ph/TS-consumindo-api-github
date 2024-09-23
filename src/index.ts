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
            const data = res.json();
        }))
        .catch((err) => console.error(`Erro: ${err}`))
}

// Teste com meu github
requisicaoGithub('luiz0ph');