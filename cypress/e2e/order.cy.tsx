/// <reference types="cypress" />

describe('Тесты бургерной', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'fake-access-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');

    cy.intercept('GET', '/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '/api/orders', {
      fixture: 'order-response.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('открытие модального окна ингредиента', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Ингредиент 1', { timeout: 10000 }).click({ force: true });
    cy.contains('Детали ингредиента', { timeout: 10000 }).should('exist');
    cy.get('#modals')
      .contains('Ингредиент 1', { timeout: 10000 })
      .should('exist');
  });

  it('закрытие модального окна по крестику', () => {
    cy.contains('Ингредиент 1').click({ force: true });
    cy.get('#modals', { timeout: 15000 }).should('exist');
    cy.get('#modals [data-cy=modal-close] svg')
      .should('exist')
      .click({ force: true });
    cy.get('#modals').should('not.be.visible');
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('оформление заказа', () => {
    cy.get('[data-cy=bun-ingredients]', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .contains('Добавить')
      .click({ force: true });
    cy.get('[data-cy=mains-ingredients]')
      .contains('Добавить')
      .click({ force: true });
    cy.get('[data-cy=sauses-ingredients]')
      .contains('Добавить')
      .click({ force: true });

    cy.get('[data-cy^=constructor-bun-1]', { timeout: 15000 }).should(
      'contain.text',
      'Ингредиент 1'
    );

    cy.get('[data-cy=constructor-bun-2]').should(
      'contain.text',
      'Ингредиент 1'
    );

    cy.get('[data-cy^=constructor-ingredients]', { timeout: 15000 })
      .should('contain.text', 'Ингредиент 2')
      .and('contain.text', 'Ингредиент 3');

    cy.get('[data-cy=order-summ]')
      .should('be.enabled')
      .and('be.visible')
      .click({ force: true });

    cy.get('#modals').should('exist');
    cy.contains('идентификатор заказа').should('exist');
    cy.get('[data-cy=order-number]').should('have.text', '12345');
    cy.get('[data-cy=modal-close] svg').click({ force: true });
    cy.get('#modals').should('not.be.visible');

    cy.get('[data-cy^=constructor-ingredients]')
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get('[data-cy^=constructor-ingredients]')
      .contains('Ингредиент 2')
      .should('not.exist');
    cy.get('[data-cy^=constructor-ingredients]')
      .contains('Ингредиент 3')
      .should('not.exist');
  });
});
