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
  CFormInput
} from '@coreui/react'
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../api/firebase';

const database = "rekening"

const RekeningScreen = () => {

  const [kurir, setkurir] = useState([]);
  const [visible, setVisible] = useState(false)
  const [visibleDelete, setvisibleDelete] = useState(false)

  /////modal

  const [form, setForm] = useState(
    {
      title:'',
      id: '',
      nama: '',
      nomor: '',
      bank: ''
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
      bank: '',
      nama: '',
      nomor: ''
    })
  }

  const OpenUpdateItem = (e) => {
    setVisible(!visible)
    setForm({
      id: e.id,
      title: "Update Data",
      bank: e.bank,
      nama: e.nama,
      nomor: e.nomor
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
          bank: form.bank,
          nama: form.nama,
          nomor: form.nomor
        });
        console.log("Data berhasil ditambahkan");
      } catch (error) {
        console.error("Error menambahkan data: ", error);
      }
    } else {
      try {
        const docRef = doc(db, database, form.id); // Assuming form.id contains the document ID
        await updateDoc(docRef, {
          bank: form.bank,
          nama: form.nama,
          nomor: form.nomor
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
            <CCardHeader>Rekening Tersedia</CCardHeader>
            <CCardBody>
              {/* <CButton color="info" variant="outline" onClick={OpenAddItem}>Tambah</CButton> */}
              <div className="m-2"></div>
              <CTable striped align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Bank</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Nama Rekening
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Nomor</CTableHeaderCell>
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
                        <div className="text-body-secondary">{item.bank}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.nama}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.nomor}</div>
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
                <CFormInput
                  placeholder="Bank"
                  autoComplete="bank"
                  name="bank"
                  value={form.bank}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Nama Rek"
                  autoComplete="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Rekening"
                  autoComplete="nomor"
                  name="nomor"
                  id="nomor"
                  value={form.nomor}
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
