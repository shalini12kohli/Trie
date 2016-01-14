package com.sap.xapps.oee.ejb.reasoncode;

import java.util.List;
import java.util.Set;

import javax.ejb.Local;

import com.sap.xapps.oee.dto.reasoncode.ReasonCode;
import com.sap.xapps.oee.dto.reasoncode.ReasonCodePK;
import com.sap.xapps.oee.dto.reasoncode.ReasonCodePlantHierarchyAssociation;
import com.sap.xapps.oee.dto.reasoncodeservices.ReasonCodeAssignmentKey;
import com.sap.xapps.oee.ejb.exception.OEETechnicalException;

@Local
public interface IReasonCodeCrudBeanLocal {

	public List<ReasonCodePlantHierarchyAssociation> getAllReasonCodeConfiguration(String client, String plant, String nodeId) throws OEETechnicalException;
	
	public boolean saveReasonCodeConfiguration(List<ReasonCodePlantHierarchyAssociation> dataToBeCreated, List<ReasonCodePlantHierarchyAssociation> dataToBeModified,
				List<ReasonCodePlantHierarchyAssociation> dataToBeRemoved) throws OEETechnicalException;
	 
	public List<ReasonCode> getReasonCodeForDCElement(String client, String plant, String dcElement) throws OEETechnicalException;
	
	public List<ReasonCodePlantHierarchyAssociation>  getAllRCConfigForClientPlant(String client, String plant) throws OEETechnicalException;
	
	public boolean deleteRCConfigForClientPlant(String client, String plant) throws OEETechnicalException;
	
	public List<ReasonCodePlantHierarchyAssociation> getReasonCodeForNodeId(
			ReasonCodePlantHierarchyAssociation rcphAssociation)
			throws OEETechnicalException;
	
	public ReasonCode getReasonCodeDetails(ReasonCodePK pk) throws OEETechnicalException;
	
	public List<ReasonCode> getReasonCodeForLevel(ReasonCodePK pk, int level) throws OEETechnicalException;

	public List<ReasonCodePlantHierarchyAssociation> getAllRCConfigForValidation(Set<ReasonCodeAssignmentKey> set) throws OEETechnicalException;
	
}

