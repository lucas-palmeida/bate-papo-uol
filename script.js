let mensagens = [];
let participantes = [];
let nome = null;
let nomeDestino = "Todos";
let visibilidadeMsg = "message"

function entrarNome(){
    nome = {name: document.querySelector(".nome-login").value};

    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome)
    .then(autorizado)
    .catch(naoAutorizado);
}

function autorizado(resposta) {
    if(resposta.status === 200) {
        console.log(resposta.status)
        document.querySelector(".tela-login").classList.add("esconder");

        buscarMensagens();
        atualizaStatusMensagens();
        buscarParticipantes();
        atualizaParticipantes();
    }
}

function naoAutorizado(resposta) {
    if(resposta.response.status === 400) {
        console.log(resposta.response.status);
        alert("Tente outro nome.");
        nome = null;
    }
    else {
        alert("Tente novamente em alguns instantes...");
        console.log(resposta.response.status);
    }
}

function atualizaStatusMensagens(){
    setInterval(buscarMensagens, 3000);
    setInterval(atualizaStatus, 5000);
}

function atualizaParticipantes() {
    setInterval(buscarParticipantes, 10000);
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
    
    const listaMensagens = document.querySelector(".lista-mensagens");

    listaMensagens.innerHTML = '';

    for(let i = 0; i < mensagens.length; i++){
        let mensagem = mensagens[i];

        if(mensagem.type === 'status'){
            listaMensagens.innerHTML += `<li class="mensagem status"><p><span class="hora">(${mensagem.time})</span> <span class="usuario">${mensagem.from}</span> ${mensagem.text}</p></li>`;
        } 
        else if(mensagem.type === 'message') {
            listaMensagens.innerHTML += `<li class="mensagem normal"><p><span class="hora">(${mensagem.time})</span> <span class="usuario">${mensagem.from}</span> para <span class="usuario">${mensagem.to}</span>: ${mensagem.text}</p></li>`;
        }
        else if(mensagem.type === 'private_message' && ((mensagem.to === nome.name) || (mensagem.from === nome.name))) {
            listaMensagens.innerHTML += `<li class="mensagem reservada"><p><span class="hora">(${mensagem.time})</span> <span class="usuario">${mensagem.from}</span> reservadamente para <span class="usuario">${mensagem.to}</span>:  ${mensagem.text}</p></li>`;
        }
    }

    document.querySelector("ul").lastChild.scrollIntoView();
}

function buscarParticipantes() {
    axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    .then(recebeParticipantes);
}

function recebeParticipantes(resposta) {
    participantes = resposta.data;

    renderizarParticipantes();
}

function renderizarParticipantes() {
    const listaParticipantes = document.querySelector(".lista-destinatarios");

    if(nomeDestino !== "Todos") {
        listaParticipantes.innerHTML = `<li class="destinatario" onclick="selecionarDestinatario(this)" data-identifier="participant"><ion-icon name="people"></ion-icon><p class="nome-destino">Todos</p><ion-icon name="checkmark" class="check-verde esconder"></ion-icon></li>`;
    }
    else {
        listaParticipantes.innerHTML = `<li class="destinatario selecionado" onclick="selecionarDestinatario(this)" data-identifier="participant"><ion-icon name="people"></ion-icon><p class="nome-destino">Todos</p><ion-icon name="checkmark" class="check-verde"></ion-icon></li>`;
    }

    for(let i = 0; i < participantes.length; i++){
        let participante = participantes[i];
        if(participante.name === nome.name){
        }
        else if(participante.name === nomeDestino) {
            listaParticipantes.innerHTML += `<li class="destinatario selecionado" onclick="selecionarDestinatario(this)" data-identifier="participant"><ion-icon name="person-circle"></ion-icon><p class="nome-destino">${participante.name}</p><ion-icon name="checkmark" class="check-verde"></ion-icon></li>`;
        }
        else {
            listaParticipantes.innerHTML += `<li class="destinatario" onclick="selecionarDestinatario(this)" data-identifier="participant"><ion-icon name="person-circle"></ion-icon><p class="nome-destino">${participante.name}</p><ion-icon name="checkmark" class="check-verde esconder"></ion-icon></li>`;
        }
    }    
}

function ajustarCaixa(caixa) {
    while(caixa.scrollHeight > caixa.offsetHeight) {
        if(caixa.rows > 1){
            break;
        } else {
            caixa.rows += 1;
        }
    }
}

function enviarMensagem() {
    const texto = document.querySelector(".escrever-mensagem").value;
    const mensagem = {
        from: nome.name,
        to: nomeDestino,
        text: texto,
        type: visibilidadeMsg
    };

    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem)
    .then(deuCerto)
    .catch(deuErrado);

    document.querySelector(".escrever-mensagem").value = "";
}

function deuCerto(resposta) {
    buscarMensagens();
}

function deuErrado(resposta) {
    console.log(resposta.response.status);
    alert("Mensagem não enviada.");
    window.location.reload();
}

function exibeMenuLateral() {
    document.querySelector('aside').classList.toggle("esconder");
}

function selecionarDestinatario(clique) {
    document.querySelector("li.destinatario.selecionado >.check-verde").classList.add("esconder");
    document.querySelector("li.destinatario.selecionado").classList.remove("selecionado");

    clique.classList.add("selecionado");
    document.querySelector("li.destinatario.selecionado >.check-verde").classList.remove("esconder");
    nomeDestino = document.querySelector("li.destinatario.selecionado > p").innerHTML;

    if(visibilidadeMsg === "private_message") {
        document.querySelector(".enviar-mensagens > div > p").innerHTML = `Enviando para ${nomeDestino} (reservadamente)`;
    } else {
        document.querySelector(".enviar-mensagens > div > p").innerHTML = `Enviando para ${nomeDestino}`;
    }
}

function selecionarVisibilidade(clique) {
    document.querySelector("li.visibilidade.selecionado .check-verde").classList.add("esconder");
    document.querySelector("li.visibilidade.selecionado").classList.remove("selecionado");

    clique.classList.add("selecionado");
    document.querySelector("li.visibilidade.selecionado .check-verde").classList.remove("esconder");
    const visi = document.querySelector("li.visibilidade.selecionado > p").innerHTML;

    if(visi === "Público") {
        visibilidadeMsg = "message";
        document.querySelector(".enviar-mensagens > div > p").innerHTML = `Enviando para ${nomeDestino}`;
    }
    else {
        visibilidadeMsg = "private_message";
        document.querySelector(".enviar-mensagens > div > p").innerHTML = `Enviando para ${nomeDestino} (reservadamente)`;
    }
}