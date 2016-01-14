var oController;
var reasonCodeLink;
var jsonObject;
var reasonCodePropertyName;
var reasonCodeToolPopup;

var reasonCodeToolPopupLayout;
var rowRepeaterLayout;
var breadCrumbsLayout;
var backButton;
var selectedDCElementDescription;

var rcClient;
var rcPlant;
var rcNodeID;

var initialLevel = 4;
var totalLevels = 10;

var firstRCLevel;
var firstLevelReasonCodes;

var currentRCLevel;

var maxButtonsInARow = 4;
var maxRowsInAPage = 4;

var isRetrievedFromReasonCodeAssignment;
var isNextAndSelectOperationsAutomated;

var nextLevelReasonCodeButton;
var selectReasonCodeButton;
var selectAllReasonCodeButton;

var rootTimeElementTypes;
var currentSelectedTimeElementType;

var initialLevelReasonCodes;
var currentSelectedRCNode;
var currentRCLevel;
var currentSelectedRCNodes;

function RCNode(level, id, description, timeElementType, parent) {
	this.level = level;
	this.id = id;
	this.description = description;
	this.timeElementType = timeElementType;
	this.parent = parent;
	this.children = [];
	this.childrenRetrieved = false;
	this.isNextLevelAvailable = false;
	if (parent != undefined) {		
		this.parent.children.push(this);		
	}
	this.button = new sap.ui.commons.Button({
		text : this.description,
		customData : [
		              new sap.ui.core.CustomData({
		            	  key : "rcNode",
		            	  value : this
		              })
		              ],
		press : function(oEvent) {
			var button = oEvent.getSource();
			var node = button.getCustomData()[0].getValue();
			if (node != undefined) {
				currentSelectedRCNode = node;
				currentSelectedTimeElementType = getRootTimeElementType(node.timeElementType);
				currentRCLevel = node.level;				
				node.getNextLevel();
				showSelectButton(false);
				showNextLevelButton(false);
				selectNextLevel();	
			}
		}
	}).addStyleClass('reasonCodeButtons');
	this.checkBox = new sap.ui.commons.CheckBox({
		text : this.description,
		tooltip : this.description,
		checked : false,
		customData : [
		              new sap.ui.core.CustomData({
		            	  key : "rcNode",
		            	  value : this
		              })
		              ],
		change : function(oEvent) {
			var checkBox = oEvent.getSource();
			onSelectCheckBox(checkBox);	
		}
	});
}

RCNode.prototype.getDataOutput = function() {
	var reasonCodeData = {};
	var node = this;
	var nextLevel = this.level + 1;
	while (node != undefined) {
		reasonCodeData["reasonCode" + node.level] = node.id;
		node = node.parent;
	}
	
	for (var i = nextLevel; i <= totalLevels; i++) {
		reasonCodeData["reasonCode" + i] = "";
	}
	
	reasonCodeData.description = this.description;
	reasonCodeData.level = this.level;
	return reasonCodeData;
};

RCNode.prototype.getSiblings = function() {
	if (this.parent != undefined) {
		currentSelectedRCNode = this.parent;
		return this.parent.children;
	}	
};

RCNode.prototype.getNextLevel = function() {
	var showNextLevel = false;
	if (this.level < totalLevels) {
		if (!this.childrenRetrieved) {
			createNextLevelReasonCodeObjects(this, this.level + 1);
			showNextLevel = this.isNextLevelAvailable;
		} else {
			if (this.children.length > 0) {
				showNextLevel = true;
			}
		}
	}
	
	showNextLevelButton(showNextLevel);
};

