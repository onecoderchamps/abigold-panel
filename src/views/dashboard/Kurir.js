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

const database = "kurir"

const KurirScreen = () => {

  const [kurir, setkurir] = useState([]);
  const [visible, setVisible] = useState(false)
  const [visibleDelete, setvisibleDelete] = useState(false)

  /////modal

  const [form, setForm] = useState(
    {
      id: '',
      title: '',
      label: '',
      price: 0,
      value: ''
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
      label: '',
      price: 0,
      value: ''
    })
  }

  const OpenUpdateItem = (e) => {
    setVisible(!visible)
    setForm({
      id: e.id,
      title: "Update Data",
      label: e.label,
      price: e.price,
      value: e.value
    })
  }

  const OpenDeleteItem = (e) => {
    setvisibleDelete(!visible)
    setForm({
      id: e.id,
      title: "Update Data",
      label: e.label,
      price: e.price,
      value: e.value
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

  const approveUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (form.title === "Tambah Data") {
      try {
        await addDoc(collection(db, database), {
          label: form.label,
          price: Number(form.price),
          value: form.value
        });
        console.log("Data berhasil ditambahkan");
      } catch (error) {
        console.error("Error menambahkan data: ", error);
      }
    } else {
      try {
        const docRef = doc(db, database, form.id); // Assuming form.id contains the document ID
        await updateDoc(docRef, {
          label: form.label,
          price: Number(form.price),
          value: form.value
        });
        console.log("Data berhasil diperbarui");
      } catch (error) {
        console.error("Error memperbarui data: ", error);
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
            <CCardHeader>Kurir Tersedia</CCardHeader>
            <CCardBody>
              <CButton color="info" variant="outline" onClick={OpenAddItem}>Tambah</CButton>
              <div className="m-2"></div>
              <CTable striped align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Kurir</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Ongkir
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Value</CTableHeaderCell>
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
                        <div className="text-body-secondary">{item.label}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">Rp {item.price.toLocaleString("id-ID")}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="text-body-secondary">{item.value}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButtonGroup role="group">
                          <CButton variant="outline" color="danger" onClick={() => OpenDeleteItem(item)}>Delete</CButton>
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
                  placeholder="Title"
                  autoComplete="label"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Value"
                  autoComplete="value"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CFormInput
                  placeholder="Ongkir"
                  autoComplete="price"
                  name="price"
                  value={form.price}
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

export default KurirScreen
