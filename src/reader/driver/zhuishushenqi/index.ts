import * as cheerio from 'cheerio';
import request from '../../../utils/request';
import { TreeNode, defaultTreeNode } from '../../../explorer/TreeNode';
import { ReaderDriver as ReaderDriverImplements } from '../../../@types';


const DOMAIN = 'https://api.zhuishushenqi.com';
const DOMAIN1 = 'https://www.zhuishushenqi.com';
class ReaderDriver implements ReaderDriverImplements {

    public hasChapter(): boolean {
        return true;
    };
    public async search(keyword: string): Promise<TreeNode[]> {
        const result: TreeNode[] = [];
        try {
            const res = await request.send(DOMAIN1 + '/search?val=' + encodeURI(keyword));
            if (res.body) {
                const $ = cheerio.load(res.body);
                $('.books-list .book').each(function (i: number, elem: any) {
                    const title = $(elem).find('.right .name a').text();
                    const path = $(elem).find('.right .name a').attr().href;
                    const author = $(elem).find('.right .author span').text().split('|')[0]
                    result.push(
                        new TreeNode(
                            Object.assign({}, defaultTreeNode, {
                                type: '.zhuishushenqi',
                                name: `${title} - ${author}`,
                                isDirectory: true,
                                bookName: title,
                                path
                            })
                        )
                    );

                });
            }
        } catch (error) {
            console.warn(error);
        }

        return result
    };

    public async getChapter(pathStr: string): Promise<TreeNode[]> {
        const result: TreeNode[] = [];
        try {
            const res = await request.send(DOMAIN1 + pathStr);
            if (res.body) {
                const $ = cheerio.load(res.body);
                $('#J_chapterList li').each(function (i: number, elem: any) {
                    const name = $(elem).find('a').text();
                    const path = $(elem).find('a').attr().href;
                    result.push(
                        new TreeNode(
                            Object.assign({}, defaultTreeNode, {
                                type: '.zhuishushenqi',
                                name,
                                isDirectory: false,
                                path
                            })
                        )
                    );
                })
            }
        } catch (error) {
            console.warn(error);
        }
        return result;
    };
    public async getContent(pathStr: string): Promise<string> {
        let result = '';
        try {
            const res = await request.send(DOMAIN1 + pathStr);
            const $ = cheerio.load(res.body);
            const html = $('.content .inner-text').html();
            result = html ? html : '';
        } catch (error) {
            console.warn(error);
        }
        return result;
    };
}

export const readerDriver = new ReaderDriver();