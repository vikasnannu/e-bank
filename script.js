'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Vikas Nannu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-05-18T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Vikas Kumar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account3 = {
  owner: 'Vikas Nannu Kumar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi',
};

const account4 = {
  owner: 'Simmi Sonak',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];


/* ------------------------------------------------------------------------------------------ */
// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/* ------------------------------------------------------------------------------------------ */
// Functions

// Date Functions
const formatMovementDates = function (date, locale) {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0)
    return 'Today';
  if (daysPassed === 1)
    return 'Yesterday';
  if (daysPassed <= 7)
    return `${daysPassed} days ago`;
  else {
    return Intl.DateTimeFormat(locale).format(date);
  }

};

// International Format
const formnatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};


// Display Movements or Transactions
const displayMovement = function (acc, sort = false) {

  containerMovements.innerHTML = " ";
  // Whether to sort or not
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    // Type of Transaction
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Date and Format
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDates(date, acc.locale);
    // Formated Date
    const formattedMov = formnatCur(mov, acc.locale, acc.currency);
    // HTML content
    const html =
      `<div class="movements__row">
    <div class="movements__type movements__type--${type}"> ${i+1} ${type} </div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value"> ${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

};

// Display Balance 
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formnatCur(acc.balance, acc.locale, acc.currency);
};

// Display Summary 
const calcDisplaySummary = function (accs) {
  // for income
  const income = accs.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formnatCur(income, accs.locale, accs.currency);
  // for expense
  const out = accs.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formnatCur(Math.abs(out), accs.locale, accs.currency);
  // for interest
  const interest = accs.movements.filter(mov => mov > 0).map(deposit => (deposit * accs.interestRate) / 100).filter((int, i, arr) => int >= 1).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formnatCur(interest, accs.locale, accs.currency);
};

// Create usernames
const createUsernames = function (accs) {

  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(word => word[0]).join('');
  });

};

createUsernames(accounts);

// Update UI
const updateUI = function (accs) {
  // Display Movements
  displayMovement(accs);
  // Display Balance
  calcDisplayBalance(accs);
  //Display Summary
  calcDisplaySummary(accs);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    // In each callback call print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;
    // When 0 seconds, stop the timer and log out the user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  }
  // Set time to 5 minutes
  let time = 30;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
}


/* ---------------------------------------------------------------------------- */
// Even Handlers

// Global Variables
let currentAccount;
let timer;

// Login Functionality
btnLogin.addEventListener('click', function (e) {

  e.preventDefault();

  //we used find as we need to get back the whole user, not just name
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {

    // Display UI and Welcome! message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Set Dates
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // Check if there is already a timer
    if (timer) clearInterval(timer);
    // Start the Logout Timeout
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);

  };

});

// Transfer Functionality
btnTransfer.addEventListener('click', function (e) {

  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username == inputTransferTo.value);

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username) {
    // Doing the transer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    // Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

// Loan Functionality
btnLoan.addEventListener('click', function (e) {

  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  // Checking for the condition
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add the movement 
      currentAccount.movements.push(amount);
      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update the UI
      updateUI(currentAccount);
      // Reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

// Account Close Functionality
btnClose.addEventListener('click', function (e) {

  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === (currentAccount.pin)) {
    // Find the index of the element
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // delete the element from the array | automatically gets updated
    accounts.splice(index, 1);
    // remove the UI
    containerApp.style.opacity = 0;
  }

  inputTransferAmount.value = inputTransferTo.value = '';

});

// Sort the transactions
let sorted = false;
btnSort.addEventListener('click', function (e) {

  e.preventDefault();
  displayMovement(currentAccount, !sorted);
  sorted = !sorted;

});
