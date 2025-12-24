import { NextResponse } from "next/server"
import { getAccounts } from "@/lib/api"

export async function GET() {
  try {
    const accounts = await getAccounts()
    return NextResponse.json({ success: true, data: accounts })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


