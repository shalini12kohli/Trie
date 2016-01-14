package com.sap.xapps.oee.dto.reasoncodeservices;

import java.io.Serializable;
import java.util.List;

public class SaveReasonCodeConfigurationInput implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String client;
	private List<ReasonCodePlantHierarchyAssociationInput> created;
	private List<ReasonCodePlantHierarchyAssociationInput> modified;
	private List<ReasonCodePlantHierarchyAssociationInput> deleted;
	private boolean isExcelUpload;
	
	public String getClient() {
		return client;
	}
	
	public void setClient(String client) {
		this.client = client;
	}
	
	public List<ReasonCodePlantHierarchyAssociationInput> getCreated() {
		return created;
	}

	public void setCreated(List<ReasonCodePlantHierarchyAssociationInput> created) {
		this.created = created;
	}

	public List<ReasonCodePlantHierarchyAssociationInput> getModified() {
		return modified;
	}

	public void setModified(List<ReasonCodePlantHierarchyAssociationInput> modified) {
		this.modified = modified;
	}

	public List<ReasonCodePlantHierarchyAssociationInput> getDeleted() {
		return deleted;
	}

	public void setDeleted(List<ReasonCodePlantHierarchyAssociationInput> deleted) {
		this.deleted = deleted;
	}

	public boolean isExcelUpload() {
		return isExcelUpload;
	}
	
	public void setExcelUpload(boolean isExcelUpload) {
		this.isExcelUpload = isExcelUpload;
	}
}

