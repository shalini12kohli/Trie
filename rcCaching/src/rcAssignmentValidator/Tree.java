package com.sap.xapps.oee.dto.reasoncodeservices;

import com.sap.xapps.oee.dto.reasoncodeservices.TreeNode;

public class Tree<T> {

	private TreeNode<T> root;
	
	public Tree(TreeNode<T> root) {
		this.root = root;
	}
	
	public TreeNode<T> getRoot() {
		return root;
	}
}