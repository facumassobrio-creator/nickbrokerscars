const DEFAULT_MAX_SIDE = 1600;
const DEFAULT_QUALITY = 0.78;
const OUTPUT_MIME_TYPE = "image/webp";
const EXTRA_IMAGES_BATCH_SIZE = 2;

type OptimizeImageOptions = {
  maxSide?: number;
  quality?: number;
  outputType?: "image/webp";
};

type ImageOptimizationResult = {
  file: File;
};

function isValidImageFile(file: File): boolean {
  return file instanceof File && typeof file.type === "string" && file.type.startsWith("image/") && file.size > 0;
}

function calculateTargetSize(width: number, height: number, maxSide: number): { width: number; height: number } {
  const largestSide = Math.max(width, height);
  if (largestSide <= maxSide) {
    return { width, height };
  }

  const scale = maxSide / largestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

type DecodedImage = {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  close: () => void;
};

async function fileToDecodedImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    return {
      width: bitmap.width,
      height: bitmap.height,
      draw: (ctx, width, height) => {
        ctx.drawImage(bitmap, 0, 0, width, height);
      },
      close: () => bitmap.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = objectUrl;
  });

  return {
    width: imageElement.naturalWidth,
    height: imageElement.naturalHeight,
    draw: (ctx, width, height) => {
      ctx.drawImage(imageElement, 0, 0, width, height);
    },
    close: () => URL.revokeObjectURL(objectUrl),
  };
}

function blobToFile(blob: Blob, originalName: string): File {
  const safeBaseName = originalName.replace(/\.[^.]+$/, "") || "image";
  const normalizedName = safeBaseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileExtension =
    blob.type === "image/jpeg" ? "jpg" : blob.type === "image/png" ? "png" : "webp";
  const finalName = `${normalizedName}.${fileExtension}`;
  return new File([blob], finalName, {
    type: blob.type || OUTPUT_MIME_TYPE,
    lastModified: Date.now(),
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

async function exportCanvasWithFallback(canvas: HTMLCanvasElement, preferredType: string, quality: number): Promise<Blob> {
  const mimeCandidates = [preferredType, "image/jpeg", "image/png"].filter(
    (value, index, arr) => arr.indexOf(value) === index
  );

  for (const mimeType of mimeCandidates) {
    const blob = await canvasToBlob(canvas, mimeType, quality);
    if (blob) {
      return blob;
    }
  }

  throw new Error("No se pudo exportar la imagen");
}

export async function optimizeImageFile(file: File, options: OptimizeImageOptions = {}): Promise<ImageOptimizationResult> {
  if (!isValidImageFile(file)) {
    throw new Error(`Archivo inválido: ${file?.name || "sin_nombre"}`);
  }

  const maxSide = options.maxSide ?? DEFAULT_MAX_SIDE;
  const quality = options.quality ?? DEFAULT_QUALITY;
  const outputType = options.outputType ?? OUTPUT_MIME_TYPE;

  const image = await fileToDecodedImage(file);

  try {
    const targetSize = calculateTargetSize(image.width, image.height, maxSide);
    const canvas = document.createElement("canvas");
    canvas.width = targetSize.width;
    canvas.height = targetSize.height;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("No se pudo inicializar canvas");
    }

    image.draw(ctx, targetSize.width, targetSize.height);

    const optimizedBlob = await exportCanvasWithFallback(canvas, outputType, quality);

    const resized = targetSize.width !== image.width || targetSize.height !== image.height;
    const shouldKeepOriginal = !resized && optimizedBlob.size >= file.size * 0.98;

    if (shouldKeepOriginal) {
      return { file };
    }

    return {
      file: blobToFile(optimizedBlob, file.name),
    };
  } finally {
    image.close();
  }
}

export type OptimizeUploadBatchResult = {
  primaryImage: File | null;
  extraImages: File[];
  warnings: string[];
};

export async function optimizeVehicleUploadImages(input: {
  primaryImage: File | null;
  extraImages: File[];
  options?: OptimizeImageOptions;
}): Promise<OptimizeUploadBatchResult> {
  const warnings: string[] = [];
  let optimizedPrimaryImage: File | null = null;
  const optimizedExtraImages = new Array<File | null>(input.extraImages.length).fill(null);

  if (input.primaryImage) {
    try {
      const result = await optimizeImageFile(input.primaryImage, input.options);
      optimizedPrimaryImage = result.file;
    } catch (error) {
      const message = error instanceof Error ? error.message : "error desconocido";
      warnings.push(`No se pudo procesar la imagen principal (${message}).`);
    }
  }

  for (let batchStart = 0; batchStart < input.extraImages.length; batchStart += EXTRA_IMAGES_BATCH_SIZE) {
    const batch = input.extraImages.slice(batchStart, batchStart + EXTRA_IMAGES_BATCH_SIZE);

    await Promise.all(
      batch.map(async (image, batchIndex) => {
        const index = batchStart + batchIndex;
        try {
          const result = await optimizeImageFile(image, input.options);
          optimizedExtraImages[index] = result.file;
        } catch (error) {
          const message = error instanceof Error ? error.message : "error desconocido";
          warnings.push(`No se pudo procesar la imagen adicional ${index + 1} (${message}).`);
        }
      })
    );
  }

  return {
    primaryImage: optimizedPrimaryImage,
    extraImages: optimizedExtraImages.filter((image): image is File => image instanceof File),
    warnings,
  };
}