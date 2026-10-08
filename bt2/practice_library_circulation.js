const circulationLogs = [
  {
    logId: "LOG001",
    studentCode: "SV1001",
    bookIsbn: "978-0131103627",
    status: "BORROWING",
    borrowDate: "2026-09-01",
    dueDate: "2026-09-15",
    returnedDate: null,
    fineAmount: 0,
    daysOverdue: 0
  },
  {
    logId: "LOG002",
    studentCode: "SV1002",
    bookIsbn: "978-0201633610",
    status: "RETURNED",
    borrowDate: "2026-08-01",
    dueDate: "2026-08-15",
    returnedDate: "2026-08-14",
    fineAmount: 0,
    daysOverdue: 0
  }
];

const DAILY_LATE_FINE = 5000;
const LOST_BOOK_FINE = 200000;

const testInputQueue = [
  { choice: 4 },
  {
    choice: 1,
    borrowData: {
      studentCode: "SV1003",
      bookIsbn: "978-0132350884",
      borrowDate: "2026-10-01",
      dueDate: "2026-10-15"
    }
  },
  {
    choice: 2,
    returnInfo: {
      logId: "LOG001",
      returnedDate: "2026-09-20",
      isLost: false
    }
  },
  {
    choice: 2,
    returnInfo: {
      logId: "LOG003",
      returnedDate: "2026-10-16",
      isLost: true
    }
  },
  { choice: 3, daysLimit: 30 },
  { choice: 4 },
  { choice: 0 }
];

let inputIndex = 0;
let autoLogIdCounter = 3;

function getNextUserAction() {
  if (inputIndex < testInputQueue.length) {
    return testInputQueue[inputIndex++];
  }
  return { choice: 0 };
}

let isRunning = true;

