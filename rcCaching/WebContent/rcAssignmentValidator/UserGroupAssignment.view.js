sap.ui.jsview("sap.mpm.ui.activity.application.UserGroupAssignment", {

	getControllerName : function() {
		return "sap.mpm.ui.activity.application.UserGroupAssignment";
	},

	createContent : function(oController) {
		var accordion = new sap.ui.commons.Accordion(
				{
					id : this.createId("phAccordion"),
					width : '400px',
					sectionOpen : [ function(oControlEvent) {
										var openSectionId = oControlEvent
												.getParameter("openSectionId");
										var section = sap.ui.getCore().byId(openSectionId);
										this.createPlantHierarchyForSection(section, oController);
										oController.disableAllTabs();
								} , this],
					sectionClose : [ function(oControlEvent) {										
										this.createPlantHierarchyForFirstSection(oController);					
										oController.disableAllTabs();
									}, this]
				});

		var tabStrip = new sap.ui.commons.TabStrip( {
			id : this.createId('phTabStrip'),
			width : '1000px',
			select : function(oControlEvent) {
				oController.setTabContent(oControlEvent.getParameter('index'));
			}
		});
		
		var userGroupPodAssignmentTab = new sap.ui.commons.Tab({
			id : this.createId("userGroupPodAssignmentTab"),
			title: new sap.ui.commons.Title({
					text: oOEEBundle.getText("OEE_TAB_UGPODASSIGNMENT")
			}),
			enabled: oController.userGroupPodAssignmentTabEnabled,
			visible: oController.userGroupPodAssignmentTabEnabled
		}).addContent(this.createUserGroupPodAssignmentScreen(oController));
		
		var configAdminUserGroupAssignmentTab = new sap.ui.commons.Tab({
			id : this.createId("configAdminUserGroupAssignmentTab"),
			title : new sap.ui.commons.Title({
					text: oOEEBundle.getText("OEE_TAB_ACUGASSIGNMENT")
			}),
			enabled: oController.configAdminUserGroupPodAssignmentTabEnabled,
			visible: oController.configAdminUserGroupPodAssignmentTabEnabled
		}).addContent(this.createConfigAdminUserGroupAssignmentScreen(oController));
		
		var customizationTab = new sap.ui.commons.Tab({
			id : this.createId("customizationTab"),
			title : new sap.ui.commons.Title({
					 text : oOEEBundle.getText("OEE_TAB_CUSTOMIZATION_CONFIG")
			}),
			enabled: oController.customizationConfigurationTabEnabled,
			visible: oController.customizationConfigurationTabEnabled
		}).addContent(this.createCustomizationConfigurationScreen(oController));
		
		var reasonCodeConfigurationTab = new sap.ui.commons.Tab({
			id : this.createId("reasonCodeConfigurationTab"),
			title : new sap.ui.commons.Title({
					 text : oOEEBundle.getText("OEE_TAB_REASON_CODE_CONFIGURATION")
			}),
			enabled: oController.reasonCodeConfigurationTabEnabled,
			visible: oController.reasonCodeConfigurationTabEnabled
		}).addContent(this.createReasonCodeConfigurationScreen(oController));
		
		var extensionConfigurationTab = new sap.ui.commons.Tab({
			id : this.createId("extensionConfigurationTab"),
			title : new sap.ui.commons.Title({
					 text : oOEEBundle.getText("OEE_TAB_EXTENSION_CONFIG")
			}),
			enabled: oController.extensionConfigurationTabEnabled,
			visible: oController.extensionConfigurationTabEnabled
		}).addContent(this.createExtensionConfigurationScreen(oController));
		
		var geolocationTab = new sap.ui.commons.Tab({
			id : this.createId("geolocationTab"),
			title : new sap.ui.commons.Title({
					 text : oOEEBundle.getText("OEE_TAB_GEOLOCATION_CONFIG")
			}),
			enabled: false,
			visible: false
		}).addContent(this.createGeolocationConfigurationScreen(oController));
		
		tabStrip.addTab(userGroupPodAssignmentTab);
		tabStrip.addTab(configAdminUserGroupAssignmentTab);
		tabStrip.addTab(customizationTab);
		tabStrip.addTab(reasonCodeConfigurationTab);
		tabStrip.addTab(extensionConfigurationTab);
		tabStrip.addTab(geolocationTab);
		
		var accordionVerticalLayoutContainer = new sap.ui.commons.layout.VerticalLayout({
			height : '100%'
		});
		accordionVerticalLayoutContainer.addContent(accordion);
		
		var tabStripHorizontalLayoutContainer = new sap.ui.commons.layout.HorizontalLayout({
			id : this.createId('phTabStripContainer'),
			width: '100%'
		});
		tabStripHorizontalLayoutContainer.addContent(tabStrip);
		
		var baseHorizontalLayout = new sap.ui.commons.layout.HorizontalLayout( {
			width : '100%',
			content : [ accordionVerticalLayoutContainer, tabStripHorizontalLayoutContainer ]
		});
		
  	  this.userName = new sap.ui.commons.TextView({
		  id: this.createId('user-name')
	  });

  	  this.helpLink = new sap.ui.commons.Link( {
		  id : "oee-help-link",
		  text : oOEEBundle.getText("OEE_HYPERLINK_HELP"),
		  target : "_blank"
	  });
  	
  	  var fLogout = function(){
			interfacesLogout("/OEEDashboard/UserGroupAssignment.jsp");  
	  };
	  
	  this.appIcon = 'sap/mpm/ui/assets/SAPLogo.gif';
	  var appShell = new sap.ui.ux3.Shell({
		  id : this.createId('main-shell'),
		  appTitle : oOEEBundle.getText('OEE_HEADING_SAP_OEE'),
		  appIcon : this.appIcon,
		  showLogoutButton : true,
		  showTools : false,
		  showPane : false,
		  headerItems: [this.userName, this.helpLink],
		  headerType : sap.ui.ux3.ShellHeaderType.NoNavigation,
          logout: fLogout
	  });
	  var oNotificationBar = sap.ui.getCore().byId('mpm-notification-bar'); 
	  appShell.setNotificationBar(oNotificationBar);
	  
	  var titleTextView = new sap.ui.commons.TextView({
			textDirection : sap.ui.core.TextDirection.Inherit, 
			accessibleRole : sap.ui.core.AccessibleRole.Document,
			design : sap.ui.commons.TextViewDesign.H2,
			wrapping : true,
			semanticColor : sap.ui.commons.TextViewColor.Default,
			textAlign : sap.ui.core.TextAlign.Center
		}).setText(oOEEBundle.getText("OEE_HEADING_GENERAL_CONFIG"));
	  
	  var shellContentLayout = new sap.ui.commons.layout.MatrixLayout({
			height : "100%"
		});
	  shellContentLayout.createRow(titleTextView);
	  shellContentLayout.createRow(baseHorizontalLayout);
	
	  appShell.addContent(shellContentLayout);
	  
	  setHelpLink(oOEEBundle.getText("OEE_HELP_USER_GR_ASSIGN"));
	  
	  return appShell;
	},
	
	createPlantHierarchyTree : function(oController) {
		
		var phTree = new sap.ui.commons.Tree( {
			id : this.createId("phTree"),
			select : function(oControlEvent) {
				oController.getSelectedHierarchyNode(oControlEvent);
			}
		});
		phTree.setShowHeader(false);
		var phTreeNode = new sap.ui.commons.TreeNode();
		phTreeNode.bindProperty("text", "description");
		phTreeNode.setExpanded(true);
		phTree.bindAggregation("nodes", "/root", phTreeNode);
	},
	
	createPlantHierarchyForFirstSection : function(oController) {
		this.destroyIfAlreadyExists("phTree");
		this.createPlantHierarchyTree(oController);
		oController.createPlantHierarchyForFirstSection();
	},
	
	createPlantHierarchyForSection : function(section, oController) {
		this.destroyIfAlreadyExists("phTree");
		this.createPlantHierarchyTree(oController);
		oController.createPlantHierarchyForSection(section);
	},
	
	setMainTabIndex : function(tabIndex) {
		var tabStrip = this.byId("phTabStrip");
		if (tabStrip != undefined) {
			tabStrip.setSelectedIndex(tabIndex);
			tabStrip.rerender();
		}
	},

	createUserGroupPodAssignmentScreen : function(oController) {
		var userGroupTable = new sap.ui.table.Table( {
			id : this.createId("userGroupPodAssignmentTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : oController.userGroupPodAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddUserGroupPodAssignmentDialog(oController, this);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_EDIT"),
					enabled : oController.userGroupPodAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {
								var dialog = this.createEditUserGroupPodAssignmentDialog(oController, this);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : oController.userGroupPodAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {
									this.deleteUserGroupPodAssignment(oController, this);
							}, this]
						
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : oController.userGroupPodAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {
									this.deleteAllUserGroupPodAssignment(oController, this);
							}, this]
					
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_SAVE"),
					enabled : oController.userGroupPodAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {
									this.saveUserGroupPodAssignment(oController, this);
							}, this]
					
				}) ]
			})
		});
		
		var factoryFunction = function(value){
			if(this.getBindingContext() && this.getBindingContext().getObject() && this.getBindingContext().getObject().isInherited){
				this.addStyleClass("inheritedCell");
			}else{
				this.removeStyleClass("inheritedCell");
			}
			return value;
		};

		var userGroupField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_USERGROUP"),
			editable : false
		}).bindProperty("value", "userGroupId",factoryFunction);

		var podField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_POD_DESCRIPTION"),
			editable : false
		}).bindProperty("value", "podDescription",factoryFunction);

		userGroupTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_USERGROUP")
			}),
			template : userGroupField,
