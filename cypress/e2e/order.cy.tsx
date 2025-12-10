/// <reference types="cypress" />

describe('Оформление заказа', () => {
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

  //работает
  it('добавление ингредиентов в конструктор', () => {
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

    cy.get('[data-cy=constructor-bun-1]')
      .contains('Ингредиент 1')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Ингредиент 1')
      .should('exist');

    cy.get('[data-cy=constructor-ingredients]')
      .should('exist')
      .and('be.visible')
      .contains('Ингредиент 2')
      .should('exist');

    cy.get('[data-cy=constructor-ingredients]')
      .should('exist')
      .and('be.visible')
      .contains('Ингредиент 3')
      .should('exist');
  });

  it('открытие модального окна ингредиента', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Ингредиент 1').click({ force: true });
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals', { timeout: 10000 }).should('exist');
    cy.get('#modals')
      .contains('Ингредиент 1', { timeout: 10000 })
      .should('exist');
  });

  it('закрывается по крестику', () => {
    cy.contains('Ингредиент 2').click({ force: true });
    cy.get('#modals', { timeout: 15000 }).should('exist');
    cy.get('#modals [data-cy=modal-close]')
      .should('exist')
      .click({ force: true });
    cy.get('#modals').should('not.be.visible');
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('проверки что бургер в конструкторе', () => {
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
  });

  //работает
  it('оформление заказа', () => {
    cy.get('[data-cy=order-summ]', { timeout: 10000 })
      .should('be.enabled')
      .and('be.visible')
      .click({ force: true });
  });

  it('открытие и закрытие модального окна заказа', () => {
    cy.get('#modals', { timeout: 10000 }).should('be.visible');
    cy.contains('идентификатор заказа', { timeout: 10000 }).should(
      'be.visible'
    );

    cy.get('[data-cy=order-number]', { timeout: 10000 }).should(
      'have.text',
      '12345'
    );

    cy.get('[data-cy=modal-close]', { timeout: 10000 }).click({ force: true });
    cy.get('#modals').should('not.exist');
  });

  //работает
  it('проверка очистки конструктора', () => {
    cy.get('[data-cy=constructor-bun-1]').should('not.exist');
    cy.get('[data-cy=constructor-bun-2]').should('not.exist');
    cy.get('[data-cy=constructor-ingredients]').should('not.exist');
  });
});
