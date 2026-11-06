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

const inputClass =
    "w-full rounded-md border border-gray-400 bg-transparent px-3 py-2.5 text-base sm:text-sm text-[#f5f5f5] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#55fff6]";

const socialBtnClass =
    "w-full flex items-center justify-center gap-2 rounded-full bg-[#f5f5f5] py-2.5 text-sm font-semibold opacity-60 cursor-not-allowed";

const getErrorMessage = (code) => {
    switch (code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
            return "Invalid email or password.";
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/too-many-requests":
            return "Too many attempts. Please wait a moment and try again.";
        case "auth/network-request-failed":
            return "Network error. Check your connection and try again.";
        default:
            return "Something went wrong. Please try again.";
    }
};

const Client = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createUserDocument = async (user) => {
        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                lastLoginAt: serverTimestamp(),
            },
            { merge: true }
        );
    };

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
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
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    // Kept for when you enable Google sign-in
    const handleGoogleSignIn = async () => {
        setError("");

        try {
            setLoading(true);

            const result = await signInWithPopup(auth, googleProvider);

            await createUserDocument(result.user);

            router.push("/");
        } catch (err) {
            console.error(err);
            setError("Google sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-dvh w-full flex items-center justify-center bg-[#233D4C] px-4 py-8 sm:px-6">

            <div className="w-full max-w-md sm:p-8">

                {/* Logo */}
                <h1
                    className={`text-2xl sm:text-3xl font-semibold text-[#f5f5f5] ${font.className} antialiased text-center`}
                >
                    Case<span className="font-bold">Vault</span>
                </h1>

                <p className="text-sm text-[#f5f5f5] text-center mt-1">
                    Sign in to your account
                </p>

                <form onSubmit={handleEmailSignIn} noValidate>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm text-[#f5f5f5] mb-1 mt-5 font-semibold"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@email.com"
                            className={inputClass}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm text-[#f5f5f5] mb-1 mt-4 font-semibold"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={inputClass}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p role="alert" className="mt-4 text-sm text-red-300">
                            {error}
                        </p>
                    )}

                    {/* Email Sign In */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 rounded-md py-2.5 text-sm font-medium bg-[#F97316] text-[#f5f5f5] transition hover:opacity-70 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Continue with Email"}
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="grow border-t border-gray-600"></div>
                    <span className="mx-3 text-sm text-[#f5f5f5]">or</span>
                    <div className="grow border-t border-gray-600"></div>
                </div>

                {/* Social */}
                <div className="space-y-3">

                    <button
                        type="button"
                        //onClick={handleGoogleSignIn}
                        disabled
                        className={socialBtnClass}
                    >
                        <FcGoogle className="text-xl" />
                        <span className="text-[#233D4C]">
                            Continue with Google
                        </span>
                    </button>

                    <button type="button" disabled className={socialBtnClass}>
                        <TiVendorApple className="text-xl" />
                        <span className="text-[#233D4C]">
                            Continue with Apple
                        </span>
                    </button>

                    <button type="button" disabled className={socialBtnClass}>
                        <FaGithub className="text-xl" />
                        <span className="text-[#233D4C]">
                            Continue with GitHub
                        </span>
                    </button>

                </div>

                {/* Footer */}
                <p className="text-sm text-[#f5f5f5] text-center mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-[#F97316] hover:text-amber-500 hover:underline duration-200"
                    >
                        Sign up
                    </Link>
                </p>

            </div>

        </main>
    );
};

export default Client;