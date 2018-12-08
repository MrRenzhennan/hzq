var MonitorByCourt = function(initSimple) {
	var find_Court = $('#find_Court').val();
	var payDateS = $('#payDateS').val();
	if(initSimple!=null && initSimple!=undefined && initSimple!=""){
		 payDateS=initSimple;
		 $('#payDateS').val(payDateS);
	}
	$.ajax({
		url :  "json/monitor/Court.json",
		type : 'get',
		dataType : 'json',
		contentType : "application/json; charset=utf-8",
		async : true,
		success : function(data) {
			DataSummary.demo();
            var dataList="";
            var result="";
			// var drp = data.dataReportProportion;
			for(var i=0;i<data.length;i++){
				if(data[i]["courtId"]==find_Court){
                    dataList =data[i]["dataList"];
                    result =data[i]["result"];
                }
			}

			$("#avgTime").empty();
			$("#WorkCount").empty();
            var tablehtml = "";
            for (var i=0; i<result.length;i++){
				tablehtml += "<th>"+result[i]+"</th>"
			}
            $("#avgTime").append(tablehtml);
            var tablehtml;
			for (var i=0; i<result.length;i++){
				tablehtml = "<td>"+dataList[i]+"</td>"
				$("#WorkCount").append(tablehtml) 
			}	
			dataProvider = [];
			var dataObject;
			for (var i = 1; i < result.length; i++) {
				dataObject = {
						"process" : "",
						"litres" : ""
					};

                dataObject.process = result[i];
				var f = parseFloat(dataList[i]/dataList[0]*100).toFixed(2);
                dataObject.litres = f;

				dataProvider.push(dataObject);
			}
			DataSummary.demochar.dataProvider = dataProvider;
			DataSummary.demochar.validateData();
            MonitorByPerson();
		},
		error : function(err) {
		}
	});
}

var MonitorByPerson = function() {
    var dataProvider;
    var result;
    var find_Court = $('#find_Court').val();
    var payDateS = $('#payDateS').val();
    $.ajax({
        url :  "json/monitor/CourtPerPerson.json",
        type : 'get',
        dataType : 'json',
        contentType : "application/json; charset=utf-8",
        async : true,
        success : function(data) {
            result = data.getLoanAverageHours;
            dataProvider = [];
            var dataObject;
            for (var i = 0; i < data.length; i++) {
                if(data[i]["courtId"]==find_Court){
                    for(var j=0;j<data[i]["counts"].length;j++) {
                        dataObject = {
                            "category" : data[i]["counts"][j]["name"],
                            "column-1" : data[i]["counts"][j]["count"]
                        };

                        dataProvider.push(dataObject);
					}
				}
            }
            DataSummary.demochar9.dataProvider = dataProvider;
            DataSummary.demochar9.validateData();
        },
        error : function(err) {
        }
    });
}

var DataSummary = function () {
	return {
		demochar:null,
		demochar0:null,
		demochar1:null,
		demochar2:null,
		init: function () {
			this.initHelper();
			this.datetimeFormat();
			var b = new Date();
			var hours = b.getHours();
			var dif="";
			if(hours>=0 && hours<=2){
				dif = b.getTime() -2000*60*60*24;
			}else{
				 dif = b.getTime() -1000*60*60*24;
			}
			var initSimple=new Date(dif).format('yyyy-MM-dd');
            MonitorByCourt(initSimple);

			$('[data-toggle=tab]').click(function(){
				DataSummary.demochar.invalidateSize();
				DataSummary.demochar0.invalidateSize();
				DataSummary.demochar1.invalidateSize();
				DataSummary.demochar2.invalidateSize();
			})
	    },
	    initHelper:function(){

        },
		datetimeFormat:function(){ 
			if (jQuery().datetimepicker) {
                $(".form_datetime").datetimepicker({
                autoclose: true,
                format: "yyyy-mm-dd",
                todayBtn: true,
             });
            } 
            // ReportUtil.initDate("find_startTime", "find_endTime");
		},
		demo : function() {
			DataSummary.demochar = AmCharts.makeChart("chartdiv", {
			   	  "type": "pie",
				  "theme": "light",
				  "legend": {
					"align": "center",
					"markerType": "circle"
					},
					"titles": [
						{
							"text": "小区抄表数",
    						"size": 12
    					}
				  ],
				  "dataProvider": 
					  [ {
				    "process": "",
				    "litres":   0
					  }
				  ],
				  "valueField": "litres",				  
				  "titleField": "process",
				  "outlineAlpha": 0.4,
				  "depth3D": 10,
				  "balloonText": "[[title]]<br> ([[percents]]%)",
				  "angle": 20
			} );

            DataSummary.demochar9 = AmCharts.makeChart("chartdiv9", {
                "type": "serial",
                "categoryField": "category",
                "startDuration": 1,
                "theme": "default",
                "categoryAxis": {
                    "gridPosition": "start",
                    "labelRotation":"60"
                },
                "trendLines": [],
                "graphs": [
                    {
                        "balloonText": "[[title]]   [[column-1]]",
                        "fillAlphas": 1,
                        "id": "AmGraph-1",
                        "title": "抄表数/人",
                        "type": "column",
                        "valueField": "column-1"
                    }

                ],
                "guides": [],
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "title": ""
                    }
                ],
                "allLabels": [],
                "balloon": {},
                "legend": {
                    "useGraphSettings": true
                },
                "titles": [
                    {
                        "id": "Title-1",
                        "size": 15,
                        "text": "抄表员抄表数"
                    }
                ],
                "dataProvider": [
                    {
                        "category": "category 1",
                        "column-1": 0
                    }

                ]
            });

		}


	}
}();
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}