var rolemutexAction = function () {



    return {

        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            //this.initHelper();
            this.reload();
        },



        reload:function(){

            $('#divtable').html('');

            this.xw=XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize:10,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle:true,
                    //----------------基本restful地址---
                    restbase: 'fcsysrolemutex',
                    key_column:'roleMutexId',
                    coldefs:[

                        {
                            col:"roleIdA",
                            friendly:"角色A",
                            index:1
                        },
                        {
                            col:"roleMutexId",
                            friendly:"角色互斥ID",
                            unique:"true",
                            hidden:true,
                            readonly:"readonly",
                            nonedit:"nosend",
                            index:2
                        },
                        {
                            col:"roleIdB",
                            friendly:"角色B",
                            index:3
                        },
                        {
                            col:"status",
                            friendly:"状态",
                            index:4
                        },

                    ],
                    // 查询过滤条件
                    findFilter: function(){
                        var find_areaId , find_unitname;

                        if($('#find_areaId').val())
                        {
                            find_areaId=RQLBuilder.equal("areaId",$('#find_areaId').val());
                        }

                        if($('#find_unitname').val())
                        {
                            find_unitname=RQLBuilder.like("unitname",$('#find_unitname').val());
                        }

                        var filter=RQLBuilder.and([
                            find_areaId , find_unitname
                        ]);
                        return filter.rql();
                    },

                    onAdded: function(ret,jsondata){

                    },

                    onUpdated: function(ret,jsondata){

                    },

                    onDeleted: function(ret,jsondata){
                    },
                }) //--init
        },

    }
}();
