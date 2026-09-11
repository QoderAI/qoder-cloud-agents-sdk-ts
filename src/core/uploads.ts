export type Uploadable = Blob | Uint8Array | ArrayBuffer | Response | AsyncIterable<Uint8Array | string> | ReadableStream<Uint8Array> | { data: Uploadable; name?: string; type?: string };

export async function toFile(input: Uploadable | string, name?: string, options?: FilePropertyBag): Promise<File> {
  if (typeof input === 'object' && input !== null && 'data' in input) {
    return toFile(input.data, name ?? input.name, { type: input.type, ...options });
  }
  if (input instanceof Response) {
    const filename = input.url ? new URL(input.url).pathname.split('/').pop() : undefined;
    return toFile(await input.blob(), name ?? filename, options);
  }
  if (input instanceof Blob) {
    return new File([input], name ?? (input as File).name ?? 'upload', { type: input.type, ...options });
  }
  if (typeof input === 'string' || input instanceof ArrayBuffer || input instanceof Uint8Array) {
    const part = input instanceof Uint8Array ? new Uint8Array(input).buffer : input;
    return new File([part], name ?? 'upload', options);
  }
  const chunks: BlobPart[] = [];
  if (input instanceof ReadableStream) {
    const reader = input.getReader();
    try {
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        chunks.push(new Uint8Array(result.value).buffer);
      }
    } finally { reader.releaseLock(); }
  } else {
    for await (const chunk of input) chunks.push(typeof chunk === 'string' ? chunk : new Uint8Array(chunk).buffer);
  }
  return new File(chunks, name ?? 'upload', options);
}

/** File tree names and repeated `files` parts match the Go multipart encoder. */
export async function toMultipartForm(params: object): Promise<FormData> {
  const form = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (key === 'file' || key === 'files') {
      const items = Array.isArray(value) ? value : [value];
      for (const item of items) {
        const file = await toFile(item);
        form.append(key, file, file.name);
      }
    } else {
      form.append(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }
  return form;
}
