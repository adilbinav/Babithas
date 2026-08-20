// Supabase Production Credentials - Insert your credentials below to go live!
// If left as default, the website automatically falls back to localStorage prototype mode.
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

window.supabaseInstance = null;
window.useSupabase = false;

if (SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
  try {
    window.supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.useSupabase = true;
    console.log("Supabase database connected successfully!");
  } catch (e) {
    console.error("Supabase failed to initialize, falling back to localStorage", e);
  }
} else {
  console.log("Supabase credentials not configured. Running in localStorage prototype mode.");
}

// Convert Base64 string back to binary Blob (used for client-side image compression preview)
function base64ToBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
}
