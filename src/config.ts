import * as path from 'path';

export enum Commands {
  Driver = "./driver/", //驱动
  zongheng = 'wulingshan.command.zongheng',
  searchfanqie = 'wulingshan.command.fanqie',
  searchzhuishushenqi = 'wulingshan.command.zhuishushenqi',
  searchBiQuGe = 'wulingshan.command.biquge',
  openReaderWebView = 'wulingshan.local.openReaderWebView',
  localRefresh = 'wulingshan.command.refresh',
  openLocalDirectory = 'wulingshan.command.openLocalDirectory',
  searchOnline = 'wulingshan.command.searchOnline',
  editTemplateHtml = 'wulingshan.editTemplateHtml',
  editTemplateCss = 'wulingshan.editTemplateCss',
  goProgress = 'wulingshan.goProgress',
  progressUpdate = 'wulingshan.progress:update',
  setOnlineSite = 'wulingshan.command.setOnlineSite',
  setEncoding = 'wulingshan.command.setEncoding',
  setChapterOrder = 'wulingshan.command.setChapterOrder',
  collectRefresh = 'wulingshan.command.collectList',
  editCollectList = 'wulingshan.command.editCollectList',
  collectBook = 'wulingshan.command.collectBook',
  clearCollect = 'wulingshan.command.clearCollect',
  cancelCollect = 'wulingshan.command.cancelCollect',
  lastChapter = 'wulingshan.command.lastChapter',
  nextChapter = 'wulingshan.command.nextChapter',
  reLoadCookie = 'wulingshan.command.reLoadCookie',
  clearBrowse = 'wulingshan.command.clearBrowse'
}
export const CommandDriver =(_driver: any = ' ') =>{
  if(_driver == Commands.searchOnline) {
    _driver = _driver+'.qidian'
  }
  const driver:any[] = _driver.split('.')||[];
  return Commands.Driver+ driver[driver.length - 1];
}

export const novelCommandList=[
  'wulingshan.command.searchfanqie',
  'wulingshan.command.zhuishushenqi',
  'wulingshan.command.biquge'
]

export enum WebViewMessage {
  editStyle = 'editStyle',
  editHtml = 'editHtml',
  goProgress = 'goProgress',
  progressUpdate = 'progress:update',
  lastChapter = 'lastChapter',
  nextChapter = 'nextChapter'
}

export const TemplatePath = {
  templateCss: path.join('static', 'template', 'default', 'style.css'),
  templateHtml: path.join('static', 'template', 'default', 'index.html')
};

export const TREEVIEW_ID = 'wulingshan-menu';
export const TREEVIEW_COLLECT = 'wulingshan-collect';
export const TREEVIEW_BROWSE= 'wulingshan-browse'