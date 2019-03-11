var blogDao = require(".././dao/BlogDao");
var tagBlogMappingDao = require(".././dao/TagBlogMappingDao")
var tagsDao = require("../dao/TagsDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require(".././util/RespUtil");
var url = require("url");

var path = new Map();

function queryRandomTags(request,response) {
    tagsDao.queryAllTag(function (result) {
        result.sort(function () {
            return Math.random() > 0.5 ? true : false
        });
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}

path.set("/queryRandomTags",queryRandomTags);


function queryByTag(request,response){
    var params = url.parse(request.url,true).query;
    tagsDao.queryTag(params.tag,function (result) { //查出标签id result为一条
        if(result == null || result.length == 0){
            response.writeHead(200);
            response.write(respUtil.writeResult("success","查询成功",result));
            response.end();
        }else {
            tagBlogMappingDao.queryByTag(result[0].id, parseInt(params.page),parseInt(params.pageSize),function (result) {//通过标签id查出映射条数,多条
                var blogList =[];
                for(var i = 0; i < result.length; i++){
                    blogDao.queryBlogById(result[i].blog_id,function (result) { //通过文章id查出文章,result为1条
                        blogList.push(result[0])
                    })
                }
                getResult(blogList,result.length,response)
            })
        }
    })
}

function getResult(blogList,len,response){
    if(blogList < len){
        setTimeout(function () {
            getResult(blogList,len,response)
        },10)
    } else {
        for (var i = 0; i < blogList.length; i++){
            blogList[i].content = blogList[i].content.replace(/<img[\w\W]*">/,"");
            blogList[i].content = blogList[i].content.replace(/<[^>]+>/g,"");
            blogList[i].content = blogList[i].content.substring(0,300);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",blogList));
        response.end();
    }
}

path.set("/queryByTag",queryByTag);

function queryByTagCount(request,response){
    var params = url.parse(request.url,true).query;
    tagsDao.queryTag(params.tag,function (result) { //查出标签id result为一条
        tagBlogMappingDao.queryByTagCount(result[0].id,function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success","查询成功",result));
            response.end();
        })
    })
}
path.set("/queryByTagCount",queryByTagCount);

module.exports.path = path;
