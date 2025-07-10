function openCards(){
    var allElems = document.querySelectorAll('.elem');
var fullElemPage = document.querySelectorAll('.fullElem')
var fullElemPageBackBtn = document.querySelectorAll('.fullElem .back')


allElems.forEach(function(elem){
    elem.addEventListener('click',function(){
        fullElemPage[elem.id].style.display = 'block'
    })
})

fullElemPageBackBtn.forEach(function(back){
    back.addEventListener('click',function(){
        fullElemPage[back.id].style.display = 'none'
    })
})
}
openCards()

function todoList(){
    var currentTasks = []

    if(localStorage.getItem('currentTasks')){
        currentTasks = JSON.parse(localStorage.getItem('currentTasks'))
    }else{
        // allTask.innerHTML = `<h5>list is empty</h5>`
    }


    function renderTask(){
        var allTask = document.querySelector('.allTask')
        
        var sum = ''

        currentTasks.forEach(function(elem,idx){
            sum += `<div class="task"> 
                            <span class=${elem.imp}>Imp</span>
                            <details>
                              <summary>${elem.task}</summary>
                              <p>${elem.details}</p>
                            </details>
                            <button id=${idx}>Mark as Done</button>
                        </div>`
        })

        if (sum===''){
            allTask.innerHTML = `<h4>Task List is Empty</h4>`
        }else{
            allTask.innerHTML = sum
        }  
        
        localStorage.setItem('currentTasks',JSON.stringify(currentTasks))

        var markCompletedBtn = document.querySelectorAll('.task button')

        markCompletedBtn.forEach(function(btn){
            btn.addEventListener('click',function(){
                currentTasks.splice(btn.id,1)
                renderTask()
            })
        })
    }
    renderTask()


    let form = document.querySelector('.addTask form')
    let input = document.querySelector('.addTask form .taskHeading')
    let textArea = document.querySelector('.addTask form textarea')
    let taskCheckbox = document.querySelector('.addTask form #check')

    form.addEventListener('submit',function(page){
        page.preventDefault() 
        currentTasks.push(
            {
                task: input.value,
                details: textArea.value,     
                imp: taskCheckbox.checked
            }
        )

        renderTask()

        input.value = '';
        textArea.value = '';
        taskCheckbox.checked = false;
    })
}
todoList()

function dailyPlanner(){
    //task render through the wholeDaySum to dayPlanner html
    var dayPlanner = document.querySelector('.day-planner')

    // created blank object for local storage
    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    // made the data through arrray for 24 hours
    var hours = Array.from({length:18},(_,idx)=>`${6+idx}:00 - ${7+idx}:00`)


    // pushed the hours data in wholeDaySum
    var wholeDaySum = ''
    hours.forEach(function(elem,idx){

        var savedData = dayPlanData[idx] || ''

        wholeDaySum += `<div class="day-planner-time">
                        <p>${elem}</p>
                        <input id=${idx} type="text" placeholder="..." value=${savedData}>
                    </div>`
    })
    dayPlanner.innerHTML = wholeDaySum

        var dayPlannerInput = document.querySelectorAll('.day-planner .day-planner-time input')

        dayPlannerInput.forEach(function(elem){
            elem.addEventListener('input',function(){
                dayPlanData[elem.id] = elem.value
            localStorage.setItem('dayPlanData',JSON.stringify(dayPlanData))
        })
    })

    var clearButton = document.querySelector('.dailyPlannerFullPage .clear');
    function clearData(){
        localStorage.removeItem('dayPlanData');
        console.log('s')
        hours.forEach(function(elem,idx){

            var savedData = dayPlanData[idx] || ''
    
            wholeDaySum += `<div class="day-planner-time">
                            <p>${elem}</p>
                            <input id=${idx} type="text" placeholder="..." value=${savedData}>
                        </div>`
        })
        dayPlanner.innerHTML = wholeDaySum
    }
    clearButton.addEventListener('click',clearData)  
}
dailyPlanner()

function motivationalQuote(){
    var motivationQuote = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote(){

        let response = await fetch('https://api.quotable.io/random')
        let data = await response.json()

        motivationQuote.innerHTML = data.content
        motivationAuthor.innerHTML = '~ '+data.author
    }

    fetchQuote()
    var quoteRefresher = document.querySelector('.MotivationFullPage .quoteRefresh');
    quoteRefresher.addEventListener('click',fetchQuote)    
}
motivationalQuote()

