// 1. proses login
const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {

        // Mencegah halaman melakukan refresh
        event.preventDefault();

        // Mengambil nilai input
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Mencari akun yang sesuai
        const pengguna = dataAkun.find(function(user) {
            return user.email === email && user.password === password;
        });

        // Memeriksa hasil login
        if (pengguna) {

            // Menyimpan data pengguna yang login
            localStorage.setItem("penggunaLogin", JSON.stringify(pengguna));
            alert("Login berhasil! Selamat datang, " + pengguna.nama);

            // Berpindah ke halaman dashboard
            window.location.href = "dashboard.html";

        } else {
            alert("Email/password yang anda masukkan salah");
        }
    });
}

// 2. fungsi membuka modal
const btnLupaPassword = document.getElementById("btnLupaPassword");
const btnDaftar = document.getElementById("btnDaftar");

const modalLupaPassword = document.getElementById("modalLupaPassword");
const modalDaftar = document.getElementById("modalDaftar");

if (btnLupaPassword && modalLupaPassword) {
    btnLupaPassword.addEventListener("click", function() {
        modalLupaPassword.style.display = "flex";
    });
}

if (btnDaftar && modalDaftar) {
    btnDaftar.addEventListener("click", function() {
        modalDaftar.style.display = "flex";
    });
}

// 3. fungsi menutup modal
const tombolTutup = document.querySelectorAll("[data-close]");

tombolTutup.forEach(function(tombol) {
    tombol.addEventListener("click", function() {
        const modal = tombol.closest(".modal");
        if (modal) {
            modal.style.display = "none";
        }
    });
});

// menutup modal ketika area luar diklik
document.querySelectorAll(".modal").forEach(function(modal) {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// 4. progres lupa password
const formLupaPassword = document.getElementById("formLupaPassword");
if (formLupaPassword) {
    formLupaPassword.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("emailLupa").value.trim();
        const pengguna = dataPengguna.find(function(user) {
            return user.email === email;
        });
        if (pengguna) {
            alert("Email ditemukan! Silakan hubungi admin untuk bantuan pemulihan password.");
        } else {
            alert("Email tersebut tidak terdaftar.");
        }
        formLupaPassword.reset();
        modalLupaPassword.style.display = "none";
    });
}

// 5.proses pendaftaran akun
const formDaftar = document.getElementById("formDaftar");
if (formDaftar) {
    formDaftar.addEventListener("submit", function(event) {
        event.preventDefault();

        // Mengambil data dari form
        const nama = document.getElementById("namaDaftar").value.trim();
        const email = document.getElementById("emailDaftar").value.trim();
        const password = document.getElementById("passwordDaftar").value;

        // Memeriksa apakah email sudah digunakan
        const emailTerdaftar = dataPengguna.find(function(user) {
            return user.email === email;
        });

        if (emailTerdaftar) {
            alert("Email sudah terdaftar. Silakan gunakan email lain.");
            return;
        }

        // Membuat data pengguna baru
        const penggunaBaru = {
            id: dataPengguna.length + 1,
            nama: nama,
            email: email,
            password: password,
            role: "User"
        };

        // Menambahkan pengguna ke dalam array
        dataPengguna.push(penggunaBaru);
        alert("Pendaftaran berhasil! Silakan login menggunakan akun baru.");

        // Mengosongkan form dan menutup modal
        formDaftar.reset();
        modalDaftar.style.display = "none";
    });
}


// ==========================================
// 6. DASHBOARD MENU
// ==========================================

// Mengambil data pengguna yang sedang login
const penggunaAktif = JSON.parse(
    localStorage.getItem("penggunaLogin")
);

// Memeriksa apakah halaman yang dibuka adalah dashboard
const halamanDashboard = document.querySelector(".dashboard-page");

