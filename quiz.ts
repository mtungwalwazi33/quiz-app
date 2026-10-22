
namespace QuizApp {
interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

    
const questions: QuizQuestion[] = [
    {
        question: "Which language is used to structure a web page?",
        options: ["Python", "HTML", "SQL", "TypeScript"],
        correctAnswer: "HTML"
    },
    {
        question: "Which language is mainly used to style a web page?",
        options: ["JavaScript", "Python", "CSS", "SQL"],
        correctAnswer: "CSS"
    },
    {
        question: "What does TypeScript compile into?",
        options: ["HTML", "CSS", "SQL", "JavaScript"],
        correctAnswer: "JavaScript"
    },
    {
        question: "What is an interface used for in TypeScript?",
        options: [
            "To define the structure of an object",
            "To add colors to a web page",
            "To create a database",
            "To display an image"
        ],
        correctAnswer: "To define the structure of an object"
    },
    {
        question: "Which method adds an event listener to an HTML element?",
        options: [
            "console.log()",
            "addEventListener()",
            "Math.round()",
            "JSON.stringify()"
        ],
        correctAnswer: "addEventListener()"
    },
    {
        question: "Which TypeScript data type is used for a true or false value?",
        options: ["string", "number", "boolean", "void"],
        correctAnswer: "boolean"
    },
    {
        question: "Which keyword declares a variable that can be reassigned?",
        options: ["const", "let", "interface", "return"],
        correctAnswer: "let"
    },
    {
        question: "Which DOM property can change the text inside an HTML element?",
        options: [
            "textContent",
            "addEventListener",
            "console.log",
            "parseInt"
        ],
        correctAnswer: "textContent"
    },
    {
        question: "What is the purpose of a function in TypeScript?",
        options: [
            "To define reusable blocks of code",
            "To store only images",
            "To replace all HTML elements",
            "To automatically style a web page"
        ],
        correctAnswer: "To define reusable blocks of code"
    },
    {
        question: "Which method adds a new element to the end of a JavaScript array?",
        options: [
            "pop()",
            "shift()",
            "push()",
            "slice()"
        ],
        correctAnswer: "push()"
    }
];


const quizScreen = document.getElementById("quiz-screen") as HTMLElement;
const resultScreen = document.getElementById("result-screen") as HTMLElement;

const questionElement = document.getElementById("question") as HTMLHeadingElement;
const questionCountElement = document.getElementById("question-count") as HTMLSpanElement;
const scoreDisplayElement = document.getElementById("score-display") as HTMLSpanElement;
const progressBar = document.getElementById("progress-bar") as HTMLDivElement;

const answerForm = document.getElementById("answer-form") as HTMLFormElement;
const answerOptions = document.getElementById("answer-options") as HTMLFieldSetElement;
const feedbackElement = document.getElementById("feedback") as HTMLParagraphElement;

const submitButton = document.getElementById("submit-button") as HTMLButtonElement;
const nextButton = document.getElementById("next-button") as HTMLButtonElement;
const restartButton = document.getElementById("restart-button") as HTMLButtonElement;

const finalScoreElement = document.getElementById("final-score") as HTMLHeadingElement;
const percentageElement = document.getElementById("percentage") as HTMLParagraphElement;
const resultMessageElement = document.getElementById("result-message") as HTMLParagraphElement;

// Quiz state
let currentQuestionIndex: number = 0;
let score: number = 0;
let answerSubmitted: boolean = false;
let quizQuestions: QuizQuestion[] = [...questions];

// Display the current question and its options
function showQuestion(): void {
    const currentQuestion: QuizQuestion = quizQuestions[currentQuestionIndex];

    answerSubmitted = false;

    questionElement.textContent = currentQuestion.question;

    questionCountElement.textContent =
        `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

    scoreDisplayElement.textContent = `Score: ${score}`;

    progressBar.style.width =
        `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;

    feedbackElement.textContent = "";
    feedbackElement.className = "";

    // Remove only the generated options so the <legend> caption is kept
    answerOptions
        .querySelectorAll(".option")
        .forEach((option: Element): void => {
            option.remove();
        });

    currentQuestion.options.forEach((option: string, index: number): void => {
        const wrapper = document.createElement("div");
        wrapper.className = "option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.id = `answer-${index}`;
        radio.value = option;

        const label = document.createElement("label");
        label.htmlFor = radio.id;
        label.textContent = option;

        wrapper.append(radio, label);
        answerOptions.appendChild(wrapper);
    });

    submitButton.disabled = false;
    submitButton.hidden = false;
    nextButton.hidden = true;
    nextButton.textContent =
        currentQuestionIndex === quizQuestions.length - 1
            ? "View Results"
            : "Next Question";
}

function submitAnswer(event: SubmitEvent): void {
    event.preventDefault();

    if (answerSubmitted) {
        return;
    }

    const selectedRadio = answerOptions.querySelector<HTMLInputElement>(
        'input[name="answer"]:checked'
    );

    if (selectedRadio === null) {
        feedbackElement.textContent = "Please select an answer first.";
        feedbackElement.className = "error";
        return;
    }

    answerSubmitted = true;

    const currentQuestion: QuizQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect: boolean =
        selectedRadio.value === currentQuestion.correctAnswer;

    const radioButtons = answerOptions.querySelectorAll<HTMLInputElement>(
        'input[name="answer"]'
    );

    radioButtons.forEach((radio: HTMLInputElement): void => {
        radio.disabled = true;
    });

    if (isCorrect) {
        score++;

        feedbackElement.textContent = "Correct! Well done!";
        feedbackElement.className = "success";
    } else {
        feedbackElement.textContent =
            `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`;

        feedbackElement.className = "error";
    }

    scoreDisplayElement.textContent = `Score: ${score}`;

    const optionWrappers = answerOptions.querySelectorAll(".option");

    optionWrappers.forEach((wrapper: Element): void => {
        const radio = wrapper.querySelector<HTMLInputElement>("input");

        if (radio === null) {
            return;
        }

        if (radio.value === currentQuestion.correctAnswer) {
            wrapper.classList.add("correct");
        } else if (radio.checked) {
            wrapper.classList.add("wrong");
        }
    });

    submitButton.disabled = true;
    nextButton.hidden = false;
}

// Move forward or show the final results
function nextQuestion(): void {
    if (!answerSubmitted) {
        return;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults(): void {
    quizScreen.hidden = true;
    resultScreen.hidden = false;

    const percentage: number = Math.round(
        (score / quizQuestions.length) * 100
    );

    finalScoreElement.textContent = `${score} / ${quizQuestions.length}`;
    percentageElement.textContent = `${percentage}%`;

    if (percentage >= 80) {
        resultMessageElement.textContent =
            "Excellent work! You have a strong understanding of web development.";
    } else if (percentage >= 50) {
        resultMessageElement.textContent =
            "Good effort! Review the questions you missed and keep practising.";
    } else {
        resultMessageElement.textContent =
            "Keep practising. Review the basics and try again!";
    }

    progressBar.style.width = "100%";
}

function restartQuiz(): void {
    const previousOrder: QuizQuestion[] = quizQuestions;
    quizQuestions = [...questions];

    for (let index = quizQuestions.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [quizQuestions[index], quizQuestions[randomIndex]] =
            [quizQuestions[randomIndex], quizQuestions[index]];
    }

    if (quizQuestions.every((question, index) => question === previousOrder[index])) {
        [quizQuestions[0], quizQuestions[1]] = [quizQuestions[1], quizQuestions[0]];
    }

    currentQuestionIndex = 0;
    score = 0;
    answerSubmitted = false;

    resultScreen.hidden = true;
    quizScreen.hidden = false;

    showQuestion();
}

answerForm.addEventListener("submit", submitAnswer);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);

showQuestion();
}
