import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CProgress,
  CRow,
  CTab,
  CTabContent,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'

import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../api/firebase';
import routes from '../../routes';

const database = "order"

const Dashboard = () => {

  const [payment, setpayment] = useState([]);
  const [packing, setpacking] = useState([]);
  const [onSend, setonSend] = useState([]);
  const [done, setdone] = useState([]);
  const [cancel, setcancel] = useState([]);

  async function tarikKomisi(id, status) {
    const docRef = doc(db, "order", id); // Assuming form.id contains the document ID
    await updateDoc(docRef, {
      isPayed: true,
      status: status
    });
    readDataFromFirestore()
  }

  async function readDataFromFirestore() {
    const dataArray = [];
    const querySnapshot = await getDocs(collection(db, database));
    querySnapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });
    const filterPayment = dataArray.filter((data) => !data.isPayed)
    const filterPacking = dataArray.filter((data) => data.isPayed && data.status === "toKurir")
    const filterOnSend = dataArray.filter((data) => data.isPayed && data.status === "onKurir")
    const filterSelesai = dataArray.filter((data) => data.isPayed && data.status === "selesai")
    const filterCancel = dataArray.filter((data) => data.isPayed && data.status === "cancel")

    setpayment(filterPayment);
    setpacking(filterPacking);
    setonSend(filterOnSend);
    setdone(filterSelesai);
    setcancel(filterCancel);
    console.log(dataArray);
  }

  useEffect(() => {
    readDataFromFirestore();
  }, []);

  const File = (item, index) => {
    return (
      <CCard key={index} style={{ width: '35rem' }}>
        <CCardBody>
          <CRow>
            <CCol>
              <CCardText>Kode Product</CCardText>
            </CCol>
            <CCol>
              <CCardText className="text-end">{item.noInvoice}</CCardText>
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol>
              Pengantaran
              <br />
              Kurir
              <br />
              Ongkir
              <br />
              Alamat
            </CCol>
            <CCol className="text-end">
              <br />
              {item.kurir}
              <br />
              Rp {item.biayaKurir.toLocaleString("id-ID")}
              <br />
              {item.alamat}
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol>
              Penerima
              <br />
              Nama Lengkap
              <br />
              No KTP
              <br />
              Phone
            </CCol>
            <CCol className="text-end">
              <br />
              {item.namaLengkap}
              <br />
              {item.nomorKtp}
              <br />
              {item.ponsel}
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol>
              Produk Pembelian
              <br />
              Nama
              <br />
              Biaya
              {/* <br />
              Donasi */}
            </CCol>
            <CCol className="text-end">
              <br />
              {item.namaProduct}
              <br />
              Rp {(item.price + item.biayaKurir).toLocaleString("id-ID")}
              {/* <br />
              Rp {item.biayaDonasi.toLocaleString("id-ID")} */}
            </CCol>
          </CRow>
          <br></br>
          {item.status === "pending" &&
            <CButton className="m-1" color="cancel" onClick={() => tarikKomisi(item.id, "cancel")}>
              Cancel
            </CButton>
          }
          {item.status === "pending" &&
            <CButton color="primary" onClick={() => tarikKomisi(item.id, "toKurir")}>
              Lanjutkan ke Packing
            </CButton>
          }
          {item.status === "toKurir" &&
            <CButton color="primary" onClick={() => tarikKomisi(item.id, "onKurir")}>
              Lanjutkan ke Kurir
            </CButton>
          }
          <CRow>

            {item.status === "onKurir" &&
              <CButton color="primary" onClick={() => tarikKomisi(item.id, "selesai")}>
                Selesai
              </CButton>
            }
            <div style={{ margin: 20 }}></div>
            {item.status !== "pending" &&
              <CButton color="green" onClick={() => window.open(`/#/invoice#${item.id}`, '_blank')}>
                Download Invoice
              </CButton>
            }
          </CRow>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <>
      {/* <WidgetsDropdown className="mb-4" /> */}
      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CTabs activeItemKey={1}>
              <CTabList variant="underline-border">
                <CTab aria-controls="home-tab-pane" itemKey={1}>Cek Payment
                  {payment.length !== 0 &&
                    <CBadge color="danger">{payment.length}</CBadge>
                  }
                </CTab>
                <CTab aria-controls="profile-tab-pane" itemKey={2}>Persiapan Packing
                  {packing.length !== 0 &&
                    <CBadge color="danger">{packing.length}</CBadge>
                  }
                </CTab>
                <CTab aria-controls="profile-tab-pane" itemKey={3}>Dalam Pengiriman
                  {onSend.length !== 0 &&
                    <CBadge color="danger">{onSend.length}</CBadge>
                  }
                </CTab>
                <CTab aria-controls="profile-tab-pane" itemKey={4}>Selesai</CTab>
                <CTab aria-controls="contact-tab-pane" itemKey={5}>Batal</CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel className="p-3" aria-labelledby="home-tab-pane" itemKey={1}>
                  <CRow className="p-5">
                    {payment.map((item, index) => {
                      return (
                        File(item, index)
                      )
                    })}
                  </CRow>
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                  <CRow className="p-5">
                    {packing.map((item, index) => {
                      return (
                        File(item, index)
                      )
                    })}
                  </CRow>
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="contact-tab-pane" itemKey={3}>
                  <CRow className="p-5">
                    {onSend.map((item, index) => {
                      return (
                        File(item, index)
                      )
                    })}
                  </CRow>
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="contact-tab-pane" itemKey={4}>
                  <CRow className="p-5">
                    {done.map((item, index) => {
                      return (
                        File(item, index)
                      )
                    })}
                  </CRow>
                </CTabPanel>
                <CTabPanel className="p-3" aria-labelledby="contact-tab-pane" itemKey={5}>
                  <CRow className="p-5">
                    {cancel.map((item, index) => {
                      return (
                        File(item, index)
                      )
                    })}
                  </CRow>
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
