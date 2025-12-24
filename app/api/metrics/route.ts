import { NextResponse } from "next/server"
import { getPlatformMetrics, getCostBreakdown, getRevenueByTier } from "@/lib/api"

export async function GET() {
  try {
    const [metrics, costBreakdown, revenueBreakdown] = await Promise.all([
      getPlatformMetrics(),
      getCostBreakdown(),
      getRevenueByTier(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        costBreakdown,
        revenueBreakdown,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


