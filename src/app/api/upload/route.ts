import { NextApiRequest, NextApiResponse } from "next";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { file, fileName } = req.body;
  try {
    const uploadResponse = await imagekit.upload({ file, fileName });
    res.status(200).json(uploadResponse);
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
}
