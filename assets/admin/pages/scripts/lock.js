var Lock = function () {

    return {
        //main function to initiate the module
        init: function () {

             $.backstretch([
		        "assets/admin/bg/1.jpg",
    		    "assets/admin/bg/2.jpg",
    		    "assets/admin/bg/3.jpg",
    		    "assets/admin/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		      });
        }

    };

}();