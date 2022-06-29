// Get reference to the dom.
const question = document.querySelector('#question');

// array.from creates an array from an iterable
const choiceText = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progress-text');
const scoreCount = document.querySelector('.score');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');
const progressBarFull = document.querySelector('.progress-bar-full');


// All variables needed
let currentQuestion = {}
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

// Fetching the questions
fetch("https://opentdb.com/api.php?amount=20&category=18&difficulty=medium&type=multiple")
    .then(res => {
        return res.json();
    })
    .then(data => {
      // map the response from the fetch, then create a formatted question object where the question and the choices are formatted to the way we need it, then return the formatted question object into the questions array
        questions = data.results.map(loadedQuestion => {
            const formattedQuestion = {
                Question: loadedQuestion.question
            };

            // spread the incorrect options into the answerChoices array
            const answerChoices = [...loadedQuestion.incorrect_answers]

            // get a random number from 1 - 4 for the correct answer as a prop of the fomattedQuestion object
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

            // add the correct answer to the answerchoices array by putting it at an index of obtained random number - 1
            answerChoices.splice(
                formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            // Iterate through the answerChoices then put each choice value into the formattedQuestion object as choice1, choice2, choice3, choice4
            answerChoices.forEach((choice, idx) => {
                formattedQuestion['choice' + (idx + 1)] = choice
            });

            // console.log(formattedQuestion);
            return formattedQuestion
        })

        // Start the game after gettin the questions
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
    // spreat the qustions into the availableQuestion array
    availableQuestions = [...questions];
    // console.log(availableQuestions);

    // get the new question
    getNewQuestion();

    // show question
    game.classList.remove('hidden');

    // hide the loader
    loader.classList.add('hidden');
}

getNewQuestion = () => {
  // check if the questions if finished or the array is empty
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      // set the most recent score to the local storage
        localStorage.setItem("MostResentScore", score)

        // render the end.html page, since questions is finished
        window.location.assign('/HTML/end.html')
    }

    // else increament the question
    questionCounter++;
    progressText.innerText = `Question: ${questionCounter} / ${MAX_QUESTIONS}`;

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    // get a ramdon number from the total number of questions 
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);

    // get the question at the random index and set it to the current question object
    currentQuestion = availableQuestions[questionIndex];
    // console.log(currentQuestion);

    question.innerText = currentQuestion['Question'];

    // iterate through the options get the stat number then set the inner text to the currentQuestin choiv=ce that match e.g. if number ==== 1 it matches choice1
    choiceText.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    // remove the current question from the available question array.
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true
}

// iterate through the choice text 
choiceText.forEach(ele => {
  // console.log(ele);
    ele.addEventListener('click', e => {
      // if acceptingAnswer === true do nothing
        if (!acceptingAnswers) {
            return;
        }

        // else set it tofalse
        acceptingAnswers = false;

        // get a reference to the selected option by user
        const selectedChoice = e.target;

        // get the data number
        const selectedAnswer = selectedChoice.dataset['number'];
        // console.log(selectedAnswer)


        const classToApply = selectedAnswer == currentQuestion['answer'] ? 'correct' : 'incorrect';

        // add a class to the target parent
        selectedChoice.parentElement.classList.add(classToApply);

        // add to score count on every correct answer
        if (classToApply === 'correct') {
            increamentScore(CORRECT_BONUS)
        }

        // get a new question after 1s and remove the added class.
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion()
        }, 1000)

    });
});

// increasing the score.
increamentScore = num => {
    score += num;
    scoreCount.innerText = score
}