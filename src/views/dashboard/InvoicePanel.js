import React, { useState, useEffect } from 'react'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
  CForm,
  CInputGroup,
  CFormInput,
  CFormLabel
} from '@coreui/react'
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../api/firebase';

const database = "invoice"

const InvoicePanelScreen = () => {

  const [kurir, setkurir] = useState([]);
  const [visible, setVisible] = useState(false)
  const [visibleDelete, setvisibleDelete] = useState(false)

  /////modal

  const [form, setForm] = useState(
    {
      namaLengkap: '',
      noKtp: '',
      phone: '',
      alamat: '',
      ongkir: '',
      total: '',
      tanggalPembelian: '',
      item: '',
    }
  )

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  //////

  async function readDataFromFirestore() {
    const dataArray = [];
    const querySnapshot = await getDocs(collection(db, database));
    querySnapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });
    setkurir(dataArray);
  }

  const OpenAddItem = () => {
    setVisible(!visible)
    setForm({
      title: "Tambah Data",
    })
  }

  const OpenUpdateItem = (e) => {
    setVisible(!visible)
    setForm({
      title: "Update Data",
      ...e
    })
  }

  const OpenDeleteItem = (e) => {
    setvisibleDelete(!visible)
    setForm({
      id: e.id,
      namaLengkap: e.namaLengkap,
      noKtp: e.noKtp,
      phone: e.phone,
      alamat: e.alamat,
      ongkir: e.ongkir,
      total: e.total,
      tanggalPembelian: e.tanggalPembelian,
      item: e.item
    })
  }


  useEffect(() => {
    readDataFromFirestore();
  }, []);


  const DeleteItem = async () => {
    try {
      await deleteDoc(doc(db, database, form.id));
      readDataFromFirestore();
    } catch (error) {
      console.error("Error menghapus data: ", error);
    }
    setvisibleDelete(false); // Close the delete modal
  };

  function generateInvoice() {
    const today = new Date();

    // Ambil 3 huruf pertama dari nama PT
    const prefix = "ABI";

    // Nomor unik (4 digit)
    const unique = String(kurir.length + 1).padStart(4, '0');

    // Bulan sekarang (2 digit)
    const month = String(today.getMonth() + 1).padStart(2, '0');

    // Format tanggal transaksi (DDMMYYYY)
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const dateCode = `${day}${month}${year}`;

    return `${prefix}-${unique}-${month}-${dateCode}`;
  }

  const approveUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (form.title === "Tambah Data") {
      try {
        await addDoc(collection(db, database), {
          invoice: generateInvoice(),
          namaLengkap: form.namaLengkap,
          noKtp: form.noKtp,
          phone: form.phone,
          alamat: form.alamat,
          ongkir: form.ongkir,
          total: form.total,
          item: form.item,

          tanggalPembelian: form.tanggalPembelian,

        });
        console.log("Data berhasil ditambahkan");
      } catch (error) {
        console.error("Error menambahkan data: ", error);
      }
    } else {
      try {
        const docRef = doc(db, database, form.id); // Assuming form.id contains the document ID
        await updateDoc(docRef, {
          namaLengkap: form.namaLengkap,
          noKtp: form.noKtp,
          phone: form.phone,
          alamat: form.alamat,
          ongkir: form.ongkir,
          tanggalPembelian: form.tanggalPembelian,
          total: form.total,
          item: form.item,
        });
        // console.log("Data berhasil diperbarui");
      } catch (error) {
        // console.error("Error memperbarui data: ", error);
      }
    }
    setVisible(false); // Close the modal after operation
    readDataFromFirestore(); // Refresh the data
  };


  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Banner</CCardHeader>
            <CCardBody>
              <CButton color="info" variant="outline" onClick={OpenAddItem}>Tambah Invoice</CButton>
              <div className="m-2"></div>
              <CTable striped align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Invoice</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nama Pembeli</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">No Ponsel</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nama Product</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Ongkir</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Harga Beli</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Tanggal Pembelian</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {kurir.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-left">
                        <div className="text-body-secondary">{index + 1}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.invoice}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.namaLengkap}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.phone}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.item}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.ongkir}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.total}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.tanggalPembelian}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButtonGroup role="group">
                          <CButton variant="outline" color="danger" onClick={() => OpenDeleteItem(item)}>Delete</CButton>
                          <CButton variant="outline" color="success" onClick={() => OpenUpdateItem(item)}>Update</CButton>
                          <CButton variant="outline" color="info" onClick={() => window.open(`/#/invoice#${item.id}`, '_blank')}>Cetak Invoice</CButton>
                        </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CModal
          size="xl"
          alignment="center"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="VerticallyCenteredExample"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">{form.title}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={approveUpdate}>
              <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                Customer
              </CFormLabel>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Nama Pembeli
                </CFormLabel>
                <CFormInput
                  placeholder="Nama"
                  autoComplete="namaLengkap"
                  name="namaLengkap"
                  value={form.namaLengkap}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Nomor KTP
                </CFormLabel>
                <CFormInput
                  placeholder="Ktp"
                  autoComplete="noKtp"
                  name="noKtp"
                  value={form.noKtp}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Nomor Ponsel
                </CFormLabel>
                <CFormInput
                  placeholder="Ponsel"
                  autoComplete="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Alamat
                </CFormLabel>
                <CFormInput
                  placeholder="Alamat"
                  autoComplete="alamat"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                Product
              </CFormLabel>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Nama Product
                </CFormLabel>
                <CFormInput
                  placeholder="Product"
                  autoComplete="item"
                  name="item"
                  value={form.item}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Harga Ongkir
                </CFormLabel>
                <CFormInput
                  placeholder="Ongkir"
                  autoComplete="ongkir"
                  name="ongkir"
                  value={form.ongkir}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Harga Pembelian
                </CFormLabel>
                <CFormInput
                  placeholder="Pembelian"
                  autoComplete="total"
                  name="total"
                  value={form.total}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Tanggal Pembelian
                </CFormLabel>
                <CFormInput
                  placeholder="Cth : 12/12/2023"
                  autoComplete="tanggalPembelian"
                  name="tanggalPembelian"
                  value={form.tanggalPembelian}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={approveUpdate}>Save changes</CButton>
          </CModalFooter>
        </CModal>
        <CModal
          alignment="center"
          visible={visibleDelete}
          onClose={() => setvisibleDelete(false)}
          aria-labelledby="deleteModal"
        >
          <CModalHeader>
            <CModalTitle id="deleteModal">Delete Data</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Yakin Ingin Hapus Data ?
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => setvisibleDelete(false)}>
              Close
            </CButton>
            <CButton color="secondary" onClick={DeleteItem}>Delete</CButton>
          </CModalFooter>
        </CModal>
      </CRow>
    </>
  )


}

export default InvoicePanelScreen
