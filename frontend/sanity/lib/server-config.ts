// frontend/sanity/lib/server-config.ts
import { createClient } from '@sanity/client'

// Exporte apenas o cliente do lado do servidor
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-08-17',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})