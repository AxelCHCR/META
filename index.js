const addBudget = `
    <div class=additionContainer>
    <h3>Add Budget</h3>
    <input type="text" id="budget" name="budget">
    <button>Holiii</button>
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
    <div id=informationContainer>Soy una cajota</div>
`
let mainContent = document.getElementById("mainContent")
console.log(mainContent)
const addBudgetElement = document.createElement('span') //TODO: guardar estas lineas de codigo para despues, ya que son las que resuelven el tema de agregar elementos a otros divs
const addExpenseElement = document.createElement('span')
const informationElement = document.createElement('span')
addBudgetElement.innerHTML = addBudget;
addExpenseElement.innerHTML = addExpense;
informationElement.innerHTML = informationBox;
mainContent.append(addBudgetElement)
mainContent.append(addExpenseElement)
mainContent.append(informationElement)
//let title = document.getElementById("").append(content)

// select the element with a class called root
/*
const root = document.querySelector('.root')
// attach a shadow DOM to the selected element
root.attachShadow({ mode: 'open' })
// append the html element to the shadow DOM
root.shadowRoot.appendChild(htmlSection)*/
