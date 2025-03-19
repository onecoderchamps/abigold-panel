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
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc, where, query, orderBy } from "firebase/firestore";
import { db } from '../../api/firebase';

const database = "users"

const MitraScreen = () => {

    const [kurir, setkurir] = useState([]);
    const [visible, setVisible] = useState(false)
    const [visibleDelete, setvisibleDelete] = useState(false)
    const [komisi, setKomisi] = useState(0);

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
            bonus: 0,
            codeReferal: ''
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
        const q = query(collection(db, database), where("isAgent", "==", true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            dataArray.push({ id: doc.id, ...doc.data() });
        });
        setkurir(dataArray);
        // console.log(dataArray);
    }

    async function readKomisiFirestore(e) {
        const dataArray = [];
        const q = query(collection(db, "order"), where('codeReferal', '==', e.codeReferal), where('isPayedKomisi', '==', false), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            dataArray.push({ id: doc.id, ...doc.data() });
        });
        const totalBiaya = dataArray.reduce((total, current) => total + current.biayaKomisi, 0);
        setKomisi(totalBiaya)
    }

    async function tarikKomisi() {
        const q = query(collection(db, "order"), where('codeReferal', '==', form.codeReferal), where('isPayedKomisi', '==', false), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docs) => {
            const docRef = doc(db, "order", docs.id); // Assuming form.id contains the document ID
            await updateDoc(docRef, {
                isPayedKomisi: true,
            });
        });
        setVisible(false)
        readDataFromFirestore()
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
            title: "Detail Data",
            ...e
        })
        readKomisiFirestore(e)
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

    const approveUpdate = async (e, b) => {
        if (b === "Tolak") {
            try {
                const docRef = doc(db, database, e.id); // Assuming form.id contains the document ID
                await updateDoc(docRef, {
                    needReview: false,
                    isAgent: false
                });
                console.log("Data berhasil ditambahkan");
            } catch (error) {
                console.error("Error menambahkan data: ", error);
            }
        } else {
            try {
                const docRef = doc(db, database, e.id); // Assuming form.id contains the document ID
                await updateDoc(docRef, {
                    isAgent: true
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
                            {/* <CButton color="info" variant="outline" onClick={OpenAddItem}>Tambah</CButton> */}
                            <div className="m-2"></div>
                            <CTable striped align="middle" className="mb-0 border" hover responsive>
                                <CTableHead className="text-nowrap">
                                    <CTableRow>
                                        <CTableHeaderCell className="bg-body-tertiary">#</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-left">
                                            Nama
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-left">ID Mitra</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-left">Kode Referal</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">No Ktp</CTableHeaderCell>
                                        <CTableHeaderCell className="bg-body-tertiary text-center">Permintaan</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {kurir.map((item, index) => (
                                        <CTableRow v-for="item in tableItems" key={index}>
                                            <CTableDataCell className="text-left">
                                                <div className="text-body-secondary">{index + 1}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-left">
                                                <div className="text-body-secondary">{item.fullname}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-left">
                                                <div className="text-body-secondary">{item.uid}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-left">
                                                <div className="text-body-secondary">{item.codeReferal}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <div className="text-body-secondary">{item.nomorKtp}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {item.needReview !== undefined &&
                                                    <>
                                                        {item.needReview !== false &&
                                                            <CButtonGroup role="group">
                                                                <CButton variant="outline" color="danger" onClick={() => approveUpdate(item, 'Tolak')}>Batalkan Mitra</CButton>
                                                                <CButton variant="outline" color="success" onClick={() => OpenUpdateItem(item)}>Lihat Komisi</CButton>
                                                            </CButtonGroup>
                                                        }
                                                    </>
                                                }
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
                        <CForm>
                            <CInputGroup className="mb-3">
                                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                                    Nama Lengkap
                                </CFormLabel>
                                <CFormInput
                                    placeholder="........."
                                    autoComplete="nama"
                                    name="nama"
                                    value={form.namaKtp}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                                    NIK
                                </CFormLabel>
                                <CFormInput
                                    placeholder="........."
                                    autoComplete="nomorNik"
                                    name="nomorNik"
                                    value={form.nomorNik}
                                    onChange={handleChange}
                                    disabled
                                />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                                    Nomor Ponsel
                                </CFormLabel>
                                <CFormInput
                                    placeholder="........."
                                    autoComplete="phonenumber"
                                    name="phonenumber"
                                    value={form.phonenumber}
                                    onChange={handleChange}
                                    disabled
                                />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                                    Komisi
                                </CFormLabel>
                                <CFormInput
                                    placeholder="........."
                                    autoComplete="phonenumber"
                                    name="phonenumber"
                                    value={"Rp " + komisi.toLocaleString("id-ID")}
                                    onChange={handleChange}
                                    disabled
                                />
                            </CInputGroup>
                            <CInputGroup className="mb-3">
                                <CFormLabel htmlFor="staticEmail" className="col-sm-2 col-form-label">
                                    Alamat
                                </CFormLabel>
                                <CFormTextarea
                                    placeholder="........."
                                    autoComplete="alamat"
                                    name="alamat"
                                    id="alamat"
                                    rows={2}
                                    value={form.alamat}
                                    disabled
                                    onChange={handleChange}
                                />
                            </CInputGroup>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                        <CButton color="primary" onClick={tarikKomisi}>Tarik Semua Komisi</CButton>
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

export default MitraScreen
