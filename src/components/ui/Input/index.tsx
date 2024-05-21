import styles from "./Input.module.scss";

type Proptypes = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
};

const Input = (props: Proptypes) => {
  const { label, name, type, placeholder } = props;
  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={name} className={styles.container__label}>
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        className={styles.container__input}
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default Input;
