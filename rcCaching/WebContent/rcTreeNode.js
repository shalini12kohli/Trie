
var maxLevel = 10;
var children = [];
var maxLevelCopy;
maxLevelCopy = maxLevel;
var rcTreeNode = function(client,plant,dcElement,rcKey,description,level){
      if(client && plant && dcElement && rcKey && description && level){
         this.client = client;
         this.plant = plant;
         this.dcElement = dcElement;
         this.rcKey = rcKey;
         this.description = description;
         this.level = level;
      }	 
      
      if(rcKey != null)
    	  addReasonCodeToTree(rcKey);
}

function addReasonCodeToTree(reasonCode){
	var currentLevelRCNode = reasonCode.getParentReasonCode();
	var nextLevelReasonCode = reasonCode;
	var nextLevelRCNode = findChild(nextLevelReasonCode);
	if(nextLevelRCNode == null)
	nextLevelRCNode = addNode(currentLevelRCNode,nextLevelReasonCode);	
}

    function addNode(parent,node){
	this.parent = parent;
	this.node = node;
    this.children = children;
    if(parent != null)
    	parent.addChildNode(this);
}
    
    function findChild(node){
		if(node!=null){
			if(children != null){
				for(var i=0;i<children.length;i++){
					if(node==children[i].node){
						return children;
					}
				}
			}
		}
		return null;
	}

this.addChildNode = function(rcKey){
	if(node!=null){
		if(children.length==0)
		 //children = [];
	if(children.indexOf(rcKey)<0)
		children.push(rcKey);
	}
}