RCNode.prototype.getBreadCrumbs = function() {
	var node = this;
	var reverseBCArray = [];

	if(node.level >= initialLevel) // Show Reason Code Back Button only if it's not in the initial level of the RC Heirarchy
		backButton.setVisible(true);
	else
		backButton.setVisible(false);
	
	while (	node != undefined && 
			node.level >= initialLevel) {
		
		var bcButton = new sap.ui.commons.Link({
			text : node.description,
			customData : [
			              new sap.ui.core.CustomData({
			            	  key : "rcNode",
			            	  value : node
			              })
			              ],
			press : function(oEvent) {
				var link = oEvent.getSource();
				var node = link.getCustomData()[0].getValue();
				/*
				 * If the level is the first displayed level, then load all the 
				 * reason codes for the time element type, and not just the 
				 * selected level's hierarchy.
				 * 
				 * Use the same logic on clicking the "Time Element" button.
				 * 
				 * Added on 27/03/2013. Added for SP03.
				 */
				if (node != undefined) {
					if (node.level == initialLevel) {
						var timeElementType = getRootTimeElementType(node.timeElementType);
						currentSelectedTimeElementType = timeElementType;
						currentSelectedRCNode = undefined;
						currentRCLevel = undefined;
						var filteredReasonCodeArray = timeElementType.filterFirstLevelReasonCodesByType();
						backButton.setVisible(false);
						createReasonCodeUI(filteredReasonCodeArray);
					} else {
						currentSelectedRCNode = node;
						currentRCLevel = node.level;
						var siblings = node.getSiblings();
						createReasonCodeUI(siblings);
					}	
				}	
			}
		});
		reverseBCArray.push(bcButton);
		
		var arrowTextView = new sap.ui.commons.TextView({
			text : " ---> "
		});
		reverseBCArray.push(arrowTextView);
		node = node.parent;
	}
	return reverseBCArray.reverse();
};

function RCTimeElementType(timeElementType) {
	this.type = timeElementType.timeElementType;
	this.description = timeElementType.description;
	this.nodes = [];
	this.button = new sap.ui.commons.Button({
		text : this.description,
		customData : [
		               new sap.ui.core.CustomData({
		            	   key : "timeElementType",
		            	   value : this
		               })
		              ],
		press : function(oEvent) {
			var button = oEvent.getSource();
			var timeElementType = button.getCustomData()[0].getValue();
			currentSelectedTimeElementType = timeElementType;
			currentSelectedRCNode = undefined;
			currentRCLevel = undefined;
			var filteredReasonCodeArray = timeElementType.filterFirstLevelReasonCodesByType();
			createReasonCodeUI(filteredReasonCodeArray);
		}
	}).addStyleClass('toolpopupButtons');
}

RCTimeElementType.prototype.addRCNode = function(node) {
	var isRCNodeAvailable = false;
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].id == node.id) {
			isRCNodeAvailable = true;
			break;
		}	
	}
	if (!isRCNodeAvailable) {
		this.nodes.push(node);
	}	
};

RCTimeElementType.prototype.filterFirstLevelReasonCodesByType = function() {
	var resultRCArray = [];
	for (var i = 0; i < firstLevelReasonCodes.length; i++) {
		var timeElementType = firstLevelReasonCodes[i].timeElementType.timeElementType;
		if (timeElementType != undefined) {
			if (timeElementType == this.type) {
				resultRCArray.push(firstLevelReasonCodes[i]);
			}
		}	
	}
	return resultRCArray;
};

function createNextLevelReasonCodeObjects(node, nextLevel) {
	var reasonCodeData = node.getDataOutput();	
	var nextLevelReasonCodeData = getNextLevelReasonCodes(
			reasonCodeData, 
			nextLevel);	
	node.childrenRetrieved = true;	
	if (nextLevelReasonCodeData != undefined) {
		if (nextLevelReasonCodeData.length > 0) {
			node.isNextLevelAvailable = true;			
			for (var i = 0; i < nextLevelReasonCodeData.length; i++) {
				var id = getReasonCodeID(nextLevelReasonCodeData[i], nextLevel);
				var description = getReasonCodeDescription(nextLevelReasonCodeData[i], nextLevel);
				var timeElementType = getReasonCodeTimeElementType(nextLevelReasonCodeData[i]);
				if (!isAlreadyAvailableChild(node, id)) {
					var childRCNode = new RCNode(nextLevel, id, description, timeElementType, node);
				}				
			}					
		}
	}
}

