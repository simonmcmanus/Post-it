var Client = require('mysql').Client,
    client = new Client();
    client.port = 3306;  
    client.user = 'root'; 
    client.password = ''; 
    client.connect();
    // use the correct database
    client.query('USE lists'); // change this

	var query = function(query, params, callback) {
		client.query(query, 
			function selectCb(err, results, fields) {
		    	if (err) {
		      		throw err;
		    	}
				if(callback){
					callback(results, params);
				}
			}
		);		
	}
	
	exports.query = query;
