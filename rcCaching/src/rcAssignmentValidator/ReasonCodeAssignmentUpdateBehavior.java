package com.sap.xapps.oee.dto.reasoncodeservices;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.sap.xapps.logging.MPMLogger;
import com.sap.xapps.oee.dto.reasoncode.ReasonCodePlantHierarchyAssociation;
import com.sap.xapps.oee.dto.reasoncodeservices.Tree;
import com.sap.xapps.oee.dto.reasoncodeservices.ReasonCodeAssignment;
import com.sap.xapps.oee.dto.reasoncodeservices.ReasonCodeAssignmentKey;
import com.sap.xapps.oee.ejb.common.ErrorMessageConstants;
import com.sap.xapps.oee.ejb.exception.OEEBusinessException;
import com.sap.xapps.oee.ejb.exception.OEELocalizedException;
import com.sap.xapps.oee.ejb.reasoncodeservices.ReasonCodeServices;

public class ReasonCodeAssignmentUpdateBehavior {

	private enum RCAssignmentUpdateMode {
        CREATE_AND_UPDATE, OVERWRITE_ALL;
  }
	private static final MPMLogger LOG = new MPMLogger(ReasonCodeServices.class);

  private RCUpdate rcUpdate;
  private RCAssignmentUpdateMode updateMode;
  
  public static void validateCreateAndDeleteRCAssignment(ReasonCodeServices reasonCodeServices, List<ReasonCodePlantHierarchyAssociation> toBeCreated,
             List<ReasonCodePlantHierarchyAssociation> toBeDeleted) throws Exception {
        ReasonCodeAssignmentUpdateBehavior rcAssignmentUpdateBehavior = new ReasonCodeAssignmentUpdateBehavior(
                  toBeCreated, toBeDeleted, RCAssignmentUpdateMode.CREATE_AND_UPDATE);
        rcAssignmentUpdateBehavior.updateReasonCodes(reasonCodeServices);
  }

  public static void validateOverwriteRCAssignment(ReasonCodeServices reasonCodeServices, List<ReasonCodePlantHierarchyAssociation> toBeCreated) throws Exception {
        ReasonCodeAssignmentUpdateBehavior rcAssignmentUpdateBehavior = new ReasonCodeAssignmentUpdateBehavior(
                  toBeCreated, null, RCAssignmentUpdateMode.OVERWRITE_ALL);
        rcAssignmentUpdateBehavior.updateReasonCodes(reasonCodeServices);
  }

  private ReasonCodeAssignmentUpdateBehavior(List<ReasonCodePlantHierarchyAssociation> toBeCreated,
             List<ReasonCodePlantHierarchyAssociation> toBeDeleted, RCAssignmentUpdateMode updateMode) {
        rcUpdate = this.new RCUpdate(toBeCreated, toBeDeleted);
        this.updateMode = updateMode;
  }

  private void updateReasonCodes(ReasonCodeServices reasonCodeServices) throws Exception {
        Map<ReasonCodeAssignmentKey, List<ReasonCodePlantHierarchyAssociation>> consolidatedRCAssignments = consolidateReasonCodesByKey(rcUpdate.toBeCreated);
        if (consolidatedRCAssignments.size() != 0) {
	       List<ReasonCodePlantHierarchyAssociation> existingRCAssignments = this.getRCAssignments(consolidatedRCAssignments.keySet(), reasonCodeServices);
	       List<ReasonCodePlantHierarchyAssociation> existingRCAssignmentsAfterDeletion = handleDeletedRCAssignments(existingRCAssignments, rcUpdate.toBeDeleted);
	       existingRCAssignmentsAfterDeletion.addAll(rcUpdate.toBeCreated);
	       consolidatedRCAssignments = consolidateReasonCodesByKey(existingRCAssignmentsAfterDeletion);
	       validateReasonCodes(consolidatedRCAssignments);
        }
  }

