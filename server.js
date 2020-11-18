var axios = require('axios')
var fs = require('fs');

var exphbs = require("express-handlebars");
var bodyParser = require('body-parser');
var express = require('express')

var nodemailer = require('nodemailer')
const puppeteer = require('puppeteer');
const {
    CONNREFUSED
} = require('dns');
const {
    Console
} = require('console');
const jsdom = require('jsdom');
const e = require('express');
const PORT = process.env.PORT || 3000;







var app = express();


app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.listen(PORT, function () {
    console.log("listening on port " + PORT); //don't start listening until connected.
})




//assumes you're using gmail. Might need to change some stuff in nodemailer if you aren't.

let emailToSendFrom = "user@gmail.com"      //email to send from
let emailPassword = 'password'              //password
let emailToSendTo = 'user@oregonstate.edu'  //email to send to.           



let className = "CS000" //change this to be whatever class name



//make sure this is a link to a search that only shows up one class. Search by CRN if you have to.
//example here is for CS344
let url = "https://classes.oregonstate.edu/?keyword=cs344&srcdb=202102&camp=C"


let lastEmailSentAt;

let firstTime = true;

const timeBetweenChecks = 600000   //in milliseconds. Currently will check once every hour

//set this to how many changes you want to receive an email at... i.e. 10 means if 10 people join the class
//you get an email
let changeToUpdateAt = 10;


//SET THIS to whatever you want to send an email at to update for every number that's different after this.
let panicMode = 30;




let spacesLeft;
startListeningForClass();

function startListeningForClass(){
    lookForClass()
}

function lookForClass(){
    getData();

    setTimeout(lookForClass,timeBetweenChecks);
    
}

function getData() {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.panel__body') //when this loads I know that the classes are loaded.


        //let bodyHTML =  await page.evaluate(()=>  document.querySelector('.panel__body').innerHTML);
        const element = await page.waitForSelector('.result');
        await element.click()
        
        await page.waitForSelector(".detail-ssbsect_seats_avail");
        
        const result = await page.evaluate(()=> document.querySelector('.detail-ssbsect_seats_avail').textContent);  
   
        let splitResult = result.split(':')
     
        let fixedResult = Number(splitResult[1].substr(1))
        if(firstTime){
            spacesLeft = fixedResult;
            firstTime = false
        }
        spacesLeft = fixedResult;
        console.log(fixedResult);



        if(spacesLeft <= lastEmailSentAt -10){
            lastEmailSentAt = spacesLeft
            sendEmail();
        }else if(spacesLeft <= panicMode && lastEmailSentAt != spacesLeft){
            lastEmailSentAt == spacesLeft
            sendEmail();
        }
   
        await browser.close();
    })();
   
}



//READ THE README.MD IF THIS ISN"T WORKING!!!!
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailToSendFrom,
      pass: emailPassword
    }
  });



function sendEmail(){
    var mailOptions = {
        from: emailToSendFrom,
        to: emailToSendTo,
        subject: className + ": " + spacesLeft + ' Spaces Left',
        text: className + " has "+spacesLeft+' Spaces Left'
      };
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

