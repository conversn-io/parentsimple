'use client';

import React, { useState } from 'react';
import { Calculator, FileText, Shield, Users, DollarSign, AlertTriangle, CheckCircle, Home, Building, Car, Heart, Gavel, Calendar, Target } from 'lucide-react';

interface EstatePlanningCalculatorProps {
  className?: string;
}

interface EstateAsset {
  id: string;
  name: string;
  value: number;
  category: string;
  hasBeneficiary: boolean;
  beneficiaryName: string;
}

interface EstatePlan {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  estateTaxOwed: number;
  probateCosts: number;
  recommendations: string[];
  missingDocuments: string[];
  priorityActions: string[];
}

const EstatePlanningCalculator: React.FC<EstatePlanningCalculatorProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    age: 65,
    maritalStatus: 'married',
    state: 'california',
    hasWill: false,
    hasTrust: false,
    hasPOA: false,
    hasHealthcareDirective: false,
    hasLifeInsurance: false,
    lifeInsuranceAmount: 0,
    hasBusiness: false,
    businessValue: 0,
    hasMinorChildren: false,
    numberOfChildren: 0
  });

  const [assets, setAssets] = useState<EstateAsset[]>([
    { id: 'primary-home', name: 'Primary Residence', value: 500000, category: 'real-estate', hasBeneficiary: false, beneficiaryName: '' },
    { id: 'investment-accounts', name: 'Investment Accounts', value: 300000, category: 'investments', hasBeneficiary: true, beneficiaryName: 'Spouse' },
    { id: 'retirement-accounts', name: 'Retirement Accounts', value: 400000, category: 'retirement', hasBeneficiary: true, beneficiaryName: 'Spouse' },
    { id: 'bank-accounts', name: 'Bank Accounts', value: 100000, category: 'cash', hasBeneficiary: false, beneficiaryName: '' },
    { id: 'vehicles', name: 'Vehicles', value: 50000, category: 'personal', hasBeneficiary: false, beneficiaryName: '' },
    { id: 'personal-property', name: 'Personal Property', value: 75000, category: 'personal', hasBeneficiary: false, beneficiaryName: '' }
  ]);

  const [liabilities, setLiabilities] = useState([
    { name: 'Mortgage', amount: 200000 },
    { name: 'Credit Card Debt', amount: 10000 },
    { name: 'Other Debts', amount: 5000 }
  ]);

  const [results, setResults] = useState<EstatePlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssetChange = (id: string, field: string, value: string | number | boolean) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  const handleLiabilityChange = (index: number, field: string, value: string | number) => {
    setLiabilities(prev => prev.map((liability, i) => 
      i === index ? { ...liability, [field]: value } : liability
    ));
  };

  const addAsset = () => {
    const newAsset: EstateAsset = {
      id: `asset-${Date.now()}`,
      name: '',
      value: 0,
      category: 'other',
      hasBeneficiary: false,
      beneficiaryName: ''
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const addLiability = () => {
    setLiabilities(prev => [...prev, { name: '', amount: 0 }]);
  };

  const removeLiability = (index: number) => {
    setLiabilities(prev => prev.filter((_, i) => i !== index));
  };

  const calculateEstatePlan = () => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0) + formData.lifeInsuranceAmount + formData.businessValue;
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const netWorth = totalAssets - totalLiabilities;

    // Estate tax calculation (2024 rates)
    const federalExemption = 13610000; // 2024 federal estate tax exemption
    const estateTaxOwed = Math.max(0, (netWorth - federalExemption) * 0.40);

    // Probate costs (typically 2-5% of gross estate)
    const probateCosts = totalAssets * 0.03;

    const recommendations = [];
    const missingDocuments = [];
    const priorityActions = [];

    // Document recommendations
    if (!formData.hasWill) {
      missingDocuments.push('Last Will and Testament');
      recommendations.push('Create a will to specify how your assets should be distributed');
      priorityActions.push('Draft and execute a will');
    }

    if (!formData.hasTrust && netWorth > 200000) {
      missingDocuments.push('Revocable Living Trust');
      recommendations.push('Consider a revocable living trust to avoid probate');
      priorityActions.push('Consult with an estate planning attorney about trusts');
    }

    if (!formData.hasPOA) {
      missingDocuments.push('Financial Power of Attorney');
      recommendations.push('Establish financial power of attorney for incapacity planning');
      priorityActions.push('Create financial power of attorney documents');
    }

    if (!formData.hasHealthcareDirective) {
      missingDocuments.push('Healthcare Directive');
      recommendations.push('Create healthcare directive and living will');
      priorityActions.push('Draft healthcare directive and living will');
    }

    // Asset recommendations
    const assetsWithoutBeneficiaries = assets.filter(asset => !asset.hasBeneficiary);
    if (assetsWithoutBeneficiaries.length > 0) {
      recommendations.push('Review beneficiary designations on all accounts and policies');
      priorityActions.push('Update beneficiary designations');
    }

    // Tax planning recommendations
    if (netWorth > 1000000) {
      recommendations.push('Consider advanced estate planning strategies to minimize taxes');
      priorityActions.push('Consult with estate planning attorney for tax minimization');
    }

    if (formData.hasMinorChildren) {
      recommendations.push('Ensure guardianship provisions are included in your will');
      priorityActions.push('Designate guardians for minor children');
    }

    if (formData.hasBusiness) {
      recommendations.push('Create a business succession plan');
      priorityActions.push('Develop business succession strategy');
    }

    // Life insurance recommendations
    if (!formData.hasLifeInsurance && totalLiabilities > 50000) {
      recommendations.push('Consider life insurance to cover debts and provide for family');
      priorityActions.push('Evaluate life insurance needs');
    }

    setResults({
      totalAssets,
      totalLiabilities,
      netWorth,
      estateTaxOwed,
      probateCosts,
      recommendations,
      missingDocuments,
      priorityActions
    });
    setShowResults(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'real-estate': return <Home className="h-5 w-5" />;
      case 'investments': return <DollarSign className="h-5 w-5" />;
      case 'retirement': return <Shield className="h-5 w-5" />;
      case 'cash': return <Building className="h-5 w-5" />;
      case 'personal': return <Car className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'real-estate': return 'text-blue-600';
      case 'investments': return 'text-green-600';
      case 'retirement': return 'text-purple-600';
      case 'cash': return 'text-yellow-600';
      case 'personal': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Gavel className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Estate Planning Calculator</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Assess your estate planning needs and get personalized recommendations for protecting your legacy and minimizing taxes
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-3" />
          Personal Information
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="18"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
            <select
              value={formData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State of Residence</label>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="california">California</option>
              <option value="florida">Florida</option>
              <option value="texas">Texas</option>
              <option value="new-york">New York</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
            <input
              type="number"
              value={formData.numberOfChildren}
              onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Life Insurance Amount</label>
            <input
              type="number"
              value={formData.lifeInsuranceAmount}
              onChange={(e) => handleInputChange('lifeInsuranceAmount', parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Value</label>
            <input
              type="number"
              value={formData.businessValue}
              onChange={(e) => handleInputChange('businessValue', parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1000"
            />
          </div>
        </div>
      </div>

      {/* Estate Planning Documents */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-3" />
          Estate Planning Documents
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasWill}
                onChange={(e) => handleInputChange('hasWill', e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Last Will and Testament</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasTrust}
                onChange={(e) => handleInputChange('hasTrust', e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Revocable Living Trust</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasPOA}
                onChange={(e) => handleInputChange('hasPOA', e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Financial Power of Attorney</span>
            </label>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasHealthcareDirective}
                onChange={(e) => handleInputChange('hasHealthcareDirective', e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Healthcare Directive</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasLifeInsurance}
                onChange={(e) => handleInputChange('hasLifeInsurance', e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Life Insurance</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasBusiness}
                onChange={(e) => handleInputChange('hasBusiness', e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Own a Business</span>
            </label>
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <DollarSign className="h-6 w-6 text-green-600 mr-3" />
            Assets
          </h2>
          <button
            onClick={addAsset}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Asset
          </button>
        </div>
        
        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                  <input
                    type="text"
                    value={asset.name}
                    onChange={(e) => handleAssetChange(asset.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Primary Residence"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={asset.value}
                    onChange={(e) => handleAssetChange(asset.id, 'value', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={asset.category}
                    onChange={(e) => handleAssetChange(asset.id, 'category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="real-estate">Real Estate</option>
                    <option value="investments">Investments</option>
                    <option value="retirement">Retirement</option>
                    <option value="cash">Cash</option>
                    <option value="personal">Personal Property</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex items-end space-x-2">
                  <button
                    onClick={() => removeAsset(asset.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="mt-3 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={asset.hasBeneficiary}
                      onChange={(e) => handleAssetChange(asset.id, 'hasBeneficiary', e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Has Beneficiary Designation</span>
                  </label>
                </div>
                
                {asset.hasBeneficiary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name</label>
                    <input
                      type="text"
                      value={asset.beneficiaryName}
                      onChange={(e) => handleAssetChange(asset.id, 'beneficiaryName', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Beneficiary name"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liabilities */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            Liabilities
          </h2>
          <button
            onClick={addLiability}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Add Liability
          </button>
        </div>
        
        <div className="space-y-4">
          {liabilities.map((liability, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liability Name</label>
                  <input
                    type="text"
                    value={liability.name}
                    onChange={(e) => handleLiabilityChange(index, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mortgage"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={liability.amount}
                    onChange={(e) => handleLiabilityChange(index, 'amount', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => removeLiability(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mb-8">
        <button
          onClick={calculateEstatePlan}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        >
          <Calculator className="h-5 w-5 mr-2" />
          Calculate Estate Plan
        </button>
      </div>

      {/* Results */}
      {showResults && results && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Target className="h-6 w-6 text-green-600 mr-3" />
            Estate Planning Analysis
          </h2>
          
          {/* Summary */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">
                ${results.totalAssets.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Assets</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">
                ${results.totalLiabilities.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Liabilities</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                ${results.netWorth.toLocaleString()}
              </div>
              <div className="text-gray-600">Net Worth</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <Gavel className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">
                ${results.estateTaxOwed.toLocaleString()}
              </div>
              <div className="text-gray-600">Estate Tax</div>
            </div>
          </div>

          {/* Missing Documents */}
          {results.missingDocuments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Missing Documents
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {results.missingDocuments.map((doc, index) => (
                    <li key={index} className="flex items-center text-red-800">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Recommendations
            </h3>
            <div className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-green-800 mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Priority Actions
            </h3>
            <div className="space-y-2">
              {results.priorityActions.map((action, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-blue-800 mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Steps */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Next Steps
        </h3>
        <div className="text-blue-700 space-y-2">
          <div>1. <strong>Consult an Attorney:</strong> Work with an estate planning attorney to create or update your documents</div>
          <div>2. <strong>Review Beneficiaries:</strong> Ensure all accounts and policies have current beneficiary designations</div>
          <div>3. <strong>Organize Documents:</strong> Keep all estate planning documents in a safe, accessible location</div>
          <div>4. <strong>Communicate Plans:</strong> Discuss your estate plan with family members and key beneficiaries</div>
          <div>5. <strong>Regular Reviews:</strong> Review and update your estate plan every 3-5 years or after major life events</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-8">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimers</h3>
            <p className="text-sm text-yellow-700">
              This calculator provides general information and estimates only. Estate planning laws vary by state and change frequently. 
              Tax calculations are estimates based on current federal rates. Always consult with qualified legal and tax professionals 
              for personalized advice. This is educational content, not personalized legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatePlanningCalculator;


