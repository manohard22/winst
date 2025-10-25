import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGithub, 
    faJs, 
    faReact, 
    faNodeJs, 
    faPython,
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
    faTrash,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectSubmissionEnhanced = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [validating, setValidating] = useState(false);
    const [task, setTask] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [githubValidation, setGithubValidation] = useState(null);
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
                
                // Parse tech stack and GitHub data if available
                if (existingSubmission.tech_stack) {
                    const techArray = existingSubmission.tech_stack.split(',').map(t => t.trim());
                    setSelectedTechStack(techArray);
                }
                
                // If GitHub data exists, set validation
                if (existingSubmission.github_data) {
                    try {
                        const githubData = JSON.parse(existingSubmission.github_data);
                        setGithubValidation({ valid: true, data: githubData });
                    } catch (e) {
                        console.error('Error parsing GitHub data:', e);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateGitHubUrl = async (url) => {
        if (!url.trim()) {
            setGithubValidation(null);
            return;
        }

        // Basic URL validation
        const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/;
        if (!githubRegex.test(url)) {
            setGithubValidation({ valid: false, error: 'Invalid GitHub URL format' });
            return;
        }

        try {
            setValidating(true);
            const response = await api.post('/projects/validate-github', { githubUrl: url });
            
            if (response.data.success) {
                setGithubValidation({ valid: true, data: response.data.data });
                setErrors(prev => ({ ...prev, githubUrl: '' }));
            } else {
                setGithubValidation({ valid: false, error: response.data.error });
                setErrors(prev => ({ ...prev, githubUrl: response.data.error }));
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to validate GitHub URL';
            setGithubValidation({ valid: false, error: errorMsg });
            setErrors(prev => ({ ...prev, githubUrl: errorMsg }));
        } finally {
            setValidating(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        
        // Validate GitHub URL with debounce
        if (field === 'githubUrl') {
            const timeoutId = setTimeout(() => {
                validateGitHubUrl(value);
            }, 1000);
            
            return () => clearTimeout(timeoutId);
        }
    };

    const toggleTechStack = (techName) => {
        const isSelected = selectedTechStack.includes(techName);
        let newTechStack;
        
        if (isSelected) {
            newTechStack = selectedTechStack.filter(tech => tech !== techName);
        } else {
            newTechStack = [...selectedTechStack, techName];
        }
        
        setSelectedTechStack(newTechStack);
        setFormData(prev => ({ ...prev, techStack: newTechStack.join(', ') }));
    };

    const addCustomTech = () => {
        const customTech = prompt('Enter custom technology:');
        if (customTech && customTech.trim() && !selectedTechStack.includes(customTech.trim())) {
            const newTechStack = [...selectedTechStack, customTech.trim()];
            setSelectedTechStack(newTechStack);
            setFormData(prev => ({ ...prev, techStack: newTechStack.join(', ') }));
        }
    };

    const removeTech = (techName) => {
        const newTechStack = selectedTechStack.filter(tech => tech !== techName);
        setSelectedTechStack(newTechStack);
        setFormData(prev => ({ ...prev, techStack: newTechStack.join(', ') }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.githubUrl.trim()) {
            newErrors.githubUrl = 'GitHub URL is required';
        }
        
        if (!githubValidation?.valid) {
            newErrors.githubUrl = 'Please provide a valid GitHub repository URL';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Project description is required';
        }
        
        if (formData.description.trim().length < 50) {
            newErrors.description = 'Description should be at least 50 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }
        
        try {
            setSubmitting(true);
            
            const submitData = {
                taskId: parseInt(taskId),
                githubUrl: formData.githubUrl.trim(),
                liveUrl: formData.liveUrl.trim(),
                description: formData.description.trim(),
                techStack: formData.techStack,
                implementationNotes: formData.implementationNotes.trim()
            };
            
            await api.post('/projects/submit', submitData);
            
            toast.success(submission ? 'Project updated successfully!' : 'Project submitted successfully!');
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.error || 'Failed to submit project');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!task) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Task Not Found</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {submission ? 'Update Project Submission' : 'Submit Your Project'}
                </h1>
                <p className="text-gray-600">Share your project implementation with GitHub repository and live demo</p>
            </div>

            {/* Task Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-3">{task.title}</h2>
                <p className="text-blue-800 mb-4">{task.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-blue-700">
                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-blue-700">
                        <FontAwesomeIcon icon={faStar} className="mr-2" />
                        Points: {task.points}
                    </div>
                    <div className="flex items-center text-blue-700">
                        <FontAwesomeIcon icon={faCode} className="mr-2" />
                        Type: {task.type}
                    </div>
                </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* GitHub Repository Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <FontAwesomeIcon icon={faGithub} className="mr-3 text-gray-800" />
                        GitHub Repository
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Repository URL *
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                                    placeholder="https://github.com/username/repository-name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.githubUrl ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                <div className="absolute right-3 top-3">
                                    {validating ? (
                                        <FontAwesomeIcon icon={faSpinner} className="text-blue-500 animate-spin" />
                                    ) : githubValidation?.valid ? (
                                        <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                    ) : githubValidation?.valid === false ? (
                                        <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                                    ) : null}
                                </div>
                            </div>
                            {errors.githubUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>
                            )}
                        </div>

                        {/* GitHub Repository Info */}
                        {githubValidation?.valid && githubValidation.data && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-green-900 mb-2">
                                            {githubValidation.data.full_name}
                                        </h4>
                                        {githubValidation.data.description && (
                                            <p className="text-green-800 text-sm mb-3">
                                                {githubValidation.data.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-green-700">
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faCode} className="mr-1" />
                                                {githubValidation.data.language || 'Multiple'}
                                            </span>
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faStar} className="mr-1" />
                                                {githubValidation.data.stars} stars
                                            </span>
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faCodeBranch} className="mr-1" />
                                                {githubValidation.data.forks} forks
                                            </span>
                                            <span className="flex items-center">
                                                <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                                                Updated {new Date(githubValidation.data.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <a
                                        href={githubValidation.data.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Demo Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-3 text-gray-800" />
                        Live Demo (Optional)
                    </h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Live URL
                        </label>
                        <input
                            type="url"
                            value={formData.liveUrl}
                            onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                            placeholder="https://your-project-demo.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Provide a link where your project can be viewed live (Vercel, Netlify, Heroku, etc.)
                        </p>
                    </div>
                </div>

                {/* Technology Stack Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <FontAwesomeIcon icon={faCode} className="mr-3 text-gray-800" />
                        Technology Stack
                    </h3>
                    
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">Select the technologies you used in this project:</p>
                        
                        {/* Selected Technologies */}
                        {selectedTechStack.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Selected Technologies:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTechStack.map((tech) => (
                                        <span 
                                            key={tech}
                                            className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTech(tech)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Technology Options */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {commonTechStack.map((tech) => (
                                <button
                                    key={tech.name}
                                    type="button"
                                    onClick={() => toggleTechStack(tech.name)}
                                    className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                                        selectedTechStack.includes(tech.name)
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                    }`}
                                >
                                    <FontAwesomeIcon 
                                        icon={tech.icon} 
                                        className="mr-2" 
                                        style={{ color: selectedTechStack.includes(tech.name) ? tech.color : undefined }}
                                    />
                                    <span className="text-sm">{tech.name}</span>
                                </button>
                            ))}
                            
                            {/* Add Custom Technology */}
                            <button
                                type="button"
                                onClick={addCustomTech}
                                className="flex items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                <span className="text-sm">Custom</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Description Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Project Description</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe your project implementation, features, and how it addresses the task requirements..."
                            rows="6"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.description ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.description ? (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Minimum 50 characters required
                                </p>
                            )}
                            <p className="text-sm text-gray-400">
                                {formData.description.length}/500
                            </p>
                        </div>
                    </div>
                </div>

                {/* Implementation Notes Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Implementation Notes (Optional)</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.implementationNotes}
                            onChange={(e) => handleInputChange('implementationNotes', e.target.value)}
                            placeholder="Any additional notes about your implementation, challenges faced, or future improvements..."
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Share any challenges you faced, design decisions, or planned improvements
                        </p>
                    </div>
                </div>

                {/* Submit Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Ready to Submit?</h3>
                            <p className="text-gray-600">
                                {submission ? 'Update your project submission' : 'Submit your project for review'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !githubValidation?.valid}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors flex items-center"
                            >
                                {submitting ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                                        {submission ? 'Updating...' : 'Submitting...'}
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                        {submission ? 'Update Project' : 'Submit Project'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProjectSubmissionEnhanced;