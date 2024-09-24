const prompt = require('readline-sync');
const users: User[] = [];
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
async function addUser(nomeDoUser: string) {
    await fetch(`https://api.github.com/users/${nomeDoUser}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }})
        .then((res => {
            const data = res.json().then(dado => {
                const novoUser = new User(dado.id, dado.login, dado.name, dado.bio, dado.public_repos, dado.repos_url);
                users.push(novoUser);
                console.log(`O usuario ${novoUser.name} foi adicionado na lista`);
            });
        }))
        .catch((err) => console.error(`Erro: ${err}`))
}

// Função para procurar um usuario em especifico
function procurarUser(login: string) {
    // No TS o find parece dar erro (NÃO DA ERRO NO JS)
    return users.find(user => user.login === login);
}

async function repoUser(login: string) {
    const user = procurarUser(login);
    if (!user) {
        return "Usuario não encontrado";
    }

    console.log(`Usuario: ${user.login}`);
    await fetch(user.repos_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }})
            .then(res => res.json().then(dado => {
                for (let i = 0; i < 3; i++) {
                    console.log(`Repositorio: ${dado[i].name}`) // Nome do repositorio
                    console.log(`Descrição: ${dado[i].description}`) // Descrição
                    console.log(`Fork: ${dado[i].fork}`) // Fork
                    console.log(`Estrelas: ${dado[i].stargazers_count}`) // Estrelas
                    console.log('')
                }
            }))
            .catch((err) => console.error(`Erro: ${err}`));
}

function somaDosRepositorios() {
    let sum: number;
    for (let i = 0; i < users.length; i++) {
        sum += users[i].public_repos;
    }
    console.log(`A soma de todos os repositorios é de ${sum}`);
}

// Listar usuarios salvos na lista
function listarUsuarios() {
    console.log(users);
}

let continuar:boolean = true;
async function perguntas() {
    while (continuar) {
        console.log('');
        console.log('--- Pesquisa no Github ---');
        console.log('1. Adicionar Usuario na lista');
        console.log('2. Procurar usuario na lista');
        console.log('3. Listar Repositorios');
        console.log('4. Somar Repositorios');
        console.log('5. Listar Usuarios');
        console.log('6. Sair');
        console.log('---------------------------');
        
        const res:number = prompt.questionInt('Sua escolha: ');
        console.clear();
    
        switch (res) {
            case 1:
                const value = prompt.question('Login do usuario: ');
                await addUser(value);
                break
            case 2:
                const valuePesquisa = prompt.question('Login do usuario: ');
                await procurarUser(valuePesquisa);
                break
            case 3:
                const valueList = prompt.question('Login do usuario: ');
                await repoUser(valueList);
                break
            case 4:
                await somaDosRepositorios();
                break
            case 5:
                await listarUsuarios();
                break
            case 6:
                console.log('Saindo...');
                continuar = false;
                break
            default:
                console.error('Opção invalida');
        }
    }
}

perguntas();