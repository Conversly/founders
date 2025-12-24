import { NextResponse } from "next/server"
import { getSubscriptionPlans } from "@/lib/api"

export async function GET() {
  try {
    const plans = await getSubscriptionPlans()
    return NextResponse.json({ success: true, data: plans })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


