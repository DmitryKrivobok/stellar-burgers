/// <reference types="cypress" />

describe('Конструктор бургера', () => {
    beforeEach(() => {
      // Перехватываем запрос к API и возвращаем моковые данные
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  
      cy.visit('/');
      cy.wait('@getIngredients');
    });
  
    test('должен загрузить и отобразить ингредиенты', () => {
      cy.get('[data-cy=burger-ingredients]').should('be.visible');
      cy.get('[data-cy=ingredient-card]').should('have.length', 3);
  
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Филе Люминесцентного тетраодонтимформа').should('be.visible');
      cy.contains('Соус Spicy-X').should('be.visible');
    });
  
    test('должен открывать модальное окно с деталями ингредиента', () => {
      cy.get('[data-cy=ingredient-card]').first().click();
  
      cy.get('[data-cy=modal]').should('be.visible');
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
  
      // Закрыть по клику на крестик
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
  
      // Повторно открыть и закрыть по оверлею
      cy.get('[data-cy=ingredient-card]').first().click();
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.get('[data-cy=modal]').should('not.exist');
    });
  
    test('должен добавлять булочку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parent('[data-cy=ingredient-card]')
        .find('button')
        .click();
  
      cy.get('[data-cy=constructor-bun-top]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-bun-bottom]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-price]').should('contain', '1255');
    });
  
    test('должен добавлять начинку в конструктор', () => {
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent('[data-cy=ingredient-card]')
        .find('button')
        .click();
  
      cy.get('[data-cy=constructor-filling]').should('contain', 'Филе Люминесцентного');
      cy.get('[data-cy=constructor-price]').should('contain', '988');
    });
  
    test('должен корректно рассчитывать итоговую стоимость', () => {
      // Добавляем булочку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .click();
  
      // Добавляем начинку
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .click();
  
      // Добавляем соус
      cy.contains('Соус Spicy-X')
        .parent()
        .find('button')
        .click();
  
      // Проверяем сумму: 1255 (булка) + 988 (начинка) + 90 (соус) = 2333
      cy.get('[data-cy=constructor-price]').should('contain', '2333');
    });
  
    test('должен позволять перетаскивать начинку внутри конструктора', () => {
      // Добавляем два ингредиента
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .click();
  
      cy.contains('Соус Spicy-X')
        .parent()
        .find('button')
        .click();
  
      // Проверяем порядок
      cy.get('[data-cy=constructor-filling]').eq(0).should('contain', 'Филе');
      cy.get('[data-cy=constructor-filling]').eq(1).should('contain', 'Spicy-X');
  
      // Перетаскивание: пока Cypress не поддерживает drag-and-drop "из коробки",
      // можно проверить наличие элементов управления или использовать кастомную команду
      // (если реализовано через HTML5 Drag and Drop)
    });
  
    // Если реализовано оформление заказа
    test.skip('должен оформлять заказ (если авторизован)', () => {
      // Предположим, пользователь авторизован
      cy.setCookie('accessToken', 'fake-token');
      window.localStorage.setItem('refreshToken', 'fake-refresh');
  
      // Добавляем ингредиенты
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Филе Люминесцентного').parent().find('button').click();
  
      cy.contains('Оформить заказ').click();
  
      cy.intercept('POST', 'api/orders', {
        fixture: 'order-response.json'
      }).as('createOrder');
  
      cy.wait('@createOrder');
  
      cy.get('[data-cy=modal]').should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });
  