package com.sap.xapps.oee.ejb.reasoncode;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateless;
import javax.interceptor.Interceptors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.sap.xapps.logging.MPMLogger;
import com.sap.xapps.mpm.interceptors.LoggingInterceptor;
import com.sap.xapps.oee.dto.reasoncode.ReasonCode;
import com.sap.xapps.oee.dto.reasoncode.ReasonCodePK;
import com.sap.xapps.oee.dto.reasoncode.ReasonCodePlantHierarchyAssociation;
import com.sap.xapps.oee.dto.reasoncodeservices.ReasonCodeAssignmentKey;
import com.sap.xapps.oee.ejb.common.OEEConstants;
import com.sap.xapps.oee.ejb.exception.OEETechnicalException;

/**
 * Session Bean implementation class ReasonCodeCrudBean
 */
@Stateless
@Interceptors( { LoggingInterceptor.class})
public class ReasonCodeCrudBean implements IReasonCodeCrudBeanRemote, IReasonCodeCrudBeanLocal {
	
	private static final MPMLogger LOG = new MPMLogger(ReasonCodeCrudBean.class);
	
	@PersistenceContext(unitName = "IDOC_Process")
	private EntityManager em;
   
	/**
     * Default constructor. 
     */
    public ReasonCodeCrudBean() {
    }
       
    @SuppressWarnings("unchecked")
	public List<ReasonCodePlantHierarchyAssociation> getAllReasonCodeConfiguration(String client, String plant, String nodeId) throws OEETechnicalException {
    	List<ReasonCodePlantHierarchyAssociation> rcphAssociationList = null;
    	try {
    		Query query = em.createQuery("SELECT rcphAssociation FROM ReasonCodePlantHierarchyAssociation rcphAssociation " +
    				"where rcphAssociation.client = :client and rcphAssociation.plant = :plant and rcphAssociation.nodeId = :nodeId ");
    		query.setParameter("client", client);
    		query.setParameter("plant", plant);
    		query.setParameter("nodeId", nodeId);
    		rcphAssociationList = query.getResultList();
		} catch (Exception e) {
    		OEETechnicalException exception = new OEETechnicalException(
					"Get Reason Code Configuration failed", e);
			LOG.error(e);
			throw exception;
    	}
		return rcphAssociationList;
    }
    
    public boolean saveReasonCodeConfiguration(List<ReasonCodePlantHierarchyAssociation> dataToBeCreated, List<ReasonCodePlantHierarchyAssociation> dataToBeModified,
			List<ReasonCodePlantHierarchyAssociation> dataToBeRemoved) throws OEETechnicalException {

    	boolean status = false;
		if (dataToBeRemoved != null) {
			status = removeData(dataToBeRemoved);
		}

		if (dataToBeCreated != null) {
			status = createData(dataToBeCreated);
		}

		if (dataToBeModified != null) {
			status = modifyData(dataToBeModified);
		}

		return status;
	}

	private boolean createData(List<ReasonCodePlantHierarchyAssociation> dataToBeCreated) throws OEETechnicalException {
		boolean isConfigSaved = false;
		try {
			for (ReasonCodePlantHierarchyAssociation rcphAssociationInput : dataToBeCreated) {
				/*List<ReasonCodePlantHierarchyAssociation> rcConfigList = getReasonCodeForNodeId(rcphAssociationInput);
				if (rcConfigList != null) {
					if (rcConfigList.size() == 0) {
						em.persist(rcphAssociationInput);
						isConfigSaved = true;
					}
				}*/
				em.persist(rcphAssociationInput);
				isConfigSaved = true;
			}
		} catch (Exception e) {
			OEETechnicalException exception = new OEETechnicalException("Reason Code Configuration save failed", e);
			LOG.error(e);
			throw exception;
		}
		return isConfigSaved;
	}

