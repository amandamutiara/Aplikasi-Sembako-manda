// Menampilkan splash screen pada awal load
document.addEventListener("DOMContentLoaded", function() {
  // Simulasi penundaan sebelum menyembunyikan splash screen (misalnya: 3 detik)
  setTimeout(function() {
      // Sembunyikan splash screen
      document.querySelector('.splash-screen').style.display = 'none';
      // Tampilkan konten utama
      document.getElementById('main-content').style.display = 'block';
  }, 3000); // Ubah angka 3000 menjadi durasi yang diinginkan (dalam milidetik)
});

// Variable to store related product names, prices, and quantities
const products = [
  { nama: 'Indomie Goreng', harga: 110000 },
  { nama: 'Beras berkualitas tinggi', harga: 70000 },
  { nama: 'Gula Pasir', harga: 25000 },
  { nama: 'Minyak goreng', harga: 45000 },
  { nama: 'Tepung Terigu Segitiga Biru /kg', harga: 24000 },
  { nama: 'Telur Ayam Negeri /kg ', harga: 30000 },
  { nama: 'Roti Tawar ', harga: 28000 },
  { nama: 'Keju Craft', harga: 22000 },
  { nama: 'SKM', harga: 23000 }
  // You can add other products here
];

const tambahButtons = document.querySelectorAll('.tambahButton');
const formGrosir = document.getElementById('formGrosir');
const namaBarangInput = document.getElementById('namaBarang');
const jumlahBarangInput = document.getElementById('jumlahBarang');
const hasilSubmitTable = document.getElementById('hasilSubmit');
const totalBayarElement = document.getElementById('totalBayarValue');

let namaProdukSelected = '';
let selectedRow = null;

tambahButtons.forEach((button, index) => {
  button.addEventListener('click', function() {
    formGrosir.style.display = 'block';
    formGrosir.scrollIntoView({ behavior: 'smooth' });

    namaProdukSelected = products[index].nama;
    const hargaProduk = products[index].harga;

    namaBarangInput.value = namaProdukSelected;
    jumlahBarangInput.value = '';
  });
});

// Function to handle the submission of the form
formGrosir.addEventListener('submit', function(event) {
  event.preventDefault();
  const jumlahBarang = Number(jumlahBarangInput.value);

  // Validate if the quantity is a positive number
  if (jumlahBarang <= 0 || isNaN(jumlahBarang)) {
    alert('Please enter a valid quantity.');
    return;
  }

  const hargaProduk = products.find(product => product.nama === namaProdukSelected).harga;
  const totalHarga = jumlahBarang * hargaProduk;

  // Check if we are editing an existing row or adding a new one
  if (selectedRow) {
    // Update the existing row
    selectedRow.cells[0].textContent = namaProdukSelected;
    selectedRow.cells[1].textContent = jumlahBarang;
    selectedRow.cells[2].textContent = `Rp ${totalHarga}`; // Update total price cell
    selectedRow = null; // Reset the selected row
  } else {
    // Add a new row to the table
    const row = hasilSubmitTable.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    cell1.textContent = namaProdukSelected;
    cell2.textContent = jumlahBarang;
    cell3.textContent = `Rp ${totalHarga}`;

    const actionsCell = row.insertCell(3);
    const editButton = createEditButton(row);
    const deleteButton = createDeleteButton(row);

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Recalculate the total payment after adding a new product
    hitungTotalPembayaran();
  }

  // Clear the form inputs after submission
  namaBarangInput.value = '';
  jumlahBarangInput.value = '';
});

// Function to create an Edit button
function createEditButton(row) {
  const editButton = document.createElement('button');
  editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'editButton');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', function() {
    const namaProduk = row.cells[0].textContent;
    const jumlahBarang = parseInt(row.cells[1].textContent, 10);

    formGrosir.style.display = 'block';
    formGrosir.scrollIntoView({ behavior: 'smooth' });

    namaBarangInput.value = namaProduk;
    jumlahBarangInput.value = jumlahBarang;

    selectedRow = row; // Set the selected row to be edited
  });

  return editButton;
}

// Function to create a Delete button
function createDeleteButton(row) {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'hapusButton');
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', function() {
    row.parentNode.removeChild(row);
    hitungTotalPembayaran(); // Recalculate the total payment after deleting a product
  });

  return deleteButton;
}

// Function to calculate the total payment
function hitungTotalPembayaran() {
  let totalHarga = 0;
  const rows = hasilSubmitTable.rows;

  for (let i = 1; i < rows.length; i++) {
    const hargaProduk = products.find(product => product.nama === rows[i].cells[0].textContent).harga;
    const jumlahBarang = parseInt(rows[i].cells[1].textContent, 10);
    totalHarga += hargaProduk * jumlahBarang;
  }

  totalBayarElement.textContent = `Rp ${totalHarga}`;
}
