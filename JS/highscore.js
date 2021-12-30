const highScoresList = document.querySelector('.high-scores-list');
const highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

highScoresList.innerHTML = highScores.map(score => {
    return `<li class="list-score">${score.name.toUpperCase()} - ${score.score}</li>`
}).join('');