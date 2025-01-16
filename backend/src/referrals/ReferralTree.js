class Tree {
    constructor(rootValue) {
        this.root = new ReferralTreeNode(rootValue); // Initialize the root node
    }

    // Add a child to a specific parent node
    addChildToParent(parentValue, childValue) {
        const parentNode = this.findNode(this.root, parentValue);
        if (!parentNode) {
            throw new Error("Parent not found!");
        }

        if (parentNode.hasChild()) {
            throw new Error("Parent already has a child!");
        }

        const childNode = new TreeNode(childValue);
        parentNode.addChild(childNode);
        return childNode;
    }

    // Find a node by value (DFS traversal)
    findNode(node, value) {
        if (!node) return null;
        if (node.value === value) return node;
        return this.findNode(node.child, value);
    }

    // Display the tree (linear structure)
    displayTree(node = this.root, level = 0) {
        if (!node) return;

        console.log("  ".repeat(level) + node.value);
        this.displayTree(node.child, level + 1);
    }
}