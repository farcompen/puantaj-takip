const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
app.use(cors());
app.use(express.json({ limit: "30mb" }));
let days = [];
const approveStatus = {
  aktif:1,
  red:2
};
const workDetail={
  default:"İSM onayı bekleniyor",
  
}
const dbConfig = process.env.MONGODB_URL;
try {
  mongoose.connect(dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  handleError(err);
}
process.on("unhandledRejection", (error) => {
  console.log("unhandled rejection", error.message);
});

app.get("/api/up", async (req, res) => {
  res.status(200).send({
    status: "success",
    message: "Server is up",
  });
});

//#region  role  model and functions
const roleSchema = mongoose.Schema({
  name: String,
  active: Boolean,
});
const roleModel = mongoose.model("role", roleSchema);

const createRole = async (role) => {
  const newRole = new roleModel(role);
  const result = await newRole.save();
  if (!result) {
    throw new Error("role tanımlarken hata");
  }
};

const fetchRoles = async () => {
  return await roleModel.find();
};

//#endregion
//#region  admin model and functions

const adminSchema = mongoose.Schema({
  identityNumber: String,
  name: String,
  surname: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "location",
  },
  branch: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
  },
  email: String,
  password: String,
  active: Boolean,
  ustBirim:String
});
const adminModel = mongoose.model("admin", adminSchema);
const createAdmin = async (admin) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  admin.password = await bcrypt.hash(admin.password, salt);
  admin.active=true;
  admin.role=process.env.ROLE;

  const newAdmin = new adminModel(admin);
  const result = await newAdmin.save();
  if (!result) {
    throw new Error("admin eklerken hata");
  }
};

const fetchAdmins = async () => {
  return await adminModel.find()
                     .populate("location");
};

const fetchLocationAdmins = async () => {
  const admins = await adminModel
    .find({ role:process.env.ROLE,active:true })
    .select({  password: 0 })
    .populate("location")
    .exec();
  if (admins) {
    return admins;
  } else {
    throw new Error("Liste getirilemedi");
  }
};

const fetchAdminById=async(id)=>{
  const admin = await adminModel.findOne({_id:id}).select({username:0,password:0,active:0})
                .populate("location")
  return admin;
}

const updateAdmin=async(id,value)=>{
  const filter = {_id:id};
  const updateResult = await adminModel.findOneAndUpdate(filter,value);
  if(!updateResult){
    throw new Error("Admin update ederken hata. Tekrar deneyiniz");
  }
  return updateResult;
}
//#endregion
//#region User model and functions
const userSchemea = mongoose.Schema({
  identityNumber: String,
  name: String,
  surname: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "location",
  },
  branch: String,
 
  active: Boolean,
  adminId: String,
  mahsuplasmaValue:Number
});

const userModel = mongoose.model("user", userSchemea);

const createUser = async (user) => {
  const newUser = new userModel(user);
  const result = await newUser.save();
  if (!result) {
    throw new Error("Kullanıcı tanımlarken hata");
  }
};

const fetchUsers = async (adminId) => {
  console.log("admin id is ",adminId);
  const users = await userModel.find({adminId:adminId,active:true})
                  .populate("location");
  return users;
};

const updateUser=async(id,value)=>{
  const filter = {_id:id}
  const result = await userModel.findOneAndUpdate(filter,value)
}

const updateUserMahsuplasmaValue=async(id,value)=>{
  const user = await userModel.find({_id:id});
 
  let currentMahsuplasmaDeger = user.mahsuplasmaValue;
  currentMahsuplasmaDeger=currentMahsuplasmaDeger-value;
 const filter = {_id:id}
  const result =await userModel.findOneAndUpdate(filter,{
                    mahsuplasmaValue:currentMahsuplasmaDeger});
if(!result){
  throw new Error("Kullanıcı mahsuplaşma alanı güncellenemedi")
}
                  }
//#endregion

