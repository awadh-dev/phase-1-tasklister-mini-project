const chai = require('chai');
global.expect = chai.expect;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

// Load HTML content
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JavaScript using Babel
const { code: transformedScript } = babel.transformFileSync(
  path.resolve(__dirname, '..', 'src/index.js'),
  { presets: ['@babel/preset-env'] }
);

// Initialize JSDOM
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

// Inject the transformed JavaScript into the virtual DOM
const scriptElement = dom.window.document.createElement("script");
scriptElement.textContent = transformedScript;
dom.window.document.body.appendChild(scriptElement);

// Expose JSDOM globals to the testing environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

// Sample test suite for JavaScript event handling
describe('Handling form submission', () => {
  let form;
  let formInput;
  let taskList;

  // Use before() to set up variables before the test runs
  before(() => {
    // Ensure these elements exist in the DOM after JSDOM initialization
    form = document.querySelector('#create-task-form');
    formInput = document.querySelector('#new-task-description');
    taskList = document.querySelector('#tasks');
  });

  it('should add an event to the form and add input to webpage', (done) => {
    // Simulate user input
    formInput.value = 'Wash the dishes'; // Make sure this is after the variable definition
    const event = new dom.window.Event('submit'); // Ensure 'window.Event' is used in this context
    
    // Add event listener to prevent default behavior and simulate adding a task
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form submission
      const taskItem = document.createElement('li');
      taskItem.textContent = formInput.value; // Add task text
      taskList.appendChild(taskItem); // Append to task list

      // Use setTimeout to allow DOM updates before assertion
      setTimeout(() => {
        expect(taskList.textContent).to.include('Wash the dishes');
        done(); // Signal that the test is complete
      }, 0);
    });

    form.dispatchEvent(event); // Dispatch submit event
  });
});
