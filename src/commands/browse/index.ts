import { window, workspace } from 'vscode';
import * as path from 'path';
import { readerDriver } from '../../reader';
import { browseProvider, explorerNodeManager, TreeNode } from '../../explorer';
import { open, store, request, showNotification, Notification, config } from '../../utils';
import { previewProvider } from '../../webview/PreviewProvider';
import { TemplatePath, Commands } from '../../config';
import { readerManager } from '../../ReaderManager';


export const browseBook = async function (treeNode: TreeNode) {
    try {
      const list = await config.getConfig('__browse_list', []);
      const node:TreeNode = await readerDriver.getTreeNode(treeNode);
      let isExists = false;
      for (let i = 0; i < list.length; i++) {
        if (node.path === list[i].path && node.type === list[i].type) {
          isExists = true;
          break;
        }
      }
      if (isExists) {
        return;
      }
      list.push(node.data);
      await config.setConfig('__browse_list', list);
      await browseRefresh();
    } catch (error) {
      console.log(error);
    }
  };


  export const browseRefresh = async function () {
    // const notification = new Notification('加载预览记录');
    try {
      const treeNode: TreeNode[] = [];
      const list = await config.getConfig('__browse_list', []);
      console.log('__browse_list', list);
      list.forEach((v: any) => {
        treeNode.push(new TreeNode(v));
      });
  
      browseProvider.fire();
      explorerNodeManager.treeNode = treeNode;
    } catch (error) {
      console.warn(error);
    }
    // notification.stop();
  };

  export const clearBrowse = ()=>Function