
// Função que passa uma data do tipo "Date" para o formato "dd/mm/aaaa"
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// Função que atualiza o card com o total das transações de entrada no html
async function handleUpdateEntryCard() {
    try {
        // Busca dados da Api
        const response = await fetch('http://localhost:3000/api/v1/transacoes');
        const returnedData = await response.json();

        // Pega a referência para a div no html que representa o total das transações de entrada e zera o conteúdo da mesma
        const entryCard = document.querySelector('#entry-card');
        entryCard.innerHTML = "";

        // Armazena o valor total de transações de entrada
        let totalEntryValue = 0;

        // Pego apenas as tuplas ou objetos que são transações de entrada
        const entryTuples = returnedData.filter(transaction => transaction.tipo_da_transacao === 'Entrada');
        
        // Somo o valor de todas as transações de entrada
        totalEntryValue = entryTuples.reduce((total, transaction) => {
            return total + transaction.valor;
        }, 0);

        
        let mostRecentEntryDate = "";

        // Pego a data mais recente de uma transação de entrada, se ela existir
        if (entryTuples.length > 0){
            mostRecentEntryDate = new Date(entryTuples.reduce((currentMostRecentEntry, currentIterationEntry) => {
                const currentMostRecentEntryDate = new Date(currentMostRecentEntry.data_da_transacao);
                const currentIterationEntryDate = new Date(currentIterationEntry.data_da_transacao);

                return currentIterationEntryDate > currentMostRecentEntryDate ? currentIterationEntry : currentMostRecentEntry;
            }).data_da_transacao);
        }

        // Cria uma tag "p" que mostrará o valor total das transações de entrada
        const totalEntryText = document.createElement('p');
        totalEntryText.textContent = `R$ ${totalEntryValue}`;
        totalEntryText.style.color = '#008000';
        entryCard.appendChild(totalEntryText);

        // Formata a data do formato UTC para "dd/mm/aaaa"
        const formattedDate = mostRecentEntryDate !== "" ? formatDate(mostRecentEntryDate) : mostRecentEntryDate;

        // Criando a tag "p" com a data da transação de entrada mais recente, se ela existir
        const lastEntryDate = document.createElement('p');
        lastEntryDate.textContent = `Última entrada em ${formattedDate}`;
        lastEntryDate.style.color = '#888888';
        entryCard.appendChild(lastEntryDate);

    } catch (err) {
        console.error('Erro ao tentar atualizar cards referentes as transações.')
    }
}

// Função que atualiza o card com o total de transações de saída no html
async function handleUpdateExitCard() {
    try {
        // Busca dados da Api
        const response = await fetch('http://localhost:3000/api/v1/transacoes');
        const returnedData = await response.json();

        // Pega a referência para a div que representa o total das transações de saída e zera o conteúdo da mesma
        const exitCard = document.querySelector('#exit-card');
        exitCard.innerHTML = "";

        // Armazena o valor total das transações de saída
        let totalExitValue = 0;

        // Pego apenas as tuplas ou objetos que são transações de saída
        const exitTuples = returnedData.filter(transaction => transaction.tipo_da_transacao === 'Saída');

        // Somo o valor de todas as transações de saída
        totalExitValue = exitTuples.reduce((total, transaction) => {
            return total + transaction.valor;
        }, 0);

        let mostRecentExitDate = "";

        // Pego a data mais recente de uma transação de saída, se ela existir
        if (exitTuples.length > 0){
            mostRecentExitDate = new Date(exitTuples.reduce((currentMostRecentExit, currentIterationExit) => {
                const currentMostRecentExitDate = new Date(currentMostRecentExit.data_da_transacao);
                const currentIterationExitDate = new Date(currentIterationExit.data_da_transacao);

                return currentIterationExitDate > currentMostRecentExitDate ? currentIterationExit : currentMostRecentExit;
            }).data_da_transacao);
        }

        // Cria uma tag "p" que mostrará o valor total das transações de saída
        const totalExitText = document.createElement('p');
        totalExitText.textContent = `R$ ${totalExitValue}`;
        totalExitText.style.color = '#FF0000';
        exitCard.appendChild(totalExitText);

        // Formata a data do formato UTC para "dd/mm/aaaa"
        const formattedDate = mostRecentExitDate !== "" ? formatDate(mostRecentExitDate) : mostRecentExitDate;

        // Criando a tag "p" com a data da transação de saída mais recente, se ela existir.
        const lastExitDate = document.createElement('p');
        lastExitDate.textContent = `Última saída em ${formattedDate}`;
        lastExitDate.style.color = '#888888';
        exitCard.appendChild(lastExitDate);

    } catch (err) {
        console.error('Erro ao tentar atualizar cards referentes as saídas.')
    }
}

// Função que atualiza o card com o total no html
async function handleUpdateTotalCard(){

    // Aguarda a atualização dos cards de totais de entradas e saidas
    await handleUpdateEntryCard();
    await handleUpdateExitCard();

    // Pega uma referência para a tag "p" que mostra o valor total das entradas ou saídas (no card de entradas e saídas)
    const totalEntryValue = document.querySelector('#entry-card p:first-of-type');
    const totalExitValue = document.querySelector('#exit-card p:first-of-type');

    // Aqui eu pego apenas o número referente ao valor total de transações de entrada e saída, porque na tag "p" dentro do card, aparece "R$ 4000", e eu preciso apenas do número.
    const totalEntryValueConverted = Number(totalEntryValue.textContent.split(' ')[1]);
    const totalExitValueConverted = Number(totalExitValue.textContent.split(' ')[1]);

    let total = 0;
    
    // Aqui eu testo se a conversão para "Number" das tags que armazenam o total de transações de entrada e saída deu certo, caso sim, eu calculo o total
    if (!Number.isNaN(totalEntryValueConverted) && !Number.isNaN(totalExitValueConverted)){
        total = totalEntryValueConverted - totalExitValueConverted;
    }

    // A partir de agora eu crio as informações que vão no card do total no html
    const totalCard = document.querySelector('#total-card');
    totalCard.innerHTML = "";

    const totalText = document.createElement('p');
    totalText.textContent = `R$ ${total}`;
    totalCard.appendChild(totalText);

    const lastEntryTransaction = document.querySelector('#entry-card p:last-of-type');

    const lastEntryTransactionText = document.createElement('p');
    lastEntryTransactionText.textContent = `${lastEntryTransaction.textContent}`
    lastEntryTransactionText.style.color = '#FFF';
    totalCard.appendChild(lastEntryTransactionText);
}

handleUpdateTotalCard();

setInterval(handleUpdateTotalCard, 10000);