	private boolean modifyData(List<ReasonCodePlantHierarchyAssociation> dataToBeModified) throws OEETechnicalException {
		
		boolean isConfigModified = false;
		try {
			for (ReasonCodePlantHierarchyAssociation rcphAssociationInput : dataToBeModified) {
				List<ReasonCodePlantHierarchyAssociation> rcConfigExistingList = getReasonCodeForNodeId(rcphAssociationInput);
				if (rcConfigExistingList != null) {
					if (rcConfigExistingList.size() != 0) {
						for (ReasonCodePlantHierarchyAssociation reasonCodePlantHierarchyAssociation : rcConfigExistingList) {
							if (reasonCodePlantHierarchyAssociation.equalTo(rcphAssociationInput)) {
								rcphAssociationInput.setVersion(reasonCodePlantHierarchyAssociation.getVersion());
								rcphAssociationInput.setRcphDCElemAssocId(reasonCodePlantHierarchyAssociation.getRcphDCElemAssocId());
							}
						}
						em.merge(rcphAssociationInput);
						isConfigModified = true;
					}
					else{
						em.persist(rcphAssociationInput);
						isConfigModified = true;
					}
				}
			}
		} catch (Exception e) {
			OEETechnicalException exception = new OEETechnicalException("Update reason code configuration failed", e);
			LOG.error(e);
			throw exception;
		}
		return isConfigModified;
	}
	
	private boolean removeData(List<ReasonCodePlantHierarchyAssociation> dataToBeRemoved) throws OEETechnicalException {
		
		boolean isConfigDeleted = false;
		try {
			for (ReasonCodePlantHierarchyAssociation rcphAssociationInput : dataToBeRemoved) {
				//List<ReasonCodePlantHierarchyAssociation> rcConfigExistingList = getReasonCodeForNodeId(rcphAssociationInput);
				//if (rcConfigExistingList != null) {
					//if (rcConfigExistingList.size() > 0) {
						StringBuilder builder = new StringBuilder();
						builder.append("delete from ReasonCodePlantHierarchyAssociation rcConfig where rcConfig.client = :client and " +
								"rcConfig.plant = :plant and rcConfig.nodeId = :nodeId and rcConfig.reasonCode1 = :reasonCode1 " +
								"and rcConfig.reasonCode2 = :reasonCode2 and rcConfig.reasonCode3 = :reasonCode3 and rcConfig.reasonCode4 = :reasonCode4 ");
						
						if (rcphAssociationInput.getDcElement() != null) {
							builder.append("and rcConfig.dcElement = :dcElement ");
						}
						int level = 4;
						if (rcphAssociationInput.getReasonCode5() != null) {
							level = 5;
							builder.append(" and rcConfig.reasonCode5 = :reasonCode5");
							if (rcphAssociationInput.getReasonCode6() != null) {
								level = 6;
								builder.append(" and rcConfig.reasonCode6 = :reasonCode6");
								if (rcphAssociationInput.getReasonCode7() != null) {
									level = 7;
									builder.append(" and rcConfig.reasonCode7 = :reasonCode7");
									if (rcphAssociationInput.getReasonCode8() != null) {
										level = 8;
										builder.append(" and rcConfig.reasonCode8 = :reasonCode8");
									}
								}
							}
						}
						Query query = em.createQuery(builder.toString());
						query.setParameter("client", rcphAssociationInput.getClient());
						query.setParameter("plant", rcphAssociationInput.getPlant());
						query.setParameter("nodeId", rcphAssociationInput.getNodeId());
						query.setParameter("dcElement", rcphAssociationInput.getDcElement());
						query.setParameter("reasonCode1", rcphAssociationInput.getReasonCode1());
						query.setParameter("reasonCode2", rcphAssociationInput.getReasonCode2());
						query.setParameter("reasonCode3", rcphAssociationInput.getReasonCode3());
						query.setParameter("reasonCode4", rcphAssociationInput.getReasonCode4());
						
						if (level == 5) {
							query.setParameter("reasonCode5", rcphAssociationInput.getReasonCode5());
						} else if (level == 6) {
							query.setParameter("reasonCode5", rcphAssociationInput.getReasonCode5());
							query.setParameter("reasonCode6", rcphAssociationInput.getReasonCode6());
						} 
						else if (level == 7) {
							query.setParameter("reasonCode5", rcphAssociationInput.getReasonCode5());
							query.setParameter("reasonCode6", rcphAssociationInput.getReasonCode6());
							query.setParameter("reasonCode7", rcphAssociationInput.getReasonCode7());
						} else if (level == 8) {
							query.setParameter("reasonCode5", rcphAssociationInput.getReasonCode5());
							query.setParameter("reasonCode6", rcphAssociationInput.getReasonCode6());
							query.setParameter("reasonCode7", rcphAssociationInput.getReasonCode7());
							query.setParameter("reasonCode8", rcphAssociationInput.getReasonCode8());
						} else if (level == 9) {
							query.setParameter("reasonCode5", rcphAssociationInput.getReasonCode5());
							query.setParameter("reasonCode6", rcphAssociationInput.getReasonCode6());
							query.setParameter("reasonCode7", rcphAssociationInput.getReasonCode7());
							query.setParameter("reasonCode8", rcphAssociationInput.getReasonCode8());
							query.setParameter("reasonCode9", rcphAssociationInput.getReasonCode9());
						} else if (level == 10) {
							query.setParameter("reasonCode5", rcphAssociationInput.getReasonCode5());
							query.setParameter("reasonCode6", rcphAssociationInput.getReasonCode6());
							query.setParameter("reasonCode7", rcphAssociationInput.getReasonCode7());
							query.setParameter("reasonCode8", rcphAssociationInput.getReasonCode8());
							query.setParameter("reasonCode9", rcphAssociationInput.getReasonCode9());
							query.setParameter("reasonCode10", rcphAssociationInput.getReasonCode10());
						}
						
						int rowsDeleted = query.executeUpdate();
						if (rowsDeleted > 0 ) {
							isConfigDeleted = true;
						}
					}
				/*}
			}*/
		} catch (Exception e) {
			OEETechnicalException exception = new OEETechnicalException("Delete reason code configuration failed", e);
			LOG.error(e);
			throw exception;
		}
		return isConfigDeleted;
	}

