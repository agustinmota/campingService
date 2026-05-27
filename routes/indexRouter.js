const cabinRoutes=require('./cabinRoutes');
const campsiteRoutes= require('./campsiteRoutes');
const bookingRoutes= require('./bookingRoutes');
const guestRoutes=require('./guestRoutes');
const accommodationRoutes= require('./accommodationRoutes');
const userRoutes=require('./userRoutes');
const authRoutes=require('./authRoutes');
module.exports=(app)=>{

app.use('/cabin',cabinRoutes);
app.use('/campsite', campsiteRoutes);
app.use('/booking', bookingRoutes);
app.use('/guest', guestRoutes);
app.use('/accommodation', accommodationRoutes);
app.use('/user', userRoutes);
app.use('/tokens', authRoutes)
}