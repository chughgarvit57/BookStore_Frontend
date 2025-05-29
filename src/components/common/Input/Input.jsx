import "./Input.module.scss";

const Input = ({ type, placeholder, name, onChange, value, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
      className={className}
    />
  );
};

export default Input;
