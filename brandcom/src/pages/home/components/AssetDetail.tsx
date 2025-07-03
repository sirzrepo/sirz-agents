import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FaArrowLeft, FaDownload, FaCopy, FaCheck, FaTrash } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

interface Asset {
  _id: string;
  logo_image?: string;
  website_image?: string;
  color_palette?: string;
  createdAt: string;
}

interface CompanyData {
  companyName: string;
  industry: string;
  preferredStyle: string;
  targetAudience: string;
  brandValues: string[];
  additionalNotes: string;
}

interface BrandAssetsResponse {
  assets: Asset[];
  companyData: CompanyData;
}

export default function AssetDetail() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const response = await axios.get<BrandAssetsResponse>(
          `${BASE_URL}/api/brand-data/company-assets/${userData?.id}`
        );
        
        // Find the specific asset by ID
        const foundAsset = response.data.assets.find(a => a._id === assetId);
        
        if (foundAsset) {
          setAsset(foundAsset);
          setCompanyData(response.data.companyData);
        } else {
          navigate('/'); // Redirect if asset not found
        }
      } catch (error) {
        console.error('Error fetching asset data:', error);
        navigate('/');
      }
    };

    if (assetId && userData?.id) {
      fetchAssetData();
    }
  }, [assetId, userData?.id, navigate]);

  if (!asset || !companyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to parse markdown-like content
  const parseContent = (content?: string) => {
    if (!content) return null;
    
    // Simple markdown parsing for bold text
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-lg mt-4">{line.slice(2, -2)}</p>;
      }
      return <p key={i} className="text-gray-700 mb-2">{line}</p>;
    });
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Design guidelines copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDelete = async () => {
    if (!assetId || !userData?.id) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/brand-data/assets/${userData.id}/${assetId}`);
      // `${BASE_URL}/api/brand-data/company-assets/${userData?.id}`
      // /assets/:userId/:assetId",
      toast.success('Asset deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Assets
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center text-red-600 hover:text-red-800"
          title="Delete Asset"
        >
          <FaTrash className="mr-1" /> Delete Asset
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Delete Asset</h2>
            <p className="mb-6">Are you sure you want to delete this asset? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6">Asset Details</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {asset.logo_image && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Logo</h3>
                    <button
                      onClick={() => downloadImage(asset.logo_image!, `logo-${companyData?.companyName || 'brand'}.png`)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      title="Download Logo"
                    >
                      <FaDownload className="mr-1" /> Download
                    </button>
                  </div>
                  <img 
                    src={asset.logo_image} 
                    alt="Logo" 
                    className="w-full h-auto object-contain bg-gray-100 p-4 rounded"
                  />
                </div>
              )}
              
              {asset.website_image && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Website Preview</h3>
                    <button
                      onClick={() => downloadImage(asset.website_image!, `website-preview-${companyData?.companyName || 'brand'}.png`)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      title="Download Website Preview"
                    >
                      <FaDownload className="mr-1" /> Download
                    </button>
                  </div>
                  <img 
                    src={asset.website_image} 
                    alt="Website Preview" 
                    className="w-full h-auto object-contain bg-gray-100 p-4 rounded"
                  />
                </div>
              )}
            </div>

            {asset.color_palette && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Design Guidelines</h3>
                  <button
                    onClick={() => copyToClipboard(asset.color_palette!)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    title="Copy Design Guidelines"
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <FaCheck className="mr-1 text-green-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <FaCopy className="mr-1" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="prose max-w-none relative">
                  {parseContent(asset.color_palette)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Company Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                <p className="text-gray-900">{companyData.companyName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                <p className="text-gray-900">{companyData.industry}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Preferred Style</h3>
                <p className="text-gray-900">{companyData.preferredStyle}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Target Audience</h3>
                <p className="text-gray-900">{companyData.targetAudience}</p>
              </div>
              
              {companyData.brandValues && companyData.brandValues.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Brand Values</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {companyData.brandValues.map((value, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {companyData.additionalNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
                  <p className="text-gray-900">{companyData.additionalNotes}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Created on {new Date(asset.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
