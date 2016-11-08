#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const inquirer = require('inquirer');
const Preferences = require('preferences');
const request = require('request');
const CLI = require('clui')
const Spinner = CLI.Spinner;

// Create splash screen
clear();
console.log(
  chalk.cyan(
    figlet.textSync('Morning!', {
      horizontalLayout: 'full',
      font: 'graffiti'
    })
  )
);

// get IFTTT code
let getIFTTTId = (callback) => {
  const prefs = new Preferences('rememberMeBesty');
  if(prefs.ifttt && prefs.ifttt.id && prefs.ifttt.eventName) {
    return callback(prefs.ifttt);
  }


  let questions = [
    {
      name: 'iftttId',
      type: 'input',
      message: 'Please enter your ifttt id',
      validate: (value) => {
        if(value.length) {
          return true;
        } else {
          return 'Please enter your IFTTT id';
        }
      }
    },
    {
      name: 'iftttEventName',
      type: 'input',
      message: 'Please enter the IFTTT event name',
      validate: (value) => {
        if(value.length) {
          return true;
        } else {
          return 'Please enter the IFTTT event name.'
        }
      }
    }
  ];

  inquirer.prompt(questions).then(function() {
    const iftttId = arguments[0].iftttId;
    const iftttEventName = arguments[0].iftttEventName;

    if(iftttId && iftttEventName) {
      prefs.ifttt = {
        id: iftttId,
        eventName: iftttEventName
      }

      callback(prefs.ifttt);
    }
  });
}

// Send request to IFTTT
const sendIFTTTRequest = function(url, data){
  var status = new Spinner('Sending request to IFTTT, please wait...');
  status.start();

  request.post(url, {form: data}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        status.stop();
        process.stdout.write('\n');
        console.log(
          chalk.green('Huge Success! Journal entry created.')
        );
      } else {
        status.stop();
        process.stdout.write('\n');
        console.log(chalk.red(response));
        console.log(chalk.red(error));
      }
  });
}

// Ask daily questions
let askQuestions = (creds) => {

  let questions = [
    {
      name: 'Trello',
      type: 'confirm',
      message: 'Have you checked trello.'
    },
    {
      name: 'Vitamins',
      type: 'confirm',
      message: 'Have you taken your vitamins.'
    },
    {
      name: 'Anki',
      type: 'confirm',
      message: 'Have you reviewed Anki today.'
    }
  ];

  inquirer.prompt(questions).then(function() {
    function convertBoolToString(arg) {
      if(arg == false) {
        return 'No';
      }
      return 'Yes';
    }

    const data = {
      "value1": convertBoolToString(arguments[0].Trello),
      "value2": convertBoolToString(arguments[0].Vitamins),
      "value3": convertBoolToString(arguments[0].Anki)
    }

    const url = `https://maker.ifttt.com/trigger/${creds.eventName}/with/key/${creds.id}`;
    sendIFTTTRequest(url, data);
  });
}

// Lets get this party started!
getIFTTTId(askQuestions);