function createReasonCodeTree(reasonCodeData) {
	setRootTimeElementTypes(reasonCodeData);
	firstRCLevel = getInitialReasonCodeLevel(reasonCodeData[0]);
	currentRCLevel = firstRCLevel;
	for (var i = 0; i < reasonCodeData.length; i++) {
		for (var j = 2; j <= currentRCLevel; j++) {
			var parentNode = getParentRCNode(reasonCodeData[i], j);
			if (parentNode != undefined) {
				var id = getReasonCodeID(reasonCodeData[i], j);
				var description = getReasonCodeDescription(reasonCodeData[i], j);
				var timeElementType = getReasonCodeTimeElementType(reasonCodeData[i]);
				if (!isAlreadyAvailableChild(parentNode, id)) {
					var node = new RCNode(j, id, description, timeElementType, parentNode);
					if (j == firstRCLevel) {
						firstLevelReasonCodes.push(node);
					}
				}				
				parentNode.childrenRetrieved = true;					
			}
		}
	}
	createReasonCodeButtonsInitial();
}

function setRootTimeElementTypes(reasonCodeData) {
	for (var i = 0; i < reasonCodeData.length; i++) {
		var id = getReasonCodeID(reasonCodeData[i], 1);
		var description = getReasonCodeDescription(reasonCodeData[i], 1);
		var timeElementType = getReasonCodeTimeElementType(reasonCodeData[i]);
		var rootRCNode = getRootNode(timeElementType, id);
		if (rootRCNode == undefined) {
			var rcTimeElementType = getRootTimeElementType(timeElementType);
			if (rcTimeElementType == undefined) {
				rcTimeElementType = new RCTimeElementType(timeElementType);
				rootTimeElementTypes.push(rcTimeElementType);
			}
			rootRCNode = new RCNode(1, id, description, timeElementType, undefined);
			rcTimeElementType.addRCNode(rootRCNode);				
		}
	}	
}

function isAvailableRootTimeElementType(timeElementType) {
	var isRootTimeElementTypeAvailable = false;
	for (var i = 0; i < rootTimeElementTypes.length; i++) {
		if (timeElementType.timeElementType == rootTimeElementTypes[i].type) {
			isRootTimeElementTypeAvailable = true;
			break;
		}	
	}
	return isRootTimeElementTypeAvailable;
}

function getRootTimeElementType(timeElementType) {
	for (var i = 0; i < rootTimeElementTypes.length; i++) {
		if (timeElementType.timeElementType == rootTimeElementTypes[i].type) {
			return rootTimeElementTypes[i];
		}	
	}	
}

function getRootNode(timeElementType, rootNodeID) {
	for (var i = 0; i < rootTimeElementTypes.length; i++) {
		if (rootTimeElementTypes[i].type == timeElementType.timeElementType) {
			for (var j = 0; j < rootTimeElementTypes[i].nodes.length; j++) {
				if (rootTimeElementTypes[i].nodes[j].id == rootNodeID) {
					return rootTimeElementTypes[i].nodes[j];
				}
			}
		}
	}
}

function getChildNode(node, id) {
	var children = node.children;
	for (var i = 0; i < children.length; i++) {
		if (children[i].id == id) {
			return children[i];
		}
	}		
}

function isAlreadyAvailableChild(parent, childID) {
	var isChildNodeAvailable = false;
	var children = parent.children;
	for (var i = 0; i < children.length; i++) {
		if (children[i].id == childID) {
			isChildNodeAvailable = true;
			break;
		}	
	}
	return isChildNodeAvailable;
}

function getParentRCNode(reasonCode, childLevel) {
	var parentLevel = childLevel - 1;	
	var rootNodeID = getReasonCodeID(reasonCode, 1);
	var timeElementType = getReasonCodeTimeElementType(reasonCode);
	var rootNode = getRootNode(timeElementType, rootNodeID);
	if (rootNode != undefined) {
		if (parentLevel == 1) {
			return rootNode;
		} else {
			var parentNode = rootNode;
			for (var j = 2; j <= parentLevel; j++) {
				var id = getReasonCodeID(reasonCode, j);
				var node = getChildNode(parentNode, id);
				if (node != undefined) {
					if (parentLevel == j) {
						return node;
					}
					parentNode = node;
				}
			}
		}
	}
}

