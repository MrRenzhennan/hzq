var Restful = function() {

    return {
        // GET /db/collection - Returns all documents
        // GET /db/collection?query=%7B%22isDone%22%3A%20false%7D - Returns all documents satisfying query
        // GET /db/collection?query=%7B%22isDone%22%3A%20false%7D&limit=2&skip=2 - Ability to add options to query (limit, skip, etc)
        // GET /db/collection/id - Returns document with id
        // POST /db/collection - Insert new document in collection (document in POST body)
        // PUT /db/collection/id - Update document with id (updated document in PUT body)
        // DELETE /db//collectionid - Delete document with id
        find:function(restURL, queryJsonStr) {
            var jsonData;
            console.log("::restful.query::" + queryJsonStr);
            $.ajax({
                type: 'get',
                url: restURL + "/?query=" + encodeURIComponent(queryJsonStr),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data) {
                    jsonData = data;
                },
                error: function(err) {
                    // alert("find all err");
                }
            });
            return jsonData;
        },

        findNQ:function(restURL) {
            var jsonData;
            $.ajax({
                type: 'get',
                url: restURL,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data) {
                    jsonData = data;
                },
                error: function(err) {
                    // alert("find all err");
                }
            });
            return jsonData;
        },

        findPNQ:function(restURL, queryJsonStr) {
            var jsonData;
            $.ajax({
                type: 'POST',
                url: restURL,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                data: queryJsonStr,
                success: function(data) {
                    jsonData = data;
                },
                error: function(err) {
                    // alert("find all err");
                }
            });
            return jsonData;
        },

        rqlLike:function(colname,colvalue){
            rql='{"'+colname+'":{"$regex":"'+colvalue+'","$options":"i"}}';
            return rql;
        },

        findLike:function(restURL,colname,colvalue){
            return find(restURL,rqlLike(colname, colvalue));
        },

        getByID:function(restURL, id) {
            var jsonData;
            $.ajax({
                type: 'get',
                url: restURL + "/" + id,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data) {
                    jsonData = data;
                },
                error: function(err) {
                    // alert("find all err");
                }
            });
            return jsonData;
        },


        findByPage:function(restURL, queryJsonStr, beginRow, rowNum) {
            var jsonData;
            $.ajax({
                type: 'get',
                url: restURL + "/?query=" + encodeURIComponent(queryJsonStr) + "&skip=" + beginRow + "&limit=" + rowNum,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data) {
                    jsonData = data;
                },
                error: function(err) {
                    // alert("find all err");
                }
            });
            return jsonData;
        },

        // 2015-05-14 RYO
        insert:function(restURL, json) {
            var bool;
            $.ajax({
                type: 'POST',
                url:  restURL,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                isMask: true,
                data: JSON.stringify(json),

                success: function(data) {
                    bool = data;
                },
                error: function(err) {
                    bool = new Object();
                    bool["success"] = false;
                    bool["description"]  = err.statusText ? err.statusText : "不明错误原因..";
                    console.log("error:"+JSON.stringify(err))
                    if( err.status==406){
                        //need to login
                        if(window.location.pathname.indexOf('/login.html')<0)
                        {
                            window.location.replace("/login.html?redirect="+window.location.pathname);
                        }

                    }

                }
            });
            return bool;
        },

        insert_batch:function(restURL, arr) {
            var successNum = 0;
            var errorNum = 0;
            for (var i = 0; i < arr.length; i++) {
                $.ajax({
                    type: 'POST',
                    url: restURL,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(arr[i]),
                    async: false,
                    success: function(data) {
                        successNum = successNum + 1;
                    },
                    error: function(err) {
                        errorNum = errorNum + 1;


                    }
                });
            }
            if (errorNum > 0) {}
            return successNum;
        },

        update:function(restURL, id, json) {
            var bool = false;
            $.ajax({
                url: restURL + "/" + id,
                type: 'PUT',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(json),

                async: false,
                // data: json,
                success: function(data) {
                    bool = true;
                },
                error: function(err) {

                    if( err.status==401){
                        //need to login
                        if(window.location.pathname.indexOf('/login.html')<0)
                        {
                            window.location.replace("/login.html?redirect="+window.location.pathname);
                        }

                    }

                }
            });
            return bool;
        },

        updateNQ:function(restURL, json) {
            var bool = false;
            $.ajax({
                url: restURL,
                type: 'PUT',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: json,
                async: false,

                success: function(data) {
                    bool = true;
                },
                error: function(err) {}
            });
            return bool;
        },

        updateRNQ:function(restURL, id, json) {
            var resdata = false;
            var idxq = restURL.indexOf('?');
            if(idxq>0&&idxq<restURL.length){
                var param = restURL.substr(idxq);
                restURL = restURL.substr(0,idxq)+'/'+id+param;
            }else{
                restURL = restURL+"/" + id;
            }

            $.ajax({
                url: restURL ,
                type: 'PUT',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(json),
                async: false,
                isMask: true,
                success: function(data) {
                    resdata = data;
                },
                error: function(err) {
                    resdata = new Object();
                    resdata["success"] = false;
                    resdata["description"]  = err.statusText ? err.statusText : "不明错误原因..";
                }
            });
            return resdata;
        },

        delByID:function(restURL, id) {
            var bool = false;
            $.ajax({
                type: 'DELETE',
                url: restURL + "/" + id,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function(data) {
                    bool = true;
                },
                error: function(err) {}
            });
            return bool;
        },

        delByIDR:function(restURL, id) {
            var resdata = false;
            $.ajax({
                type: 'DELETE',
                url: restURL + "/" + id,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                data:"{}",
                success: function(data) {
                    resdata = data;
                },
                error: function(err) {
                    resdata = err;
                }
            });
            return resdata;
        },

        delByIDS:function(restURL, ids) {
            var bool = false;
            // $.ajax({
            //     type: 'DELETE',
            //     url: restURL + "/" + ids,
            //     dataType: 'json',
            //     async: false,
            //     success: function(data) {
            //         bool = true;
            //     },
            //     error: function(err) {}
            // });
            // console.log(restURL)
            if(restURL.indexOf("/?")>0){
                restURL = restURL.split("/?")[0];
            }
            if(restURL.indexOf("?")>0){
                restURL = restURL.split("?")[0];
            }
            // console.log(restURL.split("/?"))


            // console.log(restURL+"===="+ids)
            $.each(ids, function(index, id) {
                // console.log(restURL + "/" + id)
                $.ajax({
                    type: 'DELETE',
                    url: restURL + "/" + id,
                    dataType: 'json',
                    data:"{}",
                    async: false,
                    success: function(data) {
                        bool = true;
                    },
                    error: function(err) {}
                });
            });

            // console.log("JSON::"+JSON.stringify(ids))
            // $.ajax({
            //      type: 'POST',
            //      url: restURL + "/batch/delete",
            //      contentType: "application/json; charset=utf-8",
            //      dataType: 'json',

            //      data: JSON.stringify(ids),
            //      async: false,
            //      success: function(data) {
            //          bool = true;
            //      },
            //      error: function(err) {}
            //  });

            return bool;
        },

        count : function(restURL,queryJsonStr){
            var count = 0;
            $.ajax({
                type: 'get',
                url: restURL+"/?query="+encodeURIComponent(queryJsonStr),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async:false,
                success: function(data){
                    count=data.length;
                },
                error: function(err) {
                    // alert("find all err");
                }
            });
            return count;
        },

        postData: function(restURL,jsonData){
            var bool = false;
            $.ajax({
                type: 'POST',
                url:  restURL,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: jsonData,
                async: false,
                success: function(data) {
                    bool = true;
                },
                error: function(err) {}
            });
            return bool;
        },

        postDataR: function(restURL,jsonData){
            var resdata;
            $.ajax({
                type: 'POST',
                url:  restURL,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: jsonData,
                async: false,
                success: function(data) {
                    console.log(data)
                    resdata = data;
                },
                error: function(err) {}
            });
            return resdata;
        },

        str2json:function(jsonStr) {
            return eval("(" + jsonStr + ")");
        }
    };
}();///-----rest

/**
 * AJAX 遮罩
 * 必要参数 (isMask = true显示遮罩)
 * 2015-07-31 sync = false同步时, 浏览器会自己卡住画面
 * (无法显示遮罩, 建议改为非同步, 并且将後续程式写在ajax内)
 */
$(document).bind("ajaxSend", function(event, xhr, settings){
    if (settings.isMask) {
        Metronic.blockUI({
            target: '.container-fluid, .modal-dialog',
            boxed: true,
        });
    }
}).bind("ajaxComplete", function(event, xhr, settings){
    if (settings.isMask) {
        Metronic.unblockUI(".container-fluid, .modal-dialog");
    }
});

