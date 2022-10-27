function ajustarCaixa(caixa) {
    while(caixa.scrollHeight > caixa.offsetHeight) {
        if(caixa.rows > 2){
            break;
        } else {
            caixa.rows += 1;
        }
    }
}