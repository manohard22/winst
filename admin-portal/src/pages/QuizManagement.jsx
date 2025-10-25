import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, 
    faEdit, 
    faTrash, 
    faEye,
    faChartBar,
    faQuestionCircle,
    faSave,
    faTimes,
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const QuizManagement = () => {
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);

    const [questionForm, setQuestionForm] = useState({
        questionText: '',
        questionType: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 10,
        explanation: '',
        difficultyLevel: 'medium',
        category: 'general',
        orderIndex: 1
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        if (selectedProgram) {
            fetchQuestions();
        }
    }, [selectedProgram]);

    const fetchPrograms = async () => {
        try {
            const response = await api.get('/admin/programs');
            setPrograms(response.data.programs || []);
        } catch (error) {
            toast.error('Failed to load programs');
        }
    };

    const fetchQuestions = async () => {
        if (!selectedProgram) return;
        
        try {
            setLoading(true);
            const response = await api.get(`/quizzes/admin/questions/${selectedProgram}`);
            setQuestions(response.data.questions || []);
        } catch (error) {
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        if (!selectedProgram) return;
        
        try {
            const response = await api.get(`/quizzes/admin/analytics/${selectedProgram}`);
            setAnalytics(response.data.analytics);
            setShowAnalytics(true);
        } catch (error) {
            toast.error('Failed to load analytics');
        }
    };

    const resetForm = () => {
        setQuestionForm({
            questionText: '',
            questionType: 'multiple_choice',
            options: ['', '', '', ''],
            correctAnswer: '',
            points: 10,
            explanation: '',
            difficultyLevel: 'medium',
            category: 'general',
            orderIndex: questions.length + 1
        });
        setEditingQuestion(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedProgram) {
            toast.error('Please select a program first');
            return;
        }

        // Validation
        if (!questionForm.questionText.trim()) {
            toast.error('Question text is required');
            return;
        }

        if (questionForm.questionType !== 'true_false') {
            const validOptions = questionForm.options.filter(opt => opt.trim());
            if (validOptions.length < 2) {
                toast.error('At least 2 options are required');
                return;
            }
            
            if (!questionForm.correctAnswer) {
                toast.error('Please select the correct answer');
                return;
            }
        }

        try {
            const payload = {
                ...questionForm,
                programId: selectedProgram,
                options: questionForm.questionType === 'true_false' 
                    ? ['True', 'False'] 
                    : questionForm.options.filter(opt => opt.trim())
            };

            if (editingQuestion) {
                await api.put(`/quizzes/admin/questions/${editingQuestion.id}`, payload);
                toast.success('Question updated successfully');
            } else {
                await api.post('/quizzes/admin/questions', payload);
                toast.success('Question created successfully');
            }

            setShowQuestionForm(false);
            resetForm();
            fetchQuestions();
        } catch (error) {
            toast.error(editingQuestion ? 'Failed to update question' : 'Failed to create question');
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setQuestionForm({
            questionText: question.question_text,
            questionType: question.question_type,
            options: Array.isArray(question.options) ? question.options : JSON.parse(question.options || '[]'),
            correctAnswer: question.correct_answer,
            points: question.points,
            explanation: question.explanation || '',
            difficultyLevel: question.difficulty_level,
            category: question.category,
            orderIndex: question.order_index
        });
        setShowQuestionForm(true);
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            await api.delete(`/quizzes/admin/questions/${questionId}`);
            toast.success('Question deleted successfully');
            fetchQuestions();
        } catch (error) {
            toast.error('Failed to delete question');
        }
    };

    const addOption = () => {
        if (questionForm.options.length < 6) {
            setQuestionForm(prev => ({
                ...prev,
                options: [...prev.options, '']
            }));
        }
    };

    const removeOption = (index) => {
        if (questionForm.options.length > 2) {
            const newOptions = questionForm.options.filter((_, i) => i !== index);
            setQuestionForm(prev => ({
                ...prev,
                options: newOptions,
                correctAnswer: prev.correctAnswer === prev.options[index] ? '' : prev.correctAnswer
            }));
        }
    };

    const updateOption = (index, value) => {
        const newOptions = [...questionForm.options];
        newOptions[index] = value;
        setQuestionForm(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const QuestionForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">
                            {editingQuestion ? 'Edit Question' : 'Create New Question'}
                        </h3>
                        <button
                            onClick={() => {
                                setShowQuestionForm(false);
                                resetForm();
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question Text *
                            </label>
                            <textarea
                                value={questionForm.questionText}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, questionText: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Enter your question..."
                                required
                            />
                        </div>

                        {/* Question Type and Basic Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question Type
                                </label>
                                <select
                                    value={questionForm.questionType}
                                    onChange={(e) => {
                                        const newType = e.target.value;
                                        setQuestionForm(prev => ({
                                            ...prev,
                                            questionType: newType,
                                            options: newType === 'true_false' ? ['True', 'False'] : ['', '', '', ''],
                                            correctAnswer: ''
                                        }));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="single_choice">Single Choice</option>
                                    <option value="true_false">True/False</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Points
                                </label>
                                <input
                                    type="number"
                                    value={questionForm.points}
                                    onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                    max="100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={questionForm.difficultyLevel}
                                    onChange={(e) => setQuestionForm(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        {/* Options */}
                        {questionForm.questionType !== 'true_false' && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Answer Options *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        disabled={questionForm.options.length >= 6}
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                        Add Option
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {questionForm.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                value={option}
                                                checked={questionForm.correctAnswer === option}
                                                onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                                className="text-blue-600"
                                            />
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {questionForm.options.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Select the radio button next to the correct answer
                                </p>
                            </div>
                        )}

                        {/* True/False Selection */}
                        {questionForm.questionType === 'true_false' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correct Answer *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            value="True"
                                            checked={questionForm.correctAnswer === 'True'}
                                            onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                            className="text-blue-600 mr-2"
                                        />
                                        True
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            value="False"
                                            checked={questionForm.correctAnswer === 'False'}
                                            onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                            className="text-blue-600 mr-2"
                                        />
                                        False
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Explanation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation (Optional)
                            </label>
                            <textarea
                                value={questionForm.explanation}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Explain why this is the correct answer..."
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowQuestionForm(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                {editingQuestion ? 'Update Question' : 'Create Question'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
                <p className="text-gray-600">Create and manage quiz questions for your programs</p>
            </div>

            {/* Program Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Program Selection</h2>
                    {selectedProgram && (
                        <button
                            onClick={fetchAnalytics}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                            View Analytics
                        </button>
                    )}
                </div>
                <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select a program</option>
                    {programs.map(program => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedProgram && (
                <div className="bg-white rounded-lg shadow">
                    {/* Questions Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Quiz Questions ({questions.length})</h2>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowQuestionForm(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Add Question
                            </button>
                        </div>
                    </div>

                    {/* Questions List */}
                    {loading ? (
                        <div className="p-12 text-center">
                            <LoadingSpinner />
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="p-12 text-center">
                            <FontAwesomeIcon icon={faQuestionCircle} className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
                            <p className="text-gray-500 mb-6">Create your first quiz question for this program</p>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowQuestionForm(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Create First Question
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {questions.map((question, index) => (
                                <div key={question.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                                    {question.question_type.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                                                    {question.points} pts
                                                </span>
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                    question.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                                                    question.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {question.difficulty_level.toUpperCase()}
                                                </span>
                                                {question.submission_count > 0 && (
                                                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                                                        {question.submission_count} submissions
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Q{index + 1}. {question.question_text}
                                            </h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                {Array.isArray(question.options) ? 
                                                    question.options.map((option, optIndex) => (
                                                        <div key={optIndex} className={`flex items-center ${
                                                            option === question.correct_answer ? 'text-green-600 font-medium' : ''
                                                        }`}>
                                                            <span className="mr-2">
                                                                {option === question.correct_answer && <FontAwesomeIcon icon={faCheck} className="mr-1" />}
                                                                {String.fromCharCode(65 + optIndex)}.
                                                            </span>
                                                            {option}
                                                        </div>
                                                    )) : 
                                                    JSON.parse(question.options || '[]').map((option, optIndex) => (
                                                        <div key={optIndex} className={`flex items-center ${
                                                            option === question.correct_answer ? 'text-green-600 font-medium' : ''
                                                        }`}>
                                                            <span className="mr-2">
                                                                {option === question.correct_answer && <FontAwesomeIcon icon={faCheck} className="mr-1" />}
                                                                {String.fromCharCode(65 + optIndex)}.
                                                            </span>
                                                            {option}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            {question.explanation && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Explanation:</strong> {question.explanation}
                                                    </p>
                                                </div>
                                            )}
                                            {question.success_rate !== null && (
                                                <div className="mt-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <span className="mr-2">Success Rate:</span>
                                                        <div className="bg-gray-200 rounded-full h-2 w-32 mr-2">
                                                            <div 
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{ width: `${question.success_rate}%` }}
                                                            ></div>
                                                        </div>
                                                        <span>{question.success_rate}%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(question)}
                                                className="text-blue-600 hover:text-blue-800 p-2"
                                                title="Edit Question"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(question.id)}
                                                className="text-red-600 hover:text-red-800 p-2"
                                                title="Delete Question"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Question Form Modal */}
            {showQuestionForm && <QuestionForm />}

            {/* Analytics Modal */}
            {showAnalytics && analytics && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Quiz Analytics</h3>
                                <button
                                    onClick={() => setShowAnalytics(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            {/* Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{analytics.overview.students_participated}</div>
                                    <div className="text-sm text-blue-800">Students Participated</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{analytics.overview.total_questions}</div>
                                    <div className="text-sm text-green-800">Total Questions</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{analytics.overview.total_submissions}</div>
                                    <div className="text-sm text-purple-800">Total Submissions</div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{analytics.overview.overall_success_rate}%</div>
                                    <div className="text-sm text-orange-800">Success Rate</div>
                                </div>
                            </div>

                            {/* Question Performance */}
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Question Performance</h4>
                                <div className="space-y-4">
                                    {analytics.question_performance.map((question, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h5 className="font-medium text-gray-900">{question.question_text}</h5>
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                    question.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                                                    question.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {question.difficulty_level}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-600 mr-4">
                                                        {question.attempts} attempts
                                                    </span>
                                                    <div className="bg-gray-200 rounded-full h-2 w-32 mr-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${
                                                                question.success_rate >= 80 ? 'bg-green-500' :
                                                                question.success_rate >= 60 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                            style={{ width: `${question.success_rate}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium">{question.success_rate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizManagement;