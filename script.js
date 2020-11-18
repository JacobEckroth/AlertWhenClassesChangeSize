submitButton = document.getElementById("addToSchedule");
submitButton.addEventListener("click", addNewClass);

let generateScheduleButton = document.getElementById("generateSchedules");
generateScheduleButton.addEventListener("click", generateSchedules);

let prevScheduleButton = document.getElementById("prevSchedule");
prevScheduleButton.addEventListener("click", showPreviousSchedule);
let nextScheduleButton = document.getElementById("nextSchedule", showNextSchedule);
nextScheduleButton.addEventListener("click", showNextSchedule);


let currentClasses = []; //all the classes currently added.
let classNames = []; //keep track of the class names.

let currentScheduleIndex = 0;
let possibleSchedules = []; //all the possible schedules
let scheduleOrder = []; //keeps track whether schedule are like 0,1,2,3,4,5 or randomized like 3,0,2,2


let classColors = ["red", "green", "blue", "yellow", "purple"]
let classColorsUsedAlready = [false, false, false, false, false];


function addNewClass() {
    let url = "/classRequest/" + document.getElementById("className").value + "/" + document.getElementById("termSelector").value + '/' + document.getElementById("subjectSelector").value + '/' + document.getElementById("campusSelector").value;
    var request = new XMLHttpRequest();
    let className = document.getElementById("className").value;
    classNames.push(className);
    request.open('GET', url);
    request.send();
    request.addEventListener('load', function (event) {
        alert("Got Response for Class: " + className);
        console.log("got response");
        var results = JSON.parse(request.response);

        let testClass = {}
        testClass.name = className;
        testClass.data = results;
        //storing the name of the class as the last thing in the class.className

        currentClasses.push(testClass);
        showNewClass();


    });
}



function showNewClass() {
    var classesHolder = document.getElementById("classesHolder");
    var individualHolder = document.createElement("div");
    var className = classNames[classNames.length - 1]
    individualHolder.style.width = "100%";
    individualHolder.style.display = "inline-block";
    individualHolder.style.height = 100 / classNames.length + "%"
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";

    var classNameP = document.createElement("p");
    classNameP.style.display = "inline-block";
    classNameP.classList.add("className");
    classNameP.textContent = className;
    individualHolder.appendChild(classNameP);
    individualHolder.appendChild(deleteButton);
    classesHolder.appendChild(individualHolder);
    deleteButton.id = className + "-deleteButton";
    deleteButton.textContent = "Remove";
    deleteButton.height = "100%";


}


var calendar = document.getElementById("calendar");
//calender stuff here

var dayWidth;
var hourHeight;
var calendarTop;
var calendarLeft;


window.addEventListener("load", setUpCalendarSize);

function setUpCalendarSize() {
    var calendarWidth = calendar.width;
    var calendarHeight = calendar.height;
    calendarTop = 25; //may be temporary, works on my device.

    calendarLeft = calendarWidth * .10;
    drawCalendarGrid();
}

