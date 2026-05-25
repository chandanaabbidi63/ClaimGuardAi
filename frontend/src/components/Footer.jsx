import { Link } from 'react-router-dom';
import { HiShieldCheck } from 'react-icons/hi';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo">
            <HiShieldCheck />
          </div>
          <span className="footer-title">ClaimGuard<span className="gradient-text">AI</span></span>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/predict">Predict</Link>
          <Link to="/about">About</Link>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} ClaimGuard AI. Built with FastAPI &amp; React.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
