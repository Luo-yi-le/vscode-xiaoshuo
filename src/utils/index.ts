import * as Open from 'open';
import * as Fs from 'fs';
import * as Path from 'path';
import { Uri } from 'vscode';
import { Notification } from './notification';
import { store } from './store';
import * as config from './config';
import request from './request';

export const open = (path: string) => {
  return Open(path, { wait: true });
};

export const template = (rootPath: string, htmlPath: string, data: any = false): any => {
  const AbsHtmlPath = Path.join(rootPath, htmlPath);
  const dirPath = Path.dirname(AbsHtmlPath);
  let result = Fs.readFileSync(AbsHtmlPath, 'utf-8').replace(/(@)(.+?)"/g, (m, $1, $2) => {
    return Uri.file(Path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
  });
  if (data) {
    result = result.replace(/(\{\{)(.+?)(\}\})/g, (m, $1, $2) => {
      return data[$2.trim()];
    });
  }
  return result;
};

export const showNotification = function (tip?: string, timer?: number) {
  const notification = new Notification(tip);
  if (timer) {
    setTimeout(() => {
      notification.stop();
    }, timer);
  }
};

export {
  store,
  Notification,
  config,
  request
}