function createReasonCodeButtonsInitial() {
	clearReasonCodeToolPopupLayout();
	breadCrumbsLayout.setVisible(false);
	
	breadCrumbsLayout.rerender();
	currentRCLevel = firstRCLevel;
	if (rootTimeElementTypes.length > 1) {
		reasonCodeToolPopup.setTitle(oOEEBundle.getText("OEE_HEADING_SELECT_LOSS_TYPE"));
		var buttonsRow;
		for (var i = 0; i < rootTimeElementTypes.length; i++) {
			if (i % maxButtonsInARow == 0) {
				buttonsRow = new sap.ui.commons.layout.HorizontalLayout();
				rowRepeaterLayout.addRow(buttonsRow);
			}
			buttonsRow.addContent(rootTimeElementTypes[i].button);
		}
	} else {
		currentSelectedTimeElementType = rootTimeElementTypes[0];
		createReasonCodeUI(firstLevelReasonCodes);
	}
	reasonCodeToolPopupLayout.rerender();
}

function createReasonCodeUI(reasonCodeArray) {
	if (isNextAndSelectOperationsAutomated == true) {
		createReasonCodeButtons(reasonCodeArray);
	} else if (isNextAndSelectOperationsAutomated == false) {
		createReasonCodeCheckBoxes(reasonCodeArray);
	}	
}

function createReasonCodeButtons(reasonCodeArray) {
	clearReasonCodeToolPopupLayout();
	reasonCodeToolPopup.setTitle(oOEEBundle.getText("OEE_HEADING_SELECT_REASON_CODE"));
	createBreadCrumbsForSelectedRCNode();
	var buttonsRow;
	for (var i = 0; i < reasonCodeArray.length; i++) {
		if (i % maxButtonsInARow == 0) {
			buttonsRow = new sap.ui.commons.layout.MatrixLayout({
				columns : maxButtonsInARow
			});
			rowRepeaterLayout.addRow(buttonsRow);
			
			var row = new sap.ui.commons.layout.MatrixLayoutRow();
			buttonsRow.addRow(row);
		}		
		var cell = new sap.ui.commons.layout.MatrixLayoutCell();
		cell.addContent(reasonCodeArray[i].button);		
		row.addCell(cell);
	}	
}

function createReasonCodeCheckBoxes(reasonCodeArray) {
	clearReasonCodeToolPopupLayout();
	currentLevelRCNodes = [];
	
	reasonCodeToolPopup.setTitle(oOEEBundle.getText("OEE_HEADING_SELECT_REASON_CODE"));
	createBreadCrumbsForSelectedRCNode();
	
	var checkBoxesRow;
	for (var i = 0; i < reasonCodeArray.length; i++) {
		if (i % maxButtonsInARow == 0) {
			
			checkBoxesRow = new sap.ui.commons.layout.MatrixLayout({
				columns : maxButtonsInARow
			});
			rowRepeaterLayout.addRow(checkBoxesRow);
			
			if (i == 0) {
				selectAllReasonCodeButton = new sap.ui.commons.Button({
					text : oOEEBundle.getText("OEE_BTN_SELECT_ALL"),
					visible : true,
					press : function(oEvent) {
						selectAllReasonCodeCheckBoxes(reasonCodeArray);
					}
				}).addStyleClass('toolpopupButtons');
							
				var selectAllButtonRow = new sap.ui.commons.layout.MatrixLayoutRow();
				checkBoxesRow.addRow(selectAllButtonRow);
				
				var cell = new sap.ui.commons.layout.MatrixLayoutCell();
				cell.addContent(selectAllReasonCodeButton);		
				selectAllButtonRow.addCell(cell);
			}	
			
			var row = new sap.ui.commons.layout.MatrixLayoutRow();
			checkBoxesRow.addRow(row);
		}	
		
		if (reasonCodeArray[i].checkBox.getChecked() != false) {
			reasonCodeArray[i].checkBox.setChecked(false);
		}	
		
		var cell = new sap.ui.commons.layout.MatrixLayoutCell();
		cell.addContent(reasonCodeArray[i].checkBox);		
		row.addCell(cell);
	}	
}

