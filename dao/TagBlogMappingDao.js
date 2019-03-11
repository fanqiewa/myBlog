var dbutil = require("./DButil");

function insertTagBlogMapping(tagId,blogId,ctime,utime,success) {
    var insertSql = "insert into tag_blog_mapping(`tag_id`,`blog_id`,`ctime`,`utime`) values (?,?,?,?)";
    var params = [tagId,blogId,ctime,utime];
    var connetion = dbutil.createConnection();
    connetion.connect();
    connetion.query(insertSql,params,function (error,result) {
        if(error == null){
            success(result)
        }else {
            console.log(error)
        }
    })
    connetion.end();

}

function queryByTag(tagId,page,pageSize,success) {
    var insertSql = "select * from tag_blog_mapping where tag_id = ? limit ?, ?";
    var params = [tagId,page * pageSize,pageSize];
    var connetion = dbutil.createConnection();
    connetion.connect();
    connetion.query(insertSql,params,function (error,result) {
        if(error == null){
            success(result)
        }else {
            console.log(error)
        }
    })
    connetion.end();

}

function queryByTagCount(tagId,success) {
    var insertSql = "select count(1) as count from tag_blog_mapping where tag_id = ?";
    var params = [tagId];
    var connetion = dbutil.createConnection();
    connetion.connect();
    connetion.query(insertSql,params,function (error,result) {
        if(error == null){
            success(result)
        }else {
            console.log(error)
        }
    })
    connetion.end();

}


module.exports.insertTagBlogMapping = insertTagBlogMapping;
module.exports.queryByTag = queryByTag;
module.exports.queryByTagCount = queryByTagCount;
