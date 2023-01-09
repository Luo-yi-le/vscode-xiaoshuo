import { ViewColumn } from 'vscode';

export interface IReader {
  type: string;
  name: string;
  isDirectory: boolean;
  path: string;
  bookName?: string,
  children: IReader[];
  difference: string
}

export type difference  = 'tv' | 'book';

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
  hasChapter: (path: string) => void;
  getChapter: (pathStr: string) => void;
  getContent: (path: string) => Promise<string>;
  search?: (keyword: string, optionsPath?: string) => void;
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