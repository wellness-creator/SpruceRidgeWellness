import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { env } from '@/config/env'

type BucketType = 'public' | 'private'

interface ImageOptions {
  contentType?: string
  width?: number
  height?: number
  headers?: Record<string, string>
}

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit & { timeout?: number }
) => {
  const { timeout = 8000, ...rest } = init || {}
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    return await fetch(input, { ...rest, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

class StorageClient {
  private _client: SupabaseClient | null = null

  private get client(): SupabaseClient {
    if (this._client) return this._client
    if (!env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
    }
    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
    }
    this._client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
    return this._client
  }

  private get bucket(): string {
    return env.SUPABASE_STORAGE_BUCKET || 'media'
  }

  /**
   * Upload a Blob, Buffer, base64 string, or remote URL to Supabase Storage.
   * Returns the public URL of the uploaded object.
   *
   * NOTE: `bucket` is accepted for backwards compatibility with the prior R2
   * dual-bucket API but is now ignored — all objects land in the single
   * Supabase bucket configured via SUPABASE_STORAGE_BUCKET. Public/private
   * distinction is enforced by Supabase RLS + signed URLs, not bucket choice.
   */
  async upload({
    key,
    body,
    opts,
    bucket: _bucket = 'public',
  }: {
    key: string
    body: Blob | Buffer | string
    opts?: ImageOptions
    bucket?: BucketType
  }): Promise<{ url: string }> {
    let uploadBody: Blob | Uint8Array
    if (typeof body === 'string') {
      if (this.isBase64(body)) {
        uploadBody = this.base64ToBlob(body, opts)
      } else if (this.isUrl(body)) {
        uploadBody = await this.urlToBlob(body, opts)
      } else {
        throw new Error('Invalid input: Not a base64 string or a valid URL')
      }
    } else if (Buffer.isBuffer(body)) {
      uploadBody = new Uint8Array(body)
    } else {
      uploadBody = body
    }

    try {
      const { error } = await this.client.storage.from(this.bucket).upload(key, uploadBody, {
        contentType: opts?.contentType,
        upsert: true,
      })
      if (error) throw error
    } catch (error) {
      console.error('storage.upload failed', error)
      throw new Error('Failed to upload file. Please try again later.')
    }

    return { url: this.publicUrl(key) }
  }

  async delete({ key }: { key: string; bucket?: BucketType }): Promise<void> {
    try {
      const { error } = await this.client.storage.from(this.bucket).remove([key])
      if (error) throw error
    } catch (error) {
      console.error('storage.delete failed', error)
      throw new Error('Failed to delete file. Please try again later.')
    }
  }

  async getSignedUrl({
    key,
    method,
    expiresIn,
  }: {
    key: string
    method: 'PUT' | 'GET'
    bucket?: BucketType
    expiresIn: number
  }): Promise<string> {
    try {
      if (method === 'PUT') {
        const { data, error } = await this.client.storage
          .from(this.bucket)
          .createSignedUploadUrl(key)
        if (error || !data) throw error
        return data.signedUrl
      }
      const { data, error } = await this.client.storage
        .from(this.bucket)
        .createSignedUrl(key, expiresIn)
      if (error || !data) throw error
      return data.signedUrl
    } catch (error) {
      console.error('storage.getSignedUrl failed', error)
      throw new Error('Failed to generate signed url. Please try again later.')
    }
  }

  async getSignedUploadUrl(opts: { key: string; bucket?: BucketType; expiresIn?: number }) {
    return this.getSignedUrl({
      key: opts.key,
      method: 'PUT',
      expiresIn: opts.expiresIn ?? 600,
    })
  }

  async getSignedDownloadUrl(opts: { key: string; bucket?: BucketType; expiresIn?: number }) {
    return this.getSignedUrl({
      key: opts.key,
      method: 'GET',
      expiresIn: opts.expiresIn ?? 600,
    })
  }

  publicUrl(key: string): string {
    if (!env.NEXT_PUBLIC_SUPABASE_URL) return key
    return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${this.bucket}/${key}`
  }

  private base64ToBlob(base64: string, opts?: ImageOptions): Blob {
    const base64Data = base64.replace(/^data:.+;base64,/, '')
    const padded = base64Data.padEnd(
      base64Data.length + ((4 - (base64Data.length % 4)) % 4),
      '='
    )
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return opts?.contentType ? new Blob([bytes], { type: opts.contentType }) : new Blob([bytes])
  }

  private isBase64(str: string): boolean {
    const dataImageRegex =
      /^data:image\/[a-zA-Z0-9.+-]+;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
    return dataImageRegex.test(str) || base64Regex.test(str)
  }

  private isUrl(str: string): boolean {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  private async urlToBlob(url: string, opts?: ImageOptions): Promise<Blob> {
    let response: Response
    if (opts?.height || opts?.width) {
      try {
        const proxyUrl = new URL('https://wsrv.nl')
        proxyUrl.searchParams.set('url', url)
        if (opts.width) proxyUrl.searchParams.set('w', String(opts.width))
        if (opts.height) proxyUrl.searchParams.set('h', String(opts.height))
        proxyUrl.searchParams.set('fit', 'cover')
        response = await fetchWithTimeout(proxyUrl.toString())
      } catch {
        response = await fetch(url)
      }
    } else {
      response = await fetch(url)
    }
    if (!response.ok) throw new Error(`Failed to fetch URL: ${response.statusText}`)
    const blob = await response.blob()
    return opts?.contentType ? new Blob([blob], { type: opts.contentType }) : blob
  }
}

export const storage = new StorageClient()

export const publicStorageUrl = (key: string): string => storage.publicUrl(key)

export const isStored = (url: string): boolean => {
  if (!env.NEXT_PUBLIC_SUPABASE_URL) return false
  const bucket = env.SUPABASE_STORAGE_BUCKET || 'media'
  return url.startsWith(`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`)
}

export const isNotHostedImage = (imageString: string): boolean =>
  !imageString.startsWith('https://')
