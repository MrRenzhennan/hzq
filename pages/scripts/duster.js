var Duster = function(){

	return {
		buildArr:function(tmplEle){
			var buildingTemplate = dust.compile(tmplEle.html(),"_dust_"+tmplEle.id);
            dust.loadSource(buildingTemplate);
            return function(building,extprops) { 
                var result;   
                dust.render("_dust_"+tmplEle.id, {"data":building,"extprops":extprops}, function(err, res) {
                result = res;
              });   
              return result;
            };
		}//init


	};//return

}();