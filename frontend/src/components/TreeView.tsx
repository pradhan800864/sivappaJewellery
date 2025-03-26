import React, { useEffect, useState } from 'react';
import {Tree} from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';

const TreeView = () => {
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        // Fetch the tree data from the backend
        const fetchTreeData = async () => {
            const response = await fetch('http://localhost:4999/get-tree');
            const data = await response.json();
            setTreeData(data);
        };

        fetchTreeData();
    }, []);

    if (!treeData) return <p>Loading...</p>;

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Tree
                data={treeData}
                height={400}
                width={2000}
                direction="TB"
                animated={true}
                labelComponent={({ nodeData }) => (
                    <div>
                        <strong>{nodeData.name}</strong>
                        
                    </div>
                )}
                keyAccessor={(node) => node.referralCode}
            />
        </div>
   
    );
};

export default TreeView;
