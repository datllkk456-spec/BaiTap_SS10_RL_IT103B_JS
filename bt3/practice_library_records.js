// 1. KHOI TAO DUL IEU BAN DAU (3 PHIEU)
const borrowRecords = [
  {
    recordId: "PM01",
    studentId: "SV101",
    bookTitle: "Lap Trinh JavaScript",
    borrowDays: 10,
    isReturned: false
  },
  {
    recordId: "PM02",
    studentId: "SV102",
    bookTitle: "Cau Truc Du Lieu Va Giai Thuat",
    borrowDays: 20,
    isReturned: false
  },
  {
    recordId: "PM03",
    studentId: "SV103",
    bookTitle: "Co So Du Lieu",
    borrowDays: 14,
    isReturned: true
  }
];

const DAILY_FINE_RATE = 5000;
const MAX_ALLOWED_DAYS = 14;

// 2. CAC BUOC XU LY THEO DIEU KIEN DE BAI

// PHA 1: CREATE - THEM PHIEU PM04 BANG PUSH()
console.log("================================================");
console.log("[PHA 1] CREATE - THEM PHIEU MUON MOI PM04");
console.log("================================================");

const newRecord = {
  recordId: "PM04",
  studentId: "SV104",
  bookTitle: "Clean Code",
  borrowDays: 18,
  isReturned: false
};

borrowRecords.push(newRecord);
console.log(`Da them phieu muon moi: ${newRecord.recordId} - Sinh vien: ${newRecord.studentId} - Sach: "${newRecord.bookTitle}"`);

// PHA 2: READ - LOC & TINH PHI PHAT QUAS HAN (> 14 NGAY)
console.log("\n================================================");
console.log("[PHA 2] READ - TINH PHI PHAT CAC PHIEU QUAS HAN (> 14 NGAY)");
console.log("================================================");

let totalFineAmount = 0;

for (let i = 0; i < borrowRecords.length; i++) {
  const item = borrowRecords[i];
  
  if (item.borrowDays > MAX_ALLOWED_DAYS && !item.isReturned) {
    const overdueDays = item.borrowDays - MAX_ALLOWED_DAYS;
    const fineFee = overdueDays * DAILY_FINE_RATE;
    totalFineAmount += fineFee;
    
    console.log(`Phieu ${item.recordId} (SV: ${item.studentId}): Qua han ${overdueDays} ngay -> Phi phat: ${fineFee.toLocaleString("en-US")} VND`);
  }
}

console.log(`Tong phi phat qua han du kien thu: ${totalFineAmount.toLocaleString("en-US")} VND`);

// PHA 3: UPDATE - CAP NHAT PHIEU PM01 CHUYEN ISRETURNED = TRUE
console.log("\n================================================");
console.log("[PHA 3] UPDATE - CAP NHAT TRANG THAI TRA SACH CHO PHIEU PM01");
console.log("================================================");

for (let i = 0; i < borrowRecords.length; i++) {
  if (borrowRecords[i].recordId === "PM01") {
    borrowRecords[i].isReturned = true;
    console.log(`Da cap nhat phieu ${borrowRecords[i].recordId}: isReturned = true`);
    break;
  }
}

// PHA 4: DELETE - XOA PHIEU PM03 KHOI DANH SACH BANG SPLICE()
console.log("\n================================================");
console.log("[PHA 4] DELETE - XOA PHIEU PM03 KHANG BANG SPLICE()");
console.log("================================================");

for (let i = 0; i < borrowRecords.length; i++) {
  if (borrowRecords[i].recordId === "PM03") {
    const removedItem = borrowRecords.splice(i, 1)[0];
    console.log(`Da xoa thanh cong phieu ${removedItem.recordId} khoi he thong.`);
    break;
  }
}

// PHA 5: IN BANG TONG KET CONSOLE
console.log("\n================================================");
console.log("[PHA 5] BANG TONG KET DANH SACH PHIEU MUON SACH");
console.log("================================================");

const borderLine = "-".repeat(78);
console.log(borderLine);
console.log(
  "MA PHIEU".padEnd(10) +
  "MA SV".padEnd(10) +
  "TEN SACH".padEnd(30) +
  "SO NGAY".padStart(8) +
  "TRANG THAI".padStart(12) +
  "PHI PHAT".padStart(10)
);
console.log(borderLine);

let grandTotalFine = 0;

for (let i = 0; i < borrowRecords.length; i++) {
  const item = borrowRecords[i];
  
  let overdueDays = 0;
  let fineFee = 0;
  
  if (item.borrowDays > MAX_ALLOWED_DAYS) {
    overdueDays = item.borrowDays - MAX_ALLOWED_DAYS;
    fineFee = overdueDays * DAILY_FINE_RATE;
  }
  
  grandTotalFine += fineFee;

  const colRecord = item.recordId.padEnd(10);
  const colStudent = item.studentId.padEnd(10);
  const colTitle = (item.bookTitle.length > 28 ? item.bookTitle.slice(0, 25) + "..." : item.bookTitle).padEnd(30);
  const colDays = (item.borrowDays + " ngay").padStart(8);
  const colStatus = (item.isReturned ? "DA TRA" : "DANG MUON").padStart(12);
  const colFine = (fineFee > 0 ? fineFee.toLocaleString("en-US") : "0").padStart(8) + " VND";

  console.log(`${colRecord}${colStudent}${colTitle}${colDays}${colStatus}${colFine}`);
}

console.log(borderLine);
console.log(`TONG SO PHIEU MUON CON LAI : ${borrowRecords.length.toString().padStart(8)} phieu`);
console.log(`TONG TIEN PHAT PHAT SINH  :${grandTotalFine.toLocaleString("en-US").padStart(12)} VND`);
console.log(borderLine);