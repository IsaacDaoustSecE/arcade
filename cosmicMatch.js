// Select DOM elements
const gameBoard = document.querySelector('.memory-game'); // The game board where cards are displayed
const resetButton = document.querySelector('.reset-button'); // Button to reset the game
const bestScoreDisplay = document.getElementById('best-score'); // Display the best score
const currentScoreDisplay = document.getElementById('current-score'); // Display the current score
const congratsMessage = document.getElementById('congrats-message'); // Message shown when the game is won

let firstCard, secondCard; // Variables to keep track of the first and second flipped cards
let lockBoard = false; // Prevents board interaction while checking match
let currentScore = 0; // Tracks the current score of the game
let bestScore = localStorage.getItem('bestScore') || 0; // Get best score from localStorage, or set it to 0
bestScoreDisplay.textContent = bestScore; // Displays the best score on the page

let images = []; // Initializes an empty array to store the images

// Fetch space photos from NASA's API
async function fetchSpacePhotos() {
  const apiKey = '72tHJfbrodf0ShVpF92CDSXpDgezf0GqrzrVRlfA'; // My NASA API key
  const count = 8; // Number of unique photos to fetch
  const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`; // API endpoint with query parameters

  try {
    const response = await fetch(apiURL); // Fetches the data from NASA API
    const data = await response.json(); // Parse the JSON response

    // Filter to only get images (excluding videos)
    images = data
      .filter(item => item.media_type === 'image') // Only keep items with media type 'image'
      .map(item => item.url); // Map the items to get their URLs

    if (images.length < count) {
      console.warn("Not enough image results. Please check the API or increase the fetch count."); // Warn if not enough images are found
    }

    resetGame(); // Start the game after fetching images
  } catch (error) {
    console.error('Error fetching space photos:', error); // Log any errors that occur while fetching data
  }
}

// Shuffle the cards by creating a random array and returning the shuffled card elements
function shuffleCards() {
  return [...images, ...images] // Duplicate the images array to create pairs of cards
    .sort(() => Math.random() - 0.5) // Randomly shuffle the array
    .map((image, index) => createCard(image, index)); // Create card elements from the shuffled array
}

// Create each card element
function createCard(image, id) {
  const card = document.createElement('div'); // Create a new div for the card
  card.classList.add('card'); // Add 'card' class for styling
  card.dataset.id = id; // Set a custom attribute for the card's id
  card.dataset.image = image; // Set a custom attribute for the image URL

  // HTML structure for the card (front and back sides)
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back" style="background-image: url('${image}')"></div>
    </div>
  `;
  card.addEventListener('click', flipCard); // Add event listener to flip the card when clicked
  return card; // Return the created card element
}

// Flip the card when it's clicked
function flipCard() {
  if (lockBoard || this === firstCard) return; // Prevent flipping if the board is locked or if it's the same card being clicked

  this.classList.add('flipped'); // Add 'flipped' class to the card to show the front

  if (!firstCard) {
    firstCard = this; // If no card is flipped yet, set the first card
  } else {
    secondCard = this; // Otherwise, set the second card and check for a match
    checkMatch();
  }
}

// Check if the two flipped cards match
function checkMatch() {
  lockBoard = true; // Lock the board while checking the match

  const isMatch = firstCard.dataset.image === secondCard.dataset.image; // Check if the image URLs match

  isMatch ? disableCards() : unflipCards(); // If they match, disable the cards; otherwise, unflip them
}

// Disable the matched cards and update the score
function disableCards() {
  firstCard.removeEventListener('click', flipCard); // Remove the event listener from the first card
  secondCard.removeEventListener('click', flipCard); // Remove the event listener from the second card

  currentScore++; // Increment the current score for a match
  currentScoreDisplay.textContent = currentScore; // Update the score display

  // Check if the game is completed (all cards matched)
  if (currentScore === images.length) {
    congratsMessage.classList.remove('hidden'); // Show the congratulatory message
  }

  resetBoard(); // Reset the board state
}

// Unflip the cards if they don't match
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped'); // Remove the 'flipped' class from both cards
    secondCard.classList.remove('flipped');
    resetBoard(); // Reset the board state
  }, 1000); // Wait 1 second before unflipping
}

// Reset the board state (nullify cards and lockBoard)
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false]; // Reset variables
}

// Reset the game, shuffle the cards, and display them
function resetGame() {
  gameBoard.innerHTML = ''; // Clear the game board
  const shuffledCards = shuffleCards(); // Shuffle the cards
  shuffledCards.forEach(card => gameBoard.appendChild(card)); // Add the shuffled cards to the board

  // Reset the current score and hide the congratulatory message
  currentScore = 0;
  currentScoreDisplay.textContent = currentScore;
  congratsMessage.classList.add('hidden'); // Hide message
}

// Update the best score if the current score is higher
function updateBestScore() {
  if (currentScore > bestScore) {
    bestScore = currentScore; // Set the new best score
    localStorage.setItem('bestScore', bestScore); // Save the new best score to localStorage
    bestScoreDisplay.textContent = bestScore; // Update the displayed best score
  }
}

// Reset the best score to 0
function resetBestScore() {
  localStorage.removeItem('bestScore'); // Remove best score from localStorage
  bestScore = 0; // Reset the best score variable
  bestScoreDisplay.textContent = bestScore; // Update the best score display
}

// Add event listener to reset button
resetButton.addEventListener('click', () => {
  updateBestScore(); // Update best score before resetting the game
  resetGame(); // Reset the game
});

// Start fetching space photos
fetchSpacePhotos(); // Fetch space photos when the script runs