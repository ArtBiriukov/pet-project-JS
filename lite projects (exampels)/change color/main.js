'use strict'

const body = document.querySelector('body'),
  boxText = document.querySelector('.box__text'),
  boxBtn = document.querySelector('.box__btn');

boxText.textContent = 'rgb(218, 214, 214)';

boxBtn.addEventListener('click', () => {
  body.style.backgroundColor = '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase();
  boxText.textContent = body.style.backgroundColor;
});