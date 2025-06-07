describe('Teste de sistema - Contratação de Pacote Customizável', () => {
  it('Faz login, preenche e finaliza um pacote personalizado com sucesso', () => {
    // 1. Acessa a página de login
    cy.visit('http://localhost:5173/login');

    // 2. Preenche e-mail e senha
    cy.get('input[type="email"]').type('felipecellet@hotmail.com');
    cy.get('input[type="password"]').type('123456');

    // 3. Clica no botão de login
    cy.contains('button', 'Entrar').click();

    // 4. Aguarda redirecionamento
    cy.url().should('not.include', '/login');

    // 5. Acessa a seção de pacotes personalizados
    cy.contains('button', 'Montar Meu Pacote').click();


    // 7. Preenche número de pessoas
    cy.get('[data-testid="input-pessoas"]').clear().type('60');


    // 8. Clica no botão Próximo
    cy.get('[data-testid="btn-proximo"]').click();

    cy.contains('button', 'Vodka').click();
    cy.get('[data-testid="btn-proximo"]').click();

    cy.contains('button', 'Gelo').click();
    cy.get('[data-testid="btn-proximo"]').click();
    
    // 9. Preenche CEP
    cy.get('[data-testid="input-cep"]').clear().type('01001000').blur();

    // 10. Aguarda cidade e estado carregarem
    cy.get('[data-testid="input-cidade"]', { timeout: 8000 }).should('not.have.value', '');
    cy.get('[data-testid="input-estado"]').should('not.have.value', '');

    // 11. Preenche bairro, número e complemento
    cy.get('[data-testid="input-bairro"]').type('Centro');
    cy.get('[data-testid="input-numero"]').type('123');
    cy.get('[data-testid="input-complemento"]').type('Casa 2');

    // 12. Clica no botão Finalizar
    cy.contains('button', 'Próximo').click();
    cy.contains('button', 'Finalizar Pedido').click();

    // 13. Verifica a mensagem de sucesso
    cy.get('[data-testid="mensagem-sucesso"]', { timeout: 8000 }).should(
      'contain',
      'Pedido personalizado enviado com sucesso'
    );
  });
});
