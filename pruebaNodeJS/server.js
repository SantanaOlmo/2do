import express from "express"

const app = express();


app.use(express.static("public"))

app.get("/api",(req,res)=>{
    res.send("Servidor Node funcionando conrrectamente")
})

const PORT= 5000;
app.listen(PORT,()=> console.log(`Servidor escuchando en http://localhost:${PORT}`));
