export class UrlBuilder {
  private isSecure: boolean = false;
  private host: string | null = null;
  private pathSegments: string[] = [];
  private queryParams: URLSearchParams = new URLSearchParams();

  private constructor() {}

  public secure(secure: boolean): this {
    this.isSecure = secure;
    return this;
  }

  public domain(host: string): this {
    if (!host) {
      throw new Error("Host cannot be empty.");
    }

    if (host.includes("://")) {
      console.warn(
        `Host "${host}" seems to include a protocol. Only the domain/hostname (and optionally port) should be provided.`
      );
      try {
        const parsed = new URL(host);
        this.host = parsed.host;
      } catch (e) {
        this.host = host;
      }
    } else {
      this.host = host;
    }
    return this;
  }

  public path(segment: string): this {
    if (segment !== null && segment !== undefined) {
      this.pathSegments.push(segment);
    }
    return this;
  }

  public paths(...segments: string[]): this {
    segments.forEach(segment => this.path(segment));
    return this;
  }

  public param(key: string, value: string | number | boolean): this {
    if (key && value !== null && value !== undefined) {
      this.queryParams.set(key, String(value));
    }
    return this;
  }

  public params(paramsObj?: Record<string, string | number | boolean>): this {
    if (paramsObj) {
      for (const key in paramsObj) {
        if (Object.prototype.hasOwnProperty.call(paramsObj, key)) {
          this.param(key, paramsObj[key]);
        }
      }
    }
    return this;
  }

  public baseUrl(baseUrlString: string): this {
    try {
      const url = new URL(baseUrlString);

      this.isSecure = url.protocol === "https:";
      this.host = url.host;

      const basePathSegments = url.pathname.split("/").filter(Boolean);
      this.pathSegments.unshift(...basePathSegments);

      url.searchParams.forEach((value, key) => {
        if (!this.queryParams.has(key)) {
          this.queryParams.set(key, value);
        }
      });
    } catch (error) {
      if (error instanceof TypeError) {
        console.error(`Invalid base URL provided: "${baseUrlString}"`, error);
        throw new Error(`Invalid base URL format: ${baseUrlString}`);
      }
      throw error;
    }
    return this;
  }

  public build(): string {
    if (!this.host) {
      throw new Error("Host/Domain must be set before building the URL.");
    }

    const protocol = this.isSecure ? "https://" : "http://";

    const pathString = this.pathSegments
      .map(segment => segment.replace(/^\/+|\/+$/g, ""))
      .filter(segment => segment.length > 0)
      .join("/");

    let urlString = `${protocol}${this.host}`;

    if (pathString) {
      urlString += `/${pathString}`;
    }

    const queryString = this.queryParams.toString();
    if (queryString) {
      urlString += `?${queryString}`;
    }

    return urlString;
  }

  public static create(): UrlBuilder {
    return new UrlBuilder();
  }

  public static createFromBase(baseUrlString: string): UrlBuilder {
    const builder = new UrlBuilder();
    return builder.baseUrl(baseUrlString);
  }
}

export function getSearchParams<T>(
  request: Request,
  defaultSearchParams: T
): T {
  const numberKeys = new Set(["pageIndex", "pageSize"]);

  const url = new URL(request.url);
  const urlSearchParams = new URLSearchParams(url.search);
  const searchParams: Record<string, string | number> = Object.fromEntries(urlSearchParams);

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && numberKeys.has(key)) {
      searchParams[key] = Number(value);
    }
  }

  const mergedSearchParams = { ...defaultSearchParams, ...searchParams };

  return mergedSearchParams as T;
}
