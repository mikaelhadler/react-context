import './Spinner.css';

export function Spinner() {
  return (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  );
}

export default { Spinner };
