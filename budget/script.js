'use strict';

const start = document.getElementById('start'),
      cancel = document.getElementById('cancel'),
      incomeAdd = document.getElementsByTagName('button')[0],
      expensesAdd = document.getElementsByTagName('button')[1],
      depositCheck = document.querySelector('#deposit-check'),
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
      periodAmount = document.querySelector('.period-amount');

let expensesItems = document.querySelectorAll('.expenses-items'),
    incomeItems = document.querySelectorAll('.income-items'),
    incomeAmount = document.querySelector('.income-amount'),
    expensesAmount = document.querySelector('.expenses-amount');
    
    incomeTitle.setAttribute('pattern', '[А-Яа-яЁё\W\s]');
    expensesTitle.setAttribute('pattern', '[А-Яа-яЁё\W\s]');
    incomeAmount.setAttribute('pattern', '^[ 0-9]+$');
    expensesAmount.setAttribute('pattern', '^[ 0-9]+$');

let isNumber = function (num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
};


let appData = {
  budget : 0,
  budgetDay: 0,
  budgetMonth: 0,

  income: {},
  incomeMonth: 0,
  addIncome: [],

  expenses: {},
  expensesMonth: 0,
  addExpenses: [],

  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,

  
  start() {
    this.budget = +salaryAmount.value;
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();
    this.restartAllInput();
    this.showResult();
  },

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
  
    // this.deposit = false;
    // this.percentDeposit = 0;

    this.moneyDeposit = 0;
    this.showResult();
    incomePeriodValue.value = '';
    this.restartAllInput();
  },

  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcPeriod();

    periodSelect.addEventListener('mousemove', (e) => {
      incomePeriodValue.value = this.calcPeriod();
    });

  },

  restartAllInput () {
    const data = document.querySelector('.data');
    const allInput = data.querySelectorAll('input[type=text]');

    allInput.forEach(el => {

      if(!!el.hasAttribute('disabled', true)) {
          el.value = '';
          periodSelect.value = '1';
          el.removeAttribute('disabled');
          periodSelect.removeAttribute('disabled');
      } else {
          periodSelect.setAttribute('disabled', true);
          el.setAttribute('disabled', true)
      }
    })

    if (start.style.display === 'none') {
        start.style.display = 'block';
        cancel.style.display = 'none';
    } else {
        start.style.display = 'none'
        cancel.style.display = 'block';
    }
  },

  addExpensesBlock() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesAdd);

    //Реализация пустых value
    cloneExpensesItem.querySelector('.expenses-title').value = '';
    cloneExpensesItem.querySelector('.expenses-amount').value = '';

    expensesItems = document.querySelectorAll('.expenses-items');

    if(expensesItems.length === 3) {
      expensesAdd.style.display = 'none'
    }
  },

  addIncomeBlock() {
    let cloneIncomeItem = incomeItems[0].cloneNode(true);
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomeAdd);

    //Реализация пустых value
    cloneIncomeItem.querySelector('.income-title').value = '';
    cloneIncomeItem.querySelector('.income-amount').value = '';

    incomeItems = document.querySelectorAll('.income-items');

    if(incomeItems.length === 3) {
      incomeAdd.style.display = 'none'
    }
  },

  getExpenses() {
    expensesItems.forEach(elem => {
      let elemExpenses = elem.querySelector('.expenses-title').value;
      let cashExpenses = elem.querySelector('.expenses-amount').value;
      
      if (elemExpenses != '' && cashExpenses != '') {
        this.expenses[elemExpenses] = cashExpenses;
      }
    });


    // let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');
    // appData.addExpenses = addExpenses.toLowerCase().split(',');

    //   if (appData.addExpenses.length === 0 || appData.addExpenses[0].trim() === '') {
    //       console.log('Возможных расходов нет!');
    //   } else {
    //     let newWord;
    //     let newArr =[];

    //       for (let i = 0; i <appData.addExpenses.length; i++) {
    //         let word = appData.addExpenses[i].trim();
    //             newWord = word[0].toUpperCase()+ word.slice(1);
    //             newArr.push(newWord);
    //       }
    //     console.log(newArr.join(', ')); 
    //   }


  },

  getIncome() {

    incomeItems.forEach(elem => {
      let elemIncome = elem.querySelector('.income-title').value;
      let cashIncome = elem.querySelector('.income-amount').value;

      if(elemIncome != '' && cashIncome != '') {
        this.income[elemIncome] = cashIncome;
      }
    });



    // if(confirm('Есть ли у вас дополнительный заработок?')) {
    //   let itemIncome = prompt('Какой у вас дополнительный заработок?', 'Шабашки');

    //     while (isNumber(itemIncome)) {
    //       itemIncome = prompt('Какой у вас дополнительный заработок?');
    //     }

    //     let itemIncomeUp = itemIncome[0].toUpperCase()+itemIncome.slice(1);
    //     let cashIncome = prompt('Сколько в месяц вы на этом зарабатываете?', 10000);

    //     while (!isNumber(cashIncome)) {
    //       cashIncome = prompt('Сколько в месяц вы на этом зарабатываете?', 10000);
    //     }

    //   appData.income[itemIncomeUp] = cashIncome;
    // }

    for (let key in this.income){
      this.incomeMonth += +appData.income[key];
    }
  },

  getAddExpenses() {
    let addExpenses = additionalExpensesItem.value.split(',');

    addExpenses.forEach((item)=> {
      item = item.trim();
      if(item !== '') {
        this.addExpenses.push(item);
      }
    })
  },

  getAddIncome() {
    additionalIncomeItem.forEach((item)=> {
      let itemValue = item.value.trim();
      if(itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    })
  },

  getExpensesMonth() {
     for (const key in this.expenses) {
      let amout = +(this.expenses[key]);
      this.expensesMonth += amout;
     }
   },

  getBudget () {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.ceil(this.budgetMonth/30);
  },

  getTargetMonth() {
    let target = Math.round(targetAmount.value/this.budgetMonth);

    // 'Цель не будет достигнута!'

      if(this.budgetMonth <= 0) {
        return `Срок`;
       } else {
        return `${target} месяц(-а)`;
       } 
  },

  getStatusIncome() {
    
    if (this.budgetDay >= 1200) {
         return `У вас высокий уровень дохода и равен ${this.budgetDay} рублей`;
       } else if ( this.budgetDay < 1200 && this.budgetDay >= 600) {
         return `У вас средний уровень дохода и равен ${this.budgetDay} рублей`;
       } else if (this.budgetDay < 600 && this.budgetDay >= 0) {
         return `К сожалению у вас уровень дохода ниже среднего и равен ${this.budgetDay} рублей`;
       } else {
         return `Надо что то менять!!! Когда доход равен ${this.budgetDay} рублей`;
       }
  },

  getInfoDeposit() {
    this.deposit = confirm('Есть ли у вас депозит в банке?');
    
    if(this.deposit) {

        this.percentDeposit = prompt('Какой годовой процент по депозиту?', 10);
        while (!isNumber(this.percentDeposit)) {
          this.percentDeposit = prompt('Какой годовой процент по депозиту?', 10);
        }

        this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
        while (!isNumber(this.moneyDeposit)) {
          this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
        }
    }
  },

  calcPeriod() {
   return this.budgetMonth * periodSelect.value; 
  }
}

/**
 * Если использовать баид то проверку пустой строки нужно перносить в 
 * метод старт в котором сначало будет проводится проверка на пустую строку
 * а потом уже выполнение всех методов, в целом я и это сделал в 
 * методе стар под комментарием
 */

// start.addEventListener('click', appData.start.bind(appData));

/**
 * Тут получилась не явная привязка appData.start(); this смотрит на то что перед точкой
 * а смотрит он на объек appData
*/

start.addEventListener('click', () => {
  if(salaryAmount.value !== '') {
    appData.start();
  }
});

cancel.addEventListener('click', () => {
  appData.restart();
});

expensesAdd.addEventListener('click', appData.addExpensesBlock);
incomeAdd.addEventListener('click', appData.addIncomeBlock);

periodSelect.value = 1;
periodSelect.addEventListener('mousemove', (ev) => {
  periodAmount.innerText = ev.target.value;
})