import {
  S3Client,
  ListObjectVersionsCommand,
  ListObjectVersionsCommandOutput,
  ObjectVersion,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import minimist from 'minimist';

async function list(
  Bucket: string,
  Prefix: string,
  MaxKeys = 1000,
  NextKeyMarker: string | null | undefined,
  client: S3Client,
) {
  const command = new ListObjectVersionsCommand({
    Bucket,
    Prefix,
    MaxKeys,
    ...(NextKeyMarker != null
      ? {
        KeyMarker: NextKeyMarker,
      }
      : {}),
  });

  return client.send(command);
}

export async function main() {
  // cli options
  // --region
  // --sourceBucket
  // --contextPath
  // --output
  const args = minimist(process.argv.slice(2), {
    string: ['sourceBucket', 'region', 'contextPath', 'output'],
  });
  const { sourceBucket, region, contextPath, output } = args;
  const client = new S3Client({
    region
  });

  let hasMoreFiles: boolean | undefined = false;
  let KeyMarker: string | undefined | null = null;
  const stream = fs.createWriteStream(output, { flags: 'a' });

  const prefix = `${contextPath}`;

  console.log(`bucket: ${sourceBucket}, prefix: ${prefix}`);
  do {
    const response: ListObjectVersionsCommandOutput = await list(
      sourceBucket,
      prefix,
      1000,
      KeyMarker,
      client,
    );
    response?.Versions?.forEach((objectVersion: ObjectVersion) => {
      stream.write(`${objectVersion.LastModified},${objectVersion.Key},${objectVersion.VersionId}\r\n`);
    });
    hasMoreFiles = response.IsTruncated;
    KeyMarker = hasMoreFiles ? response.NextKeyMarker : null;
  } while (hasMoreFiles);

  stream.end();
  console.log('done');
}
