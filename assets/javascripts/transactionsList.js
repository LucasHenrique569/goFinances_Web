
// Função que busca todas as transações cadastradas e insere as mesmas na tabela no HTML
async function loadTransactions() {
    try {
        // Busca os dados da API
        const response = await fetch('http://localhost:3000/api/v1/transacoes');
        const data = await response.json();

        // Pego uma referência para a tabela no HTML e zero o conteúdo da mesma
        const tbody = document.querySelector('#table- tbody');
        tbody.innerHTML = "";

        // Crio uma nova linha na tabela no HTML para cada tupla retornada da API
        data.forEach(transaction => {
            const line = document.createElement("tr");

            const titleField = document.createElement("td");
            titleField.textContent = transaction.titulo;
            line.appendChild(titleField);

            const valueField = document.createElement("td");
            valueField.textContent = `R$ ${transaction.valor}`;
            line.appendChild(valueField);

            if (transaction.tipo_da_transacao === 'Entrada'){
                valueField.style.color = '#008000';
            }
            else{
                valueField.style.color = '#FF0000';
            }

            const categoryField = document.createElement("td");
            categoryField.textContent = transaction.categoria;
            line.appendChild(categoryField);

            const transactionDateField = document.createElement("td")

            const utcDate = new Date(transaction.data_da_transacao);

            const day = String(utcDate.getDate()).padStart(2, '0');
            const month = String(utcDate.getMonth() + 1).padStart(2, '0');
            const year = utcDate.getFullYear();

            transactionDateField.textContent = `${day}/${month}/${year}`;
            line.appendChild(transactionDateField);

            tbody.appendChild(line);
        });
    } catch (err) {
        console.error('Erro ao tentar carregar todas as transações', err);
    }
}

loadTransactions();

// Tento simular uma atualização em tempo real dos dados 
setInterval(loadTransactions, 10000);
