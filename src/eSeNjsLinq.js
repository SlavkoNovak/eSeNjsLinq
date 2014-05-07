/*
eSeNjsLinq.js
      
The MIT License (MIT)

Copyright (c) 2011-2014 Slavko Novak <slavko.novak.esen@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.     
*/

var eSeNjsLinq = eSeNjsLinq || new Object();
var _$ = _$ || eSeNjsLinq;


eSeNjsLinq.Start = function () {
    eval("eSeNjsLinq._start();");
};

eSeNjsLinq._start = function () {
    //Join Method(s)

    Object.prototype.Join = function (joinArray, leftName, rightName, joinFunc) {
        if (joinFunc) {
            var newArray = new Array();

            for (var key in this) {
                var item = this[key];

                if (typeof (item) != "function") {
                    for (var keyJoin in joinArray) {
                        var itemJoin = joinArray[keyJoin];

                        if (typeof (itemJoin) != "function") {

                            if (joinFunc(item, itemJoin) == true) {
                                var joinedItem = new Array();

                                joinedItem[leftName] = item;
                                joinedItem[rightName] = itemJoin;

                                newArray.push(joinedItem);
                            }
                        }
                    }
                }
            }

            return newArray;
        }

        return this.Join(joinArray, leftName, rightName, function (a, b) { return true; });
    };

    Object.prototype.JoinFlat = function (joinArray, leftName, rightName, joinFunc) {
        if (joinFunc) {
            var newArray = new Array();
            var thisConstructor = this.FirstOrDefault().constructor;
            var newThis = thisConstructor == Number || thisConstructor == String || thisConstructor == Date || thisConstructor == Boolean ? this.Select(function (item) { return { Object: item }; }) : this;
            var joinArrayConstructor = joinArray.FirstOrDefault().constructor;
            var newJoinArray = thisConstructor == Number || thisConstructor == String || thisConstructor == Date || thisConstructor == Boolean ? joinArray.Select(function (item) { return { Object: item }; }) : joinArray;

            for (var key in newThis) {
                var item = newThis[key];

                if (typeof (item) != "function") {
                    for (var keyJoin in newJoinArray) {
                        var itemJoin = newJoinArray[keyJoin];

                        if (typeof (itemJoin) != "function") {

                            if (joinFunc(item, itemJoin) == true) {
                                var joinedItem = new Object();

                                for (var name in item) {
                                    if (typeof (item[name]) != "function") joinedItem[leftName + "_" + name] = item[name];
                                }

                                for (var name in itemJoin) {
                                    if (typeof (itemJoin[name]) != "function") joinedItem[rightName + "_" + name] = itemJoin[name];
                                }

                                newArray.push(joinedItem);
                            }
                        }
                    }
                }
            }

            return newArray;
        }

        return this.Join(joinArray, leftName, rightName, function (a, b) { return true; });
    };


    //Restriction Method(s)

    Object.prototype.Where = function (whereFunc) {
        if (whereFunc) {
            var newArray = new Array();

            for (var key in this) {
                var item = this[key];

                if (typeof (item) != "function")
                    if (whereFunc(item) == true)
                        newArray.push(item);
            }

            return newArray;
        }

        return this;
    };


    //Projection Method(s)

    Object.prototype.Select = function (selectFunc) {
        if (selectFunc) {
            var newArray = new Array();

            for (var key in this) {
                var item = this[key];

                if (typeof (item) != "function")
                    newArray.push(selectFunc(item));
            }

            return newArray;
        }

        return this;
    };


    //Element method(s)

    Object.prototype.First = function (firstFunc) {
        if (firstFunc) return this.Where(firstFunc).First();

        if (this.Count() > 0) {
            for (var key in this)
                if (typeof (this[key]) != "function")
                    return this[key];
        }
        else
            throw "eSeNjsLinq.First: Object contains no elements";
    };

    Object.prototype.FirstOrDefault = function (firstFunc) {
        if (firstFunc) return this.Where(firstFunc).FirstOrDefault();

        if (this.Count() > 0) {
            for (var key in this)
                if (typeof (this[key]) != "function")
                    return this[key];
        }
        else
            return null;
    };

    Object.prototype.ElementAt = function (index, elementAtFunc) {
        if (elementAtFunc) return this.Where(elementAtFunc).ElementAt(index);

        var i = 0;
        var count = this.Count();

        if (count > 0) {
            if (count - 1 < index) throw "Index was out of range. Must be non-negative and less than the size of the array.Parameter name: index";

            for (var key in this) {
                if (typeof (this[key]) != "function")
                    if (i++ == index) return this[key];
            }
        }
        else
            throw "eSeNjsLinq.ElementAt: Object contains no elements";
    };


    //Ordering Method(s)

    Object.prototype.OrderBy = Array.prototype.sort;


    //Agregation method(s)

    Object.prototype.Count = function (countFunc) {
        if (countFunc) return this.Where(countFunc).Count();

        var count = 0;

        for (var key in this) {
            if (typeof (this[key]) != "function") count++;
        }

        return count;
    };

    Object.prototype.Sum = function (sumFunc) {
        var sum = 0;

        for (var key in this) {
            if (typeof (this[key]) != "function")
                sum += sumFunc ? sumFunc(this[key]) : this[key];
        }

        return sum;
    };

    Object.prototype.Average = function (averageFunc) {
        var sum = 0;
        var count = 0;

        for (var key in this) {
            if (typeof (this[key]) != "function") {
                if (averageFunc) {
                    sum += averageFunc(this[key]);
                }
                else {
                    sum += this[key];
                }

                count++;
            }
        }

        return sum / count;
    };

    Object.prototype.Min = function (minFunc) {
        var newArray = new Array();

        if (minFunc) {
            //        for (var key in this) {
            //            if (this[key] != "function")
            //                newArray.push(minFunc(this[key]))
            //        }
            newArray = this.Select(minFunc);
        }
        else {
            newArray = this;
        }

        newArray = newArray.OrderBy(function (a, b) { return a < b ? -1 : 1; });

        if (newArray.Count() > 0)
            return newArray[0];
        else
            throw "eSeNjsLinq.Min: " + "Object contains no elements";
    };

    Object.prototype.Max = function (maxFunc) {
        var newArray = new Array();

        if (maxFunc) {
            //        for (var key in this) {
            //            if (this[key] != "function")
            //                newArray.push(maxFunc(this[key]))
            //        }
            newArray = this.Select(maxFunc);
        }
        else {
            newArray = this;
        }

        newArray = newArray.OrderBy(function (a, b) { return a > b ? -1 : 1; });

        if (newArray.Count() > 0)
            return newArray[0];
        else
            throw "eSeNjsLinq.Max: Object contains no elements";
    };


    //Set methods

    Object.prototype.Distinct = function () {
        var arrayUnique = new Array();
        var newArray = Array();

        for (var key in this) {
            var item = this[key];

            if (typeof (item) != "function")
                arrayUnique[item.GetHash()] = item;
        }

        for (var key in arrayUnique) {
            if (typeof (arrayUnique[key]) != "function")
                newArray.push(arrayUnique[key]);
        }

        return newArray;
    };

    Object.prototype.Union = function (obj) {
        var newArray = new Array();

        for (var key in this) {
            if (typeof (this[key]) != "function")
                newArray.push(this[key]);
        }

        for (var key in obj) {
            if (typeof (obj[key]) != "function")
                newArray.push(obj[key]);
        }

        return newArray;
    };

    Object.prototype.Intersect = function (obj) {
        var newArray = new Array();

        for (var key in this) {
            if (typeof (this[key]) != "function") {
                var item = this[key];
                var thisHash = item.GetHash();

                for (var key in obj) {
                    if (thisHash == obj[key].GetHash()) {
                        newArray.push(item);
                        break;
                    }
                }
            }
        }

        return newArray;
    };

    Object.prototype.Except = function (obj) {
        var newArray = new Array();

        for (var key in this) {
            if (typeof (this[key]) != "function") {
                var item = this[key];
                var thisHash = item.GetHash();
                var notEqu = true;

                for (var key in obj) {
                    if (thisHash == obj[key].GetHash()) {
                        notEqu = false;
                        break;
                    }
                }

                if (notEqu) newArray.push(item);
            }
        }

        return newArray;
    };


    //Grouping method(s)

    Object.prototype.GroupBy = function (funcGroupKey, funcInto) {
        if (funcGroupKey) {
            var newArray = Array();

            for (key in this) {
                var item = this[key];

                if (typeof (item) != "function") {
                    var groupKey = funcGroupKey(item);
                    var intoVal = funcInto ? funcInto(item) : item;
                    var groupKeyHash = groupKey.GetHash();

                    if (newArray[groupKeyHash]) {
                        newArray[groupKeyHash].Value.push(intoVal);
                    }
                    else {
                        newArray[groupKeyHash] = { Value: [intoVal] };
                    }

                    newArray[groupKeyHash].Key = groupKey;
                }
            }

            return newArray.Select(function (item) { return item; });
        }

        return this;
    };


    //Partitioning method(s)

    Object.prototype.Take = function (numberOfItems) {
        var newArray = new Array();
        var i = 1;

        for (var key in this) {
            if (this[key] != "function") {
                newArray.push(this[key]);
                if (i++ >= numberOfItems) break;
            }
        }

        return newArray;
    };

    Object.prototype.TakeWhile = function (funcTakeWhile) {
        if (funcTakeWhile) {
            var newArray = new Array();

            for (var key in this) {
                if (this[key] != "function") {
                    if (funcTakeWhile(this[key]))
                        newArray.push(this[key]);
                    else
                        break;
                }
            }

            return newArray;
        }

        return this;
    };

    Object.prototype.SkipWhile = function (funcSkipWhile) {
        if (funcSkipWhile) {
            var newArray = new Array();
            var skipFlag = true;

            for (var key in this) {
                if (this[key] != "function") {
                    if (skipFlag) {
                        if (funcSkipWhile(this[key])) {
                            continue;
                        }
                        else {
                            skipFlag = false;
                            newArray.push(this[key]);
                        }
                    }
                    else {
                        newArray.push(this[key]);
                    }
                }
            }

            return newArray;
        }

        return this;
    };

    Object.prototype.Skip = function (numberOfItems) {
        var newArray = new Array();
        var i = 0;

        for (var key in this) {
            if (this[key] != "function") {
                if (i++ < numberOfItems) continue;
                newArray.push(this[key]);
            }
        }

        return newArray;
    };


    //Generate method(s)

    Number.prototype.Range = function (start, stop, step) {
        var newArray = new Array();

        if (start < stop) {
            for (var i = start; i <= stop; step ? i += step : i++)
                newArray.push(i);
        }
        else {
            for (var i = start; i >= stop; step ? i -= step : i--)
                newArray.push(i);
        }

        return newArray;
    };

    Object.prototype.Repeat = function (object, times) {
        var newArray = new Array();

        for (var i = 0; i < times; i++)
            newArray.push(object);

        return newArray;
    };


    //Quantifier method(s)

    Object.prototype.Any = function (anyFunc) {
        return this.Where(anyFunc).Count() > 0;
    };

    Object.prototype.All = function (allFunc) {
        return this.Count() == this.Where(allFunc).Count();
    };


    //Util method(s)

    Object.prototype.ForEach = function (funcForEach, retVal) {
        if (funcForEach) {
            for (var key in this) {
                if (typeof (this[key]) != "function") {
                    funcForEach(this[key]);
                }
            }
        }

        return retVal;
    };

    Object.prototype.ToJsonString = function () {
        var retString = "{";
        var firstFlag = true;

        for (var name in this) {
            if (typeof (this[name]) != "function")
                if (firstFlag) {
                    if (typeof (this[name]) == "object")
                        retString += "\"" + name + "\":" + this[name];
                    else
                        retString += "\"" + name + "\":" + "\"" + this[name] + "\"";

                    firstFlag = false;
                }
                else {
                    if (typeof (this[name]) == "object")
                        retString += ",\"" + name + "\":" + this[name];
                    else
                        retString += ",\"" + name + "\":" + "\"" + this[name] + "\"";
                }
        }

        return retString += "}";
    };

    Array.prototype.ToJsonString = function () {
        var retString = "[";
        var firstFlag = true;

        for (var index in this) {
            if (typeof (this[index]) != "function")
                if (firstFlag) {
                    retString += this[index].constructor == String ? "\"" + this[index] + "\"" : this[index];
                    firstFlag = false;
                }
                else retString += "," + this[index];
        }

        return retString += "]";
    };

    Object.prototype.GetHash = function () {
        if (typeof (this) != "object" || this.constructor == Number || this.constructor == String || this.constructor == Date || this.constructor == Boolean) {
            if (typeof (this) == "function") return "";
            else return this.constructor.name + "_" + this.toString();
        }

        var hash = this.constructor.name + "_";

        for (var key in this) {
            if (typeof (this[key]) != "function") {
                hash += typeof (this[key]) != "object" ? this.constructor.name + "_" + this[key].toString() : this[key].GetHash();
            }
        }

        return hash;
    };

    Object.prototype.In = function (inArray) {
        var test = this;

        return inArray.Where(function (item) { return item == test; }).Count() > 0;
    };

};



