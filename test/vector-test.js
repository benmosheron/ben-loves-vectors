var assert = require('assert');
var vector = require('../vector.js');

describe("vector", function () {
    // arbitrary x,y,z values
    let x = 1.01;
    let y = -39.01;
    let z = 1093.1239;
    describe("#create()", function () {

        it("should throw if the argument is not an array", function () {
            assert.throws(function () { vector.create(); }, Error);
            assert.throws(function () { vector.create(null); }, Error);
            assert.throws(function () { vector.create({}); }, Error);
            assert.throws(function () { vector.create("yo"); }, Error);
            assert.throws(function () { vector.create(3); }, Error);
        });
        it("should create an empty vector from an empty array", function () {
            let v = vector.create([]);
            isAVector(v);
            assert.strictEqual(v.length, 0);
        });
        it("should create a length 1 vector from a length 1 array", function () {
            let v = vector.create([x]);
            isAVector(v);
            assert.strictEqual(v.length, 1);
            assert.strictEqual(v.x, x);
        });
        it("should create a length 2 vector from a length 2 array", function () {
            let v = vector.create([x, y]);
            isAVector(v);
            assert.strictEqual(v.length, 2);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, y);
        });
        it("should create a length 3 vector from a length 3 array", function () {
            let v = vector.create([x, y, z]);
            isAVector(v);
            assert.strictEqual(v.length, 3);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, y);
            assert.strictEqual(v.z, z);
        });
        it("should create an N length vector from an array of length N", function () {
            let N = 100;
            let a = [];
            for (var i = 0; i < N; i++) { a.push(i); }
            let v = vector.create(a);
            isAVector(v);
            assert.strictEqual(v.length, N);
            for (var i = 0; i < N; i++) { assert.strictEqual(v.array[i], a[i]); }
        });
    });

    describe("#create2()", function () {
        it("should throw if no argument is provided", function () {
            assert.throws(vector.create2);
        });
        it("should create a length 2 vector from a single input", function () {
            let v = vector.create2(x);
            isAVector(v);
            assert.strictEqual(v.length, 2);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, x);
        });
        it("should create a length 2 vector from both arguments", function () {
            let v = vector.create2(x, y);
            isAVector(v);
            assert.strictEqual(v.length, 2);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, y);
        });
    });

    describe("#createRandom()", function () {
        it("should create an N length random vector with elements between min and max", function () {
            let N = 1000;
            let min = -1;
            let max = 1;
            let v = vector.createRandom(N, min, max);
            isAVector(v);
            assert.strictEqual(v.length, N);
            for (var i = 0; i < N; i++) {
                assert(v.array[i] >= min);
                assert(v.array[i] < max);
            }
        })
    });

    describe("v.map()", function () {
        it("should provide an analogue to Array.map()", function () {
            let v = vector.create([x, y, z]);
            let vDoubled = v.map(e => e * 2);
            isAVector(vDoubled);
            assert.strictEqual(v.length, vDoubled.length);
            assert.strictEqual(vDoubled.x, x * 2);
            assert.strictEqual(vDoubled.y, y * 2);
            assert.strictEqual(vDoubled.z, z * 2);
        });
    });

    describe("v.reduce()", function () {
        it("should provide an analogue to Array.reduce()", function () {
            let v = vector.create([x, y, z]);
            let r = v.reduce((acc, val) => acc + val, 0);
            assert.strictEqual(r, x + y + z);
        });
    });

    describe("#magnitude()", function () {
        it("should calculate the magnitude of a 2-vector", function () {
            let v = vector.create([3, 4]); // 5
            let m = doBoth(
                () => vector.magnitude(v),
                () => v.magnitude());
            assert.strictEqual(m, 5);
        });
        it("should calculate the magnitude of a 3-vector", function () {
            let v = vector.create([1, -2, 2]); // 3
            let m = doBoth(
                () => vector.magnitude(v),
                () => v.magnitude());
            assert.strictEqual(m, 3);
        });
        it("should calculate the magnitude of a longer vector", function () {
            let v = vector.create([4, -2, 1, 1, 1, 1, 1]) // 5
            let m = doBoth(
                () => vector.magnitude(v),
                () => v.magnitude());
            assert.strictEqual(m, 5);
        });
        it("should return zero if the vector has all elements === 0", function () {
            let v = vector.create([0, 0, 0]);
            let m = doBoth(
                () => vector.magnitude(v),
                () => v.magnitude());
            assert.strictEqual(m, 0);
        });
    });

    describe("#normalise()", function () {
        function doNormaliseAssertions(normalised, original, expected) {
            isAVector(normalised);
            assert.strictEqual(normalised.length, original.length, "normalised vector should have the same length as the unnormalised.");
            if (!normalised.array.every(e => e === 0))
                assert.strictEqual(normalised.magnitude(), 1, "normalised vector should have magnitude 1.");
            else
                assert.strictEqual(normalised.magnitude(), 0, "normalised vector of a zero vectorshould have magnitude 0.");
            assertVectorsBasicallyEqual(normalised, expected);
        }
        it("should normalise a 2-vector", function () {
            let v = vector.create([3, 4]); //5
            let n = doBoth(
                () => vector.normalise(v),
                () => v.normalise(),
                assertVectorsBasicallyEqual);
            doNormaliseAssertions(n, v, vector.create([3 / 5, 4 / 5]));
        });
        it("should normalise a 3-vector", function () {
            let v = vector.create([1, -2, 2]); //3
            let n = doBoth(
                () => vector.normalise(v),
                () => v.normalise(),
                assertVectorsBasicallyEqual);
            doNormaliseAssertions(n, v, vector.create([1 / 3, -2 / 3, 2 / 3]));
        });
        it("should normalise a longer vector", function () {
            let v = vector.create([4, -2, 1, 1, 1, 1, 1]); //5
            let n = doBoth(
                () => vector.normalise(v),
                () => v.normalise(),
                assertVectorsBasicallyEqual);
            doNormaliseAssertions(n, v, vector.create([4 / 5, -2 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5]));
        });
        it("should normalise a vector of zeros to a vector of zeros", function () {
            let v = vector.create([0, 0, 0]);
            let n = doBoth(
                () => vector.normalise(v),
                () => v.normalise(),
                assertVectorsBasicallyEqual);
            doNormaliseAssertions(n, v, vector.create([0, 0, 0]));
        });
    });

    describe("#add()", function () {
        it("should add two vectors", function () {
            let v1 = vector.create([1, -2, 3]);
            let v2 = vector.create([2, 2, 2]);
            let r = doBoth(
                () => vector.add(v1, v2),
                () => v1.add(v2),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([3, 0, 5]));
        });
        it("should throw if vectors have different lengths", function () {
            let v1 = vector.create([1, -2]);
            let v2 = vector.create([2, 2, 3]);
            let r = doBoth(
                () => vector.add(v1, v2),
                () => v1.add(v2));
            assert(r.errors.both, "Both static and member functions should have thrown.");
        });
    });

    describe("#sub()", function () {
        it("should subtract one vector from another", function () {
            let v1 = vector.create([1, -2, 3]);
            let v2 = vector.create([2, 2, 2]);
            let r = doBoth(
                () => vector.sub(v1, v2),
                () => v1.sub(v2),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([-1, -4, 1]));
        });
        it("should throw if vectors have different lengths", function () {
            let v1 = vector.create([1, -2]);
            let v2 = vector.create([2, 2, 3]);
            let r = doBoth(
                () => vector.sub(v1, v2),
                () => v1.sub(v2));
            assert(r.errors.both, "Both static and member functions should have thrown.");
        });
    });

    describe("#multiplyScalar()", function () {
        it("should multiply a vector and a scalar", function () {
            let v = vector.create([1, -2, 3]);
            let s = -10;
            let r = doBoth(
                () => vector.multiplyScalar(v, s),
                () => v1.multiplyScalar(s),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([-10, 20, -30]));
        });
    });

    describe("#divideScalar()", function () {
        it("should divide a vector by a scalar", function () {
            let v = vector.create([1, -2, 3]);
            let s = -10;
            let r = doBoth(
                () => vector.divideScalar(v, s),
                () => v1.divideScalar(s),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([-0.1, 0.2, -0.3]));
        });
    });

    describe("#floor()", function () {
        it("should produce the element-wise floor function", function () {
            let v = vector.create([1.02312, -23.1239, 159.3213]);
            let s = -10;
            let r = doBoth(
                () => vector.floor(v),
                () => v1.floor(),
                assertVectorsExactlyEqual);
            assertVectorsExactlyEqual(r, vector.create([1, -24, 159]));
        });
    });

});

