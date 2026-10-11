import mongoose,{Schema,models,model} from 'mongoose';
const Metric=new Schema({windSpeed:Number,windDirection:Number,nacelleYaw:Number,relativeYawOffset:Number,actualPowerKW:Number,expectedPowerKW:Number,residualKW:Number,dailyFinancialLossUSD:Number,mechanicalStressScore:Number,emaYawOffset72h:Number},{_id:false});
const S=new Schema({turbineId:{type:String,unique:true},farmName:String,location:{lat:Number,lng:Number},ratedCapacityKW:Number,rotorDiameterMeters:Number,status:{type:String,enum:['HEALTHY','MONITORING','CRITICAL_YAW_ERROR','MAINTENANCE']},currentMetrics:Metric,updatedAt:{type:Date,default:Date.now}},{collection:'turbines'});
export default models.Turbine||model('Turbine',S);
