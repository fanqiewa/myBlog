var blogDao = require(".././dao/BlogDao");
var tagBlogMappingDao = require(".././dao/TagBlogMappingDao")
var tagsDao = require("../dao/TagsDao");
var commentsDao = require("../dao/CommentDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require(".././util/RespUtil");
var captcha = require("svg-captcha");
var url = require("url");

var path = new Map();

function addComment(request,response) {
    var params = url.parse(request.url,true).query;
    commentsDao.insertComment(params.bid,params.parent,params.userName,params.content,params.email,timeUtil.getNow(),timeUtil.getNow(),params.parentName,function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","评论成功",null));
        response.end();
    })
}


path.set("/addComment",addComment);

function queryRandomCode(request,response){
    var img = captcha.create({fontSize: 50,width: 100, height: 34});
    // response.writeHead(200,{"Content-Type" : "image/svg+xml"});
    // response.write(img.data);
    // response.end();
    response.writeHead(200);
    response.write(respUtil.writeResult("success","验证码切换成功",img));
    response.end();
}

path.set("/queryRandomCode",queryRandomCode);

function queryCommentsByBlogId(request,response){
        var params = url.parse(request.url,true).query;
        commentsDao.queryComentsByBlogId(parseInt(params.bid),function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success","查询成功",result));
            response.end();
        })
}
path.set("/queryCommentsByBlogId",queryCommentsByBlogId);

function queryCommentsCountByBlogId(request,response){
    var params = url.parse(request.url,true).query;
    commentsDao.queryCommentsCountByBlogId(params.bid,function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryCommentsCountByBlogId",queryCommentsCountByBlogId);

function queryNewComments(request,response){
    var params = url.parse(request.url,true).query;
    commentsDao.queryNewComments(5,function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryNewComments",queryNewComments);

module.exports.path = path;

