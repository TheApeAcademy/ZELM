import { supabase } from './supabase'

const BUCKET = 'zelm-media'

export function mediaUrl(storagePath: string | null | undefined): string | null {
  if (!storagePath) return null
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

export function mediaUploadPath(accountId: string, folder: string, filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg'
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${accountId}/${folder}/${unique}.${ext}`
}

export async function uploadMedia(accountId: string, folder: string, file: File) {
  const path = mediaUploadPath(accountId, folder, file.name)
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return path
}
