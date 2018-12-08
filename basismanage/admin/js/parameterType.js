var typeName = function(){
	return "<select id='parameterTypeName' name='parameterTypeName' class='form-control select2me'><option value='1'>技术参数</option><option value='2'>业务参数</option><option value='3'>流程参数</option></select>";
}

var ParameterType = function () {
	return {

		init: function () {
			this.initHelper();
	    	this.reload();
	    	this.cancelFilter();
	    },
		initHelper:function(){
			updatorHelper=RefHelper.create({
			ref_url: "gassysparametertype",
			ref_col:"parameterTypeId",
			ref_display:"updator",
		});

		$.map(updatorHelper.getData(), function(value, key) {
			$('#find_updator').append('<option value="'+key+'">'+value+'</option>');
		});

			operatorHelper=RefHelper.create({
				ref_url: "gassysparametertype",
				ref_col:"parameterTypeId",
				ref_display:"operator",
			});

			$.map(operatorHelper.getData(), function(value, key) {
				$('#find_operator').append('<option value="'+key+'">'+value+'</option>');
			});
			/*typeHelper=RefHelper.create({
				ref_url: "gassysparametertype",
				ref_col:"parameterTypeId",
				ref_display:"parameterTypeName",
			});

			$.map(typeHelper.getData(), function(value, key) {
				$('#find_parameterTypeId').append('<option value="'+key+'">'+value+'</option>');
			});
*/
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
	            restbase:'gassysparametertype',
	            key_column: "parameterTypeId",
	            //---------------行定义
	            coldefs: [	
	                        {
	                            col:"parameterTypeId",
	                            friendly: "参数类型ID",
                                validate:"required",
	                            unique: true,
								index:1
	                        },
	                        {
	                            col:"parameterTypeName",
	                            friendly: "参数类型名称",
                                format:GasSysBasic.parameterTypeNameFormat,
                                validate:"required",
                                inputsource: "custom",
                                inputbuilder: "typeName",
								index:2
	                        },
	                        /*{
	                            col:"createdTime", 
	                            friendly: "建立时间",
	                            nonedit:"nosend",
								index:3
	                        },
	                        {
	                            col:"operator", 
	                            friendly: "建立人",
	                            nonedit:"nosend",
								index:4
	                        },
	                       {
	                            col:"updatedTime", 
	                            friendly: "修改时间",
	                            nonedit:"nosend",
							   index:5
	                        },
	                        {
	                            col:"updator", 
	                            friendly: "修改人",
	                            nonedit:"nosend",
								index:6
	                        },*/
	                        {
	                            col:"remark", 
	                            friendly: "备注",
	                            //validate:"length[0-100]",
								index:7
	                        },                      
	                ],
	            //---------------查询时过滤条件
				findFilter: function(){
					var find_parameterTypeId /*, find_operator,find_updator*/;

					if($('#find_parameterTypeName option:selected').val())
					{
						find_parameterTypeId=RQLBuilder.equal("parameterTypeName",$('#find_parameterTypeName option:selected').val());
					}

					/*if($('#find_operator').val())
					{
						find_operator=RQLBuilder.like("operator",$('#find_operator').val());
					}
					if($('#find_updator').val())
					{
						find_updator=RQLBuilder.like("updator",$('#find_updator').val());
					}*/
					var filter=RQLBuilder.and([
						find_parameterTypeId /*, find_operator,find_updator*/
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
                }
	        })
		},

		cancelFilter:function(){ 
			$('.searchinput').on('input',function(e){
		        if(!e.target.value){
		            ParameterType.xw.autoResetSearch();
		        }
		    });
		},
    }
}();