# s3-batch-manifest-gen-with-version-id

> format = `${bucket}/${contextPath}/` all objects

For example

- bucket: archiveBucket
- region: ap-northeast-2
- contextPath = dev/logs
- output = manifest.csv

```plaintext
bucket: archiveBucket, prefix: dev/logs/dt=20230124
bucket: archiveBucket, prefix: dev/logs/dt=20230125
```


CLI options types

```plaintext
sourceBucket: string
region: string
contextPath: string(basePath)
output: string
```

```bash
npx s3-batch-manifest-gen-with-version-id --sourceBucket=$BUCKET_NAME \
  --region=ap-northeast-2
  --output=manifest.csv \
  --contextPath=dev/logs
```
