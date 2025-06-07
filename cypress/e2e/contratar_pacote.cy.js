describe('Teste de sistema - Contratação de Pacote Pronto', () => {
  it('Faz login, acessa pacote e realiza contratação com sucesso', () => {
    // 1. Acessa a página de login
    cy.visit('http://localhost:5173/login');

    // 2. Preenche e-mail e senha
    cy.get('input[type="email"]').type('felipecellet@hotmail.com');
    cy.get('input[type="password"]').type('123456');

    // 3. Clica no botão de login
    cy.contains('button', 'Entrar').click();

    // 4. Aguarda redirecionamento
    cy.url().should('not.include', '/login');

    // 5. Navega até a seção de pacotes
    cy.contains('button', 'Pacotes').should('be.visible').click();

    // 6. Clica em "Contratar Pacote"
    cy.contains('button', 'Contratar Pacote').first().click();

    // 7. Preenche número de pessoas
    cy.get('[data-testid="input-pessoas"]').clear().type('60');

    // 8. Abre o seletor de data e escolhe uma data futura garantida
    cy.get('input[placeholder="Selecione a data"]').click();

    // Seleciona o dia 25 visível do mês atual (ignora dias fora do mês)
    cy.get('.react-datepicker__day--025:not(.react-datepicker__day--outside-month)')
    .first()
    .click();


    // 9. Preenche o CEP
    cy.get('[data-testid="input-cep"]').clear().type('01001000').blur();

    // 10. Aguarda cidade e estado serem preenchidos automaticamente
    cy.get('[data-testid="input-cidade"]', { timeout: 8000 }).should('not.have.value', '');
    cy.get('[data-testid="input-estado"]').should('not.have.value', '');

    // 11. Preenche bairro, número e complemento
    cy.get('[data-testid="input-bairro"]').type('Centro');
    cy.get('[data-testid="input-numero"]').type('123');
    cy.get('[data-testid="input-complemento"]').type('Apto 42');

    // 12. Confirma que botão está habilitado e clica
    cy.get('[data-testid="btn-contratar"]').should('not.be.disabled').click();

    // 13. Verifica se a mensagem de sucesso aparece
    cy.get('[data-testid="mensagem-sucesso"]', { timeout: 5000 })
      .should('contain', 'Pedido enviado com sucesso');
  });
});