function isAVector(v) {
    assert.strictEqual("object", typeof v);
    assert(Array.isArray(v.array));
    assert.strictEqual("number", typeof v.length);
}

function doBoth(staticFunction, memberFunction, assertion) {
    let errors = {any: false};
    let s;
    let m;

    try{
        s = staticFunction();
    }
    catch (ex) {
        errors.any = true;
        errors.static = true;
    }

    try {
        m = staticFunction();
    }
    catch (ex) {
        errors.any = true;
        errors.member = true;
    }
    if (typeof assertion === "undefined") {
        assert.deepStrictEqual(s, m, `Static and member functions produced different results. Static [${s}]. Member [${m}].`);
    }
    else {
        assertion(s, m);
    }

    if (errors.any) {
        errors.both = errors.static && errors.member;
        return {errors: errors};
    }

    return m;
}

function assertVectorsBasicallyEqual(v1, v2) {
    //console.log(`v1: [${v1.x}, ${v1.y}, ${v1.z}]`);
    //console.log(`v2: [${v2.x}, ${v2.y}, ${v2.z}]`);
    isAVector(v1);
    isAVector(v2);
    assert.strictEqual(v1.length, v2.length, "Vectors have different lengths.")
    for (var i = 0; i < v1.length; i++) {
        assert(
            basicallyEqual(v1.array[i], v2.array[i]),
            `Vector arrays differ at element [${i}]. v1: [${v1.array[i]}]. v2: [${v2.array[i]}].`);
    }
}

function assertVectorsExactlyEqual(v1, v2) {
    //console.log(`v1: [${v1.x}, ${v1.y}, ${v1.z}]`);
    //console.log(`v2: [${v2.x}, ${v2.y}, ${v2.z}]`);
    isAVector(v1);
    isAVector(v2);
    assert.strictEqual(v1.length, v2.length, "Vectors have different lengths.")
    for (var i = 0; i < v1.length; i++) {
        assert(
            v1.array[i] === v2.array[i],
            `Vector arrays differ at element [${i}]. v1: [${v1.array[i]}]. v2: [${v2.array[i]}].`);
    }
}

function basicallyEqual(n1, n2) {
    let absoluteTol = 0.000000001;
    if ((typeof n1 !== "number") || (typeof n2 !== "number")) throw "Only use basicallyEqual for numbers.";
    if (n1 === n2) return true;
    let d = Math.abs(n1 - n2);
    return d < absoluteTol;
}