class ReferralTreeNode {
    constructor(value) {
        this.value = value
        this.parent = null
        this.child = null
    }

    addChild(childNode) {
        if(this.child) {
            throw new Error("This node already has a child!");
        }
        this.child = childNode;
        childNode.parent = this;
    }

    hasChild() {
        return this.child !== null;
    }
}