//#region  location model and functions

const locationSchema = mongoose.Schema({
  name: String,
  active: Boolean,
});

const locationModel = mongoose.model("location", locationSchema);

const createLocation = async (location) => {
  const newLocation = new locationModel(location);
  let result = await newLocation.save();
  result = result.toObject();
  if (!result) {
    throw new Error("Lokasyon tanımlarken hata alındı");
  }
  return result;
};
const fetchLocation = async (id) => {
  return await locationModel.find({ _id: id });
};
const fetchAllLocation = async()=>{
  console.log("locations get isteği geldi")
  return await locationModel.find({active:true});
}
const updateLocation = async(id,value)=>{
  const filter = {_id:id};
  const result = await locationModel.findOneAndUpdate(filter,value);
  if(!result){
    throw new Error("Kurum silinirken hata oluştu.Tekrar deneyiniz");
  }
  return result;
}
//#endregion

//#region periods model and functions
const userDetail={
  name:String,
  surname:String,
  id:String,
  branch:String,
  activeWorkingDaysInMonth: Number,
  activeHours:Number,

}
const periodSchema = mongoose.Schema({
  year: Number,
  month: Number,
  name: String,
  active: Boolean,
  detail:[userDetail],

});


const periodModel = mongoose.model("period", periodSchema);

const createPeriod = async (period) => {
  const newPeriod = new periodModel(period);
  const result = await newPeriod.save();
  if (!result) {
    throw new Error("Dönem tanımlarken hata");
  }
};

const fetchPeriod = async () => {
  return await periodModel.find({active:true}).sort({ _id: -1 }).limit(1);
};
const fetchAllPeriod = async () => {
  return await periodModel.find({active:true});

          
};

const fetchPeriodOfAdmin = async(id)=>{
  return await periodModel.find({admin:id}).sort({ _id: -1 }).limit(1);
}

const updatePeriod = async(id,value)=>{
  const filter = {_id:id};
  const result = await periodModel.findOneAndUpdate(filter,value);
  return result;

}
//#endregion

//#region workings model and functions
const workingHours = {
  day: Number,
  sabah: String,
  aksam: String,
};
const workingSchema = mongoose.Schema({
  period: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "period",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  dayHour: [workingHours],
  createdUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  fiili: Number,
  activeWorkingTime: Number,
  active: Boolean,
  localApprove: Boolean,
  adminApprove: Boolean,
  fazlaMesai: String,
  geceCalisma: String,
  bayram: String,
  esasOdeme: String,
  sabah: Number,
  aksam: Number,
  status: Number,
  detail:String,
  mahsuplasmaValue:Number
});
const workingModel = mongoose.model("working", workingSchema);

