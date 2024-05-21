import { addData, retrieveDataByField } from "@/lib/firebase/service";
import bcrypt from "bcrypt";

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
  },
  callback: Function
) {
  try {
    const data = await retrieveDataByField("users", "email", userData.email);

    if (data.length > 0) {
      callback({ status: false, message: "Email sudah digunakan", code: 409 });
      return;
    }

    // Jika role tidak ada, set ke 'member'
    if (!userData.role) {
      userData.role = "member";
    }

    // Hash password
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.created_at = new Date();
    userData.updated_at = new Date();
    // Tambahkan dokumen baru ke koleksi 'users'
    addData("users", userData, (result: boolean) => {
      callback(result);
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    callback({
      status: false,
      message: "Terjadi kesalahan saat pendaftaran",
      code: 500,
    });
  }
}

export async function signIn(email: string) {
  try {
    // Cek apakah email sudah digunakan
    const user = await retrieveDataByField("users", "email", email);

    if (user) {
      return user[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error during sign in:", error);
    return error;
  }
}

export async function loginWithGoogle(
  data: {
    email: string;
    role?: string;
  },
  callback: Function
) {
  try {
    const user = await retrieveDataByField("users", "email", data.email);

    if (user.length > 0) {
      callback(user[0]);
    } else {
      data.role = "member";
      addData("users", data, (result: boolean) => {
        if (result) {
          callback(data);
        }
      });
    }
  } catch (error) {
    console.error("Error during sign in:", error);
    return error;
  }
}
