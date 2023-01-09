import { Command } from 'vscode';
import { Commands } from '../config';
import { IReader, T  } from '../@types';

export const defaultTreeNode: IReader = {
  type: '.txt',
  name: '',
  isDirectory: false,
  path: '',
  T: {},
  children: []
};

export class TreeNode {
  constructor(public data: IReader) {}

  public get name(): string {
    return this.data.name;
  }
  public get type(): string {
    return this.data.type;
  }
  public get path(): string {
    return this.data.path;
  }
  public get isDirectory(): boolean {
    return this.data.isDirectory;
  }

  public set children(iReader: IReader[]) {
    this.data.children = iReader;
  }

  public get children(): IReader[] {
    return this.data.children;
  }

  public get T(): T {
    return this.data.T;
  }
  public get previewCommand(): Command {
    return {
      title: this.data.name,
      command: Commands.openReaderWebView,
      arguments: [this]
    };
  }
}