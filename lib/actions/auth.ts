"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ratelimit from "@/lib/rate-limit";

type Props = {
  email: string;
  password: string;
};

export const authenticate = async (params: Props) => {
  const { email, password } = params;
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect('/too-fast');

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) throw new Error(result.error);
    return result;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
