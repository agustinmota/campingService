const cabanaRoutes=require('../routes/cabanaRoutes');
const parcelaRoutes= require('../routes/parcelaRoutes');
const estadiaRoutes= require('../routes/estadiaRoutes');
const titularRoutes=require('../routes/titularRoutes');
const alojamientoRoutes= require('../routes/alojamientoRoutes');
module.exports=(app)=>{

app.use('/cabana',cabanaRoutes);
app.use('/parcela', parcelaRoutes);
app.use('/estadia', estadiaRoutes);
app.use('/titular', titularRoutes);
app.use('/alojamiento',alojamientoRoutes);
}