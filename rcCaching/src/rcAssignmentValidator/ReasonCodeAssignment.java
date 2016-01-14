package com.sap.xapps.oee.dto.reasoncodeservices;

import com.sap.xapps.oee.dto.reasoncode.ReasonCodePlantHierarchyAssociation;
import com.sap.xapps.oee.ejb.datacollectionservices.ReasonCodeWrapper;

public class ReasonCodeAssignment {
	
	private String client;
	private String plant;
	private String nodeId;
	private String dcElement;
	private ReasonCodeWrapper reasonCode;

	public ReasonCodeAssignment(String client, String plant, String nodeId, String dcElement,ReasonCodeWrapper reasonCode) {
		this.client = client;
		this.plant = plant;
		this.nodeId = nodeId;
		this.dcElement = dcElement;
		this.reasonCode = reasonCode;
	}
	
	public ReasonCodeAssignment(String client, String plant, String nodeId, String dcElement,String reasonCode1, String reasonCode2,
			String reasonCode3, String reasonCode4, String reasonCode5, String reasonCode6, String reasonCode7, String reasonCode8,
			String reasonCode9, String reasonCode10) {
		this.client = client;
		this.plant = plant;
		this.nodeId = nodeId;
		this.dcElement = dcElement;
		this.reasonCode = new ReasonCodeWrapper(reasonCode1, reasonCode2, reasonCode3, reasonCode4, reasonCode5, reasonCode6, reasonCode7, reasonCode8, reasonCode9, reasonCode10);
	}
	
	public ReasonCodeAssignment getParentReasonCode(){
		ReasonCodeAssignment parentReasonCode = null;
		/*ReasonCodeWrapper parentRC = new ReasonCodeWrapper(this.getRc1(), this.getRc2(), this.getRc3(), this.getRc4(), this.getRc5(), this.getRc6(), this.getRc7(), this.getRc8(), this.getRc9(), this.getRc10());	
		ReasonCodeWrapper parentRC1 = parentRC.getParentReasonCode();
		if(parentRC1 == null){
			ReasonCodeAssignment parentReasonCodes = new ReasonCodeAssignment(this.getClient(), this.getPlant(), this.getNodeId(), this.getDcElement(),null,null,null,null,null,null,null,null,null,null);
			return parentReasonCodes;
		} else {
		ReasonCodeAssignment parentReasonCodes = new ReasonCodeAssignment(this.getClient(), this.getPlant(), this.getNodeId(), this.getDcElement(), parentRC1.getRc1(),parentRC1.getRc2(),
				parentRC1.getRc3(),parentRC1.getRc4(),parentRC1.getRc5(),parentRC1.getRc6(),parentRC1.getRc7(),parentRC1.getRc8(),parentRC1.getRc9(),parentRC1.getRc10());
		} */	
		if (reasonCode.getParentReasonCode() != null) {
			parentReasonCode =  new ReasonCodeAssignment(this.client, this.plant, this.nodeId, this.dcElement, reasonCode.getParentReasonCode());
		}
		return parentReasonCode;
	}

	public String getClient() {
		return client;
	}

	public String getPlant() {
		return plant;
	}
	
	public String getNodeId(){
		return nodeId;
	}
	
	public String getDcElement(){
		return dcElement;
	}

	public ReasonCodeWrapper getReasonCode() {
		return reasonCode;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((client == null) ? 0 : client.hashCode());
		result = prime * result
				+ ((dcElement == null) ? 0 : dcElement.hashCode());
		result = prime * result + ((nodeId == null) ? 0 : nodeId.hashCode());
		result = prime * result + ((plant == null) ? 0 : plant.hashCode());
		result = prime * result + ((reasonCode == null) ? 0 : reasonCode.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ReasonCodeAssignment other = (ReasonCodeAssignment) obj;
		if (client == null) {
			if (other.client != null)
				return false;
		} else if (!client.equals(other.client))
			return false;
		if (dcElement == null) {
			if (other.dcElement != null)
				return false;
		} else if (!dcElement.equals(other.dcElement))
			return false;
		if (reasonCode == null) {
			if (other.reasonCode != null)
				return false;
		} else if (!reasonCode.equals(other.reasonCode))
			return false;
		if (nodeId == null) {
			if (other.nodeId != null)
				return false;
		} else if (!nodeId.equals(other.nodeId))
			return false;
		if (plant == null) {
			if (other.plant != null)
				return false;
		} else if (!plant.equals(other.plant))
			return false;
		return true;
	}
	public ReasonCodeAssignment(ReasonCodePlantHierarchyAssociation reasoncode){
		this(reasoncode.getClient(), reasoncode.getPlant(), reasoncode.getNodeId(),reasoncode.getDcElement(),reasoncode.getReasonCode1(),reasoncode.getReasonCode2(),reasoncode.getReasonCode3(),reasoncode.getReasonCode4(),reasoncode.getReasonCode5(),
	    		reasoncode.getReasonCode6(),reasoncode.getReasonCode7(),reasoncode.getReasonCode8(),reasoncode.getReasonCode9(),reasoncode.getReasonCode10());
	}

}