    @SuppressWarnings("unchecked")
	public List<ReasonCode> getReasonCodeForDCElement(String client, String plant, String timeElementType) throws OEETechnicalException {
    	
    	List<ReasonCode> reasonCodesList = null;
    	
    	try {
    		StringBuilder queryString = new StringBuilder();
    		queryString.append("SELECT rc FROM ReasonCode rc where rc.id.client = :client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted");
    		
    		if (timeElementType != null) 
    			queryString.append(" and rc.timeElementType = :timeElementType");
    		
    		Query query = em.createQuery(queryString.toString());
    		query.setParameter("client", client);
    		query.setParameter("plant", plant);
    		query.setParameter("isDeleted", OEEConstants.OEE_TRUE);

    		if (timeElementType != null)
    		query.setParameter("timeElementType", timeElementType);
    		
    		List<ReasonCode> rcList = query.getResultList();
    		if (rcList != null) {
    			reasonCodesList = new ArrayList<ReasonCode>();
				for (ReasonCode reasonCode : rcList) {
					if ("\u0000".equals(reasonCode.getId().getReasonCode5()) && !("\u0000".equals(reasonCode.getId().getReasonCode4()))) {
						reasonCodesList.add(reasonCode);
					}
				}
			}
    	}catch(Exception e){
    		OEETechnicalException exception = new OEETechnicalException(
					"Get Reason Codes for DCElement failed", e);
			LOG.error(e);
			throw exception;
    	}
    	return reasonCodesList;
    }
    
