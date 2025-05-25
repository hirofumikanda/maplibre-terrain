type Props = {
  value: number;
  onChange: (value: number) => void;
};

const ExaggerationSlider = ({ value, onChange }: Props) => (
  <div
    style={{
      position: "absolute",
      top: 16,
      left: 16,
      background: "rgba(255,255,255,0.9)",
      padding: "12px 16px",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      zIndex: 1,
      minWidth: 340,
    }}
  >
    <label htmlFor="exaggeration-slider">地形の強調: {value}</label>
    <input
      id="exaggeration-slider"
      type="range"
      min="0"
      max="3"
      step="0.1"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: 250, marginLeft: 8 }}
    />
  </div>
);

export default ExaggerationSlider;
