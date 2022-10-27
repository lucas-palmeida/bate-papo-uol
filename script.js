let mensagens = [];
let nome = null

function entrarNome(){
    nome = {name: document.querySelector(".nome-login").value};

    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome)
    .then(autorizado)
    .catch(naoAutorizado);

    buscarMensagens();
    atualizaStatusMensagens();
}

function autorizado(autorizacao) {
    console.log(autorizacao.status);
    document.querySelector(".tela-login").classList.add("esconder");
}

function naoAutorizado(erro) {
    alert("Tente outro nome.");
    console.log(erro.status);
}

function atualizaStatusMensagens(){
    setInterval(buscarMensagens, 3000);
    setInterval(atualizaStatus, 5000);
}

function atualizaStatus() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome);
}

function buscarMensagens() {
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    .then(recebeMensagens);
}

function recebeMensagens(resposta) {
    mensagens = resposta.data;

    renderizarMensagens();
}

function renderizarMensagens() {
    
    const listaMensagens = document.querySelector("ul");

    listaMensagens.innerHTML = '';

    for(let i = 0; i < mensagens.length; i++){
        let mensagem = mensagens[i];

        if(mensagem.type === 'status'){
            listaMensagens.innerHTML += `<li class="mensagem status"><p><span class="hora">(${mensagem.time})</span> <span class="usuario">${mensagem.from}</span> ${mensagem.text}</p></li>`;
        } 
        else if(mensagem.type === 'message') {
            listaMensagens.innerHTML += `<li class="mensagem normal"><p><span class="hora">(${mensagem.time})</span> <span class="usuario">${mensagem.from}</span> para <span class="usuario">${mensagem.to}</span>: ${mensagem.text}</p></li>`;
        }
        else if(mensagem.type === 'private_message' && mensagem.to === nome) {
            listaMensagens.innerHTML += `<li class="mensagem reservada"><p><span class="hora">(${mensagem.time})</span> <span class="usuario">${mensagem.from}</span> reservadamente para <span class="usuario">${mensagem.to}</span>:  ${mensagem.text}</p></li>`;
        }
    }

    document.querySelector("ul").lastChild.scrollIntoView();
}

function ajustarCaixa(caixa) {
    while(caixa.scrollHeight > caixa.offsetHeight) {
        if(caixa.rows > 2){
            break;
        } else {
            caixa.rows += 1;
        }
    }
}