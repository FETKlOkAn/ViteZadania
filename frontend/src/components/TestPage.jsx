import React, { useState, useEffect } from 'react';
import axios from 'axios';
import goodImage from '../assets/images/good.png';
import badImage from '../assets/images/bad.png';
import loadFiles from '../utils/loadFiles';
import './TestPage.css';
import { shuffleArray } from '../utils/shuffleArray';

const TestPage = () => {
    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [optionsAndCorrect, setOptionsAndCorrect] = useState([]);
    const [positiveScore, setPositiveScore] = useState({});
    const [negativeScore, setNegativeScore] = useState({});
    const [trinity, setTrinity] = useState(false);

    const url = 'http://localhost:5000/';

    const categories = {
        1: "botanika",
        2: "fyziologie rostlin",
        3: "zoologie a biologie člověka",
        4: "ekologie",
        5: "genetika"
    };

    // Fetch questions and scores when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = await loadFiles();
                if (questions.length > 0) {
                    shuffleArray(questions);
                    setAllQuestions(questions);
                    setCurrentQuestionIndex(0);
                    generateRandomOptionsAndCorrect(questions[0]);
                } else {
                    console.error('No questions loaded');
                }
                fetchScore();
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, []);

    // Fetch the user's positive and negative scores from the server
    const fetchScore = async () => {
        try {
            const posScore = await getScore(true);
            const negScore = await getScore(false);
            setPositiveScore(posScore);
            setNegativeScore(negScore);
        } catch (error) {
            console.error("Failed to fetch scores:", error);
        }
    };

    // Generate random options including the correct answer for a given question
    const generateRandomOptionsAndCorrect = (question) => {
        if (!question) {
            console.error('Invalid question provided to generateRandomOptionsAndCorrect');
            return;
        }
        const options = [...question.options, question.correctAnswer];
        shuffleArray(options);
        setOptionsAndCorrect(options);
    };

    // Update the user's score on the server based on whether the answer was correct
    const updateScore = async (correct) => {
        try {
            const userID = localStorage.getItem('userID');
            const requestBody = { correct };
            await axios.put(`${url}users/${userID}`, requestBody);
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };

    // Fetch the user's score from the server based on whether we want correct or incorrect score
    const getScore = async (correct) => {
        try {
            const userID = localStorage.getItem('userID');
            const response = await axios.post(`${url}users/score/${userID}`, { correct });
            return response.data;
        } catch (error) {
            console.error(error);
            return {};
        }
    };

    // Handle the user's selection of an option and update the score accordingly
    const handleOptionClick = (option) => {
        setTrinity(true)
        setSelectedOption(option);


        if (option === allQuestions[currentQuestionIndex].correctAnswer) {
            updateScore(true);
            fetchScore();

            setTimeout(() => {
                nextQuestion();
            }, 500);
        } else {
            updateScore(false);

            fetchScore();
        }
    };

    // Move to the next question in the list
    const nextQuestion = () => {
        if (currentQuestionIndex + 1 < allQuestions.length) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption(null);
            setTrinity(false);
            generateRandomOptionsAndCorrect(allQuestions[nextIndex]);
        } else {
            console.log('No more questions available');
        }
    };

    // Get the CSS class for an option based on its correctness and user selection
    const getOptionClass = (option) => {
        if (trinity) {
            if (option === allQuestions[currentQuestionIndex].correctAnswer) {
                return 'option correct';
            } else if (selectedOption === option) {
                return 'option selected-incorrect';
            }
        }
        return 'option';
    };

    return (
        <div className="container">
            {allQuestions.length > 0 && (
                <>
                    <div className="header">
                        <h2>{categories[allQuestions[currentQuestionIndex].category]}</h2>
                        <div className="scores">
                            <p>
                                <img src={goodImage} alt="Good score" />
                                <span className="positive-score">{positiveScore.correct}</span>
                                <img src={badImage} alt="Bad score" />
                                <span className="negative-score">{negativeScore.incorrect}</span>
                            </p>
                        </div>
                    </div>

                    <div className="question-container">
                        <h3>{allQuestions[currentQuestionIndex].name}</h3>
                        <div className="options">
                            {optionsAndCorrect.map((option, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    className={getOptionClass(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                        {trinity && (
                            <button onClick={nextQuestion} className='next'>Ďalší</button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default TestPage;
