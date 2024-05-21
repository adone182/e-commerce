import Link from "next/link";
import styles from "./Login.module.scss";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/components/layouts/AuthLayout";

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
    <AuthLayout
      title="Login Page"
      error={error}
      link="/auth/register"
      linkText="Don't have an account? Sign up "
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Input your email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="*********"
        />

        <Button
          type="submit"
          variant="primary"
          className={styles.login__button}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
        <div className={styles.login__other}>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              signIn("google", {
                callbackUrl: callbackUrl,
                redirect: false,
              })
            }
            className={styles.login__other__button}
          >
            <i className="bx bxl-google-plus-circle" /> Login With Google
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginView;