if (halamanDashboard) {

    // Jika belum login, kembali ke halaman login
    if (!penggunaAktif) {

        alert("Silakan login terlebih dahulu.");

        window.location.href = "index.html";

    } else {

        // Menampilkan nama pengguna
        document.getElementById("namaPengguna").textContent =
            penggunaAktif.nama;

        document.getElementById("greetingNama").textContent =
            "Halo, " + penggunaAktif.nama + "!";


        // ==========================================
        // GREETING BERDASARKAN WAKTU LOKAL
        // ==========================================

        const waktuSekarang = new Date();
        const jam = waktuSekarang.getHours();

        let greeting;

        if (jam >= 5 && jam < 11) {

            greeting = "Selamat Pagi";

        } else if (jam >= 11 && jam < 15) {

            greeting = "Selamat Siang";

        } else if (jam >= 15 && jam < 18) {

            greeting = "Selamat Sore";

        } else {

            greeting = "Selamat Malam";

        }

        document.getElementById("waktuGreeting").textContent =
            greeting;


        // ==========================================
        // LOGOUT
        // ==========================================

        const btnLogout = document.getElementById("btnLogout");

        btnLogout.addEventListener("click", function() {

            const konfirmasi = confirm(
                "Apakah kamu yakin ingin keluar dari BookStore?"
            );

            if (konfirmasi) {

                // Menghapus data login
                localStorage.removeItem("penggunaLogin");

                // Kembali ke halaman login
                window.location.href = "index.html";
            }
        });
    }
}



// ==========================================
// 7. HALAMAN INFORMASI STOK / KATALOG
// ==========================================

const halamanStok = document.querySelector(".stok-page");

if (halamanStok) {

    // Memeriksa status login
    const penggunaStok = JSON.parse(
        localStorage.getItem("penggunaLogin")
    );

    if (!penggunaStok) {

        alert("Silakan login terlebih dahulu.");
        window.location.href = "index.html";

    } else {

        // Mengambil elemen HTML
        const tabelKatalog = document.getElementById("tabelKatalogBuku");
        const formTambahStok = document.getElementById("formTambahStok");

        const totalJenisBuku = document.getElementById("totalJenisBuku");
        const totalStokBuku = document.getElementById("totalStokBuku");


        // ==========================================
        // A. MENAMPILKAN DATA BUKU
        // ==========================================

        function tampilkanKatalog() {

            // Mengosongkan isi tabel sebelum diperbarui
            tabelKatalog.innerHTML = "";

            // Variabel untuk menghitung total stok
            let jumlahStok = 0;

            // Melakukan perulangan pada data katalog
            dataKatalogBuku.forEach(function(buku, index) {

                // Membuat baris tabel
                const baris = document.createElement("tr");

                // Nomor urut
                const kolomNomor = document.createElement("td");
                kolomNomor.textContent = index + 1;

                // Cover buku
                const kolomCover = document.createElement("td");

                if (buku.cover) {

                    const gambar = document.createElement("img");

                    gambar.src = buku.cover;
                    gambar.alt = buku.namaBarang;

                    kolomCover.appendChild(gambar);

                } else {

                    kolomCover.textContent = "Tidak tersedia";

                }

                // Kode barang
                const kolomKode = document.createElement("td");
                kolomKode.textContent = buku.kodeBarang;

                // Nama buku
                const kolomNama = document.createElement("td");
                kolomNama.textContent = buku.namaBarang;

                // Jenis barang
                const kolomJenis = document.createElement("td");
                kolomJenis.textContent = buku.jenisBarang;

                // Edisi
                const kolomEdisi = document.createElement("td");
                kolomEdisi.textContent = buku.edisi;

                // Stok
                const kolomStok = document.createElement("td");
                kolomStok.textContent = buku.stok;

                // Harga
                const kolomHarga = document.createElement("td");
                kolomHarga.textContent = buku.harga;

                // Memberikan warna jika stok habis
                if (Number(buku.stok) === 0) {
                    kolomStok.classList.add("stok-kosong");
                }

                // Memasukkan semua kolom ke baris
                baris.append(
                    kolomNomor,
                    kolomCover,
                    kolomKode,
                    kolomNama,
                    kolomJenis,
                    kolomEdisi,
                    kolomStok,
                    kolomHarga
                );

                // Memasukkan baris ke tabel
                tabelKatalog.appendChild(baris);

                // Menghitung jumlah stok
                jumlahStok += Number(buku.stok);

            });


            // Memperbarui ringkasan katalog
            totalJenisBuku.textContent = dataKatalogBuku.length;

            totalStokBuku.textContent =
                jumlahStok.toLocaleString("id-ID");

        }


        // ==========================================
        // B. MENAMBAHKAN DATA STOK BARU
        // ==========================================

        formTambahStok.addEventListener("submit", function(event) {

            event.preventDefault();

            // Mengambil nilai dari input
            const kode = document.getElementById("kodeBarang").value
                .trim().toUpperCase();

            const nama = document.getElementById("namaBarang").value.trim();

            const jenis = document.getElementById("jenisBarang").value.trim();

            const edisiBaru = document.getElementById("edisi").value;

            const stokBaru = document.getElementById("stok").value;

            const hargaBaru = document.getElementById("harga").value;

            const coverBaru = document.getElementById("cover").value.trim();


            // Memeriksa kode barang yang sudah tersedia
            const kodeSudahAda = dataKatalogBuku.some(function(buku) {

                return buku.kodeBarang.toUpperCase() === kode;

            });


            if (kodeSudahAda) {

                alert("Kode barang sudah terdaftar. Gunakan kode lain.");
                return;

            }


            // Memeriksa jumlah stok
            if (Number(stokBaru) < 0) {

                alert("Jumlah stok tidak boleh kurang dari 0.");
                return;

            }


            // Membuat objek buku baru
            const bukuBaru = {

                kodeBarang: kode,
                namaBarang: nama,
                jenisBarang: jenis,
                edisi: edisiBaru,
                stok: Number(stokBaru),

                harga: "Rp " + Number(hargaBaru).toLocaleString("id-ID"),

                cover: coverBaru ? "img/" + coverBaru : ""

            };


            // Menambahkan buku ke dalam array katalog
            dataKatalogBuku.push(bukuBaru);


            // Memperbarui tabel katalog
            tampilkanKatalog();


            // Mengosongkan form
            formTambahStok.reset();


            // Memberikan informasi berhasil
            alert("Data buku berhasil ditambahkan!");

        });


        // ==========================================
        // C. MENAMPILKAN DATA SAAT HALAMAN DIBUKA
        // ==========================================

        tampilkanKatalog();

    }

}