//			sortProperty : "userGroup",
//			filterProperty : "userGroup",
			width : "200px"
		}));
		
		userGroupTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_POD_DESCRIPTION")
			}),
			template : podField,
//			sortProperty : "podDescription",
//			filterProperty : "podDescription",
			width : "200px"
		}));

		userGroupTable.bindRows("/userGroupData");
		return userGroupTable;
	},
	
	createAddUserGroupPodAssignmentDialog : function (oController, jsView) {

		var selectedUserGroupId;
		var selectedPodId;
		var selectedPodDescription;
		
		var filterLabel = new sap.ui.commons.Label( {
			text : oOEEBundle.getText("OEE_LABEL_FILTER")
													});
		var filterText = new sap.ui.commons.TextField( {id:this.createId("filterUserGroup"),
														value : "*"
													});
		 var filterButton = new sap.ui.commons.Button( {
				text :  oOEEBundle.getText("OEE_LABEL_FILTER"),
				enabled : true,
				press : [ function(oControlEvent) {								
					oController.getAllUserGroups(this.byId("filterUserGroup").getValue());
					oController.getAllPods();
					var userGroupLabel = new sap.ui.commons.Label({
						  text: oOEEBundle.getText("OEE_LABEL_USERGROUP")
					});
					  
					jsView.destroyIfAlreadyExists("addUserGroupComboBox");
					var userGroupField = new sap.ui.commons.ComboBox({
						id : jsView.createId("addUserGroupComboBox")
					});
					userGroupField.setRequired(true);
					userGroupLabel.setLabelFor(userGroupField);
					
					var userGroupsListItem = new sap.ui.core.ListItem();
					userGroupsListItem.bindProperty("text", "uniqueName");
					userGroupsListItem.bindProperty("key", "uniqueName");
					
					userGroupField.setModel(oController.allUserGroupsModel);
					userGroupField.bindItems("/userGroups", userGroupsListItem);
					
					var podLabel = new sap.ui.commons.Label({
						  text: oOEEBundle.getText("OEE_TEXT_DASHBOARD")
					});
					  
					jsView.destroyIfAlreadyExists("addPodComboBox");
					var podField = new sap.ui.commons.ComboBox({
						id : jsView.createId("addPodComboBox")
					});
					podField.setRequired(true);
					podLabel.setLabelFor(podField);
					
					var podsListItem = new sap.ui.core.ListItem();
					podsListItem.bindProperty("text", "description");
					podsListItem.bindProperty("key", "podId");
					
					podField.setModel(oController.allPodsModel);
					podField.bindItems("/pods", podsListItem);
					dialogMatrixLayout.removeRow(dialogMatrixLayout.getRows()[2]);
					dialogMatrixLayout.removeRow(dialogMatrixLayout.getRows()[2]);
					dialogMatrixLayout.createRow(userGroupLabel, userGroupField);
					dialogMatrixLayout.createRow(podLabel, podField);
							
						}, oController, jsView]
		 });
		var dialog = new sap.ui.commons.Dialog({
			title : oOEEBundle.getText("OEE_HEADING_ADD_UGPOD_ASSIGNMENT"),
			width: '350px',
			modal : true
		});
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		dialogMatrixLayout.createRow(filterLabel,filterText);
		dialogMatrixLayout.createRow(filterButton);
		
		var addButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_ADD"),
			press : function(oEvent) {
			
				var userGroupComboBox = jsView.byId("addUserGroupComboBox");
				if (userGroupComboBox != undefined) {
					selectedUserGroupId = userGroupComboBox.getSelectedKey();
				}
				
				var podComboBox = jsView.byId("addPodComboBox");
				if (podComboBox != undefined) {
					selectedPodId = podComboBox.getSelectedKey();
					selectedPodDescription = podComboBox.getValue();
				}
				
				if (selectedUserGroupId != undefined && selectedPodId != undefined) {
					if (selectedUserGroupId != "" && selectedPodId != "") {
						oController.addNewUserGroupPodAssignmentRow(selectedUserGroupId, selectedPodId, selectedPodDescription);
					}
				}
				
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	createEditUserGroupPodAssignmentDialog : function (oController, jsView) {
		
		var userGroupTable = jsView.byId("userGroupPodAssignmentTable");
		if (userGroupTable != undefined) {
			var selectedRowIndex = userGroupTable.getSelectedIndex();
			if (selectedRowIndex >= 0) {
				var selectedPodId;
				var selectedPodDescription;
				
				var selectedData = oController.getSelectedValueFromUserGroupPodAssignmentTable(selectedRowIndex);
				
				if (selectedData != undefined) {
					oController.getAllPods();
					
					var dialog = new sap.ui.commons.Dialog({
						title : oOEEBundle.getText("OEE_HEADING_EDIT_UGPOD_ASSIGNMENT"),
						width: '350px',
						modal : true
					});
					
					var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
						columns : 2
					});
					
					var userGroupLabel = new sap.ui.commons.Label({
						  text: oOEEBundle.getText("OEE_LABEL_USERGROUP")
					});
					  
					var userGroupField = new sap.ui.commons.TextView({
						textDirection : sap.ui.core.TextDirection.Inherit, 
						accessibleRole : sap.ui.core.AccessibleRole.Document,
						design : sap.ui.commons.TextViewDesign.Standard,
						wrapping : true,
						semanticColor : sap.ui.commons.TextViewColor.Default,
						textAlign : sap.ui.core.TextAlign.Begin
					}).setText(selectedData.userGroupId);
					
					var podLabel = new sap.ui.commons.Label({
						  text: oOEEBundle.getText("OEE_LABEL_POD_DESCRIPTION")
					});
					  
					jsView.destroyIfAlreadyExists("editPodComboBox");
					var podField = new sap.ui.commons.ComboBox({
						id : jsView.createId("editPodComboBox")
					});
					podField.setRequired(true);
					podLabel.setLabelFor(podField);
					
					var podsListItem = new sap.ui.core.ListItem();
					podsListItem.bindProperty("text", "description");
					podsListItem.bindProperty("key", "podId");
					
					podField.setModel(oController.allPodsModel);
					podField.bindItems("/pods", podsListItem);
					podField.setSelectedKey(selectedData.podId);
					
					dialogMatrixLayout.createRow(userGroupLabel, userGroupField);
					dialogMatrixLayout.createRow(podLabel, podField);
					
					var addButton = new sap.ui.commons.Button({
						text: oOEEBundle.getText("OEE_BTN_OK"),
						press : function(oEvent) {
						
							var podComboBox = jsView.byId("editPodComboBox");
							if (podComboBox != undefined) {
								selectedPodId = podComboBox.getSelectedKey();
								selectedPodDescription = podComboBox.getValue();
							}
							
							if (selectedPodId != undefined) {
								if (selectedPodId != "") {
									oController.editUserGroupPodAssignmentRow(selectedRowIndex, selectedPodId, selectedPodDescription,selectedData.isInherited);
								}
							}
							
							dialog.destroyContent();
							dialog.close();
						}
					});
					
					var cancelButton = new sap.ui.commons.Button({
						text: oOEEBundle.getText("OEE_BTN_CANCEL"),
						press : function(oControlEvent) {
							dialog.destroyContent();
							dialog.close();
						}
					});
					
					dialog.addContent(dialogMatrixLayout);
					dialog.addButton(addButton);
					dialog.addButton(cancelButton);
					
					return dialog;
				}
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_EDIT"), sap.ui.core.MessageType.Warning);
			}
		}
	},
	
	deleteUserGroupPodAssignment : function (oController, jsView) {
		var userGroupTable = jsView.byId("userGroupPodAssignmentTable");
		if (userGroupTable != undefined) {
			var selectedRowIndex = userGroupTable.getSelectedIndex();
			if (selectedRowIndex != -1) {
				oController.deleteUserGroupPodAssignmentRow(selectedRowIndex);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
			}
		}
	},
	
    deleteAllUserGroupPodAssignment : function (oController, jsView) {
    	oController.deleteAllUserGroupPodAssignmentRows();
    },
    
    saveUserGroupPodAssignment : function (oController, jsview) {
    	var saveResultMessage = oController.saveUserGroupPodAssignmentData();
    	if (saveResultMessage != undefined) {
    		createMessage(saveResultMessage, sap.ui.core.MessageType.Success);
    	}
    },
	
	createConfigAdminUserGroupAssignmentScreen : function(oController) {
		var configAdminUserGroupTable = new sap.ui.table.Table( {
			id : this.createId("configAdminUserGroupAssignmentTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : oController.configAdminUserGroupAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddConfigAdminUserGroupAssignmentDialog(oController, this);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : oController.configAdminUserGroupAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {
								this.deleteConfigAdminUserGroupAssignment(oController, this);
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : oController.configAdminUserGroupAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {
								this.deleteAllConfigAdminUserGroupAssignment(oController, this);
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_SAVE"),
					enabled : oController.configAdminUserGroupAssignmentScreenButtonsEnabled,
					press : [ function(oControlEvent) {
								this.saveConfigAdminUserGroupAssignment(oController, this);
							}, this]
					
				}) ]
			})
		});

		var userGroupField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_USERGROUP"),
			editable : false
		}).bindProperty("value", "userGroupId");
		
		configAdminUserGroupTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_USERGROUP")
			}),
			template : userGroupField,
