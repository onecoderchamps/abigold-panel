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
  CFormLabel,
  CFormTextarea
} from '@coreui/react'
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../api/firebase';

const database = "product"

const RekeningScreen = () => {

  const [kurir, setkurir] = useState([]);
  const [visible, setVisible] = useState(false)
  const [visibleDelete, setvisibleDelete] = useState(false)

  /////modal

  const [form, setForm] = useState(
    {
      title: '',
      id: '',

      nama: "",
      batch: "",
      pembuatan: "",
      berat: "",
      desc2: "",
      desc1: "",
      image1: "",
      image2: "",
      image3: "",
      harga: 0,
      bonus: 0
    }
  )

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "harga" ? Number(value) : name === "bonus" ? Number(value) : value
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
    console.log(dataArray)
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
      title: "Update Data",
      bank: e.bank,
      nama: e.nama,
      nomor: e.nomor
    })
  }


  useEffect(() => {
    readDataFromFirestore();
  }, []);


  const DeleteItem = async () => {
    console.log(form.id)
    try {
      await deleteDoc(doc(db, database, form.id));
      readDataFromFirestore();
    } catch (error) {
      // console.error("Error menghapus data: ", error);
    }
    setvisibleDelete(false); // Close the delete modal
  };

  const approveUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (form.title === "Tambah Data") {
      try {
        await addDoc(collection(db, database), {
          ...form
        });
        console.log("Data berhasil ditambahkan");
      } catch (error) {
        console.error("Error menambahkan data: ", error);
      }
    } else {
      try {
        const docRef = doc(db, database, form.id); // Assuming form.id contains the document ID
        await updateDoc(docRef, {
          ...form
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
            <CCardHeader>Produk Aktif</CCardHeader>
            <CCardBody>
              <CButton color="info" variant="outline" onClick={OpenAddItem}>Tambah</CButton>
              <div className="m-2"></div>
              <CTable striped align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Produk</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Nama
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Berat</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Harga</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {kurir.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-left">
                        <div className="text-body-secondary">{index + 1}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-left">
                        <img src={item.image1} width={50} height={50} className="text-body-secondary" />
                      </CTableDataCell>
                      <CTableDataCell className="text-left">
                        <div className="text-body-secondary">{item.nama}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.berat}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.harga.toLocaleString("id-ID")}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButtonGroup role="group">
                          {/* <CButton variant="outline" color="danger" onClick={() => OpenDeleteItem(item)}>Delete</CButton> */}
                          <CButton variant="outline" color="success" onClick={() => OpenUpdateItem(item)}>Update</CButton>
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
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Nama Produk
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Batch
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="batch"
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Pembuatan
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="pembuatan"
                  name="pembuatan"
                  value={form.pembuatan}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Berat
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="berat"
                  name="berat"
                  value={form.berat}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Harga
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="harga"
                  name="harga"
                  id="harga"
                  value={form.harga}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Bonus
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="bonus"
                  name="bonus"
                  id="bonus"
                  value={form.bonus}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Gambar Utama
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="image1"
                  name="image1"
                  id="image1"
                  value={form.image1}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Gambar Cadangan
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="image2"
                  name="image2"
                  id="image2"
                  value={form.image2}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Banner
                </CFormLabel>
                <CFormInput
                  placeholder="........."
                  autoComplete="image3"
                  name="image3"
                  id="image3"
                  value={form.image3}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                  Deskripsi
                </CFormLabel>
                <CFormTextarea
                  placeholder="........."
                  autoComplete="desc1"
                  name="desc1"
                  id="desc1"
                  rows={10}
                  value={form.desc1}
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

export default RekeningScreen
