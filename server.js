const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended:true}))
// SET EJS
app.set("view engine","ejs");
app.set("views","views");



const db = mysql.createConnection({
    host:"localhost",
    database:"db_todoapp",
    user:"root",
    password:""
})

db.connect((err)=>{
  if (err) throw err;

  const sql = "SELECT * FROM tb_task ORDER BY name_task ASC";
  
  // Routes API
    app.get("/", (req, res) => {
        db.query(sql, (err, result) => {
            const data = JSON.parse(JSON.stringify(result));

            res.render("index", {
                data,
                title: "To Do App",
                dataId: ""
            });
            });
        });
    app.get("/:id", (req, res) =>{
        const id = req.params.id;
        const findId = `SELECT * FROM tb_task WHERE id_task=${id}`;
        const getAll = `SELECT * FROM tb_task`;
        
        db.query(getAll, (err, resultAll) =>{
            db.query(findId, (err, resultId) =>{
                const dataAll = JSON.parse(JSON.stringify(resultAll));
                const dataId = JSON.parse(JSON.stringify(resultId));
                res.render("index", {
                  data: dataAll,
                  title: "To Do App",
                  dataId : dataId[0]
                });
            })
        })
    })

    app.post("/tambah", (req, res) => {
        const {task} = req.body;
        const insertSql = `INSERT INTO tb_task (name_task) VALUES ('${task}')`
        
        db.query(insertSql, (err, result) =>{
            if(err) throw err;
            res.redirect("/")
        })
    });

    app.post("/update",(req,res)=>{
        const {id,task} = req.body;
        const updateData = `UPDATE tb_task SET name_task = ?WHERE id_task=?`;
        db.query(updateData,[task,id],(err,result)=>{
            if(err) throw err
            res.redirect("/")
        })
    })
    
    app.get("/delete/:id",(req,res)=>{
        const id = req.params.id
        const deleteData = `DELETE FROM tb_task WHERE id_task=?`
        db.query(deleteData,id,(err, result)=>{
            if(err) throw err;
            res.redirect("/")
        })
    })
  


 
})




app.listen(port, () => console.log(`Server berjalan di port ${port}`));
