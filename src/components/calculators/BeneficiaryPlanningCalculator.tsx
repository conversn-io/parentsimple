'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Users, Building, ChartLine, PiggyBank, Shield, Car, Folder, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Calendar, FileText } from 'lucide-react';

interface BeneficiaryPlanningCalculatorProps {
  className?: string;
}

interface BeneficiaryData {
  id: number;
  accountName: string;
  accountType: string;
  institution: string;
  accountNumber: string;
  primaryBeneficiary: string;
  primaryPercent: number;
  secondaryBeneficiary: string;
  secondaryPercent: number;
  lastUpdated: string;
  notes: string;
}

const BeneficiaryPlanningCalculator: React.FC<BeneficiaryPlanningCalculatorProps> = ({ className = '' }) => {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryData[]>([]);
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: '',
    institution: '',
    accountNumber: '',
    primaryBeneficiary: '',
    primaryPercent: 100,
    secondaryBeneficiary: '',
    secondaryPercent: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load beneficiaries from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('beneficiaries');
    if (saved) {
      setBeneficiaries(JSON.parse(saved));
    }
  }, []);

  // Save beneficiaries to localStorage whenever beneficiaries change
  useEffect(() => {
    localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.accountName || !formData.accountType || !formData.primaryBeneficiary) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      // Update existing beneficiary
      setBeneficiaries(prev => prev.map(b => 
        b.id === editingId ? { ...formData, id: editingId } : b
      ));
      setEditingId(null);
    } else {
      // Add new beneficiary
      const newBeneficiary: BeneficiaryData = {
        ...formData,
        id: Date.now()
      };
      setBeneficiaries(prev => [...prev, newBeneficiary]);
    }

    clearForm();
    setShowForm(false);
  };

  const clearForm = () => {
    setFormData({
      accountName: '',
      accountType: '',
      institution: '',
      accountNumber: '',
      primaryBeneficiary: '',
      primaryPercent: 100,
      secondaryBeneficiary: '',
      secondaryPercent: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const editBeneficiary = (beneficiary: BeneficiaryData) => {
    setFormData(beneficiary);
    setEditingId(beneficiary.id);
    setShowForm(true);
  };

  const deleteBeneficiary = (id: number) => {
    if (confirm('Are you sure you want to delete this beneficiary designation?')) {
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return <Building className="h-5 w-5 text-blue-600" />;
      case 'investment': return <ChartLine className="h-5 w-5 text-green-600" />;
      case 'retirement': return <PiggyBank className="h-5 w-5 text-purple-600" />;
      case 'life-insurance': return <Shield className="h-5 w-5 text-red-600" />;
      case 'other-insurance': return <Car className="h-5 w-5 text-orange-600" />;
      default: return <Folder className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'bank': return 'Bank Account';
      case 'investment': return 'Investment Account';
      case 'retirement': return 'Retirement Account';
      case 'life-insurance': return 'Life Insurance';
      case 'other-insurance': return 'Other Insurance';
      default: return 'Other Account';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'bank': return 'bg-blue-50 border-blue-200';
      case 'investment': return 'bg-green-50 border-green-200';
      case 'retirement': return 'bg-purple-50 border-purple-200';
      case 'life-insurance': return 'bg-red-50 border-red-200';
      case 'other-insurance': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const groupedBeneficiaries = beneficiaries.reduce((acc, beneficiary) => {
    if (!acc[beneficiary.accountType]) {
      acc[beneficiary.accountType] = [];
    }
    acc[beneficiary.accountType].push(beneficiary);
    return acc;
  }, {} as Record<string, BeneficiaryData[]>);

  const totalAccounts = beneficiaries.length;
  const completeDesignations = beneficiaries.filter(b => b.primaryBeneficiary && b.primaryPercent > 0).length;
  const needsReview = beneficiaries.filter(b => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(b.lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate > 365;
  }).length;

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Users className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Beneficiary Planning Tool</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Organize and track all your beneficiary designations across accounts, insurance policies, and retirement plans. 
          Ensure your loved ones are properly protected and your wishes are clearly documented.
        </p>
      </div>

      {/* Add Beneficiary Button */}
      <div className="mb-8 text-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Beneficiary Designation
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Beneficiary Designation' : 'Add Beneficiary Designation'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account/Policy Name *</label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => handleInputChange('accountName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Chase Savings Account"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
              <select
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="bank">Bank Account</option>
                <option value="investment">Investment Account</option>
                <option value="retirement">Retirement Account</option>
                <option value="life-insurance">Life Insurance</option>
                <option value="other-insurance">Other Insurance</option>
                <option value="other">Other Account</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Chase Bank"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last 4 digits only"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Beneficiary *</label>
              <input
                type="text"
                value={formData.primaryBeneficiary}
                onChange={(e) => handleInputChange('primaryBeneficiary', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary %</label>
              <input
                type="number"
                value={formData.primaryPercent}
                onChange={(e) => handleInputChange('primaryPercent', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Beneficiary</label>
              <input
                type="text"
                value={formData.secondaryBeneficiary}
                onChange={(e) => handleInputChange('secondaryBeneficiary', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary %</label>
              <input
                type="number"
                value={formData.secondaryPercent}
                onChange={(e) => handleInputChange('secondaryPercent', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <input
                type="date"
                value={formData.lastUpdated}
                onChange={(e) => handleInputChange('lastUpdated', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional notes or special instructions"
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3 flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Beneficiary
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  clearForm();
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{totalAccounts}</div>
          <div className="text-gray-600 mt-2">Total Accounts</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{completeDesignations}</div>
          <div className="text-gray-600 mt-2">Complete Designations</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{needsReview}</div>
          <div className="text-gray-600 mt-2">Needs Review</div>
        </div>
      </div>

      {/* Beneficiary Categories */}
      {Object.keys(groupedBeneficiaries).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedBeneficiaries).map(([type, typeBeneficiaries]) => (
            <div key={type} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                {getAccountTypeIcon(type)}
                <span className="ml-2">{getAccountTypeLabel(type)}</span>
              </h3>
              <div className="space-y-4">
                {typeBeneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className={`p-4 rounded-lg border ${getAccountTypeColor(type)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{beneficiary.accountName}</h4>
                        {beneficiary.institution && (
                          <p className="text-sm text-gray-600">{beneficiary.institution}</p>
                        )}
                        {beneficiary.accountNumber && (
                          <p className="text-sm text-gray-500">Account: ****{beneficiary.accountNumber}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editBeneficiary(beneficiary)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteBeneficiary(beneficiary.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Primary Beneficiary</p>
                        <p className="text-gray-800">{beneficiary.primaryBeneficiary} ({beneficiary.primaryPercent}%)</p>
                      </div>
                      {beneficiary.secondaryBeneficiary && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Secondary Beneficiary</p>
                          <p className="text-gray-800">{beneficiary.secondaryBeneficiary} ({beneficiary.secondaryPercent}%)</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Last updated: {new Date(beneficiary.lastUpdated).toLocaleDateString()}
                      </div>
                      {beneficiary.notes && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="h-4 w-4 mr-1" />
                          Has notes
                        </div>
                      )}
                    </div>
                    
                    {beneficiary.notes && (
                      <div className="mt-3 p-3 bg-gray-100 rounded">
                        <p className="text-sm text-gray-700">{beneficiary.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Beneficiary Designations Yet</h3>
          <p className="text-gray-500">Add your first beneficiary designation to get started with your planning.</p>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Important Reminders
        </h3>
        <ul className="text-yellow-700 space-y-2">
          <li>• Review and update beneficiary designations annually or after major life events</li>
          <li>• Ensure beneficiary names match exactly with legal documents</li>
          <li>• Consider naming contingent beneficiaries for all accounts</li>
          <li>• Keep beneficiary information current with address and contact details</li>
          <li>• Coordinate beneficiary designations with your will and trust documents</li>
          <li>• Consider tax implications when designating beneficiaries</li>
        </ul>
      </div>

      {/* Action Steps */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Next Steps
        </h3>
        <div className="text-blue-700 space-y-2">
          <div>1. <strong>Gather Documents:</strong> Collect all account statements, insurance policies, and retirement plan documents</div>
          <div>2. <strong>Contact Institutions:</strong> Verify current beneficiary information with each financial institution</div>
          <div>3. <strong>Update Forms:</strong> Complete new beneficiary designation forms where needed</div>
          <div>4. <strong>Review Regularly:</strong> Set annual reminders to review and update beneficiary information</div>
          <div>5. <strong>Coordinate with Estate Plan:</strong> Ensure beneficiary designations align with your overall estate plan</div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPlanningCalculator;


