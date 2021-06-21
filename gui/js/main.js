function setProgressBarValue ( value ) {
    const progressBar = document.getElementById("progress-bar")
    progressBar.style.width = value + "%";
}

function animateProgressBar(i, speed) {
    if (i > 0){
        setTimeout(function () {
            setProgressBarValue (i - 1)
            animateProgressBar(i - 1, speed)
        }, speed)
    } else {
        close()
    } 
}

// From https://gist.github.com/dharmavir/936328
function getHttpRequestObject() {
    // Define and initialize as false
    var xmlHttpRequst = false;

    // Mozilla/Safari/Non-IE
    if (window.XMLHttpRequest) {
        xmlHttpRequst = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        xmlHttpRequst = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlHttpRequst;
}

// Does the AJAX call to URL specific with rest of the parameters
function doAjax(url, method, responseHandler, data) {
    // Set the variables
    url = url || "";
    method = method || "GET";
    async = true;
    data = data || {};
    data.token = window.token;

    if(url == "") {
        alert("URL can not be null/blank");
        return false;
    }
    var xmlHttpRequest = getHttpRequestObject();

    // If AJAX supported
    if(xmlHttpRequest != false) {
        xmlHttpRequest.open(method, url, async);
        // Set request header (optional if GET method is used)
        if(method == "POST")  {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
        }
        // Assign (or define) response-handler/callback when ReadyState is changed.
        xmlHttpRequest.onreadystatechange = responseHandler;
        // Send data
        xmlHttpRequest.send(JSON.stringify(data));
    } else {
        alert("Please use browser with Ajax support.!");
    }
}

//From https://stackoverflow.com/a/53758827
function shuffle(array, seed) {
    var m = array.length, t, i
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(random(seed) * m--)
  
      // And swap it with the current element.
      t = array[m]
      array[m] = array[i]
      array[i] = t
      ++seed
    }
  
    return array
  }
  
function random(seed) {
    var x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
}

function calcDaysBetweenDates(date1, date2){
    //We calculate the difference in UTC to prevent problems caused by the difference of summer/winter time
    const date1UTC = new Date(Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), 0, 0, 0))
    const date2UTC = new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), 0, 0, 0))

    try {
        const difference = date2UTC - date1UTC
        return difference / (1000 * 3600 * 24)
      } catch (error) {
        //app.exit(0)
      }
}

function calcDaysSinceLastChange(obj, daysSinceStartDate){
    if(daysSinceStartDate > 0){
        const motdCycle = daysSinceStartDate / obj.motd.length

        if(!Number.isInteger(motdCycle)){
            return daysSinceStartDate - (Math.floor(motdCycle) * obj.motd.length)
        }
    }
    return 0
}

function calcSeed(obj, daysSinceStartDate, today){
    const seedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
    const daysSinceLastChange = calcDaysSinceLastChange(obj, daysSinceStartDate)

    if(daysSinceStartDate > 0){         
            return seedDate.setDate(seedDate.getDate() - daysSinceLastChange)
    }
    
    return seedDate
}

function countWords(stringToCount){
    //From https://stackoverflow.com/a/37493957
    var m = stringToCount.match(/[^\s]+/g)
    return m ? m.length : 0
}

function chooseMOTD(motdJsonObj){
    const seed = calcSeed(motdJsonObj, daysSinceStartDate, today)
    const quotes = Array.from(Array(motdJsonObj.motd.length).keys())

    shuffle(quotes, seed)
    const daysSinceLastChange = calcDaysSinceLastChange(motdJsonObj, daysSinceStartDate)
 
    return motdJsonObj.motd[quotes[daysSinceLastChange]]
}

function fillMOTD(motdContent){
    MOTD = chooseMOTD(motdContent)
   
    const motdQuoteText = document.getElementById("motdQuoteText")
    const motdQuoteAuthor = document.getElementById("motdQuoteAuthor")
                
    motdQuoteText.innerHTML = MOTD.quote
    motdQuoteAuthor.innerHTML = MOTD.author
}

function startProgressAnimation(){
    const countedWords = countWords(MOTD.quote)
    const progressSpeed = countedWords * speed
    const progressBarValue = 100

    animateProgressBar(progressBarValue, progressSpeed * 10)
}

function resizeWindow() {
    const motdHeight = document.getElementById("motdQuote").offsetHeight
    const request = {motd_height: motdHeight}
 
    doAjax("/window/resize", "POST", false, request)
}

function close() {
    doAjax("/close", "POST")
}

const today = new Date
const startDate = new Date(2021, 0, 1)
const daysSinceStartDate = calcDaysBetweenDates(startDate, today)

let MOTD = ""
let speed = 0

let init = 0

function initHandler() {
    if (this.responseText && init == 0) {
        const receive = JSON.parse(this.responseText);

        const motdContent = receive.content
        speed = receive.speed

        fillMOTD(motdContent)

        resizeWindow()
        startProgressAnimation()
        init = init + 1
    }
}
