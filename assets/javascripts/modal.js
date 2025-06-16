
const newTransactionButton = document.getElementById('new-transaction-button');
const modal = document.getElementById('register-modal');
const closeModalButton = modal.querySelector('.close-modal-button');
const transactionsButtons = document.querySelectorAll('.transactions-buttons');


newTransactionButton.addEventListener('click', function(e) {
    e.preventDefault()
    modal.classList.add('show');
})

closeModalButton.addEventListener('click', function() {
    modal.classList.remove('show');
})

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
})

transactionsButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove a classe 'active' de todos os botões
        transactionsButtons.forEach(btn => btn.classList.remove('active'));

        // Adiciona a classe 'active' ao botão clicado
        button.classList.add('active');
    })
})
