define([], function () {
	return {
		get: function (cname) {
		    var name = cname + "=",
		    	ca = document.cookie.split(';'),
		    	c;

		    for (var i = 0; i < ca.length; i++) {
		        c = ca[i];
		        while (c.charAt(0) == ' ') 
		        	c = c.substring(1);
		        if (c.indexOf(name) != -1) 
		        	return c.substring(name.length, c.length);
		    }
		    
		    return "";
		},
		set: function (cname, cvalue, exdays) {
			var d,
				expires;

			if (exdays) {
			    d = new Date();
			    d.setTime(d.getTime() + (exdays*24*60*60*1000));
			    expires = "expires="+d.toGMTString();
			}

		    document.cookie = cname + "=" + cvalue + "; " + (expires ? expires : "");
		}
	};
});