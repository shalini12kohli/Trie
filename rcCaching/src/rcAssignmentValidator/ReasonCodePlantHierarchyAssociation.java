package com.sap.xapps.oee.dto.reasoncode;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import javax.persistence.Version;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


@XmlRootElement(name = "ReasonCodePlantHierarchyAssociation")
@XmlType(propOrder = { "id", "client", "plant", "nodeId", "dcElement", "reasonCode1", "reasonCode2", "reasonCode3",  
		"reasonCode4", "reasonCode5", "reasonCode6", "reasonCode7", "reasonCode8", "reasonCode9", "reasonCode10"})
@Entity
@Table(name = "MPM_RC_PH_DCELEM")
@TableGenerator(name="RCPHDCElemAssocTab", table="MPM_SEQUENCES",
        pkColumnName="GEN_KEY", valueColumnName="GEN_VALUE", 
        pkColumnValue="RC_GEN", allocationSize = 150)
public class ReasonCodePlantHierarchyAssociation implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Column( name = "ID" )
	@Id
	@GeneratedValue(strategy = GenerationType.TABLE, generator="RCPHDCElemAssocTab")
	private int rcphDCElemAssocId;
	
	@Column( name = "CLIENT" )
	private String client;

	@Column( name = "PLANT" )
	private String plant;
	
	@Column( name = "NODE_ID" )
	private String nodeId;

	@Column( name = "DC_ELEMENT" )
	private String dcElement;
	
	@Column( name = "REASON_CODE1" )
	private String reasonCode1;
	
	@Column( name = "REASON_CODE2" )
	private String reasonCode2;
	
	@Column( name = "REASON_CODE3" )
	private String reasonCode3;
	
	@Column( name = "REASON_CODE4" )
	private String reasonCode4;
	
	@Column( name = "REASON_CODE5" )
	private String reasonCode5;
	
	@Column( name = "REASON_CODE6" )
	private String reasonCode6;
	
	@Column( name = "REASON_CODE7" )
	private String reasonCode7;
	
	@Column( name = "REASON_CODE8")
	private String reasonCode8;
	
	@Column( name = "REASON_CODE9" )
	private String reasonCode9;

	@Column( name = "REASON_CODE10" )
	private String reasonCode10;
	
	@Version
	private long version;
	
	public String getClient() {
		return client;
	}

	public void setClient(String client) {
		if("".equalsIgnoreCase(client))
			this.client = null;
		else
			this.client = client;
	}

	public String getPlant() {
		return plant;
	}

	public void setPlant(String plant) {
		if("".equalsIgnoreCase(plant))
			this.plant = null;
		else
			this.plant = plant;
	}

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		if("".equalsIgnoreCase(nodeId))
			this.nodeId = null;
		else
			this.nodeId = nodeId;
	}

	public String getDcElement() {
		return dcElement;
	}

	public void setDcElement(String dcElement) {
		if("".equalsIgnoreCase(dcElement))
			this.dcElement = null;
		else
			this.dcElement = dcElement;
	}

	public String getReasonCode1() {
		return reasonCode1;
	}

	public void setReasonCode1(String reasonCode1) {
		if("".equalsIgnoreCase(reasonCode1))
			this.reasonCode1 = null;
		else
			this.reasonCode1 = reasonCode1;
	}

	public String getReasonCode2() {
		return reasonCode2;
	}

	public void setReasonCode2(String reasonCode2) {
		if("".equalsIgnoreCase(reasonCode2))
			this.reasonCode2 = null;
		else
			this.reasonCode2 = reasonCode2;
	}

	public String getReasonCode3() {
		return reasonCode3;
	}

	public void setReasonCode3(String reasonCode3) {
		if("".equalsIgnoreCase(reasonCode3))
			this.reasonCode3 = null;
		else
			this.reasonCode3 = reasonCode3;
	}

	public String getReasonCode4() {
		return reasonCode4;
	}

	public void setReasonCode4(String reasonCode4) {
		if("".equalsIgnoreCase(reasonCode4))
			this.reasonCode4 = null;
		else
			this.reasonCode4 = reasonCode4;
	}

	public String getReasonCode5() {
		return reasonCode5;
	}

	public void setReasonCode5(String reasonCode5) {
		if("".equalsIgnoreCase(reasonCode5))
			this.reasonCode5 = null;
		else
			this.reasonCode5 = reasonCode5;
	}

	public String getReasonCode6() {
		return reasonCode6;
	}

	public void setReasonCode6(String reasonCode6) {
		if("".equalsIgnoreCase(reasonCode6))
			this.reasonCode6 = null;
		else
			this.reasonCode6 = reasonCode6;
	}

	public String getReasonCode7() {
		return reasonCode7;
	}

	public void setReasonCode7(String reasonCode7) {
		if("".equalsIgnoreCase(reasonCode7))
			this.reasonCode7 = null;
		else
			this.reasonCode7 = reasonCode7;
	}

	public String getReasonCode8() {
		return reasonCode8;
	}

	public void setReasonCode8(String reasonCode8) {
		if("".equalsIgnoreCase(reasonCode8))
			this.reasonCode8 = null;
		else
			this.reasonCode8 = reasonCode8;
	}
	
	public String getReasonCode9() {
		return reasonCode9;
	}

	public void setReasonCode9(String reasonCode9) {
		if ("".equalsIgnoreCase(reasonCode9))
			this.reasonCode9 = null;
		else
			this.reasonCode9 = reasonCode9;
	}
	
	public String getReasonCode10() {
		return reasonCode10;
	}

	public void setReasonCode10(String reasonCode10) {
		if ("".equalsIgnoreCase(reasonCode10))
			this.reasonCode10 = null;
		else
			this.reasonCode10 = reasonCode10;
	}
	
	public long getVersion() {
		return version;
	}

	public void setVersion(long version) {
		this.version = version;
	}
	
	public void setRcphDCElemAssocId(int rcphDCElemAssocId) {
		this.rcphDCElemAssocId = rcphDCElemAssocId;
	}
	
	public int getRcphDCElemAssocId() {
		return rcphDCElemAssocId;
	}
	
	/*
	 * Though ReasonCodePlantHierarchy entity is defined by an "Id" it is important that the same dcElement should not be mapped
	 * with the same plant hierarchy node and the reason code more than once. Therefore, this method checks whether a
	 * ReasonCodePlantHierarchy is equal to another, based on the business logic.
	 */
	public boolean equalTo(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof ReasonCodePlantHierarchyAssociation)) {
			return false;
		}
		ReasonCodePlantHierarchyAssociation other = (ReasonCodePlantHierarchyAssociation) obj;
		if (client == null) {
			if (other.client != null) {
				return false;
			}
		} else if (!client.equals(other.client)) {
			return false;
		}
		
		if (nodeId == null) {
			if (other.nodeId != null) {
				return false;
			}
		} else if (!nodeId.equals(other.nodeId)) {
			return false;
		}
		if (plant == null) {
			if (other.plant != null) {
				return false;
			}
		} else if (!plant.equals(other.plant)) {
			return false;
		}
		if (dcElement == null) {
			if (other.dcElement != null) {
				return false;
			}
		} else if (!dcElement.equals(other.dcElement)) {
			return false;
		}
		if (reasonCode1 == null) {
			if (other.reasonCode1 != null) {
				return false;
			}
		} else if (!reasonCode1.equals(other.reasonCode1)) {
			return false;
		}
		if (reasonCode10 == null) {
			if (other.reasonCode10 != null) {
				return false;
			}
		} else if (!reasonCode10.equals(other.reasonCode10)) {
			return false;
		}
		if (reasonCode2 == null) {
			if (other.reasonCode2 != null) {
				return false;
			}
		} else if (!reasonCode2.equals(other.reasonCode2)) {
			return false;
		}
		if (reasonCode3 == null) {
			if (other.reasonCode3 != null) {
				return false;
			}
		} else if (!reasonCode3.equals(other.reasonCode3)) {
			return false;
		}
		if (reasonCode4 == null) {
			if (other.reasonCode4 != null) {
				return false;
			}
		} else if (!reasonCode4.equals(other.reasonCode4)) {
			return false;
		}
		if (reasonCode5 == null) {
			if (other.reasonCode5 != null) {
				return false;
			}
		} else if (!reasonCode5.equals(other.reasonCode5)) {
			return false;
		}
		if (reasonCode6 == null) {
			if (other.reasonCode6 != null) {
				return false;
			}
		} else if (!reasonCode6.equals(other.reasonCode6)) {
			return false;
		}
		if (reasonCode7 == null) {
			if (other.reasonCode7 != null) {
				return false;
			}
		} else if (!reasonCode7.equals(other.reasonCode7)) {
			return false;
		}
		if (reasonCode8 == null) {
			if (other.reasonCode8 != null) {
				return false;
			}
		} else if (!reasonCode8.equals(other.reasonCode8)) {
			return false;
		}
		if (reasonCode9 == null) {
			if (other.reasonCode9 != null) {
				return false;
			}
		} else if (!reasonCode9.equals(other.reasonCode9)) {
			return false;
		}
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + rcphDCElemAssocId;
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
		ReasonCodePlantHierarchyAssociation other = (ReasonCodePlantHierarchyAssociation) obj;
		if (rcphDCElemAssocId != other.rcphDCElemAssocId)
			return false;
		return true;
	}
	
}