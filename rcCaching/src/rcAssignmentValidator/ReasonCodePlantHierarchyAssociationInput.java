package com.sap.xapps.oee.dto.reasoncodeservices;

import java.io.Serializable;

public class ReasonCodePlantHierarchyAssociationInput implements Serializable {

	private static final long serialVersionUID = 1L;

	private String client;
	private String plant;
	private String nodeId;
	private String dcElement;
	private String reasonCode1;
	private String reasonCode2;
	private String reasonCode3;
	private String reasonCode4;
	private String reasonCode5;
	private String reasonCode6;
	private String reasonCode7;
	private String reasonCode8;
	private String reasonCode9;
	private String reasonCode10;
	private long version;
	private int rcphDCElemAssocId;

	public ReasonCodePlantHierarchyAssociationInput(){
		
	}
	
	public ReasonCodePlantHierarchyAssociationInput(ReasonCodeDCElementWorkUnitHierarchyInput input){
		client = input.getClient();
		plant = input.getPlant();
		reasonCode1 = input.getReasonCode1();
		reasonCode2 = input.getReasonCode2();
		reasonCode3 = input.getReasonCode3();
		reasonCode4 = input.getReasonCode4();
		reasonCode5 = input.getReasonCode5();
		reasonCode6 = input.getReasonCode6();
		reasonCode7 = input.getReasonCode7();
		reasonCode8 = input.getReasonCode8();
		reasonCode9 = input.getReasonCode9();
		reasonCode10 = input.getReasonCode10();
		
	}
	
	public String getClient() {
		return client;
	}

	public void setClient(String client) {
		this.client = client;
	}
	
	public String getPlant() {
		return plant;
	}
	
	public void setPlant(String plant) {
		this.plant = plant;
	}
	
	public String getNodeId() {
		return nodeId;
	}
	
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
	
	public String getDcElement() {
		return dcElement;
	}
	
	public void setDcElement(String dcElement) {
		this.dcElement = dcElement;
	}
	
	public String getReasonCode1() {
		return reasonCode1;
	}

	public void setReasonCode1(String reasonCode1) {
		this.reasonCode1 = reasonCode1;
	}

	public String getReasonCode2() {
		return reasonCode2;
	}

	public void setReasonCode2(String reasonCode2) {
		this.reasonCode2 = reasonCode2;
	}

	public String getReasonCode3() {
		return reasonCode3;
	}

	public void setReasonCode3(String reasonCode3) {
		this.reasonCode3 = reasonCode3;
	}

	public String getReasonCode4() {
		return reasonCode4;
	}

	public void setReasonCode4(String reasonCode4) {
		this.reasonCode4 = reasonCode4;
	}

	public String getReasonCode5() {
		return reasonCode5;
	}

	public void setReasonCode5(String reasonCode5) {
		this.reasonCode5 = reasonCode5;
	}

	public String getReasonCode6() {
		return reasonCode6;
	}

	public void setReasonCode6(String reasonCode6) {
		this.reasonCode6 = reasonCode6;
	}

	public String getReasonCode7() {
		return reasonCode7;
	}

	public void setReasonCode7(String reasonCode7) {
		this.reasonCode7 = reasonCode7;
	}

	public String getReasonCode8() {
		return reasonCode8;
	}

	public void setReasonCode8(String reasonCode8) {
		this.reasonCode8 = reasonCode8;
	}
	
	public String getReasonCode9() {
		return reasonCode9;
	}
	
	public void setReasonCode9(String reasonCode9) {
		this.reasonCode9 = reasonCode9;
	}
	
	public String getReasonCode10() {
		return reasonCode10;
	}
	
	public void setReasonCode10(String reasonCode10) {
		this.reasonCode10 = reasonCode10;
	}
	
	public long getVersion() {
		return version;
	}
	
	public void setVersion(long version) {
		this.version = version;
	}

	public int getRcphDCElemAssocId() {
		return rcphDCElemAssocId;
	}
	
	public void setRcphDCElemAssocId(int rcphDCElemAssocId) {
		this.rcphDCElemAssocId = rcphDCElemAssocId;
	}
}

