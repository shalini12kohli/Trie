var Test = function(){
	this.main = function(){
		var client = "007";
		var plant = "1000";
		var dcElement = "unscheduled down";
		var level;
		
		var reasonCodes = [];
        reasonCodes.push(new ReasonCodes(client, plant, "1", "2", "3", "41", null, null, null, null, null, null));
        reasonCodes.push(new ReasonCodes(client, plant, "1", "2", "3", "42", null, null, null, null, null, null));
        reasonCodes.push(new ReasonCodes(client, plant, "1", "2", "3", "43", null, null, null, null, null, null));
        reasonCodes.push(new ReasonCodes(client, plant, "1", "2", "3", "44", "54", "64", "74", null, null, null));
        reasonCodes.push(new ReasonCodes(client, plant, "1", "2", "3", "44", "54", "65", null, null, null, null));

        for(var i=0;i<=reasonCodes.length;i++)
        	addReasonCodeToTrie(reasonCodes[i]);
       
	}
};