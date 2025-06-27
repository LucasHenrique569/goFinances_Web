
let selectedButton = '';

const entryButton = document.getElementById('entry-button');
const exitButton = document.getElementById('exit-button');

// Verifica qual é o tipo da transação, uma entrada ou saída, para depois adicionarmos essa informação a nova transação
entryButton.addEventListener('click', function () {
    selectedButton = 'Entrada';
});

exitButton.addEventListener('click', function () {
    selectedButton = 'Saída';
});

// Verifica se o formulário está com dados válidos antes de chamar a função que se conecta a api e adiciona uma nova transação
document.getElementById('confirm-new-transaction-button').addEventListener('click', async function () {
    const transactionTitle = document.getElementById('new-transaction-title-input').value.trim();
    const transactionValue = document.getElementById('new-transaction-value-input').value.trim();
    const transactionCategory = document.getElementById('new-transaction-category-input').value.trim();

    const transactionValueConverted = Number(transactionValue);

    if (transactionTitle === "" || transactionValue === "" || transactionCategory === ""){
        alert('Por favor, preencha todos os campos corretamente. Você deixou algum em branco');
        return;
    }

    if (Number.isNaN(transactionValueConverted)){
        alert('Valor inválido, tente novamente. Use "." como a vírgula para números com casas decimais. Apenas "-" e "+" são permitidos além dos números e do "."')
        return;
    }

    if (selectedButton === ''){
        alert('Por favor, selecione se a transação será uma entrada ou saída.');
        return;
    }

    addNewTransaction(transactionTitle, transactionValue, selectedButton, transactionCategory);

    alert('Nova transação cadastrada com sucesso !!!');
})

// Função que chama a api e tenta adicionar um nova transação
async function addNewTransaction(title, value, transactionType, Category) {
    const newTransaction = {
        titulo: title,
        valor: value,
        tipo_da_transacao: transactionType,
        categoria: Category
    };

    try {
        const response = await fetch('http://localhost:3000/api/v1/transacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTransaction)
        });

        if (!response.ok){
            throw new Error(`Erro ao inserir: ${response.status}`);
        }

    } catch (err) {
        console.error('Erro ao cadastrar nova transação: ', err);
    }
}
