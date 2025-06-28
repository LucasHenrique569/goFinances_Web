
const newTransactionButton = document.getElementById('new-transaction-button');
const modal = document.getElementById('register-modal');
const closeModalButton = modal.querySelector('.close-modal-button');
const transactionsButtons = document.querySelectorAll('.transactions-buttons');

// Mostra o modal na tela ao clicar no botão "nova transação"
newTransactionButton.addEventListener('click', function(e) {
    e.preventDefault()
    modal.classList.add('show');
})

// Esconde o modal ao clicar no "X"
closeModalButton.addEventListener('click', function() {
    modal.classList.remove('show');

    resetFormularyFields();

    // Remove a classe 'active' de todos os botões
    transactionsButtons.forEach(btn => btn.classList.remove('active'));
})

// Esconde o modal ao clicar fora do mesmo, na parte com um pouco de sombra
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('show');

        resetFormularyFields();

        // Remove a classe 'active' de todos os botões
        transactionsButtons.forEach(btn => btn.classList.remove('active'));
    }
})

// Função que reseta os campos do formulário
function resetFormularyFields(){
    const transactionTitleInput = document.getElementById('new-transaction-title-input');
    const transactionValueInput = document.getElementById('new-transaction-value-input');
    const transactionCategoryInput = document.getElementById('new-transaction-category-input');

    transactionTitleInput.value = '';
    transactionValueInput.value = '';
    transactionCategoryInput.value = '';
}

// Adiciona um estilo aos botões de "entrada" e "saída" quando o usuário clica em algum deles, para deixar claro qual está marcado ou não
transactionsButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove a classe 'active' de todos os botões
        transactionsButtons.forEach(btn => btn.classList.remove('active'));

        // Adiciona a classe 'active' ao botão clicado
        button.classList.add('active');
    })
})