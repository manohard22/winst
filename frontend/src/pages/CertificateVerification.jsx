import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCertificate, 
    faCheck, 
    faTimes, 
    faDownload,
    faCalendar,
    faAward,
    faUser,
    faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const CertificateVerification = () => {
    const { verificationCode } = useParams();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (verificationCode) {
            verifyCertificate();
        }
    }, [verificationCode]);

    const verifyCertificate = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/certificates/verify/${verificationCode}`);
            
            if (response.data.success) {
                setCertificate(response.data.certificate);
                setIsValid(true);
            } else {
                setError('Certificate not found or invalid');
                setIsValid(false);
            }
        } catch (err) {
            setError('Certificate verification failed');
            setIsValid(false);
            console.error('Verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await api.get(`/certificates/download/${verificationCode}`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate_${verificationCode}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            toast.error('Failed to download certificate');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Verifying certificate...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verification</h1>
                        <p className="text-gray-600">Verify the authenticity of WINST Internship certificates</p>
                    </div>

                    {/* Verification Result */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {isValid && certificate ? (
                            <>
                                {/* Success Header */}
                                <div className="bg-green-600 text-white p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                                            <FontAwesomeIcon icon={faCheck} className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-center">Certificate Verified ✅</h2>
                                    <p className="text-center text-green-100 mt-2">
                                        This certificate is authentic and valid
                                    </p>
                                </div>

                                {/* Certificate Details */}
                                <div className="p-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            <div className="text-center md:text-left">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    Certificate of Completion
                                                </h3>
                                                <div className="w-20 h-1 bg-blue-600 mx-auto md:mx-0"></div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Student Name</p>
                                                        <p className="font-semibold text-gray-900">{certificate.student_name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Program</p>
                                                        <p className="font-semibold text-gray-900">{certificate.program_name}</p>
                                                    </div>
                                                </div>

                                                {certificate.specialization && (
                                                    <div className="flex items-start">
                                                        <FontAwesomeIcon icon={faAward} className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Specialization</p>
                                                            <p className="font-semibold text-gray-900">{certificate.specialization}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-start">
                                                    <FontAwesomeIcon icon={faCalendar} className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Completion Date</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(certificate.completion_date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FontAwesomeIcon icon={faCertificate} className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Issue Date</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(certificate.issued_date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            {/* Score Display */}
                                            <div className="bg-blue-50 rounded-lg p-6 text-center">
                                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                                    {certificate.final_score}%
                                                </div>
                                                <p className="text-blue-800 font-medium">Final Score</p>
                                                <div className="mt-4">
                                                    <div className="bg-blue-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                                            style={{ width: `${certificate.final_score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Verification Details */}
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <h4 className="font-semibold text-gray-900 mb-3">Verification Details</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Certificate ID:</span>
                                                        <span className="font-mono text-gray-900">{certificate.id}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Verification Code:</span>
                                                        <span className="font-mono text-gray-900">{certificate.verification_code}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Status:</span>
                                                        <span className="text-green-600 font-medium">Valid</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Issuer:</span>
                                                        <span className="font-medium">WINST</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="space-y-3">
                                                <button
                                                    onClick={handleDownload}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
                                                >
                                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                                    Download Certificate
                                                </button>
                                                <button
                                                    onClick={() => navigate('/programs')}
                                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                                                >
                                                    Browse Programs
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Error Header */}
                                <div className="bg-red-600 text-white p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="bg-white bg-opacity-20 rounded-full p-3">
                                            <FontAwesomeIcon icon={faTimes} className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-center">Certificate Not Found ❌</h2>
                                    <p className="text-center text-red-100 mt-2">
                                        The certificate could not be verified
                                    </p>
                                </div>

                                {/* Error Details */}
                                <div className="p-8 text-center">
                                    <div className="max-w-md mx-auto">
                                        <p className="text-gray-600 mb-6">
                                            {error || 'The verification code you provided is invalid or the certificate does not exist in our system.'}
                                        </p>
                                        
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <p className="text-sm text-gray-600 mb-2">Verification Code:</p>
                                            <p className="font-mono text-gray-900 break-all">{verificationCode}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => navigate('/')}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                            >
                                                Go to Homepage
                                            </button>
                                            <button
                                                onClick={() => navigate('/contact')}
                                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                                            >
                                                Contact Support
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* About Section */}
                    <div className="mt-8 text-center">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">About WINST Certificates</h3>
                            <p className="text-gray-600 text-sm">
                                WINST certificates are issued to students who successfully complete our internship programs. 
                                Each certificate contains a unique verification code and can be verified at any time through this portal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateVerification;