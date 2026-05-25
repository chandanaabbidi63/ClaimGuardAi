import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  HiDatabase,
  HiChip,
  HiChartBar,
  HiUpload,
  HiCog,
  HiShieldCheck,
  HiRefresh,
  HiCheckCircle,
  HiExclamationCircle,
  HiDownload
} from 'react-icons/hi';

import API from '../services/api';
import './DashboardPage.css';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <HiChartBar /> },
  { id: 'batch', label: 'Batch Predict', icon: <HiUpload /> },
  { id: 'metrics', label: 'Model Metrics', icon: <HiChip /> },
  { id: 'retrain', label: 'Retrain', icon: <HiCog /> },
  { id: 'history', label: 'History', icon: <HiDatabase /> },
];

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // ---------- Overview ----------
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ---------- Batch ----------
  const [batchFile, setBatchFile] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ---------- Metrics ----------
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  // ---------- Retrain ----------
  const [retrainResult, setRetrainResult] = useState(null);
  const [retrainLoading, setRetrainLoading] = useState(false);

  // ---------- History ----------
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* -------- fetch helpers -------- */
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    try {
      const res = await API.get('/admin/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to fetch metrics', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await API.get('/admin/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetrainLoading(true);
    setRetrainResult(null);
    try {
      const res = await API.post('/admin/retrain');
      setRetrainResult(res.data);
    } catch (err) {
      console.error('Retrain failed', err);
      setRetrainResult({ error: 'Retrain request failed. Check backend logs.' });
    } finally {
      setRetrainLoading(false);
    }
  };

  const handleBatchUpload = async () => {
    if (!batchFile) return;
    setBatchLoading(true);
    setBatchResults(null);
    try {
      const formData = new FormData();
      formData.append('file', batchFile);
      const res = await API.post('/admin/predict-batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setBatchResults(res.data);
    } catch (err) {
      console.error('Batch predict failed', err);
    } finally {
      setBatchLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'overview' && !stats) fetchStats();
    if (activeTab === 'metrics' && !metrics) fetchMetrics();
    if (activeTab === 'history') fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /* -------- drag & drop -------- */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setBatchFile(e.dataTransfer.files[0]);
    }
  };

  /* ============================================================
     RENDER TABS
     ============================================================ */

  const renderOverview = () => {
    if (statsLoading) return <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /> Loading stats...</div>;
    if (!stats) return <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>No data available</div>;

    return (
      <>
        {/* Stat widgets */}
        <div className="stats-grid">
          <motion.div className="glass-card stat-widget" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <span className="widget-label">Total Claims</span>
            <span className="widget-value">{stats.total_records ?? '—'}</span>
          </motion.div>
          <motion.div className="glass-card stat-widget" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <span className="widget-label">Fraudulent</span>
            <span className="widget-value widget-value--fraud">{stats.fraud_count ?? '—'}</span>
          </motion.div>
          <motion.div className="glass-card stat-widget" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="widget-label">Genuine</span>
            <span className="widget-value" style={{ color: '#22c55e' }}>{stats.genuine_count ?? '—'}</span>
          </motion.div>
          <motion.div className="glass-card stat-widget" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <span className="widget-label">Fraud Rate</span>
            <span className="widget-value widget-value--fraud">{stats.fraud_percentage != null ? `${stats.fraud_percentage}%` : '—'}</span>
          </motion.div>
        </div>

        {/* Charts area */}
        <div className="charts-container">
          {stats.fraud_by_incident_type && (
            <motion.div className="glass-card chart-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3>Fraud by Incident Type</h3>
              {Object.entries(stats.fraud_by_incident_type).map(([key, val]) => (
                <div className="bar-row" key={key}>
                  <span className="bar-label">{key}</span>
                  <div className="bar-wrapper">
                    <motion.div className="bar-fill bar-fill--fraud" initial={{ width: 0 }} animate={{ width: `${Math.min(val, 100)}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <span className="bar-value">{val}%</span>
                </div>
              ))}
            </motion.div>
          )}

          {stats.top_makes && (
            <motion.div className="glass-card chart-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h3>Top Vehicle Makes</h3>
              {Object.entries(stats.top_makes).map(([key, val]) => (
                <div className="bar-row" key={key}>
                  <span className="bar-label">{key}</span>
                  <div className="bar-wrapper">
                    <motion.div className="bar-fill bar-fill--make" initial={{ width: 0 }} animate={{ width: `${Math.min((val / Math.max(...Object.values(stats.top_makes))) * 100, 100)}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <span className="bar-value">{val}</span>
                </div>
              ))}
            </motion.div>
          )}

          {stats.age_distribution && (
            <motion.div className="glass-card chart-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3>Age Distribution</h3>
              {Object.entries(stats.age_distribution).map(([key, val]) => (
                <div className="bar-row" key={key}>
                  <span className="bar-label">{key}</span>
                  <div className="bar-wrapper">
                    <motion.div className="bar-fill bar-fill--age" initial={{ width: 0 }} animate={{ width: `${Math.min((val / Math.max(...Object.values(stats.age_distribution))) * 100, 100)}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <span className="bar-value">{val}</span>
                </div>
              ))}
            </motion.div>
          )}

          {stats.top_states && (
            <motion.div className="glass-card chart-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h3>Top Incident States</h3>
              {Object.entries(stats.top_states).map(([key, val]) => (
                <div className="bar-row" key={key}>
                  <span className="bar-label">{key}</span>
                  <div className="bar-wrapper">
                    <motion.div className="bar-fill bar-fill--state" initial={{ width: 0 }} animate={{ width: `${Math.min((val / Math.max(...Object.values(stats.top_states))) * 100, 100)}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <span className="bar-value">{val}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </>
    );
  };

  const renderBatch = () => (
    <motion.div className="glass-card batch-container" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <h3><HiUpload style={{ verticalAlign: 'middle', marginRight: 8 }} /> Batch Prediction</h3>
      <p style={{ color: '#94a3b8', marginTop: 8 }}>Upload a CSV file with claim data to get bulk fraud predictions.</p>

      <div
        className={`upload-zone ${dragActive ? 'upload-zone--active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-icon"><HiUpload /></div>
        <p>{batchFile ? batchFile.name : 'Drag & drop a CSV file here, or click to browse'}</p>
        <label className="browse-label-btn form-btn form-btn--secondary">
          Browse Files
          <input
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => setBatchFile(e.target.files[0])}
          />
        </label>
      </div>

      <div className="batch-actions">
        <button className="form-btn form-btn--primary" onClick={handleBatchUpload} disabled={!batchFile || batchLoading}>
          {batchLoading ? <><span className="spinner" /> Processing...</> : <><HiShieldCheck /> Run Batch Prediction</>}
        </button>
        {batchFile && (
          <button className="form-btn form-btn--secondary" onClick={() => { setBatchFile(null); setBatchResults(null); }}>
            Clear
          </button>
        )}
      </div>

      {batchResults && (
        <div style={{ marginTop: 20, overflowX: 'auto' }}>
          <h4 style={{ marginBottom: 10 }}>{batchResults.length} results</h4>
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Prediction</th>
                <th>Fraud Probability</th>
                <th>Age</th>
                <th>State</th>
                <th>Claim Amount</th>
                <th>Make</th>
                <th>Model</th>
              </tr>
            </thead>
            <tbody>
              {batchResults.map((r) => (
                <tr key={r.row_index} className={r.prediction === 'Fraudulent Claim' ? 'row--fraud' : 'row--genuine'}>
                  <td>{r.row_index + 1}</td>
                  <td>{r.prediction}</td>
                  <td>{r.fraud_probability}%</td>
                  <td>{r.age}</td>
                  <td>{r.policy_state}</td>
                  <td>₹{Number(r.total_claim_amount).toLocaleString()}</td>
                  <td>{r.auto_make}</td>
                  <td>{r.auto_model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );

  const renderMetrics = () => {
    if (metricsLoading) return <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /> Loading metrics...</div>;
    if (!metrics) return <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>No metrics available</div>;

    const metricItems = [
      { label: 'Accuracy', value: metrics.accuracy },
      { label: 'Precision', value: metrics.precision },
      { label: 'Recall', value: metrics.recall },
      { label: 'F1 Score', value: metrics.f1_score },
      { label: 'ROC AUC', value: metrics.roc_auc },
    ].filter((m) => m.value != null);

    return (
      <motion.div className="glass-card metrics-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h3><HiChip style={{ verticalAlign: 'middle', marginRight: 8 }} /> Current Model Metrics</h3>
        {metricItems.length === 0 ? (
          <p style={{ color: '#94a3b8', marginTop: 15 }}>No metric data returned from the server.</p>
        ) : (
          <div style={{ marginTop: 20 }}>
            {metricItems.map((m) => (
              <div className="metric-row" key={m.label}>
                <span>{m.label}</span>
                <span className="metric-val text-accent">
                  {typeof m.value === 'number' ? (m.value * (m.value <= 1 ? 100 : 1)).toFixed(2) + '%' : m.value}
                </span>
              </div>
            ))}
          </div>
        )}
        <button className="form-btn form-btn--secondary" style={{ marginTop: 20 }} onClick={() => { setMetrics(null); fetchMetrics(); }}>
          <HiRefresh style={{ verticalAlign: 'middle', marginRight: 4 }} /> Refresh
        </button>
      </motion.div>
    );
  };

  const renderRetrain = () => (
    <motion.div className="glass-card retrain-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <h3><HiCog style={{ verticalAlign: 'middle', marginRight: 8 }} /> Retrain Model</h3>
      <p style={{ color: '#94a3b8', marginTop: 8 }}>
        Retrain the XGBoost model on the latest dataset. This will update the saved model and scalers.
      </p>
      <button className="form-btn form-btn--primary" style={{ marginTop: 20 }} onClick={handleRetrain} disabled={retrainLoading}>
        {retrainLoading ? <><span className="spinner" /> Retraining...</> : <><HiRefresh /> Start Retraining</>}
      </button>

      {retrainResult && !retrainResult.error && (
        <div className="retrain-badge-success" style={{ marginTop: 20 }}>
          <HiCheckCircle style={{ verticalAlign: 'middle', marginRight: 6, fontSize: 20 }} />
          Model retrained successfully!
          {retrainResult.accuracy && <span style={{ marginLeft: 10 }}>Accuracy: {(retrainResult.accuracy * 100).toFixed(2)}%</span>}
        </div>
      )}

      {retrainResult && retrainResult.error && (
        <div style={{ marginTop: 20, color: '#ef4444' }}>
          <HiExclamationCircle style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {retrainResult.error}
        </div>
      )}
    </motion.div>
  );

  const renderHistory = () => {
    if (historyLoading) return <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /> Loading history...</div>;

    const records = Array.isArray(history) ? history : history?.records || [];

    if (records.length === 0) {
      return (
        <motion.div className="glass-card history-log-card no-history" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <HiDatabase style={{ fontSize: 40, color: '#475569', marginBottom: 10 }} />
          <p>No prediction history yet. Start analyzing claims to build history.</p>
        </motion.div>
      );
    }

    return (
      <motion.div className="glass-card history-log-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h3><HiDatabase style={{ verticalAlign: 'middle', marginRight: 8 }} /> Prediction History</h3>
        <div style={{ overflowX: 'auto', marginTop: 15 }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Prediction</th>
                <th>Fraud Probability</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className={r.prediction === 'Fraudulent Claim' ? 'row--fraud' : 'row--genuine'}>
                  <td>{i + 1}</td>
                  <td>{r.prediction}</td>
                  <td>{r.fraud_probability}%</td>
                  <td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'batch': return renderBatch();
      case 'metrics': return renderMetrics();
      case 'retrain': return renderRetrain();
      case 'history': return renderHistory();
      default: return null;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <motion.div className="dashboard-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1>Admin <span className="gradient-text">Dashboard</span></h1>
          <p style={{ color: '#94a3b8', marginTop: 8 }}>Monitor, analyze, and manage your fraud detection model.</p>
        </motion.div>

        {/* Tab navigation */}
        <div className="dashboard-nav">
          <div className="tab-menu">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} <span style={{ marginLeft: 6 }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DashboardPage;