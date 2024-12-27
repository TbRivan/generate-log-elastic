function HelpTooltip({ children }) {
  return (
    <div className="help-icon-container">
      <span className="help-icon">?</span>
      <div className="help-popup">{children}</div>
    </div>
  );
}

export default HelpTooltip;
