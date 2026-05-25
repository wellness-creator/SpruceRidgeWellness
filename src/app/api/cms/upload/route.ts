import { headers } from 'next/headers'

import { apiError, apiSuccess } from '@/lib/api/response'
import { auth } from '@/lib/auth/auth'
import { storage } from '@/lib/storage'

const MAX_BYTES = 8 * 1024 * 1024

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return apiError('unauthorized', 'Please sign in to upload images.', 401)
  }

  const form = await req.formData()
  const file = form.get('file')

  if (!(file instanceof File)) {
    return apiError('bad_request', 'No image was selected.', 400)
  }
  if (!file.type.startsWith('image/')) {
    return apiError('bad_request', 'That file is not an image.', 400)
  }
  if (file.size > MAX_BYTES) {
    return apiError('bad_request', 'Image must be smaller than 8 MB.', 400)
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const key = `cms/${crypto.randomUUID()}.${ext || 'jpg'}`

  let url: string
  try {
    const result = await storage.upload({
      key,
      body: file,
      opts: { contentType: file.type },
      bucket: 'public',
    })
    url = result.url
  } catch {
    return apiError(
      'storage_unavailable',
      'Image storage is not connected yet. You can type an image path instead for now.',
      503
    )
  }

  return apiSuccess({ key, url })
}
