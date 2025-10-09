'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/Upload/ImageUpload';

interface HomepageSlider {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomepageSliderAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sliders, setSliders] = useState<HomepageSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<HomepageSlider | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    isActive: true,
  });
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchSliders();
  }, [session, status, router]);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/homepage-slider');
      if (response.ok) {
        const data = await response.json();
        setSliders(data);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      alert('Please upload an image');
      return;
    }

    try {
      const payload = {
        ...formData,
        imageUrl: imageUrl,
      };

      let response;
      if (editingSlider) {
        // Update existing slider
        response = await fetch(`/api/homepage-slider/${editingSlider._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new slider
        response = await fetch('/api/homepage-slider', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        await fetchSliders();
        resetForm();
        alert(editingSlider ? 'Slider updated successfully!' : 'Slider created successfully!');
      } else {
        alert('Failed to save slider');
      }
    } catch (error) {
      console.error('Error saving slider:', error);
      alert('Error saving slider');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;

    try {
      const response = await fetch(`/api/homepage-slider/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSliders();
        alert('Slider deleted successfully!');
      } else {
        alert('Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      alert('Error deleting slider');
    }
  };

  const handleEdit = (slider: HomepageSlider) => {
    setEditingSlider(slider);
    setFormData({
      isActive: slider.isActive,
    });
    setImageUrl(slider.imageUrl);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      isActive: true,
    });
    setImageUrl('');
    setEditingSlider(null);
    setShowAddForm(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/homepage-slider/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        await fetchSliders();
      }
    } catch (error) {
      console.error('Error toggling slider status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-black">Homepage Slider Management</h1>
                <p className="text-gray-600">Manage images for homepage slider</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Slider
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sliders List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-black">Homepage Sliders ({sliders.length})</h2>
          </div>
          
          {sliders.length === 0 ? (
            <div className="p-8 text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sliders found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first homepage slider image.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Slider
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {sliders.map((slider) => (
                <div key={slider._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Image */}
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={slider.imageUrl}
                      alt={slider.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleActive(slider._id, slider.isActive)}
                        className={`p-1 rounded-full ${
                          slider.isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {slider.isActive ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Order: {slider.order}</span>
                      <span>{new Date(slider.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(slider)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slider._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-black">
                  {editingSlider ? 'Edit Slider' : 'Add New Slider'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <ImageUpload
                    onImageUpload={setImageUrl}
                    currentImage={imageUrl}
                    className="w-full"
                  />
                </div>



                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (show on homepage)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {editingSlider ? 'Update Slider' : 'Create Slider'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
