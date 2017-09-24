module.exports = {
    magnitude: magnitude,
    normalise: normalise,
    add: add,
    sub: sub,
    multiplyScalar: multiplyScalar,
    divideScalar: divideScalar,
    equals: equals,
    floor: floor,
    create: create,
    create2: create2,
    createRandom: createRandom
}
// Public functions

// Calculate the magnitude of a vector.
function magnitude(v) {
    if (v.length === 0) {
        return 0;
    }
    return Math.sqrt(v.reduce(function (t, n) { return t + (n * n); }, 0));
}

// Calculate a new magnitude s vector with the same direction as v.
function normalise(v, s) {
    if (typeof s === "undefined") s = 1;
    if (v.magnitude() === 0) return v.map(e => e);
    return v.multiplyScalar(s / v.magnitude());
}

// Add two vectors of the same length
function add(v1, v2) {
    if (v1.length !== v2.length) throw `Vector addition requires equal lengths ([${v1.length}] != [${v2.length}])`;

    return v1.map(function (e, i) { return e + v2.array[i]; });
}

// Subtract v2 from v1 where v2 and v1 are both vectors of the same length
function sub(v1, v2) {
    if (v1.length !== v2.length) throw `Vector subtraction requires equal lengths ([${v1.length}] != [${v2.length}])`;

    return v1.map(function (e, i) { return e - v2.array[i]; });
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

function floor(v) {
    return v.map(e => Math.floor(e));
}

// Create a vector from an array of values.
function create(array) {
    
    if (!Array.isArray(array)) throw new Error(`Input must be an array. [${array}] is not an array.`);

    // The object we will be returning
    let vector = {
        // This vector's number array.
        array: array,
        // Length of this vector's array.
        length: array.length,
        // Shortcuts
        // Creates a new vector from wrapping the result of array.map()
        map: function (f) { return create(this.array.map(f)) },
        // Creates a new vector from wrapping the result of array.reduce()
        reduce: function (f, init) { return this.array.reduce(f, init) },
        // Calculate the magnitude of this vector.
        magnitude: function () { return magnitude(this.array); },
        // Calculate a new magnitude s vector with the same direction as this one.
        normalise: function (s) { return normalise(this, s); },
        add: function (v2) { return add(this, v2); },
        sub: function (v2) { return sub(this, v2); },
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

// Create a vector of length two, providing x and y values.
function create2(x, y) {
    if (typeof x === "undefined") throw "At least one argument must be provided.";
    if (typeof y === "undefined") y = x;
    return create([x, y]);
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

// Private functions

// Calculate the magnitude of an array of numbers.
function magnitude(array) {
    if (array.length === 0) {
        return 0;
    }
    return Math.sqrt(array.reduce(function (t, n) { return t + (n * n); }, 0));
}