var blogDao = require(".././dao/BlogDao");
var tagBlogMappingDao = require(".././dao/TagBlogMappingDao")
var tagsDao = require("../dao/TagsDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require(".././util/RespUtil");
var url = require("url");

var path = new Map();

function queryHotBlog(request,response) {
    blogDao.queryHotBlog(5,function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryHotBlog",queryHotBlog);

function queryBlogCount(request,response) {
    blogDao.queryBlogCount(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryBlogCount",queryBlogCount);

function queryBlogById(request,response) {
    var params = url.parse(request.url,true).query;
    blogDao.queryBlogById(parseInt(params.bid),function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
        blogDao.addViews(parseInt(params.bid),function (result) {

        })
    })
}
path.set("/queryBlogById",queryBlogById);

function queryBlogByPage(request,response) {
    var params = url.parse(request.url,true).query;
    blogDao.queryBlogByPage(parseInt(params.page),parseInt(params.pageSize),function (result) {
       for (var i = 0; i < result.length; i++){
           result[i].content = result[i].content.replace(/<img[\w\W]*">/,"");
           result[i].content = result[i].content.replace(/<[^>]+>/g,"");
           result[i].content = result[i].content.substring(0,300);
       }
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })

}


function editBlog(request,response) {
        var params = url.parse(request.url,true).query;
        var tags = params.tags.replace(/ /g,"").replace("，",",");
        request.on("data",function (data) {
            blogDao.insertBlog(params.title,data.toString(),tags,0,timeUtil.getNow(),timeUtil.getNow(),function (result) {
                response.writeHead(200);
                response.write(respUtil.writeResult("success","添加成功",null))
                response.end();
                var blogId = result.insertId;
                var tagsList = tags.split(",");
                for(var i = 0; i < tagsList.length; i ++){
                    if(tagsList[i] == ""){
                        continue;
                    }
                    queryTag(tagsList[i],blogId)
                }
            })
        })
}

function queryTag(tag,blogId) {
    tagsDao.queryTag(tag,function (result) {
        if(result == null || result.length == 0){
            insertTag(tag,blogId);
        } else {
            tagBlogMappingDao.insertTagBlogMapping(result[0].id,blogId,timeUtil.getNow(),timeUtil.getNow(),function () {});
        }
    })
}

function insertTag(tag,blogId) {
    tagsDao.insertTag(tag,timeUtil.getNow(),timeUtil.getNow(),function (result) {
        inserTagBlogMapping(result.insertId,blogId)
    })
}

function inserTagBlogMapping(tagId,blogId) {
    tagBlogMappingDao.insertTagBlogMapping(tagId,blogId,timeUtil.getNow(),timeUtil.getNow(),function (result) {

    })
}


function queryAllBlog(request,response) {
    blogDao.queryAllBlog(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryAllBlog",queryAllBlog);

path.set("/editBlog",editBlog);
path.set("/queryBlogByPage",queryBlogByPage);
module.exports.path = path;