    @SuppressWarnings("unchecked")
	public List<ReasonCodePlantHierarchyAssociation> getReasonCodeForNodeId(
    		ReasonCodePlantHierarchyAssociation rcphAssociationInput) throws OEETechnicalException {
    
    	List<ReasonCodePlantHierarchyAssociation> rcphAssociation = null;
    	StringBuilder queryString = new StringBuilder();
    	queryString.append("SELECT rcphAssociation FROM ReasonCodePlantHierarchyAssociation rcphAssociation " +
    				"where rcphAssociation.client = :client and rcphAssociation.plant = :plant and " +
    				"rcphAssociation.nodeId= :nodeId ");
    	if (rcphAssociationInput.getDcElement() != null) {
    		queryString.append("and rcphAssociation.dcElement = :dcElement");
    	} /*else {
    		queryString.append("and rcphAssociation.dcElement IS NULL ");
    	}*/
    	
    	try {
    		Query query = em.createQuery(queryString.toString());
    		query.setParameter("client", rcphAssociationInput.getClient());
    		query.setParameter("plant", rcphAssociationInput.getPlant());
    		query.setParameter("nodeId", rcphAssociationInput.getNodeId());
    		
    		if (rcphAssociationInput.getDcElement() != null) 
    		query.setParameter("dcElement", rcphAssociationInput.getDcElement());
    		rcphAssociation = query.getResultList();
		} catch (Exception e) {
    		OEETechnicalException exception = new OEETechnicalException(
					"Get Reason Codes for NodeId failed", e);
			LOG.error(e);
			throw exception;
    	}
		return rcphAssociation;
    }
    
