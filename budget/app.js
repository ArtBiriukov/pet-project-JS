'use strict';

const start = document.getElementById('start'),
  cancel = document.getElementById('cancel'),
  incomeAdd = document.getElementsByTagName('button')[0],
  expensesAdd = document.getElementsByTagName('button')[1],
  additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
  budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
  budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
  expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
  additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
  additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
  incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
  targetMonthValue = document.getElementsByClassName('target_month-value')[0],
  salaryAmount = document.querySelector('.salary-amount'),
  incomeTitle = document.querySelector('.income-title'),
  expensesTitle = document.querySelector('.expenses-title'),
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  periodAmount = document.querySelector('.period-amount'),
  expensesItems = document.querySelectorAll('.expenses-items'),
  incomeItems = document.querySelectorAll('.income-items'),
  incomeAmount = document.querySelector('.income-amount'),
  expensesAmount = document.querySelector('.expenses-amount'),
  depositCheck = document.getElementById('deposit-check'),
  depositBank = document.querySelector('.deposit-bank'),
  depositAmount = document.querySelector('.deposit-amount'),
  depositPercent = document.querySelector('.deposit-percent'),
  allInput = document.querySelectorAll('input');
class AppData {
  constructor() {
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.expensesMonth = 0;
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
  }

  start() {
    this.budget = salaryAmount.value;
    this.getExpInc();
    this.getExpensesMonth();
    this.getAddExpInc();
    this.getInfoDeposit();
    this.getBudget();
    this.restartAllInput();
    this.showResult();
  }

  restart() {
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.expensesMonth = 0;
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.showResult();
    incomePeriodValue.value = '';
    this.restartAllInput();
  }

  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcPeriod();

    periodSelect.addEventListener('mousemove', () => {
      incomePeriodValue.value = this.calcPeriod();
    });
  }

  restartAllInput() {
    const data = document.querySelector('.data');
    const allInput = data.querySelectorAll('input[type=text]');

    allInput.forEach(el => {
      if (!!el.hasAttribute('disabled', true)) {
        el.value = '';
        periodSelect.value = '1';
        periodAmount.textContent = '1';
        el.removeAttribute('disabled');
        periodSelect.removeAttribute('disabled');
        depositCheck.removeAttribute('disabled');
        depositBank.removeAttribute('disabled');
      } else {
        periodSelect.setAttribute('disabled', true);
        el.setAttribute('disabled', true);
        depositCheck.setAttribute('disabled', true);
        depositBank.setAttribute('disabled', true);
      }
    })

    if (start.style.display === 'none') {
      start.style.display = 'block';
      cancel.style.display = 'none';
    } else {
      start.style.display = 'none'
      cancel.style.display = 'block';
    }
  }

  addExpInc(e) {
    const targetBtn = e.target;
    const nameItem = e.target.parentNode.className;
    const expIncitem = e.target.previousElementSibling;
    const cloneItem = expIncitem.cloneNode(true);

    expIncitem.parentNode.insertBefore(cloneItem, targetBtn);

    //Реализация пустых value
    cloneItem.querySelector(`.${nameItem}-title`).value = '';
    cloneItem.querySelector(`.${nameItem}-amount`).value = '';

    //получаю все элементы со странице
    const expIncItems = document.querySelectorAll(`.${nameItem}-items`);

    if (expIncItems.length === 3) {
      targetBtn.style.display = 'none'
    }
  }

  getExpInc() {

    const arrExpInc = (arrItems) => {
      arrItems.forEach((item) => {
        const elemName = item.className.split('-')[0];
        const elemTitle = item.querySelector(`.${elemName}-title`).value;
        const elemCash = item.querySelector(`.${elemName}-amount`).value;
        if (elemTitle != '' && elemCash != '') {
          this[elemName][elemTitle] = elemCash;
        }
      });
    }

    arrExpInc(incomeItems);
    arrExpInc(expensesItems);

    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }

  getAddExpInc() {
    const additionalExpenses = additionalExpensesItem.value.split(',');

    const delSpace = (item, fromName) => {
      let itemValue = item.trim();
      if (itemValue !== '') {
        this[`add${fromName}`].push(itemValue);
      }
    }

    [...additionalIncomeItem].forEach(e => delSpace(e.value, 'Income'));
    [...additionalExpenses].forEach(e => delSpace(e, 'Expenses'));
  }

  getExpensesMonth() {
    for (const key in this.expenses) {
      let amout = +(this.expenses[key]);
      this.expensesMonth += amout;
    }
  }

  getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.ceil(this.budgetMonth / 30);
  }

  getTargetMonth() {
    let target = Math.round(targetAmount.value / this.budgetMonth);

    if (this.budgetMonth <= 0) {
      return `Срок`;
    } else {
      return `${target} месяц(-а)`;
    }
  }

  getStatusIncome() {
    if (this.budgetDay >= 1200) {
      return `У вас высокий уровень дохода и равен ${this.budgetDay} рублей`;
    } else if (this.budgetDay < 1200 && this.budgetDay >= 600) {
      return `У вас средний уровень дохода и равен ${this.budgetDay} рублей`;
    } else if (this.budgetDay < 600 && this.budgetDay >= 0) {
      return `К сожалению у вас уровень дохода ниже среднего и равен ${this.budgetDay} рублей`;
    } else {
      return `Надо что то менять!!! Когда доход равен ${this.budgetDay} рублей`;
    }
  }

  calcPeriod() {
    return this.budgetMonth * periodSelect.value;
  }

  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }

  changePercent() {
    const selectBankIndex = this.value;

    const checkedPercent = () => {
      if (depositPercent.value != +depositPercent.value || depositPercent.value > 100 || depositPercent.value < 0) {
        alert('Введите корректное значение в поле проценты');
        start.setAttribute('disabled', true);
      } else {
        start.removeAttribute('disabled');
        return depositPercent.value;
      }
    }

    if (selectBankIndex === 'other') {
      depositPercent.style.display = 'inline-block';
      depositPercent.addEventListener('change', checkedPercent)
    } else {
      depositPercent.style.display = 'none';
      depositPercent.value = selectBankIndex;
    }
  }

  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);
    }
  }

  eventListener() {
    //Проверка ввода текста и сумм
    const regExpText = /[^А-Яа-яЁё \.,;]/g,
      regExpNumb = /[^\d]/g;

    allInput.forEach(item => {

      const checkValue = () => {

        if (item.placeholder === 'Сумма') {
          item.value = item.value.replace(regExpNumb, '');
        } else if (item.placeholder === 'Наименование') {
          item.value = item.value.replace(regExpText, '');
        }
      };

      item.addEventListener('input', checkValue);
    })

    start.addEventListener('click', () => {
      if (salaryAmount.value !== '') {
        this.start();
      }
    });

    cancel.addEventListener('click', () => {
      this.restart();
    });

    expensesAdd.addEventListener('click', this.addExpInc);
    incomeAdd.addEventListener('click', this.addExpInc);

    periodSelect.addEventListener('mousemove', (ev) => {
      periodAmount.innerText = ev.target.value;
    });

    depositCheck.addEventListener('change', this.depositHandler.bind(this));
  }
}

const appData = new AppData();
appData.eventListener();