import * as cheerio from 'cheerio';
import request from '../../../utils/request';
import { TreeNode, defaultTreeNode } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';


const DOMAIN = 'https://fanqienovel.com';

class ReaderDriver implements ReaderDriverImplements {
    public hasChapter() {
        return true;
    };

    public async getChapter(pathStr: string): Promise<TreeNode[]> {
        const { bookId } = JSON.parse(pathStr);
        const result: TreeNode[] = [];
        try {
            const res = await request.send(DOMAIN + '/page/' + bookId + '?enter_from=search');
            const $ = cheerio.load(res.body);
            $('.chapter .chapter-item').each(function (i: number, elem: any) {
                const name = $(elem).find('a').text();
                const path = $(elem).find('a').attr().href;
                result.push(
                    new TreeNode(
                        Object.assign({}, defaultTreeNode, {
                            type: '.fanqie',
                            name,
                            isDirectory: false,
                            path
                        })
                    )
                );
            })
        } catch (error) {
            console.warn(error);
        }
        return result
    };

    public async getContent(pathStr: string): Promise<string> {
        let result = '';
        try {
            const res = await request.send(DOMAIN + pathStr+'?enter_from=page');
            const $ = cheerio.load(res.body);
            const html = $('.muye-reader-content').html();
            result = html ? html : '';
        } catch (error) {
            console.warn(error);
        }
        return result;
    };
    public async search(keyword: string): Promise<TreeNode[]> {
        const result: TreeNode[] = [];
        try {
            const res = await request.send(DOMAIN + '/api/author/search/search_book/v1?filter=127,127,127&page_count=100&page_index=0&query_type=0&query_word=' + encodeURI(keyword));
            if (res.body) {
                const { search_book_data_list } = JSON.parse(res.body)['data'] || [];
                search_book_data_list.forEach((item: any) => {
                    result.push(
                        new TreeNode(
                            Object.assign({}, defaultTreeNode, {
                                type: '.fanqie',
                                name: `${item.book_name} - ${item.author}`,
                                isDirectory: true,
                                bookName: item.book_name,
                                path: JSON.stringify({ bookId: item.book_id })
                            })
                        )
                    );
                });
            }
        } catch (error) {
            console.error(error)
        }
        return result
    }
}
export const readerDriver = new ReaderDriver();