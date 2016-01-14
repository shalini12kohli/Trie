jQuery.sap.declare("sap.oee.ui.rcUtility");
sap.oee.ui.rcUtility = {};
sap.oee.ui.rcUtility.callBackOnClose = null;

var oController;
var reasonCodeLink;
var jsonObject;
var rcElementType;
var reasonCodePropertyName;
var reasonCodeToolPopup;

//var reasonCodeToolPopupLayout;
var reasonCodeList;
var oRCSearchField;
var dcElementType;
var dataCollectionElement;
var breadCrumbsLayout;
var backButton;

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

var reasonCodeAssigned = [];

sap.oee.ui.rcUtility.RCNode = function(level, id, description, timeElementType, parent) {             
                this.level = level;
                this.id = id;
                this.description = description;
                this.timeElementType = timeElementType;
                this.parent = parent;
                this.children = [];
                this.childrenRetrieved = false;
                this.isNextLevelAvailable = false;
                this.isInitialRCNode = false;
                var oType = "Active";
                if (parent != undefined) {                             
                                this.parent.children.push(this);
                }
                this.rcStandardListItem = new sap.m.StandardListItem({
                                title : this.description,
                                type : oType,
                                customData : [
                                              new sap.ui.core.CustomData({
                                                  key : "rcNode",
                                                  value : this
                                              })
                                              ],
                                press : function(oEvent) {
                                                var rcStandardListItem = oEvent.getSource();
                                                var node = rcStandardListItem.getCustomData()[0].getValue();
                                                if (node != undefined) {
                                                                currentSelectedRCNode = node;
                                                                currentSelectedTimeElementType = sap.oee.ui.rcUtility.getRootTimeElementType(node.timeElementType);
                                                                currentRCLevel = node.level;                                                     
                                                                node.getNextLevel();
                                                                sap.oee.ui.rcUtility.showSelectButton(false);
                                                                sap.oee.ui.rcUtility.showNextLevelButton(false);
                                                                sap.oee.ui.rcUtility.selectNextLevel();   
                                                }
                                }
                }); //.addStyleClass('reasonCodeButtons');
                this.checkBox = new sap.m.CheckBox({
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
};

sap.oee.ui.rcUtility.RCNode.prototype.getDataOutput = function() {
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

sap.oee.ui.rcUtility.RCNode.prototype.getSiblings = function() {
                if (this.parent != undefined) {
                                currentSelectedRCNode = this.parent;
                                return this.parent.children;
                }              
};

sap.oee.ui.rcUtility.RCNode.prototype.getNextLevel = function() {
                var showNextLevel = false;
                if (this.level < totalLevels) {
                                if (!this.childrenRetrieved) {
                                                sap.oee.ui.rcUtility.createNextLevelReasonCodeObjects(this, this.level + 1);
                                                showNextLevel = this.isNextLevelAvailable;
                                } else {
                                                if (this.children.length > 0) {
                                                                showNextLevel = true;
                                                }
                                }
                }
                
                sap.oee.ui.rcUtility.showNextLevelButton(showNextLevel);
};

sap.oee.ui.rcUtility.RCNode.prototype.getBreadCrumbs = function() {
                var node = this;
                var reverseBCArray = [];
                var isAssigned = false;
                //var breadCrumbsArray = [];
                
                if(node.level >= initialLevel) // Show Reason Code Back Button only if it's not in the initial level of the RC Heirarchy
                                backButton.setVisible(true);
                else
                                backButton.setVisible(false);
                
                while (  node != undefined && 
                                                node.level >= initialLevel) {
                               
                                var bcButton = new sap.m.Text({
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
                                                                
                                                //breadCrumbsArray.push(timeElementTypeTextView);
                                                
                                                                                
                                                                if (node != undefined) {
                                                                                if (node.level == initialLevel) {
                                                                                                var timeElementType = sap.oee.ui.rcUtility.getRootTimeElementType(node.timeElementType);
                                                                                                currentSelectedTimeElementType = timeElementType;
                                                                                                currentSelectedRCNode = undefined;
                                                                                                currentRCLevel = undefined;
                                                                                                var filteredReasonCodeArray = timeElementType.filterFirstLevelReasonCodesByType();
                                                                                                backButton.setVisible(false);
                                                                                                sap.oee.ui.rcUtility.createReasonCodeUI(filteredReasonCodeArray);
                                                                                } else {
                                                                                                currentSelectedRCNode = node;
                                                                                                currentRCLevel = node.level;
                                                                                                var siblings = node.getSiblings();
                                                                                                sap.oee.ui.rcUtility.createReasonCodeUI(siblings);
                                                                                }              
                                                                }              
                                                                for(var i = 0; i <= reasonCodeAssigned.length; i++){
                               if(node == reasonCodeAssigned[i]){
                                               backButton.setVisible(false);
                                               breadCrumbsLayout.setVisible(false);
                               }
                                                                }
                            
                                                }
                                });
                                /*}
                                else{
                                                var bcButton = new sap.m.Text({
                                                                text: node.description 
                                                });
                                }
                                isAssigned = false;*/
                                reverseBCArray.push(bcButton);
                                
                                var arrowTextView = new sap.ui.core.Icon({
                                                src : "sap-icon://feeder-arrow"
                                }).addStyleClass("iconPaddingRCPopup");
                                
                                reverseBCArray.push(arrowTextView);
                                node = node.parent;
                                                                   
                                                
                }
                return reverseBCArray.reverse();
};

sap.oee.ui.rcUtility.RCTimeElementType = function(timeElementType) {
                this.type = timeElementType.timeElementType;
                this.description = timeElementType.description;
                this.nodes = [];
                this.button = new sap.m.Button({
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
                                                sap.oee.ui.rcUtility.createReasonCodeUI(filteredReasonCodeArray);
                                }
                }); //.addStyleClass('toolpopupButtons');
};

sap.oee.ui.rcUtility.RCTimeElementType.prototype.addRCNode = function(node) {
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

sap.oee.ui.rcUtility.RCTimeElementType.prototype.filterFirstLevelReasonCodesByType = function() {
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

sap.oee.ui.rcUtility.createNextLevelReasonCodeObjects = function(node, nextLevel) {
                var reasonCodeData = node.getDataOutput();   
                var nextLevelReasonCodeData = sap.oee.ui.rcUtility.getNextLevelReasonCodes(
                                                reasonCodeData, 
                                                nextLevel);         
                node.childrenRetrieved = true; 
                if (nextLevelReasonCodeData != undefined) {
                                if (nextLevelReasonCodeData.length > 0) {
                                                node.isNextLevelAvailable = true;                                           
                                                for (var i = 0; i < nextLevelReasonCodeData.length; i++) {
                                                                var id = sap.oee.ui.rcUtility.getReasonCodeID(nextLevelReasonCodeData[i], nextLevel);
                                                                var description = sap.oee.ui.rcUtility.getReasonCodeDescription(nextLevelReasonCodeData[i], nextLevel);
                                                                var timeElementType = sap.oee.ui.rcUtility.getReasonCodeTimeElementType(nextLevelReasonCodeData[i]);
                                                                if (!sap.oee.ui.rcUtility.isAlreadyAvailableChild(node, id)) {
                                                                                var childRCNode = new sap.oee.ui.rcUtility.RCNode(nextLevel, id, description, timeElementType, node);
                                                                }                                                              
                                                }                                                                              
                                }
                }
};

sap.oee.ui.rcUtility.createReasonCodeTree = function(reasonCodeData) {
                sap.oee.ui.rcUtility.setRootTimeElementTypes(reasonCodeData);
                var k = 0;              
                for (var i = 0; i < reasonCodeData.length; i++) {
                                firstRCLevel = sap.oee.ui.rcUtility.getInitialReasonCodeLevel(reasonCodeData[i]);
                                this.currentRCLevel = firstRCLevel;
                                for (var j = 2; j <= this.currentRCLevel; j++) {
                                                var parentNode = sap.oee.ui.rcUtility.getParentRCNode(reasonCodeData[i], j);
                                                if (parentNode != undefined) {
                                                                var id = sap.oee.ui.rcUtility.getReasonCodeID(reasonCodeData[i], j);
                                                                var description = sap.oee.ui.rcUtility.getReasonCodeDescription(reasonCodeData[i], j);
                                                                var timeElementType = sap.oee.ui.rcUtility.getReasonCodeTimeElementType(reasonCodeData[i]);
                                                                if (!sap.oee.ui.rcUtility.isAlreadyAvailableChild(parentNode, id)) {
                                                                                var node = new sap.oee.ui.rcUtility.RCNode(j, id, description, timeElementType, parentNode);
                                                                                if (j == firstRCLevel) {
                                                                                                firstLevelReasonCodes.push(node);
                                                                                                reasonCodeAssigned[k] = node;
                                                                                                k++;
                                                                                }
                                                                }                                                              
                                                                parentNode.childrenRetrieved = true;                                                                   
                                                }
                                }
                }
                sap.oee.ui.rcUtility.createReasonCodeButtonsInitial();
};

sap.oee.ui.rcUtility.setRootTimeElementTypes = function(reasonCodeData) {
                for (var i = 0; i < reasonCodeData.length; i++) {
                                var id = sap.oee.ui.rcUtility.getReasonCodeID(reasonCodeData[i], 1);
                                var description = sap.oee.ui.rcUtility.getReasonCodeDescription(reasonCodeData[i], 1);
                                var timeElementType = sap.oee.ui.rcUtility.getReasonCodeTimeElementType(reasonCodeData[i]);
                                var rootRCNode = sap.oee.ui.rcUtility.getRootNode(timeElementType, id);
                                if (rootRCNode == undefined) {
                                                var rcTimeElementType = sap.oee.ui.rcUtility.getRootTimeElementType(timeElementType);
                                                if (rcTimeElementType == undefined) {
                                                                rcTimeElementType = new sap.oee.ui.rcUtility.RCTimeElementType(timeElementType);
                                                                rootTimeElementTypes.push(rcTimeElementType);
                                                }
                                                rootRCNode = new sap.oee.ui.rcUtility.RCNode(1, id, description, timeElementType, undefined);
                                                rcTimeElementType.addRCNode(rootRCNode);                                                                
                                }
                }              
};

sap.oee.ui.rcUtility.isAvailableRootTimeElementType = function(timeElementType) {
                var isRootTimeElementTypeAvailable = false;
                for (var i = 0; i < rootTimeElementTypes.length; i++) {
                                if (timeElementType.timeElementType == rootTimeElementTypes[i].type) {
                                                isRootTimeElementTypeAvailable = true;
                                                break;
                                }              
                }
                return isRootTimeElementTypeAvailable;
};

sap.oee.ui.rcUtility.getRootTimeElementType = function(timeElementType) {
                for (var i = 0; i < rootTimeElementTypes.length; i++) {
                                if (timeElementType.timeElementType == rootTimeElementTypes[i].type) {
                                                return rootTimeElementTypes[i];
                                }              
                }              
};

sap.oee.ui.rcUtility.getRootNode = function(timeElementType, rootNodeID) {
                for (var i = 0; i < rootTimeElementTypes.length; i++) {
                                if (rootTimeElementTypes[i].type == timeElementType.timeElementType) {
                                                for (var j = 0; j < rootTimeElementTypes[i].nodes.length; j++) {
                                                                if (rootTimeElementTypes[i].nodes[j].id == rootNodeID) {
                                                                                return rootTimeElementTypes[i].nodes[j];
                                                                }
                                                }
                                }
                }
};

sap.oee.ui.rcUtility.getChildNode = function(node, id) {
                var children = node.children;
                for (var i = 0; i < children.length; i++) {
                                if (children[i].id == id) {
                                                return children[i];
                                }
                }                              
};

sap.oee.ui.rcUtility.isAlreadyAvailableChild = function(parent, childID) {
                var isChildNodeAvailable = false;
                var children = parent.children;
                for (var i = 0; i < children.length; i++) {
                                if (children[i].id == childID) {
                                                isChildNodeAvailable = true;
                                                break;
                                }              
                }
                return isChildNodeAvailable;
};

sap.oee.ui.rcUtility.getParentRCNode = function(reasonCode, childLevel) {
                var parentLevel = childLevel - 1;                
                var rootNodeID = sap.oee.ui.rcUtility.getReasonCodeID(reasonCode, 1);
                var timeElementType = sap.oee.ui.rcUtility.getReasonCodeTimeElementType(reasonCode);
                var rootNode = sap.oee.ui.rcUtility.getRootNode(timeElementType, rootNodeID);
                if (rootNode != undefined) {
                                if (parentLevel == 1) {
                                                return rootNode;
                                } else {
                                                var parentNode = rootNode;
                                                for (var j = 2; j <= parentLevel; j++) {
                                                                var id = sap.oee.ui.rcUtility.getReasonCodeID(reasonCode, j);
                                                                var node = sap.oee.ui.rcUtility.getChildNode(parentNode, id);
                                                                if (node != undefined) {
                                                                                if (parentLevel == j) {
                                                                                                return node;
                                                                                }
                                                                                parentNode = node;
                                                                }
                                                }
                                }
                }
};

sap.oee.ui.rcUtility.createReasonCodeButtonsInitial = function() {
                //sap.oee.ui.rcUtility.clearReasonCodeToolPopupLayout();
                sap.oee.ui.rcUtility.clearReasonCodeToolPopup();
                breadCrumbsLayout.setVisible(false);
                
                breadCrumbsLayout.rerender();
                this.currentRCLevel = firstRCLevel;
                if (rootTimeElementTypes.length > 1) {
                                reasonCodeToolPopup.setTitle(oController.appComponent.oBundle.getText("OEE_HEADING_SELECT_LOSS_TYPE"));
                                //var buttonsRow;
                                for (var i = 0; i < rootTimeElementTypes.length; i++) {
                                                /*//if (i % maxButtonsInARow == 0) {
                                                                buttonsRow = new sap.ui.layout.HorizontalLayout();
                                                                //reasonCodeList.addRow(buttonsRow);
                                                                reasonCodeList.addContent(buttonsRow);
                                                //}
*/                                                           reasonCodeList.addItem(rootTimeElementTypes[i].rcStandardListItem);
                                }
                } else {
                                currentSelectedTimeElementType = rootTimeElementTypes[0];
                                sap.oee.ui.rcUtility.createReasonCodeUI(firstLevelReasonCodes);
                }
                //reasonCodeToolPopupLayout.rerender();

                //sap.oee.ui.rcUtility.rcSearch();
                oRCSearchField.setValue(""); // Clear
                reasonCodeToolPopup.rerender();
};

sap.oee.ui.rcUtility.createReasonCodeUI = function(reasonCodeArray) {
                
                if (isNextAndSelectOperationsAutomated == true) {
                                sap.oee.ui.rcUtility.createReasonCodeButtons(reasonCodeArray);
                } else if (isNextAndSelectOperationsAutomated == false) {
                                sap.oee.ui.rcUtility.createReasonCodeCheckBoxes(reasonCodeArray);
                }
            
};

sap.oee.ui.rcUtility.createReasonCodeButtons = function(reasonCodeArray) {
                //sap.oee.ui.rcUtility.clearReasonCodeToolPopupLayout();
                sap.oee.ui.rcUtility.clearReasonCodeToolPopup();
                reasonCodeToolPopup.setTitle(oController.appComponent.oBundle.getText("OEE_HEADING_SELECT_REASON_CODE"));
                sap.oee.ui.rcUtility.createBreadCrumbsForSelectedRCNode();
                //var buttonsRow; 
                for (var i = 0; i < reasonCodeArray.length; i++) {
                                /*//if (i % maxButtonsInARow == 0) {
                                                buttonsRow = new sap.ui.layout.HorizontalLayout({
                                                                //columns : maxButtonsInARow
                                                });
                                                //reasonCodeList.addRow(buttonsRow);
                                                reasonCodeList.addContent(buttonsRow);
                                                
                                                var row = sap.ui.layout.HorizontalLayout();
                                                //buttonsRow.addRow(row);
                                                buttonsRow.addContent(row);
                                //}                          
*/                           /*var list = new sap.m.List({
                                                headerText: "headerText"
                                });
                                list.addItem(reasonCodeArray[i].button);            */           
                                //row.addCell(cell);
                                reasonCodeList.addItem(reasonCodeArray[i].rcStandardListItem);          
                }              

                //sap.oee.ui.rcUtility.rcSearch();
                oRCSearchField.setValue(""); // Clear
};

sap.oee.ui.rcUtility.createReasonCodeCheckBoxes = function(reasonCodeArray) {
                //sap.oee.ui.rcUtility.clearReasonCodeToolPopupLayout();
                sap.oee.ui.rcUtility.clearReasonCodeToolPopup();
                currentLevelRCNodes = [];
                
                reasonCodeToolPopup.setTitle(oController.appComponent.oBundle.getText("OEE_HEADING_SELECT_REASON_CODE"));
                sap.oee.ui.rcUtility.createBreadCrumbsForSelectedRCNode();
                
                var checkBoxesRow;
                for (var i = 0; i < reasonCodeArray.length; i++) {
                                if (i % maxButtonsInARow == 0) {
                                                
                                                checkBoxesRow = new sap.ui.layout.HorizontalLayout({
                                                                rows : maxButtonsInARow
                                                });
                                                reasonCodeList.addRow(checkBoxesRow);
                                                
                                                if (i == 0) {
                                                                selectAllReasonCodeButton = new sap.m.Button({
                                                                                text : oController.appComponent.oBundle.getText("OEE_BTN_SELECT_ALL"),
                                                                                visible : true,
                                                                                press : function(oEvent) {
                                                                                                sap.oee.ui.rcUtility.selectAllReasonCodeCheckBoxes(reasonCodeArray);
                                                                                }
                                                                }); //.addStyleClass('toolpopupButtons');
                                                                                                                
                                                                var selectAllButtonRow = new sap.ui.layout.HorizontalLayout();
                                                                checkBoxesRow.addRow(selectAllButtonRow);
                                                                
                                                                var cell = new sap.ui.layout.HorizontalLayout();
                                                                cell.addContent(selectAllReasonCodeButton);                  
                                                                selectAllButtonRow.addCell(cell);
                                                }              
                                                
                                                var row = new sap.ui.layout.HorizontalLayout();
                                                checkBoxesRow.addRow(row);
                                }              
                                
                                if (reasonCodeArray[i].checkBox.getChecked() != false) {
                                                reasonCodeArray[i].checkBox.setChecked(false);
                                }              
                                
                                var cell = new sap.ui.layout.HorizontalLayout();
                                cell.addContent(reasonCodeArray[i].checkBox);                              
                                row.addCell(cell);
                }              
};

sap.oee.ui.rcUtility.createBreadCrumbsForSelectedRCNode = function() {
                var breadCrumbsArray = [];
                if (currentSelectedTimeElementType != undefined) {
                                breadCrumbsLayout.setVisible(true);
                                var dceButtonDesc = ""; 
                                if(dataCollectionElement != undefined) {
                                                var dcElements = [];
                                                dcElements.push({client : oController.appData.client, dcElement : dataCollectionElement});
                                                var dcElementObj = oController.interfaces.getDCElementDetails(dcElements);
                                                if(dcElementObj && dcElementObj.dataCollectionElements 
                                                                                && dcElementObj.dataCollectionElements.results && dcElementObj.dataCollectionElements.results.length > 0){
                                                                dceButtonDesc = dcElementObj.dataCollectionElements.results[0].description;
                                                }
                                } else
                                                dceButtonDesc = currentSelectedTimeElementType.description;
                                
                                if (dcElementType != undefined && dcElementType.getVisible() == true) { 
                                                dceButtonDesc = dcElementType.getSelectedItem().getText();
                                } 
                                
                                if (rootTimeElementTypes.length > 1) {
                                                var timeElementTypeButton = new sap.m.Link({
                                                                text : dceButtonDesc, 
                                                                press : function(oEvent) {
                                                                                sap.oee.ui.rcUtility.createReasonCodeButtonsInitial();
                                                                }
                                                });
                                                breadCrumbsArray.push(timeElementTypeButton);
                                } else {
                                                var timeElementTypeTextView = new sap.m.Text({
                                                                text : dceButtonDesc
                                                });
                                                
                                                breadCrumbsArray.push(timeElementTypeTextView);  
                                }
                } else { 
                                breadCrumbsLayout.setVisible(false);
                }
                
                if (currentSelectedRCNode != undefined) {
                                var rcBreadCrumbsArray = currentSelectedRCNode.getBreadCrumbs();
                                breadCrumbsArray = breadCrumbsArray.concat(rcBreadCrumbsArray);
                                for (var i = 0; i < breadCrumbsArray.length; i++) {
                                breadCrumbsLayout.addContent(breadCrumbsArray[i]);
                }              
                }
                
                
};

/*sap.oee.ui.rcUtility.clearReasonCodeToolPopupLayout = function() {
                breadCrumbsLayout.removeAllContent();
                //reasonCodeList.removeAllContent();
                reasonCodeList.removeAllItems();
                //reasonCodeList.setCurrentPage(1);
}; */

sap.oee.ui.rcUtility.clearReasonCodeToolPopup = function() {
                breadCrumbsLayout.removeAllContent();
                //reasonCodeList.removeAllContent();
                reasonCodeList.removeAllItems();
                //reasonCodeList.setCurrentPage(1);
};

sap.oee.ui.rcUtility.destroyReasonCodeToolPopup = function() {
                breadCrumbsLayout.destroyContent();
                //reasonCodeList.destroyRows();
                reasonCodeList.destroyItems();
                //reasonCodeList.removeAllColumns();
                reasonCodeToolPopup.destroyContent();
                //reasonCodeToolPopupLayout.destroyContent();
};

/*sap.oee.ui.rcUtility.destroyReasonCodeToolPopupLayout = function() {
                breadCrumbsLayout.destroyContent();
                //reasonCodeList.destroyRows();
                reasonCodeList.destroyItems();
                //reasonCodeList.removeAllColumns();
                //reasonCodeToolPopup
                reasonCodeToolPopupLayout.destroyContent();
}; */

sap.oee.ui.rcUtility.getRCTimeElementTypeObjects = function(reasonCodeArray) {
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
};

sap.oee.ui.rcUtility.getTimeElementTypeObject = function(timeElementTypeArray, timeElementType) {
                for (var i = 0; i < timeElementTypeArray.length; i++) {
                                if (timeElementTypeArray[i].timeElementType.timeElementType == timeElementType.timeElementType) {
                                                return timeElementTypeArray[i];
                                }
                }
};

sap.oee.ui.rcUtility.checkCurrentSelectedRCNodesAndLoadChildren = function() {
                if (currentSelectedRCNodes != undefined) {
                                if (currentSelectedRCNodes.length > 1) {
                                                sap.oee.ui.rcUtility.showSelectButton(true);
                                                sap.oee.ui.rcUtility.showNextLevelButton(false);
                                } else if (currentSelectedRCNodes.length == 1) {
                                                var rcNode = currentSelectedRCNodes[0];
                                                currentSelectedRCNode = rcNode;
                                                rcNode.getNextLevel();
                                                sap.oee.ui.rcUtility.showSelectButton(true);
                                                
                                                var showNextLevel = false;
                                                if (rcNode.children != undefined) {
                                                                if (rcNode.children.length > 0) {
                                                                                showNextLevel = true;
                                                                }              
                                                }
                                                
                                                sap.oee.ui.rcUtility.showNextLevelButton(showNextLevel);
                                } else {
                                                sap.oee.ui.rcUtility.showSelectButton(false);
                                                sap.oee.ui.rcUtility.showNextLevelButton(false);
                                }              
                }              
};

sap.oee.ui.rcUtility.showSelectButton = function(show) {
                selectReasonCodeButton.setVisible(show);
                selectReasonCodeButton.rerender();
};

sap.oee.ui.rcUtility.showNextLevelButton = function(show) {
                nextLevelReasonCodeButton.setVisible(show);
                nextLevelReasonCodeButton.rerender();
};

sap.oee.ui.rcUtility.getNextLevelReasonCode = function() {
                if (currentSelectedRCNode != undefined) {
                                if (currentSelectedRCNode.children.length > 0) {
                                                currentSelectedRCNodes = [];
                                                sap.oee.ui.rcUtility.createReasonCodeUI(currentSelectedRCNode.children);
                                }
                }
};

sap.oee.ui.rcUtility.selectAllReasonCodeCheckBoxes = function(reasonCodeArray) {
                if (reasonCodeArray != undefined) {
                                for (var i = 0; i < reasonCodeArray.length; i++) {
                                                var checkBox = reasonCodeArray[i].checkBox;
                                                checkBox.setChecked(true);
                                                checkBox.rerender();
                                                onSelectCheckBox(checkBox);
                                }              
                }
                
                sap.oee.ui.rcUtility.showSelectButton(true);      
                if (reasonCodeArray.length > 1) {
                                sap.oee.ui.rcUtility.showNextLevelButton(false);
                }
};

sap.oee.ui.rcUtility.onSelectCheckBox = function(checkBox) {
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
};

sap.oee.ui.rcUtility.selectAllCheckedReasonCodes = function() {
                if (currentSelectedRCNodes != undefined) {
                                if (currentSelectedRCNodes.length > 0) {
                                                var multipleReasonCodes = [];
                                                for (var i = 0; i < currentSelectedRCNodes.length; i++) {
                                                                var reasonCodeData = currentSelectedRCNodes[i].getDataOutput();
                                                                multipleReasonCodes.push(reasonCodeData);
                                                }
                                                jsonObject[reasonCodePropertyName] = multipleReasonCodes;
                                                
                                                if (currentSelectedRCNodes.length > 1) {
                                                                reasonCodeLink.setText(oController.appComponent.oBundle.getText("OEE_TEXT_MULTIPLE"));
                                                } else if (currentSelectedRCNodes.length == 1){
                                                                reasonCodeLink.setText(currentSelectedRCNodes[0].description);
                                                }              
                                }
                }
                //sap.oee.ui.rcUtility.destroyReasonCodeToolPopupLayout();
                sap.oee.ui.rcUtility.destroyReasonCodeToolPopup();
                if (reasonCodeToolPopup != undefined) {
                                reasonCodeToolPopup.close();
                                reasonCodeToolPopup.destroy();
                }
};

sap.oee.ui.rcUtility.selectReasonCode = function() {
                if (currentSelectedRCNode != undefined) {
                                var reasonCodeData = currentSelectedRCNode.getDataOutput();
                                jsonObject[reasonCodePropertyName] = reasonCodeData;
                                if(rcElementType == "Button")
                                                reasonCodeLink.setText(currentSelectedRCNode.description);
                                else if(rcElementType == "Input")
                                                reasonCodeLink.setValue(currentSelectedRCNode.description);
                                else
                                reasonCodeLink.setText(currentSelectedRCNode.description);
                }
                //sap.oee.ui.rcUtility.destroyReasonCodeToolPopupLayout();
                sap.oee.ui.rcUtility.destroyReasonCodeToolPopup();
                if (reasonCodeToolPopup != undefined) {
                                reasonCodeToolPopup.close();
                                reasonCodeToolPopup.destroy();
                }
};

sap.oee.ui.rcUtility.selectNextLevel = function() {
                if (currentSelectedRCNode != undefined) {
                                if (currentSelectedRCNode.children.length > 0) {
                                                sap.oee.ui.rcUtility.getNextLevelReasonCode();
                                } else {
                                                sap.oee.ui.rcUtility.selectReasonCode();
                                }              
                }
};

sap.oee.ui.rcUtility.initialize = function(controller, client, plant, nodeID, link, jsonObj, rcPropertyName, selectionForAssignmentScreen, nextAndSelectOperationsAutomated) {
                oController = controller;
                rcClient = client;
                rcPlant = plant;
                rcNodeID = nodeID;
                reasonCodeLink = link;
                jsonObject = jsonObj;
                reasonCodePropertyName = rcPropertyName;
                
                reasonCodeToolPopup = undefined;
                //reasonCodeToolPopupLayout = undefined;
                reasonCodeList = undefined;
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
};

sap.oee.ui.rcUtility.getInitialReasonCodeLevel = function(reasonCode) {
                if (isRetrievedFromReasonCodeAssignment) {
                                for (var i = initialLevel; i <= totalLevels + 1; i++) {
                                                if (i > totalLevels) {
                                                                return totalLevels;
                                                }
                                                
                                                var id = sap.oee.ui.rcUtility.getReasonCodeID(reasonCode, i);
                                                if (id == undefined || id == '') {
                                                                return (i - 1);
                                                }
                                }                              
                } else {
                                return initialLevel;
                }
};

sap.oee.ui.rcUtility.getInitialReasonCodeLevelForReasonCodeAssignmentScreen = function(reasonCode) {
                for (var i = initialLevel; i <= totalLevels + 1; i++) {
                                if (i > totalLevels) {
                                                return totalLevels;
                                }              
                                
                                var id = sap.oee.ui.rcUtility.getReasonCodeID(reasonCode, i);
                                if (id == undefined || id == '') {
                                                return (i - 1);
                                }
                }
};

sap.oee.ui.rcUtility.createReasonCodeToolPopup = function(
                                controller, link, client, plant, nodeID, dcElement, jsonObj, rcPropertyName, sRcElementType, callBackOnClose) {
                if(sRcElementType == undefined)
                                rcElementType = "Button"; // Button
                else
                                rcElementType = "Input"; // 
                
                sap.oee.ui.rcUtility.callBackOnClose = callBackOnClose;
                
                sap.oee.ui.rcUtility.openReasonCodeToolPopupScreen(
                                                controller, link, client, plant, nodeID, dcElement, jsonObj, rcPropertyName, false, true, undefined, callBackOnClose);
};

sap.oee.ui.rcUtility.createReasonCodeToolPopupWithDCElement = function(
                                controller, link, client, plant, nodeID, dcElement, jsonObj, rcPropertyName, sRcElementType, dcElementList, callBackOnClose) {
                if(sRcElementType == undefined)
                                rcElementType = "Button"; // Button
                else
                                rcElementType = "Input"; // 

                sap.oee.ui.rcUtility.callBackOnClose = callBackOnClose;
                
                sap.oee.ui.rcUtility.openReasonCodeToolPopupScreen(
                                                controller, link, client, plant, nodeID, dcElement, jsonObj, rcPropertyName, false, true, dcElementList, callBackOnClose);
};

sap.oee.ui.rcUtility.rcSearch = function(){
                var searchQuery = oRCSearchField.getValue().toLowerCase();
                if(reasonCodeList != undefined){
                                var oItemsList = reasonCodeList.getItems();
                                var iterator,oItem;
                                for(iterator in oItemsList){
                                                oItem = oItemsList[iterator];
                                                if(oItem.getTitle().toLowerCase().indexOf(searchQuery) == -1){
                                                                oItem.setVisible(false);
                                                }else
                                                {
                                                                oItem.setVisible(true);
                                                }
                                }
                }
                
                reasonCodeList.rerender();
};

sap.oee.ui.rcUtility.onSelectDCElement = function(oEvent, jsonObj){
                var selectedDCElement = oEvent.getSource().getSelectedKey();
                jsonObj.dcElement = selectedDCElement;
                var reasonCodeData = sap.oee.ui.rcUtility.getReasonCodeData( 
                                                selectedDCElement,
                                                false);
                
                // reinitializing the variables
                isRetrievedFromReasonCodeAssignment = false;
                rootTimeElementTypes = [];
                currentSelectedRCNode = undefined;
                firstRCLevel = undefined;
                firstLevelReasonCodes = [];
                currentRCLevel = undefined;
                currentSelectedTimeelementType = undefined;
                currentSelectedRCNodes = [];
               
                sap.oee.ui.rcUtility.createReasonCodeTree(reasonCodeData);
};

sap.oee.ui.rcUtility.openReasonCodeToolPopupScreen = function(
                                controller, link, client, plant, nodeID, dcElement, jsonObj, rcPropertyName, 
                                selectionForAssignmentScreen, nextAndSelectOperationsAutomated, dcElementList, callBackOnClose) {

                sap.oee.ui.rcUtility.initialize(
                                                controller, client, plant, nodeID, link, jsonObj, rcPropertyName, selectionForAssignmentScreen, nextAndSelectOperationsAutomated);

                dataCollectionElement = dcElement;
                
                var reasonCodeData = sap.oee.ui.rcUtility.getReasonCodeData( 
                                                dcElement,
                                                selectionForAssignmentScreen);

                if (reasonCodeData != undefined) {
                                if (reasonCodeData.length > 0) {
                                                sap.oee.ui.rcUtility.destroyIfAlreadyExists(oController, 'reasonCodeToolPopup');
                                                sap.oee.ui.rcUtility.destroyIfAlreadyExists(oController, 'reasonCodeToolPopup1');
                                                if(callBackOnClose != undefined)
                                                {
                                                                reasonCodeToolPopup = new sap.m.Dialog( {
                                                                                id : oController.createId('reasonCodeToolPopup'),
                                                                                //beginButton : backButton,
                                                                                //width : '70%',
                                                                                stretch : sap.ui.Device.support.touch,
                                                                                contentHeight : "72%",
                                                                                contentWidth : "65%",
                                                                                modal : true,
                                                                                beforeClose : callBackOnClose
                                                                });
                                                }
                                                else
                                                {
                                                                reasonCodeToolPopup = new sap.m.Dialog( {
                                                                                id : oController.createId('reasonCodeToolPopup1'),
                                                                                //beginButton : backButton,
                                                                                //width : '70%',
                                                                                stretch : sap.ui.Device.support.touch,
                                                                                contentHeight : "72%",
                                                                                contentWidth : "65%",
                                                                                modal : true,
                                                                                wrapping : false
                                                                });
                                                }
                                                                
                                                /*reasonCodeToolPopupLayout = new sap.ui.layout.VerticalLayout({
                                                }); */
                                                
                                                breadCrumbsLayout = new sap.ui.layout.HorizontalLayout({
                                                                allowWrapping : true
                                                });

                                                backButton = new sap.m.Button({
                                                                text : controller.appComponent.oBundle.getText("OEE_BTN_BACK"),
                                                                visible : false,
                                                                press : [function(oEvent){
                                                                                                                if(currentSelectedRCNode){
                                                                                                                                var breadCrumbsArray = currentSelectedRCNode.getBreadCrumbs();
                                                                                                                                if(breadCrumbsArray.length > 1)
                                                                                                                                {
                                                                                                                                                //breadCrumbsArray[breadCrumbsArray.length - 1].firePress({id: breadCrumbsArray[breadCrumbsArray.length - 1].getId()});
                                                                                                                                                if(breadCrumbsArray[breadCrumbsArray.length - 1] instanceof sap.m.Text){
                                                                                                                                                      sap.oee.ui.rcUtility.backButtonPress(breadCrumbsArray[breadCrumbsArray.length - 1].data("rcNode"));
                                                                                                                                                }
                                                                                                                                }
                                                                                                                }
                                                                                                },this]
                                                }); //.addStyleClass("toolpopupButtons");
                                                
                                                if (selectionForAssignmentScreen == false) {
                                                                reasonCodeList = new sap.m.List({
                                                                                /*growing : true,
                                                                                growingThreshold : 5,
                                                                                growingTriggerText : "More",
                                                                                growingScrollToLoad : false,
                                                                                inset : false,
                                                                                includeItemInSelection: true,
                                                                                mode : "SingleSelectMaster"*/
                                                                });
                                                } else if (selectionForAssignmentScreen == true) {
                                                                reasonCodeList = new sap.m.List({
                                                                                /*growing : true,
                                                                                growingThreshold : 5,
                                                                                growingTriggerText : "More",
                                                                                growingScrollToLoad : false,
                                                                                inset : false,
                                                                                includeItemInSelection: true,
                                                                                mode : "SingleSelectMaster"*/
                                                                });
                                                }
                                                
                                                var skipButton = new sap.m.Button({
                                                                text : controller.appComponent.oBundle.getText("OEE_BUTTON_SKIP_ASSIGN"), 
                                                                visible : true, 
                                                                press : function(oEvent) {
                                                                                jsonObj.reasonCodeData = "NOT SELECTED";
                                                                                reasonCodeToolPopup.close();
                                                                }
                                                });
                                                
                                                var cancelButton = new sap.m.Button({
                                                                text : controller.appComponent.oBundle.getText("OEE_BTN_CANCEL"), 
                                                                visible : true, 
                                                                press : function(oEvent) {
                                                                                jsonObj.reasonCodeData = undefined;
                                                                                reasonCodeToolPopup.close();
                                                                }
                                                });
                                                
                                                //reasonCodeToolPopupLayout.addContent(breadCrumbsLayout);
                                                //reasonCodeToolPopupLayout.addContent(reasonCodeList);  
                                                //reasonCodeToolPopupLayout.addContent(backButton);
                                  
                                                oRCSearchField = new sap.m.SearchField();
                                                oRCSearchField.attachSearch(sap.oee.ui.rcUtility.rcSearch);
                                                oRCSearchField.attachLiveChange(sap.oee.ui.rcUtility.rcSearch);
                                                
                                                var dcElementFlexBox = new sap.m.FlexBox({
                                                                justifyContent : "Center"
                                                });
                                                
                                                
                                                dcElementType = new sap.m.Select({
                                                                autoAdjustWidth : true,
                                                                change : function(oEvent) {
                                                                                sap.oee.ui.rcUtility.onSelectDCElement(oEvent, jsonObj);
                                                                }
                                                });
                                                
                                                var dcElementTypeSelectionForm = new sap.ui.layout.form.Form({
                                                                editable : true,
                                                                layout : new sap.ui.layout.form.ResponsiveGridLayout({
                                                                                labelSpanL: 3, labelSpanS: 3,
                                                                                                labelSpanM: 3, columnsL: 6,
                                                                                                columnsM: 6, columnsS : 6
                                                                }),
                                                                formContainers : [new sap.ui.layout.form.FormContainer({
                                                                                formElements : [new sap.ui.layout.form.FormElement({
                                                                                                label : controller.appComponent.oBundle.getText("DOWNTIME_TYPE"),
                                                                                                fields : [dcElementType]
                                                                                })]
                                                                })]
                                                                
                                                });
                                                
                                                if (dcElementList != undefined) {
                                                                dcElementTypeSelectionForm.setVisible(true);
                                                                dcElementType.setVisible(true);
                                                                if (dcElementType != undefined) {
                                                                                dcElementType.removeAllItems();
                                                                }
                                                                for(var i=0; i < dcElementList.dataCollectionElements.results.length; i++) {
                                                                                dcElementType.addItem(new sap.ui.core.Item({  
                                                                                                text: dcElementList.dataCollectionElements.results[i].description,  
                                                                                                key: dcElementList.dataCollectionElements.results[i].dcElement  
                                                                                })); 
                                                                }
                                                                dcElementType.setSelectedKey(dcElement);
                                                } else {
                                                                dcElementType.setVisible(false);
                                                                dcElementTypeSelectionForm.setVisible(false);
                                                }
                                                
                                                
                                                reasonCodeToolPopup.addContent(dcElementTypeSelectionForm);
                                                reasonCodeToolPopup.addContent(new sap.m.Toolbar({width : "100%"}).addContent(oRCSearchField));
                                                reasonCodeToolPopup.addContent(breadCrumbsLayout);                                          
                                                reasonCodeToolPopup.addContent(reasonCodeList);
                                                reasonCodeToolPopup.addButton(backButton);
                                                reasonCodeToolPopup.addButton(skipButton);
                                                reasonCodeToolPopup.addButton(cancelButton);
                                                
                                                selectReasonCodeButton = new sap.m.Button({
                                                                text : controller.appComponent.oBundle.getText("OEE_BTN_SELECT"),
                                                                visible : false,
                                                                press : function(oEvent) {
                                                                                if (isNextAndSelectOperationsAutomated == true) {
                                                                                                sap.oee.ui.rcUtility.selectReasonCode();
                                                                                } else if (isNextAndSelectOperationsAutomated == false) {
                                                                                                sap.oee.ui.rcUtility.selectAllCheckedReasonCodes();
                                                                                }                                                                              
                                                                }
                                                }); //.addStyleClass('toolpopupButtons');
                                                  
                                                nextLevelReasonCodeButton = new sap.m.Button({
                                                                text : controller.appComponent.oBundle.getText("OEE_BTN_NEXT_LEVEL"), 
                                                                visible : false, 
                                                                press : function(oEvent) { 
                                                                                sap.oee.ui.rcUtility.getNextLevelReasonCode();
                                                                                sap.oee.ui.rcUtility.showNextLevelButton(false);
                                                                                sap.oee.ui.rcUtility.showSelectButton(false);
                                                                }
                                                }); //.addStyleClass('toolpopupButtons');                                             

                                                reasonCodeToolPopup.addButton(selectReasonCodeButton);
                                                reasonCodeToolPopup.addButton(nextLevelReasonCodeButton);                                          
                                                
                                                reasonCodeToolPopup.open();                                 
                                                sap.oee.ui.rcUtility.createReasonCodeTree(reasonCodeData);
                                }
                }
};

sap.oee.ui.rcUtility.getReasonCodeData = function(selectedDCElement, selectionForAssignmentScreen) {

                var reasonCodeData;
                var reasonCodeDataRetrieved = false;

                /*
                * Do not call reason code assignment if the reason code popup itself is for the assignment screen
                */
                if (selectionForAssignmentScreen == false) {
                                reasonCodeData = oController.interfaces.getRC(rcClient, rcPlant, rcNodeID, selectedDCElement);
                                if (reasonCodeData != undefined) {
                                                if (reasonCodeData.length > 0) {
                                                                reasonCodeDataRetrieved = true;
                                                                isRetrievedFromReasonCodeAssignment = true;
                                                }
                                }
                }

                if (reasonCodeDataRetrieved == false) {
                               reasonCodeData = oController.interfaces.getReasonCodeForDCElement(rcClient, rcPlant,
                                                                selectedDCElement);
                }

                if (reasonCodeData != undefined) {
                                if (reasonCodeData.length > 0) {
                                                reasonCodeDataRetrieved = true;
                                }
                }

                if (reasonCodeDataRetrieved == false) {
                                reasonCodeData = oController.interfaces.getReasonCodeForDCElement(rcClient, rcPlant, "");
                }
                
                if (reasonCodeData != undefined) {
                                if (reasonCodeData.length > 0) {
                                                reasonCodeDataRetrieved = true;
                                }
                }

                if (reasonCodeDataRetrieved == false) {
                				if(sap.oee.ui.rcUtility.callBackOnClose){
                					sap.oee.ui.rcUtility.callBackOnClose();
                				}
                				
                				sap.oee.ui.Utils.createMessage(oController.appComponent.oBundle.getText("OEE_ERR_MSG_NO_RC"), sap.ui.core.MessageType.Error);
                }              

                return reasonCodeData;
};

sap.oee.ui.rcUtility.getReasonCodeID = function(reasonCode, currentLevel) {
                var id;
                if (reasonCode["reasonCode" + currentLevel]["reasonCode" + currentLevel]!= undefined) {
                                id = reasonCode["reasonCode" + currentLevel]["reasonCode" + currentLevel];
                } else {
                                id = reasonCode["reasonCode" + currentLevel];
                }
                return id;

};

sap.oee.ui.rcUtility.getReasonCodeTimeElementType = function(reasonCode) {
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
};

sap.oee.ui.rcUtility.getReasonCodeDescription = function(reasonCode, currentLevel) {
                var buttonText;
                if (reasonCode["reasonCode" + currentLevel].description != undefined) {
                                buttonText = reasonCode["reasonCode" + currentLevel].description;
                } else {
                                buttonText = reasonCode.description;
                }
                return buttonText;
};

sap.oee.ui.rcUtility.getNextLevelReasonCodes = function(selectedReasonCodeData,
                                nextLevel) {

                var reasonCodeData = oController.interfaces.getNextLevelRC(rcClient, rcPlant,
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
};

sap.oee.ui.rcUtility.getReasonCodeString = function(reasonCodeData) {
                var outputString = "";
                var toLevel = sap.oee.ui.rcUtility.getInitialReasonCodeLevel(reasonCodeData);
                for (var i = 1; i <= toLevel; i++) {
                                outputString = outputString + sap.oee.ui.rcUtility.getReasonCodeDescription(reasonCodeData, i);
                                if (i != toLevel) {
                                                outputString = outputString + " -> ";
                                }
                }
                return outputString;
};

sap.oee.ui.rcUtility.destroyIfAlreadyExists = function(oController, uiElementName) {
                var uiElement = oController.byId(uiElementName);
                if (uiElement != undefined) {
                                uiElement.destroy();
                }
                
sap.oee.ui.rcUtility.backButtonPress = function(node){
    /*
    * If the level is the first displayed level, then load all the 
     * reason codes for the time element type, and not just the 
     * selected level's hierarchy.
    * 
     * Use the same logic on clicking the "Time Element" button.
    * 
     * Added on 27/03/2013. Added for SP03.
    */
//breadCrumbsArray.push(timeElementTypeTextView);
	var levelRC = 0;
	for(var i = 0; i <= reasonCodeAssigned.length; i++){
        if(node == reasonCodeAssigned[i]){
        	levelRC = node.level;
        backButton.setVisible(false);
        breadCrumbsLayout.setVisible(false);
}
}
                    
    if (node != undefined) {
                    if (node.level == levelRC) {
                                    var timeElementType = sap.oee.ui.rcUtility.getRootTimeElementType(node.timeElementType);
                                    currentSelectedTimeElementType = timeElementType;
                                    currentSelectedRCNode = undefined;
                                    currentRCLevel = undefined;
                                    var filteredReasonCodeArray = timeElementType.filterFirstLevelReasonCodesByType();
                                    backButton.setVisible(false);
                                    sap.oee.ui.rcUtility.createReasonCodeUI(filteredReasonCodeArray);
                    } else {
                                    currentSelectedRCNode = node;
                                    currentRCLevel = node.level;
                                    var siblings = node.getSiblings();
                                    sap.oee.ui.rcUtility.createReasonCodeUI(siblings);
                    }              
    }     
    
};
};