const createWorkings = async (workings) => {
  checkWorkingFields(workings);
  await checkIfContentShouldBe(workings.dayHour);
  await checkIfUserAndPeriodAlreadySaved(workings.user, workings.period);
  let sum = 0;
  let sabah = 0;
  let aksam = 0;
  await workings.dayHour.map((day) => {
    Number(day.sabah) ? (sabah += Number(day.sabah)) : (sabah += 0);
    Number(day.aksam) ? (aksam += Number(day.aksam)) : (aksam += 0);
  });
  // workings.fiili = await calculateFiili(workings.dayHour);

  workings.fiili = sabah + aksam;
  workings.activeWorkingTime = await calculateActiveWorkingTime(
    workings.period,
    workings.admin.id,
    workings.dayHour
  );
  workings.sabah = sabah;
  workings.aksam = aksam;
  workings.localApprove = false;
  workings.adminApprove = false;
  workings.status = approveStatus.aktif;
  if(workings.fiili>workings.activeWorkingTime){
    workings.fazlaMesai=workings.fiili-workings.activeWorkingTime;
    workings.esasOdeme=workings.fiili-workings.activeWorkingTime
  }
  workings.detail=workDetail.default;
  if (workings.geceCalisma != aksam) {
    throw new Error(
      `Gece çalışma bilgileri uyuşmuyor. Gönderilen ${aksam} girilen ${workings.geceCalisma}`
    );
  }
  const newWorking = new workingModel(workings);
  console.log(newWorking);
  const result = await newWorking.save();
  if (!result) {
    throw new Error("Çalışma bilgileri kaydedilemedi");
  }
   
  return result;
};
const receiveWorkingsData = async () => {
  let result = await workingModel
    .find({ active: false, localApprove: true })
    .populate("user")
    .populate("period")
    .exec();
  // //const activeWorkinDays = result[0].period.activeWorkingDaysInMonth;
  // result.map((work) => {
  //   work.activeWorkingTime = activeWorkinDays * work.user.workingHourInDay;
  // });
  return result;
};
const checkIfUserAndPeriodAlreadySaved = async (userId, periodId) => {
  const working = await workingModel.findOne({
    user: userId,
    period: periodId,
    active: true,
    localApprove: true,
    status:approveStatus.aktif
  });
  if (working) {
    throw new Error("Bu dönem için bu kullanıcıya kayıt önceden girilmiş.");
  }
};
const checkIfContentShouldBe = async (dayHour) => {
  console.log(dayHour);
  let errorCount = 0;
  // if sabah or aksam !=Number should be =="" or =="r" =="s" =="i.i" =="i"
  const validValues = ["", "i", "i.i", "r", "s", "0"];
  for (const day of dayHour) {
    if (!validValues.includes(day.sabah) && !Number(day.sabah)) {
      // throw new Error(`Geçersiz sabah değeri: ${day.sabah}. Beklenen değerler: '', 'i', 'i.i', 'r', 's' veya sayısal değer`);
      errorCount++;
    }

    if (!validValues.includes(day.aksam) && !Number(day.aksam)) {
      // throw new Error(`Geçersiz aksam değeri: ${day.aksam}. Beklenen değerler: '', 'i', 'i.i', 'r', 's' veya sayısal değer`);
      errorCount++;
    }
  }
  if (errorCount > 0) {
    throw new Error(
      `Geçersiz aksam ya da sabah değeri. Beklenen değerler: '', 'i', 'i.i', 'r', 's' veya sayısal değer`
    );
  }
};
const checkWorkingFields = (working) => {
  if (
    working.period == undefined ||
    working.user == undefined ||
    working.createdUser == undefined
  ) {
    throw new Error(
      "Dönem bilgisi, kulanıcı bilgisi ve oluşturan bilgisi eksiksiz olmalıdır"
    );
  } else if (working.dayHour.length == 0) {
    throw new Error("Çalışma listesi boş olamaz");
  }
};

const calculateDays = async (dayss) => {
  days = [];
  // const periodMonth = new Date().getMonth();
  // const year = new Date().getFullYear();
  // const daysOfMonths = moment(`${year}-${periodMonth}`,"YYYY-MM").daysInMonth();
  // console.log(periodMonth,daysOfMonths)
  for (let a = 1; a <= dayss; a++) days.push(a);
};

const calculateActiveWorkingTime = async (periodId, userId, dayHour) => {
  //const user = await userModel.findById(userId).exec();
  const period = await periodModel.findById(periodId).exec();
  //let workingTime = user.workingHourInDay * period.activeWorkingDaysInMonth;
  console.log("period is",period)
  const branchInfo = period.detail.find(item=>item.id==userId);
  console.log(branchInfo)
  let  workingTime = branchInfo.activeWorkingDaysInMonth*branchInfo.activeHours;

console.log(workingTime);
  const validValues = ["r", "i", "i.i", "s"];
  let vacationDaysCount = 0;
  for (const work of dayHour) {
    if (validValues.includes(work.sabah)) {
      vacationDaysCount++;
    }
  }
  

  workingTime -= vacationDaysCount * branchInfo.activeHours;
  return workingTime;
};

