/**
 * QUAN TRI KHO AN BAN THU VIEN & KIEM KE LUU TRU TU DONG
 * 
 * TRUONG HOP KIEM THU (TEST CASES):
 * - TC1: Them dau sach moi hop le bang push().
 * - TC2: Muon sach hop le va muon sach khi het hang (availableCopies === 0).
 * - TC3: Thanh ly dau sach hong bang splice().
 * - TC4: Kiem ke tong so luong va tong gia tri tai san kho.
 */


const libraryCatalog = [
  {
    bookCode: "B01",
    title: "Lap Trinh JavaScript Nang Cao",
    category: "CNTT",
    price: 150000,
    totalCopies: 10,
    availableCopies: 1,
    shelfLocation: "KE-A1"
  },
  {
    bookCode: "B02",
    title: "Cau Truc Du Lieu Va Giai Thuat",
    category: "CNTT",
    price: 120000,
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: "KE-A2"
  },
  {
    bookCode: "B03",
    title: "Kinh Te Vimo Can Ban",
    category: "KINH TE",
    price: 90000,
    totalCopies: 8,
    availableCopies: 0,
    shelfLocation: "KE-B1"
  }
];

const testInputQueue = [
  { choice: 4 },
  { 
    choice: 1, 
    newBook: {
      bookCode: "B04",
      title: "Thiet Ke He Thong Thong Tin",
      category: "CNTT",
      price: 200000,
      totalCopies: 4,
      availableCopies: 4,
      shelfLocation: "KE-A3"
    } 
  },
  { choice: 2, borrowCode: "B01" },
  { choice: 2, borrowCode: "B01" },
  { choice: 3, removeCode: "B03" },
  { choice: 4 },
  { choice: 0 }
];

let inputIndex = 0;

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
      console.log("[CHUC NANG 1] NHAP KHO AN BAN MOI (CREATE)");
      console.log("================================================");

      const book = action.newBook;

      if (!book || !book.bookCode || !book.title) {
        console.log("LOI: Thong tin sach moi khong hop le.");
        break;
      }

      let isDuplicate = false;
      for (let i = 0; i < libraryCatalog.length; i++) {
        if (libraryCatalog[i].bookCode === book.bookCode) {
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate) {
        console.log(`LOI: Ma sach "${book.bookCode}" da ton tai trong kho.`);
      } else {
        libraryCatalog.push(book);
        console.log(`Them thanh cong sach moi: "${book.title}" (Ma: ${book.bookCode})`);
      }
      break;
    }

    case 2: {
      console.log("\n================================================");
      console.log("[CHUC NANG 2] XUAT MUON SACH (UPDATE)");
      console.log("================================================");

      const targetCode = (action.borrowCode || "").trim().toUpperCase();

      if (targetCode.length === 0) {
        console.log("LOI: Ma sach muon khong duoc de rong.");
        break;
      }

      let foundIndex = -1;
      for (let i = 0; i < libraryCatalog.length; i++) {
        if (libraryCatalog[i].bookCode === targetCode) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        console.log(`LOI: Khong tim thay ma sach "${targetCode}" trong kho.`);
      } else {
        const selectedBook = libraryCatalog[foundIndex];

        if (selectedBook.availableCopies > 0) {
          selectedBook.availableCopies -= 1;
          console.log(`Xuat muon thanh cong 1 cuon: "${selectedBook.title}"`);
          console.log(`So luong con lai tren ke: ${selectedBook.availableCopies} cuon.`);

          if (selectedBook.availableCopies === 0) {
            console.log("CANH BAO: HET SACH TREN KE!");
          }
        } else {
          console.log(`LOI: Sach "${selectedBook.title}" da HET SACH TREN KE.`);
          console.log("Khong the thuc hien giao dịch muon.");
        }
      }
      break;
    }

    case 3: {
      console.log("\n================================================");
      console.log("[CHUC NANG 3] THANH LY SACH HONG (DELETE)");
      console.log("================================================");

      const targetCode = (action.removeCode || "").trim().toUpperCase();

      if (targetCode.length === 0) {
        console.log("LOI: Ma sach thanh ly khong duoc de rong.");
        break;
      }

      let foundIndex = -1;
      for (let i = 0; i < libraryCatalog.length; i++) {
        if (libraryCatalog[i].bookCode === targetCode) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        console.log(`LOI: Khong tim thay ma sach "${targetCode}" de thanh ly.`);
      } else {
        const removedBook = libraryCatalog.splice(foundIndex, 1)[0];
        console.log(`Da thanh ly va xoa khoi he thong an ban: "${removedBook.title}" (Ma: ${removedBook.bookCode})`);
      }
      break;
    }

    case 4: {
      console.log("\n================================================");
      console.log("[CHUC NANG 4] KIEM KE TAI SAN KHO (READ)");
      console.log("================================================");

      let grandTotalCopies = 0;
      let grandAvailableCopies = 0;
      let grandTotalAssetValue = 0;

      const borderLine = "-".repeat(80);
      console.log(borderLine);
      console.log("                    BANG KIEM KE TAI SAN KHO AN BAN THU VIEN                    ");
      console.log(borderLine);
      console.log(
        "MA".padEnd(6) +
        "TEN AN BAN".padEnd(30) +
        "GIA".padStart(10) +
        "TONG".padStart(8) +
        "KHA DUNG".padStart(10) +
        "TONG GIATRI".padStart(16)
      );
      console.log(borderLine);

      for (let i = 0; i < libraryCatalog.length; i++) {
        const item = libraryCatalog[i];
        const itemTotalValue = item.totalCopies * item.price;

        grandTotalCopies += item.totalCopies;
        grandAvailableCopies += item.availableCopies;
        grandTotalAssetValue += itemTotalValue;

        const colCode = item.bookCode.padEnd(6);
        const colTitle = (item.title.length > 28 ? item.title.slice(0, 25) + "..." : item.title).padEnd(30);
        const colPrice = item.price.toLocaleString("en-US").padStart(10);
        const colTotal = item.totalCopies.toString().padStart(8);
        const colAvail = item.availableCopies.toString().padStart(10);
        const colValue = itemTotalValue.toLocaleString("en-US").padStart(16);

        console.log(`${colCode}${colTitle}${colPrice}${colTotal}${colAvail}${colValue}`);
      }

      console.log(borderLine);
      console.log(`TONG SO DAU SACH        : ${libraryCatalog.length.toString().padStart(10)} dau sach`);
      console.log(`TONG SO BAN SACH NHAP KHO: ${grandTotalCopies.toString().padStart(10)} cuon`);
      console.log(`TONG SO SACH KHA DUNG   : ${grandAvailableCopies.toString().padStart(10)} cuon`);
      console.log(`TONG GIA TRI TAI SAN KHO: ${grandTotalAssetValue.toLocaleString("en-US").padStart(10)} VND`);
      console.log(borderLine);
      break;
    }

    case 0: {
      console.log("\n================================================");
      console.log("[CHUC NANG 0] THOAT CHUONG TRINH");
      console.log("He thong quan tri kho an ban thu vien da dong.");
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