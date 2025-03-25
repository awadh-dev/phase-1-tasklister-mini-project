document.addEventListener("DOMContentLoaded", () => {
// src/index.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#create-task-form');
  const formInput = document.querySelector('#new-task-description');
  const taskList = document.querySelector('#tasks');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const taskDescription = formInput.value; // Get the task input value
    if (taskDescription.trim() !== '') { // Only add if not empty
      const taskItem = document.createElement('li');
      taskItem.textContent = taskDescription;
      taskList.appendChild(taskItem); // Add the new task to the list

      formInput.value = ''; // Clear the input field after submission
    }
  });
});

});
