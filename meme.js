const jokeCategories = ["Programming"];

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

async function fetchFakePunchlines(category, count = 3) {
  const fakePunchlines = [];
  for (let i = 0; i < count; i++) {
    const joke = await fetchJokeFromJokeAPI(category);
    fakePunchlines.push(joke.punchline);
  }
  return fakePunchlines;
}

async function startGame() {
  const selectedCategory = jokeCategories[Math.floor(Math.random() * jokeCategories.length)];
  
  const { setup, punchline } = await fetchJokeFromJokeAPI(selectedCategory);
  
  const fakePunchlines = await fetchFakePunchlines(selectedCategory);

  const punchlines = [...fakePunchlines, punchline].sort(() => Math.random() - 0.5);
  
  document.getElementById('joke').innerText = `${setup}`;
  
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  punchlines.forEach((option) => {
    const button = document.createElement('button');
    button.innerText = option;
    button.onclick = () => checkAnswer(option, punchline);
    optionsContainer.appendChild(button);
  });
}

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
  }, 5000); // switch to the next joke after five secs
}

let score = 0;
function updateScore() {
  score++;
  document.getElementById('score').innerText = `Score: ${score}`;
}

startGame();
