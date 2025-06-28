
// Função que passa uma data do tipo "Date" para o formato "dd/mm/aaaa"
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// Função que atualiza o card com o total das transações de entrada
async function handleUpdateEntryCard() {
    try {
        // Busco o valor total de transações de entrada, baseados no mês e ano atuais
        const getTotalEntryTransactions = await fetch('http://localhost:3000/api/v1/transacoes/entradas');
        const returnedData = await getTotalEntryTransactions.json();  // Passo esses dados retornados da api para o formato json

        // Pego uma referência para a tag que representa o total das entradas no HTML e zero a mesma
        const entryCard = document.querySelector('#entry-card');
        entryCard.innerHTML = "";

        // Verifico se existe pelo menos uma transação de entrada cadastrada no mês atual, caso contrário o valor total é zero
        let totalEntryValue = returnedData.valor_total_de_entradas === null ? 0 : returnedData.valor_total_de_entradas;

        // Busco a data de uma transação de entrada mais recente no mês e ano atuais
        const getMostRecentEntryDate = await fetch('http://localhost:3000/api/v1/transacoes/entradas/data');
        const responseFormated = await getMostRecentEntryDate.json();  // Passo esses dados retornados da api para o formato json

        // Verifico se a api retornou uma data válida ou não
        let mostRecentEntryDate = responseFormated.data_mais_recente === null ? "" : new Date(responseFormated.data_mais_recente);


        // Crio uma tag "p" que mostrará o valor total das entradas
        const totalEntryText = document.createElement('p');
        totalEntryText.textContent = `R$ ${totalEntryValue}`;
        totalEntryText.style.color = '#008000';
        entryCard.appendChild(totalEntryText);

        // Mudo a formatação da data da transação mais recente de UTC para "dd/mm/aaaa", se ela existir
        const formattedDate = mostRecentEntryDate !== "" ? formatDate(mostRecentEntryDate) : mostRecentEntryDate;

        // Crio uma tag "p" com a data da transação mais recente, se ela existir.
        const lastEntryDate = document.createElement('p');
        lastEntryDate.textContent = `Última entrada em ${formattedDate}`;
        lastEntryDate.style.color = '#888888';
        entryCard.appendChild(lastEntryDate);

    } catch (err) {
        console.error('Erro ao tentar atualizar cards refentes as transações.', err)
    }
}

// Função que atualiza o card com o total de transações de Saída
async function handleUpdateExitCard() {
    try {
        // Busco o valor total de transações de saída, baseados no mês e ano atuais
        const response = await fetch('http://localhost:3000/api/v1/transacoes/saidas');
        const returnedData = await response.json();  // Passo esses dados para o formato json

        // Pego uma referência para a tag que representa o card de Saída no HTML e zero o conteúdo que estiver dentro dele
        const exitCard = document.querySelector('#exit-card');
        exitCard.innerHTML = "";  //

        // Verifico se existe pelo menos uma transação de saída cadastrada no mês atual, caso contrário o valor total é zero
        let totalExitValue = returnedData.valor_total_de_saidas === null ? 0 : returnedData.valor_total_de_saidas;

        // Busco a data de uma transação de saída mais recente no mês e ano atuais
        const getMostRecentExitDate = await fetch('http://localhost:3000/api/v1/transacoes/saidas/data');
        const returnedDataFormated = await getMostRecentExitDate.json();

        // Verifico se a api retornou uma data válida ou não
        let mostRecentExitDate = returnedDataFormated.data_mais_recente === null ? "" : new Date(returnedDataFormated.data_mais_recente);

    
        // Crio a tag "p" que vai representar o valor total de saídas
        const totalExitText = document.createElement('p');
        totalExitText.textContent = `R$ ${totalExitValue}`;
        totalExitText.style.color = '#FF0000';
        exitCard.appendChild(totalExitText);

        // Se existir uma data de transação de saída mais recente, formato a mesma de UTC para "dd/mm/aaaa"
        const formattedDate = mostRecentExitDate !== "" ? formatDate(mostRecentExitDate) : mostRecentExitDate;

        // Crio a tag "p" que vai representar a data de transação de saída mais recente
        const lastExitDate = document.createElement('p');
        lastExitDate.textContent = `Última saída em ${formattedDate}`;
        lastExitDate.style.color = '#888888';
        exitCard.appendChild(lastExitDate);

    } catch (err) {
        console.error('Erro ao tentar atualizar cards refentes as transações.', err)
    }
}

// Função que atualiza o card que mostra o valor total
async function handleUpdateTotalCard(){

    // Espero as funções que atualizam os cards de entrada e saída executarem
    await handleUpdateEntryCard();
    await handleUpdateExitCard();

    // Pego uma referência para as tags que mostram o valor total de entradas e saídas 
    const totalEntryValue = document.querySelector('#entry-card p:first-of-type');
    const totalExitValue = document.querySelector('#exit-card p:first-of-type');

    // Pego os valores dessas tags de entradas e saídas, já convertendo para "Number"
    const totalEntryValueConverted = Number(totalEntryValue.textContent.split(' ')[1]);
    const totalExitValueConverted = Number(totalExitValue.textContent.split(' ')[1]);

    let total = 0;

    if (!Number.isNaN(totalEntryValueConverted) && !Number.isNaN(totalExitValueConverted)){
        total = totalEntryValueConverted - totalExitValueConverted;
    }

    // Pego uma referência para a tag que representa o valor total e zero o conteúdo dela
    const totalCard = document.querySelector('#total-card');
    totalCard.innerHTML = "";

    // Crio uma tag "p" que vai armazenar o valor total
    const totalText = document.createElement('p');
    totalText.textContent = `R$ ${total}`;
    totalCard.appendChild(totalText);

    // Pego a referência para a tag que armazena a data de transação de entrada mais recente
    const lastEntryTransaction = document.querySelector('#entry-card p:last-of-type');

    // Crio uma tag que vai armazenar a data da transação de entrada mais recente
    const lastEntryTransactionText = document.createElement('p');
    lastEntryTransactionText.textContent = `${lastEntryTransaction.textContent}`
    lastEntryTransactionText.style.color = '#FFF';
    totalCard.appendChild(lastEntryTransactionText);
}

handleUpdateTotalCard();

setInterval(handleUpdateTotalCard, 10000);
