import mongoose,{Schema,models,model} from 'mongoose';
const S=new Schema({turbineId:String,timestamp:Date,windSpeed:Number,windDirection:Number,nacelleYaw:Number,activePowerKW:Number,theoreticalPowerKW:Number,turbulenceIntensity:Number,airDensity:Number},{collection:'scada_telemetry'});export default models.Telemetry||model('Telemetry',S);
