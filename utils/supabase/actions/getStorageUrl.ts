
const SUPABASE_URL = process.env.VITE_SUPABASE_URL

/**
 * 
 * @param category "math" or "english" eventually; "math" only for now
 * @param fileName name of file (file index), no extension
 * @param fileType extension of the file expected (png or jpeg)
 * @returns string: supabase URL concatenated from inputs
 */
export default function getStorageUrl(category: string, fileName: string, fileType: string) {

  return `${SUPABASE_URL}/storage/v1/object/public/questions/${category}/${fileName}.${fileType}`

  // https://ulkvsrwaqlwowvjsnjwu.supabase.co/storage/v1/object/sign/questions/math/1000.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJxdWVzdGlvbnMvbWF0aC8xMDAwLnBuZyIsImlhdCI6MTczMDMxNzU3NywiZXhwIjoxNzMwOTIyMzc3fQ.lgdhQVsDnFtMacYO0hF13qdEjIU-IpQWLH6kVm1b0aY&t=2024-10-30T19%3A46%3A17.936Z

}