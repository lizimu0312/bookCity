// 前后端分类接口路径
var listData = require('./homePage/home'); // 首页列表数据
var more1 = require('./homePage/recommend1'); // 加载更多第1屏
var more2 = require('./homePage/recommend2'); // 加载更多第2屏
var more3 = require('./homePage/recommend3'); // 加载更多第3屏
var searchData = require('./search/search'); // 搜索页数据
var searchKey = require('./search/searchKey'); // 搜索页默认介绍
var detail = require('./detail/352876'); // 详情页数据
var chapter = require('./reader/chapter-list'); // 目录数据
var reader1 = require('./reader/data1');
var reader2 = require('./reader/data2');
var reader3 = require('./reader/data3');
var reader4 = require('./reader/data4');

var data = { // 接口对应的数据
    '/api/index': listData, // 首页接口
    '/api/loadmore?pagenum=1&limit=20': more1, // 第1屏接口
    '/api/loadmore?pagenum=2&limit=20': more2, // 第2屏接口
    '/api/loadmore?pagenum=3&limit=20': more3, // 第3屏接口
    '/api/bookrack': more1, // 书架接口
    '/api/searchKey': searchKey, // 搜索接口
    '/api/detail?id=352876': detail, // 详情页接口
    '/api/chapter?id=352876': chapter, // 目录接口
    '/api/reader?chapterNum=1': reader1,
    '/api/reader?chapterNum=2': reader2,
    '/api/reader?chapterNum=3': reader3,
    '/api/reader?chapterNum=4': reader4
};
module.exports = function(url) {
    if (/\/api\/result/.test(url)) {
        var query = url.split('?')[1]; // 搜索时传递的参数 = 书名
        var val = decodeURIComponent(query.split('=')[1]); // 解码书名
        var reg = new RegExp(val, 'g');
        var obj = {
            mes: '暂无数据',
            cont: []
        }
        var newarr = searchData.items.filter(function(v, i) {
            v.authors = v.role[0][1]; // 作者
            v.summary = v.intro; // 简介
            // v.title 书名
            return reg.test(v.title) || reg.test(v.intro) || reg.test(v.role[0][1]);
        });
        if (newarr.length) {
            obj.mes = 'success';
            obj.cont = newarr;
        }
        return obj;
    }
    return data[url];
}