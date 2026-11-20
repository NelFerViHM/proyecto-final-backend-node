import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    doc
} from "firebase/firestore";

const productsCollection = collection(db, "products");

export const getAllProducts = async () => {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const getProductById = async (id) => {
    const productRef = doc(db, "products", id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
};

export const createProduct = async (productData) => {
    const docRef = await addDoc(productsCollection, productData);
    return {
        id: docRef.id,
        ...productData
    };
};

export const deleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
        return false;
    }

    await deleteDoc(productRef);
    return true;
};
