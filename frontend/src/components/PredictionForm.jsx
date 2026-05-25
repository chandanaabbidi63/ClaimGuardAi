import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUser, HiOutlineDocumentText, HiOutlineShieldCheck,
  HiOutlineCurrencyRupee, HiExclamationCircle,
  HiOutlineTruck, HiOutlineArrowRight, HiOutlineArrowLeft,
  HiOutlineChevronRight, HiShieldCheck
} from 'react-icons/hi';
import API from '../services/api';
import ResultCard from './ResultCard';
import './PredictionForm.css';

const STEPS = [
  { id: 'customer', label: 'Customer', icon: <HiOutlineUser /> },
  { id: 'policy', label: 'Policy', icon: <HiOutlineDocumentText /> },
  { id: 'insured', label: 'Insured', icon: <HiShieldCheck /> },
  { id: 'financial', label: 'Financial', icon: <HiOutlineCurrencyRupee /> },
  { id: 'incident', label: 'Incident', icon: <HiExclamationCircle /> },
  { id: 'claims', label: 'Claims', icon: <HiOutlineCurrencyRupee /> },
  { id: 'vehicle', label: 'Vehicle', icon: <HiOutlineTruck /> },
];

const INITIAL_DATA = {
  months_as_customer: '',
  age: '',
  policy_state: 'OH',
  policy_csl: '250/500',
  policy_deductable: '',
  policy_annual_premium: '',
  umbrella_limit: '',
  insured_sex: 'MALE',
  insured_education_level: 'MD',
  insured_occupation: 'craft-repair',
  insured_hobbies: 'sleeping',
  insured_relationship: 'husband',
  capital_gains: '',
  capital_loss: '',
  incident_type: 'Single Vehicle Collision',
  collision_type: 'Side Collision',
  incident_severity: 'Major Damage',
  authorities_contacted: 'Police',
  incident_state: 'SC',
  incident_city: 'Columbus',
  incident_hour_of_the_day: '',
  number_of_vehicles_involved: '',
  bodily_injuries: '',
  witnesses: '',
  total_claim_amount: '',
  injury_claim: '',
  property_claim: '',
  vehicle_claim: '',
  auto_make: 'Saab',
  auto_model: '92x',
  auto_year: '',
};

/* ---------- dropdown options ---------- */
const OPTIONS = {
  policy_state: ['IL', 'IN', 'OH'],
  policy_csl: ['100/300', '250/500', '500/1000'],
  insured_sex: ['MALE', 'FEMALE'],
  insured_education_level: ['JD', 'High School', 'College', 'Masters', 'Associate', 'MD', 'PhD'],
  insured_occupation: [
    'craft-repair', 'machine-op-inspct', 'sales', 'armed-forces',
    'tech-support', 'prof-specialty', 'other-service', 'priv-house-serv',
    'exec-managerial', 'protective-serv', 'transport-moving',
    'handlers-cleaners', 'adm-clerical', 'farming-fishing',
  ],
  insured_hobbies: [
    'sleeping', 'reading', 'board-games', 'bungie-jumping', 'base-jumping',
    'golf', 'camping', 'dancing', 'skydiving', 'movies', 'hiking',
    'yachting', 'paintball', 'chess', 'exercise', 'polo', 'kayaking',
    'cross-fit', 'video-games',
  ],
  insured_relationship: ['husband', 'other-relative', 'own-child', 'unmarried', 'wife', 'not-in-family'],
  incident_type: ['Single Vehicle Collision', 'Vehicle Theft', 'Multi-vehicle Collision', 'Parked Car'],
  collision_type: ['Side Collision', 'Rear Collision', 'Front Collision', '?'],
  incident_severity: ['Major Damage', 'Minor Damage', 'Total Loss', 'Trivial Damage'],
  authorities_contacted: ['Police', 'Fire', 'Other', 'Ambulance', 'None'],
  incident_state: ['SC', 'VA', 'NY', 'NC', 'WV', 'OH', 'PA'],
  incident_city: ['Columbus', 'Riverwood', 'Arlington', 'Springfield', 'Hillsdale', 'Northbend', 'Northbrook'],
  auto_make: [
    'Saab', 'Mercedes', 'Dodge', 'Chevrolet', 'Accura', 'BMW', 'Audi',
    'Toyota', 'Ford', 'Subaru', 'Volkswagen', 'Nissan', 'Jeep', 'Honda',
  ],
  auto_model: [
    '92x', 'E400', 'RAM', 'Tahoe', 'RSX', 'Malibu', 'Wrangler', 'Forester',
    'A5', '3 Series', 'Camry', 'Civic', 'Accord', 'Corolla', 'CRV',
    'A3', 'MDX', 'Neon', 'Pathfinder', 'Ultima', 'Passat', 'Jetta',
    'Silverado', 'Escape', 'F150', 'Fusion', 'Legacy', 'Impreza',
    'TL', 'X5', 'X6', 'C300', 'ML350', 'Grand Cherokee',
    'Highlander', 'Maxima', 'M5', 'Beetle', 'Xterra', 'Focus',
    'Mustang', 'Frontier',
  ],
};

function PredictionForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? value : value,
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const castNumbers = (data) => {
    const intFields = [
      'months_as_customer', 'age', 'policy_deductable', 'umbrella_limit',
      'capital_gains', 'capital_loss', 'incident_hour_of_the_day',
      'number_of_vehicles_involved', 'bodily_injuries', 'witnesses', 'auto_year',
    ];
    const floatFields = [
      'policy_annual_premium', 'total_claim_amount', 'injury_claim',
      'property_claim', 'vehicle_claim',
    ];
    const out = { ...data };
    intFields.forEach((f) => { out[f] = parseInt(out[f], 10) || 0; });
    floatFields.forEach((f) => { out[f] = parseFloat(out[f]) || 0; });
    return out;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = castNumbers(formData);
      const response = await API.post('/predict', payload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Prediction failed. Make sure the backend is running at http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
    setStep(0);
    setFormData(INITIAL_DATA);
  };

  /* ---------- render field helpers ---------- */
  const renderInput = (name, label, type = 'number', placeholder = '') => (
    <div className="form-field" key={name}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder || label}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  );

  const renderSelect = (name, label) => (
    <div className="form-field" key={name}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={formData[name]} onChange={handleChange}>
        {OPTIONS[name].map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  /* ---------- step content ---------- */
  const stepContent = {
    customer: (
      <div className="form-grid">
        {renderInput('months_as_customer', 'Months as Customer', 'number', 'e.g. 328')}
        {renderInput('age', 'Customer Age', 'number', 'e.g. 48')}
      </div>
    ),
    policy: (
      <div className="form-grid">
        {renderSelect('policy_state', 'Policy State')}
        {renderSelect('policy_csl', 'Policy CSL')}
        {renderInput('policy_deductable', 'Policy Deductible', 'number', 'e.g. 1000')}
        {renderInput('policy_annual_premium', 'Annual Premium (₹)', 'number', 'e.g. 1406.91')}
        {renderInput('umbrella_limit', 'Umbrella Limit', 'number', 'e.g. 0')}
      </div>
    ),
    insured: (
      <div className="form-grid">
        {renderSelect('insured_sex', 'Sex')}
        {renderSelect('insured_education_level', 'Education Level')}
        {renderSelect('insured_occupation', 'Occupation')}
        {renderSelect('insured_hobbies', 'Hobbies')}
        {renderSelect('insured_relationship', 'Relationship')}
      </div>
    ),
    financial: (
      <div className="form-grid">
        {renderInput('capital_gains', 'Capital Gains (₹)', 'number', 'e.g. 53300')}
        {renderInput('capital_loss', 'Capital Loss (₹)', 'number', 'e.g. 0')}
      </div>
    ),
    incident: (
      <div className="form-grid">
        {renderSelect('incident_type', 'Incident Type')}
        {renderSelect('collision_type', 'Collision Type')}
        {renderSelect('incident_severity', 'Incident Severity')}
        {renderSelect('authorities_contacted', 'Authorities Contacted')}
        {renderSelect('incident_state', 'Incident State')}
        {renderSelect('incident_city', 'Incident City')}
        {renderInput('incident_hour_of_the_day', 'Hour of Day (0–23)', 'number', 'e.g. 5')}
        {renderInput('number_of_vehicles_involved', 'Vehicles Involved', 'number', 'e.g. 1')}
        {renderInput('bodily_injuries', 'Bodily Injuries', 'number', 'e.g. 1')}
        {renderInput('witnesses', 'Witnesses', 'number', 'e.g. 2')}
      </div>
    ),
    claims: (
      <div className="form-grid">
        {renderInput('total_claim_amount', 'Total Claim Amount (₹)', 'number', 'e.g. 71610')}
        {renderInput('injury_claim', 'Injury Claim (₹)', 'number', 'e.g. 6510')}
        {renderInput('property_claim', 'Property Claim (₹)', 'number', 'e.g. 13020')}
        {renderInput('vehicle_claim', 'Vehicle Claim (₹)', 'number', 'e.g. 52080')}
      </div>
    ),
    vehicle: (
      <div className="form-grid">
        {renderSelect('auto_make', 'Auto Make')}
        {renderSelect('auto_model', 'Auto Model')}
        {renderInput('auto_year', 'Auto Year', 'number', 'e.g. 2004')}
      </div>
    ),
  };

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  /* ---------- if result exists, show it ---------- */
  if (result) {
    return <ResultCard result={result} onReset={resetForm} />;
  }

  return (
    <div className="prediction-page">
      <div className="predict-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Analyze Insurance Claim</h1>
          <p>Fill in the claim details across all categories to get an AI-powered fraud prediction.</p>
        </motion.div>
      </div>

      <div className="predict-layout container">
        {/* Progress Sidebar */}
        <div className="predict-sidebar glass-card">
          <h4 className="sidebar-title">Progress</h4>
          <div className="step-list">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`step-item ${i === step ? 'step-item--active' : ''} ${i < step ? 'step-item--done' : ''}`}
                onClick={() => setStep(i)}
                type="button"
              >
                <span className="step-item-icon">{s.icon}</span>
                <span className="step-item-label">{s.label}</span>
                <HiOutlineChevronRight className="step-item-arrow" />
              </button>
            ))}
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">{step + 1} of {STEPS.length} sections</span>
        </div>

        {/* Form */}
        <form className="predict-form glass-card" onSubmit={handleSubmit}>
          <div className="form-step-header">
            <span className="form-step-icon">{currentStep.icon}</span>
            <div>
              <h3>{currentStep.label} Information</h3>
              <p className="form-step-desc">
                {step === 0 && 'Basic customer demographics'}
                {step === 1 && 'Policy coverage and premium details'}
                {step === 2 && 'Personal details of the insured individual'}
                {step === 3 && 'Capital gains and losses information'}
                {step === 4 && 'Details about the reported incident'}
                {step === 5 && 'Breakdown of claim amounts'}
                {step === 6 && 'Vehicle make, model, and year'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="form-step-content"
            >
              {stepContent[currentStep.id]}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="form-error">
              <HiExclamationCircle />
              {error}
            </div>
          )}

          <div className="form-actions">
            {step > 0 && (
              <button type="button" className="form-btn form-btn--secondary" onClick={prevStep}>
                <HiOutlineArrowLeft /> Previous
              </button>
            )}

            <div className="form-actions-right">
              {!isLastStep ? (
                <button type="button" className="form-btn form-btn--primary" onClick={nextStep}>
                  Next <HiOutlineArrowRight />
                </button>
              ) : (
                <button type="submit" className="form-btn form-btn--submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <HiShieldCheck />
                      Detect Fraud
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PredictionForm;
