import Link from "next/link";
import styles from "./Register.module.scss";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const RegisterView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { push } = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const form = e.target as HTMLFormElement;
    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
      phone: form.phone.value,
      password: form.password.value,
    };

    try {
      const result = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await result.json();

      if (result.status === 201) {
        form.reset();
        setIsLoading(false);
        push("/auth/login");
      } else {
        setIsLoading(false);
        setError(
          responseData.message ||
            "Terjadi kesalahan saat mendaftar. Silahkan coba lagi."
        );
      }
    } catch (err) {
      setIsLoading(false);
      setError("Terjadi kesalahan saat menghubungi server. Silakan coba lagi.");
      console.error("Error during sign up:", err);
    }
  };

  return (
    <div className={styles.register}>
      <h1 className={styles.register__title}>Register Page</h1>
      {error && <p className={styles.register__error}>{error}</p>}
      <div className={styles.register__form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.register__form__item}>
            <label
              htmlFor="fullname"
              className={styles.register__form__item__label}
            >
              Fullname
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className={styles.register__form__item__input}
              placeholder="Input your fullname"
              required
            />
          </div>
          <div className={styles.register__form__item}>
            <label
              htmlFor="email"
              className={styles.register__form__item__label}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={styles.register__form__item__input}
              placeholder="Input your email"
              required
            />
          </div>
          <div className={styles.register__form__item}>
            <label
              htmlFor="phone"
              className={styles.register__form__item__label}
            >
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className={styles.register__form__item__input}
              placeholder="Input your phone"
              required
            />
          </div>
          <div className={styles.register__form__item}>
            <label
              htmlFor="password"
              className={styles.register__form__item__label}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={styles.register__form__item__input}
              placeholder="*********"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className={styles.register__form__button}>
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
      <p className={styles.register__link}>
        Have an account? Sign in <Link href="/auth/login">here</Link>
      </p>
    </div>
  );
};

export default RegisterView;
