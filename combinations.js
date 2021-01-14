/**
 * call callback with all n!/k!(n-k)! combinations
 * nkCombination([1,2,3], (a)=>console.log(a.join('')))
 * nkCombination('123', (a)=>console.log(a.join('')))
 * ---
 * 123
 * 132
 * 213
 * 231
 * 312
 * 321
 *
 * @param arr - array or string
 * @param callback - (resArray)={}
 */
function nkCombination(arr = [], callback) {
    if(arr.length <= 1) {
        callback(arr);
    } else {
        for (let i = 0; i < arr.length; ++i) {
            const first = [arr[i]];
            const left = arr.slice(0, i).concat(arr.slice(i + 1));
            nkCombination(left, (a) => {
                callback(first.concat(a));
            });
        }
    }
}
module.exports = {nkCombination};

