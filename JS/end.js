// Getting a reference to the DOM
const saveScore = document.querySelector('#save-score');
const userName = document.querySelector('#usermane');
const finalScore = document.querySelector('#final-score');

// get the most recent score ftom the local storage
const mostResentScore = localStorage.getItem("MostResentScore");

finalScore.innerText = mostResentScore;

// Get the Highscores from the locastorage and convert it to an object, if null === []
const highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

const MAX_HIGH_SCORE = 5;

// if username value is still empty after key up leave the save button as disabled
userName.addEventListener('keyup', () => {
    saveScore.disabled = !userName.value
})


saveHighScore = e => {
    e.preventDefault();

    // Save score and username in the object
    const score = {
        score: mostResentScore,
        name: userName.value,
    };

    // Add the score to the highscores array
    highScores.push(score);

    // Sort highscore by highest score then get the array of the first five in the array
    highScores.sort((a, b) => {
        return b.score - a.score
    }).splice(5)

    // console.log(highScores)

    // Save the high score in the localstorage
    localStorage.setItem("HighScores", JSON.stringify(highScores));

    // window.location.assign('/HTML/index.html')
}

// saveScore.addEventListener('click', saveHighScore(e))