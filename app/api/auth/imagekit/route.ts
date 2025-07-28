import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

const {
  imagekit: { publicKey, privateKey, urlEndpoint },
} = config;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export async function GET() {
  const authParams = imagekit.getAuthenticationParameters();
  return NextResponse.json(authParams);
}
