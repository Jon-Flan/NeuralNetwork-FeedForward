"use strict"

//Matrix class for Matrix calculations
class Matrix{

    //constructor for taking in variables for matrix calculations
    constructor(rows, cols, data = []){

        // underscore used to declare private variables
        this._rows = rows;
        this._cols = cols;
        this._data = data;

        //initialise with zeros if no data provided
        if(data == null || data.length == 0){
            this._data = [];
            //loop through each of the rows
            for(let i = 0; i < this._rows; i++){
                this._data[i] = [];
                //loop through each of the cols
                for(let j = 0; j < this._cols; j++){
                    this._data[i][j] = 0;
                }
            }
        } else{
            //check the data provided integrety
            if(data.length != rows || data[0].length != cols){
                throw new Error("Incorrect dimensions provided");
            }
        }
    }

    //getters
    get rows(){
        return this._rows;
    }

    get cols(){
        return this._cols;
    }

    get data(){
        return this._data;
    }

    //add two matrices together (static method so we can call it directly)
    static add(m0,m1){
        //check dimensions compatible
        Matrix.checkDims(m0,m1);

        //new return matrix
        let m = new Matrix(m0.rows, m0.cols);
        
        //loop through and add together
        for(let i = 0; i < m.rows; i++){
            for(let j = 0; j < m.cols; j++){
                m.data[i][j] = m0.data[i][j] + m1.data[i][j];
            }
        }

        return m;
    }

    //subtract two matrices from eachother (static method so we can call it directly)
    static subtract(m0,m1){
        //check dimensions compatible
        Matrix.checkDims(m0,m1);

        //new return matrix
        let m = new Matrix(m0.rows, m0.cols);
        
        //loop through and add together
        for(let i = 0; i < m.rows; i++){
            for(let j = 0; j < m.cols; j++){
                m.data[i][j] = m0.data[i][j] - m1.data[i][j];
            }
        }

        return m;
    }

    //multiply two matrices together (Not DOT Product) (static method so we can call it directly)
    static multiply(m0,m1){
        //check dimensions compatible
        Matrix.checkDims(m0,m1);

        //new return matrix
        let m = new Matrix(m0.rows, m0.cols);
        
        //loop through and add together
        for(let i = 0; i < m.rows; i++){
            for(let j = 0; j < m.cols; j++){
                m.data[i][j] = m0.data[i][j] * m1.data[i][j];
            }
        }

        return m;
    }

    //Calculate the DOT product of 2 matrices
    static dotProd(m0, m1){
        //for compatiable DOT product calculation, first matrix cols must match second matrix rows
        if(m0.cols != m1.rows){
            throw new Error("Matrices not compatible for DOT product");
        }

        //create new return matrix (the size will be the same as the "outside numbers")
        //Example: 4 x 2 and 2 x 4 = a 4 x 4 matrix
        let m = new Matrix(m0.rows, m1.cols);

        //loop through the matrix
        for(let i = 0; i < m.rows; i++){
            for(let j = 0; j< m.cols; j++){
                //multiply each cell of m0 row with each cell of m1 col and add products together
                let sum = 0;
                for(let k = 0; k < m0.cols; k++){
                    sum += m0.data[i][k] * m1.data[k][j]
                }
                m.data[i][j] = sum;
            }
        }
        return m;
    }

    //map a function to each cell of a matrix
    static map(m0, mFunc){
        //new return matrix
        let m = new Matrix(m0.rows, m0.cols);

        //loop over the matrix rows/cols
        for(let i = 0; i < m.rows; i++){
            for(let j =0; j < m.cols; j++){
                //apply the function to the m0 data and assign to the new return matrix
                m.data[i][j] = mFunc(m0.data[i][j]);
            }
        }
        return m;
    }

    //convert an array to a single row matrix
    static convert(arr){
        //placing the data from arr inside another array
        return new Matrix(1, arr.length, [arr]); 
    }

    //method to compare the dimensions of two matrices
    static checkDims(m0,m1){
        if(m0.rows != m1.rows || m0.cols != m1.cols){
            throw new Error("Matrix dimensions do not match")
        }
    }

    //transpose a matrix
    static transpose(m0){
        //create new return matrix, switching the cols for the rows
        let m = new Matrix(m0.cols, m0.rows);

        //loop over the given in matrix
        for(let i = 0; i < m0.rows; i++){
            for(let j = 0; j < m0.cols; j++){
                //swap cols for rows 
                m.data[j][i] = m0.data[i][j];
            }
        }
        return m;
    }

    //method for applying random weights between -1 and 1
    randomWeights(){
        //loop through the rows
        for(let i = 0; i < this.rows; i++){
            //loop through the columns
            for(let j = 0; j < this.cols; j++){
                //assign a random weight between -1 and 1
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }
}
