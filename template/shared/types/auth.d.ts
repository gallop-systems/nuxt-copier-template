declare module "#auth-utils" {
  interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
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