function createBreadCrumbsForSelectedRCNode() {
	var breadCrumbsArray = [];
	if (currentSelectedTimeElementType != undefined) {
		breadCrumbsLayout.setVisible(true);
		if (rootTimeElementTypes.length > 1) {
			var timeElementTypeButton = new sap.ui.commons.Link({
				text : currentSelectedTimeElementType.description, 
				press : function(oEvent) {
					createReasonCodeButtonsInitial();
				}
			});
			breadCrumbsArray.push(timeElementTypeButton);
		} else {
			var timeElementTypeTextView = new sap.ui.commons.TextView({
				text : selectedDCElementDescription
			});
			breadCrumbsArray.push(timeElementTypeTextView);	
		}
	} else {
		breadCrumbsLayout.setVisible(false);
	}
	
	if (currentSelectedRCNode != undefined) {
		var rcBreadCrumbsArray = currentSelectedRCNode.getBreadCrumbs();
		breadCrumbsArray = breadCrumbsArray.concat(rcBreadCrumbsArray);
	}
	
	for (var i = 0; i < breadCrumbsArray.length; i++) {
		breadCrumbsLayout.addContent(breadCrumbsArray[i]);
	}	
}

function clearReasonCodeToolPopupLayout() {
	breadCrumbsLayout.removeAllContent();
	rowRepeaterLayout.removeAllRows();
	rowRepeaterLayout.setCurrentPage(1);
}

function destroyReasonCodeToolPopupLayout() {
	breadCrumbsLayout.destroyContent();
	rowRepeaterLayout.destroyRows();
	reasonCodeToolPopupLayout.destroyContent();
}

function getRCTimeElementTypeObjects(reasonCodeArray) {
	var timeElementTypeArray = [];
	for (var i = 0; i < reasonCodeArray.length; i++) {
		var timeElementType = getTimeElementTypeObject(timeElementTypeArray, reasonCodeArray[i].timeElementType);
		if (timeElementType == undefined) {
			timeElementType = new RCTimeElementType(reasonCodeArray[i].timeElementType);
			timeElementTypeArray.push(timeElementType);
		}		
		timeElementType.addRCNode(reasonCodeArray[i]);
	}
	
	return timeElementTypeArray;
}

function getTimeElementTypeObject(timeElementTypeArray, timeElementType) {
	for (var i = 0; i < timeElementTypeArray.length; i++) {
		if (timeElementTypeArray[i].timeElementType.timeElementType == timeElementType.timeElementType) {
			return timeElementTypeArray[i];
		}
	}
}

function checkCurrentSelectedRCNodesAndLoadChildren() {
	if (currentSelectedRCNodes != undefined) {
		if (currentSelectedRCNodes.length > 1) {
			showSelectButton(true);
			showNextLevelButton(false);
		} else if (currentSelectedRCNodes.length == 1) {
			var rcNode = currentSelectedRCNodes[0];
			currentSelectedRCNode = rcNode;
			rcNode.getNextLevel();
			showSelectButton(true);
			
			var showNextLevel = false;
			if (rcNode.children != undefined) {
				if (rcNode.children.length > 0) {
					showNextLevel = true;
				}	
			}
			
			showNextLevelButton(showNextLevel);
		} else {
			showSelectButton(false);
			showNextLevelButton(false);
		}	
	}	
}

function showSelectButton(show) {
	selectReasonCodeButton.setVisible(show);
	selectReasonCodeButton.rerender();
}

function showNextLevelButton(show) {
	nextLevelReasonCodeButton.setVisible(show);
	nextLevelReasonCodeButton.rerender();
}

function getNextLevelReasonCode() {
	if (currentSelectedRCNode != undefined) {
		if (currentSelectedRCNode.children.length > 0) {
			currentSelectedRCNodes = [];
			createReasonCodeUI(currentSelectedRCNode.children);
		}
	}
}

function selectAllReasonCodeCheckBoxes(reasonCodeArray) {
	if (reasonCodeArray != undefined) {
		for (var i = 0; i < reasonCodeArray.length; i++) {
			var checkBox = reasonCodeArray[i].checkBox;
			checkBox.setChecked(true);
			checkBox.rerender();
			onSelectCheckBox(checkBox);
		}	
	}
	
	showSelectButton(true);	
	if (reasonCodeArray.length > 1) {
		showNextLevelButton(false);
	}
}