eSeNjsLinq.Stop = function () {
    eval("eSeNjsLinq._stop();");
};


eSeNjsLinq._stop = function () {
    delete Object.prototype.Join;
    delete Object.prototype.JoinFlat;
    delete Object.prototype.Where;
    delete Object.prototype.Select;
    delete Object.prototype.First;
    delete Object.prototype.FirstOrDefault;
    delete Object.prototype.ElementAt;
    delete Object.prototype.OrderBy;
    delete Object.prototype.Count;
    delete Object.prototype.Sum;
    delete Object.prototype.Average;
    delete Object.prototype.Min;
    delete Object.prototype.Max;
    delete Object.prototype.Distinct;
    delete Object.prototype.Union;
    delete Object.prototype.Intersect;
    delete Object.prototype.Except;
    delete Object.prototype.GroupBy;
    delete Object.prototype.Take;
    delete Object.prototype.TakeWhile;
    delete Object.prototype.SkipWhile;
    delete Object.prototype.Skip;
    delete Object.prototype.Repeat;
    delete Object.prototype.Any;
    delete Object.prototype.All;
    delete Object.prototype.ForEach;
    delete Object.prototype.ToJsonString;
    delete Object.prototype.GetHash;
    delete Object.prototype.In;
    delete Number.prototype.Range;
};


eSeNjsLinq.Execute = function (eSeNjsLinqFunc) {
    if (eSeNjsLinqFunc) {
        eSeNjsLinq.Start();
        var retVal = eSeNjsLinqFunc();
        eSeNjsLinq.Stop();

        return retVal;
    }

    return null;
};