// ==========================================
// 8. HALAMAN PEMESANAN / CHECKOUT
// ==========================================

const halamanCheckout = document.querySelector(".checkout-page");

if (halamanCheckout) {

    // Memeriksa pengguna yang sedang login
    const penggunaCheckout = JSON.parse(
        localStorage.getItem("penggunaLogin")
    );

    if (!penggunaCheckout) {

        alert("Silakan login terlebih dahulu.");
        window.location.href = "index.html";

    } else {

        // ==========================================
        // A. MENGAMBIL ELEMEN HTML
        // ==========================================

        const formCheckout = document.getElementById("formCheckout");

        const pilihBuku = document.getElementById("pilihBuku");
        const hargaBuku = document.getElementById("hargaBuku");
        const jumlahBuku = document.getElementById("jumlahBuku");
        const totalPembayaran = document.getElementById("totalPembayaran");

        const tabelPemesanan = document.getElementById("tabelPemesanan");
        const tabelHistory = document.getElementById("tabelHistory");

        const jumlahPemesanan = document.getElementById("jumlahPemesanan");
        const totalPendapatan = document.getElementById("totalPendapatan");

        const btnSimpanPesanan = document.getElementById("btnSimpanPesanan");
        const btnBatalEdit = document.getElementById("btnBatalEdit");

        const idPemesanan = document.getElementById("idPemesanan");


        // ==========================================
        // B. MENGAMBIL DATA PEMESANAN
        // ==========================================

        let dataPemesanan = JSON.parse(
            localStorage.getItem("dataPemesanan")
        ) || [];

        dataPemesanan.forEach(function(pesanan) {
            if (pesanan.namaPemesan === "Rina Wulandari"){
                pesanan.nomorDO = "20230012";
            } else if (pesanan.namaPemesan === "Agus Pranoto"){
                pesanan.nomorDO = "20230013";
            } else if (!pesanan.nomorDO){
                pesanan.nomorDO = pesanan.nomorTransaksi.replace(
                "TRX-",
                "DO-"
                );
            }
        });

        localStorage.setItem(
            "dataPemesanan",
            JSON.stringify(dataPemesanan)
        );


        // ==========================================
        // C. FUNGSI FORMAT RUPIAH
        // ==========================================

        function formatRupiah(angka) {

            return "Rp " + Number(angka).toLocaleString("id-ID");

        }


        // Mengubah harga berbentuk "Rp 180.000"
        // menjadi angka 180000
        function ubahHargaKeAngka(harga) {

            return Number(
                String(harga).replace(/[^0-9]/g, "")
            );

        }


        // ==========================================
        // D. MENAMPILKAN PILIHAN BUKU
        // ==========================================

        function tampilkanPilihanBuku() {

            dataKatalogBuku.forEach(function(buku) {

                const option = document.createElement("option");

                option.value = buku.kodeBarang;

                option.textContent =
                    buku.namaBarang + " - " + buku.harga;

                pilihBuku.appendChild(option);

            });

        }


        // ==========================================
        // E. MENGAMBIL HARGA DAN MENGHITUNG TOTAL
        // ==========================================

        function hitungTotalPembayaran() {

            const kodeBuku = pilihBuku.value;

            const bukuDipilih = dataKatalogBuku.find(function(buku) {

                return buku.kodeBarang === kodeBuku;

            });

            if (!bukuDipilih) {

                hargaBuku.value = "";
                totalPembayaran.value = "";

                return;

            }

            const harga = ubahHargaKeAngka(bukuDipilih.harga);

            const jumlah = Number(jumlahBuku.value);

            const total = harga * jumlah;

            hargaBuku.value = formatRupiah(harga);

            totalPembayaran.value = formatRupiah(total);

        }


        pilihBuku.addEventListener("change", hitungTotalPembayaran);

        jumlahBuku.addEventListener("input", hitungTotalPembayaran);


        // ==========================================
        // F. MENYIMPAN DATA KE LOCAL STORAGE
        // ==========================================

        function simpanDataPemesanan() {
            localStorage.setItem(
                "dataPemesanan",
                JSON.stringify(dataPemesanan)
            );
        }

        function buatNomorDO() {
            const waktu = Date.now().toString();
            return "DO-" + waktu
        }


        // ==========================================
        // G. MENAMPILKAN TABEL PEMESANAN
        // ==========================================

        function tampilkanPemesanan() {

            tabelPemesanan.innerHTML = "";

            if (dataPemesanan.length === 0) {

                tabelPemesanan.innerHTML = `
                    <tr>
                        <td colspan="7" class="data-kosong">
                            Belum ada data pemesanan.
                        </td>
                    </tr>
                `;

            } else {

                dataPemesanan.forEach(function(pesanan, index) {

                    const baris = document.createElement("tr");

                    const kolom = [
                        index + 1,
                        pesanan.namaPemesan,
                        pesanan.namaBuku,
                        pesanan.jumlah,
                        formatRupiah(pesanan.total),
                        pesanan.metodePembayaran
                    ];

                    kolom.forEach(function(nilai) {

                        const td = document.createElement("td");

                        td.textContent = nilai;

                        baris.appendChild(td);

                    });


                    // Membuat tombol aksi
                    const kolomAksi = document.createElement("td");

                    const wadahAksi = document.createElement("div");

                    wadahAksi.className = "aksi-button";

                    const tombolEdit = document.createElement("button");

                    tombolEdit.type = "button";
                    tombolEdit.textContent = "Edit";
                    tombolEdit.className = "btn-edit";

                    tombolEdit.addEventListener("click", function() {

                        editPemesanan(pesanan.id);

                    });


                    const tombolHapus = document.createElement("button");

                    tombolHapus.type = "button";
                    tombolHapus.textContent = "Hapus";
                    tombolHapus.className = "btn-delete";

                    tombolHapus.addEventListener("click", function() {

                        hapusPemesanan(pesanan.id);

                    });


                    wadahAksi.append(tombolEdit, tombolHapus);

                    kolomAksi.appendChild(wadahAksi);

                    baris.appendChild(kolomAksi);

                    tabelPemesanan.appendChild(baris);

                });

            }


            // Memperbarui laporan pemesanan
            jumlahPemesanan.textContent = dataPemesanan.length;

            const pendapatan = dataPemesanan.reduce(function(total, pesanan) {

                return total + Number(pesanan.total);

            }, 0);

            totalPendapatan.textContent = formatRupiah(pendapatan);

        }


        // ==========================================
        // H. PROSES SIMPAN DAN UBAH PEMESANAN
        // ==========================================

        formCheckout.addEventListener("submit", function(event) {

            event.preventDefault();

            const nama = document.getElementById("namaPemesan").value.trim();

            const email = document.getElementById("emailPemesan").value.trim();

            const kodeBuku = pilihBuku.value;

            const jumlah = Number(jumlahBuku.value);

            const metode = document.getElementById("metodePembayaran").value;


            // Memeriksa buku yang dipilih
            const bukuDipilih = dataKatalogBuku.find(function(buku) {

                return buku.kodeBarang === kodeBuku;

            });

            if (!bukuDipilih) {

                alert("Silakan pilih buku terlebih dahulu.");
                return;

            }


            // Memeriksa jumlah pesanan
            if (!Number.isInteger(jumlah) || jumlah < 1) {

                alert("Jumlah buku minimal 1.");
                return;

            }


            // Memeriksa stok buku
            if (jumlah > Number(bukuDipilih.stok)) {

                alert("Jumlah pesanan melebihi stok buku yang tersedia.");
                return;

            }


            const harga = ubahHargaKeAngka(bukuDipilih.harga);

            const total = harga * jumlah;


            // Membuat objek pemesanan
            const pesananBaru = {

                id: idPemesanan.value || Date.now().toString(),

                nomorTransaksi: "TRX-" + Date.now(),
                nomorDO: buatNomorDO(),

                namaPemesan: nama,

                emailPemesan: email,

                kodeBarang: bukuDipilih.kodeBarang,

                namaBuku: bukuDipilih.namaBarang,

                jumlah: jumlah,

                harga: harga,

                total: total,

                metodePembayaran: metode,

                tanggal: new Date().toLocaleString("id-ID")

            };


            if (idPemesanan.value) {

                // Mencari data yang akan diubah
                const index = dataPemesanan.findIndex(function(pesanan) {

                    return pesanan.id === idPemesanan.value;

                });

                if (index !== -1) {

                    // Mempertahankan nomor transaksi lama
                    pesananBaru.nomorTransaksi =
                        dataPemesanan[index].nomorTransaksi;

                    pesananBaru.nomorDO = 
                    dataPemesanan[index].nomorDO;

                    pesananBaru.tanggal =
                        dataPemesanan[index].tanggal;

                        dataPemesanan[index] = pesananBaru;

                    alert("Data pemesanan berhasil diperbarui!");

                }

            } else {

                // Menambahkan pemesanan baru
                dataPemesanan.push(pesananBaru);

                alert("Pemesanan berhasil disimpan!");

            }


            // Menyimpan data dan memperbarui tampilan
            simpanDataPemesanan();

            tampilkanPemesanan();

            tampilkanHistory();

            resetFormCheckout();

        });


        // ==========================================
        // I. FUNGSI EDIT PEMESANAN
        // ==========================================

        function editPemesanan(id) {

            const pesanan = dataPemesanan.find(function(item) {

                return item.id === id;

            });

            if (!pesanan) return;


            document.getElementById("namaPemesan").value =
                pesanan.namaPemesan;

            document.getElementById("emailPemesan").value =
                pesanan.emailPemesan;

            pilihBuku.value = pesanan.kodeBarang;

            jumlahBuku.value = pesanan.jumlah;

            document.getElementById("metodePembayaran").value =
                pesanan.metodePembayaran;

            idPemesanan.value = pesanan.id;


            // Memperbarui harga dan total
            hitungTotalPembayaran();


            // Mengubah tampilan tombol
            document.getElementById("judulFormPemesanan").textContent =
                "Edit Data Pemesanan";

            btnSimpanPesanan.textContent = "Simpan Perubahan";

            btnBatalEdit.hidden = false;


            // Mengarahkan tampilan ke form
            formCheckout.scrollIntoView({
                behavior: "smooth"
            });

        }


        // ==========================================
        // J. FUNGSI HAPUS PEMESANAN
        // ==========================================

        function hapusPemesanan(id) {

            const konfirmasi = confirm(
                "Apakah kamu yakin ingin menghapus pemesanan ini?"
            );

            if (konfirmasi) {

                dataPemesanan = dataPemesanan.filter(function(pesanan) {

                    return pesanan.id !== id;

                });

                simpanDataPemesanan();

                tampilkanPemesanan();

                tampilkanHistory();

                alert("Data pemesanan berhasil dihapus!");

            }

        }


        // ==========================================
        // K. RESET FORM PEMESANAN
        // ==========================================

        function resetFormCheckout() {

            formCheckout.reset();

            idPemesanan.value = "";

            jumlahBuku.value = 1;

            hargaBuku.value = "";

            totalPembayaran.value = "";

            document.getElementById("judulFormPemesanan").textContent =
                "Form Informasi Pemesanan";

            btnSimpanPesanan.textContent = "Simpan Pemesanan";

            btnBatalEdit.hidden = true;

        }


        btnBatalEdit.addEventListener("click", function() {

            resetFormCheckout();

        });


        // ==========================================
        // L. MENAMPILKAN HISTORY TRANSAKSI
        // ==========================================

        function tampilkanHistory() {

            tabelHistory.innerHTML = "";

            if (dataPemesanan.length === 0) {

                tabelHistory.innerHTML = `
                    <tr>
                        <td colspan="7" class="data-kosong">
                            Belum ada history transaksi.
                        </td>
                    </tr>
                `;

                return;

            }


            dataPemesanan.forEach(function(pesanan, index) {

                const baris = document.createElement("tr");

                const dataKolom = [

                    index + 1,

                    pesanan.nomorTransaksi,
                    pesanan.nomorDO,

                    pesanan.namaPemesan,

                    pesanan.tanggal,

                    formatRupiah(pesanan.total),

                    pesanan.metodePembayaran

                ];


                dataKolom.forEach(function(nilai) {

                    const td = document.createElement("td");

                    td.textContent = nilai;

                    baris.appendChild(td);

                });


                tabelHistory.appendChild(baris);

            });

        }


        // ==========================================
        // M. MENGISI NAMA DAN EMAIL PENGGUNA
        // ==========================================

        document.getElementById("namaPemesan").value =
            penggunaCheckout.nama;

        document.getElementById("emailPemesan").value =
            penggunaCheckout.email;


        // ==========================================
        // N. MENJALANKAN TAMPILAN AWAL
        // ==========================================

        tampilkanPilihanBuku();

        tampilkanPemesanan();

        tampilkanHistory();

    }

}

