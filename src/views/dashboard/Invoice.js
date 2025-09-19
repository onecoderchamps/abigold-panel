import React, { useEffect } from 'react';
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from '../../api/firebase';

const database = "invoice";

const InvoiceScreen = () => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const parts = url.split('#');
  const invoiceId = parts[2];

  const handlePrint = () => {
    window.print();
  };

  const [kurir, setkurir] = React.useState("");

  async function readOneDocumentById(docId) {
    const docRef = doc(db, database, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setkurir({ id: docSnap.id, ...docSnap.data() });
      console.log({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    readOneDocumentById(invoiceId);
  }, []);

  function maskNumber(number) {
    const str = String(number);
    if (str.length <= 4) return str;
    const firstTwo = str.substring(0, 2);
    const lastTwo = str.substring(str.length - 2);
    const maskedMiddle = '*'.repeat(str.length - 4);
    return `${firstTwo}${maskedMiddle}${lastTwo}`;
  }

  return (
    <div className="print-container" style={{ fontFamily: 'Arial, sans-serif', padding: '40px', marginRight: '100px', marginLeft: '100px', backgroundColor: '#f4f4f4' }}>
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
            .print-container {
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding: 40px !important;
            }
          }
        `}
      </style>

      {/* Tombol Print */}
      <div className="no-print" style={{ marginBottom: '20px' }}>
        <button onClick={handlePrint} style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cetak Invoice
        </button>
      </div>

      {/* Logo + Header Invoice */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ textAlign: 'right' }}>
          <img src="https://abigold.co.id/Abi.png" alt="ABI Logo" style={{ width: '150px', marginBottom: '10px' }} />
        </div>
        
        {/* Logo dan Teks di kanan */}
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ margin: 0 }}>Faktur</h1>
        </div>
      </div>

      {/* Data Perusahaan & Invoice Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
      }}>

        {/* Kiri: Info perusahaan */}
        <div style={{ textAlign: 'left' }}>
          <strong>PT. AURUM BARAKAH INDONESIA</strong><br />
          <strong>The Plaza Office Tower</strong><br />
          <strong>Jl. M.H Thamrin Kav. 28-30, Lantai 7, Suite 7058</strong><br />
          <strong>Jakarta 10350</strong><br />
          <strong>Phone: +6287825159746</strong><br />
          <strong>abigold.co.id</strong><br />
        </div>

        {/* Kanan: Invoice dan Tanggal */}
        <div style={{ textAlign: 'right' }}>
          <div><strong>Invoice :</strong> {kurir.invoice}</div>
          <div><strong>Tanggal Pembelian :</strong> {kurir.tanggalPembelian}</div>
        </div>

      </div>

      {/* Pembeli */}
      <strong>Dijual Kepada</strong><br />
      <div style={{ marginBottom: '20px' }}>
        <strong>Nama :</strong> {kurir.namaLengkap}<br />
        <strong>Alamat Pengiriman :</strong> {kurir.alamat}<br />
        <strong>NIK :</strong> {maskNumber(kurir.noKtp)}<br />
        <strong>No HP :</strong> {kurir.phone}<br />
      </div>

      {/* Tabel Produk */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={cellStyle}>Info Produk</th>
            <th style={cellStyle}>Jumlah</th>
            <th style={rightCellStyle}>Total Harga</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>{kurir.item}</td>
            <td style={cellStyle}>1</td>
            <td style={rightCellStyle}>{parseInt(kurir?.total)?.toLocaleString('id')}</td>
          </tr>
        </tbody>
      </table>

      {/* Totalan */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={rightCellStyle}>Harga Barang:</td>
            <td style={rightCellStyle}>Rp {parseInt(kurir?.total)?.toLocaleString('id')}</td>
          </tr>
          <tr>
            <td style={rightCellStyle}>Biaya Pengiriman:</td>
            <td style={rightCellStyle}>Rp {parseInt(kurir?.ongkir)?.toLocaleString('id')}</td>
          </tr>
          <tr>
            <th style={rightCellStyle}>Total:</th>
            <th style={rightCellStyle}>Rp {(parseInt(kurir?.total) + parseInt(kurir?.ongkir))?.toLocaleString('id')}</th>
          </tr>
        </tbody>
      </table>
      <br />
      <p>
        Pembayaran ditujukan kepada:
        <br /> 
        PT. Aurum Berkah Indonesia
        <br /> 
        Bank Syariah Indonesia
        <br /> 
        7300903465
      </p>

      <br />
      <p>
        Catatan
        <br /> 

        <em>
          * Bukti pembelian ini merupakan kwitansi pembelian emas.
          <br /> 
          * Mohon bukti pembelian ini disimpan jangan sampai hilang atau rusak.
          <br /> 
          * PPN tidak dipungut sesuai Peraturan Pemerintah (PP) No. 49 tahun 2022.
        </em>
      </p>
    </div>
  );
};

const cellStyle = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'left',
};

const rightCellStyle = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'right',
};

export default InvoiceScreen;
