import "./backend";

declare module "./backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
  }
  interface Backend {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
  }
}
