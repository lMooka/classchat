// Declarações
var refreshButton = document.getElementById("btn");
var messageSection = document.getElementById("messageSection");
var requestUrl = 'http://localhost:3000';

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