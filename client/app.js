// Declarações
var refreshButton = document.getElementById("btn");
var messageSection = document.getElementById("messageSection");
var btnSendMessage = document.getElementById("btnSendMessage");
var messageInput = document.getElementById("messageInput");

var cache_user_data = 'classchat_user_data';
var cache_chat_data = 'classchat_chat_data';
var user = undefined;
var chatid = undefined;
var chatusers = undefined;

var messageArray = [];

// URLs
var requestUrl = 'http://localhost:3000';

function WSAuth() {
    // Recupera o ultimo chat acessado
    if(chatid == undefined) {
        if(localStorage.getItem(cache_chat_data) != undefined) {
            chatid = localStorage.getItem(cache_chat_data);
        } else {
            localStorage.setItem(cache_chat_data, 'default');
            chatid = 'default';
        }
    }

    if(localStorage.getItem(cache_user_data) != undefined) {
        // Tenta recuperar informações do usuários que estão no cache
        console.log(localStorage.getItem(cache_user_data));
        user = JSON.parse(localStorage.getItem(cache_user_data));

        if(user == undefined) {
            // Nenhum usuário em cache
            // Pede ao webservice para criar um cadastro de usuário via ajax
            WSCreateUser();
        } else {
            // Existe usuário em cache, não é necessário cadastrar um novo usuário.
            console.log('logged as '+ user.username +', ' + user.userid);
        }
    } else {
        WSCreateUser();
    }
}

/* --------- WebService ---------- */
function WSRefreshChat() {
    if(user == undefined) {
        WSAuth();
    }

    var ajax = new XMLHttpRequest();

    if(messageArray.length == 0) {
        ajax.open('GET', requestUrl + `/messages?chatid=${chatid}&after=0`);
    } else {
        var lastMessageDate = messageArray[messageArray.length - 1].creation_date;
        console.log(lastMessageDate);
        ajax.open('GET', requestUrl + `/messages?chatid=${chatid}&after=${lastMessageDate}`);
    }
    
    ajax.onload = function() {
        var data = JSON.parse(ajax.responseText);
        onChatReceived(data);

    };
    ajax.send();
}

// Pede ao webservice para criar um cadastro de usuário via ajax
function WSCreateUser() {
    console.log("creating user");
    var ajax = new XMLHttpRequest();
    ajax.open('GET', requestUrl + '/createuser');
    ajax.onload = function() {
        console.log(JSON.parse(ajax.responseText));
        // Converse a informação do retoranada pelo ajax para json e armazena na variável user
        user = JSON.parse(ajax.responseText);
        // Adiciona as informações do usuário em cache
        localStorage.setItem(cache_user_data, JSON.stringify(user));
        console.log(user);
        // Debug
        console.log('logged as '+ user.username +', ' + user.userid);
    };
    // Após configurar toda a requisição, é necessário envia-la para o destino usando send().
    ajax.send();
}

// Pede ao webservice para mudar o nome de um usuário
// usa -> /changeusername?userid=abc123&username=NewUserName
function WSChangeUsername(username) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', requestUrlCreateUser + `/changeusername?userid=${user.userid}&username=${username}`);
    ajax.onload = function() {
        // o WS retorna um json com todas informações do usuário
        user = JSON.parse(ajax.responseText);
        console.log(user);
        // salva o json no cache para manter atualizar
        // -- inserir angularjs aqui para atualizar a webpage --
        localStorage[cache_user_data] = user;
        console.log('logged as '+ user.username +', ' + user.userid);
    };
    ajax.send();
}

function WSSendMessage(message) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', requestUrl + `/send?chatid=${chatid}&userid=${user.userid}&message=${message}`);
    ajax.onload = function() {
        console.log(ajax.responseText);
        WSRefreshChat();
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

function onChatReceived(data) {
    for(i = 0; i < data.length; i++) {
        messageArray.push(data[i]);
        console.log(JSON.stringify(data));
        var messageHtml = generateMessageHtml(data[i].userid, new Date(data[i].creation_date).toLocaleString(), data[i].message);
        messageSection.insertAdjacentElement('afterbegin', messageHtml);
    }
}

// Eventos
refreshButton.addEventListener("click", function() {
    WSRefreshChat();
    return;
});

btnSendMessage.addEventListener("click", function() {
    WSSendMessage(messageInput.value);
    return;
});
WSRefreshChat();