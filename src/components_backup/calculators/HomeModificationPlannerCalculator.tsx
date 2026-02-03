'use client';

import React, { useState } from 'react';
import { Calculator, Home, Bath, ArrowUpDown, Car, Wrench, DollarSign, Star, CheckCircle, AlertTriangle, Calendar, FileText } from 'lucide-react';

interface HomeModificationPlannerCalculatorProps {
  className?: string;
}

interface Modification {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  priority: 'high' | 'medium' | 'low' | '';
  selected: boolean;
}

const HomeModificationPlannerCalculator: React.FC<HomeModificationPlannerCalculatorProps> = ({ className = '' }) => {
  const [modifications, setModifications] = useState<Modification[]>([
    // Bathroom Modifications
    { id: 'grab-bars', name: 'Grab Bars Installation', description: 'Essential safety bars near toilet and shower', cost: 150, category: 'bathroom', priority: '', selected: false },
    { id: 'walk-in-shower', name: 'Walk-in Shower Conversion', description: 'Remove tub step-over barrier', cost: 800, category: 'bathroom', priority: '', selected: false },
    { id: 'raised-toilet', name: 'Raised Toilet Seat', description: 'Increase toilet height for easier use', cost: 200, category: 'bathroom', priority: '', selected: false },
    { id: 'shower-bench', name: 'Shower Bench/Chair', description: 'Seating for safer showering', cost: 100, category: 'bathroom', priority: '', selected: false },
    { id: 'non-slip-flooring', name: 'Non-slip Flooring', description: 'Slip-resistant bathroom flooring', cost: 300, category: 'bathroom', priority: '', selected: false },
    
    // Entry & Mobility
    { id: 'ramp', name: 'Wheelchair Ramp', description: 'Accessible entry to home', cost: 1200, category: 'mobility', priority: '', selected: false },
    { id: 'handrails', name: 'Handrails', description: 'Stair and hallway handrails', cost: 400, category: 'mobility', priority: '', selected: false },
    { id: 'stair-lift', name: 'Stair Lift', description: 'Motorized chair for stairs', cost: 3000, category: 'mobility', priority: '', selected: false },
    { id: 'doorway-widening', name: 'Doorway Widening', description: 'Widen doorways for wheelchair access', cost: 600, category: 'mobility', priority: '', selected: false },
    { id: 'threshold-removal', name: 'Threshold Removal', description: 'Remove door thresholds', cost: 150, category: 'mobility', priority: '', selected: false },
    
    // Kitchen Modifications
    { id: 'kitchen-height', name: 'Adjustable Counter Heights', description: 'Raise or lower counter heights', cost: 800, category: 'kitchen', priority: '', selected: false },
    { id: 'pull-out-shelves', name: 'Pull-out Shelves', description: 'Easy access to cabinets', cost: 300, category: 'kitchen', priority: '', selected: false },
    { id: 'lever-handles', name: 'Lever Door Handles', description: 'Easier to operate than knobs', cost: 200, category: 'kitchen', priority: '', selected: false },
    { id: 'task-lighting', name: 'Improved Task Lighting', description: 'Better visibility for cooking', cost: 250, category: 'kitchen', priority: '', selected: false },
    
    // Safety & Security
    { id: 'smoke-detectors', name: 'Enhanced Smoke Detectors', description: 'Interconnected smoke and CO detectors', cost: 200, category: 'safety', priority: '', selected: false },
    { id: 'security-system', name: 'Security System', description: 'Home security and monitoring', cost: 500, category: 'safety', priority: '', selected: false },
    { id: 'emergency-alert', name: 'Emergency Alert System', description: 'Personal emergency response system', cost: 300, category: 'safety', priority: '', selected: false },
    { id: 'smart-locks', name: 'Smart Door Locks', description: 'Keyless entry and remote access', cost: 400, category: 'safety', priority: '', selected: false },
    
    // Lighting & Electrical
    { id: 'motion-lights', name: 'Motion-activated Lighting', description: 'Automatic lighting for safety', cost: 150, category: 'lighting', priority: '', selected: false },
    { id: 'night-lights', name: 'Night Lights', description: 'Low-level lighting for navigation', cost: 50, category: 'lighting', priority: '', selected: false },
    { id: 'outlet-height', name: 'Raised Electrical Outlets', description: 'Easier access to outlets', cost: 200, category: 'lighting', priority: '', selected: false },
    
    // Flooring & Surfaces
    { id: 'non-slip-tiles', name: 'Non-slip Flooring', description: 'Slip-resistant flooring throughout', cost: 1000, category: 'flooring', priority: '', selected: false },
    { id: 'carpet-removal', name: 'Carpet Removal', description: 'Remove tripping hazards', cost: 300, category: 'flooring', priority: '', selected: false },
    { id: 'smooth-transitions', name: 'Smooth Floor Transitions', description: 'Eliminate height differences', cost: 400, category: 'flooring', priority: '', selected: false }
  ]);

  const [budget, setBudget] = useState(5000);
  const [timeline, setTimeline] = useState('6 months');

  const toggleModification = (id: string) => {
    setModifications(prev => prev.map(mod => 
      mod.id === id ? { ...mod, selected: !mod.selected } : mod
    ));
  };

  const updatePriority = (id: string, priority: 'high' | 'medium' | 'low' | '') => {
    setModifications(prev => prev.map(mod => 
      mod.id === id ? { ...mod, priority } : mod
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bathroom': return <Bath className="h-5 w-5" />;
      case 'mobility': return <ArrowUpDown className="h-5 w-5" />;
      case 'kitchen': return <Home className="h-5 w-5" />;
      case 'safety': return <AlertTriangle className="h-5 w-5" />;
      case 'lighting': return <Wrench className="h-5 w-5" />;
      case 'flooring': return <Home className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bathroom': return 'text-blue-600';
      case 'mobility': return 'text-green-600';
      case 'kitchen': return 'text-orange-600';
      case 'safety': return 'text-red-600';
      case 'lighting': return 'text-yellow-600';
      case 'flooring': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const selectedModifications = modifications.filter(mod => mod.selected);
  const totalCost = selectedModifications.reduce((sum, mod) => sum + mod.cost, 0);
  const highPriorityCost = selectedModifications
    .filter(mod => mod.priority === 'high')
    .reduce((sum, mod) => sum + mod.cost, 0);
  const mediumPriorityCost = selectedModifications
    .filter(mod => mod.priority === 'medium')
    .reduce((sum, mod) => sum + mod.cost, 0);
  const lowPriorityCost = selectedModifications
    .filter(mod => mod.priority === 'low')
    .reduce((sum, mod) => sum + mod.cost, 0);

  const groupedModifications = modifications.reduce((acc, mod) => {
    if (!acc[mod.category]) {
      acc[mod.category] = [];
    }
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<string, Modification[]>);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'bathroom': return 'Bathroom Safety';
      case 'mobility': return 'Entry & Mobility';
      case 'kitchen': return 'Kitchen Modifications';
      case 'safety': return 'Safety & Security';
      case 'lighting': return 'Lighting & Electrical';
      case 'flooring': return 'Flooring & Surfaces';
      default: return category;
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Home className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Home Modification Planner</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Plan and budget for home modifications to create a safer, more accessible living environment for aging in place
        </p>
      </div>

      {/* Planning Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
          Planning Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Select Modifications</h3>
            <p className="text-sm text-gray-600">Choose from common accessibility improvements</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Set Priorities</h3>
            <p className="text-sm text-gray-600">Prioritize based on safety and budget</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calculator className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Calculate Budget</h3>
            <p className="text-sm text-gray-600">Get total cost estimates for planning</p>
          </div>
        </div>
      </div>

      {/* Budget and Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Budget & Timeline</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Budget</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Implementation Timeline</label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cost Summary</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">${highPriorityCost.toLocaleString()}</div>
            <div className="text-gray-600">High Priority</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">${mediumPriorityCost.toLocaleString()}</div>
            <div className="text-gray-600">Medium Priority</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">${lowPriorityCost.toLocaleString()}</div>
            <div className="text-gray-600">Low Priority</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">${totalCost.toLocaleString()}</div>
            <div className="text-gray-600">Total Cost</div>
          </div>
        </div>
        
        {totalCost > budget && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">
                Budget exceeded by ${(totalCost - budget).toLocaleString()}
              </span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              Consider prioritizing high-priority items or increasing your budget.
            </p>
          </div>
        )}
        
        {totalCost <= budget && totalCost > 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Within budget - ${(budget - totalCost).toLocaleString()} remaining
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modification Categories */}
      <div className="space-y-8">
        {Object.entries(groupedModifications).map(([category, categoryMods]) => (
          <div key={category} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className={getCategoryColor(category)}>
                {getCategoryIcon(category)}
              </span>
              <span className="ml-2">{getCategoryLabel(category)}</span>
            </h3>
            <div className="space-y-3">
              {categoryMods.map((modification) => (
                <div
                  key={modification.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    modification.selected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
                  } ${getPriorityColor(modification.priority)}`}
                  onClick={() => toggleModification(modification.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{modification.name}</h4>
                      <p className="text-sm text-gray-600">{modification.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-green-600">
                        ${modification.cost.toLocaleString()}
                      </span>
                      <select
                        className="text-sm border rounded px-2 py-1"
                        value={modification.priority}
                        onChange={(e) => updatePriority(modification.id, e.target.value as 'high' | 'medium' | 'low' | '')}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Calendar className="h-6 w-6 text-indigo-600 mr-3" />
          Implementation Timeline
        </h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold text-red-800 mb-2">Immediate</h3>
            <p className="text-sm text-red-700">Safety hazards</p>
            <p className="text-xs text-red-600 mt-1">0-1 week</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <Wrench className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-orange-800 mb-2">Short-term</h3>
            <p className="text-sm text-orange-700">Basic modifications</p>
            <p className="text-xs text-orange-600 mt-1">1-3 months</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <Home className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold text-yellow-800 mb-2">Medium-term</h3>
            <p className="text-sm text-yellow-700">Major renovations</p>
            <p className="text-xs text-yellow-600 mt-1">3-6 months</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-2">Long-term</h3>
            <p className="text-sm text-green-700">Complete accessibility</p>
            <p className="text-xs text-green-600 mt-1">6+ months</p>
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Next Steps
        </h3>
        <div className="text-blue-700 space-y-2">
          <div>1. <strong>Professional Assessment:</strong> Get a home safety evaluation from an occupational therapist or certified aging-in-place specialist</div>
          <div>2. <strong>Contractor Quotes:</strong> Obtain multiple quotes for major modifications</div>
          <div>3. <strong>Permit Requirements:</strong> Check local building codes and permit requirements</div>
          <div>4. <strong>Financing Options:</strong> Explore grants, loans, and insurance coverage</div>
          <div>5. <strong>Implementation Plan:</strong> Schedule modifications based on priority and budget</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-8">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimers</h3>
            <p className="text-sm text-yellow-700">
              Cost estimates are approximate and may vary based on location, materials, and contractor rates. 
              Always obtain multiple quotes and verify contractor credentials. This tool is for planning purposes only 
              and should not replace professional consultation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModificationPlannerCalculator;
