declare module "node-exiftool" {
  export class ExiftoolProcess {
    constructor(exiftoolPath?: string);
    open(): Promise<void>;
    close(): Promise<void>;
    writeMetadata(
      file: string,
      tags: Record<string, string | string[]>,
      args?: string[]
    ): Promise<void>;
  }
}

declare module "dist-exiftool" {
  const path: string;
  export default path;
}

