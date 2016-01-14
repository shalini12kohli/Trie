package com.sap.xapps.oee.dto.reasoncodeservices;

import java.io.Serializable;

import com.sap.xapps.oee.dto.datacollectionelementservices.IODataCollectionElement;

public class RCConfigOutput implements Serializable {

	private static final long serialVersionUID = 1L;

	private String client;
	private String plant;
	private String nodeId;
	private IODataCollectionElement dcElement;
	private String reasonCode1;
	private String reasonCode2;
	private String reasonCode3;
	private IOReasonCode reasonCode4;
	private IOReasonCode reasonCode5;
	private IOReasonCode reasonCode6;
	private IOReasonCode reasonCode7;
	private IOReasonCode reasonCode8;
	private IOReasonCode reasonCode9;
	private IOReasonCode reasonCode10;
	private long version;

	private int rcphDCElemAssocId;

	public RCConfigOutput(){
		
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
	
	public IODataCollectionElement getDcElement() {
		return dcElement;
	}

	public void setDcElement(IODataCollectionElement dcElement) {
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

	public IOReasonCode getReasonCode4() {
		return reasonCode4;
	}

	public void setReasonCode4(IOReasonCode reasonCode4) {
		this.reasonCode4 = reasonCode4;
	}

	public IOReasonCode getReasonCode5() {
		return reasonCode5;
	}

	public void setReasonCode5(IOReasonCode reasonCode5) {
		this.reasonCode5 = reasonCode5;
	}

	public IOReasonCode getReasonCode6() {
		return reasonCode6;
	}

	public void setReasonCode6(IOReasonCode reasonCode6) {
		this.reasonCode6 = reasonCode6;
	}

	public IOReasonCode getReasonCode7() {
		return reasonCode7;
	}

	public void setReasonCode7(IOReasonCode reasonCode7) {
		this.reasonCode7 = reasonCode7;
	}

	public IOReasonCode getReasonCode8() {
		return reasonCode8;
	}

	public void setReasonCode8(IOReasonCode reasonCode8) {
		this.reasonCode8 = reasonCode8;
	}
	
	public IOReasonCode getReasonCode9() {
		return reasonCode9;
	}
	
	public void setReasonCode9(IOReasonCode reasonCode9) {
		this.reasonCode9 = reasonCode9;
	}
	
	public IOReasonCode getReasonCode10() {
		return reasonCode10;
	}
	
	public void setReasonCode10(IOReasonCode reasonCode10) {
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