function drawCalendarGrid() {



    var calendarWidth = calendar.width - calendarLeft;
    var calendarHeight = calendar.height - calendarTop;

    var ctx = calendar.getContext("2d");
    ctx.clearRect(0, 0, calendar.width, calendar.height);


    var daysInWeek = 5; //no sat or sun;
    var bigSubSections = 13; //need to draw 13 rectangles to get all times of day.

    dayWidth = Math.floor(calendarWidth / daysInWeek);
    hourHeight = Math.floor(calendarHeight / bigSubSections);
    console.log(dayWidth);
    console.log(hourHeight);
    ctx.setLineDash([5, 10]);

    for (var y = 0; y < bigSubSections; y++) {
        ctx.strokeStyle = "#a1a1a1";
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.moveTo(calendarLeft, hourHeight / 2 + calendarTop + y * hourHeight)
        ctx.lineTo(calendarWidth + calendarLeft, hourHeight / 2 + calendarTop + y * hourHeight)
        ctx.stroke();





    }
    ctx.strokeStyle = "#000000";

    ctx.setLineDash([]);
    for (var x = 0; x < daysInWeek; x++) { //drawing the main days


        for (var y = 0; y < bigSubSections; y++) {

            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.rect(calendarLeft + x * dayWidth, calendarTop + y * hourHeight, dayWidth, hourHeight);
            ctx.stroke();





        }
    }
    //writing the hours
    for (var y = 0; y < bigSubSections; y++) {

        ctx.font = "15px Arial"
        var text;
        if (y + 8 > 12) {
            text = y - 4 + ":00"
        } else {
            text = y + 8 + ":00"
        }

        ctx.fillText(text, 0, calendarTop + 5 + hourHeight * y);




    }




    for (var x = 0; x < daysInWeek; x++) {
        ctx.font = "15px Arial"
        var text;
        switch (x) {
            case 0:
                text = "Monday";
                break;
            case 1:
                text = "Tuesday";
                break;
            case 2:
                text = "Wednesday";
                break;
            case 3:
                text = "Thursday";
                break;
            case 4:
                text = "Friday";
                break;
            default:
                console.log("what");
                break;
        }

        ctx.fillText(text, calendarLeft + x * dayWidth, calendarTop - 10);

    }


}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function drawClassToCalendar(classToDraw, className) {
    var colorChosen = false;
    var choice;
    var color;
    while (!colorChosen) {
        choice = getRandomInt(classColors.length);
        if (classColorsUsedAlready[choice]) {
            continue;
        } else {
            colorChosen = true;
            classColorsUsedAlready[choice] = true;
            color = classColors[choice];
        }
    }

    if (classToDraw.monday) {
        colorInCalendarSection(classToDraw.startHour, classToDraw.startMinute, classToDraw.endHour, classToDraw.endMinute, 'm', className, classToDraw.instructor, classToDraw.crn, color)
    }
    if (classToDraw.tuesday) {
        colorInCalendarSection(classToDraw.startHour, classToDraw.startMinute, classToDraw.endHour, classToDraw.endMinute, 't', className, classToDraw.instructor, classToDraw.crn, color)
    }
    if (classToDraw.wednesday) {
        colorInCalendarSection(classToDraw.startHour, classToDraw.startMinute, classToDraw.endHour, classToDraw.endMinute, 'w', className, classToDraw.instructor, classToDraw.crn, color)
    }
    if (classToDraw.thursday) {
        colorInCalendarSection(classToDraw.startHour, classToDraw.startMinute, classToDraw.endHour, classToDraw.endMinute, 'th', className, classToDraw.instructor, classToDraw.crn, color)
    }
    if (classToDraw.friday) {
        colorInCalendarSection(classToDraw.startHour, classToDraw.startMinute, classToDraw.endHour, classToDraw.endMinute, 'f', className, classToDraw.instructor, classToDraw.crn, color)
    }


}



function colorInCalendarSection(startHour, startMinute, endHour, endMinute, day, className, instructorName, CRN, color) {
    var startX;

    var ctx = calendar.getContext("2d");

    switch (day) {
        case 'm':
            startX = 0;
            break;
        case 't':
            startX = 1;
            break;
        case 'w':
            startX = 2;
            break;
        case 'th':
            startX = 3;
            break;
        case 'f':
            startX = 4;
            break;
    }
    startX = calendarLeft + startX * dayWidth;

    var startY = calendarTop + (startHour - 8) * hourHeight; //minus 8 because the calendar starts at 8.
    if (startMinute != 0) {
        startY += (startMinute / 60) * hourHeight; //adds that percentage of the hour.

    }
    var width = dayWidth;
    var height = (endHour - startHour) * hourHeight;
    if (endMinute != 0) {
        height += (endMinute / 60) * hourHeight;
    }

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = color; //TODO: Change this later.
    ctx.fillRect(startX, startY, width, height);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "black";
    ctx.font = "20px Arial"
    ctx.fillText(className, startX, startY + 20);
    ctx.fillText(instructorName, startX, startY + 40);
    ctx.fillText("CRN:" + CRN, startX, startY + 60);


}


function showSchedule(scheduleNumber) { //pass in 1,2,3 get back 0,1,2
    if(possibleSchedules.length == 0){
        alert("No schedules could be formed with these classes!");
        return;
    }
    for (var i = 0; i < classColors.length; i++) {
        classColorsUsedAlready[i] = false;
    }
    
    drawCalendarGrid(); //clear the calendar
    schedule = possibleSchedules[scheduleNumber];

    for (var i = 0; i < schedule.length; i++) {
        drawClassToCalendar(schedule[i].data, schedule[i].name);
    }

}

