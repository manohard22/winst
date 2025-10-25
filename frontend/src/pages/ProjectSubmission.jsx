import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGithub, 
    faJs, 
    faReact, 
    faNodeJs, 
    faPython,
    faGitAlt,
    faHtml5,
    faCss3Alt
} from '@fortawesome/free-brands-svg-icons';
import { 
    faExternalLinkAlt, 
    faCode, 
    faCheck, 
    faTimes, 
    faSpinner,
    faStar,
    faCodeBranch,
    faEye,
    faCalendar,
    faUser,
    faPlus,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectSubmission = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [validating, setValidating] = useState(false);
    const [task, setTask] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [githubValidation, setGithubValidation] = useState(null);
    const [techStackOptions, setTechStackOptions] = useState([]);
    const [selectedTechStack, setSelectedTechStack] = useState([]);
    
    const [formData, setFormData] = useState({
        githubUrl: '',
        liveUrl: '',
        description: '',
        techStack: '',
        implementationNotes: ''
    });

    const [errors, setErrors] = useState({});

    // Popular tech stack options
    const commonTechStack = [
        { name: 'React', icon: faReact, color: '#61DAFB' },
        { name: 'Node.js', icon: faNodeJs, color: '#339933' },
        { name: 'JavaScript', icon: faJs, color: '#F7DF1E' },
        { name: 'Python', icon: faPython, color: '#3776AB' },
        { name: 'HTML5', icon: faHtml5, color: '#E34F26' },
        { name: 'CSS3', icon: faCss3Alt, color: '#1572B6' },
        { name: 'MongoDB', icon: faCode, color: '#47A248' },
        { name: 'Express.js', icon: faNodeJs, color: '#000000' },
        { name: 'Vue.js', icon: faCode, color: '#4FC08D' },
        { name: 'Angular', icon: faCode, color: '#DD0031' },
        { name: 'TypeScript', icon: faCode, color: '#3178C6' },
        { name: 'PHP', icon: faCode, color: '#777BB4' },
        { name: 'MySQL', icon: faCode, color: '#4479A1' },
        { name: 'PostgreSQL', icon: faCode, color: '#336791' },
        { name: 'Docker', icon: faCode, color: '#2496ED' },
        { name: 'AWS', icon: faCode, color: '#FF9900' },
        { name: 'Firebase', icon: faCode, color: '#FFCA28' },
        { name: 'Redux', icon: faCode, color: '#764ABC' }
    ];

    useEffect(() => {
        fetchTaskDetails();
        fetchExistingSubmission();
        setTechStackOptions(commonTechStack);
    }, [taskId]);

    const fetchTaskDetails = async () => {
        try {
            const response = await api.get(`/tasks/${taskId}`);
            setTask(response.data.task);
        } catch (error) {
            console.error('Error fetching task:', error);
            toast.error('Failed to load task details');
            navigate('/dashboard');
        }
    };

    const fetchExistingSubmission = async () => {
        try {
            const response = await api.get('/projects/my-submissions');
            const existingSubmission = response.data.submissions.find(
                sub => sub.task_id === parseInt(taskId)
            );
            
            if (existingSubmission) {
                setSubmission(existingSubmission);
                setFormData({
                    githubUrl: existingSubmission.github_url || '',
                    liveUrl: existingSubmission.live_url || '',
                    description: existingSubmission.description || '',
                    techStack: existingSubmission.tech_stack || '',
                    implementationNotes: existingSubmission.implementation_notes || ''
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setLoading(false);
        }
    };

    const validateGithubUrl = async (url) => {
        if (!url || !url.includes('github.com')) {
            setGithubValidation(null);
            return;
        }

        setValidating(true);
        try {
            const response = await api.post('/projects/validate-github', { githubUrl: url });
            setGithubValidation(response.data);
        } catch (error) {
            console.error('Error validating GitHub URL:', error);
            setGithubValidation({ 
                success: false, 
                error: 'Failed to validate repository' 
            });
        }
        setValidating(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Auto-validate GitHub URL
        if (name === 'githubUrl') {
            const timeoutId = setTimeout(() => {
                validateGithubUrl(value);
            }, 500);
            
            return () => clearTimeout(timeoutId);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.githubUrl.trim()) {
            newErrors.githubUrl = 'GitHub URL is required';
        } else if (!formData.githubUrl.includes('github.com')) {
            newErrors.githubUrl = 'Please enter a valid GitHub URL';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Project description is required';
        } else if (formData.description.trim().length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        if (!formData.techStack.trim()) {
            newErrors.techStack = 'Tech stack information is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        if (githubValidation && !githubValidation.success) {
            toast.error('Please provide a valid GitHub repository');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/projects/submit', {
                taskId: parseInt(taskId),
                ...formData
            });

            toast.success(submission ? 'Project updated successfully!' : 'Project submitted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting project:', error);
            toast.error(error.response?.data?.error || 'Failed to submit project');
        }
        setSubmitting(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!task) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
                    <p className="text-gray-600 mb-6">The requested task could not be found.</p>
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">Project Submission</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
                
                {submission && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-blue-800 font-medium">
                                {submission.status === 'submitted' ? 'Previously Submitted' : 'Update Submission'}
                            </span>
                        </div>
                        <p className="text-blue-700 mt-1 text-sm">
                            You can update your submission at any time before the final review.
                        </p>
                    </div>
                )}
            </div>

            {/* Task Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{task.title}</h2>
                <p className="text-gray-700 mb-4">{task.description}</p>
                
                {task.requirements && (
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{task.requirements}</pre>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    <span>Max Score: {task.max_score} points</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.type === 'project' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {task.type}
                    </span>
                </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* GitHub URL */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository Information</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub Repository URL *
                            </label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                placeholder="https://github.com/username/repository"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.githubUrl ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.githubUrl && (
                                <p className="text-red-600 text-sm mt-1">{errors.githubUrl}</p>
                            )}
                            
                            {validating && (
                                <div className="flex items-center gap-2 mt-2 text-blue-600">
                                    <LoadingSpinner size="sm" />
                                    <span className="text-sm">Validating repository...</span>
                                </div>
                            )}
                            
                            {githubValidation && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className={`mt-3 p-3 rounded-lg border ${
                                        githubValidation.success
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                    }`}
                                >
                                    {githubValidation.success ? (
                                        <div>
                                            <div className="flex items-center gap-2 text-green-800 mb-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">Repository Validated</span>
                                            </div>
                                            {githubValidation.data && (
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium">Repository:</span> {githubValidation.data.full_name}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Language:</span> {githubValidation.data.language || 'Not specified'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Stars:</span> {githubValidation.data.stars}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Updated:</span> {new Date(githubValidation.data.updated_at).toLocaleDateString()}
                                                    </div>
                                                    {githubValidation.data.description && (
                                                        <div className="col-span-2">
                                                            <span className="font-medium">Description:</span> {githubValidation.data.description}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-800">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>{githubValidation.error}</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Live Demo URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="liveUrl"
                                value={formData.liveUrl}
                                onChange={handleInputChange}
                                placeholder="https://your-project-demo.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-gray-500 text-sm mt-1">
                                Provide a link to your deployed project (e.g., Vercel, Netlify, Heroku)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Project Details */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Describe your project, its purpose, key features, and what makes it unique..."
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            <div className="flex items-center justify-between mt-1">
                                {errors.description && (
                                    <p className="text-red-600 text-sm">{errors.description}</p>
                                )}
                                <p className="text-gray-500 text-sm ml-auto">
                                    {formData.description.length} characters (minimum 50)
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Technologies Used *
                            </label>
                            <input
                                type="text"
                                name="techStack"
                                value={formData.techStack}
                                onChange={handleInputChange}
                                placeholder="e.g., React, Node.js, MongoDB, Tailwind CSS"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.techStack ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.techStack && (
                                <p className="text-red-600 text-sm mt-1">{errors.techStack}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">
                                List the main technologies, frameworks, and libraries used
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Implementation Notes (Optional)
                            </label>
                            <textarea
                                name="implementationNotes"
                                value={formData.implementationNotes}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Any additional implementation details, challenges faced, or special features..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Submission Status */}
                {submission && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Status</h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-700">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                    submission.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                                    submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {submission.status}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-700">Submitted:</span>
                                <span className="text-gray-900">
                                    {new Date(submission.submitted_at).toLocaleString()}
                                </span>
                            </div>

                            {submission.score && (
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-700">Score:</span>
                                    <span className="text-gray-900 font-semibold">
                                        {submission.score} / {task.max_score} points
                                    </span>
                                </div>
                            )}

                            {submission.feedback && (
                                <div>
                                    <span className="font-medium text-gray-700 block mb-2">Feedback:</span>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-gray-900">{submission.feedback}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting || validating || (githubValidation && !githubValidation.success)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting && <LoadingSpinner size="sm" />}
                        {submission ? 'Update Submission' : 'Submit Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectSubmission;
