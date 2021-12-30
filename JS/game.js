const question = document.querySelector('#question');
const choiceText = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progress-text');
const scoreCount = document.querySelector('.score');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');
const progressBarFull = document.querySelector('.progress-bar-full');


let currentQuestion = {}
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

fetch("https://opentdb.com/api.php?amount=20&category=18&difficulty=medium&type=multiple")
    .then(res => {
        return res.json();
    })
    .then(data => {
        questions = data.results.map(loadedQuestion => {
            const formattedQuestion = {
                Question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers]
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

            answerChoices.splice(
                formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, idx) => {
                formattedQuestion['choice' + (idx + 1)] = choice
            });
            return formattedQuestion
        })
        startGame()
    })
    .catch(err => {
        console.log(err)
    })

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;


startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("MostResentScore", score)

        window.location.assign('/HTML/end.html')
    }

    questionCounter++;
    progressText.innerText = `Question: ${questionCounter} / ${MAX_QUESTIONS}`;

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion['Question'];

    choiceText.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true
}

choiceText.forEach(ele => {
    ele.addEventListener('click', e => {
        if (!acceptingAnswers) {
            return;
        }

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        console.log(selectedAnswer)

        const classToApply = selectedAnswer == currentQuestion['answer'] ? 'correct' : 'incorrect';
        selectedChoice.parentElement.classList.add(classToApply);

        if (classToApply === 'correct') {
            increamentScore(CORRECT_BONUS)
        }

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion()
        }, 1000)

    });
});

increamentScore = num => {
    score += num;
    scoreCount.innerText = score
}