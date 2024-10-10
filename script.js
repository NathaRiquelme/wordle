// Array of potential 5-letter words
const wordList = ["apple", "grape", "lemon", "mango", "berry", "peach"];

// Randomly select a secret word
const secretWord = wordList[Math.floor(Math.random() * wordList.length)];
console.log("Secret Word:", secretWord); // For testing

// Variables to keep track of the current row and column
let currentRow = 0;
let currentCol = 0;
let guess = "";

// Add event listener for keypress (real keyboard)
document.addEventListener("keydown", handleKeyPress);

// Add event listener for click (virtual keyboard)
document.querySelectorAll(".Game-keyboard-button").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.key || button.innerText.toLowerCase();
    handleInput(key);
  });
});

// Function to handle keyboard input
function handleKeyPress(event) {
  const key = event.key.toLowerCase();
  handleInput(key);
}

// Main input handler for both keydown and click
function handleInput(key) {
  if (isLetter(key) && currentCol < 5) {
    // Add letter to the current guess
    guess += key;
    document.querySelectorAll(".Row")[currentRow].children[
      currentCol
    ].innerText = key;
    currentCol++;
  } else if (key === "backspace" && currentCol > 0) {
    // Handle backspace to remove letters
    currentCol--;
    guess = guess.slice(0, -1);
    document.querySelectorAll(".Row")[currentRow].children[
      currentCol
    ].innerText = "";
  } else if (key === "enter" && currentCol === 5) {
    // When Enter is pressed and all letters are filled, check the word
    checkWord();

    // If the first row is completed and it's not the secret word
    if (guess !== secretWord && currentRow === 0) {
      const giveUpButton = document.querySelector(".give_up");
      giveUpButton.style.display = "block"; // Show the 'Give up' button
    }
  }
}

// Function to check if the input is a letter
function isLetter(char) {
  return /^[a-z]$/.test(char);
}

// Function to check the entered word and update keyboard and row (square) colors
function checkWord() {
  const rowLetters = document.querySelectorAll(".Row")[currentRow].children;
  const keyboardButtons = document.querySelectorAll(".Game-keyboard-button");

  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    const keyboardButton = Array.from(keyboardButtons).find(
      (button) => button.innerText.toLowerCase() === letter.toLowerCase()
    );

    // Set row letter color based on the secret word
    if (secretWord[i] === letter) {
      // Letter is in the correct place (green)
      rowLetters[i].style.backgroundColor = "#79b851"; // Green background
      rowLetters[i].style.color = "#ffffff"; // White text color
      if (keyboardButton) {
        keyboardButton.style.backgroundColor = "#79b851";
        keyboardButton.style.color = "#ffffff"; // Change text color to white
      }
    } else if (secretWord.includes(letter)) {
      // Letter is in the word but in the wrong place (yellow)
      rowLetters[i].style.backgroundColor = "#f3c237"; // Yellow background
      rowLetters[i].style.color = "#ffffff"; // White text color
      if (
        keyboardButton &&
        keyboardButton.style.backgroundColor !== "#79b851"
      ) {
        keyboardButton.style.backgroundColor = "#f3c237";
        keyboardButton.style.color = "#ffffff"; // Change text color to white
      }
    } else {
      // Letter is not in the word (gray)
      rowLetters[i].style.backgroundColor = "#A4AEC4"; // Gray background
      rowLetters[i].style.color = "#ffffff"; // White text color
      if (
        keyboardButton &&
        keyboardButton.style.backgroundColor !== "#79b851" &&
        keyboardButton.style.backgroundColor !== "#f3c237"
      ) {
        keyboardButton.style.backgroundColor = "#A4AEC4";
        keyboardButton.style.color = "#ffffff"; // Change text color to white
      }
    }
  }

  // Check if the word matches the secret word
  if (guess === secretWord) {
    alert("Congratulations! You guessed the word!");
    return;
  }

  // Move to the next row
  currentRow++;
  currentCol = 0;
  guess = "";

  // Check if the player has used all tries
  if (currentRow === 6) {
    // Trigger the losing modal
    showLosingModal(secretWord);
  }
}

// Function to show the "You lost" modal when "Give up" is clicked
document.querySelector(".give_up").addEventListener("click", () => {
  showLosingModal(secretWord); // Call the function that shows the losing modal
});

// Function to show losing modal
function showLosingModal(secretWord) {
  // Dim the game background
  const gameWrapper = document.getElementById("game-wrapper");
  gameWrapper.classList.add("dim-background");

  // Show modal
  const modal = document.querySelector(".modal_finish");
  if (modal) {
    console.log("Modal found, showing modal...");
    modal.style.display = "block"; // Make modal visible
    modal.style.pointerEvents = "auto"; // Enable interaction for modal

    // Update the modal with the correct word
    modal.querySelector(".word span").innerText = secretWord;

    const dictionaryLink = modal.querySelector(".definition");
    dictionaryLink.href = `https://www.dictionary.com/browse/${secretWord}`;

    // Listen for 'Enter' key to reload the page
    document.addEventListener("keydown", function reloadOnEnter(event) {
      if (event.key === "Enter") {
        window.location.reload(); // Reload the page
      }
    });
  } else {
    console.error("Modal element not found.");
  }
}

// Function to close the modal (if needed)
function closeModal() {
  const modal = document.querySelector(".modal_finish");
  modal.style.display = "none"; // Hide modal
  document.body.style.filter = ""; // Reset brightness
  document.body.style.pointerEvents = ""; // Re-enable interaction with the background
}

/// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener for the Help button
  document
    .querySelector(".button.mini_modal_link")
    .addEventListener("click", showInstructionsModal);

  // Add event listener to the close button inside the modal
  document
    .querySelector(".mini_modal .close")
    .addEventListener("click", closeInstructionsModal);
});

// Function to show the "How to Play" modal
function showInstructionsModal() {
  const gameWrapper = document.getElementById("game-wrapper");
  const modal = document.getElementById("modal_info");

  // Dim the game background
  gameWrapper.classList.add("dim-background");

  // Show the modal
  modal.style.display = "block";
  modal.style.pointerEvents = "auto"; // Enable interaction with the modal
  modal.style.zIndex = 1001; // Ensure it's on top
}

// Function to hide the modal and reset the background
function closeInstructionsModal() {
  const gameWrapper = document.getElementById("game-wrapper");
  const modal = document.getElementById("modal_info");

  // Remove the dim background
  gameWrapper.classList.remove("dim-background");

  // Hide the modal
  modal.style.display = "none";
}
