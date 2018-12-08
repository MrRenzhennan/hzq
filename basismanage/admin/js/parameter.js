

var typeHelper;

var fcsysparametertypeFM=function(){
    return {
        f: function(val){
            return typeHelper.getDisplay(val);
        },
    }
}();

var Parameter = function () {
	return {
		init: function () {
			this.initHelper();
	    	this.reload();
	    	this.cancelFilter();
	    },



	    initHelper:function(){
			parameterModelHelper=RefHelper.create({
				ref_url: "gassysparameter",
				ref_col:"parameterId",
				ref_display:"parameterModel",
			});

			$.map(parameterModelHelper.getData(), function(value, key) {
				$('#find_parameterModel').append('<option value="'+key+'">'+value+'</option>');
			});
			typeHelper=RefHelper.create({
			    ref_url: "gassysparametertype",
			    ref_col:"parameterTypeId",
			    ref_display:"parameterTypeName",
			});
			console.log(typeHelper)
			$.map(typeHelper.getData(), function(value, key) {
                console.log(value)
                if(value == 1){
                    value = "技术参数"
                }else if(value == 2){
                	value = "业务参数"
				}else if(value == 3){
                	value = "流程参数"
				}
		        $('#find_parameterTypeId').append('<option value="'+key+'">'+value+'</option>');
		    });

			// 2015-05-05
			// $('#find_parameterTypeId').select2({ placeholder: "请选择", maximumSelectionSize: 12 });
		},

		reload:function(){ 
		   	$('#divtable').html('');

		    this.xw=XWATable.init(
	        {
	        	divname: "divtable", 
	        	//----------------table的选项-------
	            pageSize: 10,                //Initial pagesize
	            columnPicker: true,         //Show the columnPicker button
	            transition: 'fade',  //(bounce, fade, flip, rotate, scroll, slide).
	            checkboxes: true,           //Make rows checkable. (Note. You need a column with the 'unique' property)
	            checkAllToggle:true,        //Show the check-all toggle//+RQLBuilder.like("KEYY", "a").rql()
	            //----------------基本restful地址---
	            restbase: 'gassysparameter',
	            key_column: "parameterId",
	            //---------------行定义
	            coldefs: [
	                        {
	                            col:"parameterId",
	                            friendly: "参数ID",
	                            unique: true,
	                            hidden:true,
	                            nonedit:"nosend",
								index:1
	                        },
	                        {
	                            col:"parameterTypeId",
	                            friendly: "参数类型ID",
	                            validate:"required,length[0-38]",
	                            // format:GasSysBasic.parameterTypeNameFormat,
	                            inputsource: "select",
	                            ref_url:"gassysparametertype",
                            	ref_name: "parameterTypeId",
                            	ref_value: "parameterTypeId",
                                unique: true,
								index:2
	                        },
	                        {
	                            col:"parameterModel",
	                            friendly: "参数模块",
	                            validate:"required,length[0-100]",
								index:3
	                        },
	                        {
	                            col:"parameterCode", 
	                            friendly: "参数码",
	                            validate:"required,length[0-50]",
								index:4
	                        },
	                        {
	                            col:"parameterName", 
	                            friendly: "参数名称",
	                            validate:"required,length[0-100]",
								index:5
	                        },
	                        {
	                            col:"parameterValue", 
	                            friendly: "参数值",
	                            validate:"required,length[0-50]",
								index:6
	                        },
/*
	                        {
	                            col:"createdTime",
	                            friendly: "建立时间",
								format:dateFormat,
	                            nonedit:"nosend",
								hidden:true,
								index:8
	                        },                      
	                        {
	                            col:"operator", 
	                            friendly: "建立人",
	                            nonedit:"nosend",
								hidden:true,
								index:9
	                        },
	                        {
	                            col:"updatedTime", 
	                            friendly: "修改时间",
								format:dateFormat,
	                            nonedit:"nosend",
								hidden:true,
								index:10
	                        },
	                        {
	                            col:"updator", 
	                            friendly: "修改人",
	                            nonedit:"nosend",
								hidden:true,
								index:11
	                        },*/
	                        { 
	                            col:"reservedField2",
	                            friendly: "备注",
								index:12,
								inputsource:"textarea",
								width: 50,
								heidht: 5
	                        },
	                ],
	            //---------------查询时过滤条件
				findFilter: function(){
					var find_parameterTypeId , find_parameterModel;

					if($('#find_parameterTypeId').val())
					{
						console.log($('#find_parameterTypeId').val())
						find_parameterTypeId=RQLBuilder.equal("parameterTypeId",$('#find_parameterTypeId').val());
					}

					if($('#find_parameterModel').val())
					{
						find_parameterModel=RQLBuilder.like("parameterModel",$('#find_parameterModel').val());
					}


					var filter=RQLBuilder.and([
						find_parameterTypeId , find_parameterModel,
					]);
					return filter.rql();
				},
	            onAdded: function(ret,jsondata){
	                return  validateForm(jsondata);
	            },
	            onUpdated: function(ret,jsondata){
	                return  validateForm(jsondata);
	            },
	            onDeleted: function(ret,jsondata){
	            },
	        })
		},

		cancelFilter:function(){ 
			$('.searchinput').on('input',function(e){
		        if(!e.target.value){
		            Parameter.xw.autoResetSearch();
		        }
		    });
		},
    }
}();