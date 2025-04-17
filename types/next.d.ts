import 'next';

declare module 'next' {
  interface PageProps {
    params: {
      [key: string]: string;
    };
    searchParams: {
      [key: string]: string | string[] | undefined;
    };
  }
} 