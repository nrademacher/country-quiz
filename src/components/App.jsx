import React, { useState, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import shuffle from 'lodash.shuffle';

export default function App() {
	const [countries, setCountries] = useState([]);

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

	const questions = countries.map((country) => {
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
	});

	const qQuestions = [
		{
			questionText: `What is the capital of ${countries.name}?`,
			answerOptions: [
				{ answerText: 'New York', isCorrect: false },
				{ answerText: 'London', isCorrect: false },
				{ answerText: 'Paris', isCorrect: true },
				{ answerText: 'Dublin', isCorrect: false },
			],
		},
		{
			questionText: 'Who is CEO of Tesla?',
			answerOptions: [
				{ answerText: 'Jeff Bezos', isCorrect: false },
				{ answerText: 'Elon Musk', isCorrect: true },
				{ answerText: 'Bill Gates', isCorrect: false },
				{ answerText: 'Tony Stark', isCorrect: false },
			],
		},
		{
			questionText: 'The iPhone was created by which company?',
			answerOptions: [
				{ answerText: 'Apple', isCorrect: true },
				{ answerText: 'Intel', isCorrect: false },
				{ answerText: 'Amazon', isCorrect: false },
				{ answerText: 'Microsoft', isCorrect: false },
			],
		},
		{
			questionText: 'How many Harry Potter books are there?',
			answerOptions: [
				{ answerText: '1', isCorrect: false },
				{ answerText: '4', isCorrect: false },
				{ answerText: '6', isCorrect: false },
				{ answerText: '7', isCorrect: true },
			],
		},
	];

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);

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
