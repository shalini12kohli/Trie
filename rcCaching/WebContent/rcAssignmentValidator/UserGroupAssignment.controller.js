sap.ui
		.controller(
				"sap.mpm.ui.activity.application.UserGroupAssignment",
				{
					currentUserDetails : undefined,
					isSuperAdmin : false,

					clientsAndPlantsList : undefined,

					plantHierarchyModel : undefined,
					plantNodeMasterDataModel : undefined,
					userGroupPodAssignmentModel : undefined,
					configAdminUserGroupAssignmentModel : undefined,
					customizationValueModel : undefined,
					customizationValueDetailsModel : undefined,
					reasonCodeConfigurationModel : undefined,
					extensionMethodsModel : undefined,
					extensionDetailsModel : undefined,
					allowedLocalesModel : undefined,
					geolocationModel : undefined,

					allUserGroupsModel : undefined,
					allPodsModel : undefined,
					allMaterialsForClientModel : undefined,
					allCustomizationNamesModel : undefined,
					allDCElementModel : undefined,
					rcForDCElementModel : undefined,
					allServiceMethodsModel : undefined,
					allActivitiesModel : undefined,
					allExtensionTypesModel : undefined,
					allUOMForDimensionModel : undefined,
					allowedValuesForSelectedCustomizationNameModel : undefined,

					currentSelectedClient : undefined,
					currentSelectedPlant : undefined,
					currentSelectedNode : undefined,
					
					currentSelectedReasonCodeData : undefined,
					currentSelectedReasonCodeDCElement : undefined,
					currentSelectedReasonCodeAssignment : undefined,
					currentReasonCodeLevel : undefined,
					currentLevelReasonCodeData : undefined,
					nextLevelReasonCodeData : undefined,
					isNextLevelReasonCodeAvailable : false,
					
					currentSelectedExtensionMethodID : undefined,
					currentSelectedExtensionMethodRowIndex : undefined,
					currentSelectedExtensionDetailRowIndex : undefined,
					
					isSelectedNodePlant : false,
					isSelectedNodeReportsProduction : false,
					isSelectedNodeWorkUnit : false,
					isSelectedNodeMachine : false,

					isCustomizationNameSelected : false,
					isSelectedCustomizationValueMultiValued : false,
					isDimensionAvailableForSelectedCustomizationValue : false,
					isSelectedCustomizationValueInherited : false,
					
					isExtensionMethodSelected : false,

					globalUserGroupPodAssignmentData : [],
					globalConfigAdminUserGroupsData : [],
					globalCustomizationConfigurationData : [],
					globalReasonCodeConfigurationData : [],
					globalExtensionConfigurationData : [],
					globalGeolocationConfigurationData : [],

					currentConfigAdminUserGroupAssignmentData : undefined,
					currentUserGroupPodAssignmentData : undefined,
					currentCustomizationConfigurationData : undefined,
					currentCustomizationValueData : undefined,
					currentReasonCodeConfigurationData : undefined,
					createNewExtensionDetail : false,
					currentGeolocationConfigurationData : false,

					currentExtensionConfigurationData : undefined,
					currentExtensionDetailsData : undefined,
					currentExtensionDescriptionData : undefined,
					currentExtensionDetailsModel : undefined,
					currentExtensionDescriptionModel : undefined,

					userGroupPodAssignmentTabIndex : 0,
					configAdminUserGroupAssignmentTabIndex : 1,
					customizationConfigurationTabIndex : 2,
					reasonCodeConfigurationTabIndex : 3,
					extensionConfigurationTabIndex : 4,
					geolocationConfigurationTabIndex : 5,
					currentSelectedTabIndex : this.userGroupPodAssignmentTabIndex,

					createMode : "CREATE",
					modifyMode : "MODIFY",
					deleteMode : "DELETE",
					deleteAllMode : "DELETE_ALL",

					userGroupPodAssignmentDataToBeCreated : [],
					userGroupPodAssignmentDataToBeModified : [],
					userGroupPodAssignmentDataToBeDeleted : [],

					configAdminUserGroupAssignmentDataToBeCreated : [],
					configAdminUserGroupAssignmentDataToBeModified : [],
					configAdminUserGroupAssignmentDataToBeDeleted : [],

					customizationConfigDataToBeCreated : [],
					customizationConfigDataToBeModified : [],
					customizationConfigDataToBeDeleted : [],

					reasonCodeConfigDataToBeCreated : [],
					reasonCodeConfigDataToBeModified : [],
					reasonCodeConfigDataToBeDeleted : [],

					extensionConfigurationDataToBeCreated : [],
					extensionConfigurationDataToBeModified : [],
					extensionConfigurationDataToBeDeleted : [],
					
					geolocationConfigurationDataToBeCreated : [],
					geolocationConfigurationDataToBeModified : [],
					geolocationConfigurationDataToBeDeleted : [],
					
					isSaveSuccessForUserGroupPodAssignment : false,
					isSaveSuccessForConfigAdminUserGroupAssignment : false,

					userGroupPodAssignmentScreenButtonsEnabled : false,
					configAdminUserGroupAssignmentScreenButtonsEnabled : false,
					customizationConfigurationScreenButtonsEnabled : false,
					reasonCodeConfigurationScreenButtonsEnabled : false,
					extensionConfigurationScreenButtonsEnabled : false,

					userGroupPodAssignmentTabEnabled : false,
					configAdminUserGroupPodAssignmentTabEnabled : false,
					customizationConfigurationTabEnabled : false,
					reasonCodeConfigurationTabEnabled : false,
					extensionConfigurationTabEnabled : false,
					geolocationConfigurationTabEnabled : false,
					
					
					AUTO_RESTART_RUN : "AUTO_RESTART_RUN",
					SHIFT_END_TIME : "SHIFT_END_TIME",
					LINE_BEHAVIOR : "LINE_BEHAVIOR",
					//existingLineBehavior : "",
					
					YES : "YES",
					NO : "NO",
					ACTUAL : "ACTUAL",
					PLANNED : "PLANNED",
					
					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 */
					onInit : function() {
						this.getCurrentUserDetails();
						this.getClientsAndPlantsForUser();
						this.createAccordionSectionsForClientPlant();
						this.getView().createPlantHierarchyForFirstSection(this);
					},

					getCurrentUserDetails : function() {
						this.currentUserDetails = getCurrentLoggedInUserDetails();
						if (this.currentUserDetails != undefined) {
							this.isSuperAdmin = this.currentUserDetails.isSuperAdmin;

							var userNameTextView = this.byId('user-name');
							if (userNameTextView != undefined) {
								if (	this.currentUserDetails.lastName != undefined &&
										this.currentUserDetails.firstName != undefined) {
									userNameTextView.setText(this.currentUserDetails.lastName + " , " + this.currentUserDetails.firstName);
								}
							}
						}
					},

					getClientsAndPlantsForUser : function() {
						var outputList;

						if (this.isSuperAdmin == true) {
							outputList = getAllClientsAndPlants();
						} else {
							outputList = getClientsAndPlantsAssignedForLoggedInUser();
						}
						if (outputList != undefined) {
							if (outputList.details != undefined) {
								this.clientsAndPlantsList = outputList.details.results;
							}
						}
					},

					createAccordionSectionsForClientPlant : function() {
						var accordion = this.byId("phAccordion");
						if (accordion != undefined) {
							if (	this.clientsAndPlantsList != undefined ||
									this.clientsAndPlantsList.length > 0) {
								var clientsAndPlantsArray = this.clientsAndPlantsList;
								for ( var i = 0; i < clientsAndPlantsArray.length; i++) {
									var accordionSection = new sap.ui.commons.AccordionSection(
											{
												id: this.createId("section_" + i),
												title : "Client : "
														+ clientsAndPlantsArray[i].client
														+ " / "
														+ "Plant : "
														+ clientsAndPlantsArray[i].plant
											});
									accordion.addSection(accordionSection);

									var clientCustomData = new sap.ui.core.CustomData(
											{
												key : "client",
												value : clientsAndPlantsArray[i].client
											});

									var plantCustomData = new sap.ui.core.CustomData(
											{
												key : "plant",
												value : clientsAndPlantsArray[i].plant
											});

									accordionSection
											.addCustomData(clientCustomData);
									accordionSection
											.addCustomData(plantCustomData);
								}
							} else {
								createMessage(oOEEBundle.getText("OEE_MESSAGE_INSUFFICIENT_PRIVILEGES"), sap.ui.core.MessageType.Error);
							}	
						}
					},

					getPlantHierarchyDataForSelectedSection : function(client,
							plant) {
						this.currentSelectedClient = client;
						this.currentSelectedPlant = plant;
						return getPlantHierarchyData(client, plant);
					},

					createPlantHierarchyForFirstSection : function() {
						var accordion = this.byId("phAccordion");
						if (accordion != undefined) {
							var allSections = accordion.getSections();
							if (allSections.length > 0) {
								var firstSection = allSections[0];
								this
										.createPlantHierarchyForSection(firstSection);
							}
						}
					},

					createPlantHierarchyForSection : function(section) {
						section.destroyContent();

						var client = section.data("client");
						var plant = section.data("plant");
						plantHierarchyData = this
								.getPlantHierarchyDataForSelectedSection(
										client, plant);

						if (plantHierarchyData["0"] != undefined) {
							this.plantHierarchyModel = new sap.ui.model.json.JSONModel();
							this.plantHierarchyModel.setData( {
								root : {
									"0" : plantHierarchyData["0"]
								}
							});
							var phTree = this.byId("phTree");
							if (phTree != undefined) {
								phTree.setModel(this.plantHierarchyModel);
							}

							section.addContent(phTree);
						}
					},

					getSelectedHierarchyNode : function(oControlEvent) {
						var nodeContext = oControlEvent
								.getParameter("nodeContext");
						this.currentSelectedNode = this.plantHierarchyModel
								.getProperty(nodeContext + "/nodeID");
						this.isSelectedNodePlant = this.plantHierarchyModel
								.getProperty(nodeContext + "/isPlant");
						this.isSelectedNodeReportsProduction = this.plantHierarchyModel
								.getProperty(nodeContext + "/reportsProduction");
						this.isSelectedNodeWorkUnit = this.plantHierarchyModel
								.getProperty(nodeContext + "/isWorkUnit");
						this.isSelectedNodeMachine = this.plantHierarchyModel
						.getProperty(nodeContext + "/isMachine");
						
						/*
						 * Enable "User Group POD Assignment and Reason Code Configuration Tabs" only for those
						 * nodes that reports Production
						 */
						// SP01: Changing this condition
						//if (this.isSelectedNodeReportsProduction == true && this.isSelectedNodeWorkUnit == true) {
						if (this.isSelectedNodeReportsProduction == true) {
							this.userGroupPodAssignmentTabEnabled = true;
							this.enableUserGroupPodAssignmentTab();
							
							this.extensionConfigurationTabEnabled = true;
							this.enableExtensionConfigurationTab();
							this.isExtensionMethodSelected = false;
							this.enableExtensionDetailsScreen();
							
							this.currentSelectedTabIndex = this.userGroupPodAssignmentTabIndex;
						} else {
							this.userGroupPodAssignmentTabEnabled = false;
							this.enableUserGroupPodAssignmentTab();
							
							this.reasonCodeConfigurationTabEnabled = false;
							this.enableReasonCodeConfigurationTab();
							
							this.extensionConfigurationTabEnabled = false;
							this.enableExtensionConfigurationTab();
							this.isExtensionMethodSelected = false;
							this.enableExtensionDetailsScreen();
						}
						if (this.isSelectedNodeMachine == true 
								|| (this.isSelectedNodeReportsProduction == true)) {
						//if (this.isSelectedNodeMachine == true || (this.isSelectedNodeReportsProduction == true && this.isSelectedNodeWorkUnit == true)) {
							this.reasonCodeConfigurationTabEnabled = true;
							this.enableReasonCodeConfigurationTab();
						}
						/*
						 * Enable "Config Admin User Group Assignment Tab" only
						 * for Plant nodes and to be edited only by Super Admin
						 */
						if (	this.isSuperAdmin == true && 
								this.isSelectedNodePlant == true) {
							this.configAdminUserGroupPodAssignmentTabEnabled = true;
							this.enableConfigAdminUserGroupAssignmentTab();
							
							this.userGroupPodAssignmentTabEnabled = true;
							this.enableUserGroupPodAssignmentTab();
							
							this.currentSelectedTabIndex = this.configAdminUserGroupAssignmentTabIndex;
						} else {
							this.configAdminUserGroupPodAssignmentTabEnabled = false;
							this.enableConfigAdminUserGroupAssignmentTab();
						}
						/*
						 * Enable Customization Configuration Tab for all nodes
						 */
						this.customizationConfigurationTabEnabled = true;
						this.enableCustomizationConfigurationTab();
						this.enableCustomizationValuesScreen();
						
						this.geolocationConfigurationTabEnabled = false;
						this.enableGeolocationConfigurationTab();

						/*
						 * Display content for "Customization Configuration" tab as default only if 
						 * the other two nodes are disabled
						 */
						if (this.userGroupPodAssignmentTabEnabled == false
								&& this.configAdminUserGroupPodAssignmentTabEnabled == false) {
							this.currentSelectedTabIndex = this.customizationConfigurationTabIndex;
						}
						/*
						 * Set Tab Content only if one of the tabs are visible
						 */
						if (this.currentSelectedTabIndex != undefined)
							this.setTabContent(this.currentSelectedTabIndex);
						this.getView().setMainTabIndex(this.currentSelectedTabIndex);
					},

					setTabContent : function(tabIndex) {
						
						destroyAllMessages();
						/*
						 * Create Data only if a node is selected in the
						 * Hierarchy Tree
						 */
						if (this.currentSelectedNode != undefined) {
							if (tabIndex == this.hierarchyMasterDataTabIndex) {

							} else if (tabIndex == this.userGroupPodAssignmentTabIndex) {
								setHelpLink(oOEEBundle.getText("OEE_HELP_USER_GR_POD_ASSIGN"));
								this.createUserGroupPodAssignmentData();

							} else if (tabIndex == this.configAdminUserGroupAssignmentTabIndex) {
								setHelpLink(oOEEBundle.getText("OEE_HELP_USER_GR_ASSIGN"));
								this.createConfigAdminUserAssignmentData();

							} else if (tabIndex == this.customizationConfigurationTabIndex) {
								/*
								 * Always no entry will be selected in the Customization table by default.
								 * Therefore, the customization values tab will be hidden.
								 */
								setHelpLink(oOEEBundle.getText("OEE_HELP_CUST_VALUES"));
								this.isCustomizationNameSelected = false;
								this.enableCustomizationValuesScreen();

								this.createCustomizationConfigurationData();
								
							} else if (tabIndex == this.extensionConfigurationTabIndex) {
								setHelpLink(oOEEBundle.getText("OEE_HELP_CONFIG_EXTENSION"));
								this.createExtensionConfigurationData();
								
							} else if (tabIndex == this.reasonCodeConfigurationTabIndex) {
								setHelpLink(oOEEBundle.getText("OEE_HELP_RC_MAPPING"));
								this.createReasonCodeConfigurationData();
								
							} else if (tabIndex == this.geolocationConfigurationTabIndex) {
							
								this.createGeolocationConfigurationData();
							}	
						}
						this.currentSelectedTabIndex = tabIndex;
					},

					createUserGroupPodAssignmentData : function() {

						if (this.isUserGroupPodAssignmentDataAlreadyRetrieved(
								this.currentSelectedClient,
								this.currentSelectedPlant,
								this.currentSelectedNode)) {

							this.currentUserGroupPodAssignmentData = this
									.getRetrievedUserGroupPodAssignmentData(
											this.currentSelectedClient,
											this.currentSelectedPlant,
											this.currentSelectedNode);
						} else {
							var userGroupResults = getUserGroupPodAssignmentData(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode);
							if (userGroupResults.userGroupAndPods != undefined) {

								this.currentUserGroupPodAssignmentData = userGroupResults.userGroupAndPods.results;
								if (this.currentUserGroupPodAssignmentData.length > 0) {
									this
											.pushUserGroupPodAssignmentDataIntoGlobalData(
													this.currentSelectedClient,
													this.currentSelectedPlant,
													this.currentSelectedNode,
													this.currentUserGroupPodAssignmentData);
								}
							}
						}
						this.bindCurrentUserGroupPodAssignmentDataToTable();
					},

					bindCurrentUserGroupPodAssignmentDataToTable : function() {

						this.userGroupPodAssignmentModel = new sap.ui.model.json.JSONModel();
						this.userGroupPodAssignmentModel
								.setData( {
									userGroupData : this.currentUserGroupPodAssignmentData
								});

						var userGroupTable = this
								.byId("userGroupPodAssignmentTable");
						if (userGroupTable != undefined) {
							userGroupTable
									.setModel(this.userGroupPodAssignmentModel);
						}

					},

					createConfigAdminUserAssignmentData : function() {

						if (this.isConfigAdminUserGroupDataAlreadyRetrieved(
								this.currentSelectedClient,
								this.currentSelectedPlant,
								this.currentSelectedNode)) {

							this.currentConfigAdminUserGroupAssignmentData = this
									.getRetrievedConfigAdminUserGroupData(
											this.currentSelectedClient,
											this.currentSelectedPlant,
											this.currentSelectedNode);
						} else {
							var userGroupResults = getConfigAdminUserGroupAssignmentData(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode);
							if (userGroupResults.userGroupAndPods != undefined) {

								this.currentConfigAdminUserGroupAssignmentData = userGroupResults.userGroupAndPods.results;
								if (this.currentConfigAdminUserGroupAssignmentData.length > 0) {
									this
											.pushConfigAdminUserGroupAssignmentDataIntoGlobalData(
													this.currentSelectedClient,
													this.currentSelectedPlant,
													this.currentSelectedNode,
													this.currentConfigAdminUserGroupAssignmentData);
								}
							}
						}
						this.bindCurrentConfigAdminUserGroupAssignmentDataToTable();
					},

					bindCurrentConfigAdminUserGroupAssignmentDataToTable : function() {
						this.configAdminUserGroupAssignmentModel = new sap.ui.model.json.JSONModel();
						this.configAdminUserGroupAssignmentModel
								.setData( {
									configAdminUserGroupData : this.currentConfigAdminUserGroupAssignmentData
								});

						var configAdminUserGroupTable = this
								.byId("configAdminUserGroupAssignmentTable");
						if (configAdminUserGroupTable != undefined) {
							configAdminUserGroupTable
									.setModel(this.configAdminUserGroupAssignmentModel);
						}
					},

					createReasonCodeConfigurationData : function() {
						if (this.isReasonCodeConfigurationDataAlreadyRetrieved(
								this.currentSelectedClient,
								this.currentSelectedPlant,
								this.currentSelectedNode)) {

							this.currentReasonCodeConfigurationData = this
									.getRetrievedReasonCodeConfigurationData(
											this.currentSelectedClient,
											this.currentSelectedPlant,
											this.currentSelectedNode);
						} else {
							var rcConfigResults = getRCConfigData(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode);
							if (rcConfigResults.rcConfig != undefined) {

								this.currentReasonCodeConfigurationData = rcConfigResults.rcConfig.results;
								if (this.currentReasonCodeConfigurationData.length > 0) {
									this
											.pushReasonCodeConfigurationDataIntoGlobalData(
													this.currentSelectedClient,
													this.currentSelectedPlant,
													this.currentSelectedNode,
													this.currentReasonCodeConfigurationData);
									
									this.currentReasonCodeConfigurationData = this
											.getRetrievedReasonCodeConfigurationData(
													this.currentSelectedClient,
													this.currentSelectedPlant,
													this.currentSelectedNode);
								}
							}
						}
						this.bindCurrentReasonCodeConfigurationDataToTable();
					},

					bindCurrentReasonCodeConfigurationDataToTable : function() {
						this.reasonCodeConfigurationModel = new sap.ui.model.json.JSONModel();
						this.reasonCodeConfigurationModel
								.setData( {
									rcConfigData : this.currentReasonCodeConfigurationData
								});

						var rcConfigTable = this
								.byId("rcConfigTable");
						if (rcConfigTable != undefined) {
							rcConfigTable
									.setModel(this.reasonCodeConfigurationModel);
						}
					},

					createCustomizationConfigurationData : function() {

						if (this.isCustomizationConfigurationDataAlreadyRetrieved(
										this.currentSelectedClient,
										this.currentSelectedPlant,
										this.currentSelectedNode)) {

							this.currentCustomizationConfigurationData = this
									.getRetrievedCustomizationConfigurationData(
											this.currentSelectedClient,
											this.currentSelectedPlant,
											this.currentSelectedNode);
						} else {
							var customizationValueResults = getCustomizationValues(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode);

							if (customizationValueResults.customizationValueDetails != undefined) {
								if (customizationValueResults.customizationValueDetails.results != undefined) {
									if (customizationValueResults.customizationValueDetails.results.length > 0) {
										this
												.pushCustomizationConfigurationDataIntoGlobalData(
														this.currentSelectedClient,
														this.currentSelectedPlant,
														this.currentSelectedNode,
														customizationValueResults.customizationValueDetails.results);

										this.currentCustomizationConfigurationData = this
												.getRetrievedCustomizationConfigurationData(
														this.currentSelectedClient,
														this.currentSelectedPlant,
														this.currentSelectedNode);
									} else {
										this.currentCustomizationConfigurationData = [];
									}
								}
							}
						}
						// fetch line behaviour
						/*if (this.currentCustomizationConfigurationData != undefined) {
							for (var count in this.currentCustomizationConfigurationData) {
								if (this.currentCustomizationConfigurationData[count].customizationName == this.LINE_BEHAVIOR
										&& this.currentCustomizationConfigurationData[count].editMode == "") {
									this.existingLineBehavior = this.currentCustomizationConfigurationData[count].customizationValueDetails[0].customizationValue;
								}
							}
						}*/
						this.bindCurrentCustomizationConfigurationDataToTable();
					},

					bindCurrentCustomizationConfigurationDataToTable : function() {

						this.customizationValueModel = new sap.ui.model.json.JSONModel();
						this.customizationValueModel
								.setData( {
									customizationValues : this.currentCustomizationConfigurationData
								});

						var customizationTable = this
								.byId("customizationNameTable");
						if (customizationTable != undefined) {
							customizationTable
									.setModel(this.customizationValueModel);
						}
					},

					bindCurrentCustomizationValueDetailsDataToUIElement : function(selectedCustomizationValueIndex) {
						if (this.currentCustomizationConfigurationData != undefined) {
							if (selectedCustomizationValueIndex < this.currentCustomizationConfigurationData.length) {

								this.currentCustomizationValueData = this.currentCustomizationConfigurationData[selectedCustomizationValueIndex]["customizationValueDetails"];
								if (this.currentCustomizationValueData != undefined) {
									this.customizationValueDetailsModel = new sap.ui.model.json.JSONModel();

									if (this.isSelectedCustomizationValueMultiValued == true) {
										this.getAllowedValuesForCustomizationName(selectedCustomizationValueIndex);
										
										var customizationValueDetails = [];
										
										if (this.allowedValuesForSelectedCustomizationNameModel.getData() != undefined) {
											var allowedValuesData = this.allowedValuesForSelectedCustomizationNameModel.getData().allowedValues;
											if (allowedValuesData != undefined) {
												for (var i = 0; i < this.currentCustomizationValueData.length; i++) {
													var customizationValueDescription = "";
													for (var j = 0; j < allowedValuesData.length; j++) {
														if (allowedValuesData[j].allowedValue == this.currentCustomizationValueData[i].customizationValue) {
															customizationValueDescription = allowedValuesData[j].allowedValueDescription;
															break;
														}
													}
													
													customizationValueDetails.push({
														customizationValueId : this.currentCustomizationValueData[i].customizationValueId,
														customizationValueDetailId : this.currentCustomizationValueData[i].customizationValueDetailId,
														customizationValue : this.currentCustomizationValueData[i].customizationValue,
														customizationValueDescription : customizationValueDescription,
														uom : this.currentCustomizationValueData[i].uom
													});
												}
											} else {
												for (var i = 0; i < this.currentCustomizationValueData.length; i++) {
													customizationValueDetails.push({
														customizationValueId : this.currentCustomizationValueData[i].customizationValueId,
														customizationValueDetailId : this.currentCustomizationValueData[i].customizationValueDetailId,
														customizationValue : this.currentCustomizationValueData[i].customizationValue,
														customizationValueDescription : this.currentCustomizationValueData[i].customizationValue,
														uom : this.currentCustomizationValueData[i].uom
													});
												}
											}
										}
										
										this.customizationValueDetailsModel.setData({
											customizationValueDetails : customizationValueDetails
												});

										var customizationValueTable = this.byId("customizationValueTable");
										if (customizationValueTable != undefined) {
											customizationValueTable.setModel(this.customizationValueDetailsModel);
										}
									} else {

										if (this.currentCustomizationValueData.length == 0) {
											/*
											 * Add an empty entry for a single valued customization value
											 */
											if (this.isDimensionAvailableForSelectedCustomizationValue == true) {
												this.currentCustomizationValueData.push({
													customizationValue : "",
													uom : ""
												});
											} else {
												this.currentCustomizationValueData.push({
														customizationValue : ""
													});
											}
										}

										this.customizationValueDetailsModel.setData({
													customizationValueDetails : this.currentCustomizationValueData[0]
												});

										this.getAllowedValuesForCustomizationName(selectedCustomizationValueIndex);
										var customizationValueComboBox = this.byId("customizationValueComboBox");
										if (customizationValueComboBox != undefined) {
											customizationValueComboBox.setModel(this.allowedValuesForSelectedCustomizationNameModel);
											if (this.allowedValuesForSelectedCustomizationNameModel.getData() != undefined) {
												if (this.allowedValuesForSelectedCustomizationNameModel.getData().allowedValues != undefined) {
													if (	this.currentCustomizationValueData[0].customizationValue != undefined &&
															this.currentCustomizationValueData[0].customizationValue != "") {
														customizationValueComboBox.setSelectedKey(
																this.currentCustomizationValueData[0].customizationValue);
													} else {
														customizationValueComboBox.setSelectedKey("");
														customizationValueComboBox.setValue("");
													}
												} else {
													customizationValueComboBox.setValue(
															this.currentCustomizationValueData[0].customizationValue);
												}
											}
										}
										
										if (this.isDimensionAvailableForSelectedCustomizationValue == true) {
											var uomField = this.byId("uomComboBox");
											if (uomField != undefined) {
												uomField.setSelectedKey(
														this.currentCustomizationValueData[0].uom);
											}
										}
									}
								}
							}
						}
					},
					
					createExtensionConfigurationData : function() {						
						if (this.isExtensionConfigurationDataAlreadyRetrieved(
								this.currentSelectedClient,
								this.currentSelectedPlant,
								this.currentSelectedNode)) {

							this.currentExtensionConfigurationData = this
									.getRetrievedExtensionConfigurationData(
											this.currentSelectedClient,
											this.currentSelectedPlant,
											this.currentSelectedNode);
						} else {
							var extensionConfigResults = getExtensionConfigurationData(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode);
							
							this
							.pushExtensionConfigurationDataIntoGlobalData(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode,
									extensionConfigResults);
							
							this.currentExtensionConfigurationData = this
								.getRetrievedExtensionConfigurationData(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode);
						}
						this.bindCurrentExtensionConfigurationDataToTable();
					},

					bindCurrentExtensionConfigurationDataToTable : function() {
						this.extensionMethodsModel = new sap.ui.model.json.JSONModel();
						this.extensionMethodsModel
								.setData( {
									methods : this.currentExtensionConfigurationData
										});
						
						var extensionMethodTable = this
								.byId("extensionMethodTable");
						if (extensionMethodTable != undefined) {
							extensionMethodTable
									.setModel(this.extensionMethodsModel);
							}
					},
					
					bindCurrentExtensionDetailsDataToUIElement : function(selectedExtensionMethodIndex) {
						if (this.currentExtensionConfigurationData != undefined) {
							if (selectedExtensionMethodIndex < this.currentExtensionConfigurationData.length) {
								
								this.currentExtensionDetailsData = this.currentExtensionConfigurationData[selectedExtensionMethodIndex].extensions;
								if (this.currentExtensionDetailsData != undefined) {
									this.extensionDetailsModel = new sap.ui.model.json.JSONModel();
									this.extensionDetailsModel.setData({
										extensions : this.currentExtensionDetailsData
							});
									
									var extensionDetailsTable = this.byId("extensionDetailsTable");
									if (extensionDetailsTable != undefined) {
										extensionDetailsTable.setModel(this.extensionDetailsModel);
						}
								}
							}
						}
					},

					clearExtensionDetailsTable : function() {
						this.extensionDetailsModel = new sap.ui.model.json.JSONModel();
						var extensionDetailsTable = this.byId("extensionDetailsTable");
						if (extensionDetailsTable != undefined) {
							extensionDetailsTable.setModel(this.extensionDetailsModel);
						}
					},
					
					createGeolocationConfigurationData : function() {

						if (this.isGeolocationConfigurationDataAlreadyRetrieved(
								this.currentSelectedClient,
								this.currentSelectedPlant,
								this.currentSelectedNode)) {

							this.currentGeolocationConfigurationData = this
									.getRetrievedGeolocationConfigurationData(
											this.currentSelectedClient,
											this.currentSelectedPlant,
											this.currentSelectedNode);
						} else {
							var coordinatesData = getNodeCoordinates(
									this.currentSelectedClient,
									this.currentSelectedPlant,
									this.currentSelectedNode);
							if (coordinatesData.ioNodeCoordinateList != undefined) {
								this.currentGeolocationConfigurationData = coordinatesData.ioNodeCoordinateList.results;
								if (this.currentGeolocationConfigurationData.length > 0) {
									this
											.pushGeolocationConfigurationDataIntoGlobalData(
													this.currentSelectedClient,
													this.currentSelectedPlant,
													this.currentSelectedNode,
													this.currentGeolocationConfigurationData);
								}
							}
						}
						this.bindCurrentGeolocationConfigurationDataToTable();
					},

					bindCurrentGeolocationConfigurationDataToTable : function() {

						this.geolocationModel = new sap.ui.model.json.JSONModel();
						this.geolocationModel
								.setData( {
									nodeCoordinatesData : this.currentGeolocationConfigurationData
								});

						var nodeCoordinatesTable = this
								.byId("nodeCoordinatesTable");
						if (nodeCoordinatesTable != undefined) {
							nodeCoordinatesTable
									.setModel(this.geolocationModel);
						}

					},
					
					pushReasonCodeConfigurationDataIntoGlobalData : function(
							client, plant, nodeId, rcConfigData) {
						if (rcConfigData != undefined) {
							var rcConfig = [];
							for ( var i = 0; i < rcConfigData.length; i++) {
								
								var level = getInitialReasonCodeLevelForReasonCodeAssignmentScreen(rcConfigData[i]);
								var rcDesc = "";
								rcDesc = getReasonCodeDescription(rcConfigData[i], level);								
								rcConfig.push( {
											dcElement : rcConfigData[i]["dcElement"].dcElement,
											dcElementDescription : rcConfigData[i]["dcElement"].description,
											reasonCode1 : rcConfigData[i]["reasonCode1"],
											reasonCode2 : rcConfigData[i]["reasonCode2"],
											reasonCode3 : rcConfigData[i]["reasonCode3"],
											reasonCode4 : rcConfigData[i]["reasonCode4"].reasonCode4,
											reasonCode5 : rcConfigData[i]["reasonCode5"].reasonCode5,
											reasonCode6 : rcConfigData[i]["reasonCode6"].reasonCode6,
											reasonCode7 : rcConfigData[i]["reasonCode7"].reasonCode7,
											reasonCode8 : rcConfigData[i]["reasonCode8"].reasonCode8,
											reasonCode9 : rcConfigData[i]["reasonCode9"].reasonCode9,
											reasonCode10 : rcConfigData[i]["reasonCode10"].reasonCode10,
											level : level,
											reasonCodeDescription : rcDesc,
											version : rcConfigData[i]["version"],
											rcphDCElemAssocId : rcConfigData[i]["rcphDCElemAssocId"],
											editMode : ""
										});
							}
							this.globalReasonCodeConfigurationData.push( {
								client : client,
								plant : plant,
								nodeId : nodeId,
								rcConfig : rcConfig
							});
						}
					},

					pushUserGroupPodAssignmentDataIntoGlobalData : function(
							client, plant, nodeID, userGroupData) {
						if (userGroupData != undefined) {
							var userGroupAndPods = [];
							for ( var i = 0; i < userGroupData.length; i++) {
								userGroupAndPods
										.push( {
											userGroupId : userGroupData[i]["userGroupId"],
											podId : userGroupData[i]["podId"],
											podDescription : userGroupData[i]["podDescription"],
											version : userGroupData[i]["version"],
											isInherited : userGroupData[i]["isInherited"],
											editMode : ""
										});
							}
							this.globalUserGroupPodAssignmentData.push( {
								client : client,
								plant : plant,
								nodeID : nodeID,
								userGroupAndPods : userGroupAndPods
							});
						}
					},

					pushConfigAdminUserGroupAssignmentDataIntoGlobalData : function(
							client, plant, nodeID, userGroupData) {
						if (userGroupData != undefined) {
							var configAdminUserGroups = [];
							for ( var i = 0; i < userGroupData.length; i++) {
								configAdminUserGroups
										.push( {
											userGroupId : userGroupData[i]["userGroupId"],
											version : userGroupData[i]["version"],
											editMode : ""
										});
							}
							this.globalConfigAdminUserGroupsData.push( {
								client : client,
								plant : plant,
								nodeID : nodeID,
								configAdminUserGroups : configAdminUserGroups
							});
						}
					},

					pushCustomizationConfigurationDataIntoGlobalData : function(
							client, plant, nodeID, customizationData) {
						if (customizationData != undefined) {
							var customizationConfigData = [];
							for ( var i = 0; i < customizationData.length; i++) {
								var customizationValueDetails = [];
								if (customizationData[i]["customizationValueDetailList"] != undefined) {
									customizationValueDetails = customizationData[i]["customizationValueDetailList"].results;
								}

								var allowedValues = [];
								if (customizationData[i].customizationNameAllowedValueList != undefined) {
									allowedValues = customizationData[i].customizationNameAllowedValueList.results;
								}

								customizationConfigData
										.push( {
											customizationName : customizationData[i]["customizationName"],
											customizationNameDescription : customizationData[i]["customizationNameDescription"],
											customizationValueId : customizationData[i]["customizationValueId"],
											material : customizationData[i]["materialNumber"],
											materialDescription : customizationData[i]["materialDescription"],
											isCustomizationNameMultiValued : customizationData[i]["isCustomizationNameMultiValued"],
											isDimensionAvailable : customizationData[i]["isDimensionAvailable"],
											relevantDimension : customizationData[i]["relevantDimension"],
											isCustomizationValueInherited : customizationData[i]["isCustomizationValueInherited"],
											customizationValueDetails : customizationValueDetails,
											allowedValues : allowedValues,
											version : customizationData[i]["version"],
											editMode : ""
										});
							}
							this.globalCustomizationConfigurationData.push( {
										client : client,
										plant : plant,
										nodeID : nodeID,
										customizationConfigData : customizationConfigData
									});
						}
					},

					pushExtensionConfigurationDataIntoGlobalData : function(
							client, plant, nodeID, extensionData) {
						if (extensionData != undefined) {
							var extensionConfigurationData = [];
							if (extensionData.methods != undefined) {
								var extensionMethods = extensionData.methods.results;
								if (extensionMethods.length > 0) {
									for (var methodIndex = 0; methodIndex < extensionMethods.length; methodIndex++) {
										var extensionDetails = [];
										if (extensionMethods[methodIndex] != undefined) {
											if (extensionMethods[methodIndex].extensions != undefined) {
												extensionDetails = extensionMethods[methodIndex].extensions.results;
											}
										}
										
										var updatedExtensionDetails = [];
										for (var extensionIndex = 0; extensionIndex < extensionDetails.length; extensionIndex++) {
											var newExtensionData = {};
											newExtensionData.extensionID = extensionDetails[extensionIndex].extensionID;
											newExtensionData.extensionType = extensionDetails[extensionIndex].extensionType;
											newExtensionData.activityId = extensionDetails[extensionIndex].activity.activityId;
											newExtensionData.activityDescription = extensionDetails[extensionIndex].activity.activityDescription;
											newExtensionData.sequence = extensionDetails[extensionIndex].sequence;
											newExtensionData.enabled = extensionDetails[extensionIndex].enabled;
											newExtensionData.async = extensionDetails[extensionIndex].async;
											newExtensionData.version = extensionDetails[extensionIndex].version;
											newExtensionData.editMode = "";
											newExtensionData.extensionDescription = "";
											newExtensionData.descriptions = [];
											if (extensionDetails[extensionIndex].descriptions != undefined) {
												newExtensionData.descriptions = extensionDetails[extensionIndex].descriptions.results;
												this.setLanguageTextForAllowedLocales(newExtensionData);
												this.setExtensionDescriptionForUserLocale(newExtensionData);
											}
											updatedExtensionDetails.push(newExtensionData);											
										}
										
										extensionConfigurationData.push({
											methodID : extensionMethods[methodIndex].methodID,
											displayName : extensionMethods[methodIndex].displayName,
											extensions : updatedExtensionDetails,
											editMode : ""
										});
									}
								}
								this.globalExtensionConfigurationData.push( {
									client : client,
									plant : plant,
									nodeID : nodeID,
									methods : extensionConfigurationData
								});
							}
						}
					},
					
					pushGeolocationConfigurationDataIntoGlobalData : function(
							client, plant, nodeID, geolocationData) {
						if (geolocationData != undefined) {
							var nodeCoordinatesData = [];
							for ( var i = 0; i < geolocationData.length; i++) {
								nodeCoordinatesData
										.push( {
											latitude : geolocationData[i]["latitude"],
											longitude : geolocationData[i]["longitude"],
											version : geolocationData[i]["version"],
											editMode : ""
										});
							}
							this.globalGeolocationConfigurationData.push( {
								client : client,
								plant : plant,
								nodeID : nodeID,
								nodeCoordinatesData : nodeCoordinatesData
							});
						}
					},
					
					isReasonCodeConfigurationDataAlreadyRetrieved : function(
							client, plant, nodeId) {
						if (this.globalReasonCodeConfigurationData != undefined) {
							for ( var i = 0; i < this.globalReasonCodeConfigurationData.length; i++) {
								if (this.globalReasonCodeConfigurationData[i]["client"] == client
										&& this.globalReasonCodeConfigurationData[i]["plant"] == plant
										&& this.globalReasonCodeConfigurationData[i]["nodeId"] == nodeId) {
									return true;
								}
							}
						}
						return false;
					},

					isUserGroupPodAssignmentDataAlreadyRetrieved : function(
							client, plant, nodeID) {
						if (this.globalUserGroupPodAssignmentData != undefined) {
							for ( var i = 0; i < this.globalUserGroupPodAssignmentData.length; i++) {
								if (this.globalUserGroupPodAssignmentData[i]["client"] == client
										&& this.globalUserGroupPodAssignmentData[i]["plant"] == plant
										&& this.globalUserGroupPodAssignmentData[i]["nodeID"] == nodeID) {
									return true;
								}
							}
						}
						return false;
					},

					isConfigAdminUserGroupDataAlreadyRetrieved : function(
							client, plant, nodeID) {
						if (this.globalConfigAdminUserGroupsData != undefined) {
							for ( var i = 0; i < this.globalConfigAdminUserGroupsData.length; i++) {
								if (this.globalConfigAdminUserGroupsData[i]["client"] == client
										&& this.globalConfigAdminUserGroupsData[i]["plant"] == plant
										&& this.globalConfigAdminUserGroupsData[i]["nodeID"] == nodeID) {
									return true;
								}
							}
						}
						return false;
					},

					isCustomizationConfigurationDataAlreadyRetrieved : function(
							client, plant, nodeID) {
						if (this.globalCustomizationConfigurationData != undefined) {
							for ( var i = 0; i < this.globalCustomizationConfigurationData.length; i++) {
								if (this.globalCustomizationConfigurationData[i]["client"] == client
										&& this.globalCustomizationConfigurationData[i]["plant"] == plant
										&& this.globalCustomizationConfigurationData[i]["nodeID"] == nodeID) {
									return true;
								}
							}
						}
						return false;
					},

					isExtensionConfigurationDataAlreadyRetrieved : function(
							client, plant, nodeID) {
						if (this.globalExtensionConfigurationData != undefined) {
							for ( var i = 0; i < this.globalExtensionConfigurationData.length; i++) {
								if (this.globalExtensionConfigurationData[i]["client"] == client
										&& this.globalExtensionConfigurationData[i]["plant"] == plant
										&& this.globalExtensionConfigurationData[i]["nodeID"] == nodeID) {
									return true;
								}
							}
						}
						return false;
					},
					
					isGeolocationConfigurationDataAlreadyRetrieved : function(
							client, plant, nodeID) {
						if (this.globalGeolocationConfigurationData != undefined) {
							for ( var i = 0; i < this.globalGeolocationConfigurationData.length; i++) {
								if (this.globalGeolocationConfigurationData[i]["client"] == client
										&& this.globalGeolocationConfigurationData[i]["plant"] == plant
										&& this.globalGeolocationConfigurationData[i]["nodeID"] == nodeID) {
									return true;
								}
							}
						}
						return false;
					},

					getRetrievedUserGroupPodAssignmentData : function(client,
							plant, nodeID) {
						if (this.globalUserGroupPodAssignmentData != undefined) {
							for ( var i = 0; i < this.globalUserGroupPodAssignmentData.length; i++) {
								if (this.globalUserGroupPodAssignmentData[i]["client"] == client
										&& this.globalUserGroupPodAssignmentData[i]["plant"] == plant
										&& this.globalUserGroupPodAssignmentData[i]["nodeID"] == nodeID) {

									var userGroupAndPods = [];
									for ( var j = 0; j < this.globalUserGroupPodAssignmentData[i]["userGroupAndPods"].length; j++) {
										if (this.globalUserGroupPodAssignmentData[i]["userGroupAndPods"][j].editMode != this.deleteMode) {
											userGroupAndPods.push(this.globalUserGroupPodAssignmentData[i]["userGroupAndPods"][j]);
										}
									}
									return userGroupAndPods;
								}
							}
						}
					},
					
					getRetrievedGeolocationConfigurationData : function(client,
							plant, nodeID) {
						if (this.globalGeolocationConfigurationData != undefined) {
							for ( var i = 0; i < this.globalGeolocationConfigurationData.length; i++) {
								if (this.globalGeolocationConfigurationData[i]["client"] == client
										&& this.globalGeolocationConfigurationData[i]["plant"] == plant
										&& this.globalGeolocationConfigurationData[i]["nodeID"] == nodeID) {

									var nodeCoordinatesData = [];
									for ( var j = 0; j < this.globalGeolocationConfigurationData[i]["nodeCoordinatesData"].length; j++) {
										if (this.globalGeolocationConfigurationData[i]["nodeCoordinatesData"][j].editMode != this.deleteMode) {
											nodeCoordinatesData.push(this.globalGeolocationConfigurationData[i]["nodeCoordinatesData"][j]);
										}
									}
									return nodeCoordinatesData;
								}
							}
						}
					},

					getRetrievedReasonCodeConfigurationData : function(client,
							plant, nodeId) {
						if (this.globalReasonCodeConfigurationData != undefined) {
							for ( var i = 0; i < this.globalReasonCodeConfigurationData.length; i++) {
								if (this.globalReasonCodeConfigurationData[i]["client"] == client
										&& this.globalReasonCodeConfigurationData[i]["plant"] == plant
										&& this.globalReasonCodeConfigurationData[i]["nodeId"] == nodeId) {

									var rcConfig = [];
									for ( var j = 0; j < this.globalReasonCodeConfigurationData[i]["rcConfig"].length; j++) {
										if (this.globalReasonCodeConfigurationData[i]["rcConfig"][j].editMode != this.deleteMode) {
											rcConfig.push(this.globalReasonCodeConfigurationData[i]["rcConfig"][j]);
										}
									}
									return rcConfig;
								}
							}
						}
					},

					getRetrievedConfigAdminUserGroupData : function(client,
							plant, nodeID) {
						if (this.globalConfigAdminUserGroupsData != undefined) {
							for ( var i = 0; i < this.globalConfigAdminUserGroupsData.length; i++) {
								if (this.globalConfigAdminUserGroupsData[i]["client"] == client
										&& this.globalConfigAdminUserGroupsData[i]["plant"] == plant
										&& this.globalConfigAdminUserGroupsData[i]["nodeID"] == nodeID) {

									var configAdminUserGroups = [];
									for ( var j = 0; j < this.globalConfigAdminUserGroupsData[i]["configAdminUserGroups"].length; j++) {
										if (this.globalConfigAdminUserGroupsData[i]["configAdminUserGroups"][j].editMode != this.deleteMode) {
											configAdminUserGroups.push(this.globalConfigAdminUserGroupsData[i]["configAdminUserGroups"][j]);
										}
									}
									return configAdminUserGroups;
								}
							}
						}
					},

					getRetrievedCustomizationConfigurationData : function(
							client, plant, nodeID) {
						if (this.globalCustomizationConfigurationData != undefined) {
							for ( var i = 0; i < this.globalCustomizationConfigurationData.length; i++) {
								if (this.globalCustomizationConfigurationData[i]["client"] == client
										&& this.globalCustomizationConfigurationData[i]["plant"] == plant
										&& this.globalCustomizationConfigurationData[i]["nodeID"] == nodeID) {

									var customizationConfigData = [];
									for ( var j = 0; j < this.globalCustomizationConfigurationData[i]["customizationConfigData"].length; j++) {
										if (this.globalCustomizationConfigurationData[i]["customizationConfigData"][j].editMode != this.deleteMode) {
											//Deep copy is not needed for customization values as they can be modified and maintained
											customizationConfigData.push(this.globalCustomizationConfigurationData[i]["customizationConfigData"][j]);
										}
									}
									return customizationConfigData;
								}
							}
						}
					},

					getRetrievedExtensionConfigurationData : function(
							client, plant, nodeID) {
						if (this.globalExtensionConfigurationData != undefined) {
							for ( var i = 0; i < this.globalExtensionConfigurationData.length; i++) {
								if (this.globalExtensionConfigurationData[i]["client"] == client
										&& this.globalExtensionConfigurationData[i]["plant"] == plant
										&& this.globalExtensionConfigurationData[i]["nodeID"] == nodeID) {
									
									var extensionConfigData = [];
									for (var j = 0; j < this.globalExtensionConfigurationData[i]["methods"].length; j++) {
										if(this.globalExtensionConfigurationData[i]["methods"][j].editMode != this.deleteMode) {
											var method = this.globalExtensionConfigurationData[i]["methods"][j];
											//Deep copy is required here as both methods and extensions need to be maintained here for CRUD Operations
											//Both methods and extensions must be maintained with editMode separately
											//However, extension text need not be deep copied as they can be modified and maintained
											var newExtensions = [];
											for (var k = 0; k < method.extensions.length; k++) {
												var newExtensionData = {};
												var extensionData = method.extensions[k];
												if (extensionData.editMode != this.deleteMode) {												
													newExtensionData.extensionID = method.extensions[k].extensionID;
													newExtensionData.extensionType = method.extensions[k].extensionType;
													newExtensionData.activityId = method.extensions[k].activityId;
													newExtensionData.activityDescription = method.extensions[k].activityDescription;
													newExtensionData.sequence = method.extensions[k].sequence;
													newExtensionData.enabled = method.extensions[k].enabled;
													newExtensionData.async = method.extensions[k].async;
													newExtensionData.version = method.extensions[k].version;
													newExtensionData.editMode = method.extensions[k].editMode; 
													newExtensionData.extensionDescription = method.extensions[k].extensionDescription;
													newExtensionData.descriptions = method.extensions[k].descriptions;
													newExtensions.push(newExtensionData);
												}
											}
											
											var newMethod = {};
											newMethod.methodID = method.methodID;
											newMethod.displayName = method.displayName;
											newMethod.extensions = newExtensions;
											extensionConfigData.push(newMethod);
										}	
									}
									return extensionConfigData;
								}
							}
						}
					},

					enableUserGroupAssignmentScreenButtons : function() {
						var userGroupTable = this.byId("userGroupPodAssignmentTable");
						this.enableTableButtons(userGroupTable, this.userGroupPodAssignmentScreenButtonsEnabled);
					},

					enableConfigAdminUserGroupAssignmentScreenButtons : function() {
						var userGroupTable = this.byId("configAdminUserGroupAssignmentTable");
						this.enableTableButtons(userGroupTable, this.configAdminUserGroupAssignmentScreenButtonsEnabled);
					},

					enableCustomizationConfigurationScreenButtons : function() {
						var customizationNameTable = this.byId("customizationNameTable");
						this.enableTableButtons(customizationNameTable, this.customizationConfigurationScreenButtonsEnabled);
					},

					enableReasonCodeConfigurationScreenButtons : function() {
						var reasonCodeTable = this.byId("reasonCodeTable");
						this.enableTableButtons(reasonCodeTable, this.reasonCodeConfigurationScreenButtonsEnabled);
					},
					
					enableExtensionConfigurationScreenButtons : function() {
						var extensionMethodTable = this.byId("extensionMethodTable");
						this.enableTableButtons(extensionMethodTable, this.extensionConfigurationScreenButtonsEnabled);
						
						var extensionDetailsTable = this.byId("extensionDetailsTable");
						this.enableTableButtons(extensionDetailsTable, this.extensionConfigurationScreenButtonsEnabled);
						
						var extensionActivitiesTable = this.byId("extensionActivitiesTable");
						this.enableTableButtons(extensionActivitiesTable, this.extensionConfigurationScreenButtonsEnabled);
					},
					
					enableTableButtons : function(table, enabled) {
						if (table != undefined) {
							var toolbar = table.getToolbar();
							if (toolbar != undefined) {
								var toolbarItems = toolbar.getItems();
								if (toolbarItems != undefined) {
									for ( var i = 0; i < toolbarItems.length; i++) {
										var control = toolbarItems[i];
										try{
											control.setEnabled(enabled);
										}catch(e){
										
										}
									}
								}
							}
						}
					},

					disableAllTabs : function() {
						this.userGroupPodAssignmentTabEnabled = false;
						this.enableUserGroupPodAssignmentTab();

						this.configAdminUserGroupPodAssignmentTabEnabled = false;
						this.enableConfigAdminUserGroupAssignmentTab();

						this.customizationConfigurationTabEnabled = false;
						this.enableCustomizationConfigurationTab();

						this.reasonCodeConfigurationTabEnabled = false;
						this.enableReasonCodeConfigurationTab();
						
						this.extensionConfigurationTabEnabled = false;
						this.enableExtensionConfigurationTab();
						
						this.geolocationConfigurationTabEnabled = false;
						this.enableGeolocationConfigurationTab();
					},

					enableUserGroupPodAssignmentTab : function() {
						var userGroupPodAssignmentTab = this
								.byId("userGroupPodAssignmentTab");
						if (userGroupPodAssignmentTab != undefined) {
							userGroupPodAssignmentTab
									.setEnabled(this.userGroupPodAssignmentTabEnabled);
							userGroupPodAssignmentTab.setVisible(this.userGroupPodAssignmentTabEnabled);
							/*
							 * If disabling tab, disable the buttons in the
							 * toolbar also
							 */
							if (this.userGroupPodAssignmentTabEnabled == false) {
								this.userGroupPodAssignmentScreenButtonsEnabled = false;
								this.enableUserGroupAssignmentScreenButtons();
							} else {
								/*
								 * Enable the buttons, only if there is a valid
								 * selected node
								 */
								if (this.currentSelectedNode != undefined) {
									this.userGroupPodAssignmentScreenButtonsEnabled = true;
									this
											.enableUserGroupAssignmentScreenButtons();
								}
							}

							userGroupPodAssignmentTab.rerender();
						}
					},
					
					enableGeolocationConfigurationTab : function() {
						var geolocationTab = this
								.byId("geolocationTab");
						if (geolocationTab != undefined) {
							geolocationTab
									.setEnabled(this.geolocationConfigurationTabEnabled);
							geolocationTab.setVisible(this.geolocationConfigurationTabEnabled);
							
							geolocationTab.rerender();
						}
					},


					enableConfigAdminUserGroupAssignmentTab : function() {
						var configAdminUserGroupAssignmentTab = this
								.byId("configAdminUserGroupAssignmentTab");
						if (configAdminUserGroupAssignmentTab != undefined) {
							configAdminUserGroupAssignmentTab
									.setEnabled(this.configAdminUserGroupPodAssignmentTabEnabled);
							configAdminUserGroupAssignmentTab.setVisible(this.configAdminUserGroupPodAssignmentTabEnabled);
							/*
							 * If disabling tab, disable the buttons in the
							 * toolbar also
							 */
							if (this.configAdminUserGroupPodAssignmentTabEnabled == false) {
								this.configAdminUserGroupAssignmentScreenButtonsEnabled = false;
								this
										.enableConfigAdminUserGroupAssignmentScreenButtons();
							} else {
								/*
								 * Enable the buttons, only if there is a valid
								 * screen node
								 */
								if (this.currentSelectedNode != undefined) {
									this.configAdminUserGroupAssignmentScreenButtonsEnabled = true;
									this
											.enableConfigAdminUserGroupAssignmentScreenButtons();
								}
							}

							configAdminUserGroupAssignmentTab.rerender();
						}
					},

					enableCustomizationConfigurationTab : function() {
						var customizationConfigurationTab = this
								.byId("customizationTab");
						if (customizationConfigurationTab != undefined) {
							customizationConfigurationTab
									.setEnabled(this.customizationConfigurationTabEnabled);
							customizationConfigurationTab.setVisible(this.customizationConfigurationTabEnabled);
							/*
							 * If disabling tab, disable the buttons in the
							 * toolbar also
							 */
							if (this.customizationConfigurationTabEnabled == false) {
								this.customizationConfigurationScreenButtonsEnabled = false;
								this
										.enableCustomizationConfigurationScreenButtons();
							} else {
								/*
								 * Enable the buttons, only if there is a valid
								 * screen node
								 */
								if (this.currentSelectedNode != undefined) {
									this.customizationConfigurationScreenButtonsEnabled = true;
									this
											.enableCustomizationConfigurationScreenButtons();
								}
							}

							customizationConfigurationTab.rerender();
						}
					},

					enableReasonCodeConfigurationTab : function() {
						var reasonCodeConfigurationTab = this
								.byId("reasonCodeConfigurationTab");
						if (reasonCodeConfigurationTab != undefined) {
							reasonCodeConfigurationTab
									.setEnabled(this.reasonCodeConfigurationTabEnabled);
							reasonCodeConfigurationTab.setVisible(this.reasonCodeConfigurationTabEnabled);
							/*
							 * If disabling tab, disable the buttons in the
							 * toolbar also
							 */
							if (this.reasonCodeConfigurationTabEnabled == false) {
								this.reasonCodeConfigurationScreenButtonsEnabled = false;
								this
										.enableReasonCodeConfigurationScreenButtons();
							} else {
								/*
								 * Enable the buttons, only if there is a valid
								 * screen node
								 */
								if (this.currentSelectedNode != undefined) {
									this.reasonCodeConfigurationScreenButtonsEnabled = true;
									this
											.enableReasonCodeConfigurationScreenButtons();
								}
							}

							reasonCodeConfigurationTab.rerender();
						}
					},

					enableExtensionConfigurationTab : function() {
						var extensionConfigurationTab = this
								.byId("extensionConfigurationTab");
						if (extensionConfigurationTab != undefined) {
							extensionConfigurationTab
									.setEnabled(this.extensionConfigurationTabEnabled);
							extensionConfigurationTab.setVisible(this.extensionConfigurationTabEnabled);
							/*
							 * If disabling tab, disable the buttons in the
							 * toolbar also
							 */
							if (this.extensionConfigurationTabEnabled == false) {
								this.extensionConfigurationScreenButtonsEnabled = false;
								this.enableExtensionConfigurationScreenButtons();
							} else {
								/*
								 * Enable the buttons, only if there is a valid
								 * selected node
								 */
								if (this.currentSelectedNode != undefined) {
									this.extensionConfigurationScreenButtonsEnabled = true;
									this
											.enableExtensionConfigurationScreenButtons();
								}
							}
							
							extensionConfigurationTab.rerender();
						}
					},
					
					getAllUserGroups : function(filter) {
						var userGroupResults = getAllUMEUserGroups(filter);
						if (userGroupResults.groups != undefined) {
							this.allUserGroupsModel = new sap.ui.model.json.JSONModel();
							this.allUserGroupsModel.setSizeLimit(1500);
							this.allUserGroupsModel.setData( {
								userGroups : userGroupResults.groups.results
							});
						}
					},

					getAllPods : function() {
						var podResults = getAllPODs(this.currentSelectedClient,
								this.currentSelectedPlant);
						if (podResults.podDetails != undefined) {
							this.allPodsModel = new sap.ui.model.json.JSONModel();
							this.allPodsModel.setData( {
								pods : podResults.podDetails.results
							});
						}
					},

					getSelectedValueFromUserGroupPodAssignmentTable : function(selectedIndex) {
						if (this.currentUserGroupPodAssignmentData != undefined) {
							if (this.currentUserGroupPodAssignmentData.length > selectedIndex) {
								return this.currentUserGroupPodAssignmentData[selectedIndex];
							}
						}
					},

					addNewUserGroupPodAssignmentRow : function(userGroupId, podId, podDescription) {
								if(this.currentUserGroupPodAssignmentData && this.currentUserGroupPodAssignmentData.length){
									for(var i in this.currentUserGroupPodAssignmentData){
										if(this.currentUserGroupPodAssignmentData[i].userGroupId === userGroupId && this.currentUserGroupPodAssignmentData[i].isInherited){
											this.currentUserGroupPodAssignmentData.splice(i, 1);
											break;
										}
									}
								}

							
								var modifyCheck = this.triggerModifyForUserGroupPodAssignment(userGroupId, podId, podDescription, undefined, this.createMode);
	
								if (modifyCheck == true) {
									if (this.currentUserGroupPodAssignmentData != undefined) {
										this.currentUserGroupPodAssignmentData.push({userGroupId : userGroupId, podId : podId, podDescription : podDescription});
										this.bindCurrentUserGroupPodAssignmentDataToTable();
									}
								}
					},

					editUserGroupPodAssignmentRow : function(selectedIndex, podId, podDescription,isInherited) {
						
						if (this.currentUserGroupPodAssignmentData != undefined) {
							if (this.currentUserGroupPodAssignmentData.length > selectedIndex) {
								var userGroupId = this.currentUserGroupPodAssignmentData[selectedIndex]["userGroupId"];
								if(isInherited){
									var modifyCheck = this.triggerModifyForUserGroupPodAssignment(userGroupId, podId, podDescription, undefined, this.createMode);
									if (modifyCheck == true) {
										this.currentUserGroupPodAssignmentData.splice(selectedIndex, 1, {userGroupId : userGroupId, podId : podId, podDescription : podDescription, version : version});
										this.bindCurrentUserGroupPodAssignmentDataToTable();
									}
								}else{
									var version = this.currentUserGroupPodAssignmentData[selectedIndex]["version"];
	
									var modifyCheck = this.triggerModifyForUserGroupPodAssignment(userGroupId, podId, podDescription, version, this.modifyMode);
									if (modifyCheck == true) {
										this.currentUserGroupPodAssignmentData.splice(selectedIndex, 1, {userGroupId : userGroupId, podId : podId, podDescription : podDescription, version : version});
										this.bindCurrentUserGroupPodAssignmentDataToTable();
									}
								}
							}
						}
					},

					deleteUserGroupPodAssignmentRow : function(selectedIndex) {
						if (this.currentUserGroupPodAssignmentData != undefined) {
							if (this.currentUserGroupPodAssignmentData.length > selectedIndex) {
								var userGroupId = this.currentUserGroupPodAssignmentData[selectedIndex]["userGroupId"];
								var podId = this.currentUserGroupPodAssignmentData[selectedIndex]["podId"];
								var podDescription = this.currentUserGroupPodAssignmentData[selectedIndex]["podDescription"];
								var version = this.currentUserGroupPodAssignmentData[selectedIndex]["version"];
								this.currentUserGroupPodAssignmentData.splice(selectedIndex, 1);
								this.bindCurrentUserGroupPodAssignmentDataToTable();
								this.triggerModifyForUserGroupPodAssignment(userGroupId, podId, podDescription, version, this.deleteMode);
							}
						}
					},

					deleteAllUserGroupPodAssignmentRows : function() {
						if (this.currentUserGroupPodAssignmentData != undefined) {
							while (this.currentUserGroupPodAssignmentData.length > 0) {
								this.deleteUserGroupPodAssignmentRow(0);
							}
						}
					},

					prepareUserGroupPodAssignmentDataBeforeSave : function() {

						for ( var i = 0; i < this.globalUserGroupPodAssignmentData.length; i++) {
							var userGroupAndPods = this.globalUserGroupPodAssignmentData[i]["userGroupAndPods"];
							for ( var j = 0; j < userGroupAndPods.length; j++) {
								var editMode = userGroupAndPods[j]["editMode"];

								var dataToBeSaved = {};
								dataToBeSaved.client = this.globalUserGroupPodAssignmentData[i]["client"];
								dataToBeSaved.plant = this.globalUserGroupPodAssignmentData[i]["plant"];
								dataToBeSaved.nodeID = this.globalUserGroupPodAssignmentData[i]["nodeID"];
								dataToBeSaved.userGroupId = userGroupAndPods[j]["userGroupId"];
								dataToBeSaved.podId = userGroupAndPods[j]["podId"];

								if (userGroupAndPods[j]["version"] != undefined) {
									dataToBeSaved.version = userGroupAndPods[j]["version"];
								}

								switch (editMode) {
								case this.createMode:
									this.userGroupPodAssignmentDataToBeCreated.push(dataToBeSaved);
									break;
								case this.modifyMode:
									this.userGroupPodAssignmentDataToBeModified.push(dataToBeSaved);
									break;
								case this.deleteMode:
									this.userGroupPodAssignmentDataToBeDeleted.push(dataToBeSaved);
									break;
								}
							}
						}
					},

					saveUserGroupPodAssignmentData : function() {
						var outputMessage = this.saveUserGroupPodAssignmentDataInternal();

						// Refresh data for the current node
						this.createUserGroupPodAssignmentData();

						return outputMessage;
					},

					saveUserGroupPodAssignmentDataInternal : function() {
						this.prepareUserGroupPodAssignmentDataBeforeSave();
						var saveResults = saveUserGroupAssignments(
								"SAVE_USERGROUP_POD_ASSIGNMENT",
								this.userGroupPodAssignmentDataToBeCreated,
								this.userGroupPodAssignmentDataToBeModified,
								this.userGroupPodAssignmentDataToBeDeleted);

						var outputMessage;
						if (saveResults != undefined) {
							if (saveResults.result == true) {
								outputMessage = oOEEBundle.getText("OEE_MESSAGE_SAVE_SUCCESS"); 
								this.isSaveSuccessForUserGroupPodAssignment = true;
								this.globalUserGroupPodAssignmentData = [];
							} else if (saveResults.result == false) {
								outputMessage = oOEEBundle.getText("OEE_MESSAGE_SAVE_ERROR");
							} else {
								if (saveResults.outputMessage != undefined) {
									outputMessage = saveResults.outputMessage;
								}
							}
						}

						this.userGroupPodAssignmentDataToBeCreated = [];
						this.userGroupPodAssignmentDataToBeModified = [];
						this.userGroupPodAssignmentDataToBeDeleted = [];

						this.currentUserGroupPodAssignmentData = [];
						this.bindCurrentUserGroupPodAssignmentDataToTable();

						return outputMessage;
					},

					triggerModifyForUserGroupPodAssignment : function(userGroupId, podId, podDescription, version, editMode) {

						var modifiedData = {};
						modifiedData.userGroupId = userGroupId;
						modifiedData.podId = podId;
						modifiedData.podDescription = podDescription;
						modifiedData.editMode = editMode;

						if (version != undefined) {
							modifiedData.version = version;
						}

						var dataFound = false;

						for ( var i = 0; i < this.globalUserGroupPodAssignmentData.length; i++) {
							if (	this.globalUserGroupPodAssignmentData[i]["client"] == this.currentSelectedClient &&
									this.globalUserGroupPodAssignmentData[i]["plant"] == this.currentSelectedPlant &&
									this.globalUserGroupPodAssignmentData[i]["nodeID"] == this.currentSelectedNode ) {

								var userGroupAndPods = this.globalUserGroupPodAssignmentData[i]["userGroupAndPods"];
								for ( var j = 0; j < userGroupAndPods.length; j++) {
									if (userGroupAndPods[j]["userGroupId"] == userGroupId) {
										dataFound = true;
										
										if(userGroupAndPods[j]["isInherited"]){
											dataFound = false;
											//Modifying a created record. Set the "edit mode" as "create"
											userGroupAndPods.splice(j, 1);
										}else if (userGroupAndPods[j]["editMode"] != this.deleteMode && editMode == this.createMode) {											
											//Trying to create a duplicate key record. Do not allow
											createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
											return false;

										} else if (userGroupAndPods[j]["editMode"] == this.createMode && editMode == this.deleteMode) {
											//Deleting a created record. Remove the record from the list
											userGroupAndPods.splice(j, 1);

										} else if (userGroupAndPods[j]["editMode"] == this.createMode && editMode == this.modifyMode) {
											//Modifying a created record. Set the "edit mode" as "create"
											modifiedData.editMode = this.createMode;
											userGroupAndPods.splice(j, 1, modifiedData);

										} else if (userGroupAndPods[j]["editMode"] == this.deleteMode && editMode == this.createMode) {
											//Creating a deleted record. Set the "edit mode" as "modify".
											modifiedData.version = userGroupAndPods[j]["version"];
											modifiedData.editMode = this.modifyMode;
											userGroupAndPods.splice(j, 1, modifiedData);

										} else {
											userGroupAndPods.splice(j, 1, modifiedData);											
										}
										break;
									}
								}

								if (dataFound == false) {
									userGroupAndPods.push(modifiedData);
									dataFound = true;
								}
							}
						}

						if (dataFound == false) {
							var userGroupAndPods = [];
							userGroupAndPods.push(modifiedData);

							this.globalUserGroupPodAssignmentData.push( {
								client : this.currentSelectedClient,
								plant : this.currentSelectedPlant,
								nodeID : this.currentSelectedNode,
								userGroupAndPods : userGroupAndPods
							});
							dataFound = true;
						}
						return true;
					},

					getSelectedValueFromConfigAdminUserGroupAssignmentTable : function(selectedIndex) {
						if (this.currentConfigAdminUserGroupAssignmentData != undefined) {
							if (this.currentConfigAdminUserGroupAssignmentData.length > selectedIndex) {
								return this.currentConfigAdminUserGroupAssignmentData[selectedIndex];
							}
						}
					},

					addNewConfigAdminUserGroupAssignmentRow : function(userGroupId) {
						var modifyCheck = this.triggerModifyForConfigAdminUserGroupAssignment(userGroupId, undefined, this.createMode);
						if (modifyCheck == true) {
							if (this.currentConfigAdminUserGroupAssignmentData != undefined) {
								this.currentConfigAdminUserGroupAssignmentData.push({userGroupId : userGroupId});
								this.bindCurrentConfigAdminUserGroupAssignmentDataToTable();
							}
						}
					},

					deleteConfigAdminUserGroupAssignmentRow : function(selectedIndex) {
						if (this.currentConfigAdminUserGroupAssignmentData != undefined) {
							if (this.currentConfigAdminUserGroupAssignmentData.length > selectedIndex) {
								var userGroupId = this.currentConfigAdminUserGroupAssignmentData[selectedIndex]["userGroupId"];
								var version = this.currentConfigAdminUserGroupAssignmentData[selectedIndex]["version"];
								this.currentConfigAdminUserGroupAssignmentData.splice(selectedIndex, 1);
								this.bindCurrentConfigAdminUserGroupAssignmentDataToTable();
								this.triggerModifyForConfigAdminUserGroupAssignment(userGroupId, version, this.deleteMode);
							}
						}
					},

					deleteAllConfigAdminUserGroupAssignmentRows : function() {
						if (this.currentConfigAdminUserGroupAssignmentData != undefined) {
							while (this.currentConfigAdminUserGroupAssignmentData.length > 0) {
								this.deleteConfigAdminUserGroupAssignmentRow(0);
							}
						}
					},

					prepareConfigAdminUserGroupAssignmentDataBeforeSave : function() {
						for ( var i = 0; i < this.globalConfigAdminUserGroupsData.length; i++) {
							var configAdminUserGroups = this.globalConfigAdminUserGroupsData[i]["configAdminUserGroups"];
							for ( var j = 0; j < configAdminUserGroups.length; j++) {
								var editMode = configAdminUserGroups[j]["editMode"];

								var dataToBeSaved = {};
								dataToBeSaved.client = this.globalConfigAdminUserGroupsData[i]["client"];
								dataToBeSaved.plant = this.globalConfigAdminUserGroupsData[i]["plant"];
								dataToBeSaved.nodeID = this.globalConfigAdminUserGroupsData[i]["nodeID"];
								dataToBeSaved.userGroupId = configAdminUserGroups[j]["userGroupId"];
								if (configAdminUserGroups[j]["version"] != undefined) {
									dataToBeSaved.version = configAdminUserGroups[j]["version"];
								}

								switch (editMode) {
								case this.createMode:
									this.configAdminUserGroupAssignmentDataToBeCreated.push(dataToBeSaved);
									break;
								case this.deleteMode:
									this.configAdminUserGroupAssignmentDataToBeDeleted.push(dataToBeSaved);
									break;
								}
							}
						}
					},

					saveConfigAdminUserGroupAssignmentData : function() {
						var outputMessage = this.saveConfigAdminUserGroupAssignmentDataInternal();

						// Refresh data for the current node
						this.createConfigAdminUserAssignmentData();

						return outputMessage;
					},

					saveConfigAdminUserGroupAssignmentDataInternal : function() {
						this.prepareConfigAdminUserGroupAssignmentDataBeforeSave();
						var saveResults = saveUserGroupAssignments(
								"SAVE_CONFIG_ADMIN_USERGROUP_ASSIGNMENT",
								this.configAdminUserGroupAssignmentDataToBeCreated,
								this.configAdminUserGroupAssignmentDataToBeModified,
								this.configAdminUserGroupAssignmentDataToBeDeleted);

						var outputMessage;
						if (saveResults != undefined) {
							if (saveResults.result == true) {
								outputMessage = oOEEBundle.getText("OEE_MESSAGE_SAVE_SUCCESS"); 
								this.isSaveSuccessForConfigAdminUserGroupAssignment = true;
								this.globalConfigAdminUserGroupsData = [];
							} else if (saveResults.result == false) {
								outputMessage = oOEEBundle.getText("OEE_MESSAGE_SAVE_ERROR"); 
							} else {
								if (saveResults.outputMessage != undefined) {
									outputMessage = saveResults.outputMessage;
								}
							}
						}

						this.configAdminUserGroupAssignmentDataToBeCreated = [];
						this.configAdminUserGroupAssignmentDataToBeModified = [];
						this.configAdminUserGroupAssignmentDataToBeDeleted = [];

						this.currentConfigAdminUserGroupAssignmentData = [];
						this.bindCurrentConfigAdminUserGroupAssignmentDataToTable();

						return outputMessage;
					},

					triggerModifyForConfigAdminUserGroupAssignment : function(userGroupId, version, editMode) {

						var modifiedData = {};
						modifiedData.userGroupId = userGroupId;
						modifiedData.editMode = editMode;
						if (version != undefined) {
							modifiedData.version = version;
						}

						var dataFound = false;
						for ( var i = 0; i < this.globalConfigAdminUserGroupsData.length; i++) {
							if (	this.globalConfigAdminUserGroupsData[i]["client"] == this.currentSelectedClient &&
									this.globalConfigAdminUserGroupsData[i]["plant"] == this.currentSelectedPlant &&
									this.globalConfigAdminUserGroupsData[i]["nodeID"] == this.currentSelectedNode ) {

								var configAdminUserGroups = this.globalConfigAdminUserGroupsData[i]["configAdminUserGroups"];
								for ( var j = 0; j < configAdminUserGroups.length; j++) {
									if (configAdminUserGroups[j]["userGroupId"] == userGroupId) {
										dataFound = true;

										if (configAdminUserGroups[j]["editMode"] != this.deleteMode && editMode == this.createMode) {
											//Trying to add a duplicate record. Do not allow.
											createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
											return false;

										} else if (configAdminUserGroups[j]["editMode"] == this.createMode && editMode == this.deleteMode) {
											//Deleting a created record. Remove from the list
											configAdminUserGroups.splice(j, 1);

										} else if (configAdminUserGroups[j]["editMode"] == this.deleteMode && editMode == this.createMode) {
											//Creating a deleted record. Change the edit mode to "".
											modifiedData.version = configAdminUserGroups[j]["version"];
											modifiedData.editMode = "";
											configAdminUserGroups.splice(j, 1, modifiedData);

										} else {
											configAdminUserGroups.splice(j, 1, modifiedData);
										}
										break;
									}
								}

								if (dataFound == false) {
									configAdminUserGroups.push(modifiedData);
									dataFound = true;
								}
							}
						}

						if (dataFound == false) {
							var configAdminUserGroups = [];
							configAdminUserGroups.push(modifiedData);

							this.globalConfigAdminUserGroupsData.push( {
								client : this.currentSelectedClient,
								plant : this.currentSelectedPlant,
								nodeID : this.currentSelectedNode,
								configAdminUserGroups : configAdminUserGroups
							});
							dataFound = true;
						}
						return true;
					},

					getAllDCElementForClient : function() {

						var dcElementResults = getDCElementsForLossCategory(this.currentSelectedClient);
						if (dcElementResults.dataCollectionElements != undefined) {
							this.allDCElementModel = new sap.ui.model.json.JSONModel();
							this.allDCElementModel.setData( {
								dcElements : dcElementResults.dataCollectionElements.results
							});
						}
					},

					getReasonCodeForDCElement : function(dcElement) {
						return getReasonCodeForDCElement(
								this.currentSelectedClient,
								this.currentSelectedPlant, dcElement);
					},

					getAllMaterialsForClient : function() {

						var materialResults = getAllMaterialsForClient(this.currentSelectedClient);
						if (materialResults.materialDetails != undefined) {
							this.allMaterialsForClientModel = new sap.ui.model.json.JSONModel();
							this.allMaterialsForClientModel.setData( {
										materials : materialResults.materialDetails.results
									});
						}
					},

					getAllCustomizationNames : function() {

						var customizationNameResults = getAllCustomizationNames(this.currentSelectedClient);
						if (customizationNameResults.customizationNameDetails != undefined) {
							this.allCustomizationNamesModel = new sap.ui.model.json.JSONModel();
							this.allCustomizationNamesModel.setData( { 
										customizationNames : customizationNameResults.customizationNameDetails.results
									});
						}
					},

					getUOMsForCustomizationName : function(customizationNameTableIndex) {
						if (this.currentCustomizationConfigurationData != undefined) {
							if (this.currentCustomizationConfigurationData.length > customizationNameTableIndex) {
								this.isDimensionAvailableForSelectedCustomizationValue = this.currentCustomizationConfigurationData[customizationNameTableIndex].isDimensionAvailable;								
								if (this.isDimensionAvailableForSelectedCustomizationValue == true) {
									var dimensionID = this.currentCustomizationConfigurationData[customizationNameTableIndex].relevantDimension;
									this.getUOMsForCustomizationNameDimension(dimensionID);
								}
							}
						}	
					},
					
					getUOMsForCustomizationNameDimension : function(dimensionID) {
						var uomData = getUOMForDimension(dimensionID);
						if (uomData.uomList != undefined) {
							this.allUOMForDimensionModel = new sap.ui.model.json.JSONModel();
							this.allUOMForDimensionModel.setData({
								UOMs : uomData.uomList.results
							});
						} else {
							this.allUOMForDimensionModel = new sap.ui.model.json.JSONModel();
						}	
					},
					getAllowedValuesForCustomizationName: function(customizationNameTableIndex) {
						this.allowedValuesForSelectedCustomizationNameModel = new sap.ui.model.json.JSONModel();
						if (this.currentCustomizationConfigurationData != undefined) {
							if (this.currentCustomizationConfigurationData.length > customizationNameTableIndex) {
								if(this.currentCustomizationConfigurationData[customizationNameTableIndex].allowedValues.length > 0) {									
									this.allowedValuesForSelectedCustomizationNameModel.setData({
										allowedValues : this.currentCustomizationConfigurationData[customizationNameTableIndex].allowedValues
									});
								}
							}
						}	
					},
					enableCustomizationValuesScreen : function() {
						var tabForSingleValuedCustomizationValue = this.byId("singleValuedCustomizationValueTab");
						var tabForMultiValuedCustomizationValue = this.byId("multiValuedCustomizationValueTab");

						if (this.isCustomizationNameSelected == true) {
							
							var customizationNameTableDeleteButton = this.byId("customizationNameTableDeleteButton");
							if (customizationNameTableDeleteButton != undefined) {
								customizationNameTableDeleteButton.setEnabled(!(this.isSelectedCustomizationValueInherited));
								customizationNameTableDeleteButton.setVisible(!(this.isSelectedCustomizationValueInherited));
								customizationNameTableDeleteButton.rerender();
							}
							
							if (this.isSelectedCustomizationValueMultiValued == false) {
								this.enableSingleValuedCustomizationValueTab(tabForSingleValuedCustomizationValue, true);
								this.enableMultiValuedCustomizationValueTab(tabForMultiValuedCustomizationValue, false);
							} else {
								this.enableSingleValuedCustomizationValueTab(tabForSingleValuedCustomizationValue, false);
								this.enableMultiValuedCustomizationValueTab(tabForMultiValuedCustomizationValue, true);
							}
						} else {
							this.enableSingleValuedCustomizationValueTab(tabForSingleValuedCustomizationValue, false);
							this.enableMultiValuedCustomizationValueTab(tabForMultiValuedCustomizationValue, false);							
						}
					},

					enableSingleValuedCustomizationValueTab : function(tabForSingleValuedCustomizationValue, enabled) {
						if (tabForSingleValuedCustomizationValue != undefined) {
							tabForSingleValuedCustomizationValue.setEnabled(enabled);
							tabForSingleValuedCustomizationValue.setVisible(enabled);
							var uomComboBox = this.byId("uomComboBox");
							if (uomComboBox != undefined) {
								if (enabled == true) {
									uomComboBox.setVisible(this.isDimensionAvailableForSelectedCustomizationValue);
									uomComboBox.setEnabled(this.isDimensionAvailableForSelectedCustomizationValue);
									if (this.isDimensionAvailableForSelectedCustomizationValue == true) {
										var customizationNameTable = this.byId("customizationNameTable");
										if (customizationNameTable != undefined) {			
											var selectedIndex = customizationNameTable.getSelectedIndex();
											if (selectedIndex >= 0) {
												this.getUOMsForCustomizationName(selectedIndex);
												uomComboBox.setModel(this.allUOMForDimensionModel);
												uomComboBox.rerender();
											}			
										}
									}
									
									uomComboBox.setEnabled(!(this.isSelectedCustomizationValueInherited));
								} else {
									uomComboBox.setVisible(false);
									uomComboBox.setEnabled(false);
								}
							}
							
							var customizationValueComboBox = this.byId("customizationValueComboBox");
							if (customizationValueComboBox != undefined) {
								customizationValueComboBox.setEnabled(!(this.isSelectedCustomizationValueInherited));
									var customizationNameTable = this.byId("customizationNameTable");
									if (customizationNameTable != undefined) {			
										var selectedIndex = customizationNameTable.getSelectedIndex();
										if (selectedIndex >= 0) {
											this.getAllowedValuesForCustomizationName(selectedIndex);
										if (this.allowedValuesForSelectedCustomizationNameModel !==  undefined) {
											customizationValueComboBox.setModel(this.allowedValuesForSelectedCustomizationNameModel);
											}else{
											customizationValueComboBox.removeAllItems(); 
											}
										customizationValueComboBox.rerender();
										}			
									}
							}
							tabForSingleValuedCustomizationValue.rerender();
						}
					},

					enableMultiValuedCustomizationValueTab : function(tabForMultiValuedCustomizationValue, enabled) {
						if (tabForMultiValuedCustomizationValue != undefined) {
							tabForMultiValuedCustomizationValue.setEnabled(enabled);
							tabForMultiValuedCustomizationValue.setVisible(enabled);
							var customizationValueTable = this.byId("customizationValueTable");
							if (customizationValueTable != undefined) {
								var uomColumn = customizationValueTable.getColumns()[1];
								if (uomColumn != undefined) {
									if (enabled == true) {
										uomColumn.setVisible(this.isDimensionAvailableForSelectedCustomizationValue);
									} else {
										uomColumn.setVisible(false);
									}
								}
								
								this.enableTableButtons(customizationValueTable, !(this.isSelectedCustomizationValueInherited));
							}	
							tabForMultiValuedCustomizationValue.rerender();
						}
					},

					addNewCustomizationValueRow : function (
							customizationName, 
							customizationNameDescription, 
							material, 
							materialDescription) {
						var customizationValueDetails = [];
						var data = this.allCustomizationNamesModel.getData();
						if (data.customizationNames != undefined) {
							var relevantDimension;
							var allowedValueList;
							for ( var i = 0; i < data.customizationNames.length; i++) {
								if (customizationName == data.customizationNames[i]["customizationName"]) {
									this.isSelectedCustomizationValueMultiValued = data.customizationNames[i]["isCustomizationNameMultiValued"];
									this.isDimensionAvailableForSelectedCustomizationValue = data.customizationNames[i].isDimensionAvailable;
									relevantDimension = data.customizationNames[i].relevantDimension;
									if (data.customizationNames[i] != undefined) {
										if (data.customizationNames[i].customizationNameAllowedValueList != undefined) {
									allowedValueList = data.customizationNames[i].customizationNameAllowedValueList.results;
										}
									}
									
									this.isCustomizationNameSelected = true;
									this.currentCustomizationValueData = customizationValueDetails;
									break;
								}
							}

							if (this.isCustomizationNameSelected == true) {
								
								var customizationValueData = {};
								this.isSelectedCustomizationValueInherited = false;
								
								customizationValueData.customizationName = customizationName;
								customizationValueData.customizationNameDescription = customizationNameDescription;
								customizationValueData.isCustomizationNameMultiValued = this.isSelectedCustomizationValueMultiValued;
								customizationValueData.isCustomizationValueInherited = this.isSelectedCustomizationValueInherited;
								customizationValueData.isDimensionAvailable = this.isDimensionAvailableForSelectedCustomizationValue;
								customizationValueData.relevantDimension = relevantDimension;
								customizationValueData.material = material;
								customizationValueData.materialDescription = materialDescription;
								customizationValueData.customizationValueDetails = customizationValueDetails;
								customizationValueData.allowedValues = allowedValueList;
								customizationValueData.version = undefined;
								customizationValueData.customizationValueId = undefined;
								
								var modifyCheck = this.triggerModifyForCustomizationConfiguration(
												 		customizationValueData,
										this.createMode);

								if (modifyCheck == true) {
									if (this.currentCustomizationConfigurationData != undefined) {
										this.currentCustomizationConfigurationData.push({
													customizationName : customizationName,
													customizationNameDescription : customizationNameDescription,
													material : material,
													materialDescription : materialDescription,
													isCustomizationNameMultiValued : this.isSelectedCustomizationValueMultiValued,
													isCustomizationValueInherited : this.isSelectedCustomizationValueInherited,
													isDimensionAvailable : this.isDimensionAvailableForSelectedCustomizationValue,
													relevantDimension : relevantDimension,
													customizationValueDetails : customizationValueDetails,
													allowedValues : allowedValueList
												});
									}

									this.bindCurrentCustomizationConfigurationDataToTable();
									this.bindCurrentCustomizationValueDetailsDataToUIElement(this.currentCustomizationConfigurationData.length - 1);
									this.getView().setIndexForCustomizationTable(this.currentCustomizationConfigurationData.length - 1);
									
								} else {
									this.isCustomizationNameSelected = false;
								}

							}
						}
						this.enableCustomizationValuesScreen();
					},

					getSelectedValueForCustomizationName : function(rowIndex) {
						if (this.currentCustomizationConfigurationData != undefined) {
							if (this.currentCustomizationConfigurationData.length > rowIndex) {
								return this.currentCustomizationConfigurationData[rowIndex];
							}
						}
					},

					deleteCustomizationValueRow : function(selectedIndex) {
						if (this.currentCustomizationConfigurationData != undefined) {
							if (this.currentCustomizationConfigurationData.length > selectedIndex) {
								
								var customizationValueData = {};
								
								customizationValueData.customizationName = this.currentCustomizationConfigurationData[selectedIndex]["customizationName"];
								customizationValueData.customizationNameDescription = this.currentCustomizationConfigurationData[selectedIndex]["customizationNameDescription"];
								customizationValueData.customizationValueId = this.currentCustomizationConfigurationData[selectedIndex]["customizationValueId"];
								customizationValueData.material = this.currentCustomizationConfigurationData[selectedIndex]["material"];
								customizationValueData.materialDescription = this.currentCustomizationConfigurationData[selectedIndex]["materialDescription"];
								customizationValueData.version = this.currentCustomizationConfigurationData[selectedIndex]["version"];
								customizationValueData.isDimensionAvailable = this.currentCustomizationConfigurationData[selectedIndex].isDimensionAvailable;
								customizationValueData.relevantDimension = this.currentCustomizationConfigurationData[selectedIndex].relevantDimension;
								customizationValueData.allowedValues = this.currentCustomizationConfigurationData[selectedIndex].allowedValues;
								
								this.isSelectedCustomizationValueMultiValued = this.currentCustomizationConfigurationData[selectedIndex]["isCustomizationNameMultiValued"];
								this.isSelectedCustomizationValueInherited = this.currentCustomizationConfigurationData[selectedIndex]["isCustomizationValueInherited"];
								this.currentSelectedCustomizationValueData = this.currentCustomizationConfigurationData[selectedIndex]["customizationValueDetails"];

								customizationValueData.isCustomizationNameMultiValued = this.isSelectedCustomizationValueMultiValued;
								customizationValueData.isCustomizationValueInherited = this.isSelectedCustomizationValueInherited;
								customizationValueData.customizationValueDetails = this.currentSelectedCustomizationValueData;
								
								this.currentCustomizationConfigurationData.splice(selectedIndex, 1);
								this.bindCurrentCustomizationConfigurationDataToTable();
								this.isCustomizationNameSelected = false;
								this.triggerModifyForCustomizationConfiguration(
														customizationValueData, 
										this.deleteMode);
							}
						}
						this.enableCustomizationValuesScreen();
					},

					deleteAllCustomizationValueRows : function() {
						if (this.currentCustomizationConfigurationData != undefined) {
							while (this.currentCustomizationConfigurationData.length > 0) {
								this.deleteCustomizationValueRow(0);
							}
						}
					},

					triggerModifyForCustomizationValueDetailsChange : function(selectedIndex, customizationValueDetailsEditMode, customizationValueDetailsIndex, customizationValueDetail, uom) {
						
						var customizationValue = {};
						customizationValue.customizationValue = customizationValueDetail;
						if (uom != undefined) {
							customizationValue.uom = uom;
						}
						if (this.currentCustomizationConfigurationData != undefined) {
							if (this.currentCustomizationConfigurationData.length > selectedIndex) {
								this.currentCustomizationValueData = this.currentCustomizationConfigurationData[selectedIndex]["customizationValueDetails"];

								if (customizationValueDetailsEditMode == this.createMode) {
									this.currentCustomizationValueData.push(customizationValue);
								} else if (customizationValueDetailsEditMode == this.modifyMode) {

									if (this.currentCustomizationValueData != undefined) {
										if (this.currentCustomizationValueData.length > customizationValueDetailsIndex) {
											this.currentCustomizationValueData.splice(customizationValueDetailsIndex, 1, customizationValue);
										}
									}
								} else if (customizationValueDetailsEditMode == this.deleteMode) {
									if (this.currentCustomizationValueData != undefined) {
										if (this.currentCustomizationValueData.length > customizationValueDetailsIndex) {
											this.currentCustomizationValueData.splice(customizationValueDetailsIndex, 1);
										}
									}
								} else if (customizationValueDetailsEditMode == this.deleteAllMode) {
									this.currentCustomizationValueData = [];
								}

								var customizationName = this.currentCustomizationConfigurationData[selectedIndex]["customizationName"];
								var customizationNameDescription = this.currentCustomizationConfigurationData[selectedIndex]["customizationNameDescription"];
								var customizationValueId = this.currentCustomizationConfigurationData[selectedIndex]["customizationValueId"];
								var material = this.currentCustomizationConfigurationData[selectedIndex]["material"];
								var materialDescription = this.currentCustomizationConfigurationData[selectedIndex]["materialDescription"];
								var version = this.currentCustomizationConfigurationData[selectedIndex]["version"];
								this.isSelectedCustomizationValueMultiValued = this.currentCustomizationConfigurationData[selectedIndex]["isCustomizationNameMultiValued"];
								this.isDimensionAvailableForSelectedCustomizationValue = this.currentCustomizationConfigurationData[selectedIndex].isDimensionAvailable;
								this.isSelectedCustomizationValueInherited = this.currentCustomizationConfigurationData[selectedIndex]["isCustomizationValueInherited"];
								var relevantDimension = this.currentCustomizationConfigurationData[selectedIndex].relevantDimension;
								var customizationNameAllowedValueList = this.currentCustomizationConfigurationData[selectedIndex].allowedValues;

								this.isCustomizationNameSelected = true;
								
								var customizationValueData = {
													customizationName : customizationName,
													customizationNameDescription : customizationNameDescription,
													isCustomizationNameMultiValued : this.isSelectedCustomizationValueMultiValued,
													isDimensionAvailable : this.isDimensionAvailableForSelectedCustomizationValue,
													relevantDimension : relevantDimension,
										isCustomizationValueInherited : this.isSelectedCustomizationValueInherited,
													customizationValueId : customizationValueId,
													material : material,
													materialDescription : materialDescription,
													customizationValueDetails : this.currentCustomizationValueData,
										allowedValues : customizationNameAllowedValueList,
													version : version
									};
								this.currentCustomizationConfigurationData.splice(selectedIndex, 1, customizationValueData);
								this.bindCurrentCustomizationConfigurationDataToTable();
								this.bindCurrentCustomizationValueDetailsDataToUIElement(selectedIndex);
								this.triggerModifyForCustomizationConfiguration(
										customizationValueData,		 
										this.modifyMode);								
							}
						}

						this.enableCustomizationValuesScreen();
					},

					prepareCustomizationConfigurationDataBeforeSave : function() {
						for ( var i = 0; i < this.globalCustomizationConfigurationData.length; i++) {
							var customizationConfigData = this.globalCustomizationConfigurationData[i]["customizationConfigData"];
							for ( var j = 0; j < customizationConfigData.length; j++) {
								var editMode = customizationConfigData[j]["editMode"];

								var dataToBeSaved = {};
								dataToBeSaved.client = this.globalCustomizationConfigurationData[i]["client"];
								dataToBeSaved.plant = this.globalCustomizationConfigurationData[i]["plant"];
								dataToBeSaved.nodeID = this.globalCustomizationConfigurationData[i]["nodeID"];
								dataToBeSaved.materialNumber = customizationConfigData[j]["material"];
								dataToBeSaved.customizationName = customizationConfigData[j]["customizationName"];
								dataToBeSaved.customizationValueId = customizationConfigData[j]["customizationValueId"];

								if (customizationConfigData[j]["customizationValueDetails"].length > 0) {
									dataToBeSaved.customizationValueDetailList = customizationConfigData[j]["customizationValueDetails"];
								}

								if (customizationConfigData[j]["version"] != undefined) {
									dataToBeSaved.version = customizationConfigData[j]["version"];
								}

								switch (editMode) {
								case this.createMode:
									this.customizationConfigDataToBeCreated.push(dataToBeSaved);
									break;
								case this.modifyMode:
									this.customizationConfigDataToBeModified.push(dataToBeSaved);
									break;
								case this.deleteMode:
									this.customizationConfigDataToBeDeleted.push(dataToBeSaved);
									break;
								}
							}
						}	
					},
					
					doValidationForCustomizationConfiguration : function() {
						for ( var i = 0; i < this.globalCustomizationConfigurationData.length; i++) {
							var customizationConfigData = this.globalCustomizationConfigurationData[i]["customizationConfigData"];							
							var autoRestartRunValue = undefined;
							var shiftEndTimeValue = undefined;
							for ( var j = 0; j < customizationConfigData.length; j++) {
								var editMode = customizationConfigData[j]["editMode"];								
								if (	customizationConfigData[j]["customizationName"] == this.AUTO_RESTART_RUN ||
										customizationConfigData[j]["customizationName"] == this.SHIFT_END_TIME ) {
									if (editMode != this.deleteMode || editMode != this.deleteAllMode) {
										 var customizationValueDetails = customizationConfigData[j]["customizationValueDetails"];
										 if (customizationValueDetails != undefined && customizationValueDetails.length > 0) {
											 if (customizationConfigData[j]["customizationName"] == this.AUTO_RESTART_RUN) {
												 autoRestartRunValue = customizationValueDetails[0]["customizationValue"];
											 }
											 if (customizationConfigData[j]["customizationName"] == this.SHIFT_END_TIME) {
												 shiftEndTimeValue = customizationValueDetails[0]["customizationValue"]; 
											 }
										 }	 
									}	
								}
								/*if (customizationConfigData[j]["customizationName"] == this.LINE_BEHAVIOR) {
									if (editMode == this.deleteMode) {
										createMessage(oOEEBundle.getText("CUSTOMIZATION_LINE_BEHAVIOR"), sap.ui.core.MessageType.Error);
										return false;
									} else if (editMode != "") {
										var customizationValueDetails = customizationConfigData[j]["customizationValueDetails"];
										this.lineBehaviorValue = customizationValueDetails[0]["customizationValue"];
									}
								}*/
							}
							
							/*if (this.existingLineBehavior != "") {
								if (this.existingLineBehavior != this.lineBehaviorValue) {
									createMessage(oOEEBundle.getText("CUSTOMIZATION_LINE_BEHAVIOR"), sap.ui.core.MessageType.Error);
									return false;
								}
							}*/
							
							
							if (autoRestartRunValue == this.YES) {
								if (shiftEndTimeValue != undefined) {
									if (shiftEndTimeValue != this.PLANNED) {
										createMessage(oOEEBundle.getText("CUSTOMIZATION_VALUE_MISMATCH"), sap.ui.core.MessageType.Error);
										return false;
									}	
								}	
							} else if (autoRestartRunValue == this.NO) {
								if (shiftEndTimeValue != undefined) {
									if (shiftEndTimeValue != this.ACTUAL) {
										createMessage(oOEEBundle.getText("CUSTOMIZATION_VALUE_MISMATCH"), sap.ui.core.MessageType.Error);
										return false;
									}	
								}	
							}							
							if (shiftEndTimeValue == this.PLANNED) {
								if (autoRestartRunValue != undefined) {
									if (autoRestartRunValue != this.YES) {
										createMessage(oOEEBundle.getText("CUSTOMIZATION_VALUE_MISMATCH"), sap.ui.core.MessageType.Error);
										return false;
									}	
								}	
							} else if (shiftEndTimeValue == this.ACTUAL) {
								if (autoRestartRunValue != undefined) {
									if (autoRestartRunValue != this.NO) {
										createMessage(oOEEBundle.getText("CUSTOMIZATION_VALUE_MISMATCH"), sap.ui.core.MessageType.Error);
										return false;
									}	
								}
							}	
						}	
						return true;
					},	

					saveCustomizationConfigurationData : function() {
						if (this.doValidationForCustomizationConfiguration()) {
							var outputMessage = this.saveCustomizationConfigurationDataInternal();

							// Refresh data for the current node
							this.isCustomizationNameSelected = false;
							this.enableCustomizationValuesScreen();

							this.createCustomizationConfigurationData();

							return outputMessage;
						}	
					},

					saveCustomizationConfigurationDataInternal : function() {
						this.prepareCustomizationConfigurationDataBeforeSave();
						var saveResults = saveCustomizationConfigurations(
								this.customizationConfigDataToBeCreated,
								this.customizationConfigDataToBeModified,
								this.customizationConfigDataToBeDeleted);

						var outputMessage;

						if (saveResults != undefined) {
							if (saveResults.outputCode == 0) {
								createMessage(oOEEBundle.getText("OEE_MESSAGE_SAVE_SUCCESS"), sap.ui.core.MessageType.Success);
								this.globalCustomizationConfigurationData = [];
							} else {
								outputMessage = saveResults.outputMessage;
							}
						}

						this.customizationConfigDataToBeCreated = [];
						this.customizationConfigDataToBeModified = [];
						this.customizationConfigDataToBeDeleted = [];

						this.currentCustomizationConfigurationData = [];
						this.currentCustomizationValueData = [];
						this.bindCurrentCustomizationConfigurationDataToTable();

						return outputMessage;
					},

					triggerModifyForCustomizationConfiguration : function(
							customizationValueData,
							editMode) {

						var dataFound = false;
						var modifiedData = {};
						modifiedData.customizationName = customizationValueData.customizationName;
						modifiedData.customizationNameDescription = customizationValueData.customizationNameDescription;
						modifiedData.isCustomizationNameMultiValued = customizationValueData.isCustomizationNameMultiValued;
						modifiedData.isDimensionAvailable = customizationValueData.isDimensionAvailable;
						modifiedData.relevantDimension = customizationValueData.relevantDimension;
						modifiedData.isCustomizationValueInherited = customizationValueData.isCustomizationValueInherited;
						modifiedData.material = customizationValueData.material;
						modifiedData.materialDescription = customizationValueData.materialDescription;
						modifiedData.customizationValueDetails = customizationValueData.customizationValueDetails;
						modifiedData.allowedValues = customizationValueData.allowedValues;
						modifiedData.editMode = editMode;
						if (customizationValueData.version != undefined) {
							modifiedData.version = customizationValueData.version;
						}
						if (customizationValueData.customizationValueId != undefined) {
							modifiedData.customizationValueId = customizationValueData.customizationValueId;
						}

						for ( var i = 0; i < this.globalCustomizationConfigurationData.length; i++) {
							if (	this.globalCustomizationConfigurationData[i]["client"] == this.currentSelectedClient &&
									this.globalCustomizationConfigurationData[i]["plant"] == this.currentSelectedPlant &&
									this.globalCustomizationConfigurationData[i]["nodeID"] == this.currentSelectedNode ) {

								var customizationConfigData = this.globalCustomizationConfigurationData[i]["customizationConfigData"];
								for ( var j = 0; j < customizationConfigData.length; j++) {
									if (	customizationConfigData[j]["customizationName"] == customizationValueData.customizationName &&
											customizationConfigData[j]["material"] == customizationValueData.material &&
											customizationConfigData[j]["isCustomizationValueInherited"] == customizationValueData.isCustomizationValueInherited) {
										dataFound = true;

										if (customizationConfigData[j]["editMode"] != this.deleteMode && editMode == this.createMode) {											
											//Trying to create a duplicate key record. Do not allow
											createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
											return false;

										} else if (customizationConfigData[j]["editMode"] == this.createMode && editMode == this.deleteMode) {
											//Deleting a created record. Remove the record from the list
											customizationConfigData.splice(j, 1);

										} else if (customizationConfigData[j]["editMode"] == this.createMode && editMode == this.modifyMode) {
											//Modifying a created record. Set the "edit mode" as "create"

											modifiedData.editMode = this.createMode;
											customizationConfigData.splice(j, 1, modifiedData);	

										} else if (customizationConfigData[j]["editMode"] == this.deleteMode && editMode == this.createMode) {
											//Creating a deleted record. Set the "edit mode" as "modify".

											modifiedData.version = customizationConfigData[j]["version"];
											modifiedData.editMode = this.modifyMode;
											customizationConfigData.splice(j, 1, modifiedData);

										} else {

											modifiedData.editMode = editMode;
											customizationConfigData.splice(j, 1, modifiedData);
										}
										break;
									}
								}

								if (dataFound == false) {
									customizationConfigData.push(modifiedData);
									dataFound = true;
								}
							}
						}

						if (dataFound == false) {
							var customizationConfigData = [];
							customizationConfigData.push(modifiedData);

							this.globalCustomizationConfigurationData.push( {
										client : this.currentSelectedClient,
										plant : this.currentSelectedPlant,
										nodeID : this.currentSelectedNode,
										customizationConfigData : customizationConfigData
									});
							dataFound = true;
						}

						return true;
					},
					
					createReasonCodeToolPopup : function(oEvent) {						
						var reasonCodeLink = oEvent.getSource();
						this.currentReasonCodeLevel = 4;
						this.currentSelectedReasonCodeAssignment.dcElement = this.currentSelectedReasonCodeDCElement;
						this.currentSelectedReasonCodeAssignment.dcElementDescription = this.currentSelectedReasonCodeDCElementDescription;
						
						openReasonCodeToolPopupScreen(
								this,
								reasonCodeLink,
								this.currentSelectedClient,
								this.currentSelectedPlant,
								this.currentSelectedNode,
								this.currentSelectedReasonCodeDCElement,
								this.currentSelectedReasonCodeDCElementDescription,
								this.currentSelectedReasonCodeAssignment,
								'reasonCodeData',
								true,
								false);
					},			

					// Reason Code Configuration
					triggerModifyForReasonCodeConfiguration : function(
																dcElement, 
																dcElementDescription, 
																reasonCodeData, 
																version, 
																rcphDCElemAssocId,
																editMode) {
						var modifiedData = {};
						modifiedData.dcElement = dcElement;
						modifiedData.dcElementDescription = dcElementDescription;
						modifiedData.reasonCode1 = reasonCodeData.reasonCode1;
						modifiedData.reasonCode2 = reasonCodeData.reasonCode2;
						modifiedData.reasonCode3 = reasonCodeData.reasonCode3;
						modifiedData.reasonCode4 = reasonCodeData.reasonCode4;
						modifiedData.reasonCode5 = reasonCodeData.reasonCode5;
						modifiedData.reasonCode6 = reasonCodeData.reasonCode6;
						modifiedData.reasonCode7 = reasonCodeData.reasonCode7;
						modifiedData.reasonCode8 = reasonCodeData.reasonCode8;
						modifiedData.reasonCode9 = reasonCodeData.reasonCode9;
						modifiedData.reasonCode10 = reasonCodeData.reasonCode10;
						modifiedData.reasonCodeDescription = reasonCodeData.description
						modifiedData.level = reasonCodeData.level;
						modifiedData.editMode = editMode;

						if (version != undefined) {
							modifiedData.version = version;
						}
						if (rcphDCElemAssocId != undefined) {
							modifiedData.rcphDCElemAssocId = rcphDCElemAssocId;
						}

						var dataFound = false;
						for ( var i = 0; i < this.globalReasonCodeConfigurationData.length; i++) {
							if (this.globalReasonCodeConfigurationData[i]["client"] == this.currentSelectedClient
									&& this.globalReasonCodeConfigurationData[i]["plant"] == this.currentSelectedPlant
									&& this.globalReasonCodeConfigurationData[i]["nodeId"] == this.currentSelectedNode) {

								var rcConfig = this.globalReasonCodeConfigurationData[i]["rcConfig"];
								for ( var j = 0; j < rcConfig.length; j++) {
									if (	rcConfig[j].dcElement == dcElement &&
											rcConfig[j].reasonCode1 == reasonCodeData.reasonCode1 &&
											rcConfig[j].reasonCode2 == reasonCodeData.reasonCode2 &&
											rcConfig[j].reasonCode3 == reasonCodeData.reasonCode3 &&
											rcConfig[j].reasonCode4 == reasonCodeData.reasonCode4 &&
											rcConfig[j].reasonCode5 == reasonCodeData.reasonCode5 &&
											rcConfig[j].reasonCode6 == reasonCodeData.reasonCode6 &&
											rcConfig[j].reasonCode7 == reasonCodeData.reasonCode7 &&
											rcConfig[j].reasonCode8 == reasonCodeData.reasonCode8 &&
											rcConfig[j].reasonCode9 == reasonCodeData.reasonCode9 &&
											rcConfig[j].reasonCode10 == reasonCodeData.reasonCode10) {
										dataFound = true;

										if (rcConfig[j]["editMode"] != this.deleteMode && editMode == this.createMode) {											
											//Trying to create a duplicate key record. Do not allow
											createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
											return false;

										} else if (rcConfig[j]["editMode"] == this.createMode && editMode == this.deleteMode) {
											//Deleting a created record. Remove the record from the list
											rcConfig.splice(j, 1);

										} else if (rcConfig[j]["editMode"] == this.createMode && editMode == this.modifyMode) {
											//Modifying a created record. Set the "edit mode" as "create"
											modifiedData.editMode = this.createMode;
											rcConfig.splice(j, 1, modifiedData);

										} else if (rcConfig[j]["editMode"] == this.deleteMode && editMode == this.createMode) {
											//Creating a deleted record. Set the "edit mode" as "modify".
											modifiedData.version = rcConfig[j]["version"];
											modifiedData.rcphDCElemAssocId = rcConfig[j]["rcphDCElemAssocId"];
											modifiedData.editMode = this.modifyMode;
											rcConfig.splice(j, 1, modifiedData);

										} else {
											rcConfig.splice(j, 1, modifiedData);
										}
										break;
									} /*else if (	rcConfig[j].dcElement == dcElement &&
												rcConfig[j].level != reasonCodeData.level) {
										if (rcConfig[j]["editMode"] != this.deleteMode) {
											createMessage(oOEEBundle.getText("OEE_ERROR_MSG_RC_ASGMT_LEVEL"), sap.ui.core.MessageType.Error);
											return false;
										}										
									}*/	
								}

								if (dataFound == false) {
									rcConfig.push(modifiedData);
									dataFound = true;
								}
							}
						}

						if (dataFound == false) {
							var rcConfig = [];
							rcConfig.push(modifiedData);

							this.globalReasonCodeConfigurationData.push( {
								client : this.currentSelectedClient,
								plant : this.currentSelectedPlant,
								nodeId : this.currentSelectedNode,
								rcConfig : rcConfig
							});
							dataFound = true;
						}
						return true;
					},

					addNewRCConfigRow : function(dcElement,
							dcElementDescription, reasonCodeData) {
						if (reasonCodeData != undefined) {
							if (reasonCodeData.length != undefined) {
								if (reasonCodeData.length > 0) {
									for (var i = 0; i < reasonCodeData.length; i++) {
										var modifyCheck = false;
										modifyCheck = this.doModifyCheckForReasonCodeConfiguration(dcElement, dcElementDescription, reasonCodeData[i]);
										if (modifyCheck == false) {
											break;
										}
									}
								}
							} else {
								this.doModifyCheckForReasonCodeConfiguration(dcElement, dcElementDescription, reasonCodeData);
							}
						}
					},
					
					doModifyCheckForReasonCodeConfiguration : function(dcElement, dcElementDescription, reasonCodeData) {
						var modifyCheck = this.triggerModifyForReasonCodeConfiguration(
								dcElement,
								dcElementDescription,
								reasonCodeData,
								undefined,
								undefined,
								this.createMode);
						
						if (modifyCheck == true) {
							if (this.currentReasonCodeConfigurationData != undefined) {
								this.currentReasonCodeConfigurationData
										.push( {
											dcElement : dcElement,
											dcElementDescription : dcElementDescription,
											reasonCode1 : reasonCodeData.reasonCode1,
											reasonCode2 : reasonCodeData.reasonCode2,
											reasonCode3 : reasonCodeData.reasonCode3,
											reasonCode4 : reasonCodeData.reasonCode4,
											reasonCode5 : reasonCodeData.reasonCode5,
											reasonCode6 : reasonCodeData.reasonCode6,
											reasonCode7 : reasonCodeData.reasonCode7,
											reasonCode8 : reasonCodeData.reasonCode8,
											reasonCode9 : reasonCodeData.reasonCode9,
											reasonCode10 : reasonCodeData.reasonCode10,
											level : reasonCodeData.level,
											reasonCodeDescription : reasonCodeData.description
										});
								this.bindCurrentReasonCodeConfigurationDataToTable();
							}
						}
						
						return modifyCheck;
					},	

					deleteReasonCodeConfigurationRow : function(selectedIndex) {
						if (this.currentReasonCodeConfigurationData != undefined) {
							if (this.currentReasonCodeConfigurationData.length > selectedIndex) {
								var dcElement = this.currentReasonCodeConfigurationData[selectedIndex]["dcElement"];
								var dcElementDescription = this.currentReasonCodeConfigurationData[selectedIndex]["dcElementDescription"];
								var reasonCodeData = {};
								reasonCodeData.reasonCode1 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode1"];
								reasonCodeData.reasonCode2 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode2"];
								reasonCodeData.reasonCode3 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode3"];
								reasonCodeData.reasonCode4 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode4"];
								reasonCodeData.reasonCode5 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode5"];
								reasonCodeData.reasonCode6 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode6"];
								reasonCodeData.reasonCode7 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode7"];
								reasonCodeData.reasonCode8 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode8"];
								reasonCodeData.reasonCode9 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode9"];
								reasonCodeData.reasonCode10 = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCode10"];
								reasonCodeData.level = this.currentReasonCodeConfigurationData[selectedIndex]["level"];
								reasonCodeData.reasonCodeDescription = this.currentReasonCodeConfigurationData[selectedIndex]["reasonCodeDescription"];
								var version = this.currentReasonCodeConfigurationData[selectedIndex]["version"];
								var rcphDCElemAssocId = this.currentReasonCodeConfigurationData[selectedIndex]["rcphDCElemAssocId"];
								this.currentReasonCodeConfigurationData.splice(selectedIndex, 1);
								this.bindCurrentReasonCodeConfigurationDataToTable();
								this.triggerModifyForReasonCodeConfiguration(
										dcElement, 
										dcElementDescription, 
										reasonCodeData, 
										version, 
										rcphDCElemAssocId,
										this.deleteMode);
							}
						}
					},

					deleteAllReasonCodeConfigurationRows : function() {
						
						if (this.currentReasonCodeConfigurationData != undefined) {
							while (this.currentReasonCodeConfigurationData.length > 0) {
								this.deleteReasonCodeConfigurationRow(0);
							}
						}
					},

					prepareReasonCodeConfigurationDataBeforeSave : function() {

					for ( var i = 0; i < this.globalReasonCodeConfigurationData.length; i++) {
						var rcConfigData = this.globalReasonCodeConfigurationData[i]["rcConfig"];
						for ( var j = 0; j < rcConfigData.length; j++) {
							var editMode = rcConfigData[j]["editMode"];

							var dataToBeSaved = {};
							dataToBeSaved.client = this.globalReasonCodeConfigurationData[i]["client"];
							dataToBeSaved.plant = this.globalReasonCodeConfigurationData[i]["plant"];
							dataToBeSaved.nodeId = this.globalReasonCodeConfigurationData[i]["nodeId"];
							dataToBeSaved.dcElement = rcConfigData[j]["dcElement"];
							dataToBeSaved.reasonCode1 = rcConfigData[j]["reasonCode1"];
							dataToBeSaved.reasonCode2 = rcConfigData[j]["reasonCode2"];
							dataToBeSaved.reasonCode3 = rcConfigData[j]["reasonCode3"];
							dataToBeSaved.reasonCode4 = rcConfigData[j]["reasonCode4"];
							dataToBeSaved.reasonCode5 = rcConfigData[j]["reasonCode5"];
							dataToBeSaved.reasonCode6 = rcConfigData[j]["reasonCode6"];
							dataToBeSaved.reasonCode7 = rcConfigData[j]["reasonCode7"];
							dataToBeSaved.reasonCode8 = rcConfigData[j]["reasonCode8"];
							dataToBeSaved.reasonCode9 = rcConfigData[j]["reasonCode9"];
							dataToBeSaved.reasonCode10 = rcConfigData[j]["reasonCode10"];

							if (rcConfigData[j]["version"] != undefined) {
								dataToBeSaved.version = rcConfigData[j]["version"];
							}
							if (rcConfigData[j]["rcphDCElemAssocId"] != undefined) {
								dataToBeSaved.rcphDCElemAssocId = rcConfigData[j]["rcphDCElemAssocId"];
							}
							
							switch (editMode) {
							case this.createMode:
									this.reasonCodeConfigDataToBeCreated.push(dataToBeSaved);
								break;
							case this.modifyMode:
									this.reasonCodeConfigDataToBeModified.push(dataToBeSaved);
								break;
							case this.deleteMode:
									this.reasonCodeConfigDataToBeDeleted.push(dataToBeSaved);
								break;
							}
						}
					}
				},

				saveReasonCodeConfigurationData : function() {
						var outputMessage = this.saveReasonCodeConfigurationDataInternal();

					this.createReasonCodeConfigurationData();

					return outputMessage;
				},

				saveReasonCodeConfigurationDataInternal : function() {
					this.prepareReasonCodeConfigurationDataBeforeSave();
					var saveResults = saveRCConfig(
							this.reasonCodeConfigDataToBeCreated,
							this.reasonCodeConfigDataToBeModified,
							this.reasonCodeConfigDataToBeDeleted);
					var outputMessage;

					if (saveResults != undefined) {
						if (saveResults.status != undefined) {
							if (saveResults.status == true) {
								this.globalReasonCodeConfigurationData = [];
								createMessage(oOEEBundle.getText("OEE_MESSAGE_SAVE_SUCCESS"), sap.ui.core.MessageType.Success);
							}
						}
					}
					
					this.reasonCodeConfigDataToBeCreated = [];
					this.reasonCodeConfigDataToBeModified = [];
					this.reasonCodeConfigDataToBeDeleted = [];
					
					this.currentReasonCodeConfigurationData = [];
					this.bindCurrentReasonCodeConfigurationDataToTable();
					
					return outputMessage;
					},
					
					getAllServiceMethodsForExtension : function() {
						var serviceMethodsData = getAllServiceMethods();
						if (serviceMethodsData.methods != undefined) {
							this.allServiceMethodsModel = new sap.ui.model.json.JSONModel();
							this.allServiceMethodsModel.setData({
								methods : serviceMethodsData.methods.results
							});
						}
					},
					
					getAllTypesForExtensions : function() {
						var extensionTypesData = getAllExtensionTypes();
						if (extensionTypesData.extensionTypes != undefined) {
							var typesArray = extensionTypesData.extensionTypes.results;
							var modifiedTypesArray = [];
							for (var i = 0; i < typesArray.length; i++) {
								modifiedTypesArray.push({
									type : typesArray[i]
								});
							}
							this.allExtensionTypesModel = new sap.ui.model.json.JSONModel();
							this.allExtensionTypesModel.setData({
								extensionTypes : modifiedTypesArray
							});
						}
					},
					
					getActivitiesForPlant : function() {
						var activityDetailsData = getAllActivitiesForPlant(
														this.currentSelectedClient,
														this.currentSelectedPlant);
						if (activityDetailsData.activityDetails != undefined) {
							this.allActivitiesModel = new sap.ui.model.json.JSONModel();
							this.allActivitiesModel.setData({
								activities : activityDetailsData.activityDetails.results
							});
						}
					},
					
					getAllowedLocales : function() {
						this.allowedLocalesModel = new sap.ui.model.json.JSONModel();
						this.allowedLocalesModel.setData({
							locales : sap.mpm.ui.locales
						});
					},
					
					setLanguageTextForAllowedLocales : function(extension) {
						var modifiedDescriptions = [];
						if (sap.mpm.ui.locales.length > 0) {
							if (extension.descriptions != undefined) {
								for (var i = 0; i < extension.descriptions.length; i++) {
									for (var j = 0; j < sap.mpm.ui.locales.length; j++) {
										if (extension.descriptions[i].language == sap.mpm.ui.locales[j].key) {
											modifiedDescriptions.push({
												descriptionID : extension.descriptions[i].descriptionID,
												extensionID : extension.extensionID,
												language : extension.descriptions[i].language,
												languageText : sap.mpm.ui.locales[j].text,
												description : extension.descriptions[i].description
											});
											break;
										}
									}
								}
							}
						}
						extension.descriptions = modifiedDescriptions;
					},
					
					setExtensionDescriptionForUserLocale : function(extension) {
						if (sap.mpm.ui.locales.length > 0) {
							if (extension.descriptions != undefined) {
								if (extension.descriptions.length == 0) {
									extension.extensionDescription = "";
								} else {
									for (var i = 0; i < extension.descriptions.length; i++) {
										if (extension.descriptions[i].language == this.currentUserDetails.locale) {
											extension.extensionDescription = extension.descriptions[i].description;
										}
									}
								}
							}
						}
					},
					
					enableExtensionDetailsScreen : function() {
						var extensionDetailsTable = this.byId("extensionDetailsTable");
						if (extensionDetailsTable != undefined) {
							if (this.isExtensionMethodSelected == true) {
								this.enableTableButtons(extensionDetailsTable, true);
							} else {
								this.enableTableButtons(extensionDetailsTable, false);
								this.clearExtensionDetailsTable();
							}
						}
					},
					
					addNewExtensionMethodRow : function(selectedMethodID, selectedMethodDisplayName) {						
						var extensionDetails = [];
						var modifyCheck = this.triggerModifyForExtensionConfiguration(
								selectedMethodID, 
								selectedMethodDisplayName, 
								extensionDetails, 
								this.createMode);
						
						if (modifyCheck == true) {
							this.currentExtensionConfigurationData = this
									.getRetrievedExtensionConfigurationData(
										this.currentSelectedClient,
										this.currentSelectedPlant,
										this.currentSelectedNode);
							this.bindCurrentExtensionConfigurationDataToTable();
							this.bindCurrentExtensionDetailsDataToUIElement(this.currentExtensionConfigurationData.length - 1);
							this.getView().setIndexForExtensionMethodTable(this.currentExtensionConfigurationData.length - 1);
						}	
					},
					
					deleteExtensionMethodRow : function(selectedIndex) {						
						if (this.currentExtensionConfigurationData != undefined) {
							if (this.currentExtensionConfigurationData.length > selectedIndex) {
								var methodID = this.currentExtensionConfigurationData[selectedIndex].methodID;
								var displayName = this.currentExtensionConfigurationData[selectedIndex].displayName;
								var extensionDetails = this.currentExtensionConfigurationData[selectedIndex].extensions;
								
								this.currentExtensionConfigurationData.splice(selectedIndex, 1);
								this.bindCurrentExtensionConfigurationDataToTable();
								this.clearExtensionDetailsTable();
								this.triggerModifyForExtensionConfiguration(
										methodID, 
										displayName, 
										extensionDetails,
										this.deleteMode);
							}							
						}
					},
					
					deleteAllExtensionMethodRows : function() {
						if (this.currentExtensionConfigurationData != undefined) {
							while (this.currentExtensionConfigurationData.length > 0) {
								this.deleteExtensionMethodRow(0);
							}
						}	
					},
					
					getExtensionDetailsForSelectedIndex : function(rowIndex) {
						if (this.currentExtensionDetailsData != undefined) {
							if (rowIndex < this.currentExtensionDetailsData.length) {
								return this.currentExtensionDetailsData[rowIndex];
							}
						}
					},
					
					getExtensionDescriptionForSelectedIndex : function(rowIndex) {
						if (this.currentExtensionDetailsData != undefined) {
							if (this.currentSelectedExtensionDetailRowIndex < this.currentExtensionDetailsData.length) {
								var descriptions = this.currentExtensionDetailsData[this.currentSelectedExtensionDetailRowIndex].descriptions;
								if (descriptions != undefined) {
									return descriptions[rowIndex];
								}
							}
						}
					},
					
					bindDataToExtensionTextTable : function(extension) {
						if (extension != undefined) {
							if (extension.descriptions != undefined) {
								this.currentExtensionDescriptionModel = new sap.ui.model.json.JSONModel();
								this.currentExtensionDescriptionModel.setData({
									descriptions : extension.descriptions
								});
								var extensionTextTable = this.byId("extensionTextTable");
								if (extensionTextTable != undefined) {
									extensionTextTable.setModel(this.currentExtensionDescriptionModel);
									extensionTextTable.rerender();
								}
							}	
						}
					},
					
					modifyExtensionDetailsRow : function(
							newExtensionDetail, 
							editMode) {
						if (this.currentSelectedExtensionMethodID != undefined) {							
							var descriptions = [];
							var extensionDescription = "";
							
							descriptions = this.currentExtensionDescriptionData;
							var dummyExtension = {};
							dummyExtension.descriptions = descriptions;
							this.setExtensionDescriptionForUserLocale(dummyExtension);
							extensionDescription = dummyExtension.extensionDescription;
							//reset once the value has been set
							this.currentExtensionDescriptionData = undefined;
							
							newExtensionDetail.extensionDescription = extensionDescription;
							newExtensionDetail.descriptions = descriptions;
							var modifyCheck = this.triggerModifyForExtensionDetails(
									this.currentSelectedExtensionMethodID,
									newExtensionDetail,
									editMode);
							
							if (modifyCheck == true) {
								if (editMode == this.createMode) {
									extensionConfigData = this.getRetrievedExtensionConfigurationData(
																		this.currentSelectedClient,
																		this.currentSelectedPlant,
																		this.currentSelectedNode);
									if (extensionConfigData != undefined) {
										if (this.currentSelectedExtensionMethodRowIndex != undefined) {
											var newExtensions = extensionConfigData.extensions;
											if (newExtensions != undefined && newExtensions.length > 0) {
												this.currentSelectedExtensionDetailRowIndex = newExtensions.length - 1;
											}
										}
									}
								} else if (editMode == this.modifyMode) {									
									if (this.currentSelectedExtensionDetailRowIndex != -1) {									
										this.currentExtensionDetailsData.splice(
												this.currentSelectedExtensionDetailRowIndex,
												1,
												newExtensionDetail);
									}
								}
								this.currentExtensionConfigurationData = this
									.getRetrievedExtensionConfigurationData(
										this.currentSelectedClient,
										this.currentSelectedPlant,
										this.currentSelectedNode);
								this.bindCurrentExtensionDetailsDataToUIElement(this.currentSelectedExtensionMethodRowIndex);
							}
						}
					},
					
					deleteExtensionDetailsRow : function(selectedIndex) {
						if (this.currentSelectedExtensionMethodID != undefined) {
							if (this.currentExtensionDetailsData != undefined) {
								if (selectedIndex < this.currentExtensionDetailsData.length) {
									var extensionDetail = this.currentExtensionDetailsData[selectedIndex];
									var modifyCheck = this.triggerModifyForExtensionDetails(
											this.currentSelectedExtensionMethodID,
											extensionDetail,
											this.deleteMode);
									if (modifyCheck == true) {
										this.currentExtensionDetailsData.splice(selectedIndex, 1);
										this.bindCurrentExtensionDetailsDataToUIElement(this.currentSelectedExtensionMethodRowIndex);
									}
								}	
							}
						}
					},
					
					deleteAllExtensionDetailsRows : function() {
						if (this.currentExtensionDetailsData != undefined) {
							while (this.currentExtensionDetailsData.length > 0) {
								this.deleteExtensionDetailsRow(0);
							}
						}
					},
					
					modifyExtensionDescriptionRow : function(
										selectedIndex, 
										extensionDescription, 
										editMode) {
						if (this.currentSelectedExtensionMethodID != undefined) {
							var extensionDetail;
							var descriptions = [];
							if (this.createNewExtensionDetail == false) {
								extensionDetail = this.getExtensionDetailsForSelectedIndex(this.currentSelectedExtensionDetailRowIndex);
								if (extensionDetail != undefined) {	
									descriptions = extensionDetail.descriptions;
									if (descriptions == undefined) {
										descriptions = [];
									}
								} else {
									descriptions = this.currentExtensionDescriptionData;
								}
							} else {
								this.createNewExtensionDetail = false;
							}
							
							if (editMode == this.createMode) {
								for (var i = 0; i < descriptions.length; i++) {
									if (extensionDescription.language == descriptions[i].language) {
										createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
										return;
									}
								}
								descriptions.push(extensionDescription);
								
							} else if (editMode == this.modifyMode) {
								
								if (selectedIndex < descriptions.length) {
									descriptions.splice(selectedIndex, 1, extensionDescription);
								}
								
							} else if (editMode == this.deleteMode) {
								
								if (selectedIndex < descriptions.length) {
									descriptions.splice(selectedIndex, 1);
								}	
								
							} else if (editMode == this.deleteAllMode) {
								
								descriptions = [];
							}
							
							this.currentExtensionDescriptionData = descriptions;
							if (extensionDetail != undefined) {
								extensionDetail.descriptions = descriptions;
							}							
							var dummyExtension = {};
							dummyExtension.descriptions = descriptions;
							this.bindDataToExtensionTextTable(dummyExtension);
						}
					},
					
					prepareExtensionConfigurationDataBeforeSave : function() {
						for (var i = 0; i < this.globalExtensionConfigurationData.length; i++) {
							var methods = this.globalExtensionConfigurationData[i].methods;
							if (methods != undefined) {
								for (var j = 0; j < methods.length; j++) {
									var extensions = methods[j].extensions;
									if (extensions != undefined) {
										for (var k = 0; k < extensions.length; k++) {
											
											var dataToBeSaved = {};
											dataToBeSaved.client = this.globalExtensionConfigurationData[i].client;
											dataToBeSaved.plant = this.globalExtensionConfigurationData[i].plant;
											dataToBeSaved.nodeID = this.globalExtensionConfigurationData[i].nodeID;
											dataToBeSaved.methodID = methods[j].methodID;
											dataToBeSaved.extensionID = extensions[k].extensionID;
											if (extensions[k].descriptions != undefined) {
												if (extensions[k].descriptions.length > 0) {
													dataToBeSaved.descriptions = extensions[k].descriptions;
												}
											}											
											dataToBeSaved.extensionType = extensions[k].extensionType;
											dataToBeSaved.activityId = extensions[k].activityId;
											dataToBeSaved.sequence = extensions[k].sequence;
											dataToBeSaved.enabled = extensions[k].enabled;
											dataToBeSaved.async = extensions[k].async;
											if (extensions[k].version != undefined) {
												dataToBeSaved.version = extensions[k].version;
											}
											
											switch(extensions[k].editMode) {
											case this.createMode:
												this.extensionConfigurationDataToBeCreated.push(dataToBeSaved);
												break;
											case this.modifyMode:
												this.extensionConfigurationDataToBeModified.push(dataToBeSaved);
												break;
											case this.deleteMode:
												this.extensionConfigurationDataToBeDeleted.push(dataToBeSaved);
												break;
											}
										}
									}
								}
							}
						}
					},
					
					saveExtensionConfigurationData : function() {
						var outputMessage = this.saveExtensionConfigurationDataInternal();
						
						//Refresh data for the current node
						this.createExtensionConfigurationData();
						
						return outputMessage;
					},
					
					saveExtensionConfigurationDataInternal : function() {
						this.prepareExtensionConfigurationDataBeforeSave();
						
						var saveResults = saveExtensionConfiguration(
												this.extensionConfigurationDataToBeCreated,
												this.extensionConfigurationDataToBeModified,
												this.extensionConfigurationDataToBeDeleted);
						
						var outputMessage;
						if (saveResults != undefined) {
						if (saveResults.outputCode != undefined) {
								if (saveResults.outputCode == 0) {
									outputMessage = oOEEBundle.getText("OEE_MESSAGE_SAVE_SUCCESS");
									this.globalExtensionConfigurationData = [];
								} else {
									outputMessage = saveResults.outputMessage;
							}
						}
					}

						this.extensionConfigurationDataToBeCreated = [];
						this.extensionConfigurationDataToBeModified = [];
						this.extensionConfigurationDataToBeDeleted = [];

						this.currentExtensionConfigurationData = [];
						this.currentExtensionDetailsData = {};
						this.clearExtensionDetailsTable();
						this.bindCurrentExtensionConfigurationDataToTable();
						this.isExtensionMethodSelected = true;
						this.enableExtensionDetailsScreen();

					return outputMessage;
					},
					
					triggerModifyForExtensionConfiguration : function(
							methodID,
							displayName,
							extensionDetails,
							editMode) {
						
						var dataFound = false;
						var modifiedData = {};										
						modifiedData.methodID = methodID;
						modifiedData.displayName = displayName;
						modifiedData.extensions = extensionDetails;
						modifiedData.editMode = editMode;
						for (var i = 0; i < this.globalExtensionConfigurationData.length; i++) {
							if (	this.globalExtensionConfigurationData[i]["client"] == this.currentSelectedClient &&
									this.globalExtensionConfigurationData[i]["plant"] == this.currentSelectedPlant &&
									this.globalExtensionConfigurationData[i]["nodeID"] == this.currentSelectedNode ) {
								
								var extensionMethodsData = this.globalExtensionConfigurationData[i]["methods"];								
								for (var j = 0; j < extensionMethodsData.length; j++) {
									if (	extensionMethodsData[j]["methodID"] == methodID) {
										dataFound = true;
										
										if (extensionMethodsData[j]["editMode"] != this.deleteMode && editMode == this.createMode) {											
											//Trying to create a duplicate key record. Do not allow
											createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
											return false;
											
										} else if (extensionMethodsData[j]["editMode"] == this.createMode && editMode == this.deleteMode) {
											//Deleting a created record. Remove the record from the list
											extensionMethodsData.splice(j, 1);
											
										} else if (extensionMethodsData[j]["editMode"] == this.createMode && editMode == this.modifyMode) {
											//Modifying a created record. Set the "edit mode" as "create"
											
											modifiedData.editMode = this.createMode;											
											extensionMethodsData.splice(j, 1, modifiedData);	
											
										} else if (extensionMethodsData[j]["editMode"] == this.deleteMode && editMode == this.createMode) {
											//Creating a deleted record. Set the "edit mode" as "modify".
											
											modifiedData.editMode = this.modifyMode;
											extensionMethodsData.splice(j, 1, modifiedData);
											
										} else {											
											modifiedData.editMode = editMode;
											extensionMethodsData.splice(j, 1, modifiedData);											
											if (editMode == this.deleteMode) {
												for (var i = 0; i < extensionDetails.length; i++) {
													this.triggerModifyForExtensionDetails(
															methodID,
															extensionDetails[i],
															this.deleteMode);
				}
											}
										}
										break;
									}									
								}
								
								if (dataFound == false) {
									extensionMethodsData.push(modifiedData);
									dataFound = true;
								}
							}							
						}

						if (dataFound == false) {
							var extensionMethodsData = [];
							extensionMethodsData.push(modifiedData);
							
							this.globalExtensionConfigurationData.push( {
								client : this.currentSelectedClient,
								plant : this.currentSelectedPlant,
								nodeID : this.currentSelectedNode,
								methods : extensionMethodsData
							});
							dataFound = true;
						}
						return true;
					},
					
					triggerModifyForExtensionDetails : function(
							methodID,
							extensionDetail,
							editMode) {
						var modifiedData = {};
						var dataFound = false;
						modifiedData.extensionID = extensionDetail.extensionID;
						modifiedData.extensionDescription = extensionDetail.extensionDescription;
						modifiedData.descriptions = extensionDetail.descriptions;
						modifiedData.extensionType = extensionDetail.extensionType;
						modifiedData.activityId = extensionDetail.activityId;
						modifiedData.activityDescription = extensionDetail.activityDescription;
						modifiedData.sequence = extensionDetail.sequence;
						modifiedData.enabled = extensionDetail.enabled;
						modifiedData.async = extensionDetail.async;
						if (extensionDetail.version != undefined) {
							modifiedData.version = extensionDetail.version;
						}
						
						for (var i = 0; i < this.globalExtensionConfigurationData.length; i++) {							
							if (	this.globalExtensionConfigurationData[i].client == this.currentSelectedClient &&
									this.globalExtensionConfigurationData[i].plant == this.currentSelectedPlant &&
									this.globalExtensionConfigurationData[i].nodeID == this.currentSelectedNode) {
								
								var methods = this.globalExtensionConfigurationData[i].methods;
								if (methods != undefined) {
									for (var j = 0; j < methods.length; j++) {
										if (methods[j].methodID == methodID) {											
											var extensions = methods[j].extensions;
											if (extensions != undefined) {												
												for (var k = 0; k < extensions.length; k++) {
													if (	extensions[k].extensionType == modifiedData.extensionType &&
															extensions[k].activityId == modifiedData.activityId) {
														
														dataFound = true;
														if (extensions[k].editMode != this.deleteMode && editMode == this.createMode) {											
															//Trying to create a duplicate key record. Do not allow
															createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
															return false;
															
														} else if (extensions[k].editMode == this.createMode && editMode == this.deleteMode) {
															//Deleting a created record. Remove the record from the list
															extensions.splice(k, 1);
															
														} else if (extensions[k].editMode == this.createMode && editMode == this.modifyMode) {
															//Modifying a created record. Set the "edit mode" as "create"
															
															modifiedData.editMode = this.createMode;											
															extensions.splice(k, 1, modifiedData);	
															
														} else if (extensions[k].editMode == this.deleteMode && editMode == this.createMode) {
															//Creating a deleted record. Set the "edit mode" as "modify".
															
															modifiedData.editMode = this.modifyMode;
															extensions.splice(k, 1, modifiedData);
															
														} else {
															
															modifiedData.editMode = editMode;
															extensions.splice(k, 1, modifiedData);
														}
														break;
												}
											}
											if (dataFound == false) {
												modifiedData.editMode = editMode;
												extensions.push(modifiedData);
												dataFound = true;
											}
										}	
									}
								}
							}	
						}
					}
						
					return true;
				},
				
				getCurrentLocationDetails : function() {
					var oController = this;
					var watchID;
					if (navigator.geolocation) {
						watchID = navigator.geolocation.watchPosition(showPosition);						
				    }
					
					function showPosition(position) {
						var latitudeTextField = oController.byId("latitudeTextField");
						if (latitudeTextField != undefined) {
							latitudeTextField.setValue(position.coords.latitude);
						}
						
						var longitudeTextField = oController.byId("longitudeTextField");
						if (longitudeTextField != undefined) {
							longitudeTextField.setValue(position.coords.longitude);
						}
						
						if (navigator.geolocation) {
							navigator.geolocation.clearWatch(watchID);
						}
					}
				},
				
				addCurrentLocationToTable : function() {
					var latitude;
					var longitude;
					var latitudeTextField = this.byId("latitudeTextField");
					if (latitudeTextField != undefined) {
						latitude = latitudeTextField.getValue();
					}
					
					var longitudeTextField = this.byId("longitudeTextField");
					if (longitudeTextField != undefined) {
						longitude = longitudeTextField.getValue();
					}
					
					if (	latitude != undefined &&
							longitude != undefined) {
						this.addNewEntryToGeolocationConfigurationTable(latitude, longitude);
					}
				},
				
				addNewEntryToGeolocationConfigurationTable : function(latitude, longitude) {
					var modifyCheck = this.triggerModifyForGeolocationConfiguration(
											latitude,
											longitude,
											undefined,
											this.createMode);
					if (modifyCheck == true) {
						if (this.currentGeolocationConfigurationData != undefined) {
							this.currentGeolocationConfigurationData.push({
								latitude : latitude,
								longitude : longitude
							});
						}
						this.bindCurrentGeolocationConfigurationDataToTable();
					}
				},
				
				prepareGeolocationConfigurationDataBeforeSave : function() {

					for ( var i = 0; i < this.globalGeolocationConfigurationData.length; i++) {
						var nodeCoordinatesData = this.globalGeolocationConfigurationData[i]["nodeCoordinatesData"];
						for ( var j = 0; j < nodeCoordinatesData.length; j++) {
							var editMode = nodeCoordinatesData[j]["editMode"];

							var dataToBeSaved = {};
							dataToBeSaved.client = this.globalGeolocationConfigurationData[i]["client"];
							dataToBeSaved.plant = this.globalGeolocationConfigurationData[i]["plant"];
							dataToBeSaved.nodeId = this.globalGeolocationConfigurationData[i]["nodeID"];
							dataToBeSaved.latitude = nodeCoordinatesData[j]["latitude"];
							dataToBeSaved.longitude = nodeCoordinatesData[j]["longitude"];

							if (nodeCoordinatesData[j]["version"] != undefined) {
								dataToBeSaved.version = nodeCoordinatesData[j]["version"];
							}

							switch (editMode) {
							case this.createMode:
								this.geolocationConfigurationDataToBeCreated.push(dataToBeSaved);
								break;
							case this.modifyMode:
								this.geolocationConfigurationDataToBeModified.push(dataToBeSaved);
								break;
							case this.deleteMode:
								this.geolocationConfigurationDataToBeDeleted.push(dataToBeSaved);
								break;
							}
						}
					}
				},

				saveGeolocationConfigurationData : function() {
					var outputMessage = this.saveGeolocationConfigurationDataInternal();

					// Refresh data for the current node
					this.createGeolocationConfigurationData();

					return outputMessage;
				},

				saveGeolocationConfigurationDataInternal : function() {
					this.prepareGeolocationConfigurationDataBeforeSave();
					var saveResults = saveNodeCoordinates(
							this.geolocationConfigurationDataToBeCreated,
							this.geolocationConfigurationDataToBeModified,
							this.geolocationConfigurationDataToBeDeleted);

					var outputMessage;
					if (saveResults.outputCode != undefined) {
						if (saveResults.outputCode == 0) {
							outputMessage = oOEEBundle.getText("OEE_MESSAGE_SAVE_SUCCESS"); 
							this.globalGeolocationConfigurationData = [];
						} else {
							if (saveResults.outputMessage != undefined) {
								outputMessage = saveResults.outputMessage;
							} else {
								outputMessage = oOEEBundle.getText("OEE_MESSAGE_SAVE_ERROR");
							}
						}
					}

					this.geolocationConfigurationDataToBeCreated = [];
					this.geolocationConfigurationDataToBeModified = [];
					this.geolocationConfigurationDataToBeDeleted = [];

					this.currentGeolocationConfigurationData = [];
					this.bindCurrentGeolocationConfigurationDataToTable();

					return outputMessage;
				},
				
				triggerModifyForGeolocationConfiguration : function(latitude, longitude, version, editMode) {

					var modifiedData = {};
					modifiedData.latitude = latitude;
					modifiedData.longitude = longitude;
					modifiedData.editMode = editMode;

					if (version != undefined) {
						modifiedData.version = version;
					}

					var dataFound = false;

					for ( var i = 0; i < this.globalGeolocationConfigurationData.length; i++) {
						if (	this.globalGeolocationConfigurationData[i]["client"] == this.currentSelectedClient &&
								this.globalGeolocationConfigurationData[i]["plant"] == this.currentSelectedPlant &&
								this.globalGeolocationConfigurationData[i]["nodeID"] == this.currentSelectedNode ) {

							var nodeCoordinatesData = this.globalGeolocationConfigurationData[i]["nodeCoordinatesData"];
							for ( var j = 0; j < nodeCoordinatesData.length; j++) {
								if (	nodeCoordinatesData[j]["latitude"] == modifiedData.latitude &&
										nodeCoordinatesData[j]["longitude"] == modifiedData.longitude) {
									dataFound = true;

									if (nodeCoordinatesData[j]["editMode"] != this.deleteMode && editMode == this.createMode) {											
										//Trying to create a duplicate key record. Do not allow
										createMessage(oOEEBundle.getText("OEE_MESSAGE_DUPLICATE_ERROR"), sap.ui.core.MessageType.Error);
										return false;

									} else if (nodeCoordinatesData[j]["editMode"] == this.createMode && editMode == this.deleteMode) {
										//Deleting a created record. Remove the record from the list
										nodeCoordinatesData.splice(j, 1);

									} else if (nodeCoordinatesData[j]["editMode"] == this.createMode && editMode == this.modifyMode) {
										//Modifying a created record. Set the "edit mode" as "create"
										modifiedData.editMode = this.createMode;
										nodeCoordinatesData.splice(j, 1, modifiedData);

									} else if (nodeCoordinatesData[j]["editMode"] == this.deleteMode && editMode == this.createMode) {
										//Creating a deleted record. Set the "edit mode" as "modify".
										modifiedData.version = nodeCoordinatesData[j]["version"];
										modifiedData.editMode = this.modifyMode;
										nodeCoordinatesData.splice(j, 1, modifiedData);

									} else {
										nodeCoordinatesData.splice(j, 1, modifiedData);											
									}
									break;
								}
							}

							if (dataFound == false) {
								nodeCoordinatesData.push(modifiedData);
								dataFound = true;
							}
						}
					}

					if (dataFound == false) {
						var nodeCoordinatesData = [];
						nodeCoordinatesData.push(modifiedData);

						this.globalGeolocationConfigurationData.push( {
							client : this.currentSelectedClient,
							plant : this.currentSelectedPlant,
							nodeID : this.currentSelectedNode,
							nodeCoordinatesData : nodeCoordinatesData
						});
						dataFound = true;
					}
					return true;
				}

				/**
				 * Similar to onAfterRendering, but this hook is invoked before
				 * the controller's View is re-rendered (NOT before the first
				 * rendering! onInit() is used for that one!).
				 */
				// onBeforeRendering: function() {
				//
				// },
				/**
				 * Called when the View has been rendered (so its HTML is part
				 * of the document). Post-rendering manipulations of the HTML
				 * could be done here. This hook is the same one that SAPUI5
				 * controls get after being rendered.
				 */
				// onAfterRendering: function() {
				//
				// },
				/**
				 * Called when the Controller is destroyed. Use this one to free
				 * resources and finalize activities.
				 */
				// onExit: function() {
				//
				// }
				});