//			sortProperty : "userGroup",
//			filterProperty : "userGroup",
			width : "200px"
		}));
		
		configAdminUserGroupTable.bindRows("/configAdminUserGroupData");
		return configAdminUserGroupTable;
	},
	
	createAddConfigAdminUserGroupAssignmentDialog : function (oController, jsView) {
		var selectedUserGroupId;
		 var filterLabel = new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_FILTER")
			});
		 var filterText = new sap.ui.commons.TextField( {id:this.createId("filterUserGroupAdmin"),
				value : "*"
			});
		 var filterButton = new sap.ui.commons.Button( {
				text :  oOEEBundle.getText("OEE_LABEL_FILTER"),
				enabled : true,
				press : [ function(oControlEvent) {								
					oController.getAllUserGroups(this.byId("filterUserGroupAdmin").getValue());			
					var userGroupLabel = new sap.ui.commons.Label({
						  text: oOEEBundle.getText("OEE_LABEL_USERGROUP")
					});
					  
					jsView.destroyIfAlreadyExists("addUserGroupComboBox");
					var userGroupField = new sap.ui.commons.ComboBox({
						id : jsView.createId("addUserGroupComboBox")
					});
					userGroupField.setRequired(true);
					userGroupLabel.setLabelFor(userGroupField);
					
					var userGroupsListItem = new sap.ui.core.ListItem();
					userGroupsListItem.bindProperty("text", "uniqueName");
					userGroupsListItem.bindProperty("key", "uniqueName");
					
					userGroupField.setModel(oController.allUserGroupsModel);
					userGroupField.bindItems("/userGroups", userGroupsListItem);
					
					
					dialogMatrixLayout.removeRow(dialogMatrixLayout.getRows()[2]);
					dialogMatrixLayout.createRow(userGroupLabel, userGroupField);
							
						}, oController, jsView]
		 });

		var dialog = new sap.ui.commons.Dialog({
			title : oOEEBundle.getText("OEE_HEADING_ADD_ACUG_ASSIGNMENT"),
			width: '350px',
			modal : true
		});
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		
		dialogMatrixLayout.createRow(filterLabel,filterText);
		dialogMatrixLayout.createRow(filterButton);
		var addButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_ADD"),
			press : function(oEvent) {
			
				var userGroupComboBox = jsView.byId("addUserGroupComboBox");
				if (userGroupComboBox != undefined) {
					selectedUserGroupId = userGroupComboBox.getSelectedKey();
				}
				
				if (selectedUserGroupId != undefined) {
					if (selectedUserGroupId != "") {
						oController.addNewConfigAdminUserGroupAssignmentRow(selectedUserGroupId);
					}
				}
				
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	deleteConfigAdminUserGroupAssignment : function (oController, jsView) {
		var userGroupTable = jsView.byId("configAdminUserGroupAssignmentTable");
		if (userGroupTable != undefined) {
			var selectedRowIndex = userGroupTable.getSelectedIndex();
			if (selectedRowIndex != -1) {
				oController.deleteConfigAdminUserGroupAssignmentRow(selectedRowIndex);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
			}
		}
	},
	
    deleteAllConfigAdminUserGroupAssignment : function (oController, jsView) {
    	oController.deleteAllConfigAdminUserGroupAssignmentRows();
    },
    
    saveConfigAdminUserGroupAssignment : function (oController, jsview) {
    	var saveResultMessage = oController.saveConfigAdminUserGroupAssignmentData();
    	if (saveResultMessage != undefined) {
    		createMessage(saveResultMessage, sap.ui.core.MessageType.Success);
    	}
    },
	
	destroyIfAlreadyExists : function(uiElementName) {
		var uiElement = this.byId(uiElementName);
		if (uiElement != undefined) {
			uiElement.destroy();
		}
	},
	
	createCustomizationConfigurationScreen : function(oController) {
		var customizationMasterMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : '100%'
		});
		
		var customizationNameTable = new sap.ui.table.Table( {
			id : this.createId("customizationNameTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddCustomizationValueDialog(oController, this);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					id : this.createId("customizationNameTableDeleteButton"),
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteCustomizationValue(oController, this);
							}, this]
						
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : false,
					visible : false,
					press : [ function(oControlEvent) {
								this.deleteAllCustomizationValues(oController, this);	
							}, this]
					
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_SAVE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.saveCustomizationValues(oController, this);	
							}, this]
					
				}) ]
			}),
			
			rowSelectionChange : [ function(oControlEvent) {
				var rowContext = oControlEvent.getParameter("rowContext");
				var rowIndex = oControlEvent.getParameter("rowIndex");
				if (rowIndex >= 0) {
					oController.currentSelectedCustomizationName = rowContext.getProperty("customizationName");
					oController.isSelectedCustomizationValueMultiValued = rowContext.getProperty("isCustomizationNameMultiValued");
					oController.isSelectedCustomizationValueInherited = rowContext.getProperty("isCustomizationValueInherited");
					oController.isDimensionAvailableForSelectedCustomizationValue = rowContext.getProperty("isDimensionAvailable");
					oController.allUOMForDimensionModel = undefined; //reset the model before reloading
					oController.allowedValuesModel =  undefined;
					if (oController.currentSelectedCustomizationName != undefined) {
						oController.isCustomizationNameSelected = true;
					}				
					oController.enableCustomizationValuesScreen();
					oController.bindCurrentCustomizationValueDetailsDataToUIElement(rowIndex);
				}
			}, this]
		});

		var materialField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_MATERIAL"),
			editable : false
		}).bindProperty("value", "materialDescription");

		var customizationNameField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_NAME"),
			editable : false
		}).bindProperty("value", "customizationNameDescription");

		customizationNameTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_MATERIAL")
			}),
			template : materialField,
//			sortProperty : "materialDescription",
//			filterProperty : "materialDescription",
			width : "200px"
		}));
		
		customizationNameTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_NAME")
			}),
			template : customizationNameField,
