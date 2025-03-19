import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToaster,
  CToastHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { auth } from "../../../api/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      addToast(exampleToast("berhasil","Berhasil masuk"))
      window.location.href = "/"
    } catch (error) {
      addToast(exampleToast("warning",error.message))
    }
  };

  const exampleToast = (header, error) => {
    return (
      <CToast autohide={false} visible={true}>
        <CToastHeader closeButton>
          <div className="fw-bold me-auto">{header}</div>
        </CToastHeader>
        <CToastBody>{error}</CToastBody>
      </CToast>
    )
  }

return (
  <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCardGroup>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSignUp}>
                  <h1>Login</h1>
                  <p className="text-body-secondary">Sign In to your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4">
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
              <CCardBody className="text-center">
                <div>
                  <h2>Selamat Datang</h2>
                  <p>
                    Silahkan Login untuk masuk ke abipanel
                  </p>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
    <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
  </div>
)
}

export default Login