const calculateFiili = async (days) => {
  let sum = 0;
  console.log(days);
  await days.map((day) => {
    Number(day.content) ? (sum += Number(day.content)) : (sum += 0);
  });

  return sum;
};

const fetchWorkingById = async (userId, periodId) => {
  console.log("user is ", userId, periodId);
  let working = await workingModel
    .find({ user: userId, period: periodId, active: true, localApprove: false })
    .sort({ $natural: -1 })
    .populate("user")
    .populate("period")
    .exec();

  return working[0];
};

const fetchWorkingByPeriod = async (periodId,adminId) => {
  return await workingModel
    .find({ period: periodId, active: true, localApprove: true,adminApprove:true,createdUser:adminId })
    .populate("user")
    .populate("period")
    .exec();
};

const updateWorking = async (id, body) => {
  const filter = { _id: id };
  console.log(id, body);
  const result = await workingModel.findOneAndUpdate(filter, body);
  return result;
};

const fetchIsmAdminWorkingList = async (periodId,userId) => {
  return await workingModel
    .find({
      period: periodId,
      createdUser:userId,
      active: true,
      localApprove: true
      
    })
    .populate("user")
    .populate("period")
    .exec();
};
const fetchLocationAdminWorkingList = async (adminId, periodId) => {
  console.log(adminId,periodId)
  let working = await workingModel
    .find({
      createdUser: adminId,
      period: periodId,
      active: true,
      localApprove:true,
      
   
    })
    .populate("user")
    .populate("period")

    .exec();

  return working;
};

const fetchWorkingByWorkId = async (id) => {
  const work = await workingModel.find({ _id: id }).populate("user");
  if (work) {
    return work;
  } else {
    throw new Error("Çalışma listesi getirilemedi");
  }
};
const fetchMahsuplasacakWorkingByUserId=async(adminId,periodId)=>{
  console.log(adminId,periodId)
  const result = await workingModel.find({
    createdUser:adminId,
    period:periodId,
    active:true,
    localApprove:true,
    
  }).where("esasOdeme").gte(1).lte(720)
  .populate("user").exec();
  if(!result){
    throw new Error("Mahsuplaşma db error")
  }
  console.log("mahsuplacasak list",result);
const mahsuplasmaList= result.filter((work)=>work.user.mahsuplasmaValue>0)
console.log(mahsuplasmaList)
if(!mahsuplasmaList){
  return []
}
return mahsuplasmaList;
}


const mahsuplas = async(workingId,demandedMahsuplasmaValue)=>{
  
  const working = await workingModel.findOne({_id:workingId}).populate("user").exec();

  const registeredMahsupValue = await working.user.mahsuplasmaValue;

  if(demandedMahsuplasmaValue>registeredMahsupValue){
    throw new Error(`Girilen mahsuplaşma değeri veritabanındaki kayıtlı değerden büyük olamaz. Personel Kayıtlı mahsuplaşma Değer: ${registeredMahsupValue}`)
  }
  else if(demandedMahsuplasmaValue>working.esasOdeme){
    throw new Error("Girilen mahsuplaşma değeri esas ödeme değerinden büyük ")
  }
  const fazlaMesaiNewValue = working.esasOdeme-demandedMahsuplasmaValue;
  const lastMahsuplasanTotal= working.mahsuplasmaValue;
  const user = await userModel.findOne({_id:working.user._id});
  const usersCurrentMahsuplasmaValue = user.mahsuplasmaValue;
  const updateUserMahsupValue = await userModel.findOneAndUpdate({_id:user.id},{mahsuplasmaValue:usersCurrentMahsuplasmaValue-demandedMahsuplasmaValue})
 console.log(updateUserMahsupValue)
  if(updateUserMahsuplasmaValue){
    console.log("user mahsuplasma alanı update edildi")
  const workingResult = await workingModel.findOneAndUpdate({_id:workingId},{esasOdeme:fazlaMesaiNewValue,mahsuplasmaValue:Number(lastMahsuplasanTotal)+Number(demandedMahsuplasmaValue)}) 
return workingResult;
 }
 else throw new Error("Kullanıcı mahsuplasma değeri güncellendi ama working bilgisi güncellenirlen hata")
 

}

