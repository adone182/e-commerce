import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string) {
  try {
    const snapshot = await getDocs(collection(firestore, collectionName));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return [];
  }
}

export async function retrieveDataById(collectionName: string, id: string) {
  try {
    const docRef = doc(firestore, collectionName, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      console.error("No document found with the given ID");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving data by ID:", error);
    return null;
  }
}

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
  },
  callback: Function
) {
  try {
    // Cek apakah email sudah digunakan
    const q = query(
      collection(firestore, "users"),
      where("email", "==", userData.email)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
    // Tambahkan dokumen baru ke koleksi 'users'
    await addDoc(collection(firestore, "users"), userData);
    callback({ status: true, message: "Pendaftaran berhasil", code: 201 });
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
    const q = query(
      collection(firestore, "users"),
      where("email", "==", email)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (data) {
      return data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error during sign in:", error);
    return error;
  }
}
