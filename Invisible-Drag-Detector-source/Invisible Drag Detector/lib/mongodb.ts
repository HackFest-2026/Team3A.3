import mongoose from 'mongoose';
const uri=process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/invisible-drag-detector';
let cached=(global as typeof globalThis & {mongoose?:{conn:any,promise:any}}).mongoose;
if(!cached) cached=(global as typeof globalThis & {mongoose?:{conn:any,promise:any}}).mongoose={conn:null,promise:null};
export async function db(){if(cached!.conn)return cached!.conn;if(!cached!.promise)cached!.promise=mongoose.connect(uri).then(m=>m);cached!.conn=await cached!.promise;return cached!.conn}
