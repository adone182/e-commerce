import Link from "next/link";
import styles from "./Register.module.scss";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
          <Input
            label="Fullname"
            name="fullname"
            type="text"
            placeholder="Input your fullname"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Input your email"
          />
          <Input
            label="Phone"
            name="phone"
            type="text"
            placeholder="Input your phone"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="********"
          />
          <Button
            type="submit"
            variant="primary"
            className={styles.register__form__button}
          >
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
      </div>
      <p className={styles.register__link}>
        Have an account? Sign in <Link href="/auth/login">here</Link>
      </p>
    </div>
  );
};

export default RegisterView;
