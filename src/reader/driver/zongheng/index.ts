import * as cheerio from 'cheerio';
import request from '../../../utils/request';
import { TreeNode, defaultTreeNode } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';

const DOMAIN = 'https://search.zongheng.com/';
const DOMAIN2 = 'https://book.zongheng.com/';

class ReaderDriver implements ReaderDriverImplements {
    public hasChapter() {
        return true;
    }

    public async search(keyword: string): Promise<TreeNode[]> {
        const result: TreeNode[] = [];
        try {
            const res = await request.send(DOMAIN + '/s?keyword=' + encodeURI(keyword));
            const $ = cheerio.load(res.body);
            $('.search-tab .search-result-list').each(function (i: number, elem: any) {
                const book: any = $(elem).find('.se-result-infos .tit a').attr('data-sa-d');
                const title: any = $(elem).find('.se-result-infos .tit a').text();
                const author: any = $(elem).find('.se-result-infos .bookinfo').children(":first").text()
                const { book_id } = JSON.parse(book)
                result.push(
                    new TreeNode(
                        Object.assign({}, defaultTreeNode, {
                            type: '.zongheng',
                            name: `${title} - ${author}`,
                            bookName: title,
                            isDirectory: true,
                            path: `/showchapter/${book_id}.html`
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
        try {
            const res = await request.send(DOMAIN2 + pathStr);
            const $ = cheerio.load(res.body);
            $('ul.chapter-list li').each(function (i: number, elem: any) {
                const name = $(elem).find('a').text();
                const path = $(elem).find('a').attr().href;
                result.push(
                    new TreeNode(
                        Object.assign({}, defaultTreeNode, {
                            type: '.zongheng',
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
        try {
            const res = await request.send(pathStr);
            const $ = cheerio.load(res.body);
            const html = $('.content').html();
            result = html ? html : '';
        } catch (error) {
            console.warn(error);
        }
        return result;
    }
}

export const readerDriver = new ReaderDriver();
