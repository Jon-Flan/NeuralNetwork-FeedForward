"use strict";
//constants
const LOG_ON = false; // Error logging on or off
const LOG_FREQ = 1000; // How often to show error logs in itertaions

//Basic feedforward neural network with a single output of 1 or 0
class NeuralNetwork{

    //constructor will take the number of inputs/hidden/outputs
    constructor(numInputs, numHidden, numOutputs){
        //input/hidden layer
        this._inputs = [];
        this._hidden = [];

        //set private variables prefaced with underscore
        this._numInputs = numInputs;
        this._numHidden = numHidden;
        this._numOutputs = numOutputs;

        //set bias
        this._bias0 = new Matrix (1, this._numHidden);
        this._bias1 = new Matrix (1, this._numOutputs);

        //weights will be two new matrices, one where the rows are the inputs and cols are the hidden
        //the next where the rows are the hidden and the cols are the ouputs
        this._weights0 = new Matrix(this._numInputs, this._numHidden);
        this._weights1 = new Matrix(this._numHidden, this._numOutputs);

        //randomise the bias intial weights
        this._bias0.randomWeights();
        this._bias1.randomWeights();

        //randomise the initial weights
        this._weights0.randomWeights();
        this._weights1.randomWeights();

        //error logging
        this._logCount = LOG_FREQ;
    }

    //getters for weights
    get weights0(){
        return this._weights0
    }

    get weights1(){
        return this._weights1
    }

    //setters for weights
    set weights0(weights){
        this._weights0 = weights;
    }

    set weights1(weights){
        this._weights1 = weights;
    }

    //getter for hidden layer
    get hidden(){
        return this._hidden;
    }

    //setter for hidden
    set hidden(hidden){
        this._hidden = hidden;
    }

    //getter for inputs
    get inputs(){
        return this._inputs;
    }

    //setter for inputs
    set inputs(inputs){
        this._inputs = inputs;
    }

    //getter for bias
    get bias0(){
        return this._bias0; 
    }

    get bias1(){
        return this._bias1;
    }

    //setter for bias
    set bias0(bias){
        this._bias0 = bias;
    }

    set bias1(bias){
        this._bias1 = bias;
    }

    //getter for error log count
    get logCount(){
        return this._logCount;
    }

    //setter for error log count
    set logCount(count){
        this._logCount = count;
    }

    //feed forward method, takes an array as input
    feedForward(inputArr){
        //convert input array into a single row matrix
        this.inputs = Matrix.convert(inputArr);
        
        //find the values for the hidden layer (InputN * Weight)+(InputN * Weight) etc...
        //which is a matrix DOT product
        this.hidden = Matrix.dotProd(this.inputs, this._weights0);

        //add the bias to the hidden layer
        this.hidden = Matrix.add(this.hidden, this.bias0);

        //apply sigmoid function (activation function) to each of the matrix cells
        this.hidden = Matrix.map(this.hidden, x => sigmoid(x));

        //find the values for output layer
        let outputs = Matrix.dotProd(this.hidden, this._weights1);

        //apply bias to the output layer
        outputs = Matrix.add(outputs, this.bias1);

        //apply activation function
        outputs = Matrix.map(outputs, x => sigmoid(x));

        //return the outputs
        return outputs;

    }

    //train the network with data
    train(inputArr, targetArr){
        
        //feed input data through the network
        let outputs = this.feedForward(inputArr);

        //calculate the output errors, to this first need to convert the target array
        let targets = Matrix.convert(targetArr);

        let outputErrs = Matrix.subtract(targets, outputs);

        //error loggin output
        if(LOG_ON){
            if(this.logCount = LOG_FREQ){
                console.log("Error Value = " + outputErrs.data[0][0])
            }
            this.logCount --;
            if(this.logCount == 0){
                this.logCount = LOG_FREQ;
            }
        }

        //calculate the deltas (errors * derivitive of the outputs)
        //the derivitive of the output is actually derivitive of the sigmoid function
        let outputDerivs = Matrix.map(outputs, x => sigmoid(x, true));
        let outputDeltas = Matrix.multiply(outputErrs, outputDerivs);

        //calculate the hidden layer erros (deltas DOT transpose of weights)
        let weights1TRans = Matrix.transpose(this._weights1);
        let hiddenErrs = Matrix.dotProd(outputDeltas, weights1TRans);

        //calculate the hidden deltas (errors * derivitive of hidden)
        let hiddenDerivs = Matrix.map(this.hidden, x => sigmoid(x, true));
        let hiddenDeltas = Matrix.multiply(hiddenErrs, hiddenDerivs);

        //update the weights (add the transpose of layers DOT deltas)
        let hiddenTrans = Matrix.transpose(this.hidden);
        this.weights1 = Matrix.add(this.weights1, Matrix.dotProd(hiddenTrans, outputDeltas));

        let inputsTrans = Matrix.transpose(this.inputs);
        this.weights0 = Matrix.add(this.weights0, Matrix.dotProd(inputsTrans, hiddenDeltas));

        //update the bias
        this.bias1 = Matrix.add(this.bias1, outputDeltas);
        this.bias0 = Matrix.add(this.bias0, hiddenDeltas);

    }
}

//sigmoid function (1 / (1 + exp-t)), this will output a value close to one no matter the number
function sigmoid(x, deriv = false){

    if(deriv){
        return x * (1 - x); //not the true derivitive but sigmoid has already been applied so x = sigmoid(x)
    }
    return 1 / (1 + Math.exp(-x));
}




