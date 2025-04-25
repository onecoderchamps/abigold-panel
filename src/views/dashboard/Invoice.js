import React, { useEffect } from 'react';
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from '../../api/firebase';

const database = "order"

const InvoiceScreen = () => {
  const url = window.location.href;
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
      console.log({ id: docSnap.id, ...docSnap.data() })
    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    readOneDocumentById(invoiceId);
  }, []);

  return (
    <div className="print-container" style={{ fontFamily: 'Arial, sans-serif', padding: '40px', marginRight: '500px', marginLeft: '500px', backgroundColor: '#f4f4f4' }}>
      <style>
        {`
          @media print {
        .no-print {
          display: none;
        }
        .print-container {
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding: 40 !important;
        }
      }
        `}
      </style>
      <div className="no-print" style={{ marginBottom: '20px' }}>
        <button onClick={handlePrint} style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cetak Invoice
        </button>
      </div>

      <h1 style={{ textAlign: 'center' }}>INVOICE | ABI</h1>
      <br />

      <div style={{ marginBottom: '20px' }}>
        <strong>Invoice :</strong> {kurir.noInvoice}<br />
        <strong>Pembeli :</strong> {kurir.namaLengkap}<br />
        <strong>Tanggal Pembelian :</strong>{kurir === "" ? "" : new Date(kurir.createdAt.seconds * 1000).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}<br /><br />
        <strong>Alamat Pengiriman :</strong><br />
        {kurir.namaLengkap} ({kurir.ponsel})<br />
        {kurir.alamat}<br />
      </div>

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
            <td style={cellStyle}>{kurir.namaProduct}</td>
            <td style={cellStyle}>1</td>
            <td style={rightCellStyle}>{kurir?.price?.toLocaleString('id')}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={rightCellStyle}>Subtotal Harga Barang:</td>
            <td style={rightCellStyle}>Rp {kurir?.price?.toLocaleString('id')}</td>
          </tr>
          <tr>
            <td style={rightCellStyle}>Total Ongkos Kirim:</td>
            <td style={rightCellStyle}>Rp {kurir?.biayaKurir?.toLocaleString('id')}</td>
          </tr>
          <tr>
            <th style={rightCellStyle}>TOTAL TAGIHAN:</th>
            <th style={rightCellStyle}>Rp {(kurir?.price + kurir?.biayaKurir)?.toLocaleString('id')}</th>
          </tr>
          {/* <tr>
            <td style={rightCellStyle}>Metode Pembayaran:</td>
            <td style={rightCellStyle}>GoPay</td>
          </tr> */}
        </tbody>
      </table>
      <br />
      <p><em>Invoice ini sah dan diproses oleh komputer. <br /> Silakan hubungi ABI Care apabila kamu membutuhkan bantuan.</em></p>
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

const items = [
  {
    nama: 'Sticker Fragile Unboxing HANDLE WITH CARE Stiker Cromo isi 200 / Pack - LB Frag Hitam',
    jumlah: 1,
    hargaSatuan: 'Rp 7.250',
    total: 'Rp 7.250',
  }
];

export default InvoiceScreen;
