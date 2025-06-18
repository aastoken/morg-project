import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import config from '../../../../morg_config/config.json';

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const encodedPath = url.searchParams.get("path")

  if (!encodedPath) {
    return new NextResponse("Missing file path", { status: 400 })
  }

  const decodedPath = decodeURIComponent(encodedPath)
  console.log("Decoded path: "+decodedPath)

  // Optional: restrict access to a specific root directory
  const BASE_DIR = config.library_root
  if (!decodedPath.startsWith(BASE_DIR)) {
    return new NextResponse("Access denied - wrong path", { status: 403 })
  }

  try {
    const stat = fs.statSync(decodedPath)
    const stream = fs.createReadStream(decodedPath)

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": stat.size.toString(),
        "Accept-Ranges": "bytes",
      },
    })
  } catch (err) {
    console.error("File read error:", err)
    return new NextResponse("File not found", { status: 404 })
  }
}