import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faDownload, 
    faShare, 
    faEye, 
    faCertificate,
    faCalendar,
    faAward,
    faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { 
    faLinkedin, 
    faTwitter, 
    faFacebook 
} from '@fortawesome/free-brands-svg-icons';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const MyCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shareLoading, setShareLoading] = useState({});
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const res = await api.get('/certificates/my-certificates');
            setCertificates(res.data.certificates || []);
        } catch (err) {
            setError('Failed to fetch certificates.');
            toast.error('Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCertificate = async (certificate) => {
        try {
            const response = await api.get(`/certificates/download/${certificate.verification_code}`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate_${certificate.verification_code}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download certificate');
        }
    };

    const generateShareContent = async (certificate, platform) => {
        try {
            const response = await api.post('/social-sharing/generate-content', {
                certificateId: certificate.id,
                platform: platform
            });
            return response.data.content;
        } catch (error) {
            console.error('Failed to generate share content:', error);
            return null;
        }
    };

    const handleSocialShare = async (certificate, platform) => {
        setShareLoading(prev => ({ ...prev, [`${certificate.id}_${platform}`]: true }));
        
        try {
            const shareContent = await generateShareContent(certificate, platform);
            if (!shareContent) {
                toast.error('Failed to generate share content');
                return;
            }

            let shareUrl;
            const verifyUrl = `${window.location.origin}/verify/${certificate.verification_code}`;

            switch (platform) {
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}&title=${encodeURIComponent(shareContent.title)}&summary=${encodeURIComponent(shareContent.message)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.message)}&url=${encodeURIComponent(verifyUrl)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verifyUrl)}&quote=${encodeURIComponent(shareContent.message)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent(shareContent.subject)}&body=${encodeURIComponent(shareContent.message)}`;
                    break;
                default:
                    throw new Error('Unsupported platform');
            }

            // Track the share
            await api.post('/social-sharing/share', {
                certificateId: certificate.id,
                platform: platform,
                message: shareContent.message,
                shareUrl: shareUrl,
                metadata: { platform, timestamp: new Date().toISOString() }
            });

            // Open share window
            if (platform === 'email') {
                window.location.href = shareUrl;
            } else {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }

            toast.success(`Shared to ${platform} successfully!`);
        } catch (error) {
            console.error('Share failed:', error);
            toast.error(`Failed to share to ${platform}`);
        } finally {
            setShareLoading(prev => ({ ...prev, [`${certificate.id}_${platform}`]: false }));
        }
    };

    const handleVerifyCertificate = async (certificate) => {
        try {
            const response = await api.get(`/certificates/verify/${certificate.verification_code}`);
            setSelectedCertificate({ ...certificate, verification: response.data.certificate });
            setShowVerificationModal(true);
        } catch (error) {
            toast.error('Failed to verify certificate');
        }
    };

    const ShareModal = ({ certificate, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Share Certificate</h3>
                <p className="text-gray-600 mb-6">
                    Share your {certificate.program_name} certificate with your network!
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleSocialShare(certificate, 'linkedin')}
                        disabled={shareLoading[`${certificate.id}_linkedin`]}
                        className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
                        {shareLoading[`${certificate.id}_linkedin`] ? 'Sharing...' : 'LinkedIn'}
                    </button>
                    
                    <button
                        onClick={() => handleSocialShare(certificate, 'twitter')}
                        disabled={shareLoading[`${certificate.id}_twitter`]}
                        className="flex items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faTwitter} className="mr-2" />
                        {shareLoading[`${certificate.id}_twitter`] ? 'Sharing...' : 'Twitter'}
                    </button>
                    
                    <button
                        onClick={() => handleSocialShare(certificate, 'facebook')}
                        disabled={shareLoading[`${certificate.id}_facebook`]}
                        className="flex items-center justify-center p-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                        {shareLoading[`${certificate.id}_facebook`] ? 'Sharing...' : 'Facebook'}
                    </button>
                    
                    <button
                        onClick={() => handleSocialShare(certificate, 'email')}
                        disabled={shareLoading[`${certificate.id}_email`]}
                        className="flex items-center justify-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                        {shareLoading[`${certificate.id}_email`] ? 'Preparing...' : 'Email'}
                    </button>
                </div>
                
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Verification URL:</p>
                    <p className="text-xs text-blue-600 break-all">
                        {`${window.location.origin}/verify/${certificate.verification_code}`}
                    </p>
                </div>
                
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={faCertificate} className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error Loading Certificates</h3>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                            <div className="mt-4">
                                <button
                                    onClick={fetchCertificates}
                                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
                <p className="text-gray-600">View, download, and share your achievement certificates</p>
            </div>

            {certificates.length === 0 ? (
                <div className="text-center py-12">
                    <FontAwesomeIcon icon={faCertificate} className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
                    <p className="text-gray-500 mb-6">Complete your internship programs to earn certificates</p>
                    <button
                        onClick={() => window.location.href = '/programs'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Browse Programs
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((certificate) => (
                        <div key={certificate.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            {/* Certificate Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <FontAwesomeIcon icon={faCertificate} className="h-8 w-8" />
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{certificate.final_score}%</div>
                                        <div className="text-sm opacity-90">Score</div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mt-4 mb-2">{certificate.program_name}</h3>
                                {certificate.specialization && (
                                    <p className="text-sm opacity-90">{certificate.specialization}</p>
                                )}
                            </div>

                            {/* Certificate Details */}
                            <div className="p-6">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 mr-2" />
                                        Completed: {new Date(certificate.completion_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faAward} className="h-4 w-4 mr-2" />
                                        Issued: {new Date(certificate.issued_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4 mr-2" />
                                        Code: {certificate.verification_code.slice(0, 8)}...
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDownloadCertificate(certificate)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => handleVerifyCertificate(certificate)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                                            Verify
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedCertificate(certificate);
                                            setShowShareModal(true);
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faShare} className="mr-2" />
                                        Share Certificate
                                    </button>
                                </div>

                                {/* Share Count */}
                                {certificate.share_count > 0 && (
                                    <div className="mt-4 text-center">
                                        <span className="text-xs text-gray-500">
                                            Shared {certificate.share_count} time{certificate.share_count !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {showShareModal && selectedCertificate && (
                <ShareModal
                    certificate={selectedCertificate}
                    onClose={() => {
                        setShowShareModal(false);
                        setSelectedCertificate(null);
                    }}
                />
            )}

            {showVerificationModal && selectedCertificate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Certificate Verification</h3>
                        {selectedCertificate.verification ? (
                            <div className="space-y-3">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-800 font-medium">✅ Certificate Verified</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Student:</strong> {selectedCertificate.verification.student_name}</p>
                                    <p><strong>Program:</strong> {selectedCertificate.verification.program_name}</p>
                                    <p><strong>Score:</strong> {selectedCertificate.verification.final_score}%</p>
                                    <p><strong>Completed:</strong> {new Date(selectedCertificate.verification.completion_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-800">❌ Verification Failed</p>
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowVerificationModal(false);
                                    setSelectedCertificate(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
