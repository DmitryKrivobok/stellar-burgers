/// <reference types="cypress" />

describe('Оформление заказа', () => {
    beforeEach(() => {
      // Моковые токены
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
  
    it('должен оформить заказ, показать номер и очистить конструктор', () => {
      // --- 1. Собираем бургер ---
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
      cy.get('[data-cy=constructor-bun-top]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-filling]').should('have.length.at.least', 2);
      cy.get('[data-cy=constructor-price]').should('contain', '2333');
    });
  
    it('должен оформить заказ, показать номер и очистить конструктор', () => {
      // --- 2. Оформляем заказ ---
      cy.contains('Оформить заказ').click();
  
      // Ждём запрос и проверяем, что модальное окно открылось
      cy.wait('@createOrder');
      cy.get('[data-cy=modal]').should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
  
      // Проверяем, что номер заказа отображается (из order-response.json)
      cy.get('[data-cy=order-number]').should('have.text', '12345');
  
      // --- 3. Закрываем модальное окно ---
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
  
      // --- 4. Проверяем, что конструктор пуст ---
      cy.get('[data-cy=constructor-bun-top]').should('not.contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-bun-bottom]').should('not.contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-filling]').should('have.length', 0);
      cy.get('[data-cy=constructor-price]').should('contain', '0');
    });
  
    it('должен закрыть модальное окно по клику на оверлей', () => {
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('[data-cy=modal]').should('be.visible');
  
      // Закрытие по оверлею
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');
    });
  
    it('должен закрыть модальное окно по нажатию Esc', () => {
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('[data-cy=modal]').should('be.visible');
  
      // Нажимаем Esc
      cy.get('body').type('{esc}');
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });
  