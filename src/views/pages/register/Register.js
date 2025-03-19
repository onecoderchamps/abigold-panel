import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../api/firebase'

const Register = () => {

  const [kode, setKode] = useState("");
  const [kurir, setkurir] = useState("");
  const [pembeli, setpembeli] = useState("");


  async function readDataDFromFirestore(a,b) {
    const dataArray = [];
    const q = query(collection(db, "product"), where("id", "==", a));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });
    setkurir(dataArray[0]);
    setpembeli(b);

    // console.log(dataArray);
  }


  async function readDataFromFirestore() {
    const dataArray = [];
    const q = query(collection(db, "order"), where("noInvoice", "==", kode));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });
    if(dataArray.length !== 0 && dataArray[0].status === "selesai")
    {
      readDataDFromFirestore(dataArray[0].idProduct, dataArray[0].namaLengkap)
    }else{
      alert("Kode tidak valid, silahkan masukkan kode yang benar")
    }
  }



  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>ABI Verifikator</h1>
                  <p className="text-body-secondary">Silahkan Masukkan Kode Invoice</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} className="me-2" />
                    </CInputGroupText>
                    <CFormInput placeholder="Nomor Invoice" value={kode}
                      onChange={(e) => setKode(e.target.value)} />
                  </CInputGroup>
                  {kurir === "" &&
                    <div className="d-grid">
                      <CButton onClick={() => readDataFromFirestore()} color="success">Verifikasi</CButton>
                    </div>
                  }
                  {kurir !== "" &&
                    <div>
                      <div className="d-flex justify-content-center align-items-center m-5">
                        <img src={kurir.image1} width={300} height={300} />
                      </div>
                      Spesifikasi
                      <CRow>
                        <CCol>
                          Product
                          <br />
                          Berat
                          <br />
                          Pembuatan
                          <br />
                          Pembeli Pertama
                          <br />
                          Status
                        </CCol>
                        <CCol className="text-end">
                          {kurir.nama}
                          <br />
                          {kurir.berat}
                          <br />
                          Batch {kurir.batch} Tahun {kurir.pembuatan} 
                          <br />
                          {pembeli}
                          <br />
                          <div className="text-color:success">Terverifikasi</div>
                        </CCol>
                      </CRow>
                    </div>
                  }
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