const fetchMahsuplasmaYapilanlar = async(period,admin)=>{
  return await workingModel.find({createdUser:admin,period:period,active:true})
                .where("mahsuplasmaValue").gte(1).lte(720)
                .populate("user").exec();
}
//#endregion

//#region  login and jwt

const verifyUserAndCreateToken = async (username, password) => {
  const existUser = await adminModel
    .findOne({ email: username })
    .populate("role");
  if (!existUser) {
    throw new Error("kullanıcı bulunamadı");
  }
  if (await bcrypt.compare(password, existUser.password)) {
    token = jwt.sign(
      {
        id: existUser._id,
        role: existUser.role.name,
      },
      SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );
    return token;
  } else {
    throw new Error("Kullanıcı adı ya da parola hatalı");
  }
};
//#endregion

//#region dashboard

const getDashboardData=async(userId)=>{
  const usersCount = await userModel.countDocuments({active:true});
  const workingCount = await workingModel.countDocuments({active:true,createdUser:userId});
  const notAdminApproved = await workingModel.countDocuments({active:true,createdUser:userId,localApprove:true,adminApprove:false});
  const mahsuplasmaDone = await workingModel.countDocuments({active:true,createdUser:userId})
                                  .where("mahsuplasmaValue").gte(1).lte(720).exec();
  const dashboardValues = {
    users:usersCount,
    puantajTotal:workingCount,
    onaylanmayan:notAdminApproved,
    mahsuplasmaYapilan:mahsuplasmaDone
  }     
  
  return dashboardValues;

}
//#endregion
//#region  endpoints
app.post("/api/user", async (req, res) => {
  try {
    const userBody = req.body;
    const result = await createUser(userBody);
    console.log(userBody);
    res.status(200).send({
      status: "success",
      message: "User is created",
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
});


app.post("/api/location", async (req, res) => {
  try {
    const location = req.body;
    console.log(location);
    const result = await createLocation(location);
    res.status(200).send({
      status: "success",
      message: "Location is created",
      location:result
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message
    });
  }
});

app.get("/api/location",async(req,res)=>{
  try{
    const locations = await fetchAllLocation();
    res.status(200).send({
      status:"success",
      locations:locations
    })
  }catch(err){
    res.status(200).send({
      status:"error",
      locations:[],
      message:err.message

    })
  }
})

app.patch("/api/location/:id",async(req,res)=>{
  try{
    const locationId = req.params.id;
    const value = req.body;
    const updateResult = await updateLocation(locationId,value);
    res.status(200).send({
      status:"success"
    })

  }catch(err){
    res.status(400).send({
      status:"error",
      message:err.message
    })
  }
 
})

app.post("/api/period", async (req, res) => {
  try {
    const period = req.body;
    console.log(period);
    if (period.year == undefined || period.month == undefined) {
      res.status(400).send({
        status: "error",
        message: "year and month must be sent",
      });
    }
    const result = await createPeriod(period);
    res.status(200).send({
      status: "success",
      message: "peroid is created",
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/api/period", async (req, res) => {
  try {
    const period = await fetchPeriod();
    res.status(200).send({
      status: "success",
      result: period,
    });
  } catch (err) {
    res.status(200).send({
      status: "error",
      result: {},
    });
  }
});

app.patch("/api/period/:id",async(req,res)=>{
  try{
    const updatedValue = req.body;
    const id = req.params.id;
    const updateResult = await updatePeriod(id,updatedValue);
    res.status(201).send({
    status:"success",
    result :updateResult})

  }catch(err){
  res.status(400).send({
  status:"error",
  message:err.message
  }) 
  }
})
app.get("/api/allPeriod", async (req, res) => {
  try {
    const period = await fetchAllPeriod();
    res.status(200).send({
      status: "success",
      result: period,
    });
  } catch (err) {
    res.status(200).send({
      status: "error",
      result: {},
    });
  }
});

app.post("/api/workings", async (req, res) => {
  try {
    const workingBody = req.body;
    console.log(req.body)

    const result = await createWorkings(workingBody);
    if (result) {
      res.status(200).send({
        status: "success",
        message: "Çalışma listesi kaydedildi",
        id: result._id,
      });
    } else throw new Error("Çalışmas listesi kaydederken hata");
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/api/workings", async (req, res) => {
  try {
    const result = await receiveWorkingsData();

    await calculateDays();
    console.log(result, days);
    res.status(200).send({
      status: "success",
      days: days,
      workings: result,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
      days: days,
    });
  }
});

app.get("/api/working/:id/:userId", async (req, res) => {
  try {
    const period = req.params.id;
    const adminId = req.params.userId;

    const result = await fetchWorkingByPeriod(period,adminId);
    console.log(result);

    if (result.length > 0) {
      console.log("aa");
      console.log(result[0].dayHour.length);
      await calculateDays(result[0].dayHour.length);
      res.status(200).send({
        status: "success",
        working: result,
        days: days,
      });
    } else {
      throw new Error("Periyoda ait veri bulunamadı");
    }
  } catch (err) {
    res.status(200).send({
      status: "error",
      working: [],
      days: days,
      message: err.message,
    });
  }
});
app.patch("/api/working/:id", async (req, res) => {
  try {
    const workingId = req.params.id;
    const updatedField = req.body;
    console.log(updatedField);
    const result = await updateWorking(workingId, updatedField);
    if (result) {
      res.status(201).send({
        status: "success",
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
});

app.post("/api/userWorking", async (req, res) => {
  try {
    const userId = req.body.data.userId;
    const periodId = req.body.data.periodId;
    console.log(userId, periodId);
    const result = await fetchWorkingById(userId, periodId);
    res.status(200).send({
      status: "success",
      working: result,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      working: { dayHour: [], user: "" },
      message: err.message,
    });
  }
});
app.get("/api/working/:workingId", async (req, res) => {
  try {
    const workingId = req.params.workingId;
    console.log(workingId)
    const result = await fetchWorkingByWorkId(workingId);
    res.status(200).send({
      status: "success",
      work: result[0],
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
      work: new workingModel(),
    });
  }
});
app.post("/api/tesisAdminWorkingList", async (req, res) => {
  try {
    const { userId, periodId } = req.body.postBody;
    const result = await fetchLocationAdminWorkingList(userId, periodId);
    res.status(200).send({
      status: "success",
      workingList: result,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      workingList: [],
      message: err.message,
    });
  }
});

app.post("/api/getMahsuplasma",async(req,res)=>{
try{
  const {userId,periodId}=req.body.postBody;
  const result = await fetchMahsuplasacakWorkingByUserId(userId,periodId);
  res.status(200).send({
    status:"success",
    mahsuplasmaList:result
  })
}catch(err){
  res.status(400).send({
    status:"error",
    mahsuplasmaList:[],
    message:err.message
  })
}
})
app.post("/api/mahsuplas",async(req,res)=>{
  try{
    const {workingId,mahsuplasmaValue } = req.body.postBody;
    const result = await mahsuplas(workingId,mahsuplasmaValue);
    res.status(200).send({
      status:"success",
      message:mahsuplasmaValue + "saat mahsuplaşma ybaşarıyla yapıldı"

    })

  }catch(err){
    res.status(400).send({
      status:"error",
      message:err.message
    })
  }
})

app.post("/api/mahsuplasmayapilanlar",async(req,res)=>{
  try{
    const {period,admin}=req.body.postBody;
    const result = await fetchMahsuplasmaYapilanlar(period,admin);
    res.status(200).send({
      status:"success",
      result:result

    })
  }catch(err){
    res.status(400).send({
      status:"error",
      message:err.message,
      result:[]
    })
  }

})
app.post("/api/IsmAdminWorkingList", async (req, res) => {
  try {
    const {userId,periodId}=req.body.postBody;

    const result = await fetchIsmAdminWorkingList(periodId,userId);
    res.status(200).send({
      status: "success",
      workingList: result,
    });
  } catch (err) {
    res.status(200).send({
      status: "error",
      workingList: [],
    });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const adminId=req.params.id;
    const userList = await fetchUsers(adminId);

    res.status(200).send({
      status: "success",
      users: userList,
    });
  } catch (err) {
    res.status(200).send({
      status: "error",
      users: [],
    });
  }
});

app.patch("/api/user/:id",async(req,res)=>{
  try{
    const id = req.params.id;
    const value = req.body;
    const result = await updateUser(id,value);
    res.status(200).send({
      status:"success",

    })

  }catch(err){
    res.status(400).send({
      status:"error",
      message:err.message
    })

  }
})

app.post("/api/role", async (req, res) => {
  try {
    const role = req.body;
    if (role == undefined || role == {}) {
      throw new Error("Role bilgisi boş olamaz");
    }
    const result = await createRole(role);
    res.status(200).send({
      status: "success",
      message: "role created",
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/api/role", async (req, res) => {
  try {
    const result = await fetchRoles();
    res.status(200).send({
      status: "success",
      roles: result,
    });
  } catch (err) {
    res.status(200).send({
      status: "error",
      roles: [],
    });
  }
});

app.post("/api/admin", async (req, res) => {
  try {
    const admin = req.body;
    const result = await createAdmin(admin);
    res.status(200).send({
      status: "success",
      message: "admin created",
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/api/admin",async(req,res)=>{
  try{
    const result = await fetchAdmins();
    res.status(200).send({
      status:"success",
      admins:result
    })
  }catch(err){
    res.status(200).send({
      status:"error",
      admins:[],
      message:err.message
    })
  }

})
app.get("/api/admin/tesisAdmin", async (req, res) => {
  try {
    const result = await fetchLocationAdmins();

    res.status(200).send({
      status: "success",
      result: result,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      result: [],
      message: err.message,
    });
  }
});
//fetch tesis admin by id 
app.get("/api/admin/:id",async(req,res)=>{
  try{
    const adminId = req.params.id;
    const result = await fetchAdminById(adminId);
    res.status(200).send({
      status:"success",
      user:result
    })
  }catch(err){
    res.status(400).send({
      status:"error",
      user:{},
      message:err.message
    })
  }
})
app.patch("/api/admin/:id",async(req,res)=>{
try{
  const adminId = req.params.id;
  const value = req.body;
  const result = await updateAdmin(adminId,value);
  res.status(200).send({
    status:"success"

  })
}
catch(err){
  res.status(400).send({
    status:"error",
    message:err.message
  })
}
 


})

app.get("/api/dashboard/:id",async(req,res)=>{
  try{
    const userId = req.params.id;
    const result = await getDashboardData(userId);
    res.status(200).send({
      status:"success",
      result:result
    })

  }catch(err){
    res.status(400).send({
      status:"error",
      result:{
        users:0,
        puantajTotal:0,
        onaylanmayan:0,
        mahsuplasmaYapilan:0
      }
    })
  }
})
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await verifyUserAndCreateToken(username, password);
    res.status(200).send({
      status: "success",
      accessToken: result,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      token: "",
      message: err.message,
    });
  }
});

//#endregion
app.listen("7777", () => console.log("server is listenin on 7777"));
