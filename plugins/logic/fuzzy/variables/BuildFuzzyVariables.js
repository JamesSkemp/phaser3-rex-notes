import BuildFuzzyVariable from './BuildFuzzyVariable';
import ParseVariable from './variableparser/ParseVariable.js';

var BuildFuzzyVariables = function (fuzzyModule, variables) {
    if (typeof (variables) === 'string') {
        var lines = variables.split('\n');
        variables = [];
        for (var i = 0, cnt = lines.length; i < cnt; i++) {
            var line = lines[i];
            if (line.length === 0 || !line.trim()) {
                continue;
            }
            variables.push(ParseVariable(line));
        }
    }

    if (Array.isArray(variables)) {  // Fuzzy sets in array
        variables = BindFuzzySets(variables);
    }

    for (var name in variables) {
        var flv = BuildFuzzyVariable(variables[name]);
        fuzzyModule.addFLV(name, flv);
    }
}

var BindFuzzySets = function (fuzzySets) {
    var variables = {};
    for (var i = 0, cnt = fuzzySets.length; i < cnt; i++) {
        var fuzzySet = fuzzySets[i];
        var variableName = GetVariableName(fuzzySet[0]);
        if (!variables.hasOwnProperty(variableName)) {
            variables[variableName] = [];
        }
        variables[variableName].push(fuzzySet);
    }
    return variables;
}

var GetVariableName = function (setName) {
    if (setName.indexOf('.') !== -1) {
        return setName.split('.')[0];
    } else {
        return setName.replace(/[+-]*/g, '')
    }
}

export default BuildFuzzyVariables;