function onSelectCheckBox(checkBox) {
	var rcNode = checkBox.getCustomData()[0].getValue();
	var checked = checkBox.getChecked();
	if (checked == true) {
		currentSelectedRCNodes.push(rcNode);
		checkCurrentSelectedRCNodesAndLoadChildren();
	} else if (checked == false) {
		if (currentSelectedRCNodes != undefined) {
			for (var i = 0; i < currentSelectedRCNodes.length; i++) {
				if (currentSelectedRCNodes[i] === rcNode) {
					currentSelectedRCNodes.splice(i, 1);
					break;
				}	
			}
			checkCurrentSelectedRCNodesAndLoadChildren();
		}	
	}
}

function selectAllCheckedReasonCodes() {
	if (currentSelectedRCNodes != undefined) {
		if (currentSelectedRCNodes.length > 0) {
			var multipleReasonCodes = [];
			for (var i = 0; i < currentSelectedRCNodes.length; i++) {
				var reasonCodeData = currentSelectedRCNodes[i].getDataOutput();
				multipleReasonCodes.push(reasonCodeData);
			}
			jsonObject[reasonCodePropertyName] = multipleReasonCodes;
			
			if (currentSelectedRCNodes.length > 1) {
				reasonCodeLink.setText(oOEEBundle.getText("OEE_TEXT_MULTIPLE"));
			} else if (currentSelectedRCNodes.length == 1){
				reasonCodeLink.setText(currentSelectedRCNodes[0].description);
			}	
		}
	}
	destroyReasonCodeToolPopupLayout();
	if (reasonCodeToolPopup != undefined) {
		reasonCodeToolPopup.close();
		reasonCodeToolPopup.destroy();
	}
}

function selectReasonCode() {
	if (currentSelectedRCNode != undefined) {
		var reasonCodeData = currentSelectedRCNode.getDataOutput();
		jsonObject[reasonCodePropertyName] = reasonCodeData;
		reasonCodeLink.setText(currentSelectedRCNode.description);
	}
	destroyReasonCodeToolPopupLayout();
	if (reasonCodeToolPopup != undefined) {
		reasonCodeToolPopup.close();
		reasonCodeToolPopup.destroy();
	}
}

function selectNextLevel() {
	if (currentSelectedRCNode != undefined) {
		if (currentSelectedRCNode.children.length > 0) {
			getNextLevelReasonCode();
		} else {
			selectReasonCode();
		}	
	}
}

function initialize(controller, client, plant, nodeID, dcElementDescription, link, jsonObj, rcPropertyName, selectionForAssignmentScreen, nextAndSelectOperationsAutomated) {
	oController = controller;
	rcClient = client;
	rcPlant = plant;
	rcNodeID = nodeID;
	reasonCodeLink = link;
	jsonObject = jsonObj;
	reasonCodePropertyName = rcPropertyName;
	selectedDCElementDescription = dcElementDescription;
	
	reasonCodeToolPopup = undefined;
	reasonCodeToolPopupLayout = undefined;
	rowRepeaterLayout = undefined;
	breadCrumbsLayout = undefined;
	isRetrievedFromReasonCodeAssignment = false;
	rootTimeElementTypes = [];
	currentSelectedRCNode = undefined;
	firstRCLevel = undefined;
	firstLevelReasonCodes = [];
	currentRCLevel = undefined;
	currentSelectedTimeelementType = undefined;
	currentSelectedRCNodes = [];
	isNextAndSelectOperationsAutomated = nextAndSelectOperationsAutomated;
}

function getInitialReasonCodeLevel(reasonCode) {
	if (isRetrievedFromReasonCodeAssignment) {
		for (var i = initialLevel; i <= totalLevels + 1; i++) {
			if (i > totalLevels) {
				return totalLevels;
			}
			
			var id = getReasonCodeID(reasonCode, i);
			if (id == undefined || id == '') {
				return (i - 1);
			}
		}		
	} else {
		return initialLevel;
	}
}

