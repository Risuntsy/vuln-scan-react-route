interface RouteOptions {
  variables?: Record<string, string | number>;
  params?: Record<string, string>;
}

function buildRoute(route: string, options?: RouteOptions): string {
  let result = route;

  if (options?.variables) {
    Object.entries(options.variables).forEach(([key, value]) => {
      result = result.replace(`:${key}`, String(value));
    });
  }

  if (options?.params) {
    const queryString = new URLSearchParams(options.params).toString();
    if (queryString) {
      result += `?${queryString}`;
    }
  }

  return result;
}

export function r(route: string, options?: RouteOptions) {
  return buildRoute(route, options);
}
