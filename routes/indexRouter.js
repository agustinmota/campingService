const cabinRoutes=require('./cabinRoutes');
const campsiteRoutes= require('./campsiteRoutes');
const bookingRoutes= require('./bookingRoutes');
const guestRoutes=require('./guestRoutes');
const accommodationRoutes= require('./accommodationRoutes');
module.exports=(app)=>{

app.use('/cabin',cabinRoutes);
app.use('/campsite', campsiteRoutes);
app.use('/booking', bookingRoutes);
app.use('/guest', guestRoutes);
app.use('/accommodation', accommodationRoutes);
}