package com.sap.xapps.oee.dto.reasoncodeservices;
import java.util.Stack;
import com.sap.xapps.logging.MPMLogger;
import com.sap.xapps.oee.dto.reasoncode.ReasonCodePlantHierarchyAssociation;

public class ReasonCodeTreeImpl {

	private Tree<ReasonCodeAssignment> tree;
	 private static final MPMLogger LOG = new MPMLogger(ReasonCodeTreeImpl.class);
	 //IActionInstance instance;

	public static ReasonCodeTreeImpl getReasonCodeTreeImpl(String client, String plant, String nodeId, String dcElement) {
		return new ReasonCodeTreeImpl(client, plant, nodeId, dcElement);
	}

	private ReasonCodeTreeImpl(String client, String plant, String nodeId, String dcElement) {
		ReasonCodeAssignment root = new ReasonCodeAssignment(client, plant, nodeId, dcElement, null);
		tree = new Tree<ReasonCodeAssignment>(new TreeNode<ReasonCodeAssignment>(null, root));
	}
/** 
 * 
 * This method validates each reason code in the list before adding it to the tree of existing reason codes. 
 * <p>
 * If the new reason code is valid, it is added to the tree. Else, exception is thrown.
 * <p>
 * Newly added reason codes are validated based on whether any of their parents or children in the same hierarchy exist in the tree.
 * <p> 
 * 
 * For example,
 * <p>
 * The following are the existing reason codes in the table:
 * <p>
 * rc11, rc12, rc13, rc14, rc15
 * <p>
 * rc21, rc22, rc23, rc24, rc25, rc26
 * <p>
 * The following are the possible cases that are validated:
 * 
 * <p>
 * CASE 1:
 * <p>
 * Input : rc31, rc32, rc33, rc34
 * <p>
 * Output : Success. The above reason code is not part of any of the existing hierarchies in the table. Therefore, this is a valid assignment.
 * <p>
 * 
 * CASE 2:
 * <p>
 * Input : rc11, rc12, rc13, rc14, rc15, rc16
 * <p>
 * Output : Failure. There is already an assignment for the above hierarchy. As the parent of rc16 (rc15) is already in the assignment list, the child cannot be assigned.
 * <p>
 * 
 * CASE 3:
 * <p>
 * Input: rc21, rc22, rc23, rc24, rc25
 * <p>
 * Output: Failure. There is already an assignment for the above hierarchy. as the child of rc25 (rc26) is already in the assignmnet list, the parent cannot be assigned.
 *                     
 * **/
	public void addReasonCodeToTree(ReasonCodePlantHierarchyAssociation reasonCode) throws IllegalStateException {
		if (!isValidReasonCodeForTree(reasonCode))
			throw new IllegalStateException(
					"Reason Code violates the assignment conditions. Reason Code cannot be added");
		ReasonCodeAssignment rc = new ReasonCodeAssignment(reasonCode);
		Stack<ReasonCodeAssignment> rcStack = this.getRCStack(rc);
		// Pop for the root node
		rcStack.pop();
		TreeNode<ReasonCodeAssignment> currentLevelRCNode = tree.getRoot();
		while (!rcStack.isEmpty()) {
			ReasonCodeAssignment nextLevelReasonCode = rcStack.pop();
			TreeNode<ReasonCodeAssignment> nextLevelRCNode = currentLevelRCNode.findChild(nextLevelReasonCode);
			if (nextLevelRCNode == null)
				nextLevelRCNode = new TreeNode<ReasonCodeAssignment>(currentLevelRCNode, nextLevelReasonCode);
			currentLevelRCNode = nextLevelRCNode;
		}
	}

	private boolean isValidReasonCodeForTree(ReasonCodePlantHierarchyAssociation reasonCode) {
		ReasonCodeAssignment rc = new ReasonCodeAssignment(reasonCode);
		Stack<ReasonCodeAssignment> rcStack = this.getRCStack(rc);
		if (rcStack.size() == 1)
			return true;
		// Pop for the root node
		rcStack.pop();
		TreeNode<ReasonCodeAssignment> currentLevelRCNode = tree.getRoot();
		while (!rcStack.isEmpty()) {
			/** Pop out each reason code hierarchy and check whether this reason code hierarchy is already there in tree or not.
			    If hierarchy is already there then reason code assignment is invalid else it is valid **/
			ReasonCodeAssignment nextLevelReasonCode = rcStack.pop();
			TreeNode<ReasonCodeAssignment> nextLevelRCNode = currentLevelRCNode.findChild(nextLevelReasonCode);
			if (nextLevelRCNode == null)
				return true;
			
			if (rcStack.isEmpty() && !nextLevelRCNode.isLeaf()){// fails because for this reasonCode hierarchy,child is already assigned.
				String value = "Client:"+nextLevelRCNode.node.getClient()+" "+"Plant:"+nextLevelRCNode.node.getPlant()+" "+"NodeId:"+nextLevelRCNode.node.getNodeId()+" "+"DCElement:"+
				" "+nextLevelRCNode.node.getDcElement()+" "+"ReasonCode:"+nextLevelRCNode.node.getReasonCode();
				LOG.error("Assignment is invalid as child node is already assigned for the hierarchy",value);
				throw new IllegalStateException("Reason Code violates the assignment conditions. Reason Code cannot be added. Check Log for details"+nextLevelRCNode.node.getClient());
			}
				//return false;
			if (!rcStack.isEmpty() && nextLevelRCNode.isLeaf()){// fails because for this reasonCode hierarchy,parent is already assigned.
				String value1 = "Client:"+nextLevelRCNode.node.getClient()+" "+"Plant:"+nextLevelRCNode.node.getPlant()+" "+"NodeID:"+nextLevelRCNode.node.getNodeId()+" "+"DCElement:"+
				" "+nextLevelRCNode.node.getDcElement()+" "+"ReasonCode:"+nextLevelRCNode.node.getReasonCode();
				LOG.error("Assignment is invalid as parent node is already assigned for the hierarchy",value1);
			    throw new IllegalStateException("Reason Code violates the assignment conditions. Reason Code cannot be added. Check Log for details");
			}
			currentLevelRCNode = nextLevelRCNode;
		}
		return false;
	}
	
/** This method forms the stack by pushing reason code and its parent until we get root(client,plant,nodeId,dcElement) as parent reason code**/	
	private Stack<ReasonCodeAssignment> getRCStack(ReasonCodeAssignment reasonCodeAssignment) {
		Stack<ReasonCodeAssignment> rcStack = new Stack<ReasonCodeAssignment>();
		while (reasonCodeAssignment.getParentReasonCode() != null) {
			rcStack.push(reasonCodeAssignment);
			reasonCodeAssignment = reasonCodeAssignment.getParentReasonCode();
		}
		return rcStack;
	}
}


