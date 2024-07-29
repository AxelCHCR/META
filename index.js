let data = {
    budget: { amount: 0, currency: 'USD' },
    categories: [],
    expenses: []
};

// Fetch exchange rate from the provided API
async function fetchExchangeRate() {
    try {
        const response = await fetch('https://tipodecambio.paginasweb.cr/api');
        const exchangeData = await response.json();
        exchangeRate = exchangeData.venta;
        document.getElementById('exchangeRate').innerText = exchangeRate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
    }
}

// Local Storage Management
function loadData() {
    const savedData = localStorage.getItem('expenseTrackerData');
    if (savedData) {
        data = JSON.parse(savedData);
        updateUI();
    }
}

function saveData() {
    localStorage.setItem('expenseTrackerData', JSON.stringify(data));
}

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

document.getElementById('uploadJSON').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        data = JSON.parse(e.target.result);
        saveData();  // Save data on local storage
        updateUI();  
    };
    reader.readAsText(file);
});

document.getElementById('downloadJSONBtn').addEventListener('click', function () {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('convertExpensesBtn').addEventListener('click', () => {
    data.expenses = data.expenses.map(expense => {
        if (expense.currency === 'USD') {
            return { ...expense, amount: expense.amount * exchangeRate, currency: 'CRC' };
        }
        return expense;
    });
    saveData();
    updateUI();
});
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


// Close Modal
function closeModal() {
    document.getElementById('editExpenseModal').style.display = 'none';
  }
  
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
function removeCategory(index) {
    const category = data.categories[index];
    if (data.expenses.some(expense => expense.category === category)) {
        alert('Cannot delete category with associated expenses.');
    } else {
        data.categories.splice(index, 1);
        saveData();
        updateUI();
    }
}
function removeExpense(index) {
    data.expenses.splice(index, 1);
    saveData();
    updateUI();
}
document.getElementById('themeSwitcher').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function updateUI() {
    updateCategoryList();
    updateExpenseList();
    updateExpenseSummary();
    createBarChart();
    createPieChart();
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
function editExpense(index) {

    const expense = data.expenses[index];
    document.getElementById('editExpenseAmount').value = expense.amount;
    document.getElementById('editExpenseDate').value = expense.date;
    document.getElementById('editExpenseCurrency').value = expense.currency;
    document.getElementById('editExpenseCategory').value = expense.category;
    
    // Show edit modal
    document.getElementById('editExpenseModal').style.display = 'block';
    
    document.getElementById('saveEditBtn').onclick = function() {
      expense.amount = parseFloat(document.getElementById('editExpenseAmount').value);
      expense.date = document.getElementById('editExpenseDate').value;
      expense.currency = document.getElementById('editExpenseCurrency').value;
      expense.category = document.getElementById('editExpenseCategory').value;
      
      saveData();
      updateUI();
      document.getElementById('editExpenseModal').style.display = 'none';
    };
  }
function updateCategoryList() {
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

function updateExpenseList() {
    const expenses = document.getElementById('expenses');
    expenses.innerHTML = '';
    data.expenses.forEach((expense, index) => {
        expenses.innerHTML += `<li>${expense.date} - ${expense.category} - ${expense.amount} ${expense.currency} <button onclick="editExpense(${index})">Edit</button> <button onclick="removeExpense(${index})">Remove</button></li>`;
    });
}

function updateExpenseSummary() {
    const summaryContent = document.getElementById('summaryContent');
    let totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    let summaryHTML = `<p>Total Budget: ${data.budget.amount} ${data.budget.currency}</p>`;
    summaryHTML += `<p>Total Expenses: ${totalExpenses} ${data.budget.currency}</p>`;
    if (totalExpenses > data.budget.amount) {
        summaryHTML += '<p style="color: red;">Warning: Budget exceeded!</p>';
    }
    summaryContent.innerHTML = summaryHTML;
}

function createBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [{
                label: 'Expenses',
                data: data.categories.map(category => {
                    return data.expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
                }),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.categories,
            datasets: [{
                label: 'Expenses',
                data: data.categories.map(category => {
                    return data.expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
                }),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses by Category'
                }
            }
        }
    });
}
fetchExchangeRate();
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();

    setInterval(fetchExchangeRate, 60000);  //Updates every 10 minutes
    loadTheme();
});