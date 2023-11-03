// Global variables
let selectedCourseId;
let selectedTeeBoxIndex;
let players = [];

//  	
// 0	
// id	11819
// name	"Thanksgiving Point Golf Course - Lehi, UT"
// url	"https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course11819.json"
// 1	
// id	18300
// name	"Fox Hollow Golf Course - American Fork, UT"
// url	"https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course18300.json"
// 2	
// id	19002
// name	"Spanish Oaks Golf Course - Spanish Fork, UT"
// url	"https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course19002.json"
// Fetch courses
async function getCourses() {
  const response = await fetch('https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/');
  return response.json();
}

// Fetch course details
async function getCourse(courseId) {
  const response = await fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`);
  return response.json();
}

// Create player class
class Player {
  constructor(name) {
    this.name = name;
    this.scores = [];
  }

  addScore(score) {
    this.scores.push(score);
  }
}

// Function to populate course select box
async function populateCourseSelectBox() {
  const courses = await getCourses();
  const courseSelect = document.getElementById('courseSelect');
  courses.forEach(course => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = course.name;
    courseSelect.appendChild(option);
  });
}

// Function to populate tee box select box based on selected course
async function populateTeeBoxSelectBox(courseId) {
  const courseDetails = await getCourse(courseId);
  const teeBoxes = courseDetails.teeBoxes;
  const teeSelect = document.getElementById('teeSelect');
  teeSelect.innerHTML = ''; // Clear previous options
  teeBoxes.forEach((teeBox, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${teeBox.teeType.toUpperCase()}, ${teeBox.totalYards} yards`;
    teeSelect.appendChild(option);
  });
}

// Function to update the scorecard table
function updateScorecard() {
  const tableBody = document.getElementById('frontNineBody'); // Get the table body element
  tableBody.innerHTML = ''; // Clear previous rows

  // Add rows to the table based on the number of holes
  for (let hole = 1; hole <= 9; hole++) {
    const par = 4; // Example par value, modify as per your course data
    const handicap = 7; // Example handicap value, modify as per your course data
    const rowHTML = printRow(hole, par, handicap, players);
    tableBody.innerHTML += rowHTML;
  }
}

// Function to handle score input for a player and update the scorecard
function addScore(playerIndex, holeNumber) {
  const score = parseInt(prompt(`Enter score for Player ${playerIndex + 1}, Hole ${holeNumber}`));
  if (!isNaN(score)) {
    players[playerIndex].addScore(score);
    updateScorecard();
  } else {
    alert('Invalid score. Please enter a valid number.');
  }
}

// Function to print a row in the table
function printRow(hole, par, handicap, players) {
  let rowHTML = `
    <tr>
      <td>${hole}</td>
      <td>${par}</td>
      <td>${handicap}</td>
  `;

  players.forEach(player => {
    rowHTML += `<td>${player.scores[hole - 1] || ''}</td>`;
  });

  rowHTML += `</tr>`;

  return rowHTML;
}

// Event listener for course select box change
document.getElementById('courseSelect').addEventListener('change', function () {
  selectedCourseId = this.value;
  populateTeeBoxSelectBox(selectedCourseId);
});

// Event listener for tee box select box change
document.getElementById('teeSelect').addEventListener('change', function () {
  selectedTeeBoxIndex = this.value;
  // You can fetch specific tee box details here if needed
  // For now, let's assume you have the required data in the course details API response
  // Create player objects based on the number of players, modify as needed
  players = [new Player('Player 1'), new Player('Player 2')];
  updateScorecard();
});

// Call populateCourseSelectBox function when the DOM is loaded
document.addEventListener('DOMContentLoaded', populateCourseSelectBox);
