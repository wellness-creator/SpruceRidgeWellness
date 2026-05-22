import { NextResponse } from 'next/server'

export function apiSuccess<T>(data: T, init?: { status?: number; meta?: unknown }) {
  return NextResponse.json(
    { success: true as const, data, ...(init?.meta ? { meta: init.meta } : {}) },
    { status: init?.status ?? 200 }
  )
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string>
) {
  return NextResponse.json(
    { success: false as const, error: { code, message, ...(fields ? { fields } : {}) } },
    { status }
  )
}
