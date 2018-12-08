/**
 * Created by Administrator on 2017/4/20 0020.
 */

var AddMrdBookAction = function () {
    var xw ;

    return {
        init: function () {

            this.initBookTree();
            this.reload();
            this.initHelper();
            this.linkage();

        },
        initHelper:function(){
            $.map(GasModSys.areaHelper.getData(), function (value, key) {
                $('#modify_area').append('<option value="' + key + '">' + value + '</option>');
            });

            $('#modify_area').on('change', function (e) {
                console.log("change area:" + e + "." + $('#modify_area').val());
                GasModSys.counterUsersInArea({
                    "areaId": $('#modify_area').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data, function (idx, row) {
                            inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                        })
                        $("#modify_countper").html(inhtml);
                        $("#modify_countper").val("").change();

                    }
                })
            });

            $('#modify_countper').on('change', function (e) {
                console.log("change counter:" + e + "." + $('#modify_countper').val());
                GasModSys.copyUsersInArea({
                    "areaId": $('#modify_area').val(),
                    "countperId": $('#modify_countper').val(),
                    "cb": function (data) {
                        var inhtml = "<option value=''>全部</option>";
                        $.each(data, function (idx, row) {
                            inhtml += '<option value="' + row.userId + '">' + row.employeeName + '</option>';
                        })
                        $("#modify_serviceper").html(inhtml);
                        $("#modify_serviceper").val("").change();
                    }
                })
            })

        },
        reload:function(){

            $('#divtable').html('');
            xw=XWATable.init(
                {
                    divname : "divtable",
                    //----------------table的选项-------
                    pageSize : 10,
                    columnPicker : true,
                    transition : 'fade',
                    //checkboxes : true,
                    checkAllToggle : true,
                    //----------------基本restful地址---
                    restbase: 'gasmrdbook',
                    key_column:'bookId',
                    coldefs:[
                        {
                            col:"bookId",
                            friendly:"抄表本ID",
                            unique:true,
                            hidden:true,
                            nonedit:"nosend",
                            readonly:"readonly",
                            sorting:false,
                            index:1
                        },
                        {
                            col:"bookCode",
                            friendly:"抄表本编号",
                            nonedit:"nosend",
                            //  hidden:true,
                            readonly:"readonly",
                            index:2
                        },
                        {
                            col:"areaId",
                            friendly:"供气区域",
                            format:GasModSys.areaFormat,
                            inputsource: "select",
                            readonly:"readonly",
                            // disabled:true,
                            sorting:false,
                            index:5
                        },
                        {
                            col:"countperId",
                            friendly:"核算员",
                            format: GasModSys.employeeNameFormat,
                            inputsource: "select",
                            sorting:false,
                            index:3
                        },

                        {
                            col:"serviceperId",
                            friendly:"客户服务员",
                            format: GasModSys.employeeNameFormat,
                            inputsource: "select",
                            sorting:false,
                            index:4
                        },
                        {
                            col:"copyCycle",
                            friendly:"抄表周期",
                            format:GasModBas.copyCycleFormat,
                            sorting:false,
                            inputsource: "select",
                            index:6
                        },
                        {
                            col:"copyMonth",
                            friendly:"抄表月份",
                            sorting:false,
                            index:7
                        },
                        {
                            col:"copyRuleday",
                            friendly:"抄表例日",
                            sorting:false,
                            index:8
                        },
                        {
                            col:"propertyUnit",
                            friendly:"产权单位",
                            hidden:true,
                            sorting:false,
                            index:9
                        },
                        {
                            col:"doorCount",
                            friendly:"户数",
                            hidden:true,
                            readonly:"readonly",
                            sorting:false,
                            index:10
                        },
                        {
                            col:"oldBookNo",
                            friendly:"原本号",
                            sorting:false,
                            hidden:true,
                            readonly:"readonly",
                            index:11
                        },
                        {
                            col:"bookType",
                            friendly:"本类型",
                            format:GasModBas.bookTypeFormat,
                            sorting:false,
                            inputsource: "select",
                            readonly:"readonly",
                            index:12
                        },
                        {
                            col:"boosterCode",
                            friendly:"调压箱编号",
                            hidden:true,
                            sorting:false,
                            index:13
                        },
                        {
                            col:"dayMeasure",
                            friendly:"户日均用气量",
                            hidden:true,
                            sorting:false,
                            index:14
                        },
                        {
                            col:"address",
                            friendly:"抄表本地址",
                            hidden:true,
                            sorting:false,
                            //validate:""
                            index:16
                        },
                        {
                            col:"remark",
                            friendly:"备注",
                            hidden:true,
                            sorting:false,
                            index:17
                        }

                    ],
                    findFilter: function(){//find function
                        var queryUrl=hzq_rest+"gasmrdbook";
                        var querys=new Array()
                        if ($('#bookNumber').val()) {
                            querys.push(RQLBuilder.like("bookCode", $('#bookNumber').val()));
                        }

                        if ($('#bookAddress').val()) {
                            querys.push(RQLBuilder.like("bookAddress" , $('#bookAddress').val()));
                        }
                        if(querys.length>0){
                            queryUrl += "?query="+RQLBuilder.and(querys).rql();
                        }

                        xw.setRestURL(queryUrl);
                        return "";
                    }
                });

        },
        linkage:function(){
            var bookId;//book_code;

            //清除所有抄表例日
            $('#clear_all_btn').on('click',function(e){
                $('#modify_copymonth>div ul').empty();//初始化表单内容
            });
			
            $(document).on('click','#add_btn',function(e){
//          	var bd={
//	"cols":"book_code",
//	"froms":"gas_sys_book_code_unused",
//	"wheres":"status='0' and batch_id is null ",
//	"pages":false,
//	//"limit":50
//}
//				$.ajax({
//					dataType: 'json',//VDBCSEL000000J00&resp=bd&proxy=
//             		type: "get",
//                  async: false,
//                 	url: "/hzqs/dbc/pbsel.do?fh=VSELDBC000000J00&bd=" + encodeURIComponent(JSON.stringify(bd)),
//					contentType:"application/json; charset=utf-8;",
//                  success :function(data){
//                  		console.log(data);
//                  }
//
//				})

//update并返回值
//
//var builder = RQLBuilder.and([
//	RQLBuilder.equal("status","0"),
//	RQLBuilder.isnull("batchId")]).rqlnoenc();
//var hzqresurl = hzq_rest+'gassysbookcodeunused?fields={}&query='+builder;
//var resultb = Restful.findByPage(hzq_rest+'gassysbookcodeunused',builder,'true','10');//restURL, queryJsonStr, beginRow, rowNum
//
//console.log(resultb);
//var userid = UserInfo.userId();
//if(resultb && resultb[9]){
//	var codedata={
//		"batchId":(resultb[9]).bookCode+userid,
//		"bookCode":(resultb[9]).bookCode
//	}
//	var resulta = Restful.update(hzq_rest+'gassysbookcodeunused',(resultb[9]).bookCode,codedata);
//	if(resulta ){
////		book_code = (resultb[9]).bookCode;
//var bookcode= (resultb[9]).bookCode;
//		$("#modify_bookcode").val(bookcode);
//		book_code=$('#modify_bookcode').val();
//	}
//}
				
                //初始化标签

                //初始化日历选择器

                var mydate = new Date();
                $('#modify_planyear #modify_calendar').val((mydate.getMonth()+1)+'-'+mydate.getDate());

                $('#modify div.modal-body').css({"margin-bottom":"-40px"})

                $('#modify').css({'display':"block",'background':"rgba(0,0,0,0.3)"});
                $('#modify').attr("aria-hidden","false");
                $('#modify').addClass('in');


            });//end==update
            $('#modify_area').on('change',function(e){
                console.log("change area:"+e)
                var selected_areaid=e.currentTarget.selectedOptions[0].value;
                changeCounterAndServiceByAreadID(selected_areaid);

            })
            $(document).on("click",'.btn-default,.close',function(){
                $('#modify').css({'display':"none",'background':"none"});
                $('#modify').attr("aria-hidden","true");
                $('#modify').removeClass('in');
            });
            $('.close,.modal-footer .btn-default').on('click',function(){
               // $('#copymonth_ul>div ul li').remove();
                $('#modify_copymonth>div ul li').remove();
            });

           /* $('#add_booktype').on('change',function(e){
                var booktype = $('#')
            });*/
//          $("#modify_copycycle").on('change',function(e){ //抄表本类型和抄表周期联动
//              //居民：月抄，季抄，半年超，年超； 非居民：日抄，周抄，月抄
//              //1年抄 2半年抄 4季抄 7月抄 8周抄 9日抄
//              var twolevel_linkage = $('#add_copycycle option:selected').val();
//              if(twolevel_linkage != 7){
//                  $('#modify_copymonth>div').css('height','36px');
//              }else{
//                  $('#modify_copymonth>div').css('height','102px');
//              }
//          });
//          //抄表例日选择
//          var mydate = new Date();
//          $('#modify_planyear #modify_calendar').val((mydate.getMonth()+1)+'-'+mydate.getDate());
//          var i=0;
//          //选择日期添加到抄表日期
//          $('#modify_calendar').on('change',function(){
//              i++;
//              var twolevel_linkage = $('#modify_copycycle option:selected').val();
//              //年抄
//              console.log($('#modify_calendar').val());
//              if(twolevel_linkage == 1 && i%3 == 0){
//                  var str='<li class="select2-search-choice"><div>'+$(this).val()+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
//                  $('#modifyUl').append(str);
//                  var readDate = $('.reading-data li').length;
//                  console.log(readDate);
//                  for(var j = 0; j < readDate; j++){
//                      console.log(j)
//                      if(j >=1){
//                          $('#modifyUl li').eq(j).remove();
//                          alert('年抄只能选择一个日期');
//                      }
//                  }
//              }
//              //半年抄
//              if(twolevel_linkage == 2 && i%3 == 0){
//                  var str='<li class="select2-search-choice"><div>'+$(this).val()+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
//                  $('#modifyUl').append(str);
//                  var readDate = $('#modifyUl li').length;
//                  for(var j = 0; j < readDate; j++){
//                      console.log(j)
//                      if(j >=12){
//                          $('#modifyUl li').eq(j).remove();
//                          alert('最多能选12个');
//                      }
//                  }
//                  console.log(readDate);
//              }
//              //季抄
//              if(twolevel_linkage == 4 && i%3 == 0){
//                  var str='<li class="select2-search-choice"><div>'+$(this).val()+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
//                  $('#modifyUl').append(str);
//                  var readDate = $('#modifyUl li').length;
//                  for(var j = 0; j < readDate; j++){
//                      console.log(j)
//                      if(j >=12){
//                          $('#modifyUl li').eq(j).remove();
//                          alert('最多能选12个');
//                      }
//                  }
//                  console.log(readDate);
//              }
//              //月抄
//              if(twolevel_linkage == 7 && i%3 == 0){
//                  var str='<li class="select2-search-choice"><div>'+$(this).val()+'</div><a href="javascript:;" class="select2-search-choice-close"></a></li>';
//                  $('#modifyUl').append(str);
//                  var readDate = $('#modifyUl li').length;
//                  for(var j = 0; j < readDate; j++){
//                      console.log(j)
//                      if(j >=12){
//                          $('#modifyUl li').eq(j).remove();
//                          alert('最多能选12个');
//                      }
//                  }
//                  console.log(readDate);
//              }
//          });
//          //删除添加的抄表日期
//          $(document).on('click','.select2-search-choice-close',function(){
//              $(this).closest('li').remove();
//          });

            $("#modify_add").on('click',function(){
                if(!$('#modify_area option:selected').val()){
                    bootbox.alert("<br><center><h4>请选择供气区域</h4></center><br>");
                    return ;
                }
//              if((!$('#modify_bookcode').val()) || (!book_code)){
//              		bootbox.alert("<br><center><h4>请重新获取抄表本编号</h4></center><br>");
//              		return ;
//              }
//              //校验是否有本抄表本编号的本存在
//              var bookbuilder = RQLBuilder.and([
//              		RQLBuilder.equals("bookCode",book_code),
//              		RQLBuilder.equals("status",'1')
//              ]).rqlnoenc();
//              var resultc = Restful.findNQ(hzq_rest+'gasmrdbook',bookbuilder);
//              
//              if(resultc && resultc.length > 0){
//              		bootbox.alert("已存在此抄表本编号，请重新获取抄表本编号。");
//              		return;
//              }
               /* if(!$('#modify_countper option:selected').val()){
                    bootbox.alert("<br><center><h4>请选择核算员</h4></center><br>");
                    return ;
                }
                if(!$('#modify_serviceper option:selected').val()){
                    bootbox.alert("<br><center><h4>请选择客户服务员</h4></center><br>");
                    return ;
                }*/

//              var data = {};
//
//              var datearr = [];
//              var monthArr = [];
//              var dateArr = [];
//              console.log($('.reading-data li').length);
//              for(var i=0;i<$('.reading-data li').length;i++){
//                  var date = $('.reading-data li').eq(i).text();
//                  datearr.push(date);
//                  var a = datearr[i].split('-');
//                  monthArr.push(a[0]);
//                  dateArr.push(a[1]);
//              }
//              var li_length = $('.reading-data li').length;
//              for(var j=0;j<li_length -1;j++){//12个月,datearr进行切分，然后 根据顺序排序
//                  for(var i=0;i<11-li_length -1;i++){
//                      if(parseInt(monthArr[i]) > parseInt(monthArr[(i+1)])){
//                          var t = monthArr[(i+1)];
//                          var o = dateArr[(i+1)];
//                          monthArr[(i+1)] = monthArr[i];
//                          dateArr[(i+1)] = dateArr[i];
//                          monthArr[i] = t;
//                          dateArr[i] = o;
//                      }else{
//                          continue;
//                      }
//                  }
//              }

//              data.areaId = $('#modify_area option:selected').val();
//              data.countperId= $('#modify_countper option:selected').val();
//              data.serviceperId = $('#modify_serviceper option:selected').val();
//              data.copyCycle = $('#modify_copycycle option:selected').val();
               // data.copyMonth = monthArr.join();
//              data.copyRuleday = dateArr.join();
//              data.propertyUnit = $('#modify_propertyunit').val();
//              data.doorCount = $('#modify_doorcount').val();
//              data.oldBookNo = $('#modify_oldbookno').val();
//              data.bookType = $('#modify_booktype option:selected').val();
//              data.boosterCode = $('#modify_boostercode').val();
//              data.dailyMeasure = $('#modify_daymeasure').val();
//              data.remark = $('#modify_remark').val();
//              data.address = $('#modify_address').val();

              /*  data.areaid = $('#modify_area option:selected').val();
                data.countperid= $('#modify_countper option:selected').val();
                data.serviceperid = $('#modify_serviceper option:selected').val();
                data.copycycle = $('#modify_copycycle option:selected').val();
                data.copymonth = monthArr.join();
                data.copyruleday = dateArr.join();
                data.propertyunit = $('#modify_propertyunit').val();
                data.doorcount = $('#modify_doorcount').val();
                data.oldbookno = $('#modify_oldbookno').val();
                data.booktype = $('#modify_booktype option:selected').val();
                data.boostercode = $('#modify_boostercode').val();
                data.dailymeasure = $('#modify_daymeasure').val();
                data.remark = $('#modify_remark').val();
                data.address = $('#modify_address').val();*/
                //TODO belle 抄表本编号—— 暂时先定位 时间戳
               // var timestamp = Date.parse(new Date());
                //timestamp = timestamp / 1000;
                //data.bookCode = timestamp;
                
                //TODO 抄表本编号占用
//              $('#').on('click')
//				Restful.find
var bookjson = new Array();
console.log($('#modify_area option:selected').val());
console.log($('#modify_booktype').val())
var data = {};
data.area_id=$('#modify_area option:selected').val();
data.door_count=$('#modify_doorcount').val();
data.book_type=$('#modify_booktype option:selected').val();
data.created_by=UserInfo.userId();
data.countper_id = $('#modify_countper option:selected').val();
data.serviceper_id = $('#modify_serviceper option:selected').val();
bookjson.push(data);

 var batch_result = Restful.insert("/hzqs/sys/pbbbc.do?fh=SYSBBC0000000J00&resp=bd&bd",{
                "batchid":  $.md5("addbook"+new Date().getTime()),
                "count":1,
                "books":bookjson
           });
           console.log(batch_result);
           if(batch_result && batch_result.err_code=='0'){
           		bootbox.alert("<br><center><h4>添加成功，抄表本号为："+((batch_result.books)[0]).book_code+"</h4></center><br>");
           		
           		  $('#modify').css({'display':"none",'background':"none"});
                  $('#modify').attr("aria-hidden","true");
                  $('#modify').removeClass('in');
                  xw.update();
           }else{
           		 bootbox.alert("<br><center><h4>添加失败!</h4></center><br>");
           }
     
            });
        },

        initBookTree : function(){//初始化tree的时候只加载供气区域

            var restURL = "hzqs/pla/pbmyt.do?fh=MYTPLA0000000J00&resp=bd&bd={}";
            $.ajax({
                type : 'POST',
                url : restURL,
                cache : false,
                async : false,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify({"operator":"admin"}),
                success : function(data, textStatus, xhr) {
                    //console.log("okokfor tree");
                    var trform = Duster.buildArr($('#__dust_pbooktree'));
                    var tables = trform(data.myroot.nodes);
                    //console.log("tree="+tables)
                    $('#treetable').html(tables);
                    $('#tree_1').jstree({
                        "core" : {
                            "themes" : {
                                "responsive": false
                            }
                        },
                        "types" : {
                            "default" : {
                                "icon" : "fa fa-folder icon-state-warning icon-lg"
                            },
                            "file" : {
                                "icon" : "fa fa-file icon-state-warning icon-lg"
                            }
                        },
                        "plugins": ["types"]
                    });


                },
                error : function(err) {
                }
            });

            $("#tree_1").on('click','ul li a',function(e){
                //判断是供气区域，核算员还是抄表员

                var code_text = $(this).context.innerText;
                console.log(code_text);
                var middle_url = "";
                var code_id =  $(this).attr("data-id");
                var query_Url =hzq_rest+ "gasmrdbook/?";
                if(code_id == null) {//查询所有
                    xw.setRestURL(query_Url);
                    xw.update();
                    return "";
                }else if(code_text.indexOf("核算员") >= 0){

                    middle_url = "query={\"countperId\":\""+code_id +"\"}";
                }else if(code_text.indexOf("客户服务员") >= 0){

                    middle_url = "query={\"serviceperId\":\""+code_id +"\"}";
                }else{

                    middle_url = "query={\"areaId\":\""+code_id +"\"}";
                }

                if(middle_url.length > 0){
                    query_Url += middle_url;
                }
                xw.setRestURL(query_Url);
                xw.update();
                $('#book_tree').css({'display':'none'}).removeClass("active");

            })

            $(".ca_select_book").on('click',function(e){
                console.log("llloo")
                if(!$('#book_tree').hasClass("active"))
                {
                    $('#book_tree').css({
                        'position':'absolute',
                        'width':'auto',
                        'z-index':3,
                        'display':'block'}).addClass("active");
                }else{
                    $('#book_tree').css({
                        'display':'none'}).removeClass("active");
                }
                e.stopImmediatePropagation()
            });

            $(document).on('click',function (e) {
                console.log("!!!e.target.id=="+e.target.id)
                if(e.target&&e.target.id!='btn_select_book'&&e.target.id!='i_select_book')
                {
                    var isinside = (e.target.id=='book_tree');
                    $(e.target).parents().each(function(id,row) {
                        if(row.id=='book_tree'||$(row).hasClass('jstree-ocl')||$(row).hasClass('jstree-icon')||$(row).hasClass('jstree-node')){
                            isinside = true;
                        }
                    })
                    if(!isinside){
                        console.log("not inside")

                        $(".select2-chosen").each(function(dx,f){$(f).select2("close")})
                        if($('#book_tree').hasClass("active"))
                        {
                            $('#book_tree').css({
                                'display':'none'}).removeClass("active");
                        }
                    }
                    //console.log("e.target.id=="+e.target.id)
                }

            });



        },
     };
}();