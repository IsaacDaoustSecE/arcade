const jokeCategories = ["Programming"]; // Available categories

// Fetch a joke with setup and punchline
async function fetchJokeFromJokeAPI(category) {
  try {
    const response = await fetch(`https://v2.jokeapi.dev/joke/${category}?type=twopart`);
    const data = await response.json();

    if (data.error) {
      throw new Error("Couldn't fetch a joke.");
    }

    return {
      setup: data.setup,
      punchline: data.delivery,
    };
  } catch (error) {
    return {
      setup: "No jokes found!",
      punchline: "Try again later.",
    };
  }
}

// Fetch fake punchlines from the same category
async function fetchFakePunchlines(category, count = 3) {
  const fakePunchlines = [];
  for (let i = 0; i < count; i++) {
    const joke = await fetchJokeFromJokeAPI(category);
    fakePunchlines.push(joke.punchline);
  }
  return fakePunchlines;
}

// Display the joke and options
async function startGame() {
  const selectedCategory = jokeCategories[Math.floor(Math.random() * jokeCategories.length)];
  
  // Fetch the main joke
  const { setup, punchline } = await fetchJokeFromJokeAPI(selectedCategory);
  
  // Fetch fake punchlines
  const fakePunchlines = await fetchFakePunchlines(selectedCategory);

  // Combine the real punchline with fake ones and shuffle
  const punchlines = [...fakePunchlines, punchline].sort(() => Math.random() - 0.5);

  // Display the joke setup
  document.getElementById('joke').innerText = `${setup}`;

  // Display the punchline options
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  punchlines.forEach((option) => {
    const button = document.createElement('button');
    button.innerText = option;
    button.onclick = () => checkAnswer(option, punchline);
    optionsContainer.appendChild(button);
  });
}

// Check the answer
function checkAnswer(selected, correct) {
  const result = document.getElementById('result');
  if (selected === correct) {
    result.innerText = "Correct! 🎉";
    updateScore();
  } else {
    result.innerText = "Wrong! 😅";
  }
  setTimeout(() => {
    result.innerText = '';
    startGame();
  }, 2000); // Move to the next joke
}

// Update score
let score = 0;
function updateScore() {
  score++;
  document.getElementById('score').innerText = `Score: ${score}`;
}

// Start the game
startGame();
