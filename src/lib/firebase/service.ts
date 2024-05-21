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

export async function retrieveDataByField(
  collectionName: string,
  field: string,
  value: string
) {
  const q = query(
    collection(firestore, collectionName),
    where(field, "==", value)
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return data;
}

export async function addData(
  collectionName: string,
  data: any,
  callback: Function
) {
  try {
    await addDoc(collection(firestore, collectionName), data);
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
