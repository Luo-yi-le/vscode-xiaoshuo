
# vscode-xiaoshuo

## 自定义笔趣阁接口

~~~json
文件必须以json为后缀，以下字段全部为有效字段，添加其他字段不生效。比如xxxxx.json，禁止中文名字
{
    //笔趣阁前缀
    "bqg": {
        "url": "https://www.wyill.com", //全局网址

        //搜索书名后的列表
        "bookList": {
            //单独设置查询网址，设置该参数则全局网址不生效
            "url": "https://www.wyill.com/s?q=",
            //列表父容器
            "container": "div.type_show .bookbox",
            //书名
            "bookeName": ".box .bookinfo .bookname a",
            //作者
            "bookAuthor": ".box .bookinfo .author",
            //该书的链接
            "bookHref": ".box .bookinfo .bookname a"
        },

        //点击某本书的章节列表
        "chapterList": {
            //单独设置查询网址，设置该参数则全局网址不生效
            "url": "https://www.wyill.com",
            //列表父容器
            "container": ".listmain dd",
            //章节名称
            "chapterName": "a",
            //章节链接
            "chapterHref": "a"
        },

        //点击某章节查看的内容
        "content": {
            //单独设置查询网址，设置该参数则全局网址不生效
            "url": "https://www.wyill.com",
            //点击某章节小说内容
            "content": "#chaptercontent",

            //忽略小说某个内容
            "ignoreContent": [
                "请收藏本站：https://www.wyill.com。笔趣阁手机版：https://m.wyill.com",
                "『点此报错』",
                "『加入书签』"
            ]
        }
    }
}
~~~


## 重要提示
~~~ text

该文件创建完成后保存至本地任意地方，复制该文件路径（比如：D:\\vscode\xiaoshuo.config.json）至 vs code

1、打开首选项（CTRL+,）
2、打开Extensions，找到wulingshanVscodeXiaoshuo配置项
3、将路径粘贴至Biquge Config配置中重新搜索


提示：目前只在笔趣阁添加该项，后面只维护笔趣阁
~~~

### 没有版权的小说只能查出来书名,但是不能看,建议使用笔趣阁


### 接口有时无法访问，又可能是被限制。出现无法访问题或者优化的想法请Emil：wulingshan.luo@qq.com，



