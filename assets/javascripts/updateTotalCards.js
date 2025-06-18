
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
        // Busca dados da Api
        const response = await fetch('http://localhost:3000/api/v1/transacoes');
        const returnedData = await response.json();

        // Pega a referência para a div que representa o total das entradas e zera a mesma
        const entryCard = document.querySelector('#entry-card');
        entryCard.innerHTML = "";

        // armazena o valor total de entradas.
        let totalEntryValue = 0;

        // Pego apenas as tuplas ou objetos que são "Entradas"
        const entryTuples = returnedData.filter(transaction => transaction.tipo_da_transacao === 'Entrada');
        
        // Somo valor de todas as entradas
        totalEntryValue = entryTuples.reduce((total, transaction) => {
            return total + transaction.valor;
        }, 0);

        // Pego a data mais recente de entrada se ela existir
        let mostRecentEntryDate = "";

        if (entryTuples.length > 0){
            mostRecentEntryDate = new Date(entryTuples.reduce((currentMostRecentEntry, currentIterationEntry) => {
                const currentMostRecentEntryDate = new Date(currentMostRecentEntry.data_da_transacao);
                const currentIterationEntryDate = new Date(currentIterationEntry.data_da_transacao);

                return currentIterationEntryDate > currentMostRecentEntryDate ? currentIterationEntry : currentMostRecentEntry;
            }).data_da_transacao);
        }

        // Cria uma tag "p" que mostrará o valor total das entradas
        const totalEntryText = document.createElement('p');
        totalEntryText.textContent = `R$ ${totalEntryValue}`;
        totalEntryText.style.color = '#008000';
        entryCard.appendChild(totalEntryText);

        // Formata a data do formato UTC para "dd/mm/aaaa"
        const formattedDate = mostRecentEntryDate !== "" ? formatDate(mostRecentEntryDate) : mostRecentEntryDate;

        // Criando a tag "p" com a data da transação mais recente, se ela existir.
        const lastEntryDate = document.createElement('p');
        lastEntryDate.textContent = `Última entrada em ${formattedDate}`;
        lastEntryDate.style.color = '#888888';
        entryCard.appendChild(lastEntryDate);

    } catch (err) {
        console.error('Erro ao tentar atualizar cards refentes as transações.')
    }
}


async function handleUpdateExitCard() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/transacoes');
        const returnedData = await response.json();

        const exitCard = document.querySelector('#exit-card');
        exitCard.innerHTML = "";

        let totalExitValue = 0;

        const exitTuples = returnedData.filter(transaction => transaction.tipo_da_transacao === 'Saída');

        totalExitValue = exitTuples.reduce((total, transaction) => {
            return total + transaction.valor;
        }, 0);

        let mostRecentExitDate = "";

        if (exitTuples.length > 0){
            mostRecentExitDate = new Date(exitTuples.reduce((currentMostRecentExit, currentIterationExit) => {
                const currentMostRecentExitDate = new Date(currentMostRecentExit.data_da_transacao);
                const currentIterationExitDate = new Date(currentIterationExit.data_da_transacao);

                return currentIterationExitDate > currentMostRecentExitDate ? currentIterationExit : currentMostRecentExit;
            }).data_da_transacao);
        }

        const totalExitText = document.createElement('p');
        totalExitText.textContent = `R$ ${totalExitValue}`;
        totalExitText.style.color = '#FF0000';
        exitCard.appendChild(totalExitText);

        const formattedDate = mostRecentExitDate !== "" ? formatDate(mostRecentExitDate) : mostRecentExitDate;

        const lastExitDate = document.createElement('p');
        lastExitDate.textContent = `Última saída em ${formattedDate}`;
        lastExitDate.style.color = '#888888';
        exitCard.appendChild(lastExitDate);

    } catch (err) {
        
    }
}

async function handleUpdateTotalCard(){

    await handleUpdateEntryCard();
    await handleUpdateExitCard();

    const totalEntryValue = document.querySelector('#entry-card p:first-of-type');
    const totalExitValue = document.querySelector('#exit-card p:first-of-type');

    // Arrumar aqui depois, o valor retornado por "totalEntryValue" é uma string, já que o que vem de "p" do "entry-card" é "R$ {valor}"
    const totalEntryValueConverted = Number(totalEntryValue.textContent.split(' ')[1]);
    const totalExitValueConverted = Number(totalExitValue.textContent.split(' ')[1]);

    let total = 0;

    if (!Number.isNaN(totalEntryValueConverted) && !Number.isNaN(totalExitValueConverted)){
        total = totalEntryValueConverted - totalExitValueConverted;
    }

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
