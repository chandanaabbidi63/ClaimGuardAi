import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiOutlineLightningBolt, HiOutlineClock, HiOutlineChartBar, HiChartBar } from 'react-icons/hi';
import './HeroPage.css';

function HeroPage() {
  const features = [
    {
      icon: <HiOutlineLightningBolt />,
      title: 'AI-Powered Detection',
      description: 'Advanced XGBoost model trained on thousands of insurance claims for accurate fraud identification.',
    },
    {
      icon: <HiOutlineClock />,
      title: 'Real-Time Analysis',
      description: 'Get instant predictions with fraud probability scores within seconds of submission.',
    },
    {
      icon: <HiChartBar />,
      title: 'High Accuracy',
      description: 'Precision-tuned model with comprehensive feature engineering for reliable predictions.',
    },
  ];

  const stats = [
    { value: '30+', label: 'Input Features' },
    { value: '95%+', label: 'Accuracy' },
    { value: '<1s', label: 'Response Time' },
    { value: 'XGBoost', label: 'ML Model' },
  ];

  return (
    <div className="hero-page">
      {/* Animated Background */}
      <div className="hero-bg">
        <div className="hero-bg-orb hero-bg-orb--1" />
        <div className="hero-bg-orb hero-bg-orb--2" />
        <div className="hero-bg-orb hero-bg-orb--3" />
        <div className="hero-bg-grid" />
      </div>

      {/* Hero Section */}
      <section className="hero-section container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="hero-badge">
            <HiShieldCheck />
            <span>AI-Powered Fraud Detection</span>
          </div>

          <h1 className="hero-title">
            Detect Insurance Fraud<br />
            <span className="gradient-text">Before It Costs You</span>
          </h1>

          <p className="hero-subtitle">
            ClaimGuard AI leverages advanced machine learning to analyze insurance claims
            in real-time, identifying fraudulent patterns with exceptional accuracy.
          </p>

          <div className="hero-actions">
            <Link to="/predict" className="hero-btn hero-btn--primary">
              <HiShieldCheck />
              Analyze a Claim
            </Link>
            <Link to="/about" className="hero-btn hero-btn--secondary">
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {stats.map((stat, i) => (
            <div className="hero-stat" key={i}>
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Why ClaimGuard AI?</h2>
          <p>Powerful features designed to protect insurers from fraudulent claims.</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <motion.div
              className="feature-card glass-card"
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="howit-section container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>How It Works</h2>
          <p>Three simple steps to detect fraudulent insurance claims.</p>
        </motion.div>

        <div className="howit-steps">
          {[
            { step: '01', title: 'Enter Claim Data', desc: 'Fill in the comprehensive claim details across customer, policy, incident, and vehicle information.' },
            { step: '02', title: 'AI Analysis', desc: 'Our XGBoost model processes the data through feature engineering, encoding, and scaling pipelines.' },
            { step: '03', title: 'Get Results', desc: 'Receive an instant fraud/genuine verdict with a confidence probability score.' },
          ].map((item, i) => (
            <motion.div
              className="howit-step glass-card"
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <span className="howit-step-num">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container">
        <motion.div
          className="cta-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Detect Fraud?</h2>
          <p>Start analyzing insurance claims with AI-powered precision today.</p>
          <Link to="/predict" className="hero-btn hero-btn--primary">
            <HiShieldCheck />
            Get Started Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default HeroPage;