//			sortProperty : "customizationNameDescription",
//			filterProperty : "customizationNameDescription",
			width : "200px"
		}));

		customizationNameTable.bindRows("/customizationValues");

		var customizationValueTabStrip = new sap.ui.commons.TabStrip( {
			id : this.createId('customizationValueTabStrip'),
			width : '800px',
			select : function(oControlEvent) {
				
			}
		});
		
		var tabForSingleValuedCustomizationValue = new sap.ui.commons.Tab({
			id : this.createId('singleValuedCustomizationValueTab'),
			title : new sap.ui.commons.Title({
				text : oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_VALUE")
			}),
			enabled : oController.isCustomizationValueSingleValued,
			visible : oController.isCustomizationValueSingleValued
		}).addContent(this.createSingleValuedCustomizationValueScreen(oController));
		
		var tabForMultiValuedCustomizationValue = new sap.ui.commons.Tab({
			id : this.createId('multiValuedCustomizationValueTab'),
			title : new sap.ui.commons.Title({
				text : oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_VALUE")
			}),
			enabled : !(oController.isCustomizationValueSingleValued),
			visible : !(oController.isCustomizationValueSingleValued)
		}).addContent(this.createMultiValuedCustomizationValueScreen(oController));
		
		customizationValueTabStrip.addTab(tabForSingleValuedCustomizationValue);
		customizationValueTabStrip.addTab(tabForMultiValuedCustomizationValue);
		
		customizationMasterMatrixLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [customizationNameTable]
				})]
		}));
		customizationMasterMatrixLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [customizationValueTabStrip]
				})]
		}));
		
		return customizationMasterMatrixLayout;
	},
	
	setIndexForCustomizationTable : function(index) {
		
		var customizationNameTable = this.byId("customizationNameTable");
		if (customizationNameTable != undefined) {
			customizationNameTable.setSelectedIndex(index);
			customizationNameTable.rerender();
		}
	},
	
	createSingleValuedCustomizationValueScreen : function(oController) {
		
		var matrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : '100%',
			widths : ['20%', '80%']
		});
		
		var customizationValueLabel = new sap.ui.commons.Label({
			text : oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_VALUE")
		});
		
		var customizationValueField = new sap.ui.commons.ComboBox( {
			id : this.createId('customizationValueComboBox'),
			editable : true,
				change : [ function(oControlEvent) {
					this.modifyForSingleCustomizationValue(oController, this);
				}, this ]
			});
		
		customizationValueField.setWidth("18rem");
		
		customizationValueLabel.setLabelFor(customizationValueField);
		var allowedValuesListItem = new sap.ui.core.ListItem();
		allowedValuesListItem.bindProperty("text", "allowedValueDescription");
		allowedValuesListItem.bindProperty("key", "allowedValue");
		customizationValueField.bindItems("/allowedValues", allowedValuesListItem);

		var uomField = new sap.ui.commons.ComboBox( {
			id : this.createId('uomComboBox'),
			change : [ function(oControlEvent) {
				this.modifyForSingleCustomizationValue(oController, this);
			}, this ]
		});
		
		var uomListItem = new sap.ui.core.ListItem({
			id : this.createId("uomListItem")
		});
		uomListItem.bindProperty("text", "uom");
		uomListItem.bindProperty("key", "uom");
		uomField.bindItems("/UOMs", uomListItem);
		
		var fieldHorizonatalLayout = new sap.ui.commons.layout.HorizontalLayout({
			content: [customizationValueField, uomField]
		});
		
		matrixLayout.addRow(new sap.ui.commons.layout.MatrixLayoutRow({
			height: '50px',
			cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				padding : sap.ui.commons.layout.Padding.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [customizationValueLabel]
			}), new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				padding : sap.ui.commons.layout.Padding.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [fieldHorizonatalLayout]
			})]
		}));
		
		return matrixLayout;
	},
	
	createMultiValuedCustomizationValueScreen : function(oController) {
		var customizationValueTable = new sap.ui.table.Table( {
			id : this.createId("customizationValueTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddCustomizationValueDetailsDialog(oController, this, oController.createMode);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_EDIT"),
					enabled : true,
					press : [ function(oControlEvent) {
								var dialog = this.createAddCustomizationValueDetailsDialog(oController, this, oController.modifyMode);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteCustomizationValueDetails(oController, this);
							}, this]
						
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteAllCustomizationValueDetails(oController, this);	
							}, this]
					
				})]
			})
		});

		var customizationValueField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_VALUE"),
			editable : false
		}).bindProperty("value", "customizationValueDescription");

		var uomField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_UOM"),
			editable : false
		}).bindProperty("value", "uom");

		customizationValueTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_VALUE")
			}),
			template : customizationValueField,
			width : "200px"
		}));

		customizationValueTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_UOM")
			}),
			template : uomField,
			width : "200px"
		}));
		customizationValueTable.bindRows("/customizationValueDetails");

		return customizationValueTable;
	},
	
	createAddCustomizationValueDialog : function (oController, jsView) {
		
		var selectedMaterial;
		var selectedMaterialDescription;
		var selectedCustomizationName;
		var selectedCustomizationNameDescription;
		
		oController.getAllCustomizationNames();
		
		var dialog = new sap.ui.commons.Dialog({
			title : oOEEBundle.getText("OEE_HEADING_ADD_CUSTOMIZATION_VALUE"),
			width: '350px',
			modal : true
		});
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		
		var materialLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_MATERIAL")
		});
		  
		jsView.destroyIfAlreadyExists("addMaterialComboBox");
		var materialField = new sap.ui.commons.ComboBox({
			id : jsView.createId("addMaterialComboBox")
		});
		materialLabel.setLabelFor(materialField);
		
		var materialsListItem = new sap.ui.core.ListItem();
		materialsListItem.bindProperty("text", "materialText");
		materialsListItem.bindProperty("key", "matnr");
		
		var customizationNameLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_NAME")
		});
		  
		jsView.destroyIfAlreadyExists("addCustomizationNameComboBox");
		var customizationNameField = new sap.ui.commons.ComboBox({
			id : jsView.createId("addCustomizationNameComboBox")
		});
		customizationNameField.setRequired(true);
		customizationNameLabel.setLabelFor(customizationNameField);
		
		jsView.destroyIfAlreadyExists("customizationNameList");
		var customizationNameListItem = new sap.ui.core.ListItem({
			id : this.createId("customizationNameList")
		});
		customizationNameListItem.bindProperty("text", "customizationNameDescription");
		customizationNameListItem.bindProperty("key", "customizationName");
		
		customizationNameField.setModel(oController.allCustomizationNamesModel);
		customizationNameField.bindItems("/customizationNames", customizationNameListItem);
		
		var addMaterialButton = new sap.ui.commons.Button({
			text : oOEEBundle.getText("OEE_BTN_ADD") + " " + oOEEBundle.getText("OEE_LABEL_MATERIAL"),
			press : function(oEvent) {
				oController.getAllMaterialsForClient();
				materialField.setModel(oController.allMaterialsForClientModel);
				materialField.bindItems("/materials", materialsListItem);
				dialogMatrixLayout.createRow(materialLabel, materialField);
			}
		});
		
		dialogMatrixLayout.createRow(customizationNameLabel, customizationNameField);
		dialogMatrixLayout.createRow(addMaterialButton);
		
		var addButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_ADD"),
			press : function(oEvent) {
			
				var materialComboBox = jsView.byId("addMaterialComboBox");
				if (materialComboBox != undefined) {
					selectedMaterial = materialComboBox.getSelectedKey();
					selectedMaterialDescription = materialComboBox.getValue();
				}
				
				var customizationNameComboBox = jsView.byId("addCustomizationNameComboBox");
				if (customizationNameComboBox != undefined) {
					selectedCustomizationName = customizationNameComboBox.getSelectedKey();
					selectedCustomizationNameDescription = customizationNameComboBox.getValue();
				}
				
				if (selectedCustomizationName != undefined) {
					if (selectedCustomizationName != "") {
						oController.addNewCustomizationValueRow(								
								selectedCustomizationName,
								selectedCustomizationNameDescription,
								selectedMaterial,
								selectedMaterialDescription);
					}
				}
				
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	deleteCustomizationValue : function(oController, jsView) {
		
		var customizationNameTable = this.byId("customizationNameTable");
		if (customizationNameTable != undefined) {
			
			var selectedIndex = customizationNameTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.deleteCustomizationValueRow(selectedIndex);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
			}
		}	
	},
	
	deleteAllCustomizationValues : function(oController, jsView) {
		
		var customizationNameTable = this.byId("customizationNameTable");
		if (customizationNameTable != undefined) {
			oController.deleteAllCustomizationValueRows();
		}	
	},
	
	modifyForSingleCustomizationValue : function(oController, jsView) {
		var customizationValue = "";
		var uomValue = "";
		var customizationValueComboBox = jsView.byId("customizationValueComboBox");
		if (customizationValueComboBox != undefined) {
			if (oController.allowedValuesForSelectedCustomizationNameModel.getData().allowedValues != undefined) {
				customizationValue = customizationValueComboBox.getSelectedKey();
			} else {
				customizationValue = customizationValueComboBox.getValue();
			}
		}
		
		if (oController.isDimensionAvailableForSelectedCustomizationValue == true) {
			var uomComboBox = jsView.byId("uomComboBox");
			if (uomComboBox != undefined) {
				uomValue = uomComboBox.getSelectedKey();
			}
			if (customizationValue != "" && uomValue != "") {
				jsView.modifyCustomizationValue(oController, jsView, oController.modifyMode, 0, customizationValue, uomValue);
			}
		} else {
			if (customizationValue != "") {
				jsView.modifyCustomizationValue(oController, jsView, oController.modifyMode, 0, customizationValue, undefined);
			}
		}
	},
	
	modifyCustomizationValue : function (oController, jsView, editMode, valueDetailIndex, value, uom) {
		var customizationNameTable = this.byId("customizationNameTable");
		if (customizationNameTable != undefined) {			
			var selectedIndex = customizationNameTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.triggerModifyForCustomizationValueDetailsChange(selectedIndex, editMode, valueDetailIndex, value, uom);
			}			
		}
	},
	
	getUOMsForCustomizationName : function(oController) {
		var customizationNameTable = this.byId("customizationNameTable");
		if (customizationNameTable != undefined) {			
			var selectedIndex = customizationNameTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.getUOMsForCustomizationName(selectedIndex);
			}			
		}
	},
	
	getAllowedValuesForCustomizationName : function(oController) {
		var customizationNameTable = this.byId("customizationNameTable");
		if (customizationNameTable != undefined) {			
			var selectedIndex = customizationNameTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.getAllowedValuesForCustomizationName(selectedIndex);
			}			
		}
	},
	
	createAddCustomizationValueDetailsDialog : function(oController, jsView, editMode) {
		
		var customizationValueTable = jsView.byId("customizationValueTable");
		if (customizationValueTable != undefined) {	
			var selectedIndex = customizationValueTable.getSelectedIndex();
		}
		
		if (editMode == oController.modifyMode) {
			if (!(selectedIndex >= 0)) {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_EDIT"), sap.ui.core.MessageType.Warning);
				return;
			}
		}
		
		var dialog = new sap.ui.commons.Dialog({
			width: '350px',
			modal : true
		});
		
		if (editMode == oController.createMode) {
			dialog.setTitle(oOEEBundle.getText("OEE_HEADING_ADD_CUSTOMIZATION_VALUE_DETAILS"));
		} else if (editMode == oController.modifyMode) {			
			dialog.setTitle(oOEEBundle.getText("OEE_HEADING_EDIT_CUSTOMIZATION_VALUE_DETAILS"));
		}
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		
		var customizationValueDetailsLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_CUSTOMIZATION_VALUE")
		});
		  
		this.getAllowedValuesForCustomizationName(oController);
		
		jsView.destroyIfAlreadyExists("addCustomizationValueComboBox");		
		var customizationValueDetailsField = new sap.ui.commons.ComboBox( {
				id : this.createId('addCustomizationValueComboBox'),
			editable : true
			});
		var allowedValuesListItem = new sap.ui.core.ListItem();
		allowedValuesListItem.bindProperty("text", "allowedValueDescription");
		allowedValuesListItem.bindProperty("key", "allowedValue");
		customizationValueDetailsField.setModel(oController.allowedValuesForSelectedCustomizationNameModel);
		customizationValueDetailsField.bindItems("/allowedValues", allowedValuesListItem);		
		
		dialogMatrixLayout.createRow(customizationValueDetailsLabel, customizationValueDetailsField);
		
		if (oController.isDimensionAvailableForSelectedCustomizationValue == true) {
			this.getUOMsForCustomizationName(oController);
			
			var uomLabel = new sap.ui.commons.Label({
				  text: oOEEBundle.getText("OEE_LABEL_UOM")
			});
			
			jsView.destroyIfAlreadyExists("addUomComboBox");
			var uomField = new sap.ui.commons.ComboBox( {
				id : this.createId('addUomComboBox')
			});
			
			var uomListItem = new sap.ui.core.ListItem();
			uomListItem.bindProperty("text", "uom");
			uomListItem.bindProperty("key", "uom");
			uomField.setModel(oController.allUOMForDimensionModel);
			uomField.bindItems("/UOMs", uomListItem);
			
			dialogMatrixLayout.createRow(uomLabel, uomField);
		}
		
		var addButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_ADD"),
			press : function(oEvent) {
			
				var customizationValueDetailsField = jsView.byId("addCustomizationValueComboBox");
				if (customizationValueDetailsField != undefined) {
					var customizationValueDetail;
					
					if (oController.allowedValuesForSelectedCustomizationNameModel.getData().allowedValues != undefined) {
						customizationValueDetail = customizationValueDetailsField.getSelectedKey();
					} else {
						customizationValueDetail = customizationValueDetailsField.getValue();
					}
					
					if (oController.isDimensionAvailableForSelectedCustomizationValue == true) {
						var uomField = jsView.byId("addUomComboBox");
						if (uomField != undefined) {
							var uomValue = uomField.getSelectedKey();
							if (uomValue != "") {
								if (editMode == oController.createMode) {						
									jsView.modifyCustomizationValue(oController, jsView, editMode, undefined, customizationValueDetail, uomValue);
								} else if (editMode == oController.modifyMode) {
									jsView.modifyCustomizationValue(oController, jsView, editMode, selectedIndex, customizationValueDetail, uomValue);																						
								}
							}
						}
					
					} else {
						if (customizationValueDetail != "") {
					if (editMode == oController.createMode) {						
								jsView.modifyCustomizationValue(oController, jsView, editMode, undefined, customizationValueDetail, undefined);
					} else if (editMode == oController.modifyMode) {
								jsView.modifyCustomizationValue(oController, jsView, editMode, selectedIndex, customizationValueDetail, undefined);																						
							}
						}
					}
				}
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	deleteCustomizationValueDetails : function(oController, jsView) {
		var customizationValueTable = jsView.byId("customizationValueTable");
		if (customizationValueTable != undefined) {							
			var selectedIndex = customizationValueTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				jsView.modifyCustomizationValue(oController, jsView, oController.deleteMode, selectedIndex, undefined, undefined);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
			}
		}
	},
	
	deleteAllCustomizationValueDetails : function(oController, jsView) {
		var customizationValueTable = jsView.byId("customizationValueTable");
		if (customizationValueTable != undefined) {							
			var selectedIndex = customizationValueTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				jsView.modifyCustomizationValue(oController, jsView, oController.deleteAllMode, undefined, undefined, undefined);
			}
		}
	},
	
	saveCustomizationValues : function(oController, jsView) {		
		var saveResultMessage = oController.saveCustomizationConfigurationData();
    	if (saveResultMessage != undefined) {
    		createMessage(saveResultMessage, sap.ui.core.MessageType.Success);	
    	}
	},
	
	createReasonCodeConfigurationScreen : function(oController) {
		var reasonCodeMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : '100%'
		});
		
		var reasonCodeConfigurationTable = new sap.ui.table.Table( {
			id : this.createId("rcConfigTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddReasonCodeConfigurationDialog(oController, this);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteReasonCodeConfiguration(oController, this);
							}, this]
						
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteAllReasonCodeConfiguration(oController, this);	
							}, this]
					
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_SAVE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.saveReasonCodeConfiguration(oController, this);	
							}, this]
					
				}) ]
			})
		});

		var dcElementField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_DATA_COLLECTION_ELEMENT"),
			editable : false
		}).bindProperty("value", "dcElementDescription");
		
		var reasonCodeField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_REASONCODE"),
			editable : false
		}).bindProperty("value", "reasonCodeDescription");
		
		reasonCodeConfigurationTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_DATA_COLLECTION_ELEMENT")
			}),
			template : dcElementField,
