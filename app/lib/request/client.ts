import { authResponseInterceptor } from "./auth";
import { UrlBuilder } from "#/lib";
export interface RequestConfig {
  url: string;
  method: string;
  data?: any;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  responseType?: "object" | "raw" | "data";
  enableLog?: boolean;
}

export interface ApiClientConfigBase extends Partial<RequestConfig> {
  baseUrl: string;
  successCodes?: number[];
  interceptors?: {
    authRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
    request?: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>>;
    response?: Array<(response: any) => any | Promise<any>>;
    rawResponse?: Array<(response: Response) => Response | Promise<Response>>;
  };
  messageHandler?: (message: string) => any;
}

export interface ResponseFields {
  code: string;
  message: string;
  data: string;
}

export type ApiClientConfig =
  | (ApiClientConfigBase & {
    responseType: "object" | "raw";
    responseFields?: ResponseFields;
  })
  | (ApiClientConfigBase & {
    responseType: "data";
    responseFields: ResponseFields;
  });

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseUrl: process.env.API_BASE_URL || "http://localhost:8082/api",
      responseType: "data",
      responseFields: {
        code: "code",
        message: "message",
        data: "data"
      },
      withCredentials: true,
      successCodes: [0, 200],
      interceptors: {
        request: [],
        response: []
      },
      ...(config || {})
    };
  }

  private shouldSerializeBody(data: any): boolean {
    return data && 
           !(data instanceof FormData) && 
           !(data instanceof ReadableStream) &&
           !(data instanceof Blob) &&
           !(data instanceof ArrayBuffer) &&
           !(data instanceof URLSearchParams);
  }

  private prepareRequestBody(data: any, method: string): BodyInit | undefined {
    if (!data || method === "GET") {
      return undefined;
    }

    if (this.shouldSerializeBody(data)) {
      return JSON.stringify(data);
    }

    return data as BodyInit;
  }

  private setContentTypeHeader(headers: Record<string, string>, data: any): void {
    // 如果是FormData、Blob等，让浏览器自动设置Content-Type
    if (data instanceof FormData || data instanceof Blob) {
      delete headers["Content-Type"];
    } else if (this.shouldSerializeBody(data)) {
      headers["Content-Type"] = "application/json";
    }
  }

  async request<T>(config: RequestConfig): Promise<T> {
    // await sleep(Math.random() * 1000 + 500)
    let processedConfig: RequestConfig = {
      withCredentials: this.config.withCredentials,
      ...config
    };

    processedConfig.headers = {
      "Content-Type": "application/json",
      ...(processedConfig.headers || {})
    };

    // 根据数据类型调整Content-Type
    this.setContentTypeHeader(processedConfig.headers, processedConfig.data);

    if (this.config.interceptors?.authRequest && processedConfig.withCredentials) {
      processedConfig = await this.config.interceptors.authRequest(processedConfig);
    }

    if (this.config.interceptors?.request) {
      for (const interceptor of this.config.interceptors.request) {
        processedConfig = await interceptor(processedConfig);
      }
    }

    const url = UrlBuilder.create()
      .baseUrl(this.config.baseUrl)
      .path(processedConfig.url)
      .params(processedConfig.params)
      .build();

    const requestBody = this.prepareRequestBody(processedConfig.data, processedConfig.method);

    const fetchOptions: RequestInit = {
      method: processedConfig.method,
      headers: processedConfig.headers,
      credentials: processedConfig.withCredentials ? "include" : "same-origin",
      body: requestBody
    };

    const requestInfo = `
${processedConfig.method} ${url}
request: ${JSON.stringify({ 
  ...fetchOptions, 
  body: this.shouldSerializeBody(processedConfig.data) ? processedConfig.data : '[Binary Data]'
}, null, 2)}
`;

    const startTime = performance.now();
    let rawResponse: Response = await fetch(url, fetchOptions);

    if (processedConfig.enableLog) {
      console.log(`${processedConfig.method} ${url} response status: ${rawResponse.status} ${rawResponse.statusText}`);
    }
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100) {
      console.warn(`Slow request detected: ${processedConfig.method} ${url} took ${duration.toFixed(2)}ms`);
    }

    const serializableMetadata: {
      ok: boolean;
      status: number;
      statusText: string;
      url: string;
      redirected: boolean;
      headers: Record<string, string>;
      body?: any;
    } = {
      ok: rawResponse.ok,
      status: rawResponse.status,
      statusText: rawResponse.statusText,
      url: rawResponse.url,
      redirected: rawResponse.redirected,
      headers: {}
    };

    for (const [key, value] of rawResponse.headers.entries()) {
      serializableMetadata.headers[key] = value;
    }

    if (this.config.interceptors?.rawResponse) {
      for (const interceptor of this.config.interceptors.rawResponse) {
        rawResponse = await interceptor(rawResponse);
      }
    }

    const responseType = processedConfig.responseType || this.config.responseType;

    if (responseType === "raw") {
      let processedResponse = rawResponse;
      if (this.config.interceptors?.response) {
        for (const interceptor of this.config.interceptors.response) {
          processedResponse = await interceptor(processedResponse);
        }
      }
      return processedResponse as T;
    }

    let data;
    const contentType = rawResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await rawResponse.json();
    } else if (contentType && contentType.includes("text/plain")) {
      data = await rawResponse.text();
    } else {
      throw new Error("Unsupported response type");
    }

    serializableMetadata.body = data;
    const responseInfo = `response: ${JSON.stringify(serializableMetadata, null, 2)}`;
    
    if (config.enableLog) {
      console.log(requestInfo);
      console.log(responseInfo);
    }

    // 如果responseType为object，则直接返回data
    if (responseType === "object") {
      return data as T;
    }

    let processedResponse = data;
    if (this.config.interceptors?.response) {
      for (const interceptor of this.config.interceptors.response) {
        processedResponse = await interceptor(processedResponse);
      }
    }

    if (responseType === "data") {
      const responseFields = this.config.responseFields;
      if (!responseFields) {
        throw new Error("responseFields is required for responseType: data");
      }

      const { code: codeField, message: messageField, data: dataField } = responseFields;

      if (data && typeof data === "object" && codeField && codeField in data) {
        const codeValue = data[codeField];

        let dataValue = dataField && dataField in data ? data[dataField] : undefined;

        if (this.config.successCodes?.includes(Number(codeValue))) {
          return dataValue as T;
        } else {
          if (!config.enableLog) {
            console.error(requestInfo);
            console.error(responseInfo);
          }
          console.error(`
${fetchOptions.method} ${url} failed
message: ${data[messageField]}
responsedata: ${JSON.stringify(data)}
`);
          throw new Error(data[messageField]);
        }
      }

      throw new Error("Invalid response format");
    }

    throw new Error(`Invalid response type: ${responseType}`);
  }

  async get<T>(url: string, config?: Omit<RequestConfig, "url" | "method">): Promise<T> {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  async post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, "url" | "method" | "data">): Promise<T> {
    return this.request<T>({ ...config, url, method: "POST", data });
  }

  async put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, "url" | "method" | "data">): Promise<T> {
    return this.request<T>({ ...config, url, method: "PUT", data });
  }

  async delete<T = any>(url: string, config?: Omit<RequestConfig, "url" | "method">): Promise<T> {
    return this.request<T>({ ...config, url, method: "DELETE" });
  }

  addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>): void {
    this.config.interceptors = this.config.interceptors || {
      request: [],
      response: []
    };
    this.config.interceptors.request = this.config.interceptors.request || [];
    this.config.interceptors.request.push(interceptor);
  }

  setAuthRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>): void {
    this.config.interceptors = this.config.interceptors || {
      request: [],
      response: []
    };
    this.config.interceptors.authRequest = interceptor;
  }

  addResponseInterceptor(interceptor: (response: any) => any | Promise<any>): void {
    this.config.interceptors = this.config.interceptors || {
      request: [],
      response: []
    };
    this.config.interceptors.response = this.config.interceptors.response || [];
    this.config.interceptors.response.push(interceptor);
  }

  addRawResponseInterceptor(interceptor: (response: Response) => Response | Promise<Response>): void {
    this.config.interceptors = this.config.interceptors || {
      request: [],
      response: [],
      rawResponse: []
    };
    this.config.interceptors.rawResponse = this.config.interceptors.rawResponse || [];
    this.config.interceptors.rawResponse.push(interceptor);
  }
}

export const apiClient = new ApiClient();
apiClient.addResponseInterceptor(authResponseInterceptor);
