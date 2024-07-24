const addBudget = `
    <div id=addBudgetContainer>
    <h3>Add Budget</h3>
    <input type="text" id="budget" name="budget">
    <button>Holiii</button>
    </div>
    `;

const addExpense = `
    <div>
        <h3>Add Expense<h3/>
    <div/>
`
let mainContent = document.getElementById("mainContent")
console.log(mainContent)
const budgetElement = document.createElement('span') //TODO: guardar estas lineas de codigo para despues, ya que son las que resuelven el tema de agregar elementos a otros divs
budgetElement.innerHTML = addBudget;
mainContent.append(budgetElement)
//let title = document.getElementById("").append(content)

// select the element with a class called root
/*
const root = document.querySelector('.root')
// attach a shadow DOM to the selected element
root.attachShadow({ mode: 'open' })
// append the html element to the shadow DOM
root.shadowRoot.appendChild(htmlSection)*/
