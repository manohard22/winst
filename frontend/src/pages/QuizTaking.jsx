import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';

const QuizTaking = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [lastSubmissionResult, setLastSubmissionResult] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);

    useEffect(() => {
        fetchQuestions();
        fetchProgress();
    }, [programId]);

    const fetchQuestions = async () => {
        try {
            const response = await api.get(`/quizzes/program/${programId}`);
            setQuestions(response.data.questions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error('Failed to load quiz questions');
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await api.get(`/quizzes/progress/${programId}`);
            setProgress(response.data.progress);
            
            if (response.data.progress.completion_percentage === 100) {
                setQuizCompleted(true);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const submitAnswer = async () => {
        if (!selectedAnswer) {
            toast.error('Please select an answer');
            return;
        }

        setSubmitting(true);
        try {
            const currentQuestion = questions[currentQuestionIndex];
            const response = await api.post('/quizzes/submit-answer', {
                questionId: currentQuestion.id,
                selectedAnswer
            });

            setLastSubmissionResult(response.data);
            setShowExplanation(true);
            
            // Update the question in local state
            const updatedQuestions = [...questions];
            updatedQuestions[currentQuestionIndex] = {
                ...updatedQuestions[currentQuestionIndex],
                is_answered: true,
                selected_answer: selectedAnswer,
                is_correct: response.data.is_correct,
                score: response.data.score
            };
            setQuestions(updatedQuestions);

            // Refresh progress
            await fetchProgress();

        } catch (error) {
            console.error('Error submitting answer:', error);
            toast.error('Failed to submit answer');
        }
        setSubmitting(false);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setShowExplanation(false);
            setLastSubmissionResult(null);
        } else {
            setQuizCompleted(true);
            toast.success('Quiz completed! Check your progress in the dashboard.');
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setShowExplanation(false);
            setLastSubmissionResult(null);
            
            // Set selected answer if question was already answered
            const prevQuestion = questions[currentQuestionIndex - 1];
            setSelectedAnswer(prevQuestion.selected_answer || '');
        }
    };

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        setShowExplanation(false);
        setLastSubmissionResult(null);
        
        const question = questions[index];
        setSelectedAnswer(question.selected_answer || '');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Quiz Available</h2>
                    <p className="text-gray-600 mb-6">There are no quiz questions available for this program yet.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const answeredQuestions = questions.filter(q => q.is_answered).length;
    const progressPercent = (answeredQuestions / questions.length) * 100;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">Program Quiz</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {progress && (
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Quiz Progress</span>
                            <span className="text-sm text-gray-600">
                                {answeredQuestions}/{questions.length} questions
                            </span>
                        </div>
                        <ProgressBar progress={progressPercent} height="h-2" />
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                            <span>Score: {progress.total_score}/{progress.max_possible_score} points</span>
                            <span>{progress.percentage_score}%</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Question Navigator */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-4 shadow-sm border sticky top-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Questions</h3>
                        <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                            {questions.map((question, index) => (
                                <button
                                    key={question.id}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                        currentQuestionIndex === index
                                            ? 'bg-blue-600 text-white'
                                            : question.is_answered
                                            ? question.is_correct
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                                <span className="text-gray-600">Current</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 rounded"></div>
                                <span className="text-gray-600">Correct</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 rounded"></div>
                                <span className="text-gray-600">Incorrect</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                                <span className="text-gray-600">Unanswered</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Question Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-lg shadow-sm border"
                        >
                            {/* Question Header */}
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">
                                        Question {currentQuestionIndex + 1} of {questions.length}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">
                                            {currentQuestion.points} points
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            currentQuestion.difficulty_level === 'easy'
                                                ? 'bg-green-100 text-green-800'
                                                : currentQuestion.difficulty_level === 'medium'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {currentQuestion.difficulty_level}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {currentQuestion.question_text}
                                </h2>
                                {currentQuestion.category && (
                                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                        {currentQuestion.category}
                                    </span>
                                )}
                            </div>

                            {/* Answer Options */}
                            <div className="p-6">
                                <div className="space-y-3">
                                    {currentQuestion.options.map((option, index) => {
                                        const optionKey = String.fromCharCode(97 + index); // a, b, c, d
                                        const isSelected = selectedAnswer === optionKey;
                                        const isCorrect = currentQuestion.correct_answer === optionKey;
                                        const showCorrectAnswer = showExplanation;

                                        return (
                                            <label
                                                key={optionKey}
                                                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                    showCorrectAnswer
                                                        ? isCorrect
                                                            ? 'border-green-500 bg-green-50'
                                                            : isSelected && !isCorrect
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200 bg-gray-50'
                                                        : isSelected
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestion.id}`}
                                                        value={optionKey}
                                                        checked={isSelected}
                                                        onChange={(e) => setSelectedAnswer(e.target.value)}
                                                        disabled={showExplanation}
                                                        className="mr-3"
                                                    />
                                                    <span className={`font-medium mr-3 ${
                                                        showCorrectAnswer && isCorrect ? 'text-green-800' :
                                                        showCorrectAnswer && isSelected && !isCorrect ? 'text-red-800' : 'text-gray-700'
                                                    }`}>
                                                        {optionKey.toUpperCase()}.
                                                    </span>
                                                    <span className={`${
                                                        showCorrectAnswer && isCorrect ? 'text-green-800' :
                                                        showCorrectAnswer && isSelected && !isCorrect ? 'text-red-800' : 'text-gray-900'
                                                    }`}>
                                                        {option}
                                                    </span>
                                                    {showCorrectAnswer && isCorrect && (
                                                        <span className="ml-auto text-green-600">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                    {showCorrectAnswer && isSelected && !isCorrect && (
                                                        <span className="ml-auto text-red-600">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {showExplanation && lastSubmissionResult && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 p-4 bg-gray-50 rounded-lg border"
                                    >
                                        <div className={`flex items-center gap-2 mb-3 ${
                                            lastSubmissionResult.is_correct ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                {lastSubmissionResult.is_correct ? (
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                ) : (
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                )}
                                            </svg>
                                            <span className="font-semibold">
                                                {lastSubmissionResult.is_correct ? 'Correct!' : 'Incorrect'}
                                            </span>
                                            <span className="text-gray-600">
                                                (+{lastSubmissionResult.score} points)
                                            </span>
                                        </div>
                                        
                                        {currentQuestion.explanation && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
                                                <p className="text-gray-700">{currentQuestion.explanation}</p>
                                            </div>
                                        )}

                                        {!lastSubmissionResult.is_correct && (
                                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                                <p className="text-blue-800">
                                                    <strong>Correct answer:</strong> {lastSubmissionResult.correct_answer.toUpperCase()}. {currentQuestion.options[lastSubmissionResult.correct_answer.charCodeAt(0) - 97]}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <button
                                        onClick={previousQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-3">
                                        {!showExplanation ? (
                                            <button
                                                onClick={submitAnswer}
                                                disabled={!selectedAnswer || submitting}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {submitting && <LoadingSpinner size="sm" />}
                                                Submit Answer
                                            </button>
                                        ) : (
                                            <button
                                                onClick={nextQuestion}
                                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Quiz Completion */}
                    {quizCompleted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                        >
                            <div className="text-green-600 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-green-800 mb-2">Quiz Completed!</h3>
                            <p className="text-green-700 mb-4">
                                Congratulations! You have completed all quiz questions.
                            </p>
                            {progress && (
                                <div className="bg-white rounded-lg p-4 mb-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{progress.total_score}</div>
                                            <div className="text-sm text-gray-600">Total Score</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{progress.percentage_score}%</div>
                                            <div className="text-sm text-gray-600">Percentage</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{progress.answered_questions}</div>
                                            <div className="text-sm text-gray-600">Questions Answered</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{questions.filter(q => q.is_correct).length}</div>
                                            <div className="text-sm text-gray-600">Correct Answers</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Back to Dashboard
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizTaking;