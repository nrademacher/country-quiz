import React, { useEffect, useState } from 'react';
import generateQuizDeck from '../utils/generateQuizDeck';
import shuffle from 'lodash.shuffle';

const App = () => {
	const [quizQuestions, setQuizQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [score, setScore] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [wrongAnswer, setWrongAnswer] = useState(false);

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
		setQuizQuestions(generateQuizDeck([typeCapital, typeFlag], 10));
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

	const handleAnswerOptionClick = (currentTarget, isCorrect) => {
		currentTarget.children[1].classList.remove('hidden');
		if (isCorrect) {
			setScore(score + 1);
			currentTarget.classList.replace('text-indigo-500', 'text-white');
			currentTarget.classList.replace('border-indigo-500', 'border-green-500');
			currentTarget.classList.add('bg-green-500');
		} else {
			setWrongAnswer(true);
			currentTarget.classList.replace('text-indigo-500', 'text-white');
			currentTarget.classList.replace('border-indigo-500', 'border-red-500');
			currentTarget.classList.add('bg-red-500');
		}

		if (isCorrect) {
			const nextQuestion = currentQuestion + 1;
			if (nextQuestion < quizQuestions.length) {
				setTimeout(() => {
					setCurrentQuestion(nextQuestion);
				}, 1500);
			} else {
				setShowScore(true);
			}
		}
	};

	const handleSkipButtonClick = () => {
		setWrongAnswer(false);
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < quizQuestions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};

	return (
		<div className="grid place-items-center min-h-screen text-indigo-900 bg-gradient-to-r from-indigo-500 to-indigo-700">
		<main className="w-[90%] md:w-[30%] md:relative">
				<header
		className={`flex justify-between items-center mb-4 md:mb-0 w-full md:absolute ${
			!showScore ? 'md:-mt-20' : 'md:-mt-12'
					}`}
				>
		<h1 className="text-white font-bold text-2xl md:text-3xl mb-4">Country Quiz</h1>
					{!showScore ? (
						<img src="/undraw_adventure_4hum 1.svg" className="w-[20%] md:w-min" alt="adventure" />
					) : null}
				</header>
				<article className="bg-white p-8 rounded-xl">
					{showScore ? (
						<section className="grid place-items-center gap-8 score-section">
							<img src="/undraw_winners_ao2o 2.svg" alt="winners" />
							<article className="grid place-items-center">
								<h2 className="font-bold text-6xl mb-1">Results</h2>
								<p>
									You scored{' '}
									<span className="text-green-500 font-bold text-3xl">
										{score}
									</span>{' '}
									out of {quizQuestions.length}
								</p>
							</article>
							<button
								onClick={() => restartQuiz()}
								className="font-semibold rounded-xl py-3 px-8 border-2 border-indigo-900 transition-all duration-200 hover:bg-indigo-900 hover:text-white"
							>
								Try again
							</button>
						</section>
					) : quizQuestions.length ? (
						<section>
						<article className="mt-4 md:mt-12">
								<div className="text-xl font-semibold text-indigo-900 mb-8">
									{quizQuestions[currentQuestion].questionText}
								</div>
							</article>
							<article className="flex flex-col justify-start">
								{quizQuestions[currentQuestion].answerOptions.map(
									(answerOption, i) => {
										const letters = {
											0: 'A',
											1: 'B',
											2: 'C',
											3: 'D',
										};
										return (
											<button
												key={answerOption.answerText}
											className="transition-all duration-200 w-full flex justify-between text-sm md:text-base text-indigo-500 rounded-lg mb-4 p-4 border-indigo-500 border-2 hover:text-white hover:bg-[#f9a826] hover:border-[#f9a826]"
												onClick={(e) => {
													handleAnswerOptionClick(e.currentTarget, answerOption.isCorrect);
												}}
											>
												<span>
													<span className="font-semibold mr-16">
														{letters[i]}
													</span>
													<span>{answerOption.answerText}</span>
												</span>
												{answerOption.isCorrect ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="hidden h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="hidden h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
												)}
											</button>
										);
									}
								)}
								{wrongAnswer && (
									<button
										className="self-end font-semibold rounded-xl bg-[#f9a826] py-3 px-8 mt-4 text-white"
										onClick={handleSkipButtonClick}
									>
										Next
									</button>
								)}
							</article>
						</section>
					) : null}
				</article>
			</main>
		</div>
	);
};

export default App;
