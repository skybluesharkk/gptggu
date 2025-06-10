import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Chat from '../pages/Chat'



const Router = () => {
    return (
        <BrowserRouter>
                <Routes>
                        <Route path="/"  element={<Chat />} />
                </Routes>
        </BrowserRouter>
    )
}

export default Router