// ==========================================
// 9. HALAMAN TRACKING PENGIRIMAN
// ==========================================

const halamanTracking = document.querySelector(".tracking-page");

if (halamanTracking) {

    // Mengambil elemen HTML
    const formTracking = document.getElementById("formTracking");
    const inputNomorDO = document.getElementById("nomorDO");

    const hasilTracking = document.getElementById("hasilTracking");
    const pesanTracking = document.getElementById("pesanTracking");

    const daftarPerjalanan = document.getElementById("daftarPerjalanan");


    // Mengambil data pemesanan dari Local Storage
    const dataPemesananTracking = JSON.parse(
        localStorage.getItem("dataPemesanan")
    ) || [];


    // Memproses pencarian Nomor DO
    formTracking.addEventListener("submit", function(event) {

        event.preventDefault();

        const nomorDO = inputNomorDO.value.trim();

        hasilTracking.hidden = true;
        pesanTracking.hidden = true;


        // 1. Mencari data tracking bawaan
        let dataDitemukan = dataTracking[nomorDO];


        // 2. Jika tidak ditemukan, cari dari data pemesanan
        if (!dataDitemukan) {

            const pesanan = dataPemesananTracking.find(function(item) {

                return item.nomorDO === nomorDO;

            });


            // Jika pesanan ditemukan, buat data tracking simulasi
            if (pesanan) {

                dataDitemukan = {

                    nomorDO: pesanan.nomorDO,

                    nama: pesanan.namaPemesan,

                    status: "Menunggu Pengiriman",

                    ekspedisi: "Belum ditentukan",

                    tanggalKirim: pesanan.tanggal,

                    paket: "-",

                    total: formatRupiah(pesanan.total),

                    perjalanan: [
                        {
                            waktu: pesanan.tanggal,
                            keterangan: "Pesanan berhasil dibuat dan menunggu proses pengiriman."
                        }
                    ]

                };

            }

        }


        // 3. Menampilkan pesan jika data tidak ditemukan
        if (!dataDitemukan) {

            pesanTracking.hidden = false;

            return;

        }


        // 4. Menampilkan informasi pengiriman
        document.getElementById("hasilNomorDO").textContent =
            dataDitemukan.nomorDO;

        document.getElementById("hasilNama").textContent =
            dataDitemukan.nama;

        document.getElementById("hasilStatus").textContent =
            dataDitemukan.status;

        document.getElementById("hasilEkspedisi").textContent =
            dataDitemukan.ekspedisi;

        document.getElementById("hasilTanggal").textContent =
            dataDitemukan.tanggalKirim;

        document.getElementById("hasilPaket").textContent =
            dataDitemukan.paket;

        document.getElementById("hasilTotal").textContent =
            dataDitemukan.total;


        // 5. Menampilkan riwayat perjalanan
        daftarPerjalanan.innerHTML = "";

        dataDitemukan.perjalanan.forEach(function(item) {

            const elemenPerjalanan = document.createElement("div");

            elemenPerjalanan.className = "tracking-item";

            const waktu = document.createElement("p");

            waktu.textContent = item.waktu;

            const keterangan = document.createElement("p");

            keterangan.textContent = item.keterangan;

            elemenPerjalanan.appendChild(waktu);

            elemenPerjalanan.appendChild(keterangan);

            daftarPerjalanan.appendChild(elemenPerjalanan);

        });


        // Menampilkan hasil tracking
        hasilTracking.hidden = false;

    });

}