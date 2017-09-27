var assert = require('assert');
var vector = require('../vector.js');

describe("vector", function () {
    // arbitrary x,y,z values
    let x = 1.01;
    let y = -39.01;
    let z = 1093.1239;
    describe("create()", function () {

        it("should throw if the argument is not an array", function () {
            assert.throws(function () { vector.create(); }, Error);
            assert.throws(function () { vector.create(null); }, Error);
            assert.throws(function () { vector.create({}); }, Error);
            assert.throws(function () { vector.create("yo"); }, Error);
            assert.throws(function () { vector.create(3); }, Error);
        });
        it("should throw if multiple arguments are provided", function () {
            assert.throws(function () { vector.create([1,2],[3,4]); }, Error);
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
        it("should create a 1D vector from an array of numbers", function () {
            let v = vector.create([x,y]);
            isAVector(v);
            assert.equal(v.dimension, 1);
        });
        it("should create a 2D, length 2 vector from an array of arrays of 2 numbers", function () {
            let v = vector.create(
                [
                    [x,y],
                    [x,y]
                ]
            );
            isAVector(v);
            isAVector(v.array[0]);
            isAVector(v.array[1]);
            assert.equal(v.length, 2, "length");
            assert.equal(v.get(0).length, 2, "length of sub-vector 0");
            assert.equal(v.get(1).length, 2, "length of sub-vector 1");
            assert.equal(v.dimension, 2, "dimension");
            assert.equal(v.get(0).dimension, 1, "dimension of sub-vector 0");
            assert.equal(v.get(1).dimension, 1, "dimension of sub-vector 1");
        });
        it("should create a 3D vector from an array of arrays of arrays of numbers", function () {
            let v = vector.create(
                [
                    [
                        [0,1],
                        [2,3]
                    ],
                    [
                        [4,5],
                        [6,7]
                    ],
                ]
            );
            isAVector(v);
            isAVector(v.array[0]);
            isAVector(v.array[1]);
            isAVector(v.array[0].array[0]);
            isAVector(v.array[0].array[1]);
            isAVector(v.array[1].array[0]);
            isAVector(v.array[1].array[1]);
            assert.equal(v.dimension, 3);
        });
    });

    describe("create2()", function () {
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

    describe("create2x2()", function () {
        it("should throw if no argument is provided", function () {
            assert.throws(vector.create2x2, Error);
        });
        it("should create a 2D, length 2 vector from a single input", function () {
            let v = vector.create2x2(x);
            isAVector(v);
            assert.strictEqual(v.length, 2, "length");
            assert.strictEqual(v.dimension, 2, "dimension");
            assert.strictEqual(v.get([0,0]), x);
            assert.strictEqual(v.get([0,1]), x);
            assert.strictEqual(v.get([1,0]), x);
            assert.strictEqual(v.get([1,1]), x);
        });
        it("should create a 2D, length 2 vector from two inputs", function () {
            let v = vector.create2x2(x, y);
            isAVector(v);
            assert.strictEqual(v.length, 2, "length");
            assert.strictEqual(v.dimension, 2, "dimension");
            assert.strictEqual(v.get([0,0]), x);
            assert.strictEqual(v.get([0,1]), y);
            assert.strictEqual(v.get([1,0]), x);
            assert.strictEqual(v.get([1,1]), y);
        });
        it("should create a 2D, length 2 vector from all arguments", function () {
            let v = vector.create2x2(x, y, z, z*2);
            isAVector(v);
            assert.strictEqual(v.length, 2, "length");
            assert.strictEqual(v.dimension, 2, "dimension");
            assert.strictEqual(v.get([0,0]), x);
            assert.strictEqual(v.get([0,1]), y);
            assert.strictEqual(v.get([1,0]), z);
            assert.strictEqual(v.get([1,1]), z*2);
        });
    });

    describe("createRandom()", function () {
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

    describe("get()", function () {
        it("should throw if the element is out of bounds", function(){
            assert.throws(() => vector.create([1]).get(1));
        });
        it("should get the correct element from a 1D matrix", function(){
            assert.strictEqual(vector.create([0,1,2]).get(2), 2);
        });
        it("should get the correct element from a 2D matrix", function(){
            let v = vector.create([[0,2],[3,4]]);
            let row0 = v.get(0);
            let row1 = v.get(1);
            isAVector(row0);
            isAVector(row1);
            assert.strictEqual(row0.get(0), 0);
            assert.strictEqual(row0.get(1), 2);
            assert.strictEqual(row1.get(0), 3);
            assert.strictEqual(row1.get(1), 4);
        });
        it("should get the correct element from a 2D matrix via array", function(){
            let v = vector.create([[0,2],[3,4]]);
            assert.strictEqual(v.get([0,0]), 0);
            assert.strictEqual(v.get([0,1]), 2);
            assert.strictEqual(v.get([1,0]), 3);
            assert.strictEqual(v.get([1,1]), 4);
        });
    });

    describe("size()", function () {
        it("should get an array of the lengths of each dimension (1D)", function () {
            let v = vector.create([x, y, z]);
            let s = doBoth(
                () => vector.size(v),
                () => v.size(),
                () => null);
            assert.deepEqual(s, [3]);
        });
        it("should get an array of the lengths of each dimension (2D)", function () {
            let v = vector.create([[x, y, z],[1, 2, 3]]);
            let s = doBoth(
                () => vector.size(v),
                () => v.size());
            assert.deepEqual(s, [2,3]);
        });
        it("should get an array of the lengths of each dimension (2D)", function () {
            let v = vector.create([[[x, y, z],[1, 2, 3]],[[4, 5, 6],[7, 8, 9]]]);
            let s = doBoth(
                () => vector.size(v),
                () => v.size());
            assert.deepEqual(s, [2,2,3]);
        });
        it("should get an array of the lengths of each dimension (3D)", function () {
            let v = vector.create([x, y, z]);
            let s = doBoth(
                () => vector.size(v),
                () => v.size());
            assert.deepEqual(s, [3]);
        });
    });

    describe("map()", function () {
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

    describe("cascadeMap()", function () {
        it("should map a function onto each element", function () {
            let v = vector.create([[[1,2],[3,4]],[[5,6],[7,8]]]);
            let triple = (x) => x*3;
            let s = doBoth(
                () => vector.cascadeMap(v, triple),
                () => v.cascadeMap(triple),
                assertVectorsExactlyEqual);
            assertVectorsExactlyEqual(s, vector.create([[[3,6],[9,12]],[[15,18],[21,24]]]));
        });
    });

    describe("reduce()", function () {
        it("should provide an analogue to Array.reduce()", function () {
            let v = vector.create([x, y, z]);
            let r = v.reduce((acc, val) => acc + val, 0);
            assert.strictEqual(r, x + y + z);
        });
    });

    describe("cascadeReduce()", function () {
        it("should reduce a 3D vector to a single element", function () {
            let v = vector.create([[[1,2],[3,4]],[[5,6],[7,8]]]);
            let accumulator = (prev, next) => prev + next;
            let s = doBoth(
                () => vector.cascadeReduce(v, accumulator, 100),
                () => v.cascadeReduce(accumulator, 100),
                assert.strictEqual);
            assert.strictEqual(s, 100+1+2+3+4+5+6+7+8);
        });
    });

    describe("magnitude()", function () {
        it("should throw for dimension > 1", function () {
            let v = vector.create([[3, 4],[1, 2]]);
            assert.throws(() => v.magnitude(), Error);
            assert.throws(() => vector.magnitude(v), Error);
        });
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

    describe("normalise()", function () {
        function doNormaliseAssertions(normalised, original, expected) {
            isAVector(normalised);
            assert.strictEqual(normalised.length, original.length, "normalised vector should have the same length as the unnormalised.");
            if (!normalised.array.every(e => e === 0))
                assert.strictEqual(normalised.magnitude(), 1, "normalised vector should have magnitude 1.");
            else
                assert.strictEqual(normalised.magnitude(), 0, "normalised vector of a zero vectorshould have magnitude 0.");
            assertVectorsBasicallyEqual(normalised, expected);
        }
        it("should throw for dimension > 1", function () {
            let v = vector.create([[3, 4],[1, 2]]);
            assert.throws(() => v.normalise(), Error);
            assert.throws(() => vector.normalise(v), Error);
        });
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

    describe("transpose()", function () {
        it("should transpose a 1D vector to a kinda-2D vector", function() {
            let v = vector.create([1, 2, 3]);
            let n = doBoth(
                () => vector.transpose(v),
                () => v.transpose(),
                assertVectorsExactlyEqual);
            let expected = vector.create([[1],[2],[3]]);
            assertVectorsExactlyEqual(n, expected);
        });
        it("should transpose a 2D vector", function () {
            let v = vector.create([[1, 2, 3],[1, 2, 3],[1, 2, 3]]);
            let n = doBoth(
                () => vector.transpose(v),
                () => v.transpose(),
                assertVectorsExactlyEqual);
            let expected = vector.create([[1,1,1],[2,2,2],[3,3,3]]);
            assertVectorsExactlyEqual(n, expected);
        });
        it("should throw for dimension > 2", function () {
            let v = vector.createWithDimensions([2,2,2], 0);
            let n = doBoth(
                () => vector.transpose(v),
                () => v.transpose(),
                () => null);
            assert.equal(n.errors.both, true);
        });
    });

    describe("negate()", function () {
        it("should negate a 1D vector", function () {
            let v = vector.create([1, -2, 3]);
            let n = doBoth(
                () => vector.negate(v),
                () => v.negate(),
                assertVectorsExactlyEqual);
            let expected = vector.create([-1,2,-3]);
            assertVectorsExactlyEqual(n, expected);
        });
        it("should negate a 2D vector", function () {
            let v = vector.create2x2(-3,-2,1,3);
            let n = doBoth(
                () => vector.negate(v),
                () => v.negate(),
                assertVectorsExactlyEqual);
            let expected = vector.create2x2(3,2,-1,-3);
            assertVectorsExactlyEqual(n, expected);
        });
    });

    describe("add()", function () {
        it("should add two vectors", function () {
            let v1 = vector.create([1, -2, 3]);
            let v2 = vector.create([2, 2, 2]);
            let r = doBoth(
                () => vector.add(v1, v2),
                () => v1.add(v2),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([3, 0, 5]));
        });
        it("should add two 2D vectors", function () {
            let v1 = vector.create2x2(1,2,3,4);
            let v2 = vector.create2x2(4,5,6,7);
            let r = doBoth(
                () => vector.add(v1, v2),
                () => v1.add(v2),
                (v1, v2) => numberArraysEqual(v1.size(), v2.size()));
            // assertVectorsBasicallyEqual(r, vector.create([3, 0, 5]));
        });
        it("should throw if vectors have different lengths", function () {
            let v1 = vector.create([1, -2]);
            let v2 = vector.create([2, 2, 3]);
            let r = doBoth(
                () => vector.add(v1, v2),
                () => v1.add(v2));
            assert(r.errors.both, "Both static and member functions should have thrown.");
        });
        it("should throw if vectors have different sizes", function () {
            let v1 = vector.create2x2(0,0);
            let v2 = vector.create2(0,0);
            let r = doBoth(
                () => vector.add(v1, v2),
                () => v1.add(v2));
            assert(r.errors.both, "Both static and member functions should have thrown.");
        });
    });

    describe("addScalar()", function(){
        it("should add a vector and a scalar", function () {
            let v1 = vector.create([1, -2, 3]);
            let r = doBoth(
                () => vector.addScalar(v1, 10),
                () => v1.addScalar(10),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([11, 8, 13]));
        });
        it("should add a 3D vector and a scalar", function () {
            let v1 = vector.createWithDimensions([3, 3, 3], 7);
            let r = doBoth(
                () => vector.addScalar(v1, 10),
                () => v1.addScalar(10),
                assertVectorsExactlyEqual);
            assertVectorsExactlyEqual(r, vector.createWithDimensions([3, 3, 3], 17));
        });
    });

    describe("sub()", function () {
        it("should subtract one vector from another", function () {
            let v1 = vector.create([1, -2, 3]);
            let v2 = vector.create([2, 2, 2]);
            let r = doBoth(
                () => vector.sub(v1, v2),
                () => v1.sub(v2),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([-1, -4, 1]));
        });
        it("should subtract one big vector from another", function () {
            let v1 = vector.createWithDimensions([2, 3, 3],10);
            let v2 = vector.createWithDimensions([2, 3, 3],3);
            let r = doBoth(
                () => vector.sub(v1, v2),
                () => v1.sub(v2),
                assertVectorsExactlyEqual);
            assertVectorsExactlyEqual(r, vector.createWithDimensions([2, 3, 3],7));
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

    describe("subScalar()", function(){
        it("should subtract a scalar from a vector", function () {
            let v1 = vector.create([1, -2, 3]);
            let r = doBoth(
                () => vector.subScalar(v1, 10),
                () => v1.subScalar(10),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([-9, -12, -7]));
        });
    });

    describe("multiplyScalar()", function () {
        it("should multiply a vector and a scalar", function () {
            let v = vector.create([1, -2, 3]);
            let s = -10;
            let r = doBoth(
                () => vector.multiplyScalar(v, s),
                () => v.multiplyScalar(s),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([-10, 20, -30]));
        });
    });

    describe("multiplyElementWise()", function () {
        it("should multiply two vectors element-wise", function () {
            let v1 = vector.create2x2(1,2,3,4);
            let v2 = vector.create2x2(1,2,10,20);
            let r = doBoth(
                () => vector.multiplyElementWise(v1, v2),
                () => v1.multiplyElementWise(v2),
                assertVectorsExactlyEqual);
            assertVectorsExactlyEqual(r, vector.create2x2(1,4,30,80));
        });
    });

    describe("matrixMultiply()", function () {
        it("should multiply n * [n,1]", function () {
            let v1 = vector.create([1,2,3]);
            let v2 = vector.create([[4],[5],[6]]);
            let r = doBoth(
                () => vector.matrixMultiply(v1, v2),
                () => v1.matrixMultiply(v2));
            let expected = (1*4)+(2*5)+(3*6);
            assert.strictEqual(r, expected);
        });
        it("should multiply [n,1] * n", function () {
            let v1 = vector.create([[1],[2],[3]]);
            let v2 = vector.create([4,5,6]);
            let r = doBoth(
                () => vector.matrixMultiply(v1, v2),
                () => v1.matrixMultiply(v2),
            assertVectorsExactlyEqual);
            let expected = vector.create(
                [[(1*4)+(1*5)+(1*6)],
                 [(2*4)+(2*5)+(2*6)],
                 [(3*4)+(3*4)+(3*6)]])
            assertVectorsExactlyEqual(r, expected);
        });
        it("should multiply [1,n] * [n,1]", function () {
            let v1 = vector.create([[1,2,3]]);
            let v2 = vector.create([[4],[5],[6]]);
            let r = doBoth(
                () => vector.matrixMultiply(v1, v2),
                () => v1.matrixMultiply(v2));
            let expected = (1*4)+(2*5)+(3*6);
            assert.strictEqual(r, expected);
        });
        it("should multiply [n,1] * [1,n]", function () {
            let v1 = vector.create([[1],[2],[3]]);
            let v2 = vector.create([[4,5,6]]);
            let r = doBoth(
                () => vector.matrixMultiply(v1, v2),
                () => v1.matrixMultiply(v2),
            assertVectorsExactlyEqual);
            let expected = vector.create(
                [[(1*4),(1*5),(1*6)],
                 [(2*4),(2*5),(2*6)],
                 [(3*4),(3*4),(3*6)]])
            assertVectorsExactlyEqual(r, expected);
        });
        it("should multiply [n*n] * [n,1]", function () {
            let v1 = vector.create(
                [[1,2,3],
                 [4,5,6],
                 [7,8,9]]);
            let v2 = vector.create([[4],[5],[6]]);
            let r = doBoth(
                () => vector.matrixMultiply(v1, v2),
                () => v1.matrixMultiply(v2),
            assertVectorsExactlyEqual);
            let expected = vector.create(
                [[(1*4)+(2*5)+(3*6)],
                 [(4*4)+(5*5)+(6*6)],
                 [(7*4)+(8*4)+(9*6)]])
            assertVectorsExactlyEqual(r, expected);
        });
        it("should multiply [n*n] * [n,n]", function () {
            let v1 = vector.create(
                [[1,2,3],
                 [4,5,6],
                 [7,8,9]]);
            let v2 = vector.create(
                [[11,12,13],
                 [14,15,16],
                 [17,18,19]]);
            let r = doBoth(
                () => vector.matrixMultiply(v1, v2),
                () => v1.matrixMultiply(v2),
            assertVectorsExactlyEqual);
            let expected = vector.create(
                [[(1*11)+(2*14)+(3*17),(1*12)+(2*15)+(3*18),(1*13)+(2*16)+(3*19)],
                 [(4*11)+(5*14)+(6*17),(4*12)+(5*15)+(6*18),(4*13)+(5*16)+(6*19)]
                 [(7*11)+(8*14)+(9*17),(7*12)+(8*15)+(9*18),(7*13)+(8*16)+(9*19)]])
            assertVectorsExactlyEqual(r, expected);
        });
    });

    describe("divideScalar()", function () {
        it("should divide a vector by a scalar", function () {
            let v = vector.create([1, -2, 3]);
            let s = -10;
            let r = doBoth(
                () => vector.divideScalar(v, s),
                () => v.divideScalar(s),
                assertVectorsBasicallyEqual);
            assertVectorsBasicallyEqual(r, vector.create([-0.1, 0.2, -0.3]));
        });
    });

    describe("equals()", function () {
        it("should return true for equal 1D vectors", function () {
            let v1 = vector.create([1,2,3,4]);
            let v2 = vector.create([1,2,3,4]);
            let r = doBoth(
                () => vector.equals(v1, v2),
                () => v1.equals(v2));
            assert.strictEqual(r, true);
        });
        it("should return true for equal 2D vectors", function () {
            let v1 = vector.create2x2(1,2,3,4);
            let v2 = vector.create2x2(1,2,3,4);
            let r = doBoth(
                () => vector.equals(v1, v2),
                () => v1.equals(v2));
            assert.strictEqual(r, true);
        });
        it("should return true for equal 3D vectors", function () {
            let v1 = vector.create([[[1,2],[3,4]],[[5,6],[7,8]],[[9,0],[1,2]]]);
            let v2 = vector.create([[[1,2],[3,4]],[[5,6],[7,8]],[[9,0],[1,2]]]);
            let r = doBoth(
                () => vector.equals(v1, v2),
                () => v1.equals(v2));
            assert.strictEqual(r, true);
        });
        it("should return false for equal 1D vectors", function () {
            let v1 = vector.create([1,2,3,9]);
            let v2 = vector.create([1,2,3,4]);
            let r = doBoth(
                () => vector.equals(v1, v2),
                () => v1.equals(v2));
            assert.strictEqual(r, false);
        });
        it("should return false for equal 2D vectors", function () {
            let v1 = vector.create2x2(1,7,3,4);
            let v2 = vector.create2x2(1,2,3,4);
            let r = doBoth(
                () => vector.equals(v1, v2),
                () => v1.equals(v2));
            assert.strictEqual(r, false);
        });
        it("should return false for equal 3D vectors", function () {
            let v1 = vector.create([[[1,2],[3,4]],[[10,6],[7,8]],[[9,0],[1,2]]]);
            let v2 = vector.create([[[1,2],[3,4]],[[5,6],[7,8]],[[9,0],[1,2]]]);
            let r = doBoth(
                () => vector.equals(v1, v2),
                () => v1.equals(v2));
            assert.strictEqual(r, false);
        });
        it("should return false for different size vectors", function () {
            let v1 = vector.create([[[1,2],[3,4]],[[10,6],[7,8]],[[9,0],[1,2]]]);
            let v2 = vector.create2x2(1,2,3,4);
            let r = doBoth(
                () => vector.equals(v1, v2),
                () => v1.equals(v2));
            assert.strictEqual(r, false);
        });
    });

    describe("floor()", function () {
        it("should produce the element-wise floor function", function () {
            let v = vector.create([1.02312, -23.1239, 159.3213]);
            let s = -10;
            let r = doBoth(
                () => vector.floor(v),
                () => v.floor(),
                assertVectorsExactlyEqual);
            assertVectorsExactlyEqual(r, vector.create([1, -24, 159]));
        });
    });

    describe("createWithDimensions()", function () {
        it("should create with 2D dimensions", function () {
            let v = vector.createWithDimensions([2,3],1);
            assert.strictEqual(v.dimension, 2);
            assert.strictEqual(v.get([0,0]), 1);
            assert.strictEqual(v.get([1,1]), 1);
            assert.strictEqual(v.get([0,2]), 1);
            assert.strictEqual(v.get([1,0]), 1);
            assert.strictEqual(v.get([0,1]), 1);
            assert.strictEqual(v.get([1,2]), 1);
        });
        it("should create with 3D dimensions", function () {
            let v = vector.createWithDimensions([2,3,4],2);
            assert.strictEqual(v.dimension, 3);
            assert.strictEqual(v.get([0,0,0]), 2);
            assert.strictEqual(v.get([1,1,1]), 2);
            assert.strictEqual(v.get([1,2,3]), 2);
            assert.strictEqual(v.get([1,2,3]), 2);
        });
    });

});

function isAVector(v) {
    assert.strictEqual("object", typeof v);
    assert(Array.isArray(v.array));
    assert.strictEqual("number", typeof v.length);
    assert.strictEqual(v.isAVector, true);
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
        m = memberFunction();
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
    assert.equal(vector.equals(v1,v2), true, `Vectors are not equal:\r\n${v1}\r\n${v2}`);
}

function basicallyEqual(n1, n2) {
    let absoluteTol = 0.000000001;
    if ((typeof n1 !== "number") || (typeof n2 !== "number")) throw "Only use basicallyEqual for numbers.";
    if (n1 === n2) return true;
    let d = Math.abs(n1 - n2);
    return d < absoluteTol;
}

function numberArraysEqual(first, second){
    if(!Array.isArray(first)) throw new Error("first must be an array.");    
    if(!Array.isArray(second)) throw new Error("second must be an array.");
    if(first.length !== second.length) return false;
    for (var i = 0; i < first.length; i++) {
        if(first[i] !== second[i]) return false;
    }
    return true;
}