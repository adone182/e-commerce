import styles from "./Button.module.scss";

type Proptypes = {
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  children: React.ReactNode;
  variant: string;
  className?: string;
};
const Button = (props: Proptypes) => {
  const { type, onClick, children, variant = "primary", className } = props;
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
