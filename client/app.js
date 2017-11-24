// Declarações
var refreshButton = document.getElementById("btn");
var messageSection = document.getElementById("messageSection");
var user = undefined;
var chatid = undefined;
var chatusers = undefined;

// URLs
var requestUrl = 'http://localhost:3000';
var requestUrlCreateUser = 'http://localhost:3000/createuser'

function auth() {
    // Recupera o ultimo chat acessado
    if(chatid == undefined) {
        if(localStorage['classchat_chatid'] != undefined) {
            chatid = localStorage['classchat_chatid'];
        } else {
            localStorage['classchat_chatid'] = 'default';
            chatid = 'default';
        }
    }

    // Verifica se tem um usuário em cache
    if(user != undefined)
        return;

    // Tenta recuperar informações do usuários que estão no cache
    user = JSON.parse(localStorage['classchat_user']);
    if(user == undefined) {
        // Nenhum usuário em cache
        // Pede ao webservice para criar um cadastro de usuário via ajax
        createUser();
    } else {
        // Existe usuário em cache, não é necessário cadastrar um novo usuário.
        console.log('logged as '+ user.username +', ' + user.userid);
    }
}

/* --------- WebService ---------- */

// Pede ao webservice para criar um cadastro de usuário via ajax
function createUser() {

    var ajax = new XMLHttpRequest();
    ajax.open('GET', requestUrlCreateUser);
    ajax.onload = function() {
        console.log(JSON.parse(ajax.responseText));
        // Converse a informação do retoranada pelo ajax para json e armazena na variável user
        user = JSON.parse(ajax.responseText);
        // Adiciona as informações do usuário em cache
        localStorage['classchat_user'] = ajax.responseText;
        // Debug
        console.log('logged as '+ user.username +', ' + user.userid);
    };
    // Após configurar toda a requisição, é necessário envia-la para o destino usando send().
    ajax.send();
}

// Pede ao webservice para mudar o nome de um usuário
// usa -> /changeusername?userid=abc123&username=NewUserName
function changeUsername(username) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', requestUrlCreateUser + `/changeusername?userid=${user.userid}&username=${username}`);
    ajax.onload = function() {
        console.log(JSON.parse(ajax.responseText));
        // o WS retorna um json com todas informações do usuário
        user = JSON.parse(ajax.responseText);
        // salva o json no cache para manter atualizar
        // -- inserir angularjs aqui para atualizar a webpage --
        localStorage['classchat_user'] = ajax.responseText;
        console.log('logged as '+ user.username +', ' + user.userid);
    };
    ajax.send();
}

/* --------- Metodos ---------- */

function generateMessageHtml(title, description, content) {
    var article = document.createElement('div');
    
    article.classList.add('box-left');
    article.innerHTML = 
    '<article class="box">' +
        `<div class="title">${title}</div>` + 
        `<div class="description">${description}</div>` +
        `<div class="content">${content}</div>` +
    '</article>';

    return article;
}

function refreshChat() {
    if(user == undefined) {
        auth();
    }

    var ajax = new XMLHttpRequest();
    ajax.open('GET', requestUrl);
    ajax.onload = function() {
        var data = JSON.parse(ajax.responseText);
        onChatReceived(data);
    };
    ajax.send();
}

function onChatReceived(data) {
    for(i = 0; i < data.length; i++) {
        var messageHtml = generateMessageHtml(data[i].username, data[i].datetime, data[i].message);
        messageSection.insertAdjacentElement('afterbegin', messageHtml);
    }
}

// Eventos
refreshButton.addEventListener("click", function() {
    refreshChat();
});