//			sortProperty : "dcElementDescription",
//			filterProperty : "dcElementDescription",
			width : "200px"
		}));
		
		reasonCodeConfigurationTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_REASONCODE")
			}),
			template : reasonCodeField,
//			sortProperty : "reasonCodeDescription",
//			filterProperty : "reasonCodeDescription",
			width : "200px"
		}));

		reasonCodeConfigurationTable.bindRows("/rcConfigData");

		reasonCodeMatrixLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [reasonCodeConfigurationTable]
				})]
		}));
		
		return reasonCodeMatrixLayout;
	},
	
	createAddReasonCodeConfigurationDialog : function (oController, jsView) {
		
		oController.getAllDCElementForClient();
		
		var dialog = new sap.ui.commons.Dialog({
			title : oOEEBundle.getText("OEE_HEADING_ADD_REASON_CODE_ASSIGNMENT"),
			width: '350px',
			modal : true
		});
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		
		var dceLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_DATA_COLLECTION_ELEMENT")
		});
		  
		jsView.destroyIfAlreadyExists("addDataCollectionElementComboBox");
		var dceField = new sap.ui.commons.ComboBox({
			id : jsView.createId("addDataCollectionElementComboBox"),
			change : [ function(oEvent) {						
						destroyAllMessages();
						var reasonCodeLink = this.byId("addReasonCodeLink");
						if (reasonCodeLink != undefined) {
							reasonCodeLink.setText(oOEEBundle.getText("OEE_LABEL_ASSIGN"));
							oController.currentSelectedReasonCodeData = {};
							oController.currentSelectedReasonCodeAssignment = {};
						}
					}, this]
		});
		
		var dceListItem = new sap.ui.core.ListItem();
		dceListItem.bindProperty("text", "description");
		dceListItem.bindProperty("key", "dcElement");
		
		dceField.setModel(oController.allDCElementModel);
		dceField.bindItems("/dcElements", dceListItem);
		dialogMatrixLayout.createRow(dceLabel, dceField);
		
		var rcLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_REASONCODE")
		});
	
		jsView.destroyIfAlreadyExists("addReasonCodeLink");
		var reasonCodeLink = new sap.ui.commons.Link({
			id : jsView.createId("addReasonCodeLink"),
			text : oOEEBundle.getText("OEE_LABEL_ASSIGN"),
			press: [ function(oEvent) {
					oController.currentSelectedReasonCodeDCElement = "";
					oController.currentSelectedReasonCodeDCElementDescription = "";
					oController.currentSelectedReasonCodeAssignment = {};
					var dcElementComboBox = this.byId('addDataCollectionElementComboBox');
					if (dcElementComboBox != undefined) {
						var selectedDCElement = dcElementComboBox.getSelectedKey();
						var selectedDCElementDescription = dcElementComboBox.getValue();
						if (selectedDCElement != undefined || selectedDCElement != '') {
							oController.currentSelectedReasonCodeDCElement = selectedDCElement;
						}
						if (selectedDCElementDescription != undefined || selectedDCElementDescription != '') {
							oController.currentSelectedReasonCodeDCElementDescription = selectedDCElementDescription;
					}
					oController.createReasonCodeToolPopup(oEvent);
			}
			}, this]
		});
		
		dialogMatrixLayout.createRow(rcLabel, reasonCodeLink);
		
		var addButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_ADD"),
			press : function(oEvent) {
			
				var selectedDCElementDescription;
				var dceComboBox = jsView.byId("addDataCollectionElementComboBox");
				if (dceComboBox != undefined) {
					selectedDCElementDescription = dceComboBox.getValue();
				}
				
				oController.addNewRCConfigRow(								
						oController.currentSelectedReasonCodeAssignment.dcElement,
						selectedDCElementDescription,
						oController.currentSelectedReasonCodeAssignment.reasonCodeData);
				
				oController.currentSelectedReasonCodeAssignment = {};
				oController.currentSelectedReasonCodeDCElement = '';
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	deleteReasonCodeConfiguration : function(oController, jsView) {
		var rcConfigTable = this.byId("rcConfigTable");
		if (rcConfigTable != undefined) {
			
			var selectedIndex = rcConfigTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.deleteReasonCodeConfigurationRow(selectedIndex);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
			}
		}	
	},
	
	deleteAllReasonCodeConfiguration : function(oController, jsView) {
		
		var rcConfigTable = this.byId("rcConfigTable");
		if (rcConfigTable != undefined) {
			oController.deleteAllReasonCodeConfigurationRows();
		}	
	},
	
	saveReasonCodeConfiguration : function(oController, jsView) {		
		var saveResultMessage = oController.saveReasonCodeConfigurationData();
    	if (saveResultMessage != undefined) {
    		createMessage(saveResultMessage, sap.ui.core.MessageType.Success);	
    	}
	},
	
	createExtensionConfigurationScreen : function(oController) {
		var extensionMasterMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : '100%'
		});
		
		extensionMasterMatrixLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [this.createExtensionMethodTable(oController)]
				})]
		}));

		extensionMasterMatrixLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [this.createExtensionDetailsTable(oController)]
				})]
		}));
		
		return extensionMasterMatrixLayout;
	},
	
	 createExtensionMethodTable : function(oController) {
		var extensionMethodTable = new sap.ui.table.Table( {
			id : this.createId("extensionMethodTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddExtensionMethodDialog(oController, this);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteExtensionMethod(oController, this);
							}, this]
						
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteAllExtensionMethods(oController, this);
							}, this]
					
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_SAVE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.saveExtensionConfiguration(oController, this);
							}, this]
					
				}) ]
			}),
			
			rowSelectionChange : function(oControlEvent) {
				var rowContext = oControlEvent.getParameter("rowContext");
				var rowIndex = oControlEvent.getParameter("rowIndex");
				if (rowIndex >= 0) {
					oController.currentSelectedExtensionMethodID = rowContext.getProperty("methodID");
					oController.currentSelectedExtensionMethodRowIndex = rowIndex;
					if (oController.currentSelectedExtensionMethodID != undefined) {
						oController.isExtensionMethodSelected = true;
						oController.enableExtensionDetailsScreen();
					}
					oController.bindCurrentExtensionDetailsDataToUIElement(rowIndex);
	}
			}
		});

		var methodField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_BUNDLE_METHOD_DESCRIPTION"),
			editable : false
		}).bindProperty("value", "displayName");
	
		extensionMethodTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : "Method"
			}),
			template : methodField,
