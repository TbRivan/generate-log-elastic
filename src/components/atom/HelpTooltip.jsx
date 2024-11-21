function HelpTooltip({ children }) {
  return (
    <div class="help-icon-container">
      <span class="help-icon">?</span>
      <div class="help-popup">{children}</div>
    </div>
  );
}

export default HelpTooltip;
