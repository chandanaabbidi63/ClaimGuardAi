import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiShieldCheck, HiExclamationCircle,
  HiRefresh
} from 'react-icons/hi';
import './ResultCard.css';

function ResultCard({ result, onReset }) {
  const [animatedProb, setAnimatedProb] = useState(0);
  const isFraud = result.prediction === 'Fraudulent Claim';
  const probability = result.fraud_probability;

  // Animate probability counter
  useEffect(() => {
    let start = 0;
    const end = probability;
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedProb(start);
    }, 16);
    return () => clearInterval(timer);
  }, [probability]);

  const getRiskLevel = (prob) => {
    if (prob < 25) return { label: 'Low Risk', className: 'risk--low' };
    if (prob < 50) return { label: 'Medium Risk', className: 'risk--medium' };
    if (prob < 75) return { label: 'High Risk', className: 'risk--high' };
    return { label: 'Critical Risk', className: 'risk--critical' };
  };

  const risk = getRiskLevel(probability);

  // SVG gauge parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProb / 100) * circumference;

  return (
    <div className="result-page">
      <div className="result-container container">
        <motion.div
          className={`result-card glass-card ${isFraud ? 'result-card--fraud' : 'result-card--genuine'}`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Verdict Icon */}
          <div className={`result-icon-wrap ${isFraud ? 'result-icon--fraud' : 'result-icon--genuine'}`}>
            {isFraud ? (
              <HiExclamationCircle className="result-icon" />
            ) : (
              <HiShieldCheck className="result-icon" />
            )}
          </div>

          {/* Verdict */}
          <h2 className={`result-verdict ${isFraud ? 'verdict--fraud' : 'verdict--genuine'}`}>
            {result.prediction}
          </h2>

          <p className="result-desc">
            {isFraud
              ? 'This claim has been flagged as potentially fraudulent based on the submitted data.'
              : 'This claim appears to be legitimate based on the submitted data.'
            }
          </p>

          {/* Gauge */}
          <div className="result-gauge-section">
            <div className="gauge-container">
              <svg className="gauge-svg" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100" cy="100" r={radius}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeWidth="12"
                />
                {/* Progress circle */}
                <circle
                  cx="100" cy="100" r={radius}
                  fill="none"
                  stroke={isFraud ? 'url(#fraudGradient)' : 'url(#genuineGradient)'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 100 100)"
                  className="gauge-progress"
                />
                {/* Gradient defs */}
                <defs>
                  <linearGradient id="fraudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="genuineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="gauge-center">
                <span className={`gauge-value ${isFraud ? 'gauge-value--fraud' : 'gauge-value--genuine'}`}>
                  {animatedProb.toFixed(1)}%
                </span>
                <span className="gauge-label">Fraud Probability</span>
              </div>
            </div>
          </div>

          {/* Risk Badge */}
          <div className={`risk-badge ${risk.className}`}>
            {risk.label}
          </div>

          {/* Details */}
          <div className="result-details">
            <div className="result-detail-item">
              <span className="detail-label">Prediction</span>
              <span className={`detail-value ${isFraud ? 'detail-value--fraud' : 'detail-value--genuine'}`}>
                {result.prediction}
              </span>
            </div>
            <div className="result-detail-item">
              <span className="detail-label">Fraud Probability</span>
              <span className="detail-value">{probability}%</span>
            </div>
            <div className="result-detail-item">
              <span className="detail-label">Risk Level</span>
              <span className={`detail-value ${risk.className}`}>{risk.label}</span>
            </div>
          </div>

          {/* Reset */}
          <button className="result-reset-btn" onClick={onReset}>
            <HiRefresh />
            Analyze Another Claim
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default ResultCard;
