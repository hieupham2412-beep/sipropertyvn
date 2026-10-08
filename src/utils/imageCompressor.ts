/**
 * Image Compressor & Optimizer Utility
 * Ensures uploaded images never exceed Firestore document limits (1MB) or localStorage quota (5MB).
 * Converts raw multi-megabyte camera/phone photos into crisp ~30-50KB web-optimized JPEGs.
 */

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
  gender: 'nam' | 'nu' | 'badge';
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'male-1',
    name: 'Giám Đốc Nam - Vest Đen',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    gender: 'nam',
  },
  {
    id: 'male-2',
    name: 'Chuyên Viên Nam - Vest Xanh Navy',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    gender: 'nam',
  },
  {
    id: 'male-3',
    name: 'Quản Lý Nam - Phong Thái Tự Tin',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    gender: 'nam',
  },
  {
    id: 'male-4',
    name: 'Tư Vấn Viên Nam - Thân Thiện',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    gender: 'nam',
  },
  {
    id: 'female-1',
    name: 'Giám Đốc Nữ - Vest Trắng Sang Trọng',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    gender: 'nu',
  },
  {
    id: 'female-2',
    name: 'Quản Lý Nữ - Nụ Cười Rạng Rỡ',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    gender: 'nu',
  },
  {
    id: 'female-3',
    name: 'Chuyên Viên Nữ - Vest Đen Chuyên Nghiệp',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    gender: 'nu',
  },
  {
    id: 'female-4',
    name: 'Tư Vấn Viên Nữ - Tận Tâm',
    url: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=600&q=80',
    gender: 'nu',
  },
];

/**
 * Compresses an image File or Data URL to a maximum dimension and quality.
 * Returns a lightweight data:image/jpeg base64 string.
 */
export async function compressImage(
  source: File | string,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.8
): Promise<string> {
  // If it's a web URL (http/https), keep as is
  if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
    return source;
  }

  return new Promise((resolve, reject) => {
    let dataUrlPromise: Promise<string>;

    if (source instanceof File) {
      dataUrlPromise = new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(source);
      });
    } else {
      dataUrlPromise = Promise.resolve(source);
    }

    dataUrlPromise
      .then((dataUrl) => {
        const img = new Image();
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Scale down proportionally
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as JPEG with controlled quality
          const compressed = canvas.toDataURL('image/jpeg', quality);
          console.log(
            `[ImageCompressor] Original size: ~${Math.round(dataUrl.length / 1024)}KB -> Compressed: ~${Math.round(compressed.length / 1024)}KB`
          );
          resolve(compressed);
        };

        img.onerror = () => {
          console.warn('[ImageCompressor] Could not load image for compression, falling back to original');
          resolve(dataUrl);
        };

        img.src = dataUrl;
      })
      .catch((err) => {
        console.error('[ImageCompressor] Error reading file:', err);
        reject(err);
      });
  });
}
