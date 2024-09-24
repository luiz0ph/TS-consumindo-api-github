const prompt = require('readline-sync'); // Readline-sync
const users: User[] = []; // Lista para armazenar os usuarios

// Dados esperados do user
interface DadosUser {
    id: number
    login: string
    name: string
    bio: string
    public_repos: number
    repos_url: string
}

// Classe para criar e armazenar os usuarios
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
    try {
        // Verifica se o usuario já existe na lista
        if (procurarUser(nomeDoUser) !== false) {
            return console.log('Esse usuario já foi adicionado na lista!')
        }

        // Requisição na api do github
        const res = await fetch(`https://api.github.com/users/${nomeDoUser}`);
        const dado = await res.json(); // Armazena os dados JSON
        const novoUser = new User(dado.id, dado.login, dado.name, dado.bio, dado.public_repos, dado.repos_url); // Cria uma nova instancia na classe User
        users.push(novoUser); // Adiciona o novo usuario na lista
        console.log(`O usuario ${novoUser.name} foi adicionado na lista`);
    } catch (err) {
        console.error(`Erro: ${err}`);
    }
}

// Função para procurar um usuario em especifico
function procurarUser(login: string) {
    const result = users.find(user => user.login === login); // Procura o usuario na lista

    // Se não existir o usuario na lista ele retorna falso
    if (result == undefined) {
        return false
    } else {
        return result // Retorna o usuario caso exista na lista
    }
}

// Listar repositórios de um usuário
async function repoUser(login: string) {
    const user = procurarUser(login); // Procura o usuario na lista
    if (!user) {
        // Caso não exista ele retorna que o usuario não foi encontrado
        return "Usuario não encontrado";
    }

    // Mostra o usuario cuja os reposistorios esta sendo listado
    console.log(`Usuario: ${user.login}`);

    try {
        const res = await fetch(user.repos_url); // Faz uma requisição na api do github para pegar os repositorios
        const dado = await res.json(); // Armazena os dados json

        // Mostra no maximo 3 repositorios
        for (let i = 0; i < Math.min(3, dado.length); i++) { 
            console.log(`Repositorio: ${dado[i].name}`); // Nome do repositorio
            console.log(`Descrição: ${dado[i].description}`); // Descrição do repositorio
            console.log(`Fork: ${dado[i].fork}`); // Fork do repositorio
            console.log(`Estrelas: ${dado[i].stargazers_count}`); // Estrelas do repositorio
            console.log('');
        }
    } catch (err) {
        console.error(`Erro: ${err}`);
    }
}

// Soma todos os repositorios dos usuarios
function somaDosRepositorios() {
    let sum: number = 0; // Inicializa a contagem em zero
    for (let i = 0; i < users.length; i++) {
        sum += users[i].public_repos; // Soma 
    }
    console.log(`A soma de todos os repositorios é de ${sum}`); 
}

// Listar usuarios salvos na lista
function listarUsuarios() {
    console.log(users); // Mostra a lista de usuarios
}

let continuar = true; // Faz com que o while continue sendo executado
async function perguntas() {
    while (continuar) {
        // Opções de escolha
        console.log('');
        console.log('--- Pesquisa no Github ---');
        console.log('1. Adicionar Usuario na lista');
        console.log('2. Procurar usuario na lista');
        console.log('3. Listar Repositorios');
        console.log('4. Somar Repositorios');
        console.log('5. Listar Usuarios');
        console.log('6. Sair');
        console.log('---------------------------');

        // Pergunta qual opção quer escolher
        const res: number = prompt.questionInt('Sua escolha: ');
        console.clear(); // Limpa o console para facilitar a leitura

        // Estrutura de decisão baseado na escolha do usuario
        switch (res) {
            // Adicionar usuario na lista
            case 1:
                const value = prompt.question('Login do usuario: '); // Login do usuario para fazer a requisição na api
                await addUser(value); // espera a resposta da função
                break;

            // Procurar usuario na lista
            case 2:
                const valuePesquisa = prompt.question('Login do usuario: '); // Login do usuario para fazer a pesquisa
                const user = procurarUser(valuePesquisa); // Armazena a resposta
                if (!user) {
                    // Caso não encontre o usuario
                    console.log('Usuario não encontrado');
                } else {
                    // Mostra as informações do usuario caso seja encontrado
                    console.log(user);
                }
                break;

            // Listar repositorios
            case 3:
                const valueList = prompt.question('Login do usuario: '); // Armazena o usuario para listar os repositorios
                await repoUser(valueList); // Função para listar
                break;

            // Somar todos os repositorios
            case 4:
                somaDosRepositorios(); // Chama a função para somar os repositorios
                break;

            // Listar usuarios salvos na lista
            case 5:
                listarUsuarios(); // Função para listar os usuarios salvos na lista
                break;

            // Sair
            case 6:
                console.log('Saindo...');
                continuar = false; // Troca o valor para false assim parando a execução do while
                break;
            default:
                console.error('Opção invalida'); // Caso não seja enviado uma opção válida
        }
    }
}

// Inicializa o while
perguntas();