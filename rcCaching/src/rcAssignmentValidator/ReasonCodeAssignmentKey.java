package com.sap.xapps.oee.dto.reasoncodeservices;

public class ReasonCodeAssignmentKey {
    private String client;
    private String plant;
    private String nodeId;
    private String dcElement;

    public ReasonCodeAssignmentKey(String client, String plant, String nodeId, String dcElement) {
          this.client = client;
          this.plant = plant;
          this.nodeId = nodeId;
          this.dcElement = dcElement;
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

    @Override
    public int hashCode() {
          final int prime = 31;
          int result = 17;
          result = prime * result + ((client == null) ? 0 : client.hashCode());
          result = prime * result + ((dcElement == null) ? 0 : dcElement.hashCode());
          result = prime * result + ((nodeId == null) ? 0 : nodeId.hashCode());
          result = prime * result + ((plant == null) ? 0 : plant.hashCode());
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
          ReasonCodeAssignmentKey other = (ReasonCodeAssignmentKey) obj;
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

}
