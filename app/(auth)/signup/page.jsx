import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function Page() {
    const session = await auth();

    if (session) {
        redirect("/");
    }

    return <Client />;
}