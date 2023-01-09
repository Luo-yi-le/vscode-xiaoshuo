/* eslint-disable prefer-const */
import { ExtensionContext, window, commands } from 'vscode';
import { statusbar } from './Statusbar';
import { Commands, TREEVIEW_ID, TREEVIEW_COLLECT, TREEVIEW_BROWSE } from './config';
import { store } from './utils/store';
import workspaceConfiguration from './utils/workspaceConfiguration';
import { treeDataProvider, registerTreeDataProvider, browseProvider } from './explorer'
// import { treeDataProvider } from './explorer/treeDataProvider';
// import { registerTreeDataProvider } from './explorer/registerTreeDataProvider';
import * as Path from 'path';
import { TreeNode } from './explorer/TreeNode';
import {
  openReaderWebView,
  openLocalDirectory,
  searchOnline,
  collectRefresh,
  browseRefresh,
  editCollectList,
  collectBook,
  cancelCollect,
  clearCollect,
  localRefresh,
  editTemplateHtml,
  editTemplateCss,
  goProgress,
  progressUpdate,
  nextChapter,
  lastChapter,
  reLoadCookie,
  clearBrowse,
} from './commands';

export async function activate(context: ExtensionContext): Promise<void> {
  console.log('activate');
  // store

  store.extensionPath = context.extensionPath;
  store.booksPath = Path.join(context.extensionPath, 'book');
  store.globalStorageUri = context.globalStorageUri;
  context.subscriptions.push(
    statusbar,
    treeDataProvider,
    registerTreeDataProvider,
    // 点击事件
    commands.registerCommand(Commands.openReaderWebView, (treeNode: TreeNode)=>{
      // if(treeNode.difference == 'book') {
      //   openReaderWebView(treeNode)
      // }
      openReaderWebView(treeNode)
    }),
    // 刷新
    commands.registerCommand(Commands.localRefresh, () => {
      commands.executeCommand('setContext', 'rwulingshan.panel', 'local');
      localRefresh();
    }),
    // 打开本地目录
    commands.registerCommand(Commands.openLocalDirectory, openLocalDirectory),
    // 搜索 - 起点
    commands.registerCommand(Commands.searchOnline, () => {
      commands.executeCommand('setContext', 'rwulingshan.panel', 'online');
      searchOnline(Commands.searchOnline);
    }),

    commands.registerCommand(Commands.searchBiQuGe, () => {
      commands.executeCommand('setContext', 'rwulingshan.panel', 'online');
      searchOnline(Commands.searchBiQuGe);
    }),
    commands.registerCommand(Commands.searchzhuishushenqi, () => {
      commands.executeCommand('setContext', 'rwulingshan.panel', 'online');
      searchOnline(Commands.searchzhuishushenqi);
    }),

    commands.registerCommand(Commands.searchfanqie, () => {
      commands.executeCommand('setContext', 'rwulingshan.panel', 'online');
      searchOnline(Commands.searchfanqie);
    }),

    commands.registerCommand(Commands.zongheng, () => {
      commands.executeCommand('setContext', 'rwulingshan.panel', 'online');
      searchOnline(Commands.zongheng);
    }),

    commands.registerCommand(Commands.editTemplateHtml, editTemplateHtml),
    commands.registerCommand(Commands.editTemplateCss, editTemplateCss),
    commands.registerCommand(Commands.goProgress, goProgress),
    commands.registerCommand(Commands.progressUpdate, progressUpdate),
    commands.registerCommand(Commands.lastChapter, lastChapter),
    commands.registerCommand(Commands.nextChapter, nextChapter),
    commands.registerCommand(Commands.reLoadCookie, reLoadCookie),
    // 加载收藏列表
    commands.registerCommand(Commands.collectRefresh, () => {
      commands.executeCommand('setContext', 'rwulingshan.collect', 'collect');
      collectRefresh();
    }),
    // 编辑收藏列表
    commands.registerCommand(Commands.editCollectList, () => editCollectList),
    // 收藏书籍
    commands.registerCommand(Commands.collectBook, collectBook),
    // 取消收藏书籍
    commands.registerCommand(Commands.cancelCollect, cancelCollect),
    // 清空收藏
    commands.registerCommand(Commands.clearCollect, clearCollect),
    // 清空浏览记录
    commands.registerCommand(Commands.clearBrowse, clearBrowse),

    commands.registerCommand(Commands.setbiqugeConfig, async ()=>{
      const biqugeConfig = workspaceConfiguration().get('biqugeConfig');
      if(biqugeConfig) {
        workspaceConfiguration().update('biqugeConfig', biqugeConfig, true);
      }
    }),

    // 设置
    commands.registerCommand(Commands.setOnlineSite, async () => {
      const onlineSite = workspaceConfiguration().get('onlineSite');
      // 没有找到 showQuickPick 接口设置选中项的配置, 所以这里排序将当前设置置顶
      const items = [{ label: '起点' }, { label: '笔趣阁' }]
        .map((e) => ({ ...e, description: e.label === onlineSite ? '当前设置' : '' }))
        .sort((e) => (e.label === onlineSite ? -1 : 0));
      const result = await window.showQuickPick(items, {
        placeHolder: '在线搜索来源网站, 当前设置: ' + onlineSite,
        canPickMany: false
      });
      if (result && result.label) {
        workspaceConfiguration().update('onlineSite', result.label, true);
      }
    }),
    commands.registerCommand(Commands.setEncoding, async () => {
      const encoding = workspaceConfiguration().get('encoding', 'utf8');
      const result = await window.showQuickPick(
        [
          {
            label: 'utf8'
          },
          {
            label: 'gbk'
          }
        ],
        {
          placeHolder: 'txt文件打开编码, 当前设置: ' + encoding,
          canPickMany: false
        }
      );
      if (result && result.label) {
        workspaceConfiguration().update('encoding', result.label, true);
      }
    }),
    // 设置章节顺序
    commands.registerCommand(Commands.setChapterOrder, async () => {
      const chapterOrder = workspaceConfiguration().get('chapterOrder', '顺序');
      const result = await window.showQuickPick(
        [
          {
            label: '顺序'
          },
          {
            label: '倒序'
          }
        ],
        {
          placeHolder: '章节显示顺序, 当前设置: ' + chapterOrder,
          canPickMany: false
        }
      );
      if (result && result.label) {
        workspaceConfiguration().update('chapterOrder', result.label, true);
      }
    }),


    // 注册 TreeView
    window.createTreeView(TREEVIEW_ID, {
      treeDataProvider: treeDataProvider,
      showCollapseAll: true
    }),
    window.createTreeView(TREEVIEW_COLLECT, {
      treeDataProvider: registerTreeDataProvider,
      showCollapseAll: true,
    }),
    window.createTreeView(TREEVIEW_BROWSE, {
      treeDataProvider: browseProvider,
      showCollapseAll: true,
    }),
  );
  await collectRefresh();
  await browseRefresh();
  // localRefresh();
}

export function deactivate() {
  console.log('eactivate.');
}