//			sortProperty : "displayName",
//			filterProperty : "displayName",
			width : '100%'
		}));
		
		extensionMethodTable.bindRows("/methods");
		
		return extensionMethodTable;
	},
	
	 createExtensionDetailsTable : function(oController) {
		var extensionDetailsTable = new sap.ui.table.Table( {
			id : this.createId("extensionDetailsTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddExtensionDetailsDialog(oController, this, oController.createMode);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_EDIT"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddExtensionDetailsDialog(oController, this, oController.modifyMode);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteExtensionDetailsRow(oController, this);
							}, this]
						
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteAllExtensionDetailsRows(oController, this);
							}, this]
					
				}) ]
			}),
			
			rowSelectionChange : function(oControlEvent) {
				var rowIndex = oControlEvent.getParameter("rowIndex");
				if (rowIndex >= 0) {
					oController.currentSelectedExtensionDetailRowIndex = rowIndex;					
				}
			}
		});

		var extensionDescriptionField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_EXTENSION"),
			editable : false
		}).bindProperty("value", "extensionDescription");
		
		var extensionTypeField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_EXTENSION_TYPE"),
			editable : false
		}).bindProperty("value", "extensionType");
		
		var sequenceField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_EXTENSION_SEQUENCE"),
			editable : false
		}).bindProperty("value", "sequence");
		
		var activityDescriptionField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_ACTIVITY"),
			editable : false
		}).bindProperty("value", "activityDescription");
		
		var enabledField = new sap.ui.commons.CheckBox( {
			editable : false
		}).bindProperty("checked", "enabled");
		
		var asynchronousField = new sap.ui.commons.CheckBox( {
			editable : false
		}).bindProperty("checked", "async");
		
		extensionDetailsTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_EXTENSION")
			}),
			template : extensionDescriptionField,
//			sortProperty : "extensionDescription",
//			filterProperty : "extensionDescription",
			width : '25%'
		}));

		extensionDetailsTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_EXTENSION_TYPE")
			}),
			template : extensionTypeField,
//			sortProperty : "extensionType",
//			filterProperty : "extensionType",
			width : '15%'
		}));

		extensionDetailsTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_EXTENSION_SEQUENCE")
			}),
			template : sequenceField,
//			sortProperty : "sequence",
//			filterProperty : "sequence",
			width : '10%'
		}));
		
		extensionDetailsTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_ACTIVITY")
			}),
			template : activityDescriptionField,
//			sortProperty : "activityDescription",
//			filterProperty : "activityDescription",
			width : '30%'
		}));
		
		extensionDetailsTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_ENABLED")
			}),
			template : enabledField,
//			sortProperty : "enabled",
//			filterProperty : "enabled",
			width : '10%'
		}));
		
		extensionDetailsTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_ASYNCHRONOUS")
			}),
			template : asynchronousField,
