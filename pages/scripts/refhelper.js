var RefHelper  = function () {

    /*var cacheItem={}*/;
    //var options;
    var cacheItem = {};
    var pendingRefs = {};

    return {
        getRef:function(jsonOpts){
            var ref_col=jsonOpts["ref_col"];
            var ref_dis=jsonOpts["ref_display"];
            var ref_id=jsonOpts["ref_id"];
            var dataformat=jsonOpts["dataformat"];
            var async=jsonOpts["async"];
            if(!async)async=true;
            var url;
            if(ref_id)
                url = jsonOpts["ref_url"]+"/"+ref_id;
            else{
                url = jsonOpts["ref_url"];
            }
            if(!url.startsWith(hzq_rest)&&!url.startsWith("/hzqs/")){
                url = hzq_rest+ url
            }
            if(cacheItem[url]){
                console.log("cacheItem:"+url)
                var inval = cacheItem[url];
                if(dataformat){
                    inval = dataformat.format(inval,data[ref_dis],ref_col,data)
                }
                if(jsonOpts["ref_div"])jsonOpts["ref_div"].html(inval)

                if(jsonOpts["ref_div_id"]&&$(jsonOpts["ref_div_id"]))$(jsonOpts["ref_div_id"]).val(inval)

                return inval
            }
            //console.log("getRef:"+ref_id)
            if(pendingRefs[url+ref_dis]&&(jsonOpts["ref_div"]||jsonOpts["ref_div_id"])){
                //console.log("add to pending:"+url+ref_dis+"<");
                if(jsonOpts["ref_div"])pendingRefs[url+ref_dis].push(jsonOpts);            
                //if(jsonOpts["ref_div_id"]&&$(jsonOpts["ref_div_id"]))pendingRefs[url+ref_dis].push($(jsonOpts["ref_div_id"]));
            }else{
                pendingRefs[url+ref_dis]=new Array();
                var return_value = ref_id
                $.ajax({
                        url: Utils.queryURL(url)+'fields={"'+ref_dis+'":1}',
                        dataType: 'json',
                        async: async,
                    }).done(function(data,retcode) {
                       // console.log("getdata::"+JSON.stringify(data))
                        if(data&&data.length){
                            data = data[0];
                        }                       
                        if(data&&data[ref_dis]){
                            if(jsonOpts["ref_url"]=="gassysuser"&&ref_id=="admin"&&data[ref_dis]=="No_Name"){
                                data[ref_dis]="admin";
                            }
                            cacheItem[url] = data[ref_dis]                           
                        }else{
                            cacheItem[url]=ref_id;
                        }

                        var inval = cacheItem[url];
                        if(dataformat){
                            inval = dataformat.format(cacheItem[url],data[ref_dis],ref_col,data)
                        }

                        if(jsonOpts["ref_div"])jsonOpts["ref_div"].html(inval)
                        if(jsonOpts["ref_div_id"]&&$(jsonOpts["ref_div_id"]))$(jsonOpts["ref_div_id"]).val(inval)
                        return_value = inval;
                        pendingRefs[url+ref_dis].forEach(function(pendingOpts){
                            var item = pendingOpts["ref_div"];
                            if(!item) item = $(pendingOpts["ref_div_id"])
                            var pendingdf = pendingOpts["dataformat"]
                            if(item)
                            {
                                var inval = cacheItem[url];

                                if(pendingdf){
                                    console.log("pendingRefs:"+",df="+pendingdf.key)
                                    inval = pendingdf.format(inval,data[ref_dis],ref_col,data)
                                }

                                if(item.is('input'))item.val(inval)
                                else item.html(inval)
                            }
                        })
                        delete pendingRefs[url+ref_dis];
                });

                return return_value;
            }

        },
        //main function to initiate the module
        create: function (jsonOpts) {
            var publ={};
            var cacheItem={};
            var rawItem=null;
            //options=jsonOpts;
            var ref_name=jsonOpts["ref_col"];
            var ref_val=jsonOpts["ref_display"];
            var sort = jsonOpts["sort"];
            var url = Utils.queryURL(hzq_rest+ jsonOpts["ref_url"])+'fields={"'+ref_name+'":1,"'+ref_val+'":1}';
            if (sort) {
                url += "&sort=" + sort;
            }
            $.ajax({
                url: url,
                dataType: 'json',
                async: false,
            }).done(function(data,retcode) {
                //console.log("rest:data="+JSON.stringify(data)+",retcode="+retcode)
                    rawItem=data;
                    $.each(data, function(index, val) {
                        if(val[ref_name]==0 || val[ref_name])
                        {
                            cacheItem[val[ref_name]]=val[ref_val];
                        }
                    });
            }).fail(function(err,textStatus) {
                console.log( "error:" + JSON.stringify(err) +",status="+textStatus);
                if( err.status==401){
                    //need to login
                    if(window.location.pathname.indexOf('/login.html')<0)
                    {
                        window.location.replace("/login.html?redirect="+window.location.pathname);
                    }

                }
                
              });

            publ.getDisplay=function(key){
                if(cacheItem[key]) return cacheItem[key];
                return key;
            };
            publ.getData=function(){
                return cacheItem;
            };
            publ.getRawData=function(){
                return rawItem;
            };
            publ.getEVal=function(){

                var ev = "";
                $.each(cacheItem,function(k,v){
                    if(ev.length>0) ev+=","
                    ev += k+":"+v;
                })
                return ev;
            
            }
            return  publ;
        },
        create2: function (jsonOpts) {
            var publ={};
            var cacheItem={};
            var rawItem=null;
            //options=jsonOpts;
            var ref_name=jsonOpts["ref_col"];
            var ref_val=jsonOpts["ref_display"];
            var sort = jsonOpts["sort"];
            var url = Utils.queryURL(hzq_rest+ jsonOpts["ref_url"])+'fields={"'+ref_name+'":1,"'+ref_val+'":1}';
            if (sort) {
                url += "&sort=" + sort;
            }
            $.ajax({
                url: url,
                dataType: 'json',
                async: true,
            }).done(function(data,retcode) {
                //console.log("rest:data="+JSON.stringify(data)+",retcode="+retcode)
                    rawItem=data;
                    $.each(data, function(index, val) {
                        if(val[ref_name]==0 || val[ref_name])
                        {
                            cacheItem[val[ref_name]]=val[ref_val];
                        }
                    });
            }).fail(function(err,textStatus) {
                console.log( "error:" + JSON.stringify(err) +",status="+textStatus);
                if( err.status==401){
                    //need to login
                    if(window.location.pathname.indexOf('/login.html')<0)
                    {
                        window.location.replace("/login.html?redirect="+window.location.pathname);
                    }

                }

              });

            publ.getDisplay=function(key){
                if(cacheItem[key]) return cacheItem[key];
                return key;
            };
            publ.getData=function(){
                return cacheItem;
            };
            publ.getRawData=function(){
                return rawItem;
            };
            publ.getEVal=function(){

                var ev = "";
                $.each(cacheItem,function(k,v){
                    if(ev.length>0) ev+=","
                    ev += k+":"+v;
                })
                return ev;

            }
            return  publ;
        },
    };




}();

