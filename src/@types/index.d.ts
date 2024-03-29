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
  search?: (keyword: string, optionsPath?: string) => void;
  browse?: (jsonName: string, T?: any) => void
}

export interface DriverOptions{ 
  bqg : DriverOptionsConfig
}

export interface DriverOptionsConfig{
  url?:string,
  bookList?: IBookList,
  chapterList?: IChapterList,
  content?: IContent
}

export interface IBookList{
  url?: string,
  bookeName: string,
  container: string,
  bookAuthor: string,
  bookHref?: string
}

export interface IChapterList{
  url?: string,
  container: string,
  chapterName: string,
  chapterHref?: string,
}


export interface IContent{
  url?: string,
  content?: string,
  ignoreContent?: any[],
}