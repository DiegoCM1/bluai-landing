import { membershipAuth } from "@/lib/firebase-client";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
export const auth = membershipAuth();
export { onAuthStateChanged };
export type { User };
export async function signInWithBluaiGoogle() {
  if (!auth) throw new Error("El acceso a cuentas no está configurado.");
  return (await signInWithPopup(auth, new GoogleAuthProvider())).user;
}