function generateSchedules() {
    possibleSchedules = [];

    scheduleOrder = [];
    if (currentClasses.length == 1) {

        for (var i = 0; i < currentClasses[0].data.length; i++) {
            let schedule = [];
            let tempClass = {};
            tempClass.name = currentClasses[0].name;
            tempClass.data = currentClasses[0].data[i];
            schedule.push(tempClass);
            possibleSchedules.push(schedule);
            scheduleOrder.push(i);
        }
    } else if (currentClasses.length == 2) {
        var count = 0;
        for (var i = 0; i < currentClasses[0].data.length; i++) {

            for (var j = 0; j < currentClasses[1].data.length; j++) {
                var intersect = testClassIntersection(currentClasses[0].data[i], currentClasses[1].data[j]);
                if (intersect) {
                    continue;
                } else {
                    console.log("schedule is not intersecting");
                    let schedule = [];
                    let classOne = {};
                    classOne.name = currentClasses[0].name;
                    classOne.data = currentClasses[0].data[i];

                    let classTwo = {};
                    classTwo.name = currentClasses[1].name;
                    classTwo.data = currentClasses[1].data[j];
                    schedule.push(classOne);
                    schedule.push(classTwo);
                    possibleSchedules.push(schedule);
                    scheduleOrder.push(count);
                    count++;
                }
                //intersect is true if they intersect, false otherwise.

            }



        }




    } else if (currentClasses.length == 3) {
        var count = 0;
        for (var i = 0; i < currentClasses[0].data.length; i++) {

            for (var j = 0; j < currentClasses[1].data.length; j++) {
                for (var k = 0; k < currentClasses[2].data.length; k++) {
                    if (testClassIntersection(currentClasses[0].data[i], currentClasses[1].data[j]) || testClassIntersection(currentClasses[0].data[i], currentClasses[2].data[k]) || testClassIntersection(currentClasses[1].data[j], currentClasses[2].data[k])) {
                        continue;
                    } else {
                        console.log("schedule is not intersecting");
                        let schedule = [];
                        let classOne = {};
                        classOne.name = currentClasses[0].name;
                        classOne.data = currentClasses[0].data[i];

                        let classTwo = {};
                        classTwo.name = currentClasses[1].name;
                        classTwo.data = currentClasses[1].data[j];

                        let classThree = {};
                        classThree.name = currentClasses[2].name;
                        classThree.data = currentClasses[2].data[k];
                        schedule.push(classOne);
                        schedule.push(classTwo);
                        schedule.push(classThree);
                        possibleSchedules.push(schedule);
                        scheduleOrder.push(count);
                        count++;
                    }
                    //intersect is true if they intersect, false otherwise.
                }


            }



        }
    } else if (currentClasses.length == 4) {
        var count = 0;
        for (var i = 0; i < currentClasses[0].data.length; i++) {

            for (var j = 0; j < currentClasses[1].data.length; j++) {
                for (var k = 0; k < currentClasses[2].data.length; k++) {
                    for (var l = 0; l < currentClasses[3].data.length; l++) {
                        if (testClassIntersection(currentClasses[0].data[i], currentClasses[1].data[j]) || testClassIntersection(currentClasses[0].data[i], currentClasses[2].data[k]) || testClassIntersection(currentClasses[0].data[i], currentClasses[3].data[l]) || testClassIntersection(currentClasses[1].data[j],currentClasses[2].data[k])
                         || testClassIntersection(currentClasses[1].data[j], currentClasses[3].data[l]) || testClassIntersection(currentClasses[2].data[k],currentClasses[3].data[l])) {
                            continue;
                        } else {
                            console.log("schedule is not intersecting");
                            let schedule = [];
                            let classOne = {};
                            classOne.name = currentClasses[0].name;
                            classOne.data = currentClasses[0].data[i];

                            let classTwo = {};
                            classTwo.name = currentClasses[1].name;
                            classTwo.data = currentClasses[1].data[j];

                            let classThree = {};
                            classThree.name = currentClasses[2].name;
                            classThree.data = currentClasses[2].data[k];
                            let classFour = {};
                            classFour.name = currentClasses[3].name;
                            classFour.data = currentClasses[3].data[l];
                            schedule.push(classOne);
                            schedule.push(classTwo);
                            schedule.push(classThree);
                            schedule.push(classFour);
                            possibleSchedules.push(schedule);
                            scheduleOrder.push(count);
                            count++;
                        }
                    }
                    //intersect is true if they intersect, false otherwise.
                }


            }



        }
    }
    updateScheduleText(scheduleOrder[currentScheduleIndex])
    updatePossibleScheduleNumber();
    showSchedule(currentScheduleIndex);
}


