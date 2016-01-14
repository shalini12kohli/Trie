package com.sap.xapps.oee.dto.reasoncodeservices;

import java.util.ArrayList;
import java.util.List;

public class TreeNode<T> {

	protected T node;
	protected TreeNode<T> parent;
	protected List<TreeNode<T>> children;

	public TreeNode(TreeNode<T> parent, T node) {
		this.parent = parent;
		this.node = node;
		if (parent != null)
			parent.addChildNode(this);
	}

	private void addChildNode(TreeNode<T> node) {
		if (node != null) {
			if (children == null)
				children = new ArrayList<TreeNode<T>>();
			if (!children.contains(node))
				children.add(node);
		}
	}

	public TreeNode<T> findChild(T node) {
		if (node != null)
			if (children != null)
				for (TreeNode<T> child : children)
					if (node.equals(child.node))
						return child;
		return null;
	}

	public boolean isLeaf() {
		return children == null || children.isEmpty();
	}

	public String toString() {
		return node.toString();
	}
}

