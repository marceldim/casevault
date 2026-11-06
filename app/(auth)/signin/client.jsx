"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { TiVendorApple } from "react-icons/ti";
import { FaGithub } from "react-icons/fa6";
import { Denk_One } from "next/font/google";
import { useRouter } from "next/navigation";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import {
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { auth, googleProvider, db } from "@/config/firebase";

const font = Denk_One({
    subsets: ["latin"],
    weight: ["400"],
});

const Client = () => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const createUserDocument = async (user) => {
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
    };

    const handleEmailSignIn = async () => {

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            await createUserDocument(result.user);

            router.push("/");

        } catch (error) {

            console.error(error);

            if (error.code === "auth/invalid-credential") {
                alert("Invalid email or password.");
            } else if (error.code === "auth/user-not-found") {
                alert("No account found with this email.");
            } else if (error.code === "auth/wrong-password") {
                alert("Incorrect password.");
            } else {
                alert("Something went wrong. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {

        try {

            setLoading(true);

            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            const user = result.user;

            await createUserDocument(user);

            router.push("/");

        } catch (error) {

            console.error(error);
            alert("Google sign-in failed.");

        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen md:min-h-dvh md:min-w-dvw flex items-center justify-center bg-[#233D4C] md:px-30 overflow-hidden w-full">

            <div className="md:min-w-md p-4 md:p-8">

                {/* Logo */}
                <h1
                    className={`text-xl font-semibold text-[#f5f5f5] md:text-3xl ${font.className} antialiased text-center`}
                >
                    Case<span className="font-bold">Vault</span>
                </h1>

                <p className="text-sm text-[#f5f5f5] text-center mt-1">
                    Sign in to your account
                </p>


                {/* Email */}
                <div>

                    <label className="block text-sm text-[#f5f5f5] mb-1 mt-5 font-semibold">
                        Email address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#55fff6] placeholder-gray-400 text-[#f5f5f5]"
                    />

                </div>


                {/* Password */}
                <div>

                    <label className="block text-sm text-[#f5f5f5] mb-1 mt-4 font-semibold">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#55fff6] placeholder-gray-400 text-[#f5f5f5]"
                    />

                </div>


                {/* Email Sign In */}
                <button
                    onClick={handleEmailSignIn}
                    disabled={loading}
                    className="w-full mt-4 rounded-md py-2 text-sm font-medium bg-[#F97316] text-[#f5f5f5] transition hover:opacity-70 cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Continue with Email"}
                </button>


                {/* Divider */}
                <div className="flex items-center my-6">

                    <div className="flex-grow border-t border-gray-600"></div>

                    <span className="mx-3 text-sm text-[#f5f5f5]">
                        or
                    </span>

                    <div className="flex-grow border-t border-gray-600"></div>

                </div>


                {/* Google */}
                <div className="mt-6 space-y-3">

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold bg-[#f5f5f5] transition cursor-pointer hover:opacity-70 duration-300 disabled:opacity-50"
                    >
                        <FcGoogle className="text-xl" />

                        <p className="text-[#233D4C]">
                            Continue with Google
                        </p>
                    </button>


                    {/* Apple */}
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold bg-[#f5f5f5] opacity-60 cursor-not-allowed"
                    >
                        <TiVendorApple className="text-xl" />

                        <p className="text-[#233D4C]">
                            Continue with Apple
                        </p>
                    </button>


                    {/* GitHub */}
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold bg-[#f5f5f5] opacity-60 cursor-not-allowed"
                    >
                        <FaGithub className="text-xl" />

                        <p className="text-[#233D4C]">
                            Continue with GitHub
                        </p>
                    </button>

                </div>


                {/* Footer */}
                <p className="text-sm text-[#f5f5f5] text-center mt-6">

                    Don't have an account?{" "}

                    <Link
                        href="/signup"
                        className="text-secondary hover:text-amber-500 cursor-pointer hover:underline duration-200"
                    >
                        Sign up
                    </Link>

                </p>

            </div>

        </main>
    );
};

export default Client;