function updatePossibleScheduleNumber() {
    let textBox = document.getElementById("possibleSchedules");
    textBox.textContent = "Possible Schedules: " + Number(possibleSchedules.length);
}

//if two classes intersect return true, else return false.
function testClassIntersection(classOne, classTwo) {

    var classTwoStart = classTwo.startHour * 100 + classOne.startMinute;
    var classOneEnd = classOne.endHour * 100 + classOne.endMinute;
    var classTwoEnd = classTwo.endHour * 100 + classTwo.endMinute;
    var classOneStart = classOne.startHour * 100 + classOne.startMinute;
    if (classOne.monday == true) {
        if (classTwo.monday == true) {
            if (timeInBetween(classOneStart, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoStart, classOneStart, classOneEnd)) {
                return true;
            } else if (timeInBetween(classOneEnd, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoEnd, classOneStart, classOneEnd)) {
                return true;
            }

        }
    }
    if (classOne.tuesday == true) {
        if (classTwo.tuesday == true) {
            if (timeInBetween(classOneStart, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoStart, classOneStart, classOneEnd)) {
                return true;
            } else if (timeInBetween(classOneEnd, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoEnd, classOneStart, classOneEnd)) {
                return true;
            }
        }
    }

    if (classOne.wednesday == true) {
        if (classTwo.wednesday == true) {
            if (timeInBetween(classOneStart, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoStart, classOneStart, classOneEnd)) {
                return true;
            } else if (timeInBetween(classOneEnd, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoEnd, classOneStart, classOneEnd)) {
                return true;
            }
        }
    }

    if (classOne.thursday == true) {
        if (classTwo.thursday == true) {
            if (timeInBetween(classOneStart, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoStart, classOneStart, classOneEnd)) {
                return true;
            } else if (timeInBetween(classOneEnd, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoEnd, classOneStart, classOneEnd)) {
                return true;
            }
        }
    }
    if (classOne.friday == true) {
        if (classTwo.friday == true) {
            if (timeInBetween(classOneStart, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoStart, classOneStart, classOneEnd)) {
                return true;
            } else if (timeInBetween(classOneEnd, classTwoStart, classTwoEnd)) {
                return true;
            } else if (timeInBetween(classTwoEnd, classOneStart, classOneEnd)) {
                return true;
            }
        }
    }
    
    return false; //if we get this far we know they don't intersect. 
}
//returns true if the timeToCheck is hgiher than lowe bound and less than the upper bound
function timeInBetween(timeToCheck, lowerBound, upperBound) {
    if (timeToCheck >= lowerBound && timeToCheck <= upperBound) {
        return true;
    }

    return false;
}








function showNextSchedule() {
    var nextIndex = currentScheduleIndex + 1;
    if (nextIndex >= scheduleOrder.length) {
        nextIndex = 0;
        currentScheduleIndex = 0;
        updateScheduleText(scheduleOrder[currentScheduleIndex])
        showSchedule(0);
    } else {
        currentScheduleIndex = nextIndex;
        updateScheduleText(scheduleOrder[currentScheduleIndex])
        showSchedule(scheduleOrder[currentScheduleIndex]);
    }


}

function updateScheduleText(newScheduleNumber) {
    var scheduletext = document.getElementById("scheduleNumber");
    scheduletext.textContent = "Schedule Number: " + newScheduleNumber;
}

function showPreviousSchedule() {
    var nextIndex = currentScheduleIndex - 1;
    if (nextIndex < 0) {
        nextIndex = possibleSchedules.length - 1;
        currentScheduleIndex = nextIndex;
        updateScheduleText(scheduleOrder[currentScheduleIndex])
        showSchedule(scheduleOrder[currentScheduleIndex]);
    } else {
        currentScheduleIndex = nextIndex;
        updateScheduleText(scheduleOrder[currentScheduleIndex])
        showSchedule(scheduleOrder[currentScheduleIndex]);
    }
}