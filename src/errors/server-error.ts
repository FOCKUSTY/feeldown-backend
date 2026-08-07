export class ServerError {
  public constructor(
    public readonly response: string | Record<string, unknown>,
    public readonly status: number,
    public readonly options?: { cause?: unknown; description?: string },
  ) {}
}