  private void validateReasonCodes(Map<ReasonCodeAssignmentKey, List<ReasonCodePlantHierarchyAssociation>> consolidatedRCAssignments) {
	for (ReasonCodeAssignmentKey key : consolidatedRCAssignments.keySet()) {
		ReasonCodeTreeImpl rcImpl = ReasonCodeTreeImpl.getReasonCodeTreeImpl(key.getClient(), key.getPlant(), 
				key.getNodeId(), key.getDcElement());
		for (ReasonCodePlantHierarchyAssociation reasonCode : consolidatedRCAssignments.get(key)) {
			rcImpl.addReasonCodeToTree(reasonCode);
		}
	}
}

private List<ReasonCodePlantHierarchyAssociation> handleDeletedRCAssignments(
			List<ReasonCodePlantHierarchyAssociation> existingRCAssignments, List<ReasonCodePlantHierarchyAssociation> toBeDeleted) {
	
	    List<ReasonCodePlantHierarchyAssociation> remainingRCAssignments = new ArrayList<ReasonCodePlantHierarchyAssociation>();
	    /** Deleting Reason Codes from UI, delete toBeDeleted list from existing Reason Codes list and return remaining Reason Codes list **/
        if (RCAssignmentUpdateMode.CREATE_AND_UPDATE.equals(updateMode)) {
        	 remainingRCAssignments.addAll(existingRCAssignments);
        	 if(toBeDeleted != null){
        		 remainingRCAssignments.removeAll(toBeDeleted); // Delete "toBeDeleted" records from "existingRCAssignments"
             }
        }
        /** In case of Excel Upload, existing reason code assignment will be an empty list **/
        return remainingRCAssignments;
  }

  private Map<ReasonCodeAssignmentKey, List<ReasonCodePlantHierarchyAssociation>> consolidateReasonCodesByKey(List<ReasonCodePlantHierarchyAssociation> toBeCreated ) {
      
	  Map<ReasonCodeAssignmentKey, List<ReasonCodePlantHierarchyAssociation>> valueMap = new HashMap<ReasonCodeAssignmentKey, List<ReasonCodePlantHierarchyAssociation>>();
      if (toBeCreated != null)
           for (ReasonCodePlantHierarchyAssociation value : toBeCreated) {
                ReasonCodeAssignmentKey key = new ReasonCodeAssignmentKey(value.getClient(), value.getPlant(), value.getNodeId(), value.getDcElement());
                List<ReasonCodePlantHierarchyAssociation> valuesForKey = valueMap.get(key);
                if (valuesForKey == null) {
                      valuesForKey = new ArrayList<ReasonCodePlantHierarchyAssociation>();
                      valueMap.put(key, valuesForKey);
                }
                valuesForKey.add(value);
           }
      return valueMap;
  }

  private List<ReasonCodePlantHierarchyAssociation> getRCAssignments(Set<ReasonCodeAssignmentKey> rcAssignmentKeySet, ReasonCodeServices reasonCodeServices) throws Exception {
	  try {
		  return reasonCodeServices.getRCConfig(rcAssignmentKeySet);
	  }catch (Exception e) {
			if (e instanceof OEEBusinessException){
				LOG.error( e.getMessage());
				throw e;
			}else{
				OEELocalizedException exception = new OEELocalizedException(
						ErrorMessageConstants.GET_REASON_CODE_CONFIG_FAILED);
				LOG.error( exception + e.getMessage());
				
				throw exception;
			}
    	}
  }

  private class RCUpdate {
        private List<ReasonCodePlantHierarchyAssociation> toBeCreated;
        private List<ReasonCodePlantHierarchyAssociation> toBeDeleted;

        private RCUpdate(List<ReasonCodePlantHierarchyAssociation> toBeCreated, List<ReasonCodePlantHierarchyAssociation> toBeDeleted) {
             this.toBeCreated = toBeCreated;
             this.toBeDeleted = toBeDeleted;
        }
  }

}

