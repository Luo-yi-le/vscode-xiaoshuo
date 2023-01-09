import * as cheerio from 'cheerio';
import request from '../../../utils/request';
import { TreeNode, defaultTreeNode } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements, DriverOptions, DriverOptionsConfig } from '../../../@types';
import * as fs from 'fs';

const DOMAIN = 'https://www.wyill.com';
const DOMAIN2 = 'https://www.wyill.com/s?q=';
// https://www.bige7.com/
class ReaderDriver implements ReaderDriverImplements {

  Options: DriverOptionsConfig | undefined 

  public hasChapter() {
    return true;
  }

  private async getOptionsPathJson(path: any) {
    if(!path) {
      return false;
    }
    const isExists = fs.existsSync(path);
    if (isExists) {
      const json: DriverOptions = JSON.parse(fs.readFileSync(path, 'utf-8'));
      if (json) {
        this.Options = json.bqg;
        // console.log(this.Options)
        // console.log(json.bqg)
      }
    }
    
  }

  public async search(keyword: string, optionsPath?: string): Promise<TreeNode[]> {
    await this.getOptionsPathJson(optionsPath)
    const result: TreeNode[] = [];
    const bookList = this.Options?.bookList;
    try {
      let url = bookList?.url ? bookList?.url : (this.Options?.url ? this.Options?.url : DOMAIN2)
      const res = await request.send(url + encodeURI(keyword));
      const $ = cheerio.load(res.body);
      $(bookList?.container).each(function (i: number, elem: any) {
        
        const bookeName = $(elem).find(bookList?.bookeName).text();
        const bookAuthor = $(elem).find(bookList?.bookAuthor).text();
        const bookHref = $(elem).find(bookList?.bookHref).attr().href;
        result.push(
          new TreeNode(
            Object.assign({}, defaultTreeNode, {
              type: '.biquge',
              name: `${bookeName} - ${bookAuthor}`,
              isDirectory: true,
              bookName: bookeName,
              path: bookHref
            })
          )
        );
      });
    } catch (error) {
      console.warn(error);
    }
    return result;
  }

  public async getChapter(pathStr: string): Promise<TreeNode[]> {
    const result: TreeNode[] = [];
    const chapterList = this.Options?.chapterList;
    let url = chapterList?.url ? chapterList?.url : (this.Options?.url ? this.Options?.url : DOMAIN2)
    try {
      const res = await request.send(url +pathStr);
      const $ = cheerio.load(res.body);
      $(chapterList?.container).each(function (i: number, elem: any) {
        const name = $(elem).find(chapterList?.chapterName).text();
        const path = $(elem).find(chapterList?.chapterHref).attr().href;
        result.push(
          new TreeNode(
            Object.assign({}, defaultTreeNode, {
              type: '.biquge',
              name,
              isDirectory: false,
              path
            })
          )
        );
      });
    } catch (error) {
      console.warn(error);
    }
    return result;
  }

  public async getContent(pathStr: string): Promise<string> {
    let result = '';
    const contenthtml = this.Options?.content;
    let url = contenthtml?.url ? contenthtml?.url : (this.Options?.url ? this.Options?.url : DOMAIN2)
    try {
      const res = await request.send(DOMAIN + pathStr);
      const $ = cheerio.load(res.body);
      const html = $(contenthtml?.content).html();
      let content = html || '';
      if(content) {
        if(contenthtml?.ignoreContent && contenthtml?.ignoreContent?.length) {
          contenthtml?.ignoreContent.forEach(item =>{
            content = content.replace(item, '')
          })
        }
        // content = html.replace('请收藏本站：https://www.wyill.com。笔趣阁手机版：https://m.wyill.com', '');
        // content =content.replace('『点此报错』', '');
        // content =content.replace('『加入书签』', '');
      }
      result = content || '';
    } catch (error) {
      console.warn(error);
    }
    return result;
  }

  public getTitle($:cheerio.CheerioAPI,elem:any) {
    new Function("var a=3;")(); 
    const title = $(elem).find('a.result-game-item-title-link span').text();
    const author = $(elem).find('.result-game-item-info .result-game-item-info-tag:nth-child(1) span:nth-child(2)').text();
    const path = $(elem).find('a.result-game-item-pic-link').attr().href;
    return {
      title,
      author,
      path
    }
  }

  public setTitle($:cheerio.CheerioAPI){
    return $().find()
  }
}

export const readerDriver = new ReaderDriver();
