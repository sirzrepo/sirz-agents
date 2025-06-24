import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FaArrowLeft } from 'react-icons/fa';

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

  return (
    <div className="container mx-auto px-4 pb-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Assets
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-6">Asset Details</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {asset.logo_image && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Logo</h3>
                  <img 
                    src={asset.logo_image} 
                    alt="Logo" 
                    className="w-full h-auto max-h-64 object-contain bg-gray-100 p-4 rounded"
                  />
                </div>
              )}
              
              {asset.website_image && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Website Preview</h3>
                  <img 
                    src={asset.website_image} 
                    alt="Website Preview" 
                    className="w-full h-auto max-h-64 object-contain bg-gray-100 p-4 rounded"
                  />
                </div>
              )}
            </div>

            {asset.color_palette && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Design Guidelines</h3>
                <div className="prose max-w-none">
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
