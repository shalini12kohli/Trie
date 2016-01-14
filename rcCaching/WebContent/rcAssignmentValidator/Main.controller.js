sap.ui.controller("sap.oee.ui.Main", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf componentexample.Main
*/
	onInit: function() {
		var helpLink = this.byId("helpLink");
		this.appComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		this.appData = this.appComponent.getAppGlobalData();
		this.interfaces = this.appComponent.getODataInterface();
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.getView().addStyleClass("oeeComponent");
		
		if(this.appComponent.getInsideLaunchpad()){
			this.getView().addStyleClass("inLaunchpadContext");
		}
		
		this.initializeAppInfo();
		this.checkForAlerts();

		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "headerChange", this.headerChange, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "showOrHideNavButton", this.showOrHideNavButton, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "refreshOrderDetails", this.refreshOrderDetails, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "orderChange", this.changeOrder, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "shiftChange", this.handleShiftChange, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "refreshAndCheckForInitialOrderInformation", this.setInitialOrderInformationIfAny, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "clearOrderContext", this.clearOrderContext, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(), "openShiftChangePopup", this.shiftChange, this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(),"openOrderChangePopover",this.openOrderChangePopover,this);
		this.appComponent.getEventBus().subscribe(this.appComponent.getId(),"openDetailsHandler",this.openDetailsHandler,this);
		
		if(helpLink !== undefined && helpLink.addAriaLabelledBy !== undefined){
			helpLink.addAriaLabelledBy(this.createId("helpDescription"));
		}
		
		this.router.attachRoutePatternMatched(this.updateHelpLinks, this);
		
		this.alertRefreshInterval = jQuery.sap.intervalCall(1000*60,this,this.checkForAlerts); //Check For Alerts Every Minute.
		var clockTextField = this.byId(sap.ui.core.Fragment.createId("header","clockText"));
		this.startClock(clockTextField);
	},
	
	updateHelpLinks : function(oEvent){
		var oName = oEvent.getParameter("name"); 
		var oArgument;
		var activityID = "";
        if (oName === "activity") {
  			oArgument = oEvent.getParameter("arguments");
  			if(oArgument != undefined){
  				activityID = oArgument.activityId;
  			}
        }

        var urlToHelpLink = sap.oee.ui.Utils.getHelpLink(activityID);

		this.appData.setCurrentOEEHelpLink(urlToHelpLink);
	},

	refreshOrderDetails : function(channelId, eventId, data){
		   if(eventId === "refreshOrderDetails"){
				this.setSelectedOrderDetails(this.appData.selected.runID);
		   }
	},
	
	openOrderChangePopover : function(channelId, eventId, data){
		   if(eventId === "openOrderChangePopover"){
			   if(data != undefined){
				   this.handleOrderChange();
			   }
		   }
	  },
	  handleCloseButton: function (oEvent) {
	      this.oPopOver.close();
	  },
	  
	  orderSearch : function(oEvent){
		    var properties = [];
			properties.push("order");
			properties.push("routingOperNo");
			properties.push("statusDescription");
			properties.push("material_desc");
			properties.push("productionActivity");

			sap.oee.ui.Utils.fuzzySearch(this,this.oPopOver.getModel(),oEvent.getParameter("value"),
					this.oPopOver.getBinding("items"),oEvent.getSource(),properties);
	  },

	  selectOrder : function(oEvent){
		var oSource = oEvent.getParameter("selectedItem");
		if(oSource != undefined){
		  	var sRunID = oSource.getBindingContext().getProperty("runID");
		  	if(sRunID != undefined){
		  		this.appComponent.getEventBus().publish(this.appComponent.getId(), "orderChange",{runID : sRunID});
		  	}
		}
	  },
	  
	  openDetailsHandler : function(channelId,eventId,data){
		  if (eventId === "openDetailsHandler") {
			  this.detailsHandler(data);
		  }
	  },
	  
	  detailsHandler : function(data){
		  var prodRunData;
		  
		  this._detailsDialogPayload = data;
		  
		  var prodRunData = this.getProductionRunDataBasedOnOrderDependency(this._detailsDialogPayload);
		  
		  if(prodRunData.details != undefined && prodRunData.details.results != undefined){
		        var oModel = new sap.ui.model.json.JSONModel({ firstColumnHeader : data.description, dcElement : data.dcElement, prodList : prodRunData.details.results,isLossType : data.isLossType,refreshMethodToInvoke : data.dataRefreshMethod, oContextOfController : data.oMainController,data : data.isOrderIndependent});
		        if(this.detailsDialog == undefined){
		        	this.detailsDialog = sap.ui.xmlfragment("detailsTableFragment","sap.oee.ui.fragments.showDetailsRecords",this);
			        this.getView().addDependent(this.detailsDialog);
		        }
		        this.detailsDialog.setModel(oModel);
		    }
		    this.detailsDialog.open();
	  },
	  
	  getProductionRunDataBasedOnOrderDependency : function(dataPayload){
		  var dcElement = dataPayload.dcElement,isOrderIndependent = dataPayload.isOrderIndependent,runForDataRetreival = dataPayload.runForDataRetreival,nodeId = dataPayload.nodeId;
		  var timeInterval = dataPayload.timeInterval,shiftDetailsForOrderIndependentData = dataPayload.shiftDetailsForOrderIndependentData,isMachineDataCollection = dataPayload.isMachineDataCollection;
		  
		  //For Order Independent Data Retrieval
		  if(isOrderIndependent){
			  if(shiftDetailsForOrderIndependentData == undefined){
				  return this.interfaces.interfacesGetOrderIndependentDataCollection(this.appData.client,this.appData.plant, this.appData.shift.shiftID, this.appData.node.nodeID,this.appData.shift.shiftGrouping,this.appData.shift.startTimestamp,this.appData.shift.endTimestamp,[{dcElement : dcElement, client : this.appData.client}]);
			  }else{
				  //If Shift is different from current shift pass parameters for it used in case of standalone revieworder/shift for example
				  return this.interfaces.interfacesGetOrderIndependentDataCollection(this.appData.client,this.appData.plant, shiftDetailsForOrderIndependentData.shiftID, this.appData.node.nodeID,shiftDetailsForOrderIndependentData.shiftGrouping,shiftDetailsForOrderIndependentData.startTimestamp,shiftDetailsForOrderIndependentData.endTimestamp,[{dcElement : dcElement, client : this.appData.client}]);
			  }
		  }else if(isMachineDataCollection){
			  var runs = [];
			  if(runForDataRetreival != undefined){
				  runs = [{runID : runForDataRetreival}];
			  }else{
				 if(this.appData.selected.runID != undefined){
					 runs = [{runID : this.appData.selected.runID}];
				  }
			  }
				  return this.interfaces.interfacesGetDataCollectionForNodeAndRunAndDcElementAndTimePeriod(runs,nodeId,[{dcElement : dcElement, client : this.appData.client}],timeInterval.startTimestamp,timeInterval.endTimestamp,false);
			  }
		//If Time Interval based data needed use timeInterval Passed
			  else if(timeInterval != undefined){
					  return this.interfaces.getProductionRunDataForRunAndDcElemsAndTimeInterval([{dcElement : dcElement, client : this.appData.client}], timeInterval);
			  }
			  else{
				  var selectedRunID = this.appData.selected.runID; 
				  if(runForDataRetreival != undefined){
					  //If Data Retrieval needed is not for selected/current order use this parameter runForDataRetreival.
					  selectedRunID = runForDataRetreival;
				  }

				  return this.interfaces.getProductionRunDataForAnyRunAndDcElems([{dcElement : dcElement}],selectedRunID,dataPayload.materialList); // Material List is passed only if needed (optional parameter).
			  }
	  },
	  
	  onSelectEnableDeleteButton : function(){
			var oDetailsTable = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","detailsTable"));
			if(oDetailsTable.getSelectedItems().length > 0){
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","deleteButton")).setEnabled(true);
			} else {
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","deleteButton")).setEnabled(false);
			}
	  },
	  
	  handleCancel : function(oEvent){
			if(this.detailsDialog != undefined){
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","detailsSearchField")).setValue("");
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","deleteButton")).setEnabled(false);
				this._selectedProdRunData = undefined;
			}
		    oEvent.getSource().getParent().close();
	  },
	  
	  onClickReasonCode : function(oEvent) {
			var reasonCodeLink = oEvent.getSource();
			this._selectedProdRunData = oEvent.getSource().getBindingContext().getObject();
			
			var reasonCodeAttachedCallback = jQuery.proxy(this.reasonCodeAttached,this);
			sap.oee.ui.rcUtility.createReasonCodeToolPopup( 
					this, reasonCodeLink, this.appData.client, this.appData.plant, 
					this.appData.node.nodeID, this._selectedProdRunData.dcElement, this._selectedProdRunData,
			        'reasonCode',undefined,reasonCodeAttachedCallback);
		},
		
		reasonCodeAttached : function(){
			if(this._selectedProdRunData.reasonCodeData === undefined){ // He hasn't skipped assignment.
				var updatedData = this.interfaces.interfacesUpdateDataCollection(this.appData.client,[this._selectedProdRunData]); // Update Data Collection
				var oDetailsTable = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","detailsTable"));
		        var data = this.detailsDialog.getModel().getData();
				var aSelectedContextObjects = oDetailsTable.getSelectedContexts();
				if(updatedData != undefined){
					if(updatedData.entryID != undefined){
						oDetailsTable.removeSelections(true);
						var prodRunData = this.getProductionRunDataBasedOnOrderDependency(this._detailsDialogPayload);
					    if(prodRunData.details != undefined && prodRunData.details.results != undefined){
					    	data.prodList = prodRunData.details.results;
							this.detailsDialog.getModel().setData(data);
					    }
			            this.detailsDialog.getModel().checkUpdate(); 
			            this.detailsDialog.rerender();
			            this._selectedProdRunData = undefined;
			            if(data.refreshMethodToInvoke != undefined && data.oContextOfController != undefined){
			            	if(typeof data.refreshMethodToInvoke == 'function'){
			            		data.refreshMethodToInvoke.call(data.oContextOfController);
			            	}
			            }
			        }
			    }
			}
		},
		
		onClickAddComments : function(oEvent){  
			this._selectedProdRunData  = oEvent.getSource().getBindingContext().getObject();
			
			if(this.oCommentsDialog == undefined){
				this.oCommentsDialog = sap.ui.xmlfragment("detailsCommentPopup","sap.oee.ui.fragments.commentPopup", this);
		        this.getView().addDependent(this.oCommentsDialog);
		    }
			var commentBox = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsCommentPopup","comment"));
		    commentBox.setValue(""); // Clear 
		    
		    if(this._selectedProdRunData  != undefined){
		    	if(this._selectedProdRunData .comments != ""){
		    		commentBox.setValue(this._selectedProdRunData.comments);
				}
			}
		    
			this.oCommentsDialog.open();
		},
		
		onCommentDialogCancelButton : function(oEvent){
			this._selectedProdRunData  = undefined;
			this.oCommentsDialog.close();
		},
		
		onCommentDialogSaveButton : function(oEvent){
		    var oCommentBox = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsCommentPopup","comment"));
		    
		    if(this._selectedProdRunData){
			    this._selectedProdRunData.comments = oCommentBox.getValue();
		    	var updatedData = this.interfaces.interfacesUpdateDataCollection(this.appData.client,[this._selectedProdRunData]); // Update Data Collection
				var oDetailsTable = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","detailsTable"));
		        var data = this.detailsDialog.getModel().getData();
				var aSelectedContextObjects = oDetailsTable.getSelectedContexts();
				if(updatedData != undefined){
					if(updatedData.entryID != undefined){
						oDetailsTable.removeSelections(true);
						var prodRunData = this.getProductionRunDataBasedOnOrderDependency(this._detailsDialogPayload);
					    if(prodRunData.details != undefined && prodRunData.details.results != undefined){
					    	data.prodList = prodRunData.details.results;
							this.detailsDialog.getModel().setData(data);
					    }
			            this.detailsDialog.getModel().checkUpdate(); 
			            this.detailsDialog.rerender();
			            this._selectedProdRunData = undefined;
			            data.refreshMethodToInvoke.call(data.oContextOfController);
			        }
			    }
		    }
		    
		    this.oCommentsDialog.close();
		    
		},
		
	    handleDeletion : function(oEvent){
			var oController = this.getView().getController();
			var deleteAfterConfirm = function(bConfirm){
				if(bConfirm == sap.m.MessageBox.Action.OK){
					var oDetailsTable = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","detailsTable"));
		            var data = oController.detailsDialog.getModel().getData();
					var aSelectedContextObjects = oDetailsTable.getSelectedContexts();
					var response = oController.interfaces.interfacesDeleteDataCollection(sap.oee.ui.Utils.convertContextToJSONObjects(aSelectedContextObjects));
				    if(response != undefined){
						if(response.outputCode == 0){
							oDetailsTable.removeSelections(true);
							var matchedList = $.grep(data.prodList,function(element,elementindex){var i;for(i in aSelectedContextObjects){var entryID = aSelectedContextObjects[i].getObject().entryID; if(element.entryID === entryID)return false;else continue;}return true;});
							if(matchedList.length == 0){
								oController.detailsDialog.close();
							}
							
							var oModelData = oController.detailsDialog.getModel().getData();
							oModelData.prodList = matchedList;
							oController.detailsDialog.getModel().setData(oModelData);
				            oController.detailsDialog.getModel().checkUpdate(); 
				            oController.detailsDialog.rerender();
				            data.refreshMethodToInvoke.call(data.oContextOfController);
				        }
				    }
				    if(oDetailsTable.getSelectedItems().length > 0){
						sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","deleteButton")).setEnabled(true);
					} else {
						sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","deleteButton")).setEnabled(false);
					}
				}
			};
			
			sap.m.MessageBox.confirm(this.appComponent.oBundle.getText("OEE_MESSAGE_DELETE"),deleteAfterConfirm);
		},

	  handleOrderChange : function(){ 
	  	var ordersModel = new sap.ui.model.json.JSONModel();
	  	var outputOrderStatusList = this.interfaces.interfacesGetOrderStatusForRunsStartedInShiftInputSync(this.appData.node.nodeID,this.appData.client,this.appData.plant,this.appData.shift.shiftID,this.appData.shift.shiftGrouping,this.appData.shift.startTimestamp,this.appData.shift.endTimestamp,false);
	  	if(outputOrderStatusList != undefined){
	  		if(outputOrderStatusList.orderStatusList != undefined){
	  			if(outputOrderStatusList.orderStatusList.results != undefined){
	  				if(outputOrderStatusList.orderStatusList.results.length != 0){
	  					ordersModel.setData({orders : outputOrderStatusList.orderStatusList.results});
	  				}
	  			}
	  		}
	  	}
	  	
	  	if(this.oPopOver == undefined){
	  		this.oPopOver = sap.ui.xmlfragment("popover","sap.oee.ui.fragments.orderChangeDialog",this);
	  		this.oPopOver.setTitle(this.appComponent.oBundle.getText("OEE_HEADING_SELECT_ORDER"));
	  	  	var buttonTemplate = new sap.m.ObjectListItem({title : "{parts : [{path: 'order'},{path: 'routingOperNo'}], formatter : 'sap.oee.ui.Formatter.formatOrderNumber'}",attributes : [new sap.m.ObjectAttribute({text : "{material_desc}"}),new sap.m.ObjectAttribute({text : "{parts : [{path: 'orderStartTimestamp'},{path: 'appData>/plantTimezoneOffset'}], formatter : 'sap.oee.ui.Formatter.formatTimeStampWithoutLabel'}"})],type : "Active",firstStatus : new sap.m.ObjectStatus({text:"{parts : [{path: 'statusDescription'},{path: 'productionActivity'}], formatter : 'sap.oee.ui.Formatter.formatStatusTextAndActivity'}"})});
	  	  	 
	  	  	this.oPopOver.bindAggregation("items","/orders",buttonTemplate);
	  	  	this.oPopOver.attachConfirm(this.selectOrder,this);
	  	    this.oPopOver.attachSearch(this.orderSearch,this);
	  	    this.oPopOver.attachLiveChange(this.orderSearch,this);
	  	}
	  	
	  	this.oPopOver.setModel(ordersModel);
	  	this.oPopOver.open();
	  },

	  handleShiftChange : function(channelId, eventId, data){
		if (eventId === "shiftChange") {
			this.appComponent.getEventBus().publish(this.appComponent.getId(), "clearOrderContext");
			sap.oee.ui.Utils.setShiftInformationForApplication(data.shiftInfoJSON,this.appData,this.appComponent.getModel("appData"));
			this.setInitialOrderInformationIfAny();
			if(this.router.oHashChanger.getHash() == ""){
			    this.appComponent.getEventBus().publish(this.appComponent.getId(), "refreshPOD"); // Refresh POD Again If on  Home Screen
			}
		}
		
	    this.appComponent.getEventBus().publish(this.appComponent.getId(), "shiftChanged");
	},
	
	setSelectedOrderDetails : function(sRunID){
		  	if(sRunID != undefined){
			    var orderStatusJSON =  this.interfaces.interfacesGetOrderStatusForListOfRunsInputSync([sRunID]);
				
				if(orderStatusJSON.orderStatusList !=undefined && orderStatusJSON.orderStatusList.results != undefined && orderStatusJSON.orderStatusList.results.length > 0){
					this.appData.setSelectedOrderDetails(orderStatusJSON.orderStatusList.results[0]);
				}
				sap.oee.ui.Utils.updateModel(this.appComponent.getModel("appData"));
			}
	},

	changeOrder : function(channelId, eventId, data){
		   if(eventId === "orderChange"){
				this.appComponent.getEventBus().publish(this.appComponent.getId(), "clearOrderContext");
			    var sRunID = data.runID;
				if(sRunID != undefined){
				    this.setSelectedOrderDetails(sRunID);
				    if(this.router.oHashChanger.getHash() == ""){
				    	   this.appComponent.getEventBus().publish(this.appComponent.getId(), "refreshPOD"); // Refresh POD Again If on Home Screen
				    }
				    this.appComponent.getEventBus().publish(this.appComponent.getId(), "orderChanged");
				}
		   }
	},
	   
	checkForAlerts : function(){
		   var parameters = {"service":"alert","mode":"GetAlerts","content-type":"text/json","containerPropertyName":"nodeId,nodeId,Success","containerPropertyValue":"*;"+this.appData.node.nodeID+";True"};
		   var result = null;
		   var oController = this.getView().getController();
		   oController.latestAlertIDs = [];
		   
		   $.ajax({
			   	type: 'POST',
			   	url: "/XMII/Illuminator",
		   		data : parameters,
		   		dataType: 'json',
		   		cache: false,
		   		async: true,
		   		success: function(data, textStatus, jqXHR){
			   		var hasHighAlerts = false;
		   			if(data.Rowsets.Rowset.length > 0)
		   				if(data.Rowsets.Rowset[0].Row !== undefined){
		   					data.Rowsets.Rowset[0].Row.sort();
		   					for(var i in data.Rowsets.Rowset[0].Row){
		   						if(data.Rowsets.Rowset[0].Row[i].Status != 'Acknowledged' && data.Rowsets.Rowset[0].Row[i].Status != 'Expired')
		   						{
			   						oController.latestAlertIDs.push(data.Rowsets.Rowset[0].Row[i].ID);
			   						if(data.Rowsets.Rowset[0].Row[i].Severity == "High"){
			   							hasHighAlerts = true;
			   						}
		   						}
		   					}
		   				}
		   			
		   			if(oController.latestAlertIDs.length > 0)
		   			{
		   				oController.appData.hasNewAlerts = true;
		   			}
		   			else
		   				oController.appData.hasNewAlerts = false;
		   			
		   			sap.oee.ui.Utils.updateModel(oController.appComponent.getModel("appData"));
		   			
		   			if(hasHighAlerts){
		   				oController.openAlertsDialog();
		   			}else{
		   				if(oController.alertDialog && oController.alertDialog.isOpen()){
		   					oController.alertDialog.close();
		   				}
		   			}
		   		},
		   		headers : {"Access-Control-Allow-Origin" : "*"},
		   		crossDomain : true,
		   		error : function(data, textStatus, jqXHR){
		   		}
		   });
	},
	
	openAlertsDialog : function(){
		var oPanel;
		if(this.alertDialog == undefined){
			this.alertDialog = new sap.ui.xmlfragment("sap.oee.ui.fragments.alertDialog",this);
			this.getView().addDependent(this.alertDialog);
		}
		else
			this.alertDialog.destroyContent();
		

		this.createAlertDialogContent();
	},
	
	createAlertDialogContent : function(){
		var oController = this.getView().getController();
		if(this.latestAlertIDs.length > 0){
			var aResults = [];
			   for(i in this.latestAlertIDs){
				   var latestAlertID = this.latestAlertIDs[i];
				   if(latestAlertID !== undefined){
					   var parameters = {"service":"alert","mode":"GetDetails","id":latestAlertID,"content-type":"text/xml"};
					   $.ajax({
						   type: 'GET',
						   url: "/XMII/Illuminator",
						   data : parameters,
						   dataType: 'xml',
						   cache: false,
						   async: false,
						   success: function(data, textStatus, jqXHR){
						   	  var alertDesc = jQuery(data).find("ShortText").contents().first().text();
						   	  var alertLongDesc = jQuery(data).find("LongText").contents().first().text();
						   	  var alertSeverity = jQuery(data).find("Severity").contents().first().text();
						   	  var containerPropertySuccess = (jQuery(data).find("ContainerProperties").find("ContainerProperty").find("Name:contains('Success')").length)?true:false;
						   	  var statusInProcess = jQuery(data).find("Status").contents().first().text()=="In Process" ? true : false; 
						   	  if(!containerPropertySuccess){
							   	  oPanel = new sap.m.Panel({
							   		  headerToolbar : new sap.m.Toolbar({
							   			  	content : [
							   			  	            new sap.m.Text({text : alertDesc}),
							   			  	            new sap.m.ToolbarSpacer(),
							   			  	           	new sap.m.Text({text : jQuery(data).find("Status").contents().first().text() + " (" + alertSeverity + ")"})
							   			  	           ]
							   		  }),
							   		  expanded : false,
							   		  expandable : true,
							   		  content : [new sap.ui.layout.VerticalLayout({
							   		              		content : [
							   		              		           		new sap.m.Text({text : alertLongDesc , width : "100%"}).addStyleClass("textPadding"),
							   		              		           		new sap.ui.layout.HorizontalLayout({content : [new sap.m.Button({visible : !statusInProcess, text : oController.appComponent.oBundle.getText("OEE_LABEL_SET_TO_IN_PROCESS"),icon : 'sap-icon://initiative', press : [oController.setAlertStatus,oController] }).addStyleClass("marginRight").addCustomData(new sap.ui.core.CustomData({key : "alertID",value : latestAlertID})).addCustomData(new sap.ui.core.CustomData({key : "status",value : 1})),
							   		              		           		new sap.m.Button({text : oController.appComponent.oBundle.getText("OEE_LABEL_ACKNOWLEDGE"),icon : 'sap-icon://accept',press : [oController.setAlertStatus,oController]}).addStyleClass("marginRight").addCustomData(new sap.ui.core.CustomData({key : "alertID",value : latestAlertID})).addCustomData(new sap.ui.core.CustomData({key : "status",value : 2}))]})
							   		              		           ]
							   		              	})
							   		              ]					   		             
							   	  });
						   	  }else{
						   		 oPanel = new sap.m.Panel({
							   		  headerToolbar : new sap.m.Toolbar({
							   			  	content : [
							   			  	            new sap.m.Text({text : alertDesc}),
							   			  	            new sap.m.ToolbarSpacer(),
							   			  	           	new sap.m.Text({text : "Success"})
							   			  	           ]
							   		  }),
							   		  expanded : false,
							   		  expandable : true,
							   		  content : [new sap.ui.layout.VerticalLayout({
							   		              		content : [
							   		              		           		new sap.ui.layout.HorizontalLayout({content : [new sap.m.Button({text : "Done",icon : 'sap-icon://accept',press : [oController.setAlertStatus,oController]}).addStyleClass("marginRight").addCustomData(new sap.ui.core.CustomData({key : "alertID",value : latestAlertID})).addCustomData(new sap.ui.core.CustomData({key : "status",value : 2}))]})
							   		              		           ]
							   		              	})
							   		              ]					   		             
							   	  });
						   	  }
						   	  
						   	  oController.alertDialog.addContent(oPanel);
						   },
						   headers : {"Access-Control-Allow-Origin" : "*"},
						   crossDomain : true,
						   error : function(data, textStatus, jqXHR){
						   }
					   });
				   }
			   }
		}

		this.alertDialog.open();
	},
	
	setAlertStatus : function(oEvent){
		var oSource = oEvent.getSource();
		var parameters = {"service":"alert","mode":"SetStatus","id":oSource.data("alertID"),"content-type":"text/xml",Status : oSource.data("status")};
		
		var oController = this.getView().getController();
		$.ajax({
			   type: 'GET',
			   url: "/XMII/Illuminator",
			   data : parameters,
			   dataType: 'xml',
			   cache: false,
			   async: false,
			   success: function(data, textStatus, jqXHR){
					oController.checkForAlerts();
			   },
			   headers : {"Access-Control-Allow-Origin" : "*"},
			   crossDomain : true,
			   error : function(data, textStatus, jqXHR){
			   }
		   });
	},
	
	initializeAppInfo : function(){
		this.setAppUserAndTimeZoneInfo();
		
		this.setUserWorkcenterAssignmentsAndSetDefaultWorkcenter();
		
		this.setPODsAssignedToUserForCurrentWorkcenter();
		
		this.initializeGetAllActivitiesForClientAndPlant();
		
		this.setDefaultCustomizations();
		
	 	this.initializeShiftInformationInitially();
	 	
	 	this.setInitialOrderInformationIfAny();
	},
	
	initializeShiftInformationInitially : function(){
	    var currentShift_json= this.interfaces.interfacesGetCurrentShift();
	    sap.oee.ui.Utils.setShiftInformationForApplication(currentShift_json,this.appData,this.appComponent.getModel("appData"));

	 	jQuery.sap.intervalCall(1000* 60, this, this.refreshShiftDetails); // Check and Refresh Shift Details every minute.
	},
	
	refreshShiftDetails : function(){
		var currentTimestamp = new Date().getTime();
	 	if(this.appData.shift.isCurrentShift || this.appData.shift.shiftID == undefined){ 
	        this.interfaces.interfacesGetCurrentShift(currentTimestamp,true,this.checkForAutoRestartRun,this);
		} // In Current Shift Boundaries Then Refresh Shift Info else assume Mass Mode Operation.
	},
	
	checkForAutoRestartRun : function(currentShift_json){
		if(currentShift_json){
			var hasShiftChanged = this.appData.shift.shiftID !== currentShift_json.shiftDefinition;
			sap.oee.ui.Utils.setShiftInformationForApplication(currentShift_json,this.appData,this.appComponent.getModel("appData"));
			
			if(hasShiftChanged){ //Check For Auto Restart Run.
				this.interfaces.interfacesGetOrderStatusForRunsStartedInShiftInputSync(this.appData.node.nodeID,this.appData.client,this.appData.plant,this.appData.shift.shiftID,this.appData.shift.shiftGrouping,this.appData.shift.startTimestamp,this.appData.shift.endTimestamp,false);
			  	
				this.appComponent.getEventBus().publish(this.appComponent.getId(), "clearOrderContext",{orderChangePublish : true});
				
				this.appComponent.getEventBus().publish(this.appComponent.getId(), "refreshAndCheckForInitialOrderInformation");
			}
		}
	},
	
	initializeGetAllActivitiesForClientAndPlant : function(){
		if(this.appData.activityList == undefined){
			this.appData.activityList = this.interfaces.interfacesGetAllActivities(this.appData.client,this.appData.plant);
		}
	},
	
	setLineBehaviour : function(){
		var lineBehavior = this.interfaces.getCustomizationValueForNode(this.appData.client, 
				this.appData.plant,
				this.appData.node.nodeID, sap.oee.ui.oeeConstants.customizationNames.lineBehavior);
		
		if(lineBehavior!=undefined){
			this.appData.node.lineBehavior = lineBehavior.value;
		}else{
			this.appData.node.lineBehavior = sap.oee.ui.oeeConstants.serialLineBehaviourConstant; // Default Behaviour
		}
		
	},
	
	setDefaultCustomizations : function(){
		//Set Line Behaviour affects availibility calculation
		this.setLineBehaviour();
		
		//Set Decimal Precision For Line , customization used to set precision of values shown in Worker UI.
		this.setDecimalPrecisionCustomizationForLine();
	},
	
	setDecimalPrecisionCustomizationForLine : function(){
		var decimalPrecision = this.interfaces.getCustomizationValueForNode(this.appData.client, 
				this.appData.plant,
				this.appData.node.nodeID, sap.oee.ui.oeeConstants.customizationNames.decimalPrecision);
		
		if(decimalPrecision!=undefined){
			this.appData.decimalPrecision = parseInt(decimalPrecision.value);
		}else{
			this.appData.decimalPrecision = 2;
		}
	},
	
	setPODsAssignedToUserForCurrentWorkcenter : function(){
		if(this.appData.node.nodeID != undefined){
			/*
			 * Get the POD Details assigned for the logged in user.
			 * If the default POD is assigned as one of them, set the default POD
			 * Else, set the first entry of the result as the POD for the dashboard
			 */
			var podData = this.interfaces.getUserGroupPodAssignmentDataForLoggedInUser(
					this.appData.client, 
					this.appData.plant,
					this.appData.node.nodeID);
			
			var podAssigned = false;
			if(podData !=  undefined && podData.userGroupAndPods != undefined){
				for (var i = 0; i < podData.userGroupAndPods.results.length; i++){
					if (podData.userGroupAndPods.results[i].podId == this.appData.user.defaultPod) {
						this.appData.podID = podData.userGroupAndPods.results[i].podId;
						this.appData.podDescription = podData.userGroupAndPods.results[i].podDescription;
						this.appData.podType = podData.userGroupAndPods.results[i].podType;
						if(podData.userGroupAndPods.results[i].podImage != "" && podData.userGroupAndPods.results[i].podImage != " ")
						{
							this.appData.iconForShell = decodeURI(podData.userGroupAndPods.results[i].podImage);
						}else{
							this.appData.iconForShell = sap.oee.ui.oeeConstants.defaultSAPLogo;
						}
						podAssigned = true;
						break;
					}
				}
				
				if (podAssigned == false) {
					if (podData.userGroupAndPods.results.length > 0) {
						this.appData.podID = podData.userGroupAndPods.results[0].podId;
						this.appData.podDescription = podData.userGroupAndPods.results[0].podDescription;
						this.appData.podType = podData.userGroupAndPods.results[0].podType;
						if(podData.userGroupAndPods.results[0].podImage != "" && podData.userGroupAndPods.results[0].podImage != " ")
						{
							this.appData.iconForShell = decodeURI(podData.userGroupAndPods.results[0].podImage);
						}else{
							this.appData.iconForShell = sap.oee.ui.oeeConstants.defaultSAPLogo;
						}
						//Update User Preferences
					    this.interfaces.interfacesUpdateUserPreferences(this.appData.client, this.appData.plant, sap.oee.ui.oeeConstants.USERDEFAULTPARAMS.POD, this.appData.podID,true);
					    
					}
				}
				this.appData.noOfPODAssigned = podData.userGroupAndPods.results.length;
				//TODO Set Line Customizations
			}
		}	
	},
	
	setUserWorkcenterAssignmentsAndSetDefaultWorkcenter : function(){
		var workunitJSON = this.interfaces.interfacesGetPHNodesForUserInput(this.appData.client, this.appData.plant);
		var workunitAssigned = false;
		if(workunitJSON != undefined){
			if(workunitJSON.nodes != undefined){
				for (var i = 0; i < workunitJSON.nodes.results.length; i++) {
					if (workunitJSON.nodes.results[i].nodeID == this.appData.user.defaultWorkUnit) {
						this.appData.node.nodeID = workunitJSON.nodes.results[i].nodeID;
						this.appData.node.description = workunitJSON.nodes.results[i].description;
						this.appData.node.capacityID = workunitJSON.nodes.results[i].capacityID;
						this.appData.node.workcenterID = workunitJSON.nodes.results[i].workcenterID;
						workunitAssigned = true;
						this.setDefaultCustomizations();
						break;
					}
				}
				
				if (	workunitAssigned == false &&
						workunitJSON.nodes.results.length > 0) {
					this.appData.node.nodeID = workunitJSON.nodes.results[0].nodeID;
					this.appData.node.description = workunitJSON.nodes.results[0].description;
					this.appData.node.capacityID = workunitJSON.nodes.results[0].capacityID;
					this.appData.node.workcenterID = workunitJSON.nodes.results[0].workcenterID;
				    //Update User Preferences
				    this.interfaces.interfacesUpdateUserPreferences(this.appData.client, this.appData.plant, sap.oee.ui.oeeConstants.USERDEFAULTPARAMS.WORKCENTER, this.appData.node.nodeID,true);
				      
					this.setDefaultCustomizations();
				}
				this.appData.noOfworkunitAssigned = workunitJSON.nodes.results.length;
			}
		}
	},
	
	setAppUserAndTimeZoneInfo : function(){
		var userInfoJSON;
		
		if(jQuery.sap.getUriParameters().get("client") != "" && jQuery.sap.getUriParameters().get("client") != undefined && jQuery.sap.getUriParameters().get("plant") != "" && jQuery.sap.getUriParameters().get("plant") != undefined){
			userInfoJSON = this.interfaces.interfacesGetLogonUserInformationForClientAndPlant(jQuery.sap.getUriParameters().get("client"),jQuery.sap.getUriParameters().get("plant"));
			this.appData.client = jQuery.sap.getUriParameters().get("client");
			this.appData.plant = jQuery.sap.getUriParameters().get("plant");
			if(userInfoJSON.defaultWorkUnit){
				//Update User Preferences so that the plant preference is saved
			    this.interfaces.interfacesUpdateUserPreferences(this.appData.client, this.appData.plant, sap.oee.ui.oeeConstants.USERDEFAULTPARAMS.WORKCENTER, userInfoJSON.defaultWorkUnit,true);
			}
			clientPlantURIOverriden = true;
		}
		else{ 
			userInfoJSON = this.interfaces.interfacesGetLogonUserInformation();
			this.appData.client = userInfoJSON.defaultClient;
			this.appData.plant = userInfoJSON.defaultPlant;
		}
		
		this.appData.user.firstName = userInfoJSON.firstName;
		this.appData.user.lastName = userInfoJSON.lastName;
		this.appData.user.userID = userInfoJSON.uniqueName;
		
		var clientPlantURIOverriden;
		
		if(clientPlantURIOverriden && jQuery.sap.getUriParameters().get("defaultWorkcenter") != "" && jQuery.sap.getUriParameters().get("defaultWorkcenter") != undefined){
			this.appData.user.defaultWorkUnit = jQuery.sap.getUriParameters().get("defaultWorkcenter");
		}
		else{ 
			this.appData.user.defaultWorkUnit = userInfoJSON.defaultWorkUnit;
		}
		if(clientPlantURIOverriden && jQuery.sap.getUriParameters().get("defaultPod") != "" && jQuery.sap.getUriParameters().get("defaultPod") != undefined){
			this.appData.user.defaultPod = jQuery.sap.getUriParameters().get("defaultPod");
		}
		else{
			this.appData.user.defaultPod = userInfoJSON.defaultPod;
		}
		
		var plantTimezoneOffset = this.interfaces.getPlantTimezoneOffset();
		if (plantTimezoneOffset != undefined) {
			this.appData.plantTimezoneOffset = parseFloat(plantTimezoneOffset);
		}	
	},
	
	
	handleClose : function(oEvent){
		oEvent.getSource().getParent().close();
	},
	
	wcChange : function(oControlEvent) {
		var selectWorkunitPop = new sap.ui.xmlfragment("sap.oee.ui.fragments.selectionChangeFragment",this);

		selectWorkunitPop.setTitle(this.appComponent.oBundle.getText("OEE_LABEL_SELECT_WORKUNIT"));
		selectWorkunitPop.attachConfirm(this.selectedWorkunit,this);
		var template = new sap.m.StandardListItem({
            title : "{parts : [{path: 'description'},{path: 'workcenterID'}], formatter : 'sap.oee.ui.Formatter.formatIDAndDescriptionText'}"
		});
		
		template.addCustomData(new sap.ui.core.CustomData({key : 'nodeID', value : '{nodeID}'}));
        template.addCustomData(new sap.ui.core.CustomData({key : 'description', value : '{description}'}));
        template.addCustomData(new sap.ui.core.CustomData({key : 'parentNodeID', value : '{parentNodeID}'}));
        template.addCustomData(new sap.ui.core.CustomData({key : 'workcenterID', value : '{workcenterID}'}));
        template.addCustomData(new sap.ui.core.CustomData({key : 'capacityID', value : '{capacityID}'}));
        
        var workunitJSON = this.interfaces.interfacesGetPHNodesForUserInput(this.appData.client, this.appData.plant);
        var wcModel = new sap.ui.model.json.JSONModel();
        if(workunitJSON.nodes != undefined){
        if(workunitJSON.nodes.results != undefined){
        		wcModel.setData({workCenters : workunitJSON.nodes.results});
        	}
        }

        var doSearch = function(oEvent){
        	var properties = [];
    		properties.push("description");
    		properties.push("workcenterID");

    		sap.oee.ui.Utils.fuzzySearch(this,wcModel,oEvent.getParameter("value"),
    				selectWorkunitPop.getBinding("items"),oEvent.getSource(),properties);
        };
        
        selectWorkunitPop.attachSearch(doSearch);
        selectWorkunitPop.attachLiveChange(doSearch);
		selectWorkunitPop.bindAggregation("items","/workCenters",template);
		selectWorkunitPop.setModel(wcModel);
		selectWorkunitPop.open();
  },
  
  selectedWorkunit: function(oEvent){
	  if(oEvent.getParameter("selectedItem") != undefined){
	      var selected = oEvent.getParameter("selectedItem");
	      this.appData.node.nodeID = selected.data('nodeID');
	      this.appData.node.description = selected.data('description');
	      this.appData.node.capacityID = selected.data('capacityID');
	      this.appData.node.workcenterID = selected.data('workcenterID');
	      this.setDefaultCustomizations();
	      
	      this.appData.PODButtons = undefined; // Clear Cached POD Details
	      this.appData.PODs = undefined;
	      this.setPODsAssignedToUserForCurrentWorkcenter();
	      sap.oee.ui.Utils.updateModel(this.appComponent.getModel("appData"));

	      this.checkForAlerts();
	      var router = sap.ui.core.UIComponent.getRouterFor(this);
	      router.navTo("contentArea");
	      
	      //Update User Preferences
	      this.interfaces.interfacesUpdateUserPreferences(this.appData.client, this.appData.plant, sap.oee.ui.oeeConstants.USERDEFAULTPARAMS.WORKCENTER, this.appData.node.nodeID,true);
	      
	      this.appComponent.getEventBus().publish(this.appComponent.getId(), "wcChange");
	  }
  },
	
	startClock : function(oClockTextField) {
	    oClockTextField.setText(sap.oee.ui.Formatter.formatTimeWithLocale(new Date().getTime(),this.appData.plantTimezoneOffset));
	    var oController = this.getView().getController();
	    this.clockTimer = setTimeout(function(){oController.startClock(oClockTextField);},500);
	},
	
	podChange : function(){
			var podData = this.interfaces.getUserGroupPodAssignmentDataForLoggedInUser(
	                  this.appData.client, 
	                  this.appData.plant,
	                  this.appData.node.nodeID);
			
			if(podData.userGroupAndPods != undefined){
			for(var index=0;index<podData.userGroupAndPods.results.length;index++){
			for(var innerIndex=index+1;innerIndex<podData.userGroupAndPods.results.length;innerIndex++){
			      if(podData.userGroupAndPods.results[index].podId===podData.userGroupAndPods.results[innerIndex].podId)
			      {
			            podData.userGroupAndPods.results.splice(innerIndex,1);
			      }
			}
			}
			
			var selectPODPopup = new sap.ui.xmlfragment("sap.oee.ui.fragments.selectionChangeFragment",this);
			selectPODPopup.setTitle(this.appComponent.oBundle.getText("OEE_HEADING_SELECT_POD"));
			
			selectPODPopup.attachConfirm(this.selectedPOD,this);
			var template = new sap.m.StandardListItem({
	            title : "{parts : [{path: 'podDescription'},{path: 'podId'}], formatter : 'sap.oee.ui.Formatter.formatIDAndDescriptionText'}"
			});
			
			template.addCustomData(new sap.ui.core.CustomData({key : 'podID', value : "{podId}"}));
			template.addCustomData(new sap.ui.core.CustomData({key : 'podImage', value : "{podImage}"}));
	        template.addCustomData(new sap.ui.core.CustomData({key : 'podDescription', value : "{podDescription}"}));
	        template.addCustomData(new sap.ui.core.CustomData({key : 'podType', value : "{podType}"}));
	        
	        var podModel = new sap.ui.model.json.JSONModel();
	        if( podData.userGroupAndPods != undefined){
	        if(podData.userGroupAndPods.results != undefined){
	        		podModel.setData({pods : podData.userGroupAndPods.results});
	        	}
	        }
	        
			selectPODPopup.bindAggregation("items","/pods",template);
			selectPODPopup.setModel(podModel);
			
			var doSearch = function(oEvent){
	        	var properties = [];
	    		properties.push("podId");
	    		properties.push("podDescription");

	    		sap.oee.ui.Utils.fuzzySearch(this,podModel,oEvent.getParameter("value"),
	    				selectPODPopup.getBinding("items"),oEvent.getSource(),properties);
	        };
	        
	        selectPODPopup.attachSearch(doSearch);
	        selectPODPopup.attachLiveChange(doSearch);
	        
			selectPODPopup.open();
		}
	},
	
	selectedPOD : function(oEvent){
		if(oEvent.getParameter("selectedItem") != undefined){
			var selected =  oEvent.getParameter("selectedItem");
	        this.appData.podID = selected.data('podID');
	        this.appData.podDescription = selected.data('podDescription');
	        this.appData.podType = selected.data('podType');
	        // Set POD Image
	        if(selected.data('podImage') != "" && selected.data('podImage') != " ")
			{
				this.appData.iconForShell = decodeURI(selected.data('podImage'));
			}else{
				this.appData.iconForShell = sap.oee.ui.oeeConstants.defaultSAPLogo;
			}
	        this.appData.PODButtons = undefined;  // Clear Cached POD Details
	        this.appData.PODs = undefined;
		    sap.oee.ui.Utils.updateModel(this.appComponent.getModel("appData"));
		    
		    this.checkForAlerts();
		    var router = sap.ui.core.UIComponent.getRouterFor(this);
		    router.navTo("contentArea");
		    
		    //Update User Preferences
		    this.interfaces.interfacesUpdateUserPreferences( this.appData.client, this.appData.plant, sap.oee.ui.oeeConstants.USERDEFAULTPARAMS.POD, this.appData.podID,true);
		      
		    this.appComponent.getEventBus().publish(this.appComponent.getId(), "podChange");
		}
	},
	shiftChange : function(){
			this.shiftSelectionDialog = sap.ui.xmlfragment("sap.oee.ui.fragments.shiftSelectionDialog",this);
			var allShiftsJSON;
		 	var notCurrentShiftFlag = true;
			var dDefaultDate;
			if(this.appData.shift.startTimestamp != undefined && this.appData.shift.startTimestamp != ""){
		 		allShiftsJSON = this.interfaces.interfacesGetCurrentAndPreviousShiftsInput(this.appData.client, this.appData.plant, this.appData.node.capacityID, this.appData.node.workcenterID,this.appData.shift.startTimestamp);
		 		dDefaultDate = new Date(this.interfaces.interfacesGetTimeInMsAfterTimezoneAdjustmentsForTimeStamp(this.appData.shift.startTimestamp));
			}
		 	else{
		 		allShiftsJSON = this.interfaces.interfacesGetCurrentAndPreviousShiftsInput(this.appData.client, this.appData.plant, this.appData.node.capacityID, this.appData.node.workcenterID);
		 		notCurrentShiftFlag = false;
		 		dDefaultDate = new Date();
		 	}
			
			if(isNaN(dDefaultDate.getTime())){
				sap.oee.ui.Utils.createMessage(this.appComponent.oBundle.getText("OEE_MSG_SHIFT_DEF_INVALID"),"Error");
				dDefaultDate = new Date(); // Default to new Date
				return;
			}
			
			 var oDatePicker = new sap.m.DatePicker({
				   dateValue : dDefaultDate,
				   change : [this.changeHandler,this]
		     });

			 var oList = this.byId("oList");
			 
			 if(oList != undefined){
				 oList.destroy();
			 }

			 oList =  new sap.m.List({id : this.createId("oList")});
			 
			 var buttonTemplate = new sap.m.StandardListItem({press : [this.handleOK,this],title : "{parts : [{path: 'description'},{path: 'startDate'},{path: 'startTime'},{path: 'endTime'}], formatter : 'sap.oee.ui.Formatter.formatTextInBracketsForShift'}",type : "Active"});
			 
			 oList.bindAggregation("items","/shifts",buttonTemplate);
			 var oPanel = new sap.m.Panel();
			 oPanel.addContent(oDatePicker);
			 oPanel.addContent(oList);
			 
			 var oModel = new sap.ui.model.json.JSONModel();
			 
			 if(allShiftsJSON && allShiftsJSON.currentShiftOutputList && allShiftsJSON.currentShiftOutputList.results){
				 oModel.setData({shifts: allShiftsJSON.currentShiftOutputList.results});
			 }else{
				 oModel.setData({shifts: []});
			 }
		     
			 this.shiftSelectionDialog.addContent(oPanel);

			 this.shiftSelectionDialog.setModel(oModel);
			 this.getView().addDependent(this.shiftSelectionDialog);
			 this.shiftSelectionDialog.open();
			 
	},
	
	changeHandler : function(oEvent){
		var oShiftSelectionPicker = oEvent.getSource();
		var shiftInputDate = sap.oee.ui.Utils.removePlantTimezoneTimeOffsetAndSendUTC(oShiftSelectionPicker.getDateValue().getTime(), this.appData.plantTimezoneOffset);
 		allShiftsJSON = this.interfaces.interfacesGetShiftsForWorkCenter(this.appData.client, this.appData.plant, this.appData.node.capacityID, this.appData.node.workcenterID,shiftInputDate);
 		oShiftSelectionPicker.getModel().setData({shifts: allShiftsJSON.currentShiftOutputList.results});
 		oShiftSelectionPicker.getModel().checkUpdate();
	},
	
	handleOK : function(oEvent){
		var shiftInfoJSON = oEvent.getSource().getBindingContext().getObject();
		this.shiftSelectionDialog.close();
		this.appComponent.getEventBus().publish(this.appComponent.getId(), "shiftChange",{shiftInfoJSON : shiftInfoJSON});
	},

	clearOrderContext : function(channelId, eventId, data){
		   if(eventId === "clearOrderContext"){
			   this.appData.clearSelectedOrderContext();
		   }

		   if(data.orderChangePublish){
			   this.appComponent.getEventBus().publish(this.appComponent.getId(), "orderChanged");
		   }
	},
	
	visibleIfListHasMoreThanItem : function(obj){
		if(obj != undefined){
			if(obj > 1){
				return true;
			}
		}
		return false;
	},
	
	visibleIfListHasOnlyOneItem : function(obj){
		if(obj != undefined){
			if(obj == 1){
				return true;
			}
		}
		return false;
	},
	
	onPressShellHeadItem : function(oEvent){
		var oSource = oEvent.getSource();
		var oActionSheet = new sap.m.ActionSheet({placement : sap.m.PlacementType.Bottom});
		var oLogoutItem = new sap.m.Button({
			text : "Logout",
			icon : "sap-icon://log",
			press : [function(oEvent){
				this.interfaces.interfacesLogout("/OEEDashboard/OEEWorkerUI.jsp");
			},this]
		});
		oActionSheet.addButton(oLogoutItem);
		oActionSheet.openBy(oSource);
	},
	
	navToContentScreen : function(oEvent){
		this.router.navTo("contentArea");
	},
	
	headerChange : function(channelId, eventId, data){
		   if(eventId === "headerChange"){
			    this.byId("shellHeading").setText(data.headerText);
		   }
	  },
	  
	showOrHideNavButton : function(channelId, eventId, data){
		   if(eventId === "showOrHideNavButton"){
				var navButton = this.byId(sap.ui.core.Fragment.createId("header","navButton"));
				if(data.show == undefined){
					navButton.setVisible(true);
					this.byId("homeButton").setVisible(true);
				}
				else{
					navButton.setVisible(data.show);
					this.byId("homeButton").setVisible(data.show);
				}
				
		   }
	},
	
	navBack : function(){
		window.history.back();
	},
	
	setInitialOrderInformationIfAny : function(){
		var i;
		if(this.appData.selected.runID == undefined){
			var activeRunsList = this.interfaces.interfacesGetAllActiveHoldAndCompletedRunsForShiftInput(this.appData.node.nodeID,this.appData.client,this.appData.plant,this.appData.shift.shiftID,this.appData.shift.shiftGrouping,this.appData.shift.startTimestamp);
			if(activeRunsList != undefined){
				if(activeRunsList.length != 0){
					activeRunsList.sort();
					var orderStatusJSON;
					if(activeRunsList.length == 1){
					this.appData.selected.runID = activeRunsList[0];
						orderStatusJSON =  this.interfaces.interfacesGetOrderStatusForListOfRunsInputSync([this.appData.selected.runID]);
					}
					else
					{
						for(i=0;i < activeRunsList.length ; i++){ // Selected Order must always be of status ACT
							this.appData.selected.runID = activeRunsList[i];
							orderStatusJSON =  this.interfaces.interfacesGetOrderStatusForListOfRunsInputSync([this.appData.selected.runID]);
						
							if(orderStatusJSON && orderStatusJSON.orderStatusList && orderStatusJSON.orderStatusList.results.length && (orderStatusJSON.orderStatusList.results[0].status == sap.oee.ui.oeeConstants.status.COMPLETED || orderStatusJSON.orderStatusList.results[0].status == sap.oee.ui.oeeConstants.status.HOLD)){
								continue;
							}
							else
								break;
						}
					}
					
					if(orderStatusJSON.orderStatusList !=undefined && orderStatusJSON.orderStatusList.results != undefined && orderStatusJSON.orderStatusList.results.length > 0){
						this.appData.setSelectedOrderDetails(orderStatusJSON.orderStatusList.results[0]);
					}
				}
			}
			 sap.oee.ui.Utils.updateModel(this.appComponent.getModel("appData"));
		}
		else{
			this.appComponent.getEventBus().publish(this.appComponent.getId(), "refreshOrderDetails");
		}

		this.appComponent.getEventBus().publish(this.appComponent.getId(), "orderChanged"); // Publish Order Changed Event
   },
   
   navToHelpLink : function(oEvent){
	   if(this.appData.oeeHelpLink != undefined){
		   window.open(this.appData.oeeHelpLink);
	   }
   },
   
   detailsSearch : function(oEvent){
	   var properties = [];
		properties.push("quantity");
		properties.push("uom");
		properties.push("changedBy");
		properties.push("descriptionOfReasonCode");
		properties.push("comments");
		 
		var oSearchField = oEvent.getSource();
		var oDetailsTable = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("detailsTableFragment","detailsTable"));
	       
		sap.oee.ui.Utils.fuzzySearch(this,this.detailsDialog.getModel(),oSearchField.getValue(),
				oDetailsTable.getBinding("items"),oSearchField,properties,
				[],true);
   },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf componentexample.Main
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf componentexample.Main
*/
	onAfterRendering: function() {
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf componentexample.Main
*/
	onExit: function() {
	    clearTimeout(this.clockTimer);
		
		if(this.alertDialog != undefined){
			this.alertDialog.destroy();
		}
		
		if(this.oPopOver != undefined){
			this.oPopOver.destroy();
	    }
		
		if(this.oCommentsDialog != undefined){
			this.oCommentsDialog.destroy();
		}
		    
		if(this.detailsDialog != undefined){
			this.detailsDialog.destroy();
		} 
	}

});