do {
  const action = getNextUserAction();
  const choice = action.choice;

  switch (choice) {
    case 1: {
      console.log("\n================================================");
      console.log("[CHUC NANG 1] MUON SACH MOI (CREATE)");
      console.log("================================================");

      const data = action.borrowData;

      if (!data || !data.studentCode || !data.bookIsbn) {
        console.log("LOI: Thong tin nguoi muon hoac ma sach khong hop le.");
        break;
      }

      const generatedId = "LOG" + autoLogIdCounter.toString().padStart(3, "0");
      autoLogIdCounter++;

      const newLog = {
        logId: generatedId,
        studentCode: data.studentCode.trim().toUpperCase(),
        bookIsbn: data.bookIsbn.trim(),
        status: "BORROWING",
        borrowDate: data.borrowDate,
        dueDate: data.dueDate,
        returnedDate: null,
        fineAmount: 0,
        daysOverdue: 0
      };

      circulationLogs.push(newLog);
      console.log(`Ghi nhan luot muon thanh cong! Ma nhat ky: ${newLog.logId}`);
      console.log(`Sinh vien: ${newLog.studentCode} - ISBN: ${newLog.bookIsbn}`);
      break;
    }

    case 2: {
      console.log("\n================================================");
      console.log("[CHUC NANG 2] TRA SACH & TINH PHAT (UPDATE)");
      console.log("================================================");

      const info = action.returnInfo;

      if (!info || !info.logId) {
        console.log("LOI: Thong tin tra sach khong hop le.");
        break;
      }

      let foundIndex = -1;
      for (let i = 0; i < circulationLogs.length; i++) {
        if (circulationLogs[i].logId === info.logId) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        console.log(`LOI: Khong tim thay ma nhat ky "${info.logId}".`);
      } else {
        const log = circulationLogs[foundIndex];

        if (log.status !== "BORROWING") {
          console.log(`LOI: Giao dich ${log.logId} da hoan tat truoc do.`);
          break;
        }

        if (info.isLost) {
          log.status = "LOST";
          log.fineAmount = LOST_BOOK_FINE;
          log.returnedDate = info.returnedDate || null;
          console.log(`XAC NHAN: Sach bi mat. Ap dung phi den bu: ${log.fineAmount.toLocaleString("en-US")} VND`);
        } else {
          log.status = "RETURNED";
          log.returnedDate = info.returnedDate;

          const dueTime = new Date(log.dueDate).getTime();
          const returnTime = new Date(log.returnedDate).getTime();
          const diffDays = Math.ceil((returnTime - dueTime) / (1000 * 3600 * 24));

          if (diffDays > 0) {
            log.daysOverdue = diffDays;
            log.fineAmount = diffDays * DAILY_LATE_FINE;
            console.log(`XAC NHAN: Tra tre ${diffDays} ngay. Phi phat qua han: ${log.fineAmount.toLocaleString("en-US")} VND`);
          } else {
            log.daysOverdue = 0;
            log.fineAmount = 0;
            console.log("XAC NHAN: Tra sach dung han. Khong co phi phat.");
          }
        }
      }
      break;
    }

    case 3: {
      console.log("\n================================================");
      console.log("[CHUC NANG 3] XOA NHAT KY HOAN TAT QUAN HAN (DELETE)");
      console.log("================================================");

      let removedCount = 0;
      const initialCount = circulationLogs.length;

      for (let i = circulationLogs.length - 1; i >= 0; i--) {
        const log = circulationLogs[i];

        if (log.status === "RETURNED" && log.returnedDate) {
          const returnTime = new Date(log.returnedDate).getTime();
          const currentTime = new Date("2026-10-08").getTime();
          const daysPassed = Math.floor((currentTime - returnTime) / (1000 * 3600 * 24));

          if (daysPassed > 30) {
            circulationLogs.splice(i, 1);
            removedCount++;
          }
        }
      }

      console.log(`Da do dep ${removedCount} ban ghi cu qua 30 ngay.`);
      console.log(`So luong nhat ky con lai trong he thong: ${circulationLogs.length}`);
      break;
    }

    case 4: {
      console.log("\n================================================");
      console.log("[CHUC NANG 4] BAO CAO TONG KET LUU CHUYEN (READ)");
      console.log("================================================");

      let countBorrowing = 0;
      let countReturned = 0;
      let countLost = 0;
      let totalFineCollected = 0;

      const borderLine = "-".repeat(78);
      console.log(borderLine);
      console.log("             BAO CAO TONG KET LUU CHUYEN SACH TRONG NGAY          ");
      console.log(borderLine);
      console.log(
        "MA NK".padEnd(8) +
        "MA SV".padEnd(10) +
        "ISBN".padEnd(18) +
        "TRANG THAI".padEnd(14) +
        "TRE HAN".padStart(8) +
        "PHI PHAT".padStart(16)
      );
      console.log(borderLine);

      for (let i = 0; i < circulationLogs.length; i++) {
        const log = circulationLogs[i];

        if (log.status === "BORROWING") countBorrowing++;
        else if (log.status === "RETURNED") countReturned++;
        else if (log.status === "LOST") countLost++;

        totalFineCollected += log.fineAmount;

        const colId = log.logId.padEnd(8);
        const colStudent = log.studentCode.padEnd(10);
        const colIsbn = log.bookIsbn.padEnd(18);
        const colStatus = log.status.padEnd(14);
        const colOverdue = (log.daysOverdue + " ngay").padStart(8);
        const colFine = log.fineAmount.toLocaleString("en-US").padStart(16) + " VND";

        console.log(`${colId}${colStudent}${colIsbn}${colStatus}${colOverdue}${colFine}`);
      }

      console.log(borderLine);
      console.log(`TONG SO SACH DANG MUON   : ${countBorrowing.toString().padStart(8)} ban ghi`);
      console.log(`TONG SO SACH DA TRA     : ${countReturned.toString().padStart(8)} ban ghi`);
      console.log(`TONG SO SACH BAO MAT     : ${countLost.toString().padStart(8)} ban ghi`);
      console.log(`TONG TIEN PHAT THU DUOC  :${totalFineCollected.toLocaleString("en-US").padStart(12)} VND`);
      console.log(borderLine);
      break;
    }

    case 0: {
      console.log("\n================================================");
      console.log("[CHUC NANG 0] THOAT CHUONG TRINH");
      console.log("He thong quan ly luu chuyen thu vien da dong.");
      console.log("================================================");
      isRunning = false;
      break;
    }

    default: {
      console.log("\nLUA CHON KHONG HOP LE!");
      console.log("Vui long chon mot trong cac chuc nang: 1, 2, 3, 4 hoac 0.");
      break;
    }
  }
} while (isRunning);