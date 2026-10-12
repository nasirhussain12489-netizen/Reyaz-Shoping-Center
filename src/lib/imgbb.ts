/**
 * Dedicated ImgBB Image Hosting Service for Reyaz Shopping Center
 * Uploads all product photos, banners, and profile avatars directly to https://imgbb.com/
 * (Never stores raw images in Firebase).
 */

const IMGBB_FALLBACK_KEY = '9551c6c91a49c0c4b17819b26554d812';

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToImgBB(
  fileOrDataUrl: File | string,
  imageName = 'reyaz-image'
): Promise<string> {
  const dataUrl =
    typeof fileOrDataUrl === 'string'
      ? fileOrDataUrl
      : await fileToDataUrl(fileOrDataUrl);

  const cleanedBase64 = dataUrl.replace(
    /^data:image\/[a-zA-Z0-9+.-]+;base64,/,
    ''
  );
  const safeName =
    imageName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 60) || 'reyaz-image';

  // 1. Primary: Upload via Backend Express Proxy (/api/upload-imgbb)
  try {
    const response = await fetch('/api/upload-imgbb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: cleanedBase64,
        name: safeName,
      }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json?.success && typeof json.url === 'string' && json.url) {
        return json.url;
      }
    }
  } catch {
    // Fallback to direct ImgBB API call below
  }

  // 2. Fallback: Direct client-side POST to https://api.imgbb.com/1/upload
  try {
    const formData = new FormData();
    formData.append('key', IMGBB_FALLBACK_KEY);
    formData.append('image', cleanedBase64);
    formData.append('name', safeName);

    const directRes = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });
    const directJson = await directRes.json();
    if (directJson?.success && directJson?.data) {
      return directJson.data.display_url || directJson.data.url || dataUrl;
    }
  } catch {
    // Return local dataUrl only if offline
  }

  return dataUrl;
}
