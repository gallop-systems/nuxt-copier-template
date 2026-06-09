declare module "#auth-utils" {
  interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  }
}

declare module "h3" {
  interface H3EventContext {
    user?: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
  }
}

export {};
