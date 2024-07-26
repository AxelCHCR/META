//**********************Data structure (JSON). It contains the budget, the categories and the expenses used in META application**********************   
let data = {
    budget: { amount: 0, currency: 'USD' },
    categories: [],
    expenses: []
};


// **********************Local Storage Management**********************
//Function that handles the load of data to GUI
function loadData() {
    const savedData = localStorage.getItem('expenseTrackerData');
    if (savedData) {
        data = JSON.parse(savedData);
        //updateUI(); Future function
    }
}
// Function that handles the save of data from GUI
function saveData() {
    localStorage.setItem('expenseTrackerData', JSON.stringify(data));
}


//**********************DOM manipulation of events**********************
// Budget Management (Adding and validating)
document.getElementById('setBudgetBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('budgetAmount').value);
    const currency = document.getElementById('budgetCurrency').value;
    if (amount > 0) {
        data.budget = { amount, currency };
        saveData();
        //updateUI();
    } else {
        alert('Please enter a valid budget amount.');
    }
});
// Category Management
document.getElementById('addCategoryBtn').addEventListener('click', () => {
    const categoryName = document.getElementById('categoryName').value.trim();
    if (categoryName && !data.categories.includes(categoryName)) {
      data.categories.push(categoryName);
      saveData();
      updateUI();
      document.getElementById('categoryName').value = '';
    } else {
      alert('Please enter a unique category name.');
    }
  });
// Expense Management
document.getElementById('addExpenseBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    const currency = document.getElementById('expenseCurrency').value;
    const category = document.getElementById('expenseCategory').value;
    
    if (amount > 0 && date && category) {
      data.expenses.push({ amount, date, currency, category });
      saveData();
      updateUI();
      document.getElementById('expenseAmount').value = '';
      document.getElementById('expenseDate').value = '';
    } else {
      alert('Please fill in all expense details correctly.');
    }
  });
  


function updateCategoryList() { //handles update and display of categories
    const categoryList = document.getElementById('categoryList');
    const expenseCategory = document.getElementById('expenseCategory');
    const editExpenseCategory = document.getElementById('editExpenseCategory');
    categoryList.innerHTML = '';
    expenseCategory.innerHTML = '';
    editExpenseCategory.innerHTML = '';
    data.categories.forEach((category, index) => {
        categoryList.innerHTML += `<li>${category} <button onclick="deleteCategory(${index})">Delete</button></li>`;
        expenseCategory.innerHTML += `<option value="${category}">${category}</option>`;
        editExpenseCategory.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function deleteCategory(index) {
    const category = data.categories[index];
    if (data.expenses.some(expense => expense.category === category)) {
      alert('Cannot delete category with associated expenses.');
    } else {
      data.categories.splice(index, 1);
      saveData();
      //updateUI();
    }
  }

  function updateExpenseList() {
    const expenseList = document.getElementById('expenses');
    expenseList.innerHTML = '';
    data.expenses.forEach((expense, index) => {
      expenseList.innerHTML += `
        <li>
          ${expense.amount} ${expense.currency} - ${expense.category} (${expense.date})
          <button onclick="openEditModal(${index})">Edit</button>
          <button onclick="deleteExpense(${index})">Delete</button>
        </li>
      `;
    });
  }
const addBudget = `
    <div class=additionContainer>
    <h3>Add Budget</h3>
    <input type="text" id="budget" name="budget" placeholder="amount">
    <button class="button" type="submit">Holiii</button>
    </div>
    `;

const addExpense = `
    <div class=additionContainer>
        <h3>Add Expense<h3/>
        <label for="expenseTitle">Expense Title:</label>
        <input type="text" id="fname" name="expenseTitle">
        <label for="amount">Amount:</label>
        <input type="text" id="fname" name="amount">
        <button class="button" type="submit">Add Expense</button>
    <div/>
`

const informationBox = `
    <div id=informationContainer></div>
`
//This is the component that contains general information of  expenses
const informationLabel = (label, amount) => {
    return `
    <h4 class=amountLabel>${label} : ${amount} </h4>
    `
}
let mainContent = document.getElementById("mainContent")
const addBudgetElement = document.createElement('span') //TODO: guardar estas lineas de codigo para despues, ya que son las que resuelven el tema de agregar elementos a otros divs
const addExpenseElement = document.createElement('span')
const informationElement = document.createElement('span')


addBudgetElement.innerHTML = addBudget;
addExpenseElement.innerHTML = addExpense;
informationElement.innerHTML = informationBox;

mainContent.append(addBudgetElement)
mainContent.append(addExpenseElement)
mainContent.append(informationElement)

const amounts =
{
    "total amount": 2000,
    "total expenses": 1000,
    "budget left": 1000
}
/*for (const element in amounts) { code not needed anymore
    const textInformationElement = document.createElement('span')
    let informationContent = document.getElementById("informationContainer")
    textInformationElement.innerHTML = informationLabel(element, amounts[element])
    //textInformationElement.innerHTML = informationLabel("Total Expenses", 1000)
    informationContent.append(textInformationElement)
}*/

//let title = document.getElementById("").append(content)

// select the element with a class called root
/*
const root = document.querySelector('.root')
// attach a shadow DOM to the selected element
root.attachShadow({ mode: 'open' })
// append the html element to the shadow DOM
root.shadowRoot.appendChild(htmlSection)*/
