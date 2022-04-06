import { window, workspace } from 'vscode';
import * as path from 'path';
import { readerDriver } from '../reader';
import { treeDataProvider, registerTreeDataProvider, explorerNodeManager, TreeNode } from '../explorer';
import { open, store, request, showNotification, Notification, config } from '../utils';
import { previewProvider } from '../webview/PreviewProvider';
import { TemplatePath, Commands } from '../config';
import { readerManager } from '../ReaderManager';
import { browseBook, browseRefresh } from './browse'

export const openReaderWebView = async function (treeNode: TreeNode) {
  await browseBook(treeNode)
  readerDriver.getContent(treeNode).then(function (data: string) {
    previewProvider.show(data, treeNode);
  });
};

export const localRefresh = async function () {
  const notification = new Notification('加载本地小说');
  try {
    const treeNode: TreeNode[] = await explorerNodeManager.getAllBooks();
    treeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  } catch (error) {
    console.warn(error);
  }
  notification.stop();
};


export const collectRefresh = async function () {
  const notification = new Notification('加载收藏列表');
  try {
    const treeNode: TreeNode[] = [];
    const list = await config.getConfig('__collect_list', []);
    // console.log('__collect_list', list);
    list.forEach((v: any) => {
      treeNode.push(new TreeNode(v));
    });

    registerTreeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  } catch (error) {
    console.warn(error);
  }
  notification.stop();
};


export const editCollectList = function () {
  workspace.openTextDocument(config.getConfigFile('__collect_list')).then((res) => {
    window.showTextDocument(res, {
      preview: false
    });
  });
};

export const collectBook = async function (treeNode: TreeNode) {
  try {
    const node:TreeNode = treeNode.isDirectory? treeNode : await readerDriver.getTreeNode(treeNode);
    const list = await config.getConfig('__collect_list', []);
    let isExists = false;
    for (let i = 0; i < list.length; i++) {
      if (node.path === list[i].path && node.type === list[i].type) {
        isExists = true;
        break;
      }
    }
    if (isExists) {
      showNotification('已收藏该书', 1000);
      return;
    }
    list.push(node.data);
    await config.setConfig('__collect_list', list);
    showNotification('收藏成功', 1000);
    await collectRefresh()
  } catch (error) {
    console.log(error);
  }
};

export const cancelCollect = async function (treeNode: TreeNode) {
  const list = await config.getConfig('__collect_list', []);
  let bookIndex = null;
  for (let i = 0; i < list.length; i++) {
    if (treeNode.path === list[i].path && treeNode.type === list[i].type) {
      bookIndex = i;
      break;
    }
  }
  if (bookIndex !== null) {
    list.splice(bookIndex, 1);
  }
  await config.setConfig('__collect_list', list);
  showNotification('取消收藏成功', 1000);
  await collectRefresh()
};

export const clearDataBase =async function(database_name: string, data?: any) {
  await config.setConfig(database_name, data || []);
  showNotification('清空成功', 1000);
};
export const clearCollect= async() =>(await clearDataBase('__collect_list'), await collectRefresh());
export const clearBrowse= async () =>(await clearDataBase('__browse_list'), await browseRefresh())

// export const clearCollect = async function () {
//   await config.setConfig('__collect_list', []);
//   showNotification('清空成功', 1000);
// };

export const openLocalDirectory = function () {
  open(readerDriver.getFileDir());
};


const _searchOnline = async function (msg: string, brand?: string, name?: string) {
  const notification = new Notification(`搜索${name}: ${msg}`);
  try {
    const vConfig = workspace.getConfiguration('wulingshan');
    const onlineSite: string = vConfig.get('onlineSite', `${brand}`);
    const treeNode = await readerDriver.search(msg, `${brand}`);
    // console.log(treeNode)
    treeDataProvider.fire();
    explorerNodeManager.treeNode = treeNode;
  } catch (error) {
    console.warn(error);
  }
  notification.stop();
};
export const searchBiQuGe = () => searchOnline;

export const searchOnline = async function (commands: string) {
  const msg = await window.showInputBox({
    password: false,
    ignoreFocusOut: false,
    placeHolder: '请输入小说的名字',
    prompt: ''
  });
  if (msg) {
    await handleCommand(commands, msg);
  }
};



export const editTemplateHtml = function () {
  openTextDocument(path.join(store.extensionPath, TemplatePath.templateHtml));
};

export const editTemplateCss = function () {
  openTextDocument(path.join(store.extensionPath, TemplatePath.templateCss));
};

const openTextDocument = function (path: string) {
  workspace.openTextDocument(path).then((res) => {
    window.showTextDocument(res, {
      preview: false
    });
  });
};

export const goProgress = function () {
  window
    .showInputBox({
      password: false,
      ignoreFocusOut: false,
      placeHolder: '请输入进度: 0-100',
      validateInput: (text: string) => (/^\d+(\.\d+)?$/.test(text) ? undefined : '请输入数字')
    })
    .then(async (msg: any) => {
      const treeNode = await explorerNodeManager.getAllBooks()
      previewProvider.postMessage({
        command: 'goProgress',
        data: {
          progress: Number(msg) * 0.01
        }
      });
    });
};

export const progressUpdate = function (data: any) {
  console.log('progressUpdate:', data.progress);
  readerManager.emit('StatusbarUpdateStatusBar', (data.progress * 100).toFixed(2) + '%');
  const treeNode = previewProvider.getTreeNode();
  if (treeNode && treeNode.type === '.txt' && typeof treeNode.path === 'string') {
    config.set(treeNode.path, 'progress', data.progress);
  }
};

// 上一个章节
export const lastChapter = function () {
  const treeNode = previewProvider.getTreeNode();
  let isSuccess = false;
  if (treeNode) {
    const nextNode = explorerNodeManager.lastChapter(treeNode);
    if (nextNode) {
      openReaderWebView(nextNode);
      isSuccess = true;
    }
  }
  if (!isSuccess) {
    showNotification('没有上一章了~', 1000);
  }
};
// 下一个章节
export const nextChapter = function () {
  const treeNode = previewProvider.getTreeNode();
  let isSuccess = false;
  if (treeNode) {
    const nextNode = explorerNodeManager.nextChapter(treeNode);
    if (nextNode) {
      openReaderWebView(nextNode);
      isSuccess = true;
    }
  }
  if (!isSuccess) {
    showNotification('没有下一章了~', 1000);
  }
};

// 重新加载cookie
export const reLoadCookie = function () {
  request.reLoadCookie();
  showNotification('重新加载cookie完成~', 1000);
};

export {
  browseRefresh,
}

const handleCommand = async function (commands: string, message: string) {
  let cmd: string = Commands.searchOnline;
  let name = '起点';
  switch (commands) {
    case Commands.searchOnline:
      cmd = Commands.searchOnline;
      name = '起点'
      break;
    case Commands.searchBiQuGe:
      cmd = Commands.searchBiQuGe;
      name = '笔趣阁'
      break;
    case Commands.searchzhuishushenqi:
      cmd = Commands.searchzhuishushenqi;
      name = '追书神器'
      break;
    case Commands.searchfanqie:
      cmd = Commands.searchfanqie;
      name = '番茄小说'
      break;
    case Commands.zongheng:
      cmd = Commands.zongheng
      name = '纵横小说'
      break;
    default:
      cmd = Commands.searchOnline;
      name = '起点'
      break;
  }

  await _searchOnline(message, cmd, name);
};