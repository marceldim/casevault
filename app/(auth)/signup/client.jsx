'use client'
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { TiVendorApple } from "react-icons/ti";
import { FaGithub } from "react-icons/fa6";
import { Denk_One } from "next/font/google";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/config/firebase";

const font = Denk_One({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Client() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: "",
                photoURL: "",
                createdAt: serverTimestamp(),
            });

            router.push("/");
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSignUp = async () => {
        try {
            setLoading(true);

            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            const user = result.user;

            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || "",
                    photoURL: user.photoURL || "",
                    createdAt: serverTimestamp(),
                },
                { merge: true }
            );

            router.push("/");

        } catch (error) {
            console.error(error);
            alert("Google sign-up failed.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='min-h-screen md:min-h-dvh min-w-dvw flex items-center justify-center bg-[#233D4C] md:px-30 overflow-hidden'>
            <div className="md:min-w-md md:p-8 p-4">
                <h1 className={`text-xl font-semibold text-[#f5f5f5] md:text-3xl ${font.className} antialiased text-center`} alt='logo'>Case<span className='font-bold'>Vault</span></h1>

                <p className="text-sm text-[#f5f5f5] text-center mt-2 max-md:text-xs">
                    Join CaseVault to explore and contribute case studies
                </p>
                <form onSubmit={handleSignup} className="space-y-4 mt-5">
                    <div>
                        <label className="block text-sm text-[#f5f5f5] mb-1 font-semibold">
                            Email address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@email.com"
                            className="w-full border rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-[#55fff6] border-gray-500 placeholder-gray-400 text-[#f5f5f5]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[#f5f5f5] md:mb-2 mt-2 font-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            className="w-full border rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-[#55fff6] placeholder-gray-400 border-gray-500 text-[#f5f5f5]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 rounded-md py-2 text-sm font-medium bg-[#F97316] text-[#f5f5f5] transition hover:opacity-70 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Create an account"}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-500"></div>
                    <span className="mx-3 text-xs text-[#f5f5f5]">or</span>
                    <div className="flex-grow border-t border-gray-500"></div>
                </div>
                <div className="mt-6 space-y-3">
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold bg-[#f5f5f5] transition cursor-pointer hover:opacity-70 duration-300 disabled:opacity-50"
                    >
                        <FcGoogle className='text-xl' />
                        <p className='text-[#233D4C]'>Continue with Google</p>
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold bg-[#f5f5f5] transition cursor-pointer hover:opacity-70 duration-300">
                        <TiVendorApple className='text-xl' />
                        <p className='text-[#233D4C]'>Continue with Apple </p>
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold bg-[#f5f5f5] transition cursor-pointer hover:opacity-70 duration-300">
                        <FaGithub className='text-xl' />
                        <p className='text-[#233D4C]'>Continue with GitHub</p>
                    </button>

                </div>
                <p className="text-sm text-[#f5f5f5] text-center mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/signin"
                        className="text-secondary hover:text-amber-500 cursor-pointer hover:underline duration-200"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    )
}