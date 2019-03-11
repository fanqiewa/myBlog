var dbutil = require("./DButil");

function insertComment(blogId,parent,userName,comments,email,ctime,utime,parentName,success) {
    var insertSql = "insert into comments (`blog_id`,`parent`,`username`,`comments`,`email`,`ctime`,`utime`,`parent_name`) values (?, ?, ?, ?, ?, ?, ?, ?)";
    var params = [blogId,parent,userName,comments,email,ctime,utime,parentName];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql,params,function (error,result) {
        if(error == null){
            success(result)
        }else {
            console.log(error);
        }
    })
    connection.end();

}
function queryCommentsByBlogId(blogId,success) {
    var querySql = "select * from comments where blog_id = ? order by id desc";
    var params = [blogId];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else {
            console.log(error);
        }
    })
    connection.end();

}

function queryCommentsCountByBlogId(blogId,success) {
    var querySql = "select count(1) as count from comments where blog_id = ?";
    var params = [blogId];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else {
            console.log(error);
        }
    })
    connection.end();
}

function queryNewComments(size,success) {
    var querySql = "select * from comments order by id desc limit ?";
    var params = [size];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result) {
        if(error == null){
            success(result)
        }else {
            console.log(error);
        }
    })
    connection.end();
}


module.exports.queryCommentsCountByBlogId = queryCommentsCountByBlogId;
module.exports.queryComentsByBlogId = queryCommentsByBlogId;
module.exports.insertComment = insertComment;
module.exports.queryNewComments = queryNewComments;
