import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await api.get('/admin/submissions');
                setSubmissions(res.data.data);
            } catch (err) {
                setError('Failed to fetch submissions.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const handleApprove = async (submissionId) => {
        try {
            await api.post(`/admin/submissions/${submissionId}/approve`);
            setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, status: 'approved' } : s));
            alert('Submission approved and certificate generated!');
        } catch (err) {
            setError('Failed to approve submission.');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Project Submissions</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Project
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Submitted At
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission) => (
                            <tr key={submission.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{submission.first_name} {submission.last_name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <a href={submission.github_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                        {submission.project_title}
                                    </a>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{new Date(submission.submitted_at).toLocaleDateString()}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold text-${submission.status === 'approved' ? 'green' : 'yellow'}-900 leading-tight`}>
                                        <span aria-hidden className={`absolute inset-0 bg-${submission.status === 'approved' ? 'green' : 'yellow'}-200 opacity-50 rounded-full`}></span>
                                        <span className="relative">{submission.status}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {submission.status !== 'approved' && (
                                        <button
                                            onClick={() => handleApprove(submission.id)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Approve
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectSubmissions;