function pomodoroTimer(){
    let totalSeconds = 25*60

    let timeInterval = null
    let timer = document.querySelector('.pomo-timer h1')
    var startBtn = document.querySelector(".pomo-timer .start-timer")
    var pauseBtn = document.querySelector(".pomo-timer .pause-timer")
    var resetBtn = document.querySelector(".pomo-timer .reset-timer")
    var session = document.querySelector('.pomodoroTimerFullPage .session')
    var isWorkSession = true

    function updateTimer(){
        let minutes = Math.floor(totalSeconds/60)
        let seconds = totalSeconds%60

        timer.innerHTML = `${String(minutes).padStart('2',0)}:${String(seconds).padStart('2',0)}`
    }


    function startTimer(){
        clearInterval(timeInterval)

        if(isWorkSession){
            timeInterval = setInterval(function(){
        
                if(totalSeconds>0){    
                    totalSeconds--
                    updateTimer()
                }else{
                    isWorkSession = false
                    clearInterval(timeInterval)
                    timer.innerHTML = '05:00'
                    totalSeconds = 5*60
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--blue)'
                }
            },1000)
        }else{
            timeInterval = setInterval(function(){
        
                if(totalSeconds>0){    
                    totalSeconds--
                    updateTimer()
                }else{
                    isWorkSession = true
                    clearInterval(timeInterval)
                    timer.innerHTML = '25:00' 
                    totalSeconds = 25*60
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                }
            },1000)
        }
    }

    function pauseTimer(){
        clearInterval(timeInterval)
    }
    function resetTimer(){
        clearInterval(timeInterval)
        totalSeconds = 25*60
        updateTimer()
    }

    startBtn.addEventListener('click',startTimer)
    pauseBtn.addEventListener('click',pauseTimer)
    resetBtn.addEventListener('click',resetTimer)
}
pomodoroTimer()

function weather(){
    
    var data = null
    var apiKey = '9d8aaf2257544202823173939250707';
    var header1Time = document.querySelector('.header1 h1')
    var header1Date = document.querySelector('.header1 h2')
    var header2Temp = document.querySelector('.header2 h2')
    var header2feelsLike = document.querySelector('.header2 .feelsLike')
    var header2sky = document.querySelector('.header2 .sky')
    var city = 'Faridabad'
    async function weatherAPICall(){
        var response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
        data = await response.json()
        console.log()
        
        var temperatureInCelsius = data.current.temp_c
        var temperatureFeelsLike = data.current.feelslike_c
        var skyWeather = data.current.condition.text

        header2Temp.innerHTML = `${temperatureInCelsius}°C`
        header2feelsLike.innerHTML = `Feels Like ${temperatureFeelsLike}°C`
        header2sky.innerHTML = `${skyWeather}`
    }   
    weatherAPICall()


    function timeDate(){
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthsOfYear = ['January', 'February', 'March'    , 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        var date = new Date()
        var dayOfWeek = daysOfWeek[date.getDay()]
        var monthOfYear = monthsOfYear[date.getMonth()]
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var tarik = date.getDate()
        var month = date.getMonth()
        var year = date.getFullYear()

        header1Date.innerHTML = `${tarik} ${monthOfYear}, ${year}`
        
        if(hours>11){
            header1Time.innerHTML = `${dayOfWeek}, ${hours-12}:${String(minutes).padStart('2',0)}:${String(seconds).padStart('2',0)} PM`
        }else{
            header1Time.innerHTML = `${dayOfWeek}, ${hours}:${String(minutes).padStart('2',0)}:${String(seconds).padStart('2',0)} AM`
        }
    }
    timeDate()

    setInterval(() => {
        timeDate()
    }, 1000);
}
weather()

function theme(){
    var theme = document.querySelector('header .header2 .theme');
    var rootElement = document.documentElement;
    var bgImage = document.querySelector('.allElems header')
    var flag = 0
    theme.addEventListener('click',function(){

        if(flag == 0){
            rootElement.style.setProperty('--primary','#93B1A6')
            rootElement.style.setProperty('--secondary','#040D12')
            rootElement.style.setProperty('--tri3','#183D3D')
            rootElement.style.setProperty('--tri2','#09724a')
            bgImage.style.backgroundImage = 'url(/nightSkyImage.jpeg)'
            flag = 1
        }else if(flag == 1){
            rootElement.style.setProperty('--primary','#F8F4E1')
            rootElement.style.setProperty('--secondary','#1b0a00')
            rootElement.style.setProperty('--tri3','rgb(91, 70, 45)')
            rootElement.style.setProperty('--tri2','#502901')
            bgImage.style.backgroundImage = 'url(/sunsetImage.avif)'
            flag = 0
        }
        // else if(flag == 2){
        //     rootElement.style.setProperty('--primary','#3E3232')
        //     rootElement.style.setProperty('--secondary','#E8D8C4')
        //     rootElement.style.setProperty('--tri3','#A87C7C')
        //     rootElement.style.setProperty('--tri2','#561C24')
        //     bgImage.style.backgroundImage = 'url(https://wallpaperbat.com/img/307824-sunny-day-wallpaper.jpg)'
        //     flag = 0
        // }
    })
}
theme()
