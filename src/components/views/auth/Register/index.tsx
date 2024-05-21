import Link from "next/link";
import styles from "./Register.module.scss";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import authServices from "@/services/auth";
import AuthLayout from "@/components/layouts/AuthLayout";

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
      const result = await authServices.registerAccount(data);

      if (result.status === 201) {
        form.reset();
        setIsLoading(false);
        push("/auth/login");
      } else {
        setIsLoading(false);
        setError("Email is already registered");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Terjadi kesalahan saat menghubungi server. Silakan coba lagi.");
      console.error("Error during sign up:", err);
    }
  };

  return (
    <AuthLayout
      title="Register Page"
      error={error}
      link="/auth/login"
      linkText="Have an account? Sign in "
    >
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
          className={styles.register__button}
        >
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
