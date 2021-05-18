import React, { useEffect, useState, useRef } from 'react';
import generateQuizDeck from '../utils/generateQuizDeck';
import shuffle from 'lodash.shuffle';

const App = () => {
	const [quizQuestions, setQuizQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);

	async function getCountries() {
		const raw = await fetch('https://restcountries.eu/rest/v2/all');
		const res = await raw.json();
		return res;
	}

	function initQuiz(countries) {
		const typeCapital = {
			name: 'capital',
			countries: shuffle(countries).slice(0, 125),
		};
		const typeFlag = {
			name: 'flag',
			countries: shuffle(countries).slice(0, 125),
		};
		setQuizQuestions(generateQuizDeck([typeCapital, typeFlag], 5));
	}

	function restartQuiz() {
		setCurrentQuestion(0);
		setShowScore(false);
		setScore(0);

	}

	useEffect(async () => {
		const countries = await getCountries();
		initQuiz(countries);
	}, []);

	const handleAnswerOptionClick = (e, isCorrect) => {
		if (isCorrect) {
			setScore(score + 1);
			e.target.classList.add('text-green-500');
		} else {
			e.target.classList.add('text-red-500');
		}

		if (isCorrect) {
			const nextQuestion = currentQuestion + 1;
			if (nextQuestion < quizQuestions.length) {
				setTimeout(() => {
					setCurrentQuestion(nextQuestion);
					e.target.classList.remove('text-red-500', 'text-green-500');
				}, 1000);
			} else {
				setShowScore(true);
			}
		}
	};

	const handleSkipButtonClick = () => {

			const nextQuestion = currentQuestion + 1;
			if (nextQuestion < quizQuestions.length) {
					setCurrentQuestion(nextQuestion);
			} else {
				setShowScore(true);
			}
	}

	return (
		<div className="app">
			{showScore ? (
				<div className="score-section">
					You scored {score} out of {quizQuestions.length}
					<button onClick={() => restartQuiz()}>Try again</button>
				</div>
			) : quizQuestions.length ? (
				<>
					<div className="question-section">
						<div className="question-count">
							<span>Question {currentQuestion + 1}</span>/{quizQuestions.length}
						</div>
						<div className="question-text">
							{quizQuestions[currentQuestion].questionText}
						</div>
					</div>
					<div className="answer-section">
						{quizQuestions[currentQuestion].answerOptions.map(
							(answerOption) => (
								<button
									key={answerOption.answerText}
									onClick={(e) =>
										handleAnswerOptionClick(e, answerOption.isCorrect)
									}
								>
									{answerOption.answerText}
								</button>
							)
						)}
					</div>
				<button onClick={handleSkipButtonClick}>next</button>
				</>
			) : null}
		</div>
	);
};

export default App;
