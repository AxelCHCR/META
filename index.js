//**********************Data structure (JSON). It contains the budget, the categories and the expenses used in META application**********************   
let data = {
    budget: { amount: 0, currency: 'USD' },
    categories: [],
    expenses: []
};

// Fetch exchange rate from the provided API
async function fetchExchangeRate() {
    try {
      const response = await fetch('https://tipodecambio.paginasweb.cr/api');
      const data = await response.json();
      exchangeRate = data.venta;
      document.getElementById('exchangeRate').innerText = exchangeRate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  }

// **********************Local Storage Management**********************
//Function that handles the load of data to GUI
function loadData() {
    const savedData = localStorage.getItem('expenseTrackerData');
    if (savedData) {
        data = JSON.parse(savedData);
        updateUI();
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
        updateUI();
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
        updateUI();
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

// Update UI elements
function updateUI() {
    updateCategoryList();
    updateExpenseList();
    updateExpenseSummary();
    document.getElementById('exchangeRate').innerText = exchangeRate;
}
// **********************Budget Edit**********************
// Open Edit Modal
function openEditModal(index) {
    const expense = data.expenses[index];
    document.getElementById('editExpenseAmount').value = expense.amount;
    document.getElementById('editExpenseDate').value = expense.date;
    document.getElementById('editExpenseCurrency').value = expense.currency;
    document.getElementById('editExpenseCategory').value = expense.category;
    document.getElementById('editExpenseModal').style.display = 'block';

    document.getElementById('saveEditBtn').onclick = function () {
        saveEdit(index);
    };
}

// Save Edit
function saveEdit(index) {
    const newAmount = parseFloat(document.getElementById('editExpenseAmount').value);
    const newDate = document.getElementById('editExpenseDate').value;
    const newCurrency = document.getElementById('editExpenseCurrency').value;
    const newCategory = document.getElementById('editExpenseCategory').value;

    if (newAmount > 0 && newDate && newCurrency && newCategory) {
        data.expenses[index] = { amount: newAmount, date: newDate, currency: newCurrency, category: newCategory };
        saveData();
        updateUI();
        closeModal();
    } else {
        alert('Please fill in all expense details correctly.');
    }
}
// Close Modal
function closeModal() {
    document.getElementById('editExpenseModal').style.display = 'none';
}

document.getElementById('closeModalBtn').addEventListener('click', closeModal);



// Expense Summary
function updateExpenseSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const categorySums = {};
    let totalExpenses = 0;

    data.expenses.forEach(expense => {
        if (!categorySums[expense.category]) {
            categorySums[expense.category] = 0;
        }
        categorySums[expense.category] += expense.amount;
        totalExpenses += expense.amount;
    });

    let summaryHTML = `<p>Total Expenses: ${totalExpenses} ${data.budget.currency}</p>`;
    summaryHTML += '<ul>';
    for (const [category, sum] of Object.entries(categorySums)) {
        summaryHTML += `<li>${category}: ${sum} ${data.budget.currency}</li>`;
    }
    summaryHTML += '</ul>';

    if (totalExpenses > data.budget.amount) {
        summaryHTML += '<p style="color: red;">Warning: Budget exceeded!</p>';
    }

    summaryContent.innerHTML = summaryHTML;
}

// Convert all expenses to CRC
document.getElementById('convertExpensesBtn').addEventListener('click', () => {
    data.expenses = data.expenses.map(expense => {
        if (expense.currency === 'USD') {
            return {
                ...expense,
                amount: expense.amount * exchangeRate,
                currency: 'CRC'
            };
        }
        return expense;
    });
    saveData();
    updateUI();
});
// Update UI elements
function updateUI() {
    updateCategoryList();
    updateExpenseList();
    updateExpenseSummary();
}
loadData();
updateUI();
fetchExchangeRate();