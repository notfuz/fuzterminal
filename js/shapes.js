export function createCube(size){

    const s = size;

    return {

        vertices:[
            {x:-s,y:-s,z:-s},
            {x:s,y:-s,z:-s},
            {x:s,y:s,z:-s},
            {x:-s,y:s,z:-s},

            {x:-s,y:-s,z:s},
            {x:s,y:-s,z:s},
            {x:s,y:s,z:s},
            {x:-s,y:s,z:s}
        ],

        edges:[
            [0,1],[1,2],[2,3],[3,0],
            [4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
        ]
    };
}

export function createTetrahedron(size){

    const s = size;

    return {

        vertices:[
            {x:0,y:-s,z:0},
            {x:-s,y:s,z:-s},
            {x:s,y:s,z:-s},
            {x:0,y:s,z:s}
        ],

        edges:[
            [0,1],[0,2],[0,3],
            [1,2],[2,3],[3,1]
        ]
    };
}

export function createOctahedron(size){

    const s = size;

    return {

        vertices:[
            {x:0,y:-s,z:0},
            {x:s,y:0,z:0},
            {x:0,y:0,z:s},
            {x:-s,y:0,z:0},
            {x:0,y:0,z:-s},
            {x:0,y:s,z:0}
        ],

        edges:[
            [0,1],[0,2],[0,3],[0,4],
            [5,1],[5,2],[5,3],[5,4],
            [1,2],[2,3],[3,4],[4,1]
        ]
    };
}