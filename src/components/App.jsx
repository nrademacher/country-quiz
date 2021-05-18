import React, { useState, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import shuffle from 'lodash.shuffle';

const App = () => {
	const [countries, setCountries] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);

	async function getCountries() {
		const res = ajax('https://restcountries.eu/rest/v2/all').pipe(
			map((e) => e.response)
		);
		res.subscribe((res) => {
			setCountries(res);
		});
	}

	useEffect(() => {
		getCountries();
	}, []);

	const questions = shuffle(
		countries.map((country) => {
			const restCountries = countries.filter((c) => c.name !== country.name);
			const answerOptions = [
				{ answerText: country.name, isCorrect: true },
			].concat(
				Array(3)
					.fill(1)
					.map((_) => {
						return {
							answerText:
								restCountries[Math.floor(Math.random() * restCountries.length)]
									.name,
							isCorrect: false,
						};
					})
			);

			return {
				questionText: `${country.capital} is the capital of`,
				answerOptions: shuffle(answerOptions),
			};
		})
	);

	const handleAnswerOptionClick = (isCorrect) => {
		if (isCorrect) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};

	return (
		<div className="app">
			{showScore ? (
				<div className="score-section">
					You scored {score} out of {questions.length}
				</div>
			) : questions.length ? (
				<>
					<div className="question-section">
						<div className="question-count">
							<span>Question {currentQuestion + 1}</span>/{questions.length}
						</div>
						<div className="question-text">
							{questions[currentQuestion].questionText}
						</div>
					</div>
					<div className="answer-section">
						{questions[currentQuestion].answerOptions.map((answerOption) => (
							<button
								key={answerOption.answerText}
								onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
							>
								{answerOption.answerText}
							</button>
						))}
					</div>
				</>
			) : null}
		</div>
	);
}

export default App
