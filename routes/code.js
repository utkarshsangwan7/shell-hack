const express=require('express');
const router=express.Router()
const fs = require('fs');
const path= require('path');
const {exec} = require('child_process')

const saveFile = (name, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, data, function(err) {
          if(err) {
              console.log(err);
              reject()
          } else {
              console.log("The file was saved!");
              resolve()
          }
      }); 
    })
}

// Function for executing C codes
const cExecute = (data, input) => {
  return new Promise((resolve, reject)=>{
      const fileName = "test.c"
      saveFile(fileName, data)
        .then(()=>{
          // Create Input file
          fs.writeFile("input.txt", input, function(err) {
            if(err) {
                console.log(err);
                reject()
            } 
          });  
      
            // FILE SAVED SUCCESSFULLY
            // Generate the output file for it
            const filePath = path.join(__dirname,"../test.c")
            exec('gcc '+filePath, (err, stdout, stderr) => {
                if (err) {
                  // IF COMPILATION ERROR
                  console.error(`exec error: ${err}`);
                  resolve({
                    err: true,
                    output: err,
                    error: stderr
                  })
                }
                
                // SUCCESSFULL COMPILATION EXECUTING
                console.log("SUCCESSFULLY COMPILED")
                exec('a.exe < '+'input.txt', (err, stdout, stderr) => {
                  if(err){
                    console.log("ERROR "+err)
                    resolve({
                      err: true,
                      output: err,
                      error: stderr
                    })
                  }
        
                  console.log("OUTPUT ", stdout)
                  resolve({
                    err: false,
                    output: stdout
                  })
                })
              })

        })
        .catch((e)=>{
          console.log("ERROR SAVE FILE")
          console.log(e);
          const err = {
            err: true,
            output: "Internal Server Error!"
          }
          resolve(err)
        })
  }) 
}

router.post('/submit', (req,res)=>{
  const {code, input, lang} = req.body
  return cExecute(code,input)
      .then(data=>{
            res.json(data)
        })
})

module.exports = router