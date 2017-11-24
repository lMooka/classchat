// Declarações
var refreshButton = document.getElementById("btn");
var messageSection = document.getElementById("messageSection");
var requestUrl = 'http://www.json-generator.com/api/json/get/bSvyAGhGgi';
var requestCounter = -1;

// Metodos
function generateMessageHtml(title, description, content) {
    var article = document.createElement('div');
    
    article.classList.add('box-left');
    article.innerHTML = 
    '<article class="box">' +
        '<div class="title">'+ title +'</div>' + 
        '<div class="description">'+ description +'</div>' +
        '<div class="content">+'+ content +'</div>' +
    '</article>';

    return article;
}

function refreshChat() {
    requestCounter++;
    var ajax = new XMLHttpRequest();
    ajax.open('GET', requestUrl);
    ajax.onload = function() {
        var data = JSON.parse(ajax.responseText);
        onChatReceived(data);
    };
    ajax.send();
}

function onChatReceived(data) {
    var messageHtml = generateMessageHtml(data[requestCounter].email, data[requestCounter].registered, data[requestCounter].greeting);
    messageSection.insertAdjacentElement('afterbegin', messageHtml);
}

// Eventos
refreshButton.addEventListener("click", function() {
    refreshChat();
});