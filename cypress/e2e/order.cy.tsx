/// <reference types="cypress" />

const MODAL = '[data-cy=modal]';
const MODAL_CLOSE = '[data-cy=modal-close]';
const MODAL_OVERLAY = '[data-cy=modal-overlay]';
const CONSTRUCTOR_BUN_TOP = '[data-cy=constructor-bun-top]';
const CONSTRUCTOR_BUN_BOTTOM = '[data-cy=constructor-bun-bottom]';
const CONSTRUCTOR_FILLING = '[data-cy=constructor-filling]';
const CONSTRUCTOR_PRICE = '[data-cy=constructor-price]';
const ORDER_NUMBER = '[data-cy=order-number]';
const ORDER_BUTTON = 'Оформить заказ';

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'fake-access-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');

    // Мок данных пользователя
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Мок ингредиентов
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Мок создания заказа
    cy.intercept('POST', 'api/orders', {
      fixture: 'order-response.json'
    }).as('createOrder');

    // Открываем страницу
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  test('должен оформить заказ, показать номер и очистить конструктор', () => {
    // Собираем бургер 
    cy.contains('Краторная булка N-200i')
      .parent('[data-cy=ingredient-card]')
      .find('button')
      .click();

    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parent('[data-cy=ingredient-card]')
      .find('button')
      .click();

    cy.contains('Соус Spicy-X')
      .parent('[data-cy=ingredient-card]')
      .find('button')
      .click();

    // Проверяем, что ингредиенты в конструкторе
    cy.get(CONSTRUCTOR_BUN_TOP).should('contain', 'Краторная булка N-200i');
    cy.get(CONSTRUCTOR_FILLING).should('have.length.at.least', 2);
    cy.get(CONSTRUCTOR_PRICE).should('contain', '2333');
  });

  test('должен оформить заказ, показать номер и очистить конструктор', () => {
    // Оформляем заказ 
    cy.contains(ORDER_BUTTON).click();

    // Ждём запрос и проверяем, что модальное окно открылось
    cy.wait('@createOrder');
    cy.get(MODAL).should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');

    // Проверяем, что номер заказа отображается (из order-response.json)
    cy.get(ORDER_NUMBER).should('have.text', '12345');

    // Закрываем модальное окно 
    cy.get(MODAL_CLOSE).click();
    cy.get(MODAL).should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get(CONSTRUCTOR_BUN_TOP).should('not.contain', 'Краторная булка N-200i');
    cy.get(CONSTRUCTOR_BUN_BOTTOM).should(
      'not.contain',
      'Краторная булка N-200i'
    );
    cy.get(CONSTRUCTOR_FILLING).should('have.length', 0);
    cy.get(CONSTRUCTOR_PRICE).should('contain', '0');
  });

  test('должен закрыть модальное окно по клику на оверлей', () => {
    cy.contains(ORDER_BUTTON).click();
    cy.wait('@createOrder');
    cy.get(MODAL).should('be.visible');

    // Закрытие по оверлею
    cy.get(MODAL_OVERLAY).click({ force: true });
    cy.get(MODAL).should('not.exist');
  });

  test('должен закрыть модальное окно по нажатию Esc', () => {
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');
    cy.get(MODAL).should('be.visible');

    // Нажимаем Esc
    cy.get('body').type('{esc}');
    cy.get(MODAL).should('not.exist');
  });
});