function getInitialReasonCodeLevelForReasonCodeAssignmentScreen(reasonCode) {
	for (var i = initialLevel; i <= totalLevels + 1; i++) {
		if (i > totalLevels) {
			return totalLevels;
		}	
		
		var id = getReasonCodeID(reasonCode, i);
		if (id == undefined || id == '') {
			return (i - 1);
		}
	}
}

function createReasonCodeToolPopup(controller, link, client, plant, nodeID, dcElement, jsonObj, rcPropertyName, callBackOnClose) {
	openReasonCodeToolPopupScreen(controller, link, client, plant, nodeID, dcElement,dcElementDescription, jsonObj, rcPropertyName, false, true, callBackOnClose);
}

function openReasonCodeToolPopupScreen(controller, link, client, plant, nodeID, dcElement,dcElementDescription, jsonObj, rcPropertyName, selectionForAssignmentScreen, nextAndSelectOperationsAutomated, callBackOnClose) {

	initialize(controller, client, plant, nodeID, dcElementDescription, link, jsonObj, rcPropertyName, selectionForAssignmentScreen, nextAndSelectOperationsAutomated);

	var reasonCodeData = getReasonCodeData( 
			dcElement,
			selectionForAssignmentScreen);

	if (reasonCodeData != undefined) {
		if (reasonCodeData.length > 0) {
			destroyIfAlreadyExists(oController, 'reasonCodeToolPopup');
			if(callBackOnClose != undefined)
			{
				reasonCodeToolPopup = new sap.ui.commons.Dialog( {
					id : oController.createId('reasonCodeToolPopup'),
					width : '70%',
					modal : true,
					closed : callBackOnClose
				});
			}
			else
			{
				reasonCodeToolPopup = new sap.ui.commons.Dialog( {
					id : oController.createId('reasonCodeToolPopup'),
					width : '70%',
					modal : true,
					wrapping : false
				});
			}
				
			reasonCodeToolPopupLayout = new sap.ui.commons.layout.VerticalLayout({
			});
			
			breadCrumbsLayout = new sap.ui.commons.layout.HorizontalLayout({
				allowWrapping : true
			});

			backButton = new sap.ui.commons.Button({
				text : oOEEBundle.getText("OEE_BTN_BACK"),
				visible : false,
				press : [function(oEvent){
							if(currentSelectedRCNode){
								var breadCrumbsArray = currentSelectedRCNode.getBreadCrumbs();
								if(breadCrumbsArray.length > 1)
								{
									currentSelectedRCNodes = [];
									breadCrumbsArray[breadCrumbsArray.length - 1].firePress({id: breadCrumbsArray[breadCrumbsArray.length - 1].getId()});
								}
							}
						},this]
			}).addStyleClass("toolpopupButtons");
			
			if (selectionForAssignmentScreen == false) {
				rowRepeaterLayout = new sap.suite.touch.RowRepeater({
					numberOfRows : maxRowsInAPage
				});
			} else if (selectionForAssignmentScreen == true) {
				rowRepeaterLayout = new sap.ui.commons.RowRepeater({
					numberOfRows : maxRowsInAPage
				});
			}
			
			reasonCodeToolPopupLayout.addContent(breadCrumbsLayout);
			reasonCodeToolPopupLayout.addContent(rowRepeaterLayout);	
			reasonCodeToolPopupLayout.addContent(backButton);	
			reasonCodeToolPopup.addContent(reasonCodeToolPopupLayout);
			
			selectReasonCodeButton = new sap.ui.commons.Button({
				text : oOEEBundle.getText("OEE_BTN_SELECT"),
				visible : false,
				press : function(oEvent) {
					if (isNextAndSelectOperationsAutomated == true) {
						selectReasonCode();
					} else if (isNextAndSelectOperationsAutomated == false) {
						selectAllCheckedReasonCodes();
					}					
				}
			}).addStyleClass('toolpopupButtons');
			  
			nextLevelReasonCodeButton = new sap.ui.commons.Button({
				text : oOEEBundle.getText("OEE_BTN_NEXT_LEVEL"), 
				visible : false, 
				press : function(oEvent) { 
					getNextLevelReasonCode();
					showNextLevelButton(false);
					showSelectButton(false);
				}
			}).addStyleClass('toolpopupButtons');			 

			reasonCodeToolPopup.addButton(selectReasonCodeButton);
			reasonCodeToolPopup.addButton(nextLevelReasonCodeButton);			
			
			reasonCodeToolPopup.open();			
			createReasonCodeTree(reasonCodeData);
		}
	}
}