//			sortProperty : "async",
//			filterProperty : "async",
			width : '10%'
		}));
		
		extensionDetailsTable.bindRows("/extensions");
		
		return extensionDetailsTable;
	},
	
	setIndexForExtensionMethodTable : function(index) {		
		var extensionMethodTable = this.byId("extensionMethodTable");
		if (extensionMethodTable != undefined) {
			extensionMethodTable.setSelectedIndex(index);
			extensionMethodTable.rerender();
		}
	},
	
	createAddExtensionMethodDialog : function (oController, jsView) {
		
		var selectedMethodID;
		var selectedMethodDisplayName;
		
		oController.getAllServiceMethodsForExtension();
		
		var dialog = new sap.ui.commons.Dialog({
			title : oOEEBundle.getText("OEE_HEADING_ADD_SERVICE_METHOD"),
			width: '350px',
			modal : true
		});
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		
		var methodLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_METHOD_DESCRIPTION")
		});
		  
		jsView.destroyIfAlreadyExists("addMethodComboBox");
		var methodField = new sap.ui.commons.ComboBox({
			id : jsView.createId("addMethodComboBox")
		});
		
		var methodsListItem = new sap.ui.core.ListItem();
		methodsListItem.bindProperty("text", "displayName");
		methodsListItem.bindProperty("key", "methodID");
		
		methodField.setModel(oController.allServiceMethodsModel);
		methodField.bindItems("/methods", methodsListItem);
		  
		dialogMatrixLayout.createRow(methodLabel, methodField);
		
		var addButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_ADD"),
			press : function(oEvent) {
			
				var methodComboBox = jsView.byId("addMethodComboBox");
				if (methodComboBox != undefined) {
					selectedMethodID = methodComboBox.getSelectedKey();
					selectedMethodDisplayName = methodComboBox.getValue();
				}
				
				if (selectedMethodID != undefined) {
					if (selectedMethodID != "") {
						oController.addNewExtensionMethodRow(								
								selectedMethodID,
								selectedMethodDisplayName);
					}
				}
				
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	deleteExtensionMethod : function(oController, jsView) {
		
		var extensionMethodTable = this.byId("extensionMethodTable");
		if (extensionMethodTable != undefined) {
			
			var selectedIndex = extensionMethodTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.deleteExtensionMethodRow(selectedIndex);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
			}
		}	
	},
	
	deleteAllExtensionMethods : function(oController, jsView) {
		
		var extensionMethodTable = this.byId("extensionMethodTable");
		if (extensionMethodTable != undefined) {
			oController.deleteAllExtensionMethodRows();
		}	
	},
	
	createAddExtensionDetailsDialog : function(oController, jsView, editMode) {
		
		var extensionMethodTable = this.byId("extensionMethodTable");
		if (extensionMethodTable != undefined) {
			var selectedMethodIndex = extensionMethodTable.getSelectedIndex();
			if (!(selectedMethodIndex >= 0)) {
//				alert("Select a method before performing the operation");
				return;
			}
		}
		
		var currentExtensionData;
		var selectedIndex;
		if (editMode == oController.modifyMode) {
			var extensionDetailsTable = this.byId("extensionDetailsTable");
			if (extensionDetailsTable != undefined) {
				selectedIndex = extensionDetailsTable.getSelectedIndex();
				if (selectedIndex != -1) {
					currentExtensionData = oController.getExtensionDetailsForSelectedIndex(selectedIndex);
				} else {
					createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_EDIT"), sap.ui.core.MessageType.Warning);
					return;
				}
			}
		} else if (editMode == oController.createMode) {
			oController.createNewExtensionDetail = true;
		}
		
		oController.getActivitiesForPlant();
		oController.getAllTypesForExtensions();
		
		var dialog = new sap.ui.commons.Dialog({
			width: '350px',
			modal : true
		});
		if (editMode == oController.createMode) {
			dialog.setTitle(oOEEBundle.getText("OEE_HEADING_ADD_EXTENSION_DETAILS"));
		} else if (editMode == oController.modifyMode) {
			dialog.setTitle(oOEEBundle.getText("OEE_HEADING_EDIT_EXTENSION_DETAILS"));
		}
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 1
		});
		
		var detailsMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		
		var typeLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_EXTENSION_TYPE")
		});
		  
		jsView.destroyIfAlreadyExists("addTypeComboBox");
		var typeField = new sap.ui.commons.ComboBox({
			id : jsView.createId("addTypeComboBox")
		});
		typeField.setRequired(true);
		typeLabel.setLabelFor(typeField);
		
		if (editMode == oController.createMode) {
			typeField.setEditable(true);
		} else if (editMode == oController.modifyMode) {
			typeField.setEditable(false);
		}
		
		var typesListItem = new sap.ui.core.ListItem();
		typesListItem.bindProperty("text", "type");
		typesListItem.bindProperty("key", "type");
		
		typeField.setModel(oController.allExtensionTypesModel);
		typeField.bindItems("/extensionTypes", typesListItem);
		
		var activityLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_ACTIVITY")
		});
		  
		jsView.destroyIfAlreadyExists("addActivityComboBox");
		var activityField = new sap.ui.commons.ComboBox({
			id : jsView.createId("addActivityComboBox")
		});
		activityField.setRequired(true);
		activityLabel.setLabelFor(activityField);
		
		if (editMode == oController.createMode) {
			activityField.setEditable(true);
		} else if (editMode == oController.modifyMode) {
			activityField.setEditable(false);
		}
		
		var activitiesListItem = new sap.ui.core.ListItem();
		activitiesListItem.bindProperty("text", "activityDescription");
		activitiesListItem.bindProperty("key", "activityId");
		
		activityField.setModel(oController.allActivitiesModel);
		activityField.bindItems("/activities", activitiesListItem);
		
		var sequenceLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_EXTENSION_SEQUENCE")
		});
		  
		jsView.destroyIfAlreadyExists("sequenceField");
		var sequenceField = new sap.ui.commons.TextField({
			id : jsView.createId("sequenceField")
		});
		sequenceField.setRequired(true);
		sequenceLabel.setLabelFor(sequenceField);
		
		var enabledLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_ENABLED")
		});
		  
		jsView.destroyIfAlreadyExists("enabledField");
		var enabledField = new sap.ui.commons.CheckBox({
			id : jsView.createId("enabledField")
		});
		
		var asyncLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_ASYNCHRONOUS")
		});
		  
		jsView.destroyIfAlreadyExists("asyncField");
		var asyncField = new sap.ui.commons.CheckBox({
			id : jsView.createId("asyncField")
		});
		  
		detailsMatrixLayout.createRow(typeLabel, typeField);
		detailsMatrixLayout.createRow(activityLabel, activityField);
		detailsMatrixLayout.createRow(sequenceLabel, sequenceField);
		detailsMatrixLayout.createRow(enabledLabel, enabledField);
		detailsMatrixLayout.createRow(asyncLabel, asyncField);
		
		var extensionTextTable = this.createExtensionTextTable(oController,jsView);
		dialogMatrixLayout.createRow(detailsMatrixLayout);
		dialogMatrixLayout.createRow(extensionTextTable);
		
		if (editMode == oController.modifyMode) {
			if (currentExtensionData != undefined) {
				typeField.setSelectedKey(currentExtensionData.extensionType);
				activityField.setSelectedKey(currentExtensionData.activityId);
				sequenceField.setValue(currentExtensionData.sequence);
				enabledField.setChecked(currentExtensionData.enabled);
				asyncField.setChecked(currentExtensionData.async);
				oController.bindDataToExtensionTextTable(currentExtensionData);
				oController.currentExtensionDescriptionData = currentExtensionData.descriptions;
			}
		}
		
		var addButton = new sap.ui.commons.Button({
			press : function(oEvent) {
			
				var newExtensionDetailData = {};
				
				var typeComboBox = jsView.byId("addTypeComboBox");
				if (typeComboBox != undefined) {
					newExtensionDetailData.extensionType = typeComboBox.getSelectedKey();
				}
				
				var activityComboBox = jsView.byId("addActivityComboBox");
				if (activityComboBox != undefined) {
					newExtensionDetailData.activityId = activityComboBox.getSelectedKey();
					newExtensionDetailData.activityDescription = activityComboBox.getValue();
				}
				
				var sequenceField = jsView.byId("sequenceField");
				if (sequenceField != undefined) {
					newExtensionDetailData.sequence = sequenceField.getValue();
				}
				
				var enabledField = jsView.byId("enabledField");
				if (enabledField != undefined) {
					newExtensionDetailData.enabled = enabledField.getChecked();
				}
				
				var asyncField = jsView.byId("asyncField");
				if (asyncField != undefined) {
					newExtensionDetailData.async = asyncField.getChecked();
				}
				
				if (	newExtensionDetailData.extensionType != "" &&
						newExtensionDetailData.activityId != "" &&
						newExtensionDetailData.sequence != "") {
					
					if (editMode == oController.modifyMode) {
						if (currentExtensionData != undefined) {
							newExtensionDetailData.extensionID = currentExtensionData.extensionID;
							newExtensionDetailData.version = currentExtensionData.version;
						}
						oController.modifyExtensionDetailsRow(newExtensionDetailData, editMode);
					} else if (editMode == oController.createMode) {
						oController.modifyExtensionDetailsRow(newExtensionDetailData, editMode);
					}
				}
				dialog.destroyContent();
				dialog.close();
			}
		});
		if (editMode == oController.createMode) {
			addButton.setText(oOEEBundle.getText("OEE_BTN_ADD"));
		} else if (editMode == oController.modifyMode) {
			addButton.setText(oOEEBundle.getText("OEE_BTN_EDIT"));
		}
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	deleteExtensionDetailsRow : function(oController, jsView) {		
		var extensionDetailsTable = this.byId("extensionDetailsTable");
		if (extensionDetailsTable != undefined) {
			
			var selectedIndex = extensionDetailsTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.deleteExtensionDetailsRow(selectedIndex);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
			}
		}	
	},
	
	deleteAllExtensionDetailsRows : function(oController, jsView) {
		var extensionDetailsTable = this.byId("extensionDetailsTable");
		if (extensionDetailsTable != undefined) {			
			oController.deleteAllExtensionDetailsRows();
		}	
	},
	
	createExtensionTextTable : function(oController, jsView) {
		jsView.destroyIfAlreadyExists("extensionTextTable");
		var extensionTextTable = new sap.ui.table.Table( {
			id : this.createId("extensionTextTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single,
			toolbar : new sap.ui.commons.Toolbar( {
				items : [ new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_ADD"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddExtensionTextDialog(oController, this, oController.createMode);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_EDIT"),
					enabled : true,
					press : [ function(oControlEvent) {								
								var dialog = this.createAddExtensionTextDialog(oController, this, oController.modifyMode);
								if (dialog != undefined) {
									dialog.open();
									destroyAllMessages();
								}
							}, this]
							
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteExtensionDescriptionRow(oController, this);
							}, this]
						
				}), new sap.ui.commons.Button( {
					text : oOEEBundle.getText("OEE_BTN_DELETE_ALL"),
					enabled : true,
					press : [ function(oControlEvent) {
								this.deleteAllExtensionDescriptionRows(oController, this);	
							}, this]
					
				}) ]
			})
		});

		var languageField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_LANGUAGE"),
			editable : false
		}).bindProperty("value", "languageText");
		
		var descriptionField = new sap.ui.commons.TextField( {
			value : oOEEBundle.getText("OEE_LABEL_DESCRIPTION"),
			editable : false
		}).bindProperty("value", "description");
		
		extensionTextTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_LANGUAGE")
			}),
			template : languageField,
//			sortProperty : "languageText",
//			filterProperty : "languageText",
			width : '30%'
		}));

		extensionTextTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_DESCRIPTION")
			}),
			template : descriptionField,
