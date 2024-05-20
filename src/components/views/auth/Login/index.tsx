import Link from "next/link";
import styles from "./Login.module.scss";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const LoginView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const callbackUrlParam = searchParams.get("callbackUrl");
    if (callbackUrlParam) {
      setCallbackUrl(callbackUrlParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      setIsLoading(false);

      if (res && !res.error) {
        form.reset(); // Memanggil fungsi reset
        router.push(callbackUrl);
      } else {
        setError("Email or password is incorrect");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Email or password is incorrect");
      console.error("Error during sign up:", err);
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.login__title}>Login Page</h1>
      {error && <p className={styles.login__error}>{error}</p>}
      <div className={styles.login__form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.login__form__item}>
            <label htmlFor="email" className={styles.login__form__item__label}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={styles.login__form__item__input}
              placeholder="Input your email"
              required
            />
          </div>
          <div className={styles.login__form__item}>
            <label
              htmlFor="password"
              className={styles.login__form__item__label}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={styles.login__form__item__input}
              placeholder="*********"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className={styles.login__form__button}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          <div className={styles.login__form__other}>
            <button
              className={styles.login__form__other__button}
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: callbackUrl,
                  redirect: false,
                })
              }
            >
              <i className="bx bxl-google-plus-circle" /> Login With Google
            </button>
          </div>
        </form>
      </div>
      <p className={styles.login__link}>
        Don{" ' "}t have an account? Sign up{" "}
        <Link href="/auth/register">here</Link>
      </p>
    </div>
  );
};

export default LoginView;
