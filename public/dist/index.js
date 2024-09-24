var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const prompt = require('readline-sync');
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
function addUser(nomeDoUser) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (procurarUser(nomeDoUser) !== false) {
                return console.log('Esse usuario já foi adicionado na lista!');
            }
            const res = yield fetch(`https://api.github.com/users/${nomeDoUser}`);
            const dado = yield res.json();
            const novoUser = new User(dado.id, dado.login, dado.name, dado.bio, dado.public_repos, dado.repos_url);
            users.push(novoUser);
            console.log(`O usuario ${novoUser.name} foi adicionado na lista`);
        }
        catch (err) {
            console.error(`Erro: ${err}`);
        }
    });
}
// Função para procurar um usuario em especifico
function procurarUser(login) {
    const result = users.find(user => user.login === login);
    if (result == undefined) {
        return false;
    }
    else {
        return result;
    }
}
// Listar repositórios de um usuário
function repoUser(login) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = procurarUser(login);
        if (!user) {
            return "Usuario não encontrado";
        }
        console.log(`Usuario: ${user.login}`);
        try {
            const res = yield fetch(user.repos_url);
            const dado = yield res.json();
            for (let i = 0; i < Math.min(3, dado.length); i++) { // Garante que só itera até o número de repositórios disponíveis
                console.log(`Repositorio: ${dado[i].name}`);
                console.log(`Descrição: ${dado[i].description}`);
                console.log(`Fork: ${dado[i].fork}`);
                console.log(`Estrelas: ${dado[i].stargazers_count}`);
                console.log('');
            }
        }
        catch (err) {
            console.error(`Erro: ${err}`);
        }
    });
}
function somaDosRepositorios() {
    let sum = 0;
    for (let i = 0; i < users.length; i++) {
        sum += users[i].public_repos;
    }
    console.log(`A soma de todos os repositorios é de ${sum}`);
}
// Listar usuarios salvos na lista
function listarUsuarios() {
    console.log(users);
}
let continuar = true;
function perguntas() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const res = prompt.questionInt('Sua escolha: ');
            console.clear();
            switch (res) {
                case 1:
                    const value = prompt.question('Login do usuario: ');
                    yield addUser(value);
                    break;
                case 2:
                    const valuePesquisa = prompt.question('Login do usuario: ');
                    const user = procurarUser(valuePesquisa);
                    if (!user) {
                        console.log('Usuario não encontrado');
                    }
                    else {
                        console.log(user);
                    }
                    break;
                case 3:
                    const valueList = prompt.question('Login do usuario: ');
                    yield repoUser(valueList);
                    break;
                case 4:
                    somaDosRepositorios();
                    break;
                case 5:
                    listarUsuarios();
                    break;
                case 6:
                    console.log('Saindo...');
                    continuar = false;
                    break;
                default:
                    console.error('Opção invalida');
            }
        }
    });
}
perguntas();
