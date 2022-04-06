import { ViewColumn } from 'vscode';

export interface IReader {
  type: string;
  name: string;
  isDirectory: boolean;
  path: string;
  bookName?: string,
  T: T,
  children: IReader[];
}

// type T = IReader
export type T ={
  type?: string;
  name?: string;
  isDirectory?: boolean;
  path?: string;
  bookName?: string,
  children?: IReader[];
}

export interface IWebviewOption {
  title: string;
  viewColumn: ViewColumn;
  preserveFocus?: boolean;
}

interface IWebViewMessage {
  command: string;
  data: any;
}

interface ReaderDriver {
  hasChapter: (path: string, T?: any) => void;
  getChapter: (path: string, T?: any ) => void;
  getContent: (path: string, T?: any) => Promise<string>;
  search?: (keyword: string) => void;
  browse?: (jsonName: string, T?: any) => void
}
