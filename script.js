var budgetCalculator=(function(){
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var Expense=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };

    Expense.prototype.calcPercentage= function(totalIncome){
        if(totalIncome>0)
        this.percentage=Math.round((this.value/totalIncome)*100);
        else this.percentage=-1;

    };

    Expense.prototype.getPercentage= function(){
        return this.percentage;
    };
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(current){
            sum+=current.value;
        });
        data.totals[type]=sum;
    };
    var data={
        allItems: {
            inc:[],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget:0,
        percentage:-1
    };
    
    return {
        addItem: function(type,des,val){
            var newItem,ID;
            // Creating new ID
            if(data.allItems[type].length === 0)ID=1;
            else
            ID=data.allItems[type][data.allItems[type].length-1].id +1;
            if(type==='inc')
            {
                newItem=new Income(ID,des,val);
            }
            else if(type==='exp')
            {
                newItem=new Expense(ID,des,val);
            }
            // Push it into the DS
            data.allItems[type].push(newItem);
            // return newItem
            return newItem;
        },
        deleteItem: function(type,id){
            var ids,index;
            ids=data.allItems[type].map(function(current){
                return current.id;

            });
            index=ids.indexOf(id);
            if(index!== -1)
            {
                data.allItems[type].splice(index,1);
            }


        },
        calculateBudget: function(){
            // calculate total income and total expenses
            calculateTotal('inc');
            calculateTotal('exp');
            // calculate total=income-expenses
            data.budget=data.totals.inc-data.totals.exp;
            // calculate the  expense percentage
            if(data.totals.inc > 0)
            data.percentage=Math.round(data.totals.exp/data.totals.inc*100);
            else
            data.percentage=-1;
        },
        calculatePercentage:function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },
        getPercentage:function(){
            var allPercentage;
            allPercentage=data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPercentage;
        },
        getBudget: function(){
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            };
        },
        testing: function(){
            console.log(data);
        }
    };
    
})();
// ---------------------------------------------------------------------------------------------------------------------------

var UIController=(function(){
    var DOMString={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        expenseContainer:'.expenses__list',
        incomeContainer:'.income__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expPerLabel:'.item__percentage',
        monthLabel:'.budget__title--month'
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMString.inputType).value, //inc or exp
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)
            };
            
        },
        addListItem: function(obj,type){
            var html,newHtml,element;
            // create html string with placeholder text
            if(type==='inc')
            {
                element=DOMString.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">+ %value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            else if(type==='exp')
            {
                element=DOMString.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            // replace the placeholder string with actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        deleteListItem: function(selectorId){
            var el=document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
        clearFields: function(){
            var fields,fieldsArr;
            fields=document.querySelectorAll(DOMString.inputDescription+','+DOMString.inputValue);
            fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value="";
            });
            fieldsArr[0].focus();
        },
        displayBudget:function(obj){
            
            
            document.querySelector(DOMString.budgetLabel).textContent=obj.budget;
            document.querySelector(DOMString.incomeLabel).textContent=obj.totalInc;
            document.querySelector(DOMString.expensesLabel).textContent=obj.totalExp;
            if(obj.percentage>0)
            document.querySelector(DOMString.percentageLabel).textContent=obj.percentage +'%';
            else
            document.querySelector(DOMString.percentageLabel).textContent='--';
        },
        displayPercentage:function(percentage){
            var fields=document.querySelectorAll(DOMString.expPerLabel);   //return nodeList
            var nodeListForEach=function(list,callback){
                for(var i=0;i<list.length;i++)
                {
                    callback(list[i],i);
                }
            };
            nodeListForEach(fields,function(current,index){
                if(percentage[index]>0)current.textContent=percentage[index]+'%';
                else current.textContent='---';
            });
        },
        displayMonth:function(){
            var now,month,months,year;
            now=new Date();
            month=now.getMonth();
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            year=now.getFullYear();
            document.querySelector(DOMString.monthLabel).textContent='  '+months[month]+'-'+year;
        },
        getDOMString: function(){
            return DOMString;
        }
    };

})();
// ---------------------------------------------------------------------------------------------------------------------------

var controller=(function(budgetCtrl,UICtrl){

    var setEventListeners=function(){
        var DOM=UICtrl.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13) // 'which' is supported is older browsers
                ctrlAddItem();
        });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)
    };
    
    var updateBudget=function(){
        // calculate budget.
        budgetCtrl.calculateBudget();
        // return budget.
        var budget=budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    var updatePercentage=function(){
        // calculate percentage
        budgetCtrl.calculatePercentage();
        // read percentage 
        var percentages=budgetCtrl.getPercentage();
        // update UI
        UICtrl.displayPercentage(percentages);

    };

    var ctrlAddItem=function(){
        // Get the input from UI
        var input=UICtrl.getInput();
        // console.log(input);
        // Add the item to budget controller
        if(input.description!=="" && !isNaN(input.value) && input.value>0)
        {

            var newItem=budgetCtrl.addItem(input.type,input.description,input.value);
            // Add the item to UI
            UICtrl.addListItem(newItem,input.type);
            // clear fields after adding
            UICtrl.clearFields();
            // calculate & update budget
            updateBudget();
            updatePercentage();
        }

    };

    var ctrlDeleteItem=function(event){
        var itemId,splitId,type,Id;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log(itemId);
        if(itemId)
        {
            splitId=itemId.split('-');
            type=splitId[0];
            Id=parseInt(splitId[1]);
            budgetCtrl.deleteItem(type,Id);
            UICtrl.deleteListItem(itemId);
            updateBudget();
            updatePercentage();
        }

    };
    
    return {
        init: function(){
            console.log("Application has started.");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setEventListeners();
        }
    };

})(budgetCalculator,UIController);
// ----------------------------------------------------------------------------------------------------------------------------

controller.init();