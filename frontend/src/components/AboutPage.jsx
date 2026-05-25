import { motion } from 'framer-motion';
import {
  HiOutlineLightningBolt, HiShieldCheck, HiDatabase,
  HiChip, HiOutlineCog, HiOutlineCode
} from 'react-icons/hi';
import './AboutPage.css';

function AboutPage() {
  const techStack = [
    { icon: <HiChip />, name: 'XGBoost', desc: 'Gradient boosting model for classification' },
    { icon: <HiOutlineCode />, name: 'FastAPI', desc: 'High-performance Python backend framework' },
    { icon: <HiOutlineLightningBolt />, name: 'React + Vite', desc: 'Modern frontend with blazing fast builds' },
    { icon: <HiDatabase/>, name: 'Scikit-learn', desc: 'Feature engineering and preprocessing' },
    { icon: <HiOutlineCog />, name: 'Label Encoding', desc: 'Categorical variable transformation' },
    { icon: <HiShieldCheck />, name: 'StandardScaler', desc: 'Feature normalization for model input' },
  ];

  const features = [
    {
      title: '30+ Input Features',
      desc: 'Comprehensive claim analysis using customer demographics, policy details, incident information, financial data, and vehicle specifics.',
    },
    {
      title: 'Feature Engineering',
      desc: 'Advanced derived features including vehicle age, claim-to-premium ratio, and injury severity scores for enhanced prediction accuracy.',
    },
    {
      title: 'Real-Time Predictions',
      desc: 'Instant fraud probability scoring with detailed risk classification from Low to Critical levels.',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>About <span className="gradient-text">ClaimGuard AI</span></h1>
            <p className="about-subtitle">
              An AI-powered insurance fraud detection system built with modern machine learning
              techniques to help insurers identify fraudulent claims with high accuracy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section container">
        <motion.div
          className="about-mission glass-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Our Mission</h2>
          <p>
            Insurance fraud costs the industry billions annually. ClaimGuard AI leverages
            state-of-the-art machine learning to provide insurers with a powerful tool for
            detecting fraudulent claims before they result in financial losses. By analyzing
            over 30 features across customer, policy, incident, and vehicle data, our system
            delivers accurate predictions in real-time.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="about-section container">
        <div className="about-section-header">
          <h2>Key Capabilities</h2>
        </div>
        <div className="about-features-grid">
          {features.map((f, i) => (
            <motion.div
              className="about-feature-card glass-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="about-section container">
        <div className="about-section-header">
          <h2>Technology Stack</h2>
          <p>Built with industry-leading tools and frameworks</p>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <motion.div
              className="tech-card glass-card"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="tech-icon">{tech.icon}</div>
              <h4>{tech.name}</h4>
              <p>{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Model Pipeline */}
      <section className="about-section container about-last">
        <div className="about-section-header">
          <h2>Model Pipeline</h2>
          <p>How raw claim data becomes a fraud prediction</p>
        </div>
        <div className="pipeline-flow">
          {[
            { step: '1', title: 'Data Input', desc: '30+ raw features received' },
            { step: '2', title: 'Feature Engineering', desc: 'Vehicle age, claim ratio, severity score' },
            { step: '3', title: 'Encoding', desc: 'Label encoding for categoricals' },
            { step: '4', title: 'Scaling', desc: 'StandardScaler normalization' },
            { step: '5', title: 'Prediction', desc: 'XGBoost classification output' },
          ].map((p, i) => (
            <motion.div
              className="pipeline-step glass-card"
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="pipeline-num">{p.step}</span>
              <div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
