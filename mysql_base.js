var Client = require('mysql').Client,
    client = new Client();
    client.port = 3306;  
    client.user = 'root'; 
    client.password = 'howrunow'; 
//    client.connect();

	// select the database
    client.query('USE lists'); 

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