    @SuppressWarnings("unchecked")
	public List<ReasonCode> getReasonCodeForLevel(ReasonCodePK pk, int level) throws OEETechnicalException  {
    	
    	List<ReasonCode> rcList = null;
    	try {
    		 if (level == 5) {
				Query query = em.createQuery("select rc from ReasonCode rc where rc.id.client = :client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted " +
    					"and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 and rc.id.reasonCode3 = :reasonCode3 " +
    					"and rc.id.reasonCode4 = :reasonCode4 ");
				query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null) {
		    		rcList = new ArrayList<ReasonCode>();
					for (ReasonCode reasonCode : reasonCodeList) {
						if (!reasonCode.getId().getReasonCode5().equals("\u0000") && reasonCode.getId().getReasonCode6().equals("\u0000") &&
								reasonCode.getId().getReasonCode7().equals("\u0000") && reasonCode.getId().getReasonCode8().equals("\u0000") &&
								reasonCode.getId().getReasonCode9().equals("\u0000") && reasonCode.getId().getReasonCode10().equals("\u0000")) {
							rcList.add(reasonCode);
						} 
					}
				}
			} else if (level == 6) {
				Query query = em.createQuery("select rc from ReasonCode rc where rc.id.client = :client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted " +
    					"and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 and rc.id.reasonCode3 = :reasonCode3 " +
    					"and rc.id.reasonCode4 = :reasonCode4 and rc.id.reasonCode5 = :reasonCode5");
				query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null) {
		    		rcList = new ArrayList<ReasonCode>();
					for (ReasonCode reasonCode : reasonCodeList) {
						if (!reasonCode.getId().getReasonCode6().equals("\u0000") &&
								reasonCode.getId().getReasonCode7().equals("\u0000") && reasonCode.getId().getReasonCode8().equals("\u0000") &&
								reasonCode.getId().getReasonCode9().equals("\u0000") && reasonCode.getId().getReasonCode10().equals("\u0000")) {
							rcList.add(reasonCode);
						} 
					}
				}
			} else if (level == 7) {
				Query query = em.createQuery("select rc from ReasonCode rc where rc.id.client = :client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted " +
    					"and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 and rc.id.reasonCode3 = :reasonCode3 " +
    					"and rc.id.reasonCode4 = :reasonCode4 and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6");
				query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null) {
		    		rcList = new ArrayList<ReasonCode>();
					for (ReasonCode reasonCode : reasonCodeList) {
						if (!reasonCode.getId().getReasonCode7().equals("\u0000") && reasonCode.getId().getReasonCode8().equals("\u0000") &&
								reasonCode.getId().getReasonCode9().equals("\u0000") && reasonCode.getId().getReasonCode10().equals("\u0000")) {
							rcList.add(reasonCode);
						} 
					}
				}
			} else if (level == 8) {
				Query query = em.createQuery("select rc from ReasonCode rc where rc.id.client = :client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted " +
    					"and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 and rc.id.reasonCode3 = :reasonCode3 " +
    					"and rc.id.reasonCode4 = :reasonCode4 and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6 " +
    					"and rc.id.reasonCode7 = :reasonCode7 ");
				query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("reasonCode7", pk.getReasonCode7());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null) {
		    		rcList = new ArrayList<ReasonCode>();
					for (ReasonCode reasonCode : reasonCodeList) {
						if (!reasonCode.getId().getReasonCode8().equals("\u0000") &&
								reasonCode.getId().getReasonCode9().equals("\u0000") && reasonCode.getId().getReasonCode10().equals("\u0000")) {
							rcList.add(reasonCode);
						} 
					}
				}
			} else if (level == 9) {
				Query query = em.createQuery("select rc from ReasonCode rc where rc.id.client = :client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted " +
    					"and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 and rc.id.reasonCode3 = :reasonCode3 " +
    					"and rc.id.reasonCode4 = :reasonCode4 and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6 " +
    					"and rc.id.reasonCode7 = :reasonCode7 and rc.id.reasonCode8 = :reasonCode8 ");
				query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("reasonCode7", pk.getReasonCode7());
	    		query.setParameter("reasonCode8", pk.getReasonCode8());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null) {
		    		rcList = new ArrayList<ReasonCode>();
					for (ReasonCode reasonCode : reasonCodeList) {
						if (!reasonCode.getId().getReasonCode9().equals("\u0000") && reasonCode.getId().getReasonCode10().equals("\u0000")) {
							rcList.add(reasonCode);
						} 
					}
				}
			} else if (level == 10) {
				Query query = em.createQuery("select rc from ReasonCode rc where rc.id.client = :client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted " +
    					"and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 and rc.id.reasonCode3 = :reasonCode3 " +
    					"and rc.id.reasonCode4 = :reasonCode4 and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6 " +
    					"and rc.id.reasonCode7 = :reasonCode7 and rc.id.reasonCode8 = :reasonCode8 and rc.id.reasonCode9 = :reasonCode9 ");
				query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("reasonCode7", pk.getReasonCode7());
	    		query.setParameter("reasonCode8", pk.getReasonCode8());
	    		query.setParameter("reasonCode9", pk.getReasonCode9());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null) {
		    		rcList = new ArrayList<ReasonCode>();
					for (ReasonCode reasonCode : reasonCodeList) {
						if (!reasonCode.getId().getReasonCode10().equals("\u0000")) {
							rcList.add(reasonCode);
						} 
					}
				}
			} 
			
		} catch (Exception e) {
			OEETechnicalException exception = new OEETechnicalException("Get Reason Code for Particular level failed" + e);
			LOG.error(e);
			throw exception;
		}
    	return rcList;
    }
    
	public ReasonCode getReasonCodeDetails(ReasonCodePK pk) throws OEETechnicalException {
    	
    	ReasonCode reasonCode = null;
    	StringBuffer buffer = new StringBuffer();
    	buffer.append("select rc from ReasonCode rc where rc.id.client =:client and rc.id.plant = :plant and rc.isDeleted <> :isDeleted");
    	
    	try {
			Query query = em.createQuery(buffer.toString());
			
			if (pk.getReasonCode10() != null) {
	    		buffer.append(" and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 " +
						"and rc.id.reasonCode3 = :reasonCode3 and rc.id.reasonCode4 = :reasonCode4 " +
						"and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6 " +
						"and rc.id.reasonCode7 = :reasonCode7 and rc.id.reasonCode8 = :reasonCode8 " +
						"and rc.id.reasonCode9 = :reasonCode9 and rc.id.reasonCode10 = :reasonCode10 ");
	    		query = em.createQuery(buffer.toString());
	    		query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("reasonCode7", pk.getReasonCode7());
	    		query.setParameter("reasonCode8", pk.getReasonCode8());
	    		query.setParameter("reasonCode9", pk.getReasonCode9());
	    		query.setParameter("reasonCode10", pk.getReasonCode10());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null && reasonCodeList.size() > 0) {
		    		reasonCode = reasonCodeList.get(0);
				}
			} else if (pk.getReasonCode9() != null) {
	    		buffer.append(" and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 " +
						"and rc.id.reasonCode3 = :reasonCode3 and rc.id.reasonCode4 = :reasonCode4 " +
						"and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6 " +
						"and rc.id.reasonCode7 = :reasonCode7 and rc.id.reasonCode8 = :reasonCode8 " +
						"and rc.id.reasonCode9 = :reasonCode9 ");
	    		query = em.createQuery(buffer.toString());
	    		query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("reasonCode7", pk.getReasonCode7());
	    		query.setParameter("reasonCode8", pk.getReasonCode8());
	    		query.setParameter("reasonCode9", pk.getReasonCode9());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null && reasonCodeList.size() > 0) {
		    		reasonCode = new ReasonCode();
					for (ReasonCode reasonCode2 : reasonCodeList) {
						if (reasonCode2.getId().getReasonCode10().equals("\u0000")) {
							reasonCode = reasonCode2;
						}	
					}
				}
			} else if (pk.getReasonCode8() != null) {
	    		buffer.append(" and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 " +
						"and rc.id.reasonCode3 = :reasonCode3 and rc.id.reasonCode4 = :reasonCode4 " +
						"and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6 " +
						"and rc.id.reasonCode7 = :reasonCode7 and rc.id.reasonCode8 = :reasonCode8 ");
	    		query = em.createQuery(buffer.toString());
	    		query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("reasonCode7", pk.getReasonCode7());
	    		query.setParameter("reasonCode8", pk.getReasonCode8());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null && reasonCodeList.size() > 0) {
		    		reasonCode = new ReasonCode();
					for (ReasonCode reasonCode2 : reasonCodeList) {
						if (reasonCode2.getId().getReasonCode9().equals("\u0000")) {
							reasonCode = reasonCode2;
						}	
					}
				}
			} else if (pk.getReasonCode7() != null) {
	    		buffer.append(" and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 " +
						"and rc.id.reasonCode3 = :reasonCode3 and rc.id.reasonCode4 = :reasonCode4 " +
						"and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6 and rc.id.reasonCode7 = :reasonCode7");
	    		query = em.createQuery(buffer.toString());
	    		query.setParameter("reasonCode1", pk.getReasonCode1());
	    		query.setParameter("reasonCode2", pk.getReasonCode2());
	    		query.setParameter("reasonCode3", pk.getReasonCode3());
	    		query.setParameter("reasonCode4", pk.getReasonCode4());
	    		query.setParameter("reasonCode5", pk.getReasonCode5());
	    		query.setParameter("reasonCode6", pk.getReasonCode6());
	    		query.setParameter("reasonCode7", pk.getReasonCode7());
	    		query.setParameter("client", pk.getClient());
		    	query.setParameter("plant", pk.getPlant());
		    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
		    	
		    	List<ReasonCode> reasonCodeList = query.getResultList();
		    	if (reasonCodeList != null && reasonCodeList.size() > 0) {
		    		reasonCode = new ReasonCode();
					for (ReasonCode reasonCode2 : reasonCodeList) {
						if (reasonCode2.getId().getReasonCode8().equals("\u0000")) {
							reasonCode = reasonCode2;
						} 
					}
				}
			} else if (pk.getReasonCode6() != null) {
	    		buffer.append(" and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 " +
						"and rc.id.reasonCode3 = :reasonCode3 and rc.id.reasonCode4 = :reasonCode4 " +
						"and rc.id.reasonCode5 = :reasonCode5 and rc.id.reasonCode6 = :reasonCode6");
		    		query = em.createQuery(buffer.toString());
		    		query.setParameter("reasonCode1", pk.getReasonCode1());
		    		query.setParameter("reasonCode2", pk.getReasonCode2());
		    		query.setParameter("reasonCode3", pk.getReasonCode3());
		    		query.setParameter("reasonCode4", pk.getReasonCode4());
		    		query.setParameter("reasonCode5", pk.getReasonCode5());
		    		query.setParameter("reasonCode6", pk.getReasonCode6());
		    		query.setParameter("client", pk.getClient());
			    	query.setParameter("plant", pk.getPlant());
			    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
			    	
			    	List<ReasonCode> reasonCodeList = query.getResultList();
			    	if (reasonCodeList != null && reasonCodeList.size() > 0) {
			    		reasonCode = new ReasonCode();
						for (ReasonCode reasonCode2 : reasonCodeList) {
							if (reasonCode2.getId().getReasonCode7().equals("\u0000")) {
								reasonCode = reasonCode2;
							} 
						}
					}
				} else if (pk.getReasonCode5() != null) {
		    		buffer.append(" and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 " +
    				"and rc.id.reasonCode3 = :reasonCode3 and rc.id.reasonCode4 = :reasonCode4 and rc.id.reasonCode5 = :reasonCode5 ");
		    		query = em.createQuery(buffer.toString());
		    		query.setParameter("reasonCode1", pk.getReasonCode1());
		    		query.setParameter("reasonCode2", pk.getReasonCode2());
		    		query.setParameter("reasonCode3", pk.getReasonCode3());
		    		query.setParameter("reasonCode4", pk.getReasonCode4());
		    		query.setParameter("reasonCode5", pk.getReasonCode5());
		    		query.setParameter("client", pk.getClient());
			    	query.setParameter("plant", pk.getPlant());
			    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
			    	
			    	List<ReasonCode> reasonCodeList = query.getResultList();
			    	if (reasonCodeList != null && reasonCodeList.size() > 0) {
			    		reasonCode = new ReasonCode();
						for (ReasonCode reasonCode2 : reasonCodeList) {
							if (reasonCode2.getId().getReasonCode6().equals("\u0000")) {
								reasonCode = reasonCode2;
							} 
						}
					}
				} else if (pk.getReasonCode4() != null ) {
		    		buffer.append(" and rc.id.reasonCode1 = :reasonCode1 and rc.id.reasonCode2 = :reasonCode2 " +
		    				"and rc.id.reasonCode3 = :reasonCode3 and rc.id.reasonCode4 = :reasonCode4 ");
		    		query = em.createQuery(buffer.toString());
		    		query.setParameter("reasonCode1", pk.getReasonCode1());
		    		query.setParameter("reasonCode2", pk.getReasonCode2());
		    		query.setParameter("reasonCode3", pk.getReasonCode3());
		    		query.setParameter("reasonCode4", pk.getReasonCode4());
		    		query.setParameter("client", pk.getClient());
			    	query.setParameter("plant", pk.getPlant());
			    	query.setParameter("isDeleted", OEEConstants.OEE_TRUE);
			    	
			    	List<ReasonCode> reasonCodeList = query.getResultList();
			    	if (reasonCodeList != null && reasonCodeList.size() > 0) {
			    		reasonCode = new ReasonCode();
						for (ReasonCode reasonCode2 : reasonCodeList) {
							if (reasonCode2.getId().getReasonCode5().equals("\u0000")) {
								reasonCode = reasonCode2;
							} 
						}
					}
				}
    	
		} catch (Exception e) {
			OEETechnicalException exception = new OEETechnicalException("Get Reason Code details failed" + e);
			LOG.error(e);
			throw exception;
		}
		return reasonCode;
    }

	@Override
	public boolean deleteRCConfigForClientPlant(String client,
			String plant) throws OEETechnicalException {
    	try {
    		Query query = em.createQuery("DELETE FROM ReasonCodePlantHierarchyAssociation rcphAssociation " +
    				"where rcphAssociation.client = :client and rcphAssociation.plant = :plant ");
    		query.setParameter("client", client);
    		query.setParameter("plant", plant);
    		query.executeUpdate();
    		return true;
		} catch (Exception e) {
    		OEETechnicalException exception = new OEETechnicalException(
					"Delete Reason Code Configuration for client and plant failed", e);
			LOG.error(e);
			throw exception;
    	}
	}

	@Override
	public List<ReasonCodePlantHierarchyAssociation> getAllRCConfigForClientPlant(String client,
			String plant) throws OEETechnicalException {
    	List<ReasonCodePlantHierarchyAssociation> rcphAssociationList = null;
    	try {
    		Query query = em.createQuery("SELECT rcphAssociation FROM ReasonCodePlantHierarchyAssociation rcphAssociation " +
    				"where rcphAssociation.client = :client and rcphAssociation.plant = :plant ");
    		query.setParameter("client", client);
    		query.setParameter("plant", plant);
    		rcphAssociationList = query.getResultList();
		} catch (Exception e) {
    		OEETechnicalException exception = new OEETechnicalException(
					"Get Reason Code Configuration failed", e);
			LOG.error(e);
			throw exception;
    	}
		return rcphAssociationList;
	}

	@Override
	public List<ReasonCodePlantHierarchyAssociation> getAllRCConfigForValidation(Set<ReasonCodeAssignmentKey> rcAssignmentKeySet) throws OEETechnicalException {
		List<ReasonCodePlantHierarchyAssociation> rcList = null;
    	try {
    		
			StringBuilder queryString = new StringBuilder("SELECT rcphAssociation FROM ReasonCodePlantHierarchyAssociation rcphAssociation WHERE ");
			List<String> propertyNames = new ArrayList<String>();
			propertyNames.add("client");
			propertyNames.add("plant");
			propertyNames.add("nodeId");
			propertyNames.add("dcElement");
			queryString.append(getQueryStringForRCConfigForListParameters(rcAssignmentKeySet, propertyNames));

			Query query = em.createQuery(queryString.toString());
			setQueryParametersForRCListParameters(query, rcAssignmentKeySet, propertyNames);
			
    		return query.getResultList();
    	}catch (Exception e) {
    		OEETechnicalException exception = new OEETechnicalException(
					"Get Reason Code Configuration failed", e);
			LOG.error(e);
			throw exception;
    	}
	
	}
	
	private void setQueryParametersForRCListParameters(Query query, Set<ReasonCodeAssignmentKey> paramList, List<String> propertyNames) {
		if (paramList != null && !paramList.isEmpty()) {
			int index = 0;
			for (ReasonCodeAssignmentKey parameter : paramList) {
					query.setParameter(propertyNames.get(0) + index, parameter.getClient());
					query.setParameter(propertyNames.get(1) + index, parameter.getPlant());
					query.setParameter(propertyNames.get(2) + index, parameter.getNodeId());
					query.setParameter(propertyNames.get(3) + index, parameter.getDcElement());
				index++;
			}
		}
	}

	private String getQueryStringForRCConfigForListParameters(Set<ReasonCodeAssignmentKey> paramList, List<String> propertyNames) {
		StringBuilder queryString = new StringBuilder("");
		if (paramList != null && !paramList.isEmpty()) {
			queryString.append("(");
			for (int index = 0; index < paramList.size(); index++) {
				queryString.append("(");
				for (int secIndex = 0; secIndex < propertyNames.size(); secIndex++) {
					queryString.append("rcphAssociation.").append(propertyNames.get(secIndex)).append(" = :").append(propertyNames.get(secIndex)).append(index);
					if (secIndex != (propertyNames.size() - 1)) {
						queryString.append(" AND ");
					}
				}
				queryString.append(")");
				if (index != (paramList.size() - 1)) {
					queryString.append(" OR ");
				}
				
			}
			queryString.append(")");
		}
		return queryString.toString();
	}



}