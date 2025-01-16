export const getParentHierarchy = (tree, userReferralCode) => {
    const hierarchy = [];
    
    const findNodeAndParents = (node, target, parents = []) => {
        if (node.referralCode === target) {
            hierarchy.push(...parents.reverse());
            return true;
        }
        for (const child of node.children || []) {
            if (findNodeAndParents(child, target, [...parents, node])) {
                return true;
            }
        }
        return false;
    };

    findNodeAndParents(tree, userReferralCode);
    return hierarchy.slice(0, 10);
};
