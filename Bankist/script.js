'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*for(const movement of movements){
  if(movement>0){
    console.log(`you deposited ${movement}`)
  }
  else{
    console.log(`you withdrew ${Math.abs(movement)}`)
  }
}*/

movements.forEach(function(movement,i){
  if(movement>0){
    console.log(` movement ${i+1}: you deposited ${movement}`)
  }
  else{
    console.log(` movement ${i+1}: you withdrew ${Math.abs(movement)}`)
  }
})

/*const order=new Set(['pizza','pasta','kebab','pasta']);
for(const orders of order){
  console.log(orders);
}
const rest=new Map();
rest.set('name','bita');
console.log(rest.set('age','20'));
console.log(rest.get('name'));
console.log(rest.has('name'));
const arr=[1,2];
rest.set(arr,'test');
console.log(rest.get(arr));

const bita=new Map([['name','bita'],
  ['lastname','behzadipour']]
);
console.log(bita);
bita.forEach(function(value,key,map){
  console.log(`${key}:${value}`);
})
currencies.forEach(function(value,key,map){
  console.log(`${key}:${value}`);
})*/
const displayMovements=function(movements){
  containerMovements.innerHTML='';
  movements.forEach(function(mov,i,){
    const type=mov>0?'deposit':'withdrawal'
   const html=` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1}${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>`
        containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}
displayMovements(account1.movements);
console.log(containerMovements.innerHTML);

 const calcDisplayBalance=function(acc){
  acc.balance=acc.movements.reduce((acc,mov) => 
     acc+mov,0);
  labelBalance.textContent=`${acc.balance} €`;
};

const calcDisplaySummery=function(acc){
const income=acc.movements.filter(function(mov){
  return mov>0
}).reduce(function(acc,mov){
  return acc+mov;
},0)
labelSumIn.textContent=`${income}€`;
const out=acc.movements.filter(function(mov){
  return mov<0
}).reduce(function(acc,mov){
  return acc+mov;
},0)
labelSumOut.textContent=`${Math.abs(out)}€`;
const interest=acc.movements.filter(function(mov){
  return mov>0;
}).map(function(deposits){
  return (deposits*acc.interestRate)/100
}).filter(function(int){
  return int>=1
}).reduce(function(acc,int){
  return acc+int
})
labelSumInterest.textContent=`${interest}€`
}
/*calcDisplaySummery(account1.movements);*/

const createUsernames=function(accs){
  accs.forEach(function(acc){
    acc.username=acc.owner
    .toLowerCase().split(" ").map(function(name,i){
      return name[0];
    }).join("");
    console.log(acc.username);
  })
}
createUsernames(accounts);
console.log(accounts);

const updateUi=function(acc){
  //display movement
displayMovements(acc.movements);
//display balance
calcDisplayBalance(acc);
//display smmery
calcDisplaySummery(acc);
}
//login
let currentAccount;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount =accounts.find(function(acc){
 return acc.username===inputLoginUsername.value;
});
console.log(currentAccount);
if (currentAccount?.pin===Number(inputLoginPin.value)){
labelWelcome.textContent=`welcome back,${currentAccount.owner.split(' ')[0]}`
containerApp.style.opacity=100;
//clear input fields
inputLoginUsername.value='';
inputLoginPin.value='';
inputLoginPin.blur();
updateUi(currentAccount);
}
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const receiverAcc=accounts.find(function(acc){
     return acc.username===inputTransferTo.value
  })
  console.log(amount,receiverAcc);
  if (receiverAcc&&amount>0 && currentAccount.balance>=amount&&receiverAcc.username!==currentAccount.username){
    //doing the transfer moneyyyyy
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(currentAccount);
      }
}); 
//loan
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount>0&&currentAccount.movements.some(mov=>mov>=amount*0.1)){
currentAccount.movements.push(amount);
updateUi(currentAccount);

  }

})

//close account
btnClose.addEventListener('click',function(e){
  e.preventDefault();
 

if(inputCloseUsername.value===currentAccount.username&&Number(inputClosePin.value)===currentAccount.pin){
  const index=accounts.findIndex(function(acc){
     return acc.username===currentAccount.username
  })
  console.log(index);
  accounts.splice(index,1);
  containerApp.style.opacity=0;
  
  } inputClosePin.value='';
  inputCloseUsername.value='';});
 /*const deposits=movements.filter(function(mov){
  return mov>0;
})
console.log(deposits);*/

/*const arr=[];
for(const mov of movements){
  if(mov>0){
    console.log(mov)
   arr.push(mov)
  }
  else{
    console.log('withdraal');
  }
}
console.log(arr)*/

/*const balance=movements.reduce(function(acc,mov,i,arr){
  console.log(`iteration ${i}:${acc}`)
  return acc+mov;
},0)
console.log(balance);*/
/*const firstWithdrawal=movements.find(function(mov){
   return mov<0})
   console.log(movements);
  console.log(firstWithdrawal);*/
 /* const b = 'bita bhz';
   console.log(b.split(" ")[0]);*/

console.log(movements);
console.log(movements.includes(700));




