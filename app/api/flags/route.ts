import { NextResponse } from "next/server"
import { getFeatureFlags, updateFeatureFlag } from "@/lib/api"

export async function GET() {
  try {
    const flags = await getFeatureFlags()
    return NextResponse.json({ success: true, data: flags })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    await updateFeatureFlag(id, data)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