function getReasonCodeData(selectedDCElement, selectionForAssignmentScreen) {

	var reasonCodeData;
	var reasonCodeDataRetrieved = false;

	/*
	 * Do not call reason code assignment if the reason code popup itself is for the assignment screen
	 */
	if (selectionForAssignmentScreen == false) {
		reasonCodeData = getRC(rcClient, rcPlant, rcNodeID, selectedDCElement);
		if (reasonCodeData != undefined) {
			if (reasonCodeData.length > 0) {
				reasonCodeDataRetrieved = true;
				isRetrievedFromReasonCodeAssignment = true;
			}
		}
	}

	if (reasonCodeDataRetrieved == false) {
		reasonCodeData = getReasonCodeForDCElement(rcClient, rcPlant,
				selectedDCElement);
	}

	if (reasonCodeData != undefined) {
		if (reasonCodeData.length > 0) {
			reasonCodeDataRetrieved = true;
		}
	}

	if (reasonCodeDataRetrieved == false) {
		reasonCodeData = getReasonCodeForDCElement(rcClient, rcPlant, "");
	}
	
	if (reasonCodeData != undefined) {
		if (reasonCodeData.length > 0) {
			reasonCodeDataRetrieved = true;
		}
	}

	if (reasonCodeDataRetrieved == false) {
		createMessage(oOEEBundle.getText("OEE_ERR_MSG_NO_RC"), sap.ui.core.MessageType.Error);
	}	

	return reasonCodeData;
}

function getReasonCodeID(reasonCode, currentLevel) {
	var id;
	if (reasonCode["reasonCode" + currentLevel]["reasonCode" + currentLevel]!= undefined) {
		id = reasonCode["reasonCode" + currentLevel]["reasonCode" + currentLevel];
	} else {
		id = reasonCode["reasonCode" + currentLevel];
	}
	return id;

}

function getReasonCodeTimeElementType(reasonCode) {
	/*
	 * Always pick the loss type from the initial level as it will be the same throughout the hierarchy
	 */
	var timeElementType;
	if (reasonCode["reasonCode" + initialLevel].ioTimeElements != undefined) {
		timeElementType = reasonCode["reasonCode" + initialLevel].ioTimeElements;
	} else {
		timeElementType = reasonCode.ioTimeElements;
	}
	return timeElementType;
}

function getReasonCodeDescription(reasonCode, currentLevel) {
	var buttonText;
	if (reasonCode["reasonCode" + currentLevel].description != undefined) {
		buttonText = reasonCode["reasonCode" + currentLevel].description;
	} else {
		buttonText = reasonCode.description;
	}
	return buttonText;
}

function getNextLevelReasonCodes(selectedReasonCodeData,
		nextLevel) {

	var reasonCodeData = getNextLevelRC(rcClient, rcPlant,
			selectedReasonCodeData.reasonCode1,
			selectedReasonCodeData.reasonCode2,
			selectedReasonCodeData.reasonCode3,
			selectedReasonCodeData.reasonCode4,
			selectedReasonCodeData.reasonCode5,
			selectedReasonCodeData.reasonCode6,
			selectedReasonCodeData.reasonCode7,
			selectedReasonCodeData.reasonCode8,
			selectedReasonCodeData.reasonCode9,
			selectedReasonCodeData.reasonCode10, nextLevel);
	return reasonCodeData;
}

function getReasonCodeString(reasonCodeData) {
	var outputString = "";
	var toLevel = getInitialReasonCodeLevel(reasonCodeData);
	for (var i = 1; i <= toLevel; i++) {
		outputString = outputString + getReasonCodeDescription(reasonCodeData, i);
		if (i != toLevel) {
			outputString = outputString + " -> ";
		}
	}
	return outputString;
}

function destroyIfAlreadyExists(oController, uiElementName) {
	var uiElement = oController.byId(uiElementName);
	if (uiElement != undefined) {
		uiElement.destroy();
	}
}