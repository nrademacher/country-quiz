import React from 'react';
import shuffle from 'lodash.shuffle';

function generateQuizDeck(subdecks, deckSize) {
  let questions = [];

  subdecks.forEach((subdeck) => {
    const deckQuestions = subdeck.countries.map((country) => {
      const restCountries = subdeck.countries.filter(
        (c) => c.name !== country.name
      );
      const answerOptions = [
        { answerText: country.name, isCorrect: true },
      ].concat(
        Array(3)
          .fill(1)
          .map((_, i) => {
            return {
              answerText:
                restCountries[Math.floor(Math.random() * restCountries.length)]
                  .name,
              isCorrect: false,
            };
          })
      );

      if (subdeck.name === 'flag') {
        return {
          questionText: (
            <>
              <img src={country.flag} className="w-[25%] shadow-lg mb-3" alt="country flag" />
              Which country does this flag belong to?
            </>
          ),
          answerOptions: shuffle(answerOptions),
        };
      } else if (subdeck.name === 'capital') {
        return {
          questionText: `${country.capital} is the capital of`,
          answerOptions: shuffle(answerOptions),
        };
      }

    });

    questions = questions.concat(deckQuestions);
  });

  return shuffle(questions).slice(0, deckSize);
}

export default generateQuizDeck;