//			sortProperty : "description",
//			filterProperty : "description",
			width : '70%'
		}));
		extensionTextTable.bindRows("/descriptions");		
		return extensionTextTable;
	},
	
	createAddExtensionTextDialog : function(oController, jsView, editMode) {
		
		oController.getAllowedLocales();
		
		var extensionDescriptionData;
		var selectedIndex;
		
		if (editMode == oController.modifyMode) {
			var extensionTextTable = jsView.byId("extensionTextTable");
			if (extensionTextTable != undefined) {
				selectedIndex = extensionTextTable.getSelectedIndex();
				if (selectedIndex >= 0) {
					extensionDescriptionData = oController.getExtensionDescriptionForSelectedIndex(selectedIndex);
				} else {
					createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_EDIT"), sap.ui.core.MessageType.Warning);
					return;
				}
			}
		}
		
		var dialog = new sap.ui.commons.Dialog({
			width: '350px',
			modal : true
		});
		if (editMode == oController.createMode) {
			dialog.setTitle(oOEEBundle.getText("OEE_HEADING_ADD_EXTENSION_DESCRIPTION"));
		} else if (editMode == oController.modifyMode) {
			dialog.setTitle(oOEEBundle.getText("OEE_HEADING_EDIT_EXTENSION_DESCRIPTION"));
		}
		
		var dialogMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 2
		});
		
		var languageLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_LANGUAGE")
		});
		  
		jsView.destroyIfAlreadyExists("addLanguageComboBox");
		var languageField = new sap.ui.commons.ComboBox({
			id : jsView.createId("addLanguageComboBox")
		});
		if (editMode == oController.createMode) {
			languageField.setEditable(true);
		} else if (editMode == oController.modifyMode) {
			languageField.setEditable(false);
		}
		
		var languagesListItem = new sap.ui.core.ListItem();
		languagesListItem.bindProperty("text", "text");
		languagesListItem.bindProperty("key", "key");
		
		languageField.setModel(oController.allowedLocalesModel);
		languageField.bindItems("/locales", languagesListItem);
		
		
		var descriptionLabel = new sap.ui.commons.Label({
			  text: oOEEBundle.getText("OEE_LABEL_DESCRIPTION")
		});
		  
		jsView.destroyIfAlreadyExists("descriptionField");
		var descriptionField = new sap.ui.commons.TextField({
			id : jsView.createId("descriptionField")
		});
		
		dialogMatrixLayout.createRow(languageLabel, languageField);
		dialogMatrixLayout.createRow(descriptionLabel, descriptionField);
		
		if (editMode == oController.modifyMode) {
			if (extensionDescriptionData != undefined) {
				languageField.setSelectedKey(extensionDescriptionData.language);
				descriptionField.setValue(extensionDescriptionData.description);
			}
		}
		
		var addButton = new sap.ui.commons.Button({
			press : function(oEvent) {
			
				var selectedLocaleKey;
				var selectedLocaleText;
				var description;
				
				var languageComboBox = jsView.byId("addLanguageComboBox");
				if (languageComboBox != undefined) {
					selectedLocaleKey = languageComboBox.getSelectedKey();
					selectedLocaleText = languageComboBox.getValue();
				}
				
				var descriptionField = jsView.byId("descriptionField");
				if (descriptionField != undefined) {
					description = descriptionField.getValue();
				}
				
				if (selectedLocaleKey != undefined && description != undefined) {
					if (selectedLocaleKey != "" && description != "") {
						var newExtensionDescriptionData = {};
						newExtensionDescriptionData.language = selectedLocaleKey;
						newExtensionDescriptionData.languageText = selectedLocaleText;
						newExtensionDescriptionData.description = description;
						if (editMode == oController.modifyMode) {
							if (extensionDescriptionData != undefined) {
								newExtensionDescriptionData.descriptionID = extensionDescriptionData.descriptionID;
							}
						}
						oController.modifyExtensionDescriptionRow(
								selectedIndex,
								newExtensionDescriptionData,
								editMode);
					}
				}
				
				dialog.destroyContent();
				dialog.close();
			}
		});
		if (editMode == oController.createMode) {
			addButton.setText(oOEEBundle.getText("OEE_BTN_ADD"));
		} else if (editMode == oController.modifyMode) {
			addButton.setText(oOEEBundle.getText("OEE_BTN_EDIT"));
		}
		
		var cancelButton = new sap.ui.commons.Button({
			text: oOEEBundle.getText("OEE_BTN_CANCEL"),
			press : function(oControlEvent) {
				dialog.destroyContent();
				dialog.close();
			}
		});
		
		dialog.addContent(dialogMatrixLayout);
		dialog.addButton(addButton);
		dialog.addButton(cancelButton);
		
		return dialog;
	},
	
	deleteExtensionDescriptionRow : function(oController, jsView) {
		var extensionTextTable = jsView.byId("extensionTextTable");
		if (extensionTextTable != undefined) {
			var selectedIndex = extensionTextTable.getSelectedIndex();
			if (selectedIndex >= 0) {
				oController.modifyExtensionDescriptionRow(
						selectedIndex,
						undefined,
						oController.deleteMode);
			} else {
				createMessage(oOEEBundle.getText("OEE_MESSAGE_SELECT_RECORD_TO_DELETE"), sap.ui.core.MessageType.Warning);
				return;
			}
		}
	},
	
	deleteAllExtensionDescriptionRows : function(oController, jsView) {
		oController.modifyExtensionDescriptionRow(
				undefined,
				undefined,
				oController.deleteAllMode);		
	},
	
	saveExtensionConfiguration : function (oController, jsview) {
    	var saveResultMessage = oController.saveExtensionConfigurationData();
    	if (saveResultMessage != undefined) {
    		createMessage(saveResultMessage, sap.ui.core.MessageType.Success);
    	}
    },
    
    createGeolocationConfigurationScreen : function(oController) {
    	
    	var masterMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
    		columns : 1,
    		width : '100%'
    	});
    	
    	var nodeCoordinatesEntryLayout = new sap.ui.commons.layout.MatrixLayout({
    		columns : 3,
    		width : '100%',
    		widths : ['30%', '40%', '30%']
    	});
    	
    	var latitudeLabel = new sap.ui.commons.Label({
    		text : oOEEBundle.getText("OEE_LABEL_LATITUDE")
    	});
    	
    	var longitudeLabel = new sap.ui.commons.Label({
    		text : oOEEBundle.getText("OEE_LABEL_LONGITUDE")
    	});
    	
    	var latitudeTextField = new sap.ui.commons.TextField({
    		id : this.createId('latitudeTextField'),
    		width : '200px'
    	});
    	
    	var longitudeTextField = new sap.ui.commons.TextField({
    		id : this.createId('longitudeTextField'),
    		width : '200px'
    	});
    	
    	latitudeLabel.setLabelFor(latitudeTextField);
    	longitudeLabel.setLabelFor(longitudeTextField);
    	var getCurrentLocationButton = new sap.ui.commons.Button({
    		text : oOEEBundle.getText("OEE_LABEL_GET_CURRENT_LOCATION"),
    		press : function (oEvent) {
    					oController.getCurrentLocationDetails();
    				}
    	});
    	
    	var addCurrentLocationToTableButton = new sap.ui.commons.Button({
    		text : oOEEBundle.getText("OEE_BTN_ADD"),
    		press : function(oEvent) {
    					oController.addCurrentLocationToTable();
    			}
    	});
    	
    	var saveButton = new sap.ui.commons.Button({
    		text : oOEEBundle.getText("OEE_BTN_SAVE"),
    		press : function(oEvent) {
    					oController.saveGeolocationConfigurationData();
    		}
    	});
    	
    	/*var editButton = new sap.ui.commons.Button({
    		text : 'Edit',
    		press : function(oEvent) {
    					oController.editGeolocationConfigurationData();
    		}
    	});
    	
    	var deleteButton = new sap.ui.commons.Button({
    		text : 'Delete',
    		press : function(oEvent) {
    					oController.deleteGeolocationConfigurationData();
    		}
    	});*/
    	
    	nodeCoordinatesEntryLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [latitudeLabel, latitudeTextField]
				})]
		}));
		
    	nodeCoordinatesEntryLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [longitudeLabel, longitudeTextField]
				})]
		}));
    	
    	nodeCoordinatesEntryLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [getCurrentLocationButton, addCurrentLocationToTableButton, saveButton]
				})]
		}));
    	
		var nodeCoordinatesTable = new sap.ui.table.Table( {
			id : this.createId("nodeCoordinatesTable"),
			width : "100%",
			selectionMode : sap.ui.table.SelectionMode.Single
		});

		var latitudeField = new sap.ui.commons.TextField( {
			editable : false
		}).bindProperty("value", "latitude");

		var longitudeField = new sap.ui.commons.TextField( {
			editable : false
		}).bindProperty("value", "longitude");

		nodeCoordinatesTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_LATITUDE")
			}),
			template : latitudeField,
			width : "200px"
		}));
		
		nodeCoordinatesTable.addColumn(new sap.ui.table.Column( {
			label : new sap.ui.commons.Label( {
				text : oOEEBundle.getText("OEE_LABEL_LONGITUDE")
			}),
			template : longitudeField,
			width : "200px"
		}));

		nodeCoordinatesTable.bindRows("/nodeCoordinatesData");
		
		masterMatrixLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [nodeCoordinatesEntryLayout]
				})]
		}));
		
		masterMatrixLayout.addRow(
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					padding : sap.ui.commons.layout.Padding.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [nodeCoordinatesTable]
				})]
		}));
		
		return masterMatrixLayout;
	}
});
