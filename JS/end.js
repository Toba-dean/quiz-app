const saveScore = document.querySelector('#save-score');
const userName = document.querySelector('#usermane');
const finalScore = document.querySelector('#final-score');
const mostResentScore = localStorage.getItem("MostResentScore");

finalScore.innerText = mostResentScore;
const highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

const MAX_HIGH_SCORE = 5;


userName.addEventListener('keyup', () => {
    saveScore.disabled = !userName.value
})

saveHighScore = e => {
    e.preventDefault();

    const score = {
        score: mostResentScore,
        name: userName.value,
    };

    highScores.push(score);

    highScores.sort((a, b) => {
        return b.score - a.score
    }).splice(5)

    console.log(highScores)

    localStorage.setItem("HighScores", JSON.stringify(highScores));

    // window.location.assign('/HTML/index.html')
}