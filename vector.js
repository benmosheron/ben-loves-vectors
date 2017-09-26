module.exports = {
    size: size,
    zip: zip,
    cascadeMap: cascadeMap,
    cascadeReduce: cascadeReduce,
    magnitude: magnitude,
    normalise: normalise,
    negate: negate,
    add: add,
    addScalar: addScalar,
    sub: sub,
    subScalar: subScalar,
    multiplyScalar: multiplyScalar,
    divideScalar: divideScalar,
    equals: equals,
    isAVector: isAVector,
    floor: floor,
    create: create,
    create2: create2,
    create2x2: create2x2,
    createRandom: createRandom,
    createWithDimensions: createWithDimensions
}
// Public functions

// Get an array of the lengths of each dimension of v.
function size(v){
    if(!isAVector(v)) throw new Error("v must be vector.");
    return sizeRec(v, v.dimension, []);
}

// Map a function over every element of a vector. Applied recursively to higher dimension vectors.
function cascadeMap(v, f){
    if(!isAVector(v)) throw new Error("v must be vector.");
    return v.map(function (e) {
        if(!isAVector(e)) return f(e);
        return cascadeMap(e, f);
    });
}

// Apply a function to element pairs of two vectors.
function zip(v1, v2, f){
    if (!arraysEqual(v1.size(), v2.size())) throw `Vector addition requires equal sizes ([${v1.size()}] != [${v2.size()}])`;
    return v1.map(function(e1, i){
        let e2 = v2.get(i);
        if(!isAVector(e1)) return f(e1, e2);
        return zip(e1, e2, f);
    });
}

//todo: zipMany([v1,v2,...,vN], f)

// Apply an accumulator over all elements of a vector.
function cascadeReduce(v, f, init){
    if(!isAVector(v)) "v must be a vector.";
    return v.reduce(function(prev, next){
        if(!isAVector(next)) return f(prev, next);
        return cascadeReduce(next, f, prev);
    }, init);
}

// Calculate the magnitude of a vector.
function magnitude(v) {
    if(v.dimension > 1) throw new Error("Not implemented for dimensions > 1.");
    if (v.length === 0) {
        return 0;
    }
    return Math.sqrt(v.reduce(function (t, n) { return t + (n * n); }, 0));
}

// Calculate a new magnitude s vector with the same direction as v.
function normalise(v, s) {
    if (v.dimension > 1) throw new Error("Not implemented for dimensions > 1.");
    if (typeof s === "undefined") s = 1;
    if (v.magnitude() === 0) return v.map(e => e);
    return v.multiplyScalar(s / v.magnitude());
}

function negate(v1) {
    if (!isAVector(v1)) throw new Error("v1 must be a vector.");
    return v1.cascadeMap((e) => -e);
}

// Add two vectors of the same size
function add(v1, v2) {
    if (!isAVector(v1)) throw new Error("v1 must be a vector.");
    if (!isAVector(v2)) throw new Error("v2 must be a vector.");
    return zip(v1,v2,(e1, e2) => e1 + e2);
}

function addScalar(v1, s){
    if(typeof s !== "number") throw new Error("s must be a number");
    return add(v1, createWithDimensions(v1.size(), s));
}

// Subtract v2 from v1 where v2 and v1 are both vectors of the same length
function sub(v1, v2) {
    if (v1.length !== v2.length) throw `Vector subtraction requires equal lengths ([${v1.length}] != [${v2.length}])`;
//todo negate()
    return v1.map(function (e, i) { return e - v2.array[i]; });
}

function subScalar(v1, s){
    return addScalar(v1, -s);
}

// Multiply a vector by a scalar
function multiplyScalar(v, s) {
    return v.map(e => e * s);
}

// Divide a vector by a scalar
function divideScalar(v, s) {
    return v.map(e => e / s);
}

// True if the v1 and v2 represent the same vectors (do not need to be the same instance).
function equals(v1, v2) {
    if (v1.length !== v2.length) return false;
    return v1.reduce((acc, val, i) => acc && (v1.array[i] === v2.array[i]), true);
}

function isAVector(v){
    if(undef(v) || v === null) return false;
    if(undef(v.isAVector)) return false;
    return v.isAVector;
}

function floor(v) {
    return v.map(e => Math.floor(e));
}

// Create a vector from an array of values, or another vector.
function create(arrayOrVector) {
    const array = isAVector(arrayOrVector) ? arrayOrVector.array : arrayOrVector;
    if (!Array.isArray(array)) throw new Error(`Input must be an array. [${array}] is not an array.`);
    if(arguments.length > 1) throw new Error("More than one argument provided to create.");

    // For dimension > 1, we convert each sub array to a vector.
    const vectorArray = array.map(e => Array.isArray(e) ? create(e) : e);

    // The object we will be returning
    let vector = {
        // This vector's number array.
        array: vectorArray,
        // Length of this vector's array.
        length: vectorArray.length,
        // The dimension of this vector.
        dimension: getDepth(vectorArray),
        // Indicate that we have a vector.
        isAVector: true,
        // Get the vectors ith element.
        get: function (i) {return getElement(this, i); },
        // Get an array of the lengths of each dimension
        size: function () { return size(this); },
        // Creates a new vector from wrapping the result of array.map().
        map: function (f, i) { return create(this.array.map(f, i)) },
        zip: function(v2, f) { return zip(this, v2, f); },
        // Creates a new vector from wrapping the result of array.reduce().
        reduce: function (f, init) { return this.array.reduce(f, init) },
        cascadeMap: function (f) { return cascadeMap(this, f); },
        cascadeReduce: function(f, init){ return cascadeReduce(this, f, init); }, 
        // Calculate the magnitude of this vector.
        magnitude: function () { return magnitude(this); },
        // Calculate a new magnitude s vector with the same direction as this one.
        normalise: function (s) { return normalise(this, s); },
        add: function (v2) { return add(this, v2); },
        addScalar: function (s) { return addScalar(this, s); },
        sub: function (v2) { return sub(this, v2); },
        subScalar: function (s) { return subScalar(this, s); },
        multiplyScalar: function (s) { return multiplyScalar(this, s); },
        divideScalar: function (s) { return divideScalar(this, s); },
        equals: function (v2) { return equals(this, v2); },
        floor: function () { return floor(this); }
    };

    // xyz shortcuts
    if (vector.length > 0) {
        vector.x = vector.array[0];
    }

    if (vector.length > 1) {
        vector.y = vector.array[1];
    }

    if (vector.length > 2) {
        vector.z = vector.array[2];
    }

    return vector;
}

// Create a vector of length two, providing x and (optionally) y values.
function create2(x, y) {
    if (typeof x === "undefined") throw new Error("At least one argument must be provided.");
    if (typeof y === "undefined") y = x;
    return create([x, y]);
}

// Create a 2D vector by providing one, two, or four values
function create2x2(a, b, c, d){
    if (undef(a)) throw new Error("At least one argument must be provided.");

    if (undef(b)){
        // Everything = a
        b = a;
        c = a;
        d = a;
    }
    else{
        // we have a and b
        if(undef(c)){
            c = a;
            d = b;
        }
        else{
            if(undef(d)) throw new Error("Argument 'd' must be provided if 'c' is.");
        }
    }

    return create([[a, b],[c, d]]);
}

// Create a uniform random n-length vector, bounded by min (inclusive) and max (exclusive).
function createRandom(n, min, max) {
    let scale = max - min;
    let array = [];
    for (var i = 0; i < n; i++) {
        array[i] = (Math.random() * scale) + min;
    }
    return create(array);
}

// Create a vector with dimensions dims, and all values val.
function createWithDimensions(dims, val){
    if(!Array.isArray(dims)) throw new Error("dims must be an array.");
    if(undef(val)) throw new Error("val must be defined.");
    
    const l = dims.pop();
    const array = new Array(l).fill(val);

    if(dims.length === 0) return create(array);
    return createWithDimensions(dims, array);
}

// Private functions

function arraysEqual(first, second){
    if(!Array.isArray(first)) throw new Error("first must be an array.");    
    if(!Array.isArray(second)) throw new Error("second must be an array.");
    if(first.length !== second.length) return false;
    for (var i = 0; i < first.length; i++) {
        if(first[i] !== second[i]) return false;
    }
    return true;
}

function getDepthRec(vector, depth){
    depth += 1;
    // Input is always a vector of numbers or other vectors.
    // If it is neither an array nor a vector, return now
    let next = vector.get(0);
    if(!isAVector(next)) return depth;
    return getDepthRec(next, depth);
}

// Input may be an array of elements or vectors.
// Input will either be an array of vectors, or an array of elements.
// Never an array of arrays.
// A -> 123
// A -> VVV -> 123 123 123
// A -> VVV -> VVV VVV VVV -> 123 ... 123
function getDepth(array){ 
    const first = array[0];
    if(!isAVector(first)) return 1
    return getDepthRec(first, 1);
}

function sizeRec(v, dim, sizeArray){
    if(dim === 0) return sizeArray;
    sizeArray.push(v.length);
    return sizeRec(v.get(0), dim - 1, sizeArray);
}

function getElementFromIndex(vector, i){
    if(i >= vector.length) throw new Error(`Index ${i} is out of bounds.`);
    return vector.array[i];
}

function getElementFromIndexArray(vector, indexArray){
    // Assert all are numbers
    if(!indexArray.every(i => typeof i === "number")) throw new Error("get requires all indices to be numbers.");
    // Check dimension is OK
    if(indexArray.length > vector.dimension) throw new Error(`Too many indices [${indexArray.length}] to access a ${vector.dimension}D vector.`);
    if(indexArray.length === 1) return getElementFromIndex(vector, indexArray[0]);
    const i = indexArray.shift();
    return getElementFromIndexArray(getElementFromIndex(vector, i), indexArray);
}

function getElement(vector, i){
    if(!isAVector(vector)) throw new Error(`Not a vector [${vector}]`);
    // if i is an array, use it for multi dimension access.
    // Use an array
    if(Array.isArray(i)){
        return getElementFromIndexArray(vector, i);
    }
    // Use the single index
    return getElementFromIndex(vector, i);
 }

function undef(obj){
    return typeof obj === "undefined";
}
