import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

let _client: S3Client | undefined;

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: process.env.S3_REGION ?? "auto",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return _client;
}

/**
 * Upload a file buffer to R2/S3 and return its public URL.
 * Requires STORAGE_PUBLIC_URL env var set to your R2 public bucket URL
 * (e.g. https://pub-xxx.r2.dev or your custom domain).
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const baseUrl = (process.env.STORAGE_PUBLIC_URL ?? "").replace(/\/$/, "");
  return `${baseUrl}/